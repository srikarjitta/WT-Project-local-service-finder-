import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { PopularCategories } from '@/components/home/PopularCategories';
import { TrendingServices } from '@/components/home/TrendingServices';
import { TopRatedBusinesses } from '@/components/home/TopRatedBusinesses';
import { RecentlyAddedBusinesses } from '@/components/home/RecentlyAddedBusinesses';
import { HowItWorks } from '@/components/home/HowItWorks';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* A. Hero Section */}
      <HeroSection />

      {/* B. Popular Categories (12 Categories) */}
      <PopularCategories />

      {/* C. Trending Services */}
      <TrendingServices />

      {/* D. Top-Rated Businesses */}
      <TopRatedBusinesses />

      {/* E. Recently Added Businesses */}
      <RecentlyAddedBusinesses />

      {/* F. How It Works (3 Steps) */}
      <HowItWorks />
    </div>
  );
}

