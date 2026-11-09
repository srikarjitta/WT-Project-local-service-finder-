import React from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';

interface TrendingItem {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  priceStart: string;
  providersCount: number;
  image: string;
  tag: string;
}

const TRENDING_ITEMS: TrendingItem[] = [
  {
    id: 'tr-1',
    name: 'AC Jet Wash & Gas Top-up',
    category: 'Repairs & Maintenance',
    categorySlug: 'repairs-maintenance',
    priceStart: '₹499',
    providersCount: 42,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    tag: 'High Demand',
  },
  {
    id: 'tr-2',
    name: 'Full Villa Deep Sanitisation',
    category: 'Home Services',
    categorySlug: 'home-services',
    priceStart: '₹1,499',
    providersCount: 38,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    tag: 'Trending',
  },
  {
    id: 'tr-3',
    name: 'Bridal Makeup & Hair Styling',
    category: 'Beauty & Wellness',
    categorySlug: 'beauty-wellness',
    priceStart: '₹4,999',
    providersCount: 55,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    tag: 'Wedding Special',
  },
  {
    id: 'tr-4',
    name: 'Car Ceramic Coating & Wash',
    category: 'Automotive',
    categorySlug: 'automotive',
    priceStart: '₹999',
    providersCount: 29,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    tag: 'Best Value',
  },
  {
    id: 'tr-5',
    name: 'Luxury AC Banquet Halls',
    category: 'Wedding & Events',
    categorySlug: 'wedding-events',
    priceStart: '₹50,000',
    providersCount: 24,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    tag: 'Top Venues',
  },
  {
    id: 'tr-6',
    name: 'Painless Laser Dental Care',
    category: 'Healthcare',
    categorySlug: 'healthcare',
    priceStart: '₹500',
    providersCount: 61,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    tag: 'Verified Clinic',
  },
];

export const TrendingServices: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-blue-50/60 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Most Requested This Month</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E3A8A] tracking-tight">
              Trending Services Near You
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-1 max-w-xl">
              Services with the highest booking velocity and customer ratings right now.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group"
          >
            <span>Explore All Trending</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trending Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRENDING_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={`/search?q=${encodeURIComponent(item.name)}&category=${item.categorySlug}`}
              className="group bg-white rounded-3xl border border-[#DBEAFE] overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {item.tag}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-blue-200">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-base text-white line-clamp-1 drop-shadow-xs">
                      {item.name}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between bg-white text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Starts from</span>
                  <span className="text-base font-extrabold text-[#1E3A8A]">{item.priceStart}</span>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 font-medium block">
                    {item.providersCount} verified providers
                  </span>
                  <span className="text-blue-600 font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Find Specialists <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

