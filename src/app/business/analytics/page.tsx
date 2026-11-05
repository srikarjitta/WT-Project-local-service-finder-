"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Eye,
  Phone,
  MessageCircle,
  Search,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Zap,
  Target,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBusiness } from "@/context/BusinessContext";

export default function BusinessAnalyticsPage() {
  const { stats, enquiries, services, business } = useBusiness();

  const wonCount = enquiries.filter((e) => e.status === "won").length;
  const contactedCount = enquiries.filter((e) => e.status === "contacted" || e.status === "quote_sent").length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/business" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Discovery & Analytics</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Track local search impressions, click-to-call actions, and lead conversion rates.
            </p>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Search Impressions
            </CardTitle>
            <Eye className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.profileImpressions.toLocaleString()}</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ +24% in {business.locality}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Phone Number Clicks
            </CardTitle>
            <Phone className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.phoneCallClicks}</div>
            <p className="text-[11px] text-slate-500 mt-1">Direct call button triggers</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              WhatsApp Chats
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.whatsappInquiries}</div>
            <p className="text-[11px] text-slate-500 mt-1">Instant WhatsApp lead starts</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Locality Rank
            </CardTitle>
            <Target className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">#{stats.searchRankLocality}</div>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">Top 3 in {business.locality}</p>
          </CardContent>
        </Card>
      </div>

      {/* Discovery Funnel & Top Search Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Customer Discovery Funnel</CardTitle>
            <CardDescription className="text-xs">
              How search impressions translate into paid jobs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>1. Local Search Impressions</span>
                  <span>2,480 views (100%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-600 h-3 rounded-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>2. Profile & Listing Page Opens</span>
                  <span>620 visitors (25%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-500 h-3 rounded-full w-[25%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>3. Contact Actions (Call & WhatsApp)</span>
                  <span>276 actions (11%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-sky-500 h-3 rounded-full w-[11%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>4. Direct Enquiries & Quotes</span>
                  <span>{enquiries.length} leads</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-amber-500 h-3 rounded-full w-[6%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>5. Completed & Won Jobs</span>
                  <span>{wonCount} confirmed jobs</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-emerald-500 h-3 rounded-full w-[4%]" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Overall Conversion: <strong>High Intent</strong></span>
              <span className="text-emerald-600 font-semibold">⚡ Verified Quality</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Search Keywords in Locality */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Search Queries</CardTitle>
            <CardDescription className="text-xs">
              Keywords used by customers in {business.locality} that triggered your listing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="divide-y divide-slate-100">
              {stats.topSearchKeywords.map((item, idx) => (
                <div key={item.keyword} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-900">{item.keyword}</span>
                  </div>
                  <span className="text-slate-500 font-medium">{item.searches} searches</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 space-y-1 mt-4">
              <div className="font-bold flex items-center">
                <Zap className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                Local SEO Recommendation
              </div>
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Add <em>"AC Power Point Fitting"</em> to your specializations tag list to capture an additional ~180 searches per month in Indiranagar.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
