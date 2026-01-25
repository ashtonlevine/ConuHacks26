import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch user's saved deals
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
      .from("user_saved_deals")
      .select(`
        id,
        deal_id,
        saved_at,
        deals (
          id,
          name,
          description,
          category,
          distance,
          hours,
          rating,
          is_sponsored
        )
      `)
      .eq("user_id", userId)
      .order("saved_at", { ascending: false });

    if (error) {
      console.error("Error fetching saved deals:", error);
      return NextResponse.json(
        { error: "Failed to fetch saved deals" },
        { status: 500 }
      );
    }

    return NextResponse.json({ savedDeals: data || [] });
  } catch (error) {
    console.error("Error in GET /api/deals/saved:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Save a deal
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
    const { deal_id } = body;

    if (!deal_id) {
      return NextResponse.json(
        { error: "Deal ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("user_saved_deals")
      .insert({
        user_id: userId,
        deal_id,
      })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (already saved)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Deal already saved" },
          { status: 409 }
        );
      }
      console.error("Error saving deal:", error);
      return NextResponse.json(
        { error: "Failed to save deal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ savedDeal: data });
  } catch (error) {
    console.error("Error in POST /api/deals/saved:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Unsave a deal
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
    const dealId = searchParams.get("deal_id");

    if (!dealId) {
      return NextResponse.json(
        { error: "Deal ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from("user_saved_deals")
      .delete()
      .eq("user_id", userId)
      .eq("deal_id", dealId);

    if (error) {
      console.error("Error unsaving deal:", error);
      return NextResponse.json(
        { error: "Failed to unsave deal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/deals/saved:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
