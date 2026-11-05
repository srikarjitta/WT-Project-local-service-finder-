"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Seed realistic sample business data for demonstration and testing purposes
 */
export async function seedDemoBusinessData(userId?: string) {
  try {
    const supabase = await createClient();

    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: "Please sign in or provide a user ID to seed demo data." };
      }
      targetUserId = user.id;
    }

    // 1. Get or create a category
    const { data: existingCat } = await supabase
      .from("categories")
      .select("id")
      .limit(1)
      .maybeSingle();

    let categoryId = existingCat?.id;
    if (!categoryId) {
      const { data: newCat } = await supabase
        .from("categories")
        .insert({
          name: "Home Services",
          slug: "home-services-demo",
          description: "Plumbing, electrical, and repairs",
          icon: "Wrench",
        })
        .select("id")
        .single();
      categoryId = newCat?.id;
    }

    if (!categoryId) {
      return { success: false, error: "Could not find or create a category." };
    }

    // 2. Insert or update sample business profile
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .upsert(
        {
          owner_id: targetUserId,
          category_id: categoryId,
          name: "Apex Home Care & Electricals",
          slug: `apex-home-care-${targetUserId.substring(0, 6)}`,
          tagline: "Certified electricians & home plumbing specialists since 2018",
          description:
            "Apex Home Care provides reliable, same-day electrical and home repair services. We handle residential wiring, circuit breakers, emergency repairs, and full bathroom plumbing installations with verified warranty.",
          phone: "+91 98450 12345",
          whatsapp: "+91 98450 12345",
          email: "support@apexhomecare.in",
          website: "https://apexhomecare.in",
          address: "#42, 100ft Ring Road, Near Metro Pillar 140",
          locality: "Indiranagar",
          city: "Bengaluru",
          postal_code: "560038",
          status: "approved",
          is_verified: true,
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (bizError) throw new Error(bizError.message);
    const businessId = business.id;

    // 3. Insert sample services
    await supabase.from("business_services").delete().eq("business_id", businessId);
    await supabase.from("business_services").insert([
      {
        business_id: businessId,
        name: "Full Home Electrical Safety Inspection",
        description: "Comprehensive check of wiring, grounding, fuse boards, and load distribution.",
        price_type: "fixed",
        price_min: 799,
      },
      {
        business_id: businessId,
        name: "Ceiling Fan & Chandelier Installation",
        description: "Secure mounting and wiring for high-ceiling fans and modern chandeliers.",
        price_type: "range",
        price_min: 350,
        price_max: 850,
      },
      {
        business_id: businessId,
        name: "Complete Bathroom Plumbing Rewire",
        description: "Concealed pipe fitting, leak isolation, and sanitaryware installation.",
        price_type: "contact",
      },
      {
        business_id: businessId,
        name: "Emergency Power Outage & Short-Circuit Fix",
        description: "24/7 priority emergency dispatch within 45 minutes for tripped breakers.",
        price_type: "fixed",
        price_min: 1200,
      },
    ]);

    // 4. Insert sample operating hours (Mon-Sat 8:30am - 8:00pm, Sun closed)
    await supabase.from("business_hours").delete().eq("business_id", businessId);
    await supabase.from("business_hours").insert([
      { business_id: businessId, day_of_week: 1, open_time: "08:30", close_time: "20:00", is_closed: false },
      { business_id: businessId, day_of_week: 2, open_time: "08:30", close_time: "20:00", is_closed: false },
      { business_id: businessId, day_of_week: 3, open_time: "08:30", close_time: "20:00", is_closed: false },
      { business_id: businessId, day_of_week: 4, open_time: "08:30", close_time: "20:00", is_closed: false },
      { business_id: businessId, day_of_week: 5, open_time: "08:30", close_time: "20:00", is_closed: false },
      { business_id: businessId, day_of_week: 6, open_time: "09:00", close_time: "18:00", is_closed: false },
      { business_id: businessId, day_of_week: 0, open_time: "00:00", close_time: "00:00", is_closed: true },
    ]);

    // 5. Insert sample customer enquiries
    await supabase.from("enquiries").delete().eq("business_id", businessId);
    await supabase.from("enquiries").insert([
      {
        business_id: businessId,
        customer_name: "Rahul Sharma",
        customer_phone: "+91 99001 22334",
        customer_email: "rahul.sharma@gmail.com",
        message: "Need urgent inspection of main MCB board in 3BHK flat. Circuit trips whenever AC turns on.",
        status: "new",
      },
      {
        business_id: businessId,
        customer_name: "Priya Venkatesh",
        customer_phone: "+91 98860 55443",
        customer_email: "priya.v@outlook.com",
        message: "Looking for quote to install 4 decorative pendant lights and 2 BLDC ceiling fans in new apartment.",
        status: "in_progress",
        owner_notes: "Spoke to customer. Visit scheduled for Saturday 11am.",
      },
      {
        business_id: businessId,
        customer_name: "Anand Kulkarni",
        customer_phone: "+91 97410 88990",
        customer_email: "anand.k@company.com",
        message: "Can you provide commercial electrical maintenance contract for a small 15-seater office space?",
        status: "responded",
        owner_notes: "Sent AMC quote via email. Waiting for approval.",
      },
      {
        business_id: businessId,
        customer_name: "Sneha Nair",
        customer_phone: "+91 96112 33445",
        customer_email: "sneha.n@gmail.com",
        message: "Thank you for the quick water heater installation yesterday!",
        status: "closed",
        owner_notes: "Job completed and payment received.",
      },
    ]);

    revalidatePath("/business");
    revalidatePath("/business/profile");
    revalidatePath("/business/services");
    revalidatePath("/business/hours");
    revalidatePath("/business/enquiries");

    return { success: true, businessId };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
