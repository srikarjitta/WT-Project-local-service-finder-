"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// ==========================================
// TYPE DEFINITIONS (Justdial-inspired SaaS)
// ==========================================

export interface BusinessProfile {
  name: string;
  tagline: string;
  yearEstablished: number;
  businessType: string; // "Sole Proprietorship", "Partnership", "Private Limited"
  category: string;
  specializations: string[]; // e.g. ["Residential Electrical", "Industrial Wiring", "Emergency Repairs"]
  contactPerson: string;
  phone: string;
  secondaryPhone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  landmark: string;
  locality: string;
  city: string;
  pincode: string;
  status: "approved" | "pending" | "rejected";
  isVerified: boolean;
  gstin?: string;
  profileCompletionScore: number;
  isPubliclyVisible: boolean;
  amenities: {
    paymentsAccepted: string[]; // ["UPI / GPay / PhonePe", "Credit & Debit Cards", "Cash", "Net Banking"]
    hasParking: boolean;
    isAirConditioned: boolean;
    hasEmergencyService: boolean;
    homeVisitsAvailable: boolean;
  };
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceType: "fixed" | "range" | "contact";
  priceMin?: number;
  priceMax?: number;
  turnaroundTime?: string; // e.g. "Within 2 Hours", "Same Day"
  warranty?: string; // e.g. "30 Days Service Warranty"
  isActive: boolean;
}

export interface BusinessPhoto {
  id: string;
  url: string;
  category: "facade" | "interior" | "portfolio" | "certificate";
  caption: string;
  isCover: boolean;
  uploadedAt: string;
}

export interface DaySchedule {
  day: string;
  dayIndex: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  isSplitShift?: boolean;
  eveningOpenTime?: string;
  eveningCloseTime?: string;
}

export interface CustomerEnquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceRequested: string;
  locality: string;
  message: string;
  source: "Direct Search" | "WhatsApp Lead" | "Category Browse" | "Phone Click";
  status: "new" | "contacted" | "quote_sent" | "won" | "lost";
  createdAt: string;
  ownerNotes?: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  serviceAvailed: string;
  isVerifiedCustomer: boolean;
  ownerReply?: {
    text: string;
    repliedAt: string;
  };
}

export interface PerformanceStats {
  profileImpressions: number;
  phoneCallClicks: number;
  whatsappInquiries: number;
  searchRankLocality: number; // e.g. #3 in Indiranagar
  topSearchKeywords: { keyword: string; searches: number }[];
}

// ==========================================
// DEFAULT SAMPLE DATA
// ==========================================

const DEFAULT_BUSINESS: BusinessProfile = {
  name: "Apex Home Care & Electrical Solutions",
  tagline: "Certified residential electricians & complete plumbing care",
  yearEstablished: 2016,
  businessType: "Partnership Firm",
  category: "Home Services",
  specializations: [
    "Residential Rewiring",
    "Emergency Power Outage Fix",
    "MCB & Fuse Box Repair",
    "Piping & Leak Isolation",
    "Ceiling Fan & Geyser Fitting",
  ],
  contactPerson: "Mahesh Kumar (Senior Lead)",
  phone: "+91 98450 12345",
  secondaryPhone: "+91 80 2525 9988",
  whatsapp: "+91 98450 12345",
  email: "care@apexelectrical.in",
  website: "https://apexelectrical.in",
  address: "Shop #14, Metro Pillar 140, 100ft Intermediate Ring Road",
  landmark: "Opposite BDA Complex, Near Empire Hotel",
  locality: "Indiranagar",
  city: "Bengaluru",
  pincode: "560038",
  status: "approved",
  isVerified: true,
  gstin: "29AAAAA0000A1Z5",
  profileCompletionScore: 92,
  isPubliclyVisible: true,
  amenities: {
    paymentsAccepted: ["UPI / GPay / PhonePe", "Credit & Debit Cards", "Cash", "Net Banking"],
    hasParking: true,
    isAirConditioned: false,
    hasEmergencyService: true,
    homeVisitsAvailable: true,
  },
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    name: "Full Home Electrical Safety Audit",
    category: "Electrical Inspection",
    description: "Complete testing of circuit breakers, grounding, earthing voltage, and concealed load distribution.",
    priceType: "fixed",
    priceMin: 799,
    turnaroundTime: "Within 3 Hours",
    warranty: "60 Days Diagnostic Guarantee",
    isActive: true,
  },
  {
    id: "srv-2",
    name: "Ceiling Fan, Light & Chandelier Fitting",
    category: "Appliance Installation",
    description: "Safe ceiling anchor drilling, balancing, and smart regulator rewiring for fans & fancy lights.",
    priceType: "range",
    priceMin: 299,
    priceMax: 650,
    turnaroundTime: "Same Day Dispatch",
    warranty: "30 Days Installation Warranty",
    isActive: true,
  },
  {
    id: "srv-3",
    name: "24/7 Emergency Short-Circuit Troubleshooting",
    category: "Emergency Repairs",
    description: "Rapid technician dispatch within 45 minutes for tripped MCB, burnt wiring smell, and sudden outages.",
    priceType: "fixed",
    priceMin: 1199,
    turnaroundTime: "45 Minutes Priority",
    warranty: "Immediate Resolution",
    isActive: true,
  },
  {
    id: "srv-4",
    name: "Bathroom Plumbing & Geyser Pipe Installation",
    category: "Plumbing Services",
    description: "Heavy-duty SS braided hose connection, angle valves replacement, and inlet/outlet leakage sealing.",
    priceType: "fixed",
    priceMin: 499,
    turnaroundTime: "Same Day",
    warranty: "90 Days Leakage Warranty",
    isActive: true,
  },
  {
    id: "srv-5",
    name: "Commercial Office AMC & Phase Balancing",
    category: "Commercial Contracts",
    description: "Monthly preventive servicing for IT/commercial offices up to 3000 sq.ft with dedicated technician.",
    priceType: "contact",
    turnaroundTime: "Scheduled Visits",
    warranty: "Annual Contract",
    isActive: true,
  },
];

