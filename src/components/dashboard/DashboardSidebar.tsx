'use client';
import React from 'react';
import {
  LayoutDashboard,
  User,
  Heart,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { CURRENT_USER, MOCK_USER_ENQUIRIES, MOCK_USER_REVIEWS, MOCK_FAVORITE_IDS } from '@/data/userMockData';
import { cn } from '@/lib/utils';

export type DashboardTab = 'overview' | 'profile' | 'favourites' | 'enquiries' | 'reviews' | 'settings';

interface DashboardSidebarProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  className?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentTab,
  onSelectTab,
  className,
}) => {
  const navItems = [
    {
      id: 'overview' as DashboardTab,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'profile' as DashboardTab,
      label: 'My Profile',
      icon: User,
    },
    {
      id: 'favourites' as DashboardTab,
      label: 'My Favourites',
      icon: Heart,
      badge: MOCK_FAVORITE_IDS.length,
    },
    {
      id: 'enquiries' as DashboardTab,
      label: 'My Enquiries',
      icon: MessageSquare,
      badge: MOCK_USER_ENQUIRIES.length,
    },
    {
      id: 'reviews' as DashboardTab,
      label: 'My Reviews',
      icon: Star,
      badge: MOCK_USER_REVIEWS.length,
    },
    {
      id: 'settings' as DashboardTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        'bg-white rounded-3xl border border-[#DBEAFE] p-5 shadow-xs flex flex-col justify-between space-y-6',
        className
      )}
    >
      <div className="space-y-6">
        {/* User Mini Profile Header */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100 flex items-center gap-3">
          <img
            src={CURRENT_USER.avatarUrl}
            alt={CURRENT_USER.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-sm text-[#1E3A8A] truncate">
              {CURRENT_USER.name}
            </h4>
            <p className="text-[11px] text-slate-500 truncate">{CURRENT_USER.email}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              Verified Customer
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all text-left',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 font-semibold'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-blue-600')} />
                  <span>{item.label}</span>
                </div>

                {typeof item.badge === 'number' && (
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[11px] font-extrabold',
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sign out notice */}
      <div className="pt-4 border-t border-slate-100">
        <div className="p-3 bg-blue-50/50 rounded-2xl text-center">
          <p className="text-[11px] text-slate-500">
            Member since <strong className="text-slate-700">{CURRENT_USER.memberSince}</strong>
          </p>
          <p className="text-[10px] text-blue-600 font-semibold mt-0.5">
            Default City: {CURRENT_USER.city}
          </p>
        </div>
      </div>
    </aside>
  );
};

