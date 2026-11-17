'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { LocationSelector } from '@/components/common/LocationSelector';
import { Button } from '@/components/common/Button';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('Khammam');
  const [serviceQuery, setServiceQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(serviceQuery.trim())}&city=${encodeURIComponent(selectedCity)}`);
    } else {
      router.push(`/search?city=${encodeURIComponent(selectedCity)}`);
    }
  };

  const quickPills = [
    { label: 'AC Service', query: 'AC Service & Repair' },
    { label: 'Beauty Salon', query: 'Hair Salons' },
    { label: 'Plumbers', query: 'Plumbers' },
    { label: 'Dentists', query: 'Dentists' },
    { label: 'Car Repair', query: 'Car Servicing & Mechanics' },
    { label: 'Banquet Halls', query: 'Banquet Halls' },
    { label: 'Deep Cleaning', query: 'Deep Cleaning' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Subtle modern geometric background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute top-32 left-10 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-blue-100/50 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Trust Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DBEAFE] shadow-xs text-xs font-bold text-[#1E3A8A] mb-6 animate-in fade-in-50 duration-300">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>India&apos;s Trusted Local Service & Business Directory</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-blue-400" />
          <span className="hidden sm:inline text-blue-600 font-semibold">100% Free Quotes</span>
        </div>

        {/* Hero Heading as explicitly requested */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1E3A8A] tracking-tight leading-tight max-w-4xl mx-auto mb-4">
          Find the Right Service <span className="text-blue-600">Near You</span>
        </h1>

        {/* Description as explicitly requested */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8 md:mb-10 font-normal leading-relaxed">
          Discover trusted local businesses and professionals for your everyday needs.
        </p>

        {/* Search Bar Container */}
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="p-2 sm:p-2.5 bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-500/10 border border-[#DBEAFE] flex flex-col md:flex-row items-stretch md:items-center gap-2 transition-all focus-within:border-blue-400 focus-within:shadow-2xl"
          >
            {/* Location Selector in Hero */}
            <div className="shrink-0 flex items-center px-2 py-1 md:border-r border-[#DBEAFE]">
              <LocationSelector
                currentCity={selectedCity}
                onSelectCity={(city) => setSelectedCity(city)}
                className="w-full md:w-auto"
              />
            </div>

            {/* Service Input */}
            <div className="flex-1 flex items-center px-3 py-2">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                value={serviceQuery}
                onChange={(e) => setServiceQuery(e.target.value)}
                placeholder="What service are you looking for? (e.g. AC service, catering, spa...)"
                className="w-full text-xs sm:text-sm md:text-base bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Search CTA Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="rounded-xl sm:rounded-2xl font-bold px-6 shadow-md shadow-blue-600/25 shrink-0"
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Search
            </Button>
          </form>

          {/* Quick Trend Search Pills */}
          <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular searches:
            </span>
            {quickPills.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={() => {
                  setServiceQuery(pill.query);
                  router.push(`/search?q=${encodeURIComponent(pill.query)}&city=${encodeURIComponent(selectedCity)}`);
                }}
                className="px-3 py-1 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-blue-600 font-medium border border-blue-100 hover:border-blue-300 shadow-2xs transition-all hover:scale-105"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Badges below Hero */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-blue-200/50 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl border border-blue-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1E3A8A]">Verified Experts</div>
              <div className="text-[11px] text-slate-500">KYC & background checked</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl border border-blue-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1E3A8A]">Upfront Prices</div>
              <div className="text-[11px] text-slate-500">No hidden surprises</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl border border-blue-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1E3A8A]">Instant Connect</div>
              <div className="text-[11px] text-slate-500">Call or WhatsApp in 1 click</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl border border-blue-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
              <span className="font-extrabold text-blue-700 text-sm">4.8★</span>
            </div>
            <div>
              <div className="text-xs font-bold text-[#1E3A8A]">Real Reviews</div>
              <div className="text-[11px] text-slate-500">From verified customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

