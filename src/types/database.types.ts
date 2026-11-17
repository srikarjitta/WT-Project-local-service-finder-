export type UserRole = "customer" | "business_owner" | "admin";
export type BusinessStatus = "pending" | "approved" | "rejected" | "suspended";
export type BusinessApprovalStatus = BusinessStatus;
export type BusinessVerificationStatus = "unverified" | "verified";
export type PriceType = "fixed" | "range" | "contact" | "starting_from" | "quote";
export type EnquiryStatus =
  | "new"
  | "in_progress"
  | "contacted"
  | "responded"
  | "completed"
  | "closed"
  | "cancelled"
  | "rejected";
export type ReviewStatus = "published" | "flagged" | "hidden" | "pending";
export type ReportStatus = "pending" | "under_review" | "resolved" | "dismissed";
export type ReportReason =
  | "fake_information"
  | "spam"
  | "fraud"
  | "inappropriate_content"
  | "incorrect_contact"
  | "poor_service"
  | "other";
export type NotificationType =
  | "new_enquiry"
  | "enquiry_update"
  | "business_approved"
  | "business_rejected"
  | "business_suspended"
  | "new_review"
  | "review_update"
  | "new_report"
  | "report_update"
  | "general";

export interface Profile {
  id: string; // references auth.users(id)
  email?: string | null;
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
  image_url?: string | null;
  parent_id: string | null;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Business {
  id: string;
  owner_id: string; // references profiles(id)
  category_id: string; // references categories(id)
  name: string;
  business_name?: string;
  slug: string;
  tagline?: string | null;
  description: string;
  email: string | null;
  phone: string;
  whatsapp?: string | null;
  whatsapp_number?: string | null;
  website?: string | null;
  website_url?: string | null;
  address: string;
  locality?: string;
  city: string;
  state?: string | null;
  postal_code?: string;
  pincode?: string;
  latitude: number | null;
  longitude: number | null;
  status: BusinessStatus;
  approval_status?: BusinessStatus;
  verification_status?: BusinessVerificationStatus;
  rejection_reason?: string | null;
  is_verified?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface BusinessService {
  id: string;
  business_id: string; // references businesses(id)
  name: string;
  service_name?: string;
  description: string | null;
  price_type: PriceType;
  price?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  max_price?: number | null;
  duration_minutes?: number | null;
  is_available?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessImage {
  id: string;
  business_id: string; // references businesses(id)
  storage_path?: string;
  url: string;
  image_url?: string;
  image_type?: "logo" | "cover" | "gallery" | null;
  alt_text?: string | null;
  caption?: string | null;
  display_order?: number;
  order_index?: number;
  is_cover?: boolean;
  is_primary?: boolean;
  created_at: string;
}

export interface BusinessHours {
  id: string;
  business_id: string; // references businesses(id)
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  open_time: string; // HH:MM format
  close_time: string; // HH:MM format
  is_closed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Enquiry {
  id: string;
  business_id: string; // references businesses(id)
  customer_id: string | null; // references profiles(id)
  customer_name?: string;
  contact_name?: string;
  customer_phone?: string;
  contact_phone?: string;
  customer_email?: string;
  contact_email?: string;
  service_id?: string | null;
  subject?: string | null;
  message: string;
  status: EnquiryStatus;
  owner_notes?: string | null;
  business_response?: string | null;
  responded_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  customer_id: string;
  rating: number; // 1 to 5
  comment?: string;
  review_title?: string | null;
  review_text?: string;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
  businesses?: {
    id: string;
    business_name: string;
  } | null;
  profiles?: {
    id: string;
    full_name: string | null;
  } | null;
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
  business_id?: string | null;
  review_id?: string | null;
  target_type?: "business" | "review";
  target_id?: string;
  reason: ReportReason | string;
  description?: string;
  status: ReportStatus;
  admin_notes?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at?: string;
  profiles?: {
    id: string;
    full_name: string | null;
    phone?: string | null;
  } | null;
  businesses?: {
    id: string;
    business_name: string;
  } | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  reference_id?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}
