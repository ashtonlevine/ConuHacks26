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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'income' or 'expense'
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = searchParams.get("limit");

    const supabase = await createClient();
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("transaction_date", { ascending: false });

    // Apply filters
    if (type) {
      query = query.eq("type", type);
    }
    if (category) {
      query = query.eq("category", category);
    }
    if (startDate) {
      query = query.gte("transaction_date", startDate);
    }
    if (endDate) {
      query = query.lte("transaction_date", endDate);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching transactions:", error);
      return NextResponse.json(
        { error: "Failed to fetch transactions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ transactions: data || [] });
  } catch (error) {
    console.error("Error in GET /api/transactions:", error);
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
    const { amount, type, category, description, merchant_name, transaction_date } = body;

    // Validation
    if (!amount || !type || !category || !transaction_date) {
      return NextResponse.json(
        { error: "Amount, type, category, and transaction_date are required" },
        { status: 400 }
      );
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'income' or 'expense'" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        amount,
        type,
        category,
        description: description || null,
        merchant_name: merchant_name || null,
        transaction_date,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating transaction:", error);
      return NextResponse.json(
        { error: "Failed to create transaction" },
        { status: 500 }
      );
    }

    return NextResponse.json({ transaction: data });
  } catch (error) {
    console.error("Error in POST /api/transactions:", error);
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
    const { id, amount, type, category, description, merchant_name, transaction_date } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    if (type && !['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'income' or 'expense'" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (amount !== undefined) updateData.amount = amount;
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (merchant_name !== undefined) updateData.merchant_name = merchant_name;
    if (transaction_date !== undefined) updateData.transaction_date = transaction_date;

    const { data, error } = await supabase
      .from("transactions")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId) // Ensure user owns the transaction
      .select()
      .single();

    if (error) {
      console.error("Error updating transaction:", error);
      return NextResponse.json(
        { error: "Failed to update transaction" },
        { status: 500 }
      );
    }

    return NextResponse.json({ transaction: data });
  } catch (error) {
    console.error("Error in PATCH /api/transactions:", error);
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
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId); // Ensure user owns the transaction

    if (error) {
      console.error("Error deleting transaction:", error);
      return NextResponse.json(
        { error: "Failed to delete transaction" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
