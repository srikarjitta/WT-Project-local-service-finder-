export type UserRole = "customer" | "business_owner" | "admin";
export type BusinessStatus = "pending" | "approved" | "rejected" | "suspended";
export type PriceType = "fixed" | "range" | "contact";
export type EnquiryStatus = "new" | "in_progress" | "responded" | "closed";
export type ReviewStatus = "published" | "flagged" | "hidden";

export interface Profile {
  id: string; // references auth.users(id)
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parent_id: string | null;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string; // references profiles(id)
  category_id: string; // references categories(id)
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string;
  locality: string;
  city: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  status: BusinessStatus;
  rejection_reason: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessService {
  id: string;
  business_id: string; // references businesses(id)
  name: string;
  description: string | null;
  price_type: PriceType;
  price_min: number | null;
  price_max: number | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessImage {
  id: string;
  business_id: string; // references businesses(id)
  storage_path: string;
  url: string;
  caption: string | null;
  is_cover: boolean;
  order_index: number;
  created_at: string;
}

export interface BusinessHours {
  id: string;
  business_id: string; // references businesses(id)
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  open_time: string; // HH:MM format
  close_time: string; // HH:MM format
  is_closed: boolean;
}

export interface Enquiry {
  id: string;
  business_id: string; // references businesses(id)
  customer_id: string | null; // references profiles(id), nullable for guest
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service_id: string | null; // references business_services(id)
  message: string;
  status: EnquiryStatus;
  owner_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  customer_id: string;
  rating: number; // 1 to 5
  comment: string;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  customer_id: string;
  business_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: "business" | "review";
  target_id: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
}
