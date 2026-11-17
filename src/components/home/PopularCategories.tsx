import React from 'react';
import Link from 'next/link';
import { POPULAR_CATEGORIES } from '@/data/categories';
import { CategoryCard } from './CategoryCard';
import { ArrowRight, Grid } from 'lucide-react';

export const PopularCategories: React.FC = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <Grid className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E3A8A] tracking-tight">
              Popular Categories
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-1 max-w-xl">
              Browse through our comprehensive directory of 12 essential service categories.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors shrink-0 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 12 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {POPULAR_CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

