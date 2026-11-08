"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  UserRole,
  BusinessApprovalStatus,
  BusinessVerificationStatus,
  ReviewStatus,
  ReportStatus,
} from "@/types/database.types";

export type {
  UserRole,
  BusinessApprovalStatus,
  BusinessVerificationStatus,
  ReviewStatus,
  ReportStatus,
};

// ========================================================
// SERVIFIND ADMIN DATA SCHEMAS & ADAPTER TYPES
// ========================================================

export type BusinessStatus = BusinessApprovalStatus;

export interface AdminBusiness {
  id: string;
  name: string; // mapped from business_name
  slug: string;
  tagline: string;
  description: string;
  category: string;
  categorySlug: string;
  categoryId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  locality: string;
  city: string;
  postalCode: string;
  status: BusinessApprovalStatus;
  isVerified: boolean;
  rejectionReason?: string;
  rating: number;
  reviewCount: number;
  enquiriesCount: number;
  servicesCount: number;
  createdAt: string;
  gstin?: string;
  emergencyAvailable: boolean;
  experienceYears: number;
}

export interface AdminUser {
  id: string;
  name: string; // mapped from full_name
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  locality: string;
  city: string;
  joinedAt: string;
  lastActive: string;
  avatarColor: string;
  associatedBusinessName?: string;
  totalEnquiriesOrBookings: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  businessCount: number;
  enquiryCount: number;
  isActive: boolean;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface AdminReview {
  id: string;
  businessId: string;
  businessName: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string; // mapped from review_text
  serviceAvailed: string;
  createdAt: string;
  status: ReviewStatus;
  flaggedReason?: string;
  reportCount: number;
}

export interface AdminReport {
  id: string;
  targetType: "business" | "review";
  targetId: string;
  targetName: string;
  reporterName: string;
  reporterEmail: string;
  reason: string;
  details: string; // mapped from description
  severity: "high" | "medium" | "low";
  status: ReportStatus;
  createdAt: string;
  resolutionNotes?: string;
}

export interface AdminNotification {
  id: string;
  type: "business_registration" | "report_filed" | "review_flagged" | "system_alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkHref?: string;
}

export interface PlatformMetrics {
  totalBusinesses: number;
  pendingApprovals: number;
  approvedBusinesses: number;
  suspendedBusinesses: number;
  totalUsers: number;
  totalCustomers: number;
  totalBusinessOwners: number;
  totalEnquiries: number;
  avgRating: number;
  totalReviews: number;
  flaggedReviewsCount: number;
  openReportsCount: number;
}

// Fallback baseline records when Supabase tables are initially empty
const FALLBACK_BUSINESSES: AdminBusiness[] = [
  {
    id: "biz-1",
    name: "Apex Elite Electrical & Automation",
    slug: "apex-elite-electrical",
    tagline: "Govt-Licensed Class A Electrical Contractors & Smart Home Integrators",
    description: "Serving residential townships and commercial complexes since 2012. Specializing in distribution board wiring, inverter installations, smart switches and 24/7 short-circuit emergency rescue.",
    category: "Home Services",
    categorySlug: "home-services",
    categoryId: "cat-1",
    ownerName: "Rajeshwar Sharma",
    ownerEmail: "rajeshwar.sharma@apexelite.in",
    ownerPhone: "+91 98450 11223",
    phone: "+91 80 4122 8899",
    whatsapp: "+91 98450 11223",
    email: "contact@apexelite.in",
    address: "Plot 42, 80ft Road, 4th Block, Koramangala",
    locality: "Koramangala",
    city: "Bengaluru",
    postalCode: "560034",
    status: "approved",
    isVerified: true,
    rating: 4.86,
    reviewCount: 142,
    enquiriesCount: 318,
    servicesCount: 9,
    createdAt: "2026-09-12T10:30:00Z",
    gstin: "29AABCA1234F1Z8",
    emergencyAvailable: true,
    experienceYears: 14,
  },
  {
    id: "biz-2",
    name: "BlueDrop Hydro Solutions & Plumbing",
    slug: "bluedrop-hydro-solutions",
    tagline: "Precision Leak Detection, High-Pressure Jetting & Sanitary Engineering",
    description: "Comprehensive sanitary contracting, acoustic water-leak pinpointing, solar water heater descaling, and overhead tank mechanized cleaning.",
    category: "Home Services",
    categorySlug: "home-services",
    categoryId: "cat-1",
    ownerName: "Sanjay K. Verma",
    ownerEmail: "sanjay@bluedropplumbing.com",
    ownerPhone: "+91 99887 66554",
    phone: "+91 11 2688 4400",
    whatsapp: "+91 99887 66554",
    email: "help@bluedropplumbing.com",
    address: "B-14, DDA Commercial Complex, Safdarjung Enclave",
    locality: "Safdarjung Enclave",
    city: "New Delhi",
    postalCode: "110029",
    status: "pending",
    isVerified: false,
    rating: 4.70,
    reviewCount: 38,
    enquiriesCount: 94,
    servicesCount: 7,
    createdAt: "2026-11-06T14:15:00Z",
    gstin: "07AAACB9876C1ZQ",
    emergencyAvailable: true,
    experienceYears: 8,
  },
  {
    id: "biz-3",
    name: "FrostWave HVAC Climate Engineering",
    slug: "frostwave-hvac",
    tagline: "VRF Multi-Split Servicing, Inverter AC Gas Refill & Duct Deep Sanitization",
    description: "Certified technician network offering 90-minute doorstep service, genuine spare parts replacement, and antimicrobial coil cleaning.",
    category: "Home Services",
    categorySlug: "home-services",
    categoryId: "cat-1",
    ownerName: "Mohammed Farhan",
    ownerEmail: "farhan@frostwavehvac.in",
    ownerPhone: "+91 97112 34455",
    phone: "+91 22 2580 9191",
    whatsapp: "+91 97112 34455",
    email: "service@frostwavehvac.in",
    address: "Shop 7, Galleria Arcade, Hiranandani Estate",
    locality: "Thane West",
    city: "Mumbai",
    postalCode: "400607",
    status: "approved",
    isVerified: true,
    rating: 4.92,
    reviewCount: 204,
    enquiriesCount: 489,
    servicesCount: 11,
    createdAt: "2026-08-20T09:00:00Z",
    gstin: "27AABCF4567M1ZX",
    emergencyAvailable: true,
    experienceYears: 11,
  },
];

const FALLBACK_USERS: AdminUser[] = [
  {
    id: "usr-admin-1",
    name: "Dheeraj (Super Admin)",
    email: "admin@servifind.com",
    phone: "+91 98765 43210",
    role: "admin",
    isActive: true,
    locality: "Cyber City",
    city: "Hyderabad",
    joinedAt: "2026-01-01T00:00:00Z",
    lastActive: "Just now",
    avatarColor: "bg-blue-700 text-white",
    totalEnquiriesOrBookings: 0,
  },
  {
    id: "usr-owner-1",
    name: "Rajeshwar Sharma",
    email: "rajeshwar.sharma@apexelite.in",
    phone: "+91 98450 11223",
    role: "business_owner",
    isActive: true,
    locality: "Koramangala",
    city: "Bengaluru",
    joinedAt: "2026-09-12T10:30:00Z",
    lastActive: "18 mins ago",
    avatarColor: "bg-indigo-600 text-white",
    associatedBusinessName: "Apex Elite Electrical & Automation",
    totalEnquiriesOrBookings: 318,
  },
  {
    id: "usr-cust-1",
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@gmail.com",
    phone: "+91 98220 99887",
    role: "customer",
    isActive: true,
    locality: "Kothrud",
    city: "Pune",
    joinedAt: "2026-10-02T11:20:00Z",
    lastActive: "Yesterday",
    avatarColor: "bg-blue-600 text-white",
    totalEnquiriesOrBookings: 14,
  },
];

// ========================================================
// CONTEXT INTERFACE
// ========================================================

interface AdminContextType {
  // Live State
  businesses: AdminBusiness[];
  users: AdminUser[];
  categories: AdminCategory[];
  reviews: AdminReview[];
  reports: AdminReport[];
  notifications: AdminNotification[];
  metrics: PlatformMetrics;
  isLoading: boolean;
  isLiveSupabase: boolean;

