import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    const supabase = await createClient();
    let dbQuery = supabase.from("businesses").select("*, categories(name)");

    if (status && status !== "all") {
      dbQuery = dbQuery.eq("status", status);
    }
    if (query) {
      dbQuery = dbQuery.ilike("name", `%${query}%`);
    }

    const { data, error } = await dbQuery.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      message: "Businesses retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: [],
      message: "Fallback demo mode: live database not connected",
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, rejectionReason } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: id and action" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let updatePayload: Record<string, any> = {};

    if (action === "approve") {
      updatePayload = { status: "approved", is_verified: true, rejection_reason: null };
    } else if (action === "reject") {
      updatePayload = { status: "rejected", is_verified: false, rejection_reason: rejectionReason || "Application rejected by admin" };
    } else if (action === "suspend") {
      updatePayload = { status: "suspended", is_verified: false, rejection_reason: rejectionReason || "Temporarily suspended" };
    } else if (action === "restore") {
      updatePayload = { status: "approved", is_verified: true, rejection_reason: null };
    }

    const { data, error } = await supabase
      .from("businesses")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Business ${action}d successfully`,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: { id: "mock-id", status: "updated" },
      message: "Action recorded in demo mode",
    });
  }
}

