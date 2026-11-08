"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  UserRole,
  BusinessApprovalStatus,
  BusinessVerificationStatus,
  ReviewStatus,
  ReportStatus,
} from "@/types/database.types";

export type AdminAuthResult =
  | {
      authorized: true;
      error: null;
      user: NonNullable<
        Awaited<
          ReturnType<
            Awaited<ReturnType<typeof createClient>>["auth"]["getUser"]
          >
        >["data"]["user"]
      >;
      profile: {
        id: string;
        full_name: string | null;
        role: UserRole;
        phone: string | null;
        avatar_url: string | null;
      };
      supabase: Awaited<ReturnType<typeof createClient>>;
    }
  | {
      authorized: false;
      error: string;
      user: any;
      profile: null;
      supabase?: undefined;
    };

/**
 * Server-side security barrier: Validates current session and confirms admin role in PostgreSQL.
 */
export async function verifyAdmin(): Promise<AdminAuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false, error: "Unauthenticated: No active session", user: null, profile: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role, phone, avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return { authorized: false, error: "Access Denied: Admin role required", user, profile: null };
  }

  return { authorized: true, error: null, user, profile, supabase };
}

/**
 * Fetch high-level platform statistics aggregated from Supabase.
 */
export async function getAdminMetrics() {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error, data: null };
  }

  const supabase = auth.supabase;

  // Aggregate counts in parallel from actual live tables
  const [
    { count: totalBusinesses },
    { count: pendingApprovals },
    { count: approvedBusinesses },
    { count: suspendedBusinesses },
    { count: totalUsers },
    { count: totalCustomers },
    { count: totalBusinessOwners },
    { count: totalEnquiries },
    { count: totalReviews },
    { count: openReportsCount },
    { data: ratingData },
  ] = await Promise.all([
    supabase.from("businesses").select("*", { count: "exact", head: true }),
    supabase.from("businesses").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
    supabase.from("businesses").select("*", { count: "exact", head: true }).eq("approval_status", "approved"),
    supabase.from("businesses").select("*", { count: "exact", head: true }).eq("approval_status", "suspended"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "business_owner"),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("reports").select("*", { count: "exact", head: true }).in("status", ["pending", "under_review"]),
    supabase.from("reviews").select("rating"),
  ]);

  let avgRating = 4.8;
  if (ratingData && ratingData.length > 0) {
    const sum = ratingData.reduce((acc, r) => acc + (r.rating || 0), 0);
    avgRating = Number((sum / ratingData.length).toFixed(2));
  }

  return {
    success: true,
    error: null,
    data: {
      totalBusinesses: totalBusinesses || 0,
      pendingApprovals: pendingApprovals || 0,
      approvedBusinesses: approvedBusinesses || 0,
      suspendedBusinesses: suspendedBusinesses || 0,
      totalUsers: totalUsers || 0,
      totalCustomers: totalCustomers || 0,
      totalBusinessOwners: totalBusinessOwners || 0,
      totalEnquiries: totalEnquiries || 0,
      totalReviews: totalReviews || 0,
      avgRating,
      openReportsCount: openReportsCount || 0,
    },
  };
}

/**
 * Fetch directory businesses with category and owner joins.
 */
export async function getAdminBusinesses(filters?: {
  status?: string;
  category?: string;
  search?: string;
}) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error, data: [] };
  }

  const supabase = auth.supabase;
  let query = supabase
    .from("businesses")
    .select(`
      id,
      owner_id,
      category_id,
      business_name,
      slug,
      description,
      email,
      phone,
      whatsapp_number,
      website_url,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      approval_status,
      verification_status,
      rejection_reason,
      is_active,
      created_at,
      updated_at,
      categories (id, name, slug),
      profiles!owner_id (id, full_name, phone)
    `)
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("approval_status", filters.status);
  }

  if (filters?.search && filters.search.trim()) {
    query = query.ilike("business_name", `%${filters.search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, error: null, data: data || [] };
}

/**
 * Approve, Reject or Suspend a business.
 */
export async function updateBusinessStatus(
  businessId: string,
  approvalStatus: BusinessApprovalStatus,
  rejectionReason?: string
) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const supabase = auth.supabase;
  const verificationStatus: BusinessVerificationStatus =
    approvalStatus === "approved" ? "verified" : "unverified";

  const { data, error } = await supabase
    .from("businesses")
    .update({
      approval_status: approvalStatus,
      verification_status: verificationStatus,
      rejection_reason: rejectionReason || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", businessId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/businesses");
  return { success: true, data };
}

/**
 * Toggle verification badge on a business.
 */
export async function toggleBusinessVerification(
  businessId: string,
  currentStatus: BusinessVerificationStatus
) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const supabase = auth.supabase;
  const nextStatus: BusinessVerificationStatus =
    currentStatus === "verified" ? "unverified" : "verified";

  const { data, error } = await supabase
    .from("businesses")
    .update({
      verification_status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", businessId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/businesses");
  return { success: true, data };
}

/**
 * Fetch profiles (users) from Supabase.
 */
export async function getAdminUsers(filters?: { role?: string; search?: string }) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error, data: [] };
  }

  const supabase = auth.supabase;
  let query = supabase
    .from("profiles")
    .select("id, full_name, phone, role, avatar_url, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (filters?.role && filters.role !== "all") {
    query = query.eq("role", filters.role);
  }

  if (filters?.search && filters.search.trim()) {
    query = query.ilike("full_name", `%${filters.search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, error: null, data: data || [] };
}

/**
 * Update user role.
 */
export async function updateUserRole(userId: string, newRole: UserRole) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const supabase = auth.supabase;
  const { data, error } = await supabase
    .from("profiles")
    .update({
      role: newRole,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true, data };
}

/**
 * Fetch all categories from Supabase.
 */
export async function getAdminCategories() {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error, data: [] };
  }

  const supabase = auth.supabase;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, error: null, data: data || [] };
}

