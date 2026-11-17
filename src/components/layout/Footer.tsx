import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Mail, Phone, MapPin, Send, ArrowUpRight } from 'lucide-react';
import { POPULAR_CATEGORIES } from '@/data/categories';
import { SUPPORTED_LOCATIONS } from '@/data/locations';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#DBEAFE] mt-20 text-slate-600">
      {/* Top Customer Value Banner */}
      <div className="bg-[#1E3A8A] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black text-white">
              Need trusted services for your home or everyday needs?
            </h3>
            <p className="text-sm text-blue-200 mt-1">
              Discover verified electricians, salons, mechanics, and cleaners with transparent pricing.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              <span>Explore All Services</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-blue-600/20">
                SF
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#1E3A8A]">
                  ServiFind
                </span>
                <span className="text-xs font-semibold text-[#2563EB]">
                  Local Service Finder Platform
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              ServiFind is your trusted community directory connecting residents with verified, highly rated local professionals and businesses.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 p-2.5 rounded-xl border border-blue-100 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>100% Verified Business Profiles & Real Customer Reviews</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {POPULAR_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/search?category=${cat.slug}`}
                    className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] mb-4">
              More Services
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {POPULAR_CATEGORIES.slice(6, 12).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/search?category=${cat.slug}`}
                    className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Supported Cities & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] mb-4">
              Popular Cities
            </h4>
            <ul className="space-y-2 text-xs font-medium mb-6">
              {SUPPORTED_LOCATIONS.map((loc) => (
                <li key={loc.city}>
                  <Link
                    href={`/search?city=${encodeURIComponent(loc.city)}`}
                    className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{loc.city}, {loc.state}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-8 border-t border-[#DBEAFE] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 ServiFind. All rights reserved.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/" className="hover:text-blue-600 transition-colors">Customer Home</Link>
            <Link href="/business" className="hover:text-blue-600 transition-colors font-semibold text-blue-700">Business Portal</Link>
            <Link href="/admin/login" className="hover:text-blue-600 transition-colors font-semibold text-[#1E3A8A]">Admin Suite</Link>
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors font-semibold text-slate-600">User Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

