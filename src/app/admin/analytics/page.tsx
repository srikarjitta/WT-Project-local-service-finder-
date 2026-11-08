"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Building2,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  FolderTree,
  MessageSquare,
  Star,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminAnalyticsPage() {
  const { metrics, businesses, users, categories, reviews } = useAdmin();
  const [timeRange, setTimeRange] = useState("30d");

  // Export actual database aggregate metrics (JSON)
  const handleExportData = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      platform: "ServiFind",
      databaseAggregates: {
        totalBusinesses: businesses.length,
        approvedBusinesses: businesses.filter((b) => b.status === "approved").length,
        pendingApprovals: businesses.filter((b) => b.status === "pending").length,
        totalUsers: users.length,
        customerCount: users.filter((u) => u.role === "customer").length,
        businessOwnerCount: users.filter((u) => u.role === "business_owner").length,
        totalCategories: categories.length,
        totalReviews: reviews.length,
        averageRating: metrics.avgRating,
      },
      categoryDistribution: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        isActive: c.isActive,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `servifind-db-analytics-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* ── 1. HEADER ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1E3A8A] font-sans">
              Platform Analytics & Database Metrics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Supabase Aggregates
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real platform operations statistics based on actual profiles, verified businesses, categories, and review records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time Records</option>
          </select>

          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Metrics JSON</span>
          </button>
        </div>
      </div>

      {/* ── 2. ACTUAL DATABASE AGGREGATE CARDS ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Total Service Enquiries
          </span>
          <div className="text-2xl font-black text-[#1E3A8A]">
            {metrics.totalEnquiries.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <Activity className="w-3.5 h-3.5" />
            <span>Actual enquiry count in database</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Registered Profiles
          </span>
          <div className="text-2xl font-black text-[#1E3A8A]">
            {metrics.totalUsers}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <span>{metrics.totalCustomers} customers · {metrics.totalBusinessOwners} owners</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Live Category Taxonomy
          </span>
          <div className="text-2xl font-black text-[#1E3A8A]">
            {categories.length} Sectors
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{categories.filter((c) => c.isActive).length} active in customer navigation</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Customer CSAT Rating
          </span>
          <div className="text-2xl font-black text-[#1E3A8A]">
            {metrics.avgRating} / 5.0
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Aggregated from {metrics.totalReviews} reviews</span>
          </div>
        </div>
      </div>

      {/* ── 3. VISUAL BREAKDOWNS ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Category List from Database */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-[#1E3A8A] font-sans">
              Database Service Categories
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {categories.length} total categories
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 text-xs divide-y divide-slate-100">
            {categories.slice(0, 8).map((cat) => (
              <div key={cat.id} className="pt-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{cat.name}</div>
                  <div className="text-[11px] font-mono text-[#2563EB]">/{cat.slug}</div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    cat.isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Businesses Status Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-[#1E3A8A] font-sans">
              Business Approval Status Breakdown
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {businesses.length} listed
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Approved & Verified Listings</span>
                <span className="text-emerald-700 font-extrabold">
                  {metrics.approvedBusinesses}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Live in customer discovery and eligible for enquiries.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Pending Admin Verification</span>
                <span className="text-amber-700 font-extrabold">
                  {metrics.pendingApprovals}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Awaiting documentation review before public listing.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Suspended / Compliance Review</span>
                <span className="text-rose-700 font-extrabold">
                  {metrics.suspendedBusinesses}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Temporarily hidden from search due to customer dispute investigations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
