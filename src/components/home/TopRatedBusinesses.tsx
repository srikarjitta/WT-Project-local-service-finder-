import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { BUSINESSES_DATA } from '@/data/businesses';
import { BusinessCard } from '@/components/business/BusinessCard';

export const TopRatedBusinesses: React.FC = () => {
  // Select top rated businesses
  const topBusinesses = BUSINESSES_DATA.filter((b) => b.rating >= 4.7).slice(0, 4);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E3A8A] tracking-tight">
              Top-Rated Local Businesses
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-1 max-w-xl">
              Hand-picked verified service providers backed by outstanding reviews from local residents.
            </p>
          </div>

          <Link
            href="/search?sort=rating"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group"
          >
            <span>View All Top Rated</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </section>
  );
};

