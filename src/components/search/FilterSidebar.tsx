'use client';
import React from 'react';
import { Filter, RotateCcw, Star, Check, ShieldCheck, IndianRupee, Clock, MapPin } from 'lucide-react';
import { POPULAR_CATEGORIES } from '@/data/categories';
import { SUPPORTED_LOCATIONS } from '@/data/locations';
import { cn } from '@/lib/utils';

export interface FilterState {
  category: string;
  location: string;
  rating: number; // 0, 4.0, 4.5
  priceRange: string[]; // ['₹', '₹₹', '₹₹₹', '₹₹₹₹']
  availability: 'all' | 'openNow';
  verifiedOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
  className,
}) => {
  const handleCategoryToggle = (slug: string) => {
    onChange({
      ...filters,
      category: filters.category === slug ? '' : slug,
    });
  };

  const handlePriceToggle = (price: string) => {
    const exists = filters.priceRange.includes(price);
    const updated = exists
      ? filters.priceRange.filter((p) => p !== price)
      : [...filters.priceRange, price];
    onChange({ ...filters, priceRange: updated });
  };

  return (
    <div
      className={cn(
        'bg-white rounded-3xl border border-[#DBEAFE] p-5 shadow-xs space-y-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="font-extrabold text-sm text-[#1E3A8A]">Filters</h3>
          <span className="text-xs text-slate-400">({totalResults} matches)</span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* 1. Verified Businesses Toggle */}
      <div className="pb-4 border-b border-slate-100">
        <label className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/60 border border-blue-200/80 cursor-pointer hover:bg-blue-100/70 transition-colors">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-xs font-bold text-[#1E3A8A] block">
                Verified Only
              </span>
              <span className="text-[10px] text-slate-500 block">
                KYC and address certified
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked })}
            className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* 2. Availability */}
      <div className="pb-4 border-b border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Availability
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...filters, availability: 'all' })}
            className={cn(
              'py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center',
              filters.availability === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            )}
          >
            All Hours
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...filters, availability: 'openNow' })}
            className={cn(
              'py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center',
              filters.availability === 'openNow'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            )}
          >
            Open Now
          </button>
        </div>
      </div>

      {/* 3. Category Filter */}
      <div className="pb-4 border-b border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Category
        </h4>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {POPULAR_CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryToggle(cat.slug)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors text-left',
                  isSelected
                    ? 'bg-blue-100 text-blue-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                )}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Minimum Rating Filter */}
      <div className="pb-4 border-b border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {[
            { val: 0, label: 'Any Rating' },
            { val: 4.0, label: '4.0★ & above' },
            { val: 4.5, label: '4.5★ & above' },
            { val: 4.8, label: '4.8★ & above (Top Rated)' },
          ].map((item) => (
            <label
              key={item.val}
              className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50"
            >
              <span>{item.label}</span>
              <input
                type="radio"
                name="ratingFilter"
                checked={filters.rating === item.val}
                onChange={() => onChange({ ...filters, rating: item.val })}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>

      {/* 5. Price Range (₹ / ₹₹ / ₹₹₹ / ₹₹₹₹) */}
      <div className="pb-4 border-b border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
          Price Level
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {['₹', '₹₹', '₹₹₹', '₹₹₹₹'].map((level) => {
            const isSelected = filters.priceRange.includes(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => handlePriceToggle(level)}
                className={cn(
                  'py-1.5 rounded-xl text-xs font-bold border transition-all text-center',
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                )}
              >
                {level}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 px-0.5">
          <span>Budget</span>
          <span>Moderate</span>
          <span>Premium</span>
          <span>Luxury</span>
        </div>
      </div>

      {/* 6. Location Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          City
        </h4>
        <select
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-800"
        >
          <option value="">All Locations</option>
          {SUPPORTED_LOCATIONS.map((loc) => (
            <option key={loc.city} value={loc.city}>
              {loc.city}, {loc.state}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

