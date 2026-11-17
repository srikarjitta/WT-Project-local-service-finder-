'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  ShieldCheck,
  Clock,
  Heart,
  Share2,
  Calendar,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  Award,
  Navigation,
  Check,
} from 'lucide-react';
import { BUSINESSES_DATA, MOCK_REVIEWS } from '@/data/businesses';
import { Rating } from '@/components/common/Rating';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { BusinessGallery } from '@/components/business/BusinessGallery';
import { OpeningHoursCard } from '@/components/business/OpeningHoursCard';
import { ContactModal } from '@/components/business/ContactModal';
import { EnquiryModal } from '@/components/business/EnquiryModal';
import { ReviewModal } from '@/components/business/ReviewModal';

function BusinessDetailsContent() {
  const params = useParams();
  const id = params?.id as string;

  const business = BUSINESSES_DATA.find((b) => b.id === id) || BUSINESSES_DATA[0];

  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'gallery' | 'reviews'>('services');
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactType, setContactType] = useState<'call' | 'whatsapp'>('call');
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedServiceForEnquiry, setSelectedServiceForEnquiry] = useState<string>('');

  const businessReviews = MOCK_REVIEWS.filter((r) => r.businessId === business.id);
  const displayReviews = businessReviews.length > 0 ? businessReviews : MOCK_REVIEWS.slice(0, 3);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOpenCall = () => {
    setContactType('call');
    setIsContactModalOpen(true);
  };

  const handleOpenWhatsapp = () => {
    setContactType('whatsapp');
    setIsContactModalOpen(true);
  };

  const handleOpenEnquiry = (serviceName?: string) => {
    setSelectedServiceForEnquiry(serviceName || business.services[0]?.name || 'General Service Enquiry');
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-[#DBEAFE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto">
            <Link href="/" className="hover:text-blue-600 shrink-0">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <Link href={`/search?category=${business.categoryId}`} className="hover:text-blue-600 shrink-0">
              {business.categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="text-[#1E3A8A] font-bold truncate">{business.name}</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Cover & Header Section */}
      <div className="relative bg-white border-b border-[#DBEAFE]">
        {/* Cover Image */}
        <div className="relative h-60 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-900">
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-black/20" />

          {/* Quick Floating Top Actions (Favorite & Share) */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-rose-500 transition-colors shadow-md"
              aria-label="Add to favourites"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-blue-600 transition-colors shadow-md flex items-center gap-1.5"
              aria-label="Share business profile"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-20 pb-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DBEAFE] shadow-xl shadow-blue-500/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Logo + Titles */}
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white shrink-0">
                  <img
                    src={business.logo}
                    alt={`${business.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {business.categoryName} • {business.subCategory}
                    </span>
                    {business.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full border border-blue-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        Verified Partner
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        business.isOpenNow
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {business.isOpenNow ? 'Open Now' : 'Closed'}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E3A8A] leading-tight">
                    {business.name}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-medium">
                    {business.tagline}
                  </p>

                  {/* Rating, Price, Address */}
                  <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-600">
                    <Rating value={business.rating} reviewCount={business.reviewCount} size="md" />
                    <div className="h-3 w-px bg-slate-200 hidden sm:block" />
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      Pricing: {business.priceRangeText}
                    </span>
                    <div className="h-3 w-px bg-slate-200 hidden sm:block" />
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{business.location.locality}, {business.location.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* THREE PROMINENT ACTIONS (As explicitly required: Call Now, WhatsApp, Send Enquiry) */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleOpenEnquiry()}
                  className="font-bold px-6 shadow-md shadow-blue-600/20"
                  leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
                >
                  Send Enquiry
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleOpenCall}
                    className="font-bold border-blue-200 text-[#1E3A8A]"
                    leftIcon={<Phone className="w-4 h-4 text-blue-600" />}
                  >
                    Call Now
                  </Button>

                  <Button
                    variant="whatsapp"
                    size="md"
                    onClick={handleOpenWhatsapp}
                    className="font-bold"
                    leftIcon={<MessageCircle className="w-4 h-4 fill-white text-transparent" />}
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            {/* Badges row */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3 overflow-x-auto pb-1 text-xs">
              <span className="font-bold text-slate-400 shrink-0">Highlights:</span>
              {business.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200/60 shrink-0 text-[11px]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  {badge}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold shrink-0 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Responds in {business.responseTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-[#DBEAFE] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 overflow-x-auto text-sm font-bold">
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 border-b-2 transition-all shrink-0 ${
                activeTab === 'services'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Services & Pricing ({business.services.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 border-b-2 transition-all shrink-0 ${
                activeTab === 'about'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              About & Overview
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-4 border-b-2 transition-all shrink-0 ${
                activeTab === 'gallery'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Photo Gallery ({business.gallery.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 border-b-2 transition-all shrink-0 ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Reviews ({business.reviewCount})
            </button>
          </div>
        </div>
      </div>

      {/* 4. Tab Content & Sidebar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Left Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* TAB: Services & Pricing */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#1E3A8A]">Services Offered</h2>
                    <p className="text-xs text-slate-500">Transparent pricing with genuine warranty</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenEnquiry()}
                  >
                    Custom Quote
                  </Button>
                </div>

                <div className="space-y-3">
                  {business.services.map((svc) => (
                    <div
                      key={svc.id}
                      className="p-5 rounded-3xl bg-white border border-[#DBEAFE] shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-base text-[#1E3A8A]">
                            {svc.name}
                          </h3>
                          {svc.popular && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 max-w-md">
                          {svc.description}
                        </p>
                        {svc.duration && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span>Estimated time: {svc.duration}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {svc.price && (
                          <div className="text-base sm:text-lg font-black text-blue-700">
                            {svc.price}
                          </div>
                        )}
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenEnquiry(svc.name)}
                          className="font-bold"
                        >
                          Book / Enquire
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: About & Overview */}
            {activeTab === 'about' && (
              <div className="bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-3">About {business.name}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {business.description}
                  </p>
                </div>

                {/* Key stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
                  <div>
                    <div className="text-2xl font-black text-blue-700">{business.yearsInBusiness}+</div>
                    <div className="text-[11px] font-semibold text-slate-500">Years Active</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-blue-700">{business.reviewCount}+</div>
                    <div className="text-[11px] font-semibold text-slate-500">Satisfied Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-blue-700">{business.rating}★</div>
                    <div className="text-[11px] font-semibold text-slate-500">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-blue-700">{business.responseTime}</div>
                    <div className="text-[11px] font-semibold text-slate-500">Quick Response</div>
                  </div>
                </div>

                {/* Contact information breakdown */}
                <div>
                  <h3 className="font-bold text-sm text-[#1E3A8A] mb-3">Direct Contact Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">Primary Phone</span>
                        <a href={`tel:${business.phone}`} className="font-bold text-slate-800 hover:text-blue-600">
                          {business.phone}
                        </a>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">WhatsApp Support</span>
                        <a href={`https://wa.me/${business.whatsapp}`} target="_blank" className="font-bold text-slate-800 hover:text-emerald-600">
                          {business.whatsapp}
                        </a>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">Email Address</span>
                        <span className="font-bold text-slate-800">{business.email}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">Website / Portfolio</span>
                        <span className="font-bold text-blue-600 hover:underline">{business.website}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Photo Gallery */}
            {activeTab === 'gallery' && (
              <div className="bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-8 space-y-4 shadow-xs">
                <div>
                  <h2 className="text-xl font-bold text-[#1E3A8A]">Work & Facility Gallery</h2>
                  <p className="text-xs text-slate-500">Real photos of equipment, facility, and completed jobs</p>
                </div>
                <BusinessGallery images={business.gallery} businessName={business.name} />
              </div>
            )}

            {/* TAB: Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Overview Card */}
                <div className="bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <div className="text-4xl sm:text-5xl font-black text-[#1E3A8A] flex items-center justify-center md:justify-start gap-2">
                      <span>{business.rating}</span>
                      <span className="text-amber-400 text-3xl">★</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Based on <strong>{business.reviewCount}</strong> verified local reviews
                    </p>
                    <div className="mt-2">
                      <Rating value={business.rating} showCount={false} size="lg" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="primary"
                      onClick={() => setIsReviewModalOpen(true)}
                      className="font-bold shadow-md shadow-blue-500/20"
                      leftIcon={<MessageSquare className="w-4 h-4" />}
                    >
                      Write a Review
                    </Button>
                    <span className="text-[11px] text-slate-400">Share your experience with locals</span>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {displayReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DBEAFE] shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#1E3A8A] flex items-center gap-1.5">
                              <span>{rev.userName}</span>
                              {rev.verifiedBooking && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  Verified Customer
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>

                        <Rating value={rev.rating} showCount={false} size="sm" />
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {rev.comment}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Helpful ({rev.helpfulCount || 8})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            {/* Opening Hours Widget */}
            <OpeningHoursCard hours={business.hours} isOpenNow={business.isOpenNow} />

            {/* Address & Mini Map Card */}
            <div className="bg-white rounded-3xl border border-[#DBEAFE] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A]">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Complete Address & Directions</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {business.location.address}, {business.location.city} - {business.location.pincode}
              </p>

              {/* Visual simulated mini-map */}
              <div className="relative h-32 rounded-2xl bg-blue-50 border border-blue-200 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#DBEAFE_1px,transparent_1px),linear-gradient(to_bottom,#DBEAFE_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="text-center relative z-10">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md animate-bounce">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#1E3A8A] block mt-1">
                    {business.location.locality}
                  </span>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${business.name} ${business.location.address} ${business.location.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors border border-blue-200"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Get Driving Directions</span>
              </a>
            </div>

            {/* Quick Enquiry Sticky Card */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-blue-700 text-white rounded-3xl p-6 shadow-xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 text-blue-100 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Zero Commission Quote</span>
              </div>
              <h4 className="text-lg font-black text-white">Need Quick Assistance?</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Send an online query directly to {business.name} management and receive a callback within {business.responseTime}.
              </p>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => handleOpenEnquiry()}
                className="font-bold text-xs"
              >
                Request Free Callback
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DBEAFE] p-3 md:hidden shadow-2xl flex items-center gap-2">
        <Button
          variant="outline"
          size="md"
          onClick={handleOpenCall}
          className="flex-1 font-bold text-xs"
          leftIcon={<Phone className="w-4 h-4 text-blue-600" />}
        >
          Call
        </Button>
        <Button
          variant="whatsapp"
          size="md"
          onClick={handleOpenWhatsapp}
          className="flex-1 font-bold text-xs"
          leftIcon={<MessageCircle className="w-4 h-4 fill-white text-transparent" />}
        >
          WhatsApp
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => handleOpenEnquiry()}
          className="flex-1 font-bold text-xs"
        >
          Enquire
        </Button>
      </div>

      {/* Modals */}
      <ContactModal
        business={business}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        defaultTab={contactType}
      />

      <EnquiryModal
        business={business}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        selectedServiceName={selectedServiceForEnquiry}
      />

      <ReviewModal
        business={business}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}

export default function BusinessDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading business details...</div>}>
      <BusinessDetailsContent />
    </Suspense>
  );
}

