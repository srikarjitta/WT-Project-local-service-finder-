'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, Phone, Star, MapPin, ArrowRight } from 'lucide-react';
import { BUSINESSES_DATA } from '@/data/businesses';
import { MOCK_FAVORITE_IDS } from '@/data/userMockData';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';

export const FavouritesTab: React.FC = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(MOCK_FAVORITE_IDS);

  const favoriteBusinesses = BUSINESSES_DATA.filter((b) =>
    favoriteIds.includes(b.id)
  );

  const handleRemove = (id: string) => {
    setFavoriteIds(favoriteIds.filter((item) => item !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A8A]">My Favourites</h2>
          <p className="text-xs text-slate-500">
            {favoriteBusinesses.length} saved service providers and verified businesses
          </p>
        </div>
      </div>

      {favoriteBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoriteBusinesses.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-[#DBEAFE] overflow-hidden p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={b.coverImage}
                  alt={b.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      {b.categoryName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(b.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove from favourites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link href={`/business/${b.id}`}>
                    <h4 className="font-bold text-sm sm:text-base text-[#1E3A8A] hover:text-blue-600 transition-colors truncate mt-1">
                      {b.name}
                    </h4>
                  </Link>

                  <div className="flex items-center gap-2 text-xs mt-1">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{b.rating}</span>
                    </div>
                    <span className="text-slate-400">({b.reviewCount} reviews)</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{b.location.locality}, {b.location.city}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-700">
                  {b.priceRangeText}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${b.phone.replace(/[^0-9]/g, '')}`}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                    aria-label="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <Link href={`/business/${b.id}`}>
                    <Button variant="primary" size="sm" className="font-bold text-xs">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No Saved Favourites Yet"
          description="Browse local businesses and click the heart icon on any listing card to save it for quick future reference."
          actionLabel="Explore Services"
          onAction={() => (window.location.href = '/search')}
        />
      )}
    </div>
  );
};