const DEFAULT_PHOTOS: BusinessPhoto[] = [
  {
    id: "p-1",
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    category: "portfolio",
    caption: "Concealed electrical wiring & modern distribution board setup",
    isCover: true,
    uploadedAt: "2026-10-15",
  },
  {
    id: "p-2",
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    category: "facade",
    caption: "Main Service Center storefront at Indiranagar 100ft Road",
    isCover: false,
    uploadedAt: "2026-10-16",
  },
  {
    id: "p-3",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    category: "portfolio",
    caption: "Safety technician running voltage drop and earthing tests",
    isCover: false,
    uploadedAt: "2026-10-20",
  },
  {
    id: "p-4",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    category: "interior",
    caption: "Client consultation reception & spare parts inventory",
    isCover: false,
    uploadedAt: "2026-10-22",
  },
];

const DEFAULT_HOURS: DaySchedule[] = [
  { day: "Monday", dayIndex: 1, isOpen: true, openTime: "08:30", closeTime: "20:30" },
  { day: "Tuesday", dayIndex: 2, isOpen: true, openTime: "08:30", closeTime: "20:30" },
  { day: "Wednesday", dayIndex: 3, isOpen: true, openTime: "08:30", closeTime: "20:30" },
  { day: "Thursday", dayIndex: 4, isOpen: true, openTime: "08:30", closeTime: "20:30" },
  { day: "Friday", dayIndex: 5, isOpen: true, openTime: "08:30", closeTime: "20:30" },
  { day: "Saturday", dayIndex: 6, isOpen: true, openTime: "09:00", closeTime: "19:00" },
  { day: "Sunday", dayIndex: 0, isOpen: true, openTime: "10:00", closeTime: "15:00", isSplitShift: false },
];

