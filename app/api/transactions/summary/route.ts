import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    
    // Get current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    // Fetch all transactions for the user
    const { data: allTransactions, error: allError } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", userId);

    if (allError) {
      console.error("Error fetching all transactions:", allError);
      return NextResponse.json(
        { error: "Failed to fetch transactions" },
        { status: 500 }
      );
    }

    // Fetch this month's transactions
    const { data: monthTransactions, error: monthError } = await supabase
      .from("transactions")
      .select("amount, type, category")
      .eq("user_id", userId)
      .gte("transaction_date", startOfMonth)
      .lte("transaction_date", endOfMonth);

    if (monthError) {
      console.error("Error fetching monthly transactions:", monthError);
      return NextResponse.json(
        { error: "Failed to fetch monthly transactions" },
        { status: 500 }
      );
    }

    // Calculate totals
    const totalIncome = (allTransactions || [])
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalExpenses = (allTransactions || [])
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const monthlyIncome = (monthTransactions || [])
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const monthlyExpenses = (monthTransactions || [])
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate spending by category for this month
    const categoryBreakdown: Record<string, number> = {};
    (monthTransactions || [])
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Number(t.amount);
      });

    return NextResponse.json({
      summary: {
        balance: totalIncome - totalExpenses,
        totalIncome,
        totalExpenses,
        monthlyIncome,
        monthlyExpenses,
        categoryBreakdown,
      }
    });
  } catch (error) {
    console.error("Error in GET /api/transactions/summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
