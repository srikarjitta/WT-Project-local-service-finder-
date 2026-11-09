export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  count: number;
  featured?: boolean;
  subcategories: string[];
  bannerImage?: string;
}

export interface BusinessService {
  id: string;
  name: string;
  description: string;
  price?: string;
  duration?: string;
  popular?: boolean;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface Review {
  id: string;
  businessId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBooking?: boolean;
  helpfulCount?: number;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  categoryId: string;
  categoryName: string;
  subCategory: string;
  rating: number;
  reviewCount: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  priceRangeText: string;
  verified: boolean;
  featured?: boolean;
  isRecentlyAdded?: boolean;
  isOpenNow: boolean;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  location: {
    city: string;
    locality: string;
    address: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  coverImage: string;
  logo: string;
  gallery: string[];
  services: BusinessService[];
  hours: BusinessHours[];
  badges: string[];
  establishedYear: number;
  yearsInBusiness: number;
  responseTime: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  locality: string;
  avatarUrl: string;
  memberSince: string;
}

export interface UserEnquiry {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  businessImage: string;
  serviceRequested: string;
  message: string;
  status: 'Pending' | 'Responded' | 'Completed' | 'Cancelled';
  date: string;
  phone: string;
  responseNote?: string;
}

export interface UserReviewItem {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  businessImage: string;
  rating: number;
  date: string;
  comment: string;
  status: 'Published' | 'Under Review';
}

