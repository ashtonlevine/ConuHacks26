import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    
    // Get date range from query params or default to current month
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    
    const now = new Date();
    const startDate = startDateParam || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = endDateParam || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    // Fetch all transactions for the user (for lifetime totals)
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

    // Fetch transactions for the specified period
    const { data: periodTransactions, error: periodError } = await supabase
      .from("transactions")
      .select("amount, type, category")
      .eq("user_id", userId)
      .gte("transaction_date", startDate)
      .lte("transaction_date", endDate);

    if (periodError) {
      console.error("Error fetching period transactions:", periodError);
      return NextResponse.json(
        { error: "Failed to fetch period transactions" },
        { status: 500 }
      );
    }

    // Calculate lifetime totals
    const totalIncome = (allTransactions || [])
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalExpenses = (allTransactions || [])
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate period totals
    const periodIncome = (periodTransactions || [])
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const periodExpenses = (periodTransactions || [])
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate spending by category for the period
    const categoryBreakdown: Record<string, number> = {};
    (periodTransactions || [])
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Number(t.amount);
      });

    return NextResponse.json({
      summary: {
        balance: totalIncome - totalExpenses,
        totalIncome,
        totalExpenses,
        // Keep monthlyIncome/monthlyExpenses for backward compatibility
        monthlyIncome: periodIncome,
        monthlyExpenses: periodExpenses,
        // Also provide period-specific names
        periodIncome,
        periodExpenses,
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
