import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

// Simple in-memory rate limiter (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }
  
  userLimit.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - userLimit.count };
}

// Budget category labels for display
const BUDGET_CATEGORIES: Record<string, string> = {
  restaurant_expenses: "Restaurants",
  gas: "Gas",
  grocery_shopping: "Groceries",
  leisure: "Leisure",
  school_fees: "School Fees",
  rent: "Rent",
  other: "Other",
};

// Types for user data
interface Budget {
  restaurant_expenses: number;
  gas: number;
  grocery_shopping: number;
  leisure: number;
  school_fees: number;
  rent: number;
  other: number;
}

interface Goal {
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  category: string;
}

interface RecurringExpense {
  name: string;
  amount: number;
  frequency: string;
  next_due_date: string;
  category: string | null;
}

interface Transaction {
  amount: number;
  type: "income" | "expense";
  category: string;
}

interface UserFinancialData {
  budget: Budget | null;
  goals: Goal[];
  recurringExpenses: RecurringExpense[];
  transactions: Transaction[];
}

// Fetch all user financial data from Supabase
async function fetchUserData(userId: string): Promise<UserFinancialData> {
  const supabase = await createClient();
  
  // Fetch all data in parallel for performance
  const [budgetRes, goalsRes, recurringRes, transactionsRes] = await Promise.all([
    supabase.from("budgets").select("*").eq("user_id", userId).single(),
    supabase.from("goals").select("name, target_amount, current_amount, target_date, category").eq("user_id", userId),
    supabase.from("recurring_expenses").select("name, amount, frequency, next_due_date, category").eq("user_id", userId),
    supabase.from("transactions").select("amount, type, category").eq("user_id", userId),
  ]);

  return {
    budget: budgetRes.data || null,
    goals: goalsRes.data || [],
    recurringExpenses: recurringRes.data || [],
    transactions: transactionsRes.data || [],
  };
}

// Calculate financial summary from transactions
function calculateSummary(transactions: Transaction[]) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  // For monthly calculations, we'd need transaction dates, but we'll estimate
  // based on total transactions for now
  const balance = totalIncome - totalExpenses;
  
  // Calculate spending by category
  const categoryBreakdown: Record<string, number> = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Number(t.amount);
    });

  return {
    balance,
    totalIncome,
    totalExpenses,
    categoryBreakdown,
  };
}

// Build dynamic user context for the AI
function buildUserContext(data: UserFinancialData): string {
  const summary = calculateSummary(data.transactions);
  
  // Format currency
  const fmt = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  let context = `
=== USER'S CURRENT FINANCIAL DATA ===

ACCOUNT OVERVIEW:
- Current Balance: ${fmt(summary.balance)}
- Total Income (all time): ${fmt(summary.totalIncome)}
- Total Expenses (all time): ${fmt(summary.totalExpenses)}
`;

  // Budget section
  if (data.budget) {
    const budgetKeys = Object.keys(BUDGET_CATEGORIES) as (keyof Budget)[];
    const totalBudget = budgetKeys.reduce((sum, key) => sum + (data.budget?.[key] || 0), 0);
    const availableToSpend = summary.totalIncome > 0 ? summary.balance : totalBudget - summary.totalExpenses;
    
    context += `
MONTHLY BUDGET (limits you've set):
`;
    budgetKeys.forEach(key => {
      const amount = data.budget?.[key] || 0;
      if (amount > 0) {
        const spent = summary.categoryBreakdown[key] || 0;
        const remaining = amount - spent;
        context += `- ${BUDGET_CATEGORIES[key]}: ${fmt(amount)} budget, ${fmt(spent)} spent, ${fmt(remaining)} remaining\n`;
      }
    });
    
    context += `- Total Monthly Budget: ${fmt(totalBudget)}
- Available to Spend: ${fmt(availableToSpend)} (money left after expenses)
`;
  } else {
    context += `
BUDGET: Not set up yet. The user should set up their budget to track spending.
`;
  }

  // Goals section
  if (data.goals.length > 0) {
    context += `
SAVINGS GOALS:
`;
    data.goals.forEach(goal => {
      const progress = goal.target_amount > 0 
        ? ((goal.current_amount / goal.target_amount) * 100).toFixed(1)
        : "0";
      const remaining = goal.target_amount - goal.current_amount;
      
      context += `- "${goal.name}" (${goal.category}): ${fmt(goal.current_amount)} saved of ${fmt(goal.target_amount)} (${progress}% complete, ${fmt(remaining)} to go)`;
      
      if (goal.target_date) {
        const targetDate = new Date(goal.target_date);
        const today = new Date();
        const monthsRemaining = Math.max(
          (targetDate.getFullYear() - today.getFullYear()) * 12 +
            (targetDate.getMonth() - today.getMonth()),
          1
        );
        const monthlyNeeded = remaining / monthsRemaining;
        context += ` | Target: ${targetDate.toLocaleDateString()} (${monthsRemaining} months, need ${fmt(monthlyNeeded)}/month)`;
      }
      context += `\n`;
    });
  } else {
    context += `
SAVINGS GOALS: None set up yet. Encourage the user to create savings goals.
`;
  }

  // Recurring expenses section
  if (data.recurringExpenses.length > 0) {
    context += `
UPCOMING RECURRING BILLS:
`;
    data.recurringExpenses.forEach(expense => {
      const dueDate = new Date(expense.next_due_date);
      context += `- ${expense.name}: ${fmt(expense.amount)} (${expense.frequency}) - due ${dueDate.toLocaleDateString()}\n`;
    });
    
    const totalMonthlyRecurring = data.recurringExpenses
      .filter(e => e.frequency === "monthly")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    
    if (totalMonthlyRecurring > 0) {
      context += `- Total Monthly Recurring: ${fmt(totalMonthlyRecurring)}\n`;
    }
  } else {
    context += `
RECURRING BILLS: None tracked yet.
`;
  }

  // Spending breakdown
  if (Object.keys(summary.categoryBreakdown).length > 0) {
    context += `
SPENDING BY CATEGORY (all time):
`;
    Object.entries(summary.categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, amount]) => {
        const label = BUDGET_CATEGORIES[category] || category;
        context += `- ${label}: ${fmt(amount)}\n`;
      });
  }

  return context;
}