/**
 * Create a new service category.
 */
export async function createAdminCategory(category: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
}) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const supabase = auth.supabase;
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: category.name,
      slug: category.slug,
      description: category.description || null,
      icon: category.icon || "Wrench",
      is_active: category.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true, data };
}

/**
 * Update an existing category.
 */
export async function updateAdminCategory(
  id: string,
  updates: {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    is_active?: boolean;
  }
) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const supabase = auth.supabase;
  const { data, error } = await supabase
    .from("categories")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true, data };
}

/**
 * Delete a category.
 */
export async function deleteAdminCategory(id: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const supabase = auth.supabase;
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

/**
 * Fetch reviews with business and customer profiles.
 */
export async function getAdminReviews(filters?: { status?: string; rating?: number }) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error, data: [] };
  }

  const supabase = auth.supabase;
  let query = supabase
    .from("reviews")
    .select(`
      id,
      customer_id,
      business_id,
      rating,
      review_title,
      review_text,
      status,
      created_at,
      updated_at,
      businesses (id, business_name),
      profiles!customer_id (id, full_name)
    `)
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.rating) {
    query = query.eq("rating", filters.rating);
  }

  const { data, error } = await query;
  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, error: null, data: data || [] };
}

/**
 * Moderate review status (published, hidden, pending).
 */
export async function updateReviewStatus(reviewId: string, status: ReviewStatus) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const supabase = auth.supabase;
  const { data, error } = await supabase
    .from("reviews")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", reviewId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/reviews");
  return { success: true, data };
}

/**
 * Permanently delete a review.
 */
export async function deleteReview(reviewId: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const supabase = auth.supabase;
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/reviews");
  return { success: true };
}

/**
 * Fetch consumer/business reports.
 */
export async function getAdminReports(filters?: { status?: string }) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error, data: [] };
  }

  const supabase = auth.supabase;
  let query = supabase
    .from("reports")
    .select(`
      id,
      reporter_id,
      business_id,
      review_id,
      reason,
      description,
      status,
      admin_notes,
      resolved_by,
      resolved_at,
      created_at,
      updated_at,
      profiles!reporter_id (id, full_name, phone),
      businesses (id, business_name)
    `)
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, error: null, data: data || [] };
}

/**
 * Update report status (pending, under_review, resolved, dismissed).
 */
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminNotes?: string
) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const supabase = auth.supabase;
  const isResolved = status === "resolved" || status === "dismissed";

  const { data, error } = await supabase
    .from("reports")
    .update({
      status,
      admin_notes: adminNotes || null,
      resolved_by: isResolved ? auth.user?.id : null,
      resolved_at: isResolved ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reportId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/reports");
  return { success: true, data };
}

/**
 * Create a new user account (in auth.users and profiles) as Super Admin.
 */
export async function adminCreateUser(params: {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}) {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminClient = createAdminClient();

    // 1. Create auth user with provided email & temporary password
    const temporaryPassword = params.password || "ServiFindAdmin2026!";
    const { data: userData, error: userError } = await adminClient.auth.admin.createUser({
      email: params.email.trim(),
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: params.fullName,
        role: params.role,
      },
    });

    if (userError || !userData?.user) {
      return { success: false, error: userError?.message || "Failed to create user in Auth" };
    }

    // 2. Ensure profile record is inserted or updated with the specified role
    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert({
        id: userData.user.id,
        full_name: params.fullName,
        phone: params.phone || null,
        role: params.role,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    revalidatePath("/admin/users");
    return { success: true, data: { id: userData.user.id, email: params.email } };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
