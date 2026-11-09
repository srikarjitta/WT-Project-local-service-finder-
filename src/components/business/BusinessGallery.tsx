'use client';
import React, { useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface BusinessGalleryProps {
  images: string[];
  businessName: string;
}

export const BusinessGallery: React.FC<BusinessGalleryProps> = ({
  images,
  businessName,
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className="relative h-28 sm:h-36 rounded-2xl overflow-hidden cursor-pointer group bg-slate-100 border border-[#DBEAFE]"
            >
              <img
                src={img}
                alt={`${businessName} photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/90 text-[#1E3A8A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <ImageIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setActiveIdx(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            onClick={() => setActiveIdx((activeIdx - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next */}
          <button
            onClick={() => setActiveIdx((activeIdx + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl">
            <img
              src={images[activeIdx]}
              alt={`${businessName} full preview`}
              className="max-h-[80vh] w-auto mx-auto object-contain rounded-2xl"
            />
            <p className="text-center text-xs text-white/70 mt-3">
              Photo {activeIdx + 1} of {images.length} • {businessName}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

