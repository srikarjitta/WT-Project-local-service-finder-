import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { BUSINESSES_DATA } from '@/data/businesses';
import { BusinessCard } from '@/components/business/BusinessCard';

export const RecentlyAddedBusinesses: React.FC = () => {
  // Recently added businesses
  const recentBusinesses = BUSINESSES_DATA.filter((b) => b.isRecentlyAdded || b.establishedYear >= 2019).slice(0, 4);

  return (
    <section className="py-12 md:py-16 bg-blue-50/50 border-y border-[#DBEAFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>New On ServiFind</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E3A8A] tracking-tight">
              Recently Added Businesses
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-1 max-w-xl">
              Freshly verified service providers, diagnostic clinics, and agencies ready to serve you.
            </p>
          </div>

          <Link
            href="/search?sort=recent"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group"
          >
            <span>Explore New Arrivals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Recent businesses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </section>
  );
};