const DEFAULT_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: "enq-101",
    customerName: "Rahul Sharma",
    customerPhone: "+91 99001 22334",
    customerEmail: "rahul.sharma@gmail.com",
    serviceRequested: "Emergency Power Outage Fix",
    locality: "Indiranagar 2nd Stage",
    message: "Main MCB keeps tripping every time the living room AC turns on. Need immediate inspection this morning.",
    source: "Direct Search",
    status: "new",
    createdAt: "15 minutes ago",
  },
  {
    id: "enq-102",
    customerName: "Priya Venkatesh",
    customerPhone: "+91 98860 55443",
    customerEmail: "priya.v@outlook.com",
    serviceRequested: "Full Home Electrical Safety Audit",
    locality: "Defence Colony, Indiranagar",
    message: "Moving into a renovated 3BHK flat next week. Want a comprehensive earthing and wiring safety check done before shifting.",
    source: "WhatsApp Lead",
    status: "contacted",
    createdAt: "2 hours ago",
    ownerNotes: "Called customer. Agreed for inspection on Saturday at 11:00 AM.",
  },
  {
    id: "enq-103",
    customerName: "Anand Kulkarni",
    customerPhone: "+91 97410 88990",
    customerEmail: "anand.k@techstart.io",
    serviceRequested: "Commercial Office AMC",
    locality: "Domlur / HAL Airport Road",
    message: "We have a 25-seater startup office. Looking for monthly preventive maintenance for UPS, server room wiring, and lights.",
    source: "Category Browse",
    status: "quote_sent",
    createdAt: "Yesterday",
    ownerNotes: "Sent PDF proposal with ₹4,500/month quote. Follow-up scheduled for Thursday.",
  },
  {
    id: "enq-104",
    customerName: "Sneha Nair",
    customerPhone: "+91 96112 33445",
    customerEmail: "sneha.nair@hotmail.com",
    serviceRequested: "Bathroom Plumbing & Geyser Fitting",
    locality: "Old Airport Road",
    message: "Geyser installation completed yesterday. Need invoice with GST number for warranty claim.",
    source: "Phone Click",
    status: "won",
    createdAt: "2 days ago",
    ownerNotes: "Invoice #INV-2045 emailed to customer. Payment collected via UPI.",
  },
  {
    id: "enq-105",
    customerName: "Vikramaditya Roy",
    customerPhone: "+91 94480 77112",
    customerEmail: "v.roy@gmail.com",
    serviceRequested: "Ceiling Fan Fitting",
    locality: "Whitefield (Outside Primary Area)",
    message: "Need 6 fans installed at Villa 42.",
    source: "Direct Search",
    status: "lost",
    createdAt: "4 days ago",
    ownerNotes: "Customer location exceeds 20km radius from Indiranagar center. Politely declined.",
  },
];

const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    customerName: "Arjun Srinivasan",
    rating: 5,
    comment: "Extremely punctual and professional! Mahesh detected an earthing leakage within 20 minutes that two other electricians could not diagnose. Fair and upfront pricing with proper bill.",
    date: "3 days ago",
    serviceAvailed: "Full Home Electrical Safety Audit",
    isVerifiedCustomer: true,
    ownerReply: {
      text: "Thank you so much Arjun for trusting Apex! Glad we could ensure your home wiring is 100% safe.",
      repliedAt: "2 days ago",
    },
  },
  {
    id: "rev-2",
    customerName: "Meera Deshmukh",
    rating: 5,
    comment: "Came within 35 minutes for an emergency short-circuit during peak rain. Restored power swiftly and safely. Highly recommended in Indiranagar!",
    date: "1 week ago",
    serviceAvailed: "24/7 Emergency Repairs",
    isVerifiedCustomer: true,
  },
  {
    id: "rev-3",
    customerName: "Karthik R.",
    rating: 4,
    comment: "Clean installation work for our high-ceiling decorative fans. Arrived slightly late due to traffic, but did flawless wiring work.",
    date: "2 weeks ago",
    serviceAvailed: "Ceiling Fan Fitting",
    isVerifiedCustomer: true,
    ownerReply: {
      text: "Apologies for the slight traffic delay Karthik. We are thrilled you liked the final fitting!",
      repliedAt: "10 days ago",
    },
  },
  {
    id: "rev-4",
    customerName: "Sunita Jacob",
    rating: 5,
    comment: "Very polite technicians. Wore shoe covers before entering and cleaned up all wire clippings after finishing the job.",
    date: "3 weeks ago",
    serviceAvailed: "Bathroom Plumbing & Geyser Fitting",
    isVerifiedCustomer: true,
  },
];

const DEFAULT_STATS: PerformanceStats = {
  profileImpressions: 2480,
  phoneCallClicks: 184,
  whatsappInquiries: 92,
  searchRankLocality: 3,
  topSearchKeywords: [
    { keyword: "electrician near me indiranagar", searches: 640 },
    { keyword: "emergency short circuit repair", searches: 380 },
    { keyword: "geyser fitting electrician bangalore", searches: 290 },
    { keyword: "commercial electrical amc", searches: 145 },
  ],
};

// ==========================================
// CONTEXT INTERFACE
// ==========================================

