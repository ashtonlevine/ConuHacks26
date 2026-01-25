import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SPONSOR_DAILY_RATE_CENTS } from "@/lib/constants";
import { differenceInCalendarDays, parseISO, isValid } from "date-fns";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, contactEmail, startDate, endDate, notes } = body;

    // Validation
    if (!businessName || typeof businessName !== "string" || businessName.trim() === "") {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    if (!contactEmail || typeof contactEmail !== "string") {
      return NextResponse.json(
        { error: "Contact email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    // Parse and validate dates
    const parsedStartDate = parseISO(startDate);
    const parsedEndDate = parseISO(endDate);

    if (!isValid(parsedStartDate) || !isValid(parsedEndDate)) {
      return NextResponse.json(
        { error: "Invalid date format. Please use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Ensure end date is not before start date
    if (parsedEndDate < parsedStartDate) {
      return NextResponse.json(
        { error: "End date must be on or after start date" },
        { status: 400 }
      );
    }

    // Calculate days (inclusive)
    const days = differenceInCalendarDays(parsedEndDate, parsedStartDate) + 1;

    // Calculate total cost
    const dailyRateCents = SPONSOR_DAILY_RATE_CENTS;
    const totalCents = days * dailyRateCents;

    // Insert into database
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("sponsorship_requests")
      .insert({
        business_name: businessName.trim(),
        contact_email: contactEmail.trim().toLowerCase(),
        start_date: startDate,
        end_date: endDate,
        days,
        daily_rate_cents: dailyRateCents,
        total_cents: totalCents,
        notes: notes?.trim() || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating sponsorship request:", error);
      return NextResponse.json(
        { error: "Failed to create sponsorship request" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      requestId: data.id,
      days,
      dailyRateCents,
      totalCents,
      status: data.status,
    });
  } catch (error) {
    console.error("Error in POST /api/sponsorships/request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
