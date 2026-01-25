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
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching goals:", error);
      return NextResponse.json(
        { error: "Failed to fetch goals" },
        { status: 500 }
      );
    }

    return NextResponse.json({ goals: data || [] });
  } catch (error) {
    console.error("Error in GET /api/goals:", error);
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
    const { name, target_amount, current_amount, target_date, category } = body;

    if (!name || !target_amount) {
      return NextResponse.json(
        { error: "Name and target amount are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: userId,
        name,
        target_amount,
        current_amount: current_amount || 0,
        target_date: target_date || null,
        category: category || 'general',
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating goal:", error);
      return NextResponse.json(
        { error: "Failed to create goal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ goal: data });
  } catch (error) {
    console.error("Error in POST /api/goals:", error);
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
    const { id, name, target_amount, current_amount, target_date, category } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Goal ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (target_amount !== undefined) updateData.target_amount = target_amount;
    if (current_amount !== undefined) updateData.current_amount = current_amount;
    if (target_date !== undefined) updateData.target_date = target_date;
    if (category !== undefined) updateData.category = category;

    const { data, error } = await supabase
      .from("goals")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId) // Ensure user owns the goal
      .select()
      .single();

    if (error) {
      console.error("Error updating goal:", error);
      return NextResponse.json(
        { error: "Failed to update goal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ goal: data });
  } catch (error) {
    console.error("Error in PATCH /api/goals:", error);
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
        { error: "Goal ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", id)
      .eq("user_id", userId); // Ensure user owns the goal

    if (error) {
      console.error("Error deleting goal:", error);
      return NextResponse.json(
        { error: "Failed to delete goal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/goals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
