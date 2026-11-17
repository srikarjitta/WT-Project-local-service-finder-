import { UserProfile, UserEnquiry, UserReviewItem } from '@/types';

export const CURRENT_USER: UserProfile = {
  id: 'usr-101',
  name: 'Srikar Reddy',
  email: 'srikar.reddy@example.com',
  phone: '+91 98480 11223',
  city: 'Khammam',
  locality: 'Wyra Road',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  memberSince: 'March 2024',
};

export const MOCK_USER_ENQUIRIES: UserEnquiry[] = [
  {
    id: 'enq-901',
    businessId: 'coolbreeze-ac-services',
    businessName: 'CoolBreeze Air Conditioners & Electricals',
    businessCategory: 'Repairs & Maintenance',
    businessImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80',
    serviceRequested: 'Jet Chemical Deep Cleaning & Gas Check',
    message: 'Need 2 split AC units serviced at my home on Wyra Road this Saturday morning.',
    status: 'Responded',
    date: 'Yesterday at 3:45 PM',
    phone: '+91 98480 22334',
    responseNote: 'Technician confirmed for Saturday 10:30 AM. Call us if you need to reschedule.',
  },
  {
    id: 'enq-902',
    businessId: 'aura-luxury-salon-spa',
    businessName: 'Aura Luxury Salon & Family Wellness Spa',
    businessCategory: 'Beauty & Wellness',
    businessImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80',
    serviceRequested: 'Bridal Makeover Consultation',
    message: 'Inquiring about available slots and packages for wedding reception next month.',
    status: 'Pending',
    date: 'Nov 04, 2026',
    phone: '+91 91210 55443',
  },
  {
    id: 'enq-903',
    businessId: 'sparkleclean-home-services',
    businessName: 'SparkleClean Deep Cleaning & Pest Solutions',
    businessCategory: 'Home Services',
    businessImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80',
    serviceRequested: '3BHK Villa Deep Cleaning',
    message: 'Full house post-renovation cleaning before housewarming ceremony.',
    status: 'Completed',
    date: 'Oct 28, 2026',
    phone: '+91 93902 44112',
    responseNote: 'Job completed on Oct 29. Invoice sent to registered email.',
  },
  {
    id: 'enq-904',
    businessId: 'speedy-wheelz-auto-hub',
    businessName: 'SpeedyWheelz Multi-Brand Car Service Hub',
    businessCategory: 'Automotive',
    businessImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=300&q=80',
    serviceRequested: '3D Wheel Alignment & Ceramic Coating',
    message: 'Quote required for ceramic coating on new Creta.',
    status: 'Responded',
    date: 'Oct 20, 2026',
    phone: '+91 97011 88220',
    responseNote: 'Special festival discount: 3-year warranty package at ₹13,499. Includes free 1st maintenance wash.',
  },
];

export const MOCK_USER_REVIEWS: UserReviewItem[] = [
  {
    id: 'my-rev-1',
    businessId: 'coolbreeze-ac-services',
    businessName: 'CoolBreeze Air Conditioners & Electricals',
    businessCategory: 'Repairs & Maintenance',
    businessImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    date: 'Nov 02, 2026',
    comment: 'Punctual, professional, and very neat workmanship. Did not leave any water mess on the bedroom floor.',
    status: 'Published',
  },
  {
    id: 'my-rev-2',
    businessId: 'sparkleclean-home-services',
    businessName: 'SparkleClean Deep Cleaning & Pest Solutions',
    businessCategory: 'Home Services',
    businessImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80',
    rating: 4,
    date: 'Oct 30, 2026',
    comment: 'Great cleaning crew of 4 people. Tiles and window panes were sparkling. Took slightly longer than estimated, but quality was top notch.',
    status: 'Published',
  },
];

export const MOCK_FAVORITE_IDS = [
  'coolbreeze-ac-services',
  'aura-luxury-salon-spa',
  'grand-regal-banquet-conventions',
];