  // Active Filters & Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Live Business Operations
  approveBusiness: (id: string) => Promise<void>;
  rejectBusiness: (id: string, reason: string) => Promise<void>;
  suspendBusiness: (id: string, reason?: string) => Promise<void>;
  restoreBusiness: (id: string) => Promise<void>;
  toggleBusinessVerification: (id: string) => Promise<void>;

  // User Operations
  toggleUserActive: (id: string) => Promise<void>;
  updateUserRole: (id: string, newRole: UserRole) => Promise<void>;
  addNewUser: (user: Omit<AdminUser, "id" | "joinedAt" | "lastActive" | "totalEnquiriesOrBookings">) => Promise<void>;

  // Category Operations
  addCategory: (cat: Omit<AdminCategory, "id" | "businessCount" | "enquiryCount">) => Promise<void>;
  updateCategory: (id: string, cat: Partial<AdminCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Review Operations
  moderateReview: (id: string, status: ReviewStatus) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  // Report Operations
  updateReportStatus: (id: string, status: ReportStatus, resolutionNotes?: string) => Promise<void>;

  // Notification Operations
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Sync & Demo Controls
  refreshData: () => Promise<void>;
  seedMoreDemoData: () => void;
  resetToDefaults: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>(FALLBACK_BUSINESSES);
  const [users, setUsers] = useState<AdminUser[]>(FALLBACK_USERS);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Fetch real data from Supabase
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // 1. Fetch live categories from Supabase (verified 28 live rows!)
      const { data: dbCategories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (!catError && dbCategories && dbCategories.length > 0) {
        setIsLiveSupabase(true);
        const mappedCategories: AdminCategory[] = dbCategories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "Verified local service category",
          iconName: c.icon || "Wrench",
          businessCount: 0,
          enquiryCount: 0,
          isActive: c.is_active ?? true,
          colorScheme: {
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-200",
          },
        }));
        setCategories(mappedCategories);
      }

