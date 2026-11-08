export type UserRole = "customer" | "business_owner" | "admin";
export type BusinessApprovalStatus = "pending" | "approved" | "rejected" | "suspended";
export type BusinessVerificationStatus = "unverified" | "verified";
export type PriceType = "fixed" | "starting_from" | "range" | "quote";
export type EnquiryStatus = "new" | "contacted" | "completed" | "cancelled" | "rejected";
export type ReviewStatus = "published" | "hidden" | "pending";
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
  image_url: string | null;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string; // references profiles(id)
  category_id: string; // references categories(id)
  business_name: string;
  slug: string;
  description: string;
  email: string | null;
  phone: string;
  whatsapp_number: string | null;
  website_url: string | null;
  address: string;
  city: string;
  state: string | null;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  approval_status: BusinessApprovalStatus;
  verification_status: BusinessVerificationStatus;
  rejection_reason: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessService {
  id: string;
  business_id: string;
  service_name: string;
  description: string | null;
  price: number | null;
  max_price: number | null;
  price_type: PriceType;
  duration_minutes: number | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessImage {
  id: string;
  business_id: string;
  image_url: string;
  image_type: "logo" | "cover" | "gallery" | null;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface BusinessHours {
  id: string;
  business_id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  customer_id: string | null;
  business_id: string;
  subject: string | null;
  message: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status: EnquiryStatus;
  business_response: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  customer_id: string;
  business_id: string;
  rating: number;
  review_title: string | null;
  review_text: string;
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
  business_id: string | null;
  review_id: string | null;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  admin_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  reference_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}