interface BusinessContextType {
  business: BusinessProfile;
  services: ServiceItem[];
  photos: BusinessPhoto[];
  hours: DaySchedule[];
  enquiries: CustomerEnquiry[];
  reviews: CustomerReview[];
  stats: PerformanceStats;
  updateProfile: (data: Partial<BusinessProfile>) => void;
  addService: (service: Omit<ServiceItem, "id">) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  addPhoto: (photo: Omit<BusinessPhoto, "id" | "uploadedAt">) => void;
  deletePhoto: (id: string) => void;
  setCoverPhoto: (id: string) => void;
  updateHours: (hours: DaySchedule[]) => void;
  updateEnquiryStatus: (id: string, status: CustomerEnquiry["status"], notes?: string) => void;
  replyToReview: (id: string, replyText: string) => void;
  resetToDefaults: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const STORAGE_KEY = "lsf_business_mock_data_v1";

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<BusinessProfile>(DEFAULT_BUSINESS);
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [photos, setPhotos] = useState<BusinessPhoto[]>(DEFAULT_PHOTOS);
  const [hours, setHours] = useState<DaySchedule[]>(DEFAULT_HOURS);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(DEFAULT_ENQUIRIES);
  const [reviews, setReviews] = useState<CustomerReview[]>(DEFAULT_REVIEWS);
  const [stats, setStats] = useState<PerformanceStats>(DEFAULT_STATS);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.business) setBusiness(parsed.business);
        if (parsed.services) setServices(parsed.services);
        if (parsed.photos) setPhotos(parsed.photos);
        if (parsed.hours) setHours(parsed.hours);
        if (parsed.enquiries) setEnquiries(parsed.enquiries);
        if (parsed.reviews) setReviews(parsed.reviews);
        if (parsed.stats) setStats(parsed.stats);
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }, []);

  // Sync to LocalStorage
  const saveState = (updated: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  };

  const updateProfile = (data: Partial<BusinessProfile>) => {
    setBusiness((prev) => {
      const next = { ...prev, ...data };
      saveState({ business: next, services, photos, hours, enquiries, reviews, stats });
      return next;
    });
  };

  const addService = (newSrv: Omit<ServiceItem, "id">) => {
    const item: ServiceItem = { ...newSrv, id: `srv-${Date.now()}` };
    setServices((prev) => {
      const next = [item, ...prev];
      saveState({ business, services: next, photos, hours, enquiries, reviews, stats });
      return next;
    });
  };

  const updateService = (id: string, data: Partial<ServiceItem>) => {
    setServices((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...data } : s));
      saveState({ business, services: next, photos, hours, enquiries, reviews, stats });
      return next;
    });
  };

  const deleteService = (id: string) => {
    setServices((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveState({ business, services: next, photos, hours, enquiries, reviews, stats });
      return next;
    });
  };

  const addPhoto = (photo: Omit<BusinessPhoto, "id" | "uploadedAt">) => {
    const newPhoto: BusinessPhoto = {
      ...photo,
      id: `p-${Date.now()}`,
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    setPhotos((prev) => {
      const next = [newPhoto, ...prev];
      saveState({ business, services, photos: next, hours, enquiries, reviews, stats });
      return next;
    });
  };

  const deletePhoto = (id: string) => {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveState({ business, services, photos: next, hours, enquiries, reviews, stats });
      return next;
    });
  };

  const setCoverPhoto = (id: string) => {
    setPhotos((prev) => {
      const next = prev.map((p) => ({ ...p, isCover: p.id === id }));
      saveState({ business, services, photos: next, hours, enquiries, reviews, stats });
      return next;
    });
  };

  const updateHours = (newHours: DaySchedule[]) => {
    setHours(newHours);
    saveState({ business, services, photos, hours: newHours, enquiries, reviews, stats });
  };

  const updateEnquiryStatus = (id: string, status: CustomerEnquiry["status"], notes?: string) => {
    setEnquiries((prev) => {
      const next = prev.map((e) =>
        e.id === id ? { ...e, status, ownerNotes: notes !== undefined ? notes : e.ownerNotes } : e
      );
      saveState({ business, services, photos, hours, enquiries: next, reviews, stats });
      return next;
    });
  };

  const replyToReview = (id: string, replyText: string) => {
    setReviews((prev) => {
      const next = prev.map((r) =>
        r.id === id
          ? {
              ...r,
              ownerReply: {
                text: replyText,
                repliedAt: "Just now",
              },
            }
          : r
      );
      saveState({ business, services, photos, hours, enquiries, reviews: next, stats });
      return next;
    });
  };

  const resetToDefaults = () => {
    setBusiness(DEFAULT_BUSINESS);
    setServices(DEFAULT_SERVICES);
    setPhotos(DEFAULT_PHOTOS);
    setHours(DEFAULT_HOURS);
    setEnquiries(DEFAULT_ENQUIRIES);
    setReviews(DEFAULT_REVIEWS);
    setStats(DEFAULT_STATS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <BusinessContext.Provider
      value={{
        business,
        services,
        photos,
        hours,
        enquiries,
        reviews,
        stats,
        updateProfile,
        addService,
        updateService,
        deleteService,
        addPhoto,
        deletePhoto,
        setCoverPhoto,
        updateHours,
        updateEnquiryStatus,
        replyToReview,
        resetToDefaults,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return ctx;
}
