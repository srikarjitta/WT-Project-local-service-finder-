'use client';
import React, { useState } from 'react';
import { X, MapPin, Navigation, Phone, ExternalLink, Star } from 'lucide-react';
import { Business } from '@/types';
import Link from 'next/link';

interface MapPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: Business[];
  currentCity: string;
}

export const MapPreviewModal: React.FC<MapPreviewModalProps> = ({
  isOpen,
  onClose,
  businesses,
  currentCity,
}) => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    businesses[0] || null
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-3xl shadow-2xl border border-[#DBEAFE] overflow-hidden z-10 flex flex-col animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-sky-300" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Map View — Local Service Providers in {currentCity}
              </h3>
              <p className="text-[11px] text-blue-200">
                Interactive map representation with verified geo-tagged locations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Body Simulated Interface */}
        <div className="flex-1 relative bg-slate-100 overflow-hidden flex flex-col md:flex-row">
          {/* Simulated Map Canvas */}
          <div className="flex-1 relative bg-[#E5ECF6] overflow-hidden p-6 flex items-center justify-center">
            {/* Grid styling mimicking high-tech maps */}
            <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#DBEAFE_1px,transparent_1px),linear-gradient(to_bottom,#DBEAFE_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute inset-0 bg-radial from-transparent to-blue-900/10" />

            {/* Simulated Road Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
              <path
                d="M-50,200 Q200,100 500,250 T1000,150"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="12"
              />
              <path
                d="M100,-50 Q250,300 400,600"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="8"
              />
              <path
                d="M500,-50 L600,600"
                fill="none"
                stroke="#FDE047"
                strokeWidth="4"
              />
            </svg>

            {/* City Center Landmark Pill */}
            <div className="absolute top-6 left-6 px-3 py-1.5 bg-white/90 backdrop-blur-xs rounded-xl shadow-md border border-blue-200 text-xs font-bold text-[#1E3A8A] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Center: {currentCity} Town Circle</span>
            </div>

            {/* Business Markers on Simulated Canvas */}
            <div className="relative w-full max-w-lg h-72">
              {businesses.slice(0, 6).map((b, idx) => {
                const positions = [
                  { top: '25%', left: '20%' },
                  { top: '35%', left: '60%' },
                  { top: '65%', left: '30%' },
                  { top: '70%', left: '75%' },
                  { top: '15%', left: '80%' },
                  { top: '50%', left: '45%' },
                ];
                const pos = positions[idx % positions.length];
                const isSelected = selectedBusiness?.id === b.id;

                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBusiness(b)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`px-2.5 py-1 rounded-xl shadow-lg flex items-center gap-1.5 font-bold text-xs border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-700 shadow-blue-500/30'
                          : 'bg-white text-[#1E3A8A] border-blue-200 hover:border-blue-400'
                      }`}
                    >
                      <MapPin
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-white' : 'text-blue-600'
                        }`}
                      />
                      <span className="max-w-[90px] truncate">{b.name}</span>
                    </div>
                    {/* Pin tail */}
                    <div
                      className={`w-2 h-2 rotate-45 mx-auto -mt-1 ${
                        isSelected ? 'bg-blue-600' : 'bg-white'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Preview Drawer / Card for Selected Business */}
          {selectedBusiness && (
            <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-[#DBEAFE] p-4 flex flex-col justify-between shrink-0 shadow-lg">
              <div>
                <div className="relative h-32 rounded-2xl overflow-hidden mb-3">
                  <img
                    src={selectedBusiness.coverImage}
                    alt={selectedBusiness.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-semibold">
                    {selectedBusiness.categoryName}
                  </div>
                </div>

                <h4 className="font-bold text-sm text-[#1E3A8A] mb-1 line-clamp-1">
                  {selectedBusiness.name}
                </h4>

                <div className="flex items-center gap-2 mb-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedBusiness.rating}</span>
                  </div>
                  <span className="text-slate-400">({selectedBusiness.reviewCount} reviews)</span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {selectedBusiness.location.address}
                </p>

                <div className="p-2.5 rounded-xl bg-blue-50 text-[11px] text-blue-900 border border-blue-100 flex items-center justify-between font-semibold">
                  <span>Price Range:</span>
                  <span className="text-blue-700 font-extrabold">{selectedBusiness.priceRangeText}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <Link
                  href={`/business/${selectedBusiness.id}`}
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl text-center shadow-xs"
                >
                  View Details
                </Link>
                <a
                  href={`tel:${selectedBusiness.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3 py-2.5 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 flex items-center justify-center"
                  aria-label="Call"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

