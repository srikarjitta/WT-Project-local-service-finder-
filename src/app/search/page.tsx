'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Map as MapIcon,
  X,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { BUSINESSES_DATA } from '@/data/businesses';
import { BusinessCard } from '@/components/business/BusinessCard';
import { FilterSidebar, FilterState } from '@/components/search/FilterSidebar';
import { MapPreviewModal } from '@/components/search/MapPreviewModal';
import { LocationSelector } from '@/components/common/LocationSelector';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { POPULAR_CATEGORIES } from '@/data/categories';

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialCity = searchParams.get('city') || 'Khammam';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentCity, setCurrentCity] = useState(initialCity);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'highestRated' | 'mostReviews' | 'priceAsc' | 'name'>('highestRated');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    location: currentCity,
    rating: 0,
    priceRange: [],
    availability: 'all',
    verifiedOnly: false,
  });

  const handleResetFilters = () => {
    setFilters({
      category: '',
      location: '',
      rating: 0,
      priceRange: [],
      availability: 'all',
      verifiedOnly: false,
    });
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/search?q=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(
        currentCity
      )}${filters.category ? `&category=${filters.category}` : ''}`
    );
  };

  // Filter & Sort Logic
  const filteredBusinesses = useMemo(() => {
    return BUSINESSES_DATA.filter((b) => {
      // 1. Text Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesCat = b.categoryName.toLowerCase().includes(q);
        const matchesSubcat = b.subCategory.toLowerCase().includes(q);
        const matchesDesc = b.description.toLowerCase().includes(q);
        const matchesService = b.services.some((s) => s.name.toLowerCase().includes(q));
        const matchesLoc = b.location.locality.toLowerCase().includes(q) || b.location.city.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesSubcat && !matchesDesc && !matchesService && !matchesLoc) {
          return false;
        }
      }

      // 2. Category
      if (filters.category && b.categoryId !== filters.category) {
        return false;
      }

      // 3. Location / City
      if (filters.location && b.location.city.toLowerCase() !== filters.location.toLowerCase()) {
        return false;
      }

      // 4. Rating
      if (filters.rating > 0 && b.rating < filters.rating) {
        return false;
      }

      // 5. Price range
      if (filters.priceRange.length > 0 && !filters.priceRange.includes(b.priceLevel)) {
        return false;
      }

      // 6. Availability
      if (filters.availability === 'openNow' && !b.isOpenNow) {
        return false;
      }

      // 7. Verified
      if (filters.verifiedOnly && !b.verified) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'highestRated') return b.rating - a.rating;
      if (sortBy === 'mostReviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchQuery, filters, sortBy]);

  const activeCategoryObj = POPULAR_CATEGORIES.find((c) => c.slug === filters.category);

  return (
    <div className="min-h-screen py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Dedicated Search Header Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#DBEAFE] shadow-sm mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-3"
          >
            {/* City Selector */}
            <div className="shrink-0 flex items-center md:border-r border-[#DBEAFE] md:pr-3">
              <LocationSelector
                currentCity={currentCity}
                onSelectCity={(city) => {
                  setCurrentCity(city);
                  setFilters((prev) => ({ ...prev, location: city }));
                }}
              />
            </div>

            {/* Keyword Input */}
            <div className="flex-1 flex items-center bg-slate-50 rounded-2xl px-3.5 py-2.5 border border-slate-200 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search services, businesses, keywords (e.g. AC repair, salon, dental)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="rounded-xl font-bold px-6 shadow-xs"
            >
              Update Search
            </Button>
          </form>

          {/* Quick Category Pill Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold shrink-0">Categories:</span>
            <button
              type="button"
              onClick={() => setFilters({ ...filters, category: '' })}
              className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                !filters.category
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              All
            </button>
            {POPULAR_CATEGORIES.map((cat) => {
              const isSelected = filters.category === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      category: isSelected ? '' : cat.slug,
                    })
                  }
                  className={`px-3 py-1 rounded-full font-semibold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Metadata & Sorting Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DBEAFE]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#1E3A8A]">
                {activeCategoryObj ? activeCategoryObj.name : 'Local Service Providers'}
              </h1>
              {searchQuery && (
                <span className="text-sm text-slate-500">
                  for &quot;<strong className="text-blue-700">{searchQuery}</strong>&quot;
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing <span className="font-bold text-[#1E3A8A]">{filteredBusinesses.length}</span> verified businesses in{' '}
              <span className="font-semibold text-blue-600">{currentCity || 'All Locations'}</span>
            </p>
          </div>

          {/* Right Controls: Sort, View Mode, Map View */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen(true)}
              leftIcon={<SlidersHorizontal className="w-4 h-4 text-blue-600" />}
              className="lg:hidden"
            >
              Filters ({filteredBusinesses.length})
            </Button>

            {/* Map View Toggle Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsMapModalOpen(true)}
              leftIcon={<MapIcon className="w-4 h-4 text-blue-600" />}
            >
              Map View
            </Button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-[#DBEAFE] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-slate-400 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none text-slate-800 font-bold cursor-pointer"
              >
                <option value="highestRated">Highest Rated (★)</option>
                <option value="mostReviews">Most Reviewed</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* View Mode Grid/List toggle (hidden on mobile) */}
            <div className="hidden sm:flex items-center p-1 bg-white border border-[#DBEAFE] rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar + Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              totalResults={filteredBusinesses.length}
            />
          </div>

          {/* Business Results List / Grid */}
          <div className="lg:col-span-3">
            {filteredBusinesses.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {filteredBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Matching Businesses Found"
                description={`We couldn't find any businesses matching your search criteria in ${currentCity}. Try adjusting your filters, selecting a different category, or resetting the filters.`}
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl p-4 overflow-y-auto z-10 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-[#1E3A8A]">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              totalResults={filteredBusinesses.length}
              className="border-none p-0 shadow-none"
            />

            <div className="pt-4 border-t border-slate-100 mt-6 sticky bottom-0 bg-white">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply Filters ({filteredBusinesses.length} Results)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Map View Modal */}
      <MapPreviewModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        businesses={filteredBusinesses}
        currentCity={currentCity}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-[#1E3A8A]">Loading verified services...</p>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}

