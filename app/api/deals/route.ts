import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

// Hardcoded deals as fallback when database is empty
const FALLBACK_DEALS = [
  { id: "1", name: "Campus Grill", description: "$5 Student Lunch Special", category: "American", distance: "0.2 mi", hours: "11am-3pm", is_sponsored: true, rating: 4.5 },
  { id: "2", name: "Pho House", description: "15% off with student ID", category: "Vietnamese", distance: "0.3 mi", hours: "10am-9pm", is_sponsored: false, rating: 4.7 },
  { id: "3", name: "Pizza Palace", description: "$8 Large Pizza Mondays", category: "Italian", distance: "0.1 mi", hours: "11am-11pm", is_sponsored: true, rating: 4.2 },
  { id: "4", name: "Burrito Bros", description: "Free chips with any burrito", category: "Mexican", distance: "0.4 mi", hours: "10am-10pm", is_sponsored: false, rating: 4.4 },
  { id: "5", name: "Sushi Station", description: "$12 All-You-Can-Eat Tuesdays", category: "Japanese", distance: "0.5 mi", hours: "11:30am-9pm", is_sponsored: true, rating: 4.6 },
  { id: "6", name: "The Daily Grind", description: "$2 Coffee before 9am", category: "Cafe", distance: "0.1 mi", hours: "6am-8pm", is_sponsored: false, rating: 4.8 },
  { id: "7", name: "Wok & Roll", description: "10% student discount", category: "Chinese", distance: "0.3 mi", hours: "11am-10pm", is_sponsored: false, rating: 4.3 },
  { id: "8", name: "Falafel King", description: "$6 Falafel Wrap Combo", category: "Mediterranean", distance: "0.2 mi", hours: "11am-9pm", is_sponsored: true, rating: 4.5 },
  { id: "9", name: "Bagel Barn", description: "BOGO Bagels Thursdays", category: "Bakery", distance: "0.2 mi", hours: "7am-4pm", is_sponsored: false, rating: 4.6 },
  { id: "10", name: "Thai Orchid", description: "$9 Pad Thai Lunch", category: "Thai", distance: "0.4 mi", hours: "11am-9:30pm", is_sponsored: false, rating: 4.7 },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const supabase = await createClient();
    let query = supabase
      .from("deals")
      .select("*")
      .order("is_sponsored", { ascending: false })
      .order("rating", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching deals:", error);
      // Return fallback deals if database is not set up
      return NextResponse.json({ deals: FALLBACK_DEALS, source: "fallback" });
    }

    // If no deals in database, return fallback
    if (!data || data.length === 0) {
      return NextResponse.json({ deals: FALLBACK_DEALS, source: "fallback" });
    }

    return NextResponse.json({ deals: data, source: "database" });
  } catch (error) {
    console.error("Error in GET /api/deals:", error);
    return NextResponse.json({ deals: FALLBACK_DEALS, source: "fallback" });
  }
}
