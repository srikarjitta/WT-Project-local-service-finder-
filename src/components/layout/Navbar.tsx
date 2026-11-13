'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Menu,
  X,
  User,
  Heart,
  MessageSquare,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Shield,
  Sparkles,
  Layers,
} from 'lucide-react';
import { LocationSelector } from '@/components/common/LocationSelector';
import { AuthModal } from '@/components/common/AuthModal';
import { Button } from '@/components/common/Button';
import { POPULAR_CATEGORIES } from '@/data/categories';
import { CURRENT_USER } from '@/data/userMockData';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // default logged in to show rich dashboard features easily
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [currentCity, setCurrentCity] = useState('Khammam');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(navSearch.trim())}&city=${encodeURIComponent(currentCity)}`);
    } else {
      router.push(`/search?city=${encodeURIComponent(currentCity)}`);
    }
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleOpenSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#DBEAFE] shadow-2xs">
        {/* Top Mini Banner */}
        <div className="bg-[#1E3A8A] text-white text-[11px] md:text-xs py-1.5 px-4 font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/30 text-sky-200 px-2 py-0.5 rounded-full font-bold text-[10px]">
                LOCAL HUB
              </span>
              <span className="hidden sm:inline text-blue-100">
                Discover 5,000+ verified local professionals & businesses in {currentCity}
              </span>
              <span className="sm:hidden text-blue-100">Verified local professionals</span>
            </div>

            <div className="flex items-center gap-4 text-blue-200">
              {/* Quick toggle to let user preview guest vs logged in state */}
              <button
                type="button"
                onClick={() => setIsLoggedIn(!isLoggedIn)}
                className="text-[11px] hover:text-white underline decoration-blue-400 font-semibold cursor-pointer"
              >
                Switch to: {isLoggedIn ? 'Guest View' : 'Logged-in Customer'}
              </button>
              <Link href="/dashboard" className="hover:text-white hidden md:inline">
                Customer Support
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-3 md:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white font-extrabold text-base md:text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform tracking-wide">
                LSF
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-[#0F172A] group-hover:text-blue-600 transition-colors leading-tight">
                  Local Service Finder
                </span>
                <span className="text-xs font-semibold text-[#6366F1] leading-tight mt-0.5">
                  Customer Portal
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <div className="hidden lg:block shrink-0">
              <LocationSelector
                currentCity={currentCity}
                onSelectCity={(city) => setCurrentCity(city)}
              />
            </div>

            {/* Search Bar in Navbar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-md items-center relative"
            >
              <div className="w-full flex items-center bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all overflow-hidden shadow-2xs">
                <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search electricians, salons, AC repair..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs md:text-sm bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 my-1 mr-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Categories Mega Dropdown */}
            <div className="relative hidden xl:block">
              <button
                type="button"
                onClick={() => setIsCategoriesMenuOpen(!isCategoriesMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Categories</span>
                <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', isCategoriesMenuOpen && 'rotate-180')} />
              </button>

              {isCategoriesMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsCategoriesMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-96 rounded-2xl bg-white shadow-2xl border border-[#DBEAFE] p-4 z-30 grid grid-cols-2 gap-2 animate-in fade-in-50 zoom-in-95 duration-150">
                    {POPULAR_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/search?category=${cat.slug}`}
                        onClick={() => setIsCategoriesMenuOpen(false)}
                        className="p-2 rounded-xl hover:bg-blue-50 flex items-center gap-2.5 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 line-clamp-1">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Auth / Profile Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isLoggedIn ? (
                /* Profile Dropdown for Logged-In Customer */
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl border border-blue-200/80 bg-blue-50/60 hover:bg-blue-100/70 transition-all text-left group"
                  >
                    <img
                      src={CURRENT_USER.avatarUrl}
                      alt={CURRENT_USER.name}
                      className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-500/20"
                    />
                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-[#1E3A8A] leading-tight">
                        {CURRENT_USER.name}
                      </div>
                      <div className="text-[10px] text-blue-600 font-semibold">
                        Customer
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform',
                        isProfileMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Profile Menu Popup */}
                  {isProfileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-[#DBEAFE] overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                          <p className="text-xs text-slate-500">Signed in as</p>
                          <p className="text-sm font-bold text-[#1E3A8A] truncate">{CURRENT_USER.name}</p>
                          <p className="text-xs text-slate-500 truncate">{CURRENT_USER.email}</p>
                        </div>

                        <div className="p-2 space-y-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-600" />
                            <span>Dashboard Overview</span>
                          </Link>
                          <Link
                            href="/dashboard?tab=enquiries"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            <span>My Enquiries</span>
                          </Link>
                          <Link
                            href="/dashboard?tab=favourites"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>My Favourites</span>
                          </Link>
                          <Link
                            href="/dashboard?tab=profile"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <User className="w-4 h-4 text-blue-600" />
                            <span>My Profile</span>
                          </Link>
                        </div>

                        <div className="p-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Guest Buttons */
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenLogin}
                    className="font-bold text-xs md:text-sm text-[#1E3A8A]"
                  >
                    Log In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleOpenSignup}
                    className="font-bold text-xs md:text-sm"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 md:hidden"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#DBEAFE] bg-white p-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
            {/* Location selector on mobile */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Your Location
              </span>
              <LocationSelector
                currentCity={currentCity}
                onSelectCity={(city) => setCurrentCity(city)}
                className="w-full"
              />
            </div>

            {/* Search form on mobile */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search local businesses..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full pl-9 pr-20 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                Go
              </button>
            </form>

            {/* Quick Category Links */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Popular Categories
              </span>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_CATEGORIES.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/search?category=${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-xs font-medium text-slate-700 bg-blue-50/60 rounded-xl hover:bg-blue-100 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Auth actions */}
            {!isLoggedIn && (
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleOpenLogin}
                  size="sm"
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleOpenSignup}
                  size="sm"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsLoggedIn(true)}
      />
    </>
  );
};

