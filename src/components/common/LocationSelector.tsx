'use client';
import React, { useState } from 'react';
import { MapPin, ChevronDown, Check, Search, X } from 'lucide-react';
import { SUPPORTED_LOCATIONS } from '@/data/locations';
import { cn } from '@/lib/utils';

interface LocationSelectorProps {
  currentCity?: string;
  onSelectCity?: (city: string) => void;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentCity = 'Khammam',
  onSelectCity,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = SUPPORTED_LOCATIONS.filter(
    (loc) =>
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.popularLocalities.some((l) =>
        l.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleSelect = (city: string) => {
    setSelectedCity(city);
    onSelectCity?.(city);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#1E3A8A] bg-blue-50/80 hover:bg-blue-100/80 rounded-xl border border-blue-200/70 transition-colors shadow-2xs group"
        aria-expanded={isOpen}
      >
        <MapPin className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
        <span className="truncate max-w-[110px] md:max-w-[130px]">{selectedCity}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-blue-500 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-2xs"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-80 md:w-96 rounded-2xl bg-white shadow-2xl border border-[#DBEAFE] z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50 to-sky-50/50 border-b border-blue-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#1E3A8A]">Select Your City</h4>
                <p className="text-xs text-slate-500">Discover service providers near you</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search city or locality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => {
                  const isCurrent = loc.city.toLowerCase() === selectedCity.toLowerCase();
                  return (
                    <div
                      key={loc.city}
                      onClick={() => handleSelect(loc.city)}
                      className={cn(
                        'p-2.5 rounded-xl cursor-pointer transition-all flex items-start justify-between group',
                        isCurrent
                          ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1E3A8A] group-hover:text-blue-600">
                            {loc.city}
                          </span>
                          <span className="text-[11px] text-slate-400 px-1.5 py-0.2 rounded-sm bg-slate-100">
                            {loc.state}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {loc.popularLocalities.slice(0, 4).join(', ')}
                        </p>
                      </div>

                      {isCurrent && (
                        <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No cities found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

