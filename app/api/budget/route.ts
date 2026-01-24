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
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" - that's okay for new users
      console.error("Error fetching budget:", error);
      return NextResponse.json(
        { error: "Failed to fetch budget" },
        { status: 500 }
      );
    }

    return NextResponse.json({ budget: data || null });
  } catch (error) {
    console.error("Error in GET /api/budget:", error);
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
    const { restaurant_expenses, gas, grocery_shopping, leisure, school_fees } = body;

    const supabase = await createClient();
    
    // Upsert: insert if not exists, update if exists
    const { data, error } = await supabase
      .from("budgets")
      .upsert(
        {
          user_id: userId,
          restaurant_expenses: restaurant_expenses || 0,
          gas: gas || 0,
          grocery_shopping: grocery_shopping || 0,
          leisure: leisure || 0,
          school_fees: school_fees || 0,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving budget:", error);
      return NextResponse.json(
        { error: "Failed to save budget" },
        { status: 500 }
      );
    }

    return NextResponse.json({ budget: data });
  } catch (error) {
    console.error("Error in POST /api/budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