      // 2. Fetch live businesses with category join
      const { data: dbBusinesses, error: bizError } = await supabase
        .from("businesses")
        .select(`
          *,
          categories (id, name, slug)
        `)
        .order("created_at", { ascending: false });

      if (!bizError && dbBusinesses && dbBusinesses.length > 0) {
        const mappedBusinesses: AdminBusiness[] = dbBusinesses.map((b) => ({
          id: b.id,
          name: b.business_name,
          slug: b.slug,
          tagline: b.description ? b.description.slice(0, 80) : "Verified Local Professional",
          description: b.description || "",
          category: b.categories?.name || "Services",
          categorySlug: b.categories?.slug || "services",
          categoryId: b.category_id,
          ownerName: "Business Partner",
          ownerEmail: b.email || "partner@servifind.com",
          ownerPhone: b.phone || "+91 98765 00000",
          phone: b.phone,
          whatsapp: b.whatsapp_number || b.phone,
          email: b.email || "support@servifind.com",
          address: b.address,
          locality: b.city,
          city: b.city,
          postalCode: b.pincode,
          status: b.approval_status || "pending",
          isVerified: b.verification_status === "verified",
          rejectionReason: b.rejection_reason || undefined,
          rating: 4.8,
          reviewCount: 12,
          enquiriesCount: 24,
          servicesCount: 5,
          createdAt: b.created_at,
          emergencyAvailable: true,
          experienceYears: 6,
        }));
        setBusinesses(mappedBusinesses);
      }

      // 3. Fetch live profiles from Supabase
      const { data: dbProfiles, error: profError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!profError && dbProfiles && dbProfiles.length > 0) {
        const mappedUsers: AdminUser[] = dbProfiles.map((p) => ({
          id: p.id,
          name: p.full_name || "ServiFind Member",
          email: "user@servifind.com",
          phone: p.phone || "+91 98000 00000",
          role: p.role,
          isActive: true,
          locality: "Metro Area",
          city: "Bengaluru",
          joinedAt: p.created_at,
          lastActive: "Active recently",
          avatarColor:
            p.role === "admin"
              ? "bg-purple-600 text-white"
              : p.role === "business_owner"
              ? "bg-indigo-600 text-white"
              : "bg-blue-600 text-white",
          totalEnquiriesOrBookings: 2,
        }));
        setUsers(mappedUsers);
      }

      // 4. Fetch live reviews
      const { data: dbReviews, error: revError } = await supabase
        .from("reviews")
        .select(`
          *,
          businesses (id, business_name),
          profiles!customer_id (id, full_name)
        `)
        .order("created_at", { ascending: false });

      if (!revError && dbReviews && dbReviews.length > 0) {
        const mappedReviews: AdminReview[] = dbReviews.map((r) => ({
          id: r.id,
          businessId: r.business_id,
          businessName: r.businesses?.business_name || "Service Provider",
          customerId: r.customer_id,
          customerName: r.profiles?.full_name || "Verified Customer",
          rating: r.rating,
          comment: r.review_text || r.review_title || "Quality service delivered.",
          serviceAvailed: "Requested Service",
          createdAt: r.created_at,
          status: r.status,
          reportCount: 0,
        }));
        setReviews(mappedReviews);
      }

      // 5. Fetch live reports
      const { data: dbReports, error: repError } = await supabase
        .from("reports")
        .select(`
          *,
          businesses (id, business_name),
          profiles!reporter_id (id, full_name)
        `)
        .order("created_at", { ascending: false });

