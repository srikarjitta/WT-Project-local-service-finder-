'use client';
import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Heart,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_USER_ENQUIRIES, MOCK_USER_REVIEWS, MOCK_FAVORITE_IDS, CURRENT_USER } from '@/data/userMockData';
import { BUSINESSES_DATA } from '@/data/businesses';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

interface OverviewTabProps {
  onNavigateTab: (tab: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab }) => {
  const stats = [
    {
      label: 'Active Enquiries',
      value: MOCK_USER_ENQUIRIES.length,
      icon: MessageSquare,
      color: 'bg-blue-600',
      tab: 'enquiries',
    },
    {
      label: 'Saved Businesses',
      value: MOCK_FAVORITE_IDS.length,
      icon: Heart,
      color: 'bg-rose-500',
      tab: 'favourites',
    },
    {
      label: 'Reviews Posted',
      value: MOCK_USER_REVIEWS.length,
      icon: Star,
      color: 'bg-amber-500',
      tab: 'reviews',
    },
    {
      label: 'Responded Requests',
      value: MOCK_USER_ENQUIRIES.filter((e) => e.status === 'Responded').length,
      icon: CheckCircle2,
      color: 'bg-emerald-600',
      tab: 'enquiries',
    },
  ];

  const recentEnquiries = MOCK_USER_ENQUIRIES.slice(0, 3);
  const favoriteBusinesses = BUSINESSES_DATA.filter((b) =>
    MOCK_FAVORITE_IDS.includes(b.id)
  ).slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-blue-700 to-blue-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Customer Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Hello, {CURRENT_USER.name}!
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            Manage your service quotes, keep track of provider responses, and discover trusted professionals in {CURRENT_USER.city}.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(stat.tab)}
              className="bg-white rounded-3xl p-5 border border-[#DBEAFE] shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#1E3A8A]">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries Table / Card Section */}
      <div className="bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1E3A8A]">Recent Enquiries & Quotes</h3>
            <p className="text-xs text-slate-500">Latest updates from your requested service providers</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('enquiries')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All ({MOCK_USER_ENQUIRIES.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Business</th>
                <th className="pb-3">Service Requested</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-slate-800 flex items-center gap-2.5">
                    <img
                      src={enq.businessImage}
                      alt={enq.businessName}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <div className="line-clamp-1">{enq.businessName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{enq.businessCategory}</div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-600 font-medium">
                    {enq.serviceRequested}
                  </td>
                  <td className="py-3.5 text-slate-500 whitespace-nowrap">
                    {enq.date}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        enq.status === 'Responded'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : enq.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <Link
                      href={`/business/${enq.businessId}`}
                      className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Favourites Preview */}
      <div className="bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1E3A8A]">Saved Favourites</h3>
            <p className="text-xs text-slate-500">Quick access to your preferred specialists</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('favourites')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Manage Favourites</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoriteBusinesses.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={b.coverImage}
                  alt={b.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1E3A8A] line-clamp-1">{b.name}</h4>
                  <p className="text-[11px] text-slate-500">{b.categoryName} • {b.location.locality}</p>
                  <div className="text-[11px] font-bold text-amber-500">{b.rating}★ ({b.reviewCount} reviews)</div>
                </div>
              </div>

              <Link
                href={`/business/${b.id}`}
                className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-2xs shrink-0"
              >
                Contact
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

