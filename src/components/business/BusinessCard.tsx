'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, MessageCircle, Heart, ShieldCheck, Clock, ExternalLink, ArrowRight } from 'lucide-react';
import { Business } from '@/types';
import { Rating } from '@/components/common/Rating';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ContactModal } from './ContactModal';
import { EnquiryModal } from './EnquiryModal';
import { cn } from '@/lib/utils';

interface BusinessCardProps {
  business: Business;
  viewMode?: 'grid' | 'list';
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  viewMode = 'grid',
  isFavorite = false,
  onToggleFavorite,
  className,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [contactType, setContactType] = useState<'call' | 'whatsapp'>('call');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
    onToggleFavorite?.(business.id);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContactType('call');
    setIsContactModalOpen(true);
  };

  const handleWhatsappClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContactType('whatsapp');
    setIsContactModalOpen(true);
  };

  const handleEnquiryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEnquiryModalOpen(true);
  };

  return (
    <>
      <div
        className={cn(
          'group bg-white rounded-2xl md:rounded-3xl border border-[#DBEAFE] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 flex flex-col',
          viewMode === 'list' ? 'md:flex-row' : '',
          className
        )}
      >
        {/* Cover Image & Quick Badges */}
        <div
          className={cn(
            'relative overflow-hidden bg-slate-100 shrink-0',
            viewMode === 'list' ? 'w-full md:w-72 h-52 md:h-auto' : 'w-full h-48 sm:h-52'
          )}
        >
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              {business.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-blue-700 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                  Verified
                </span>
              )}
              {business.featured && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
                  Popular
                </span>
              )}
            </div>

            {/* Favorite Bookmark Button */}
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-white transition-colors shadow-xs"
              aria-label="Add to favourites"
            >
              <Heart
                className={cn('w-4 h-4 transition-colors', favorite ? 'fill-rose-500 text-rose-500' : '')}
              />
            </button>
          </div>

          {/* Bottom Info on image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
            <span className="font-semibold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs">
              {business.categoryName}
            </span>
            <span className="font-bold text-sky-200 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs">
              {business.priceRangeText}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Title & Status */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <Link
                href={`/business/${business.id}`}
                className="group-hover:text-blue-600 transition-colors"
              >
                <h3 className="font-bold text-base sm:text-lg text-[#1E3A8A] line-clamp-1 leading-snug">
                  {business.name}
                </h3>
              </Link>
            </div>

            {/* Tagline */}
            <p className="text-xs text-slate-500 line-clamp-1 mb-2 font-medium">
              {business.tagline}
            </p>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Rating value={business.rating} reviewCount={business.reviewCount} size="sm" />
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span className={cn(business.isOpenNow ? 'text-emerald-700 font-semibold' : 'text-slate-500')}>
                  {business.isOpenNow ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">
                {business.location.locality}, {business.location.city}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
              {business.description}
            </p>

            {/* Services Offered Chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {business.services.slice(0, 3).map((service) => (
                <span
                  key={service.id}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-100"
                >
                  {service.name}
                </span>
              ))}
              {business.services.length > 3 && (
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-500">
                  +{business.services.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#DBEAFE] flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCallClick}
              leftIcon={<Phone className="w-3.5 h-3.5 text-blue-600" />}
              className="flex-1 min-w-[90px]"
            >
              Call
            </Button>

            <Button
              variant="whatsapp"
              size="sm"
              onClick={handleWhatsappClick}
              leftIcon={<MessageCircle className="w-3.5 h-3.5 fill-white text-transparent" />}
              className="px-3"
              aria-label="WhatsApp"
            >
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleEnquiryClick}
              className="flex-1 min-w-[100px] font-semibold"
            >
              Enquire
            </Button>

            <Link href={`/business/${business.id}`} className="shrink-0">
              <Button
                variant="secondary"
                size="sm"
                className="px-2.5"
                aria-label="View Details"
              >
                <ArrowRight className="w-4 h-4 text-[#1E3A8A]" />
              </Button>
            </Link>
          </div>
        </div>
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
      />
    </>
  );
};