// Build the system instruction with user context
function buildSystemInstruction(userContext: string): string {
  return `You are StudentPenny, an AI financial assistant for students. You have access to the user's real financial data shown below.

${userContext}

=== RESPONSE GUIDELINES ===

STRICT RESPONSE FORMAT for any advice (affordability, savings, budgeting, goals, etc.):

1. **Direct Answer** — Start with Yes / No / Maybe and a one-line summary using their actual numbers.

2. **Why (1–2 sentences max)** — Brief explanation referencing their specific data. Use actual dollar amounts from their data.

3. **Steps** — Provide 3-5 actionable steps. Each step must be:
   - One short line (no sub-bullets)
   - A concrete action they can take
   - Personalized to their situation when possible

**Rules:**
- USE their actual numbers in your responses (balance, budget amounts, goal progress, etc.)
- Reference specific categories where they're overspending or underspending
- For goals, calculate and mention specific monthly savings targets
- If they ask about affordability, compare against their "Available to Spend" amount or balance
- Mention upcoming bills if relevant to their question
- Keep language simple, direct, and student-friendly
- No investing advice, loan advice, or financial product recommendations
- Do NOT say you don't have access to their data — you DO have it above

**App Features you can reference:**
- Budget section: where they set monthly limits by category
- Savings Goals: where they track progress toward specific targets
- Deals: student discounts and offers they can use
- Transactions: where they log income and expenses
- Recurring Expenses: bills that repeat monthly/yearly

**Example response for "Can I afford a $200 purchase?":**

Maybe. With a balance of $1,234.56 and $450 in upcoming bills this month, you have limited flexibility.

1. Your "Available to Spend" is $284 this month.

2. Consider saving $50/month toward this purchase instead.

3. Check the Deals section for discounts on similar items.

4. Review your Leisure spending ($89 this month) for potential cuts.

5. Set a savings goal to track your progress.
`;
}

export async function POST(request: Request) {
  // Authentication check
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to use the AI assistant." },
      { status: 401 }
    );
  }

  // Rate limiting check
  const rateLimit = checkRateLimit(userId);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured. Add it to .env.local." },
      { status: 500 }
    );
  }

  let body: { message?: string; messages?: { role: "user" | "assistant"; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expected { message: string } or { messages: [...] }." },
      { status: 400 }
    );
  }

  const messages = body.messages ?? (body.message ? [{ role: "user" as const, content: body.message }] : null);
  if (!messages?.length) {
    return NextResponse.json(
      { error: "Provide 'message' or 'messages' in the request body." },
      { status: 400 }
    );
  }

  const contents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    // Fetch user's financial data
    const userData = await fetchUserData(userId);
    
    // Build personalized context
    const userContext = buildUserContext(userData);
    
    // Build system instruction with user's data
    const systemInstruction = buildSystemInstruction(userContext);

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { systemInstruction },
    });

    const text = response.text ?? "";
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini API request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
