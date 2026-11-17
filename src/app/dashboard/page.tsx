'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardSidebar, DashboardTab } from '@/components/dashboard/DashboardSidebar';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { ProfileTab } from '@/components/dashboard/ProfileTab';
import { FavouritesTab } from '@/components/dashboard/FavouritesTab';
import { EnquiriesTab } from '@/components/dashboard/EnquiriesTab';
import { ReviewsTab } from '@/components/dashboard/ReviewsTab';
import { SettingsTab } from '@/components/dashboard/SettingsTab';
import { Menu, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = (searchParams.get('tab') as DashboardTab) || 'overview';

  const [currentTab, setCurrentTab] = useState<DashboardTab>(tabParam);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (tabParam) {
      setCurrentTab(tabParam);
    }
  }, [tabParam]);

  const handleSelectTab = (tab: DashboardTab) => {
    setCurrentTab(tab);
    setIsMobileSidebarOpen(false);
    router.push(`/dashboard?tab=${tab}`);
  };

  return (
    <div className="min-h-screen py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#DBEAFE]">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-[#DBEAFE] text-slate-500 hover:text-blue-600 transition-colors shadow-2xs"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1E3A8A]">
                Customer Dashboard
              </h1>
              <p className="text-xs text-slate-500">
                Manage your service discovery, direct enquiries, and reviews
              </p>
            </div>
          </div>

          {/* Mobile Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-white border border-[#DBEAFE] text-[#1E3A8A] font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Menu className="w-4 h-4 text-blue-600" />
            <span>Menu</span>
          </button>
        </div>

        {/* Dashboard Grid (Sidebar + Main Content Area) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <DashboardSidebar
              currentTab={currentTab}
              onSelectTab={handleSelectTab}
            />
          </div>

          {/* Main Tab View */}
          <div className="lg:col-span-3">
            {currentTab === 'overview' && (
              <OverviewTab onNavigateTab={handleSelectTab} />
            )}
            {currentTab === 'profile' && <ProfileTab />}
            {currentTab === 'favourites' && <FavouritesTab />}
            {currentTab === 'enquiries' && <EnquiriesTab />}
            {currentTab === 'reviews' && <ReviewsTab />}
            {currentTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl p-4 overflow-y-auto z-10 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-[#1E3A8A]">Dashboard Menu</h3>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DashboardSidebar
              currentTab={currentTab}
              onSelectTab={handleSelectTab}
              className="border-none p-0 shadow-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-[#1E3A8A]">Loading Dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

