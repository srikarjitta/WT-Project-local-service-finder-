import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { businessProfileSchema } from "@/lib/validations/business";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data: business, error } = await supabase
      .from("businesses")
      .select("*, categories(name, slug)")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: business });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = businessProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: validated.error.flatten() },
        { status: 400 }
      );
    }

    const slug = `${validated.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;

    const { data: business, error } = await supabase
      .from("businesses")
      .insert({
        owner_id: user.id,
        name: validated.data.name,
        slug,
        category_id: validated.data.category_id,
        tagline: validated.data.tagline || null,
        description: validated.data.description,
        phone: validated.data.phone,
        whatsapp: validated.data.whatsapp || null,
        email: validated.data.email || null,
        website: validated.data.website || null,
        address: validated.data.address,
        locality: validated.data.locality,
        city: validated.data.city,
        postal_code: validated.data.postal_code,
        status: "pending",
        is_verified: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: business, message: "Business profile created" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
