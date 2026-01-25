import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

// Calculate next due date based on due_day and frequency
function calculateNextDueDate(dueDay: number, frequency: string): string {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  let nextDue: Date;
  
  if (frequency === 'monthly') {
    if (currentDay <= dueDay) {
      nextDue = new Date(currentYear, currentMonth, dueDay);
    } else {
      nextDue = new Date(currentYear, currentMonth + 1, dueDay);
    }
  } else if (frequency === 'semester') {
    // Assuming semesters are Jan and Sep
    const semesterMonths = [0, 8]; // January and September
    const nextSemester = semesterMonths.find(m => m > currentMonth) ?? semesterMonths[0];
    const year = nextSemester <= currentMonth ? currentYear + 1 : currentYear;
    nextDue = new Date(year, nextSemester, dueDay);
  } else {
    // Yearly
    if (currentMonth === 0 && currentDay <= dueDay) {
      nextDue = new Date(currentYear, 0, dueDay);
    } else {
      nextDue = new Date(currentYear + 1, 0, dueDay);
    }
  }
  
  return nextDue.toISOString().split('T')[0];
}

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
    const { data, error } = await supabase
      .from("recurring_expenses")
      .select("*")
      .eq("user_id", userId)
      .order("next_due_date", { ascending: true });

    if (error) {
      console.error("Error fetching recurring expenses:", error);
      return NextResponse.json(
        { error: "Failed to fetch recurring expenses" },
        { status: 500 }
      );
    }

    return NextResponse.json({ recurringExpenses: data || [] });
  } catch (error) {
    console.error("Error in GET /api/recurring:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, amount, due_day, frequency, category } = body;

    if (!name || !amount || !due_day || !frequency) {
      return NextResponse.json(
        { error: "Name, amount, due_day, and frequency are required" },
        { status: 400 }
      );
    }

    if (!['monthly', 'semester', 'yearly'].includes(frequency)) {
      return NextResponse.json(
        { error: "Frequency must be 'monthly', 'semester', or 'yearly'" },
        { status: 400 }
      );
    }

    if (due_day < 1 || due_day > 31) {
      return NextResponse.json(
        { error: "Due day must be between 1 and 31" },
        { status: 400 }
      );
    }

    const next_due_date = calculateNextDueDate(due_day, frequency);

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("recurring_expenses")
      .insert({
        user_id: userId,
        name,
        amount,
        due_day,
        frequency,
        category: category || null,
        next_due_date,
        is_paid: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating recurring expense:", error);
      return NextResponse.json(
        { error: "Failed to create recurring expense" },
        { status: 500 }
      );
    }

    return NextResponse.json({ recurringExpense: data });
  } catch (error) {
    console.error("Error in POST /api/recurring:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, amount, due_day, frequency, category, is_paid } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (amount !== undefined) updateData.amount = amount;
    if (due_day !== undefined) updateData.due_day = due_day;
    if (frequency !== undefined) updateData.frequency = frequency;
    if (category !== undefined) updateData.category = category;
    if (is_paid !== undefined) updateData.is_paid = is_paid;
    
    // Recalculate next due date if due_day or frequency changed
    if (due_day !== undefined || frequency !== undefined) {
      // Fetch current values if not provided
      const { data: current } = await supabase
        .from("recurring_expenses")
        .select("due_day, frequency")
        .eq("id", id)
        .eq("user_id", userId)
        .single();
      
      if (current) {
        const newDueDay = due_day ?? current.due_day;
        const newFrequency = frequency ?? current.frequency;
        updateData.next_due_date = calculateNextDueDate(newDueDay, newFrequency);
      }
    }

    const { data, error } = await supabase
      .from("recurring_expenses")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating recurring expense:", error);
      return NextResponse.json(
        { error: "Failed to update recurring expense" },
        { status: 500 }
      );
    }

    return NextResponse.json({ recurringExpense: data });
  } catch (error) {
    console.error("Error in PATCH /api/recurring:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from("recurring_expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting recurring expense:", error);
      return NextResponse.json(
        { error: "Failed to delete recurring expense" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/recurring:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
