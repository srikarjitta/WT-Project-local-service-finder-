"use server";

import { createClient } from "@/lib/supabase/server";
import {
  businessProfileSchema,
  serviceItemSchema,
  businessHoursSchema,
  enquiryUpdateSchema,
  type BusinessProfileInput,
  type ServiceItemInput,
  type BusinessHoursInput,
} from "@/lib/validations/business";
import { revalidatePath } from "next/cache";
import type { Business, BusinessService, BusinessImage, BusinessHours, Enquiry, Category } from "@/types/database.types";

/**
 * Generate a URL-safe slug from a business name
 */
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${randomSuffix}`;
}

/**
 * Get current authenticated user and profile
 */
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Please sign in to access your business portal.");
  }

  return { supabase, user };
}

/**
 * Get all available categories for the business category dropdown
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return (data as Category[]) || [];
}

/**
 * Fetch the logged-in owner's business profile
 */
export async function getOwnerBusiness(): Promise<{ business: Business | null; error?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error) {
      return { business: null, error: error.message };
    }

    return { business: (data as Business) || null };
  } catch (err: any) {
    return { business: null, error: err.message };
  }
}

/**
 * Create or update the business profile
 */
export async function saveBusinessProfile(
  rawInput: BusinessProfileInput,
  businessId?: string
): Promise<{ success: boolean; business?: Business; error?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const validated = businessProfileSchema.parse(rawInput);

    if (businessId) {
      // Update existing business - verify ownership
      const { data, error } = await supabase
        .from("businesses")
        .update({
          name: validated.name,
          category_id: validated.category_id,
          tagline: validated.tagline || null,
          description: validated.description,
          phone: validated.phone,
          whatsapp: validated.whatsapp || null,
          email: validated.email || null,
          website: validated.website || null,
          address: validated.address,
          locality: validated.locality,
          city: validated.city,
          postal_code: validated.postal_code,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId)
        .eq("owner_id", user.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      revalidatePath("/business");
      revalidatePath("/business/profile");
      return { success: true, business: data as Business };
    } else {
      // Create new business profile (initial status: pending)
      const slug = generateSlug(validated.name);
      const { data, error } = await supabase
        .from("businesses")
        .insert({
          owner_id: user.id,
          name: validated.name,
          slug,
          category_id: validated.category_id,
          tagline: validated.tagline || null,
          description: validated.description,
          phone: validated.phone,
          whatsapp: validated.whatsapp || null,
          email: validated.email || null,
          website: validated.website || null,
          address: validated.address,
          locality: validated.locality,
          city: validated.city,
          postal_code: validated.postal_code,
          status: "pending",
          is_verified: false,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      revalidatePath("/business");
      return { success: true, business: data as Business };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save business profile" };
  }
}

/**
 * Fetch all services for a business
 */
export async function getBusinessServices(businessId: string): Promise<BusinessService[]> {
  const { supabase, user } = await getAuthenticatedUser();

  // Verify business ownership
  const { data: bCheck } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", businessId)
    .eq("owner_id", user.id)
    .single();

  if (!bCheck) return [];

  const { data, error } = await supabase
    .from("business_services")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  return (data as BusinessService[]) || [];
}

/**
 * Add or update a service item
 */
export async function saveBusinessService(
  businessId: string,
  rawInput: ServiceItemInput,
  serviceId?: string
): Promise<{ success: boolean; service?: BusinessService; error?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const validated = serviceItemSchema.parse(rawInput);

    // Verify ownership
    const { data: bCheck } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .single();

    if (!bCheck) throw new Error("Unauthorized: You do not own this business.");

    if (serviceId) {
      const { data, error } = await supabase
        .from("business_services")
        .update({
          name: validated.name,
          description: validated.description || null,
          price_type: validated.price_type,
          price_min: validated.price_min ?? null,
          price_max: validated.price_max ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", serviceId)
        .eq("business_id", businessId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      revalidatePath("/business/services");
      return { success: true, service: data as BusinessService };
    } else {
      const { data, error } = await supabase
        .from("business_services")
        .insert({
          business_id: businessId,
          name: validated.name,
          description: validated.description || null,
          price_type: validated.price_type,
          price_min: validated.price_min ?? null,
          price_max: validated.price_max ?? null,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      revalidatePath("/business/services");
      return { success: true, service: data as BusinessService };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save service" };
  }
}

/**
 * Delete a service item
 */
export async function deleteBusinessService(
  businessId: string,
  serviceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Verify ownership
    const { data: bCheck } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .single();

    if (!bCheck) throw new Error("Unauthorized.");

    const { error } = await supabase
      .from("business_services")
      .delete()
      .eq("id", serviceId)
      .eq("business_id", businessId);

    if (error) throw new Error(error.message);
    revalidatePath("/business/services");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch operating hours for a business
 */
export async function getBusinessHours(businessId: string): Promise<BusinessHours[]> {
  const { supabase } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("business_hours")
    .select("*")
    .eq("business_id", businessId)
    .order("day_of_week", { ascending: true });

  if (error) {
    console.error("Error fetching hours:", error);
    return [];
  }
  return (data as BusinessHours[]) || [];
}

/**
 * Save weekly operating hours
 */
export async function saveBusinessHours(
  businessId: string,
  hours: BusinessHoursInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const validated = businessHoursSchema.parse(hours);

    // Verify ownership
    const { data: bCheck } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .single();

    if (!bCheck) throw new Error("Unauthorized.");

    // Delete existing hours and re-insert the 7 days
    await supabase.from("business_hours").delete().eq("business_id", businessId);

    const rows = validated.map((h) => ({
      business_id: businessId,
      day_of_week: h.day_of_week,
      open_time: h.open_time,
      close_time: h.close_time,
      is_closed: h.is_closed,
    }));

    const { error } = await supabase.from("business_hours").insert(rows);
    if (error) throw new Error(error.message);

    revalidatePath("/business/hours");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch gallery images for a business
 */
export async function getBusinessImages(businessId: string): Promise<BusinessImage[]> {
  const { supabase } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("business_images")
    .select("*")
    .eq("business_id", businessId)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching images:", error);
    return [];
  }
  return (data as BusinessImage[]) || [];
}

/**
 * Save a business image record (after upload to Supabase Storage)
 */
export async function saveBusinessImage(
  businessId: string,
  storagePath: string,
  publicUrl: string,
  caption?: string,
  isCover: boolean = false
): Promise<{ success: boolean; image?: BusinessImage; error?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Verify ownership
    const { data: bCheck } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .single();

    if (!bCheck) throw new Error("Unauthorized.");

    // If marked as cover, un-cover all others
    if (isCover) {
      await supabase
        .from("business_images")
        .update({ is_cover: false })
        .eq("business_id", businessId);
    }

    const { data, error } = await supabase
      .from("business_images")
      .insert({
        business_id: businessId,
        storage_path: storagePath,
        url: publicUrl,
        caption: caption || null,
        is_cover: isCover,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidatePath("/business/photos");
    return { success: true, image: data as BusinessImage };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete a business image
 */
export async function deleteBusinessImage(
  businessId: string,
  imageId: string,
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data: bCheck } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .single();

    if (!bCheck) throw new Error("Unauthorized.");

    // Remove from storage bucket
    await supabase.storage.from("business-images").remove([storagePath]);

    // Remove from database
    const { error } = await supabase
      .from("business_images")
      .delete()
      .eq("id", imageId)
      .eq("business_id", businessId);

    if (error) throw new Error(error.message);
    revalidatePath("/business/photos");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Set an image as the primary cover photo
 */
export async function setCoverBusinessImage(
  businessId: string,
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data: bCheck } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .single();

    if (!bCheck) throw new Error("Unauthorized.");

    // Unset all covers for this business
    await supabase
      .from("business_images")
      .update({ is_cover: false })
      .eq("business_id", businessId);

    // Set target image as cover
    const { error } = await supabase
      .from("business_images")
      .update({ is_cover: true })
      .eq("id", imageId)
      .eq("business_id", businessId);

    if (error) throw new Error(error.message);
    revalidatePath("/business/photos");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch enquiries received for a business with optional status filter
 */
export async function getBusinessEnquiries(
  businessId: string,
  statusFilter?: string
): Promise<Enquiry[]> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data: bCheck } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", businessId)
    .eq("owner_id", user.id)
    .single();

  if (!bCheck) return [];

  let query = supabase
    .from("enquiries")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching enquiries:", error);
    return [];
  }
  return (data as Enquiry[]) || [];
}

/**
 * Update enquiry lifecycle status and notes
 */
export async function updateEnquiryStatus(
  businessId: string,
  enquiryId: string,
  status: "new" | "in_progress" | "responded" | "closed",
  ownerNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Verify ownership
    const { data: bCheck } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("owner_id", user.id)
      .single();

    if (!bCheck) throw new Error("Unauthorized.");

    const validated = enquiryUpdateSchema.parse({
      status,
      owner_notes: ownerNotes,
    });

    const { error } = await supabase
      .from("enquiries")
      .update({
        status: validated.status,
        owner_notes: validated.owner_notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", enquiryId)
      .eq("business_id", businessId);

    if (error) throw new Error(error.message);
    revalidatePath("/business/enquiries");
    revalidatePath("/business");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Get aggregated business owner dashboard metrics
 */
export async function getBusinessDashboardMetrics(businessId: string) {
  const { supabase } = await getAuthenticatedUser();

  // 1. Total enquiries count
  const { count: totalEnquiries } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  // 2. New enquiries count
  const { count: newEnquiries } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .eq("status", "new");

  // 3. Total services count
  const { count: totalServices } = await supabase
    .from("business_services")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  // 4. Reviews aggregate
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("business_id", businessId)
    .eq("status", "published");

  const totalReviews = reviews?.length || 0;
  const avgRating = totalReviews > 0
    ? (reviews!.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return {
    totalEnquiries: totalEnquiries || 0,
    newEnquiries: newEnquiries || 0,
    totalServices: totalServices || 0,
    totalReviews,
    avgRating,
  };
}