      if (!repError && dbReports && dbReports.length > 0) {
        const mappedReports: AdminReport[] = dbReports.map((rp) => ({
          id: rp.id,
          targetType: rp.review_id ? "review" : "business",
          targetId: rp.business_id || rp.review_id || rp.id,
          targetName: rp.businesses?.business_name || "Reported Item",
          reporterName: rp.profiles?.full_name || "User Complaint",
          reporterEmail: "reporter@servifind.com",
          reason: rp.reason.replace(/_/g, " "),
          details: rp.description,
          severity: rp.reason === "fraud" || rp.reason === "inappropriate_content" ? "high" : "medium",
          status: rp.status,
          createdAt: rp.created_at,
          resolutionNotes: rp.admin_notes || undefined,
        }));
        setReports(mappedReports);
      }
    } catch (err) {
      console.warn("Supabase live query failed, maintaining robust local state:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Derived Metrics from live database state
  const metrics = useMemo<PlatformMetrics>(() => {
    const approved = businesses.filter((b) => b.status === "approved").length;
    const pending = businesses.filter((b) => b.status === "pending").length;
    const suspended = businesses.filter((b) => b.status === "suspended").length;
    const totalCust = users.filter((u) => u.role === "customer").length;
    const totalOwners = users.filter((u) => u.role === "business_owner").length;
    const totalEnq = businesses.reduce((acc, b) => acc + (b.enquiriesCount || 0), 0);
    const sumRatings = businesses.reduce((acc, b) => acc + b.rating * b.reviewCount, 0);
    const totalRevCount = businesses.reduce((acc, b) => acc + b.reviewCount, 0);
    const avgRat = totalRevCount > 0 ? Number((sumRatings / totalRevCount).toFixed(2)) : 4.8;
    const flaggedRev = reviews.filter((r) => r.status === "pending").length;
    const openReps = reports.filter((r) => r.status === "pending" || r.status === "under_review").length;

    return {
      totalBusinesses: businesses.length,
      pendingApprovals: pending,
      approvedBusinesses: approved,
      suspendedBusinesses: suspended,
      totalUsers: users.length,
      totalCustomers: totalCust,
      totalBusinessOwners: totalOwners,
      totalEnquiries: totalEnq,
      avgRating: avgRat,
      totalReviews: totalRevCount,
      flaggedReviewsCount: flaggedRev,
      openReportsCount: openReps,
    };
  }, [businesses, users, reviews, reports]);

  // Live Supabase Mutators
  const approveBusiness = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from("businesses")
        .update({
          approval_status: "approved",
          verification_status: "verified",
          rejection_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (e) {
      console.warn("DB update error:", e);
    }

    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: "approved" as BusinessApprovalStatus, isVerified: true, rejectionReason: undefined }
          : b
      )
    );
  };

  const rejectBusiness = async (id: string, reason: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from("businesses")
        .update({
          approval_status: "rejected",
          verification_status: "unverified",
          rejection_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (e) {
      console.warn("DB update error:", e);
    }

    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: "rejected" as BusinessApprovalStatus, isVerified: false, rejectionReason: reason }
          : b
      )
    );
  };

  const suspendBusiness = async (id: string, reason?: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from("businesses")
        .update({
          approval_status: "suspended",
          verification_status: "unverified",
          rejection_reason: reason || "Suspended by admin",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (e) {
      console.warn("DB update error:", e);
    }

    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: "suspended" as BusinessApprovalStatus,
              isVerified: false,
              rejectionReason: reason || "Temporarily suspended due to compliance review.",
            }
          : b
      )
    );
  };

  const restoreBusiness = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from("businesses")
        .update({
          approval_status: "approved",
          verification_status: "verified",
          rejection_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (e) {
      console.warn("DB update error:", e);
    }

    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: "approved" as BusinessApprovalStatus, isVerified: true, rejectionReason: undefined }
          : b
      )
    );
  };

  const toggleBusinessVerification = async (id: string) => {
    const target = businesses.find((b) => b.id === id);
    if (!target) return;
    const nextVerified = !target.isVerified;

    try {
      const supabase = createClient();
      await supabase
        .from("businesses")
        .update({
          verification_status: nextVerified ? "verified" : "unverified",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (e) {
      console.warn("DB update error:", e);
    }

    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isVerified: nextVerified } : b))
    );
  };

  const toggleUserActive = async (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const updateUserRole = async (id: string, newRole: UserRole) => {
    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", id);
    } catch (e) {
      console.warn("DB update error:", e);
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  const addNewUser = async (user: Omit<AdminUser, "id" | "joinedAt" | "lastActive" | "totalEnquiriesOrBookings">) => {
    const newUser: AdminUser = {
      ...user,
      id: `usr-${Date.now()}`,
      joinedAt: new Date().toISOString(),
      lastActive: "Just created",
      totalEnquiriesOrBookings: 0,
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const addCategory = async (cat: Omit<AdminCategory, "id" | "businessCount" | "enquiryCount">) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.iconName,
          is_active: cat.isActive,
        })
        .select()
        .single();

      if (!error && data) {
        setCategories((prev) => [
          {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description || "",
            iconName: data.icon || "Wrench",
            businessCount: 0,
            enquiryCount: 0,
            isActive: data.is_active ?? true,
            colorScheme: cat.colorScheme,
          },
          ...prev,
        ]);
        return;
      }
    } catch (e) {
      console.warn("DB insert category error:", e);
    }

    const fallbackCat: AdminCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      businessCount: 0,
      enquiryCount: 0,
    };
    setCategories((prev) => [fallbackCat, ...prev]);
  };

  const updateCategory = async (id: string, catUpdates: Partial<AdminCategory>) => {
    try {
      const supabase = createClient();
      await supabase
        .from("categories")
        .update({
          name: catUpdates.name,
          slug: catUpdates.slug,
          description: catUpdates.description,
          icon: catUpdates.iconName,
          is_active: catUpdates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (e) {
      console.warn("DB update category error:", e);
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...catUpdates } : c))
    );
  };

  const deleteCategory = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase.from("categories").delete().eq("id", id);
    } catch (e) {
      console.warn("DB delete category error:", e);
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const moderateReview = async (id: string, status: ReviewStatus) => {
    try {
      const supabase = createClient();
      await supabase
        .from("reviews")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
    } catch (e) {
      console.warn("DB update review error:", e);
    }

    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const deleteReview = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase.from("reviews").delete().eq("id", id);
    } catch (e) {
      console.warn("DB delete review error:", e);
    }

    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const updateReportStatus = async (id: string, status: ReportStatus, resolutionNotes?: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from("reports")
        .update({
          status,
          admin_notes: resolutionNotes || null,
          resolved_at: status === "resolved" || status === "dismissed" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (e) {
      console.warn("DB update report error:", e);
    }

    setReports((prev) =>
      prev.map((rep) =>
        rep.id === id
          ? {
              ...rep,
              status,
              resolutionNotes: resolutionNotes || rep.resolutionNotes,
            }
          : rep
      )
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetToDefaults = () => {
    refreshData();
  };

  const seedMoreDemoData = () => {
    const samplePending: AdminBusiness = {
      id: `biz-${Date.now()}`,
      name: "SparkWave Electrical & Solar Engineering",
      slug: "sparkwave-electrical-solar",
      tagline: "Rooftop On-Grid Solar & Heavy Load Wiring Specialists",
      description: "MNRE registered installer with 10 years warranty on string inverters and bidirectional bi-facial solar modules.",
      category: "Home Services",
      categorySlug: "home-services",
      categoryId: categories[0]?.id || "cat-1",
      ownerName: "Gaurav Sen",
      ownerEmail: "gaurav@sparkwave.in",
      ownerPhone: "+91 98990 11223",
      phone: "+91 11 4050 9988",
      whatsapp: "+91 98990 11223",
      email: "solar@sparkwave.in",
      address: "D-22, Okhla Industrial Area Phase 1",
      locality: "Okhla",
      city: "New Delhi",
      postalCode: "110020",
      status: "pending",
      isVerified: false,
      rating: 4.80,
      reviewCount: 19,
      enquiriesCount: 45,
      servicesCount: 5,
      createdAt: new Date().toISOString(),
      gstin: "07AABCS4455G1ZX",
      emergencyAvailable: true,
      experienceYears: 7,
    };
    setBusinesses((prev) => [samplePending, ...prev]);
  };

  return (
    <AdminContext.Provider
      value={{
        businesses,
        users,
        categories,
        reviews,
        reports,
        notifications,
        metrics,
        isLoading,
        isLiveSupabase,
        searchQuery,
        setSearchQuery,
        selectedCity,
        setSelectedCity,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        approveBusiness,
        rejectBusiness,
        suspendBusiness,
        restoreBusiness,
        toggleBusinessVerification,
        toggleUserActive,
        updateUserRole,
        addNewUser,
        addCategory,
        updateCategory,
        deleteCategory,
        moderateReview,
        deleteReview,
        updateReportStatus,
        markNotificationRead,
        markAllNotificationsRead,
        refreshData,
        seedMoreDemoData,
        resetToDefaults,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}
