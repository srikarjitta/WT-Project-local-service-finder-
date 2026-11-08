"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Star,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers,
  FileText,
  BadgeAlert,
  XCircle,
  ThumbsUp,
} from "lucide-react";
import { useAdmin, AdminBusiness } from "@/context/AdminContext";
import { Modal } from "@/components/ui/modal";

export default function AdminDashboardPage() {
  const {
    metrics,
    businesses,
    users,
    reviews,
    reports,
    approveBusiness,
    rejectBusiness,
    seedMoreDemoData,
    selectedCity,
  } = useAdmin();

  // State for Review/Reject modal
  const [selectedForReview, setSelectedForReview] = useState<AdminBusiness | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedForReject, setSelectedForReject] = useState<AdminBusiness | null>(null);

  // Filter pending businesses
  const pendingBusinesses = businesses.filter((b) => b.status === "pending");

  // Recent 4 businesses
  const recentBusinesses = businesses.slice(0, 5);

  const handleConfirmReject = () => {
    if (selectedForReject && rejectReason.trim()) {
      rejectBusiness(selectedForReject.id, rejectReason.trim());
      setRejectModalOpen(false);
      setRejectReason("");
      setSelectedForReject(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── 1. WELCOME & OPERATIONS BANNER ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] p-6 sm:p-8 text-white shadow-lg shadow-blue-900/10 relative overflow-hidden"
      >
        {/* Subtle Decorative Background Circles */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none blur-xl" />
        <div className="absolute right-40 bottom-0 -mb-12 w-48 h-48 rounded-full bg-blue-400/10 pointer-events-none blur-lg" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>ServiFind Executive Operations Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Welcome back, Administrator
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Real-time governance dashboard for multi-city local service discovery,
              provider compliance, quality assurance, and customer dispute handling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/businesses?status=pending"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#1E3A8A] hover:bg-blue-50 font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Review Verification Queue ({metrics.pendingApprovals})</span>
            </Link>
            <button
              onClick={() => seedMoreDemoData()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Simulate Provider Registration</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── 2. KEY METRICS STAT CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Businesses */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Listed Service Providers
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#1E3A8A]">
              {metrics.totalBusinesses}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              +14% MoM
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>Approved & Live: {metrics.approvedBusinesses}</span>
            <Link
              href="/admin/businesses"
              className="text-[#2563EB] font-bold hover:underline"
            >
              Directory →
            </Link>
          </div>
        </motion.div>

        {/* Pending Verifications */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className={`rounded-2xl p-5 border shadow-xs transition-all ${
            metrics.pendingApprovals > 0
              ? "bg-amber-50/70 border-amber-200"
              : "bg-white border-slate-200/90"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Pending Verification
            </span>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                metrics.pendingApprovals > 0
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl font-extrabold ${
                metrics.pendingApprovals > 0 ? "text-amber-900" : "text-[#1E3A8A]"
              }`}
            >
              {metrics.pendingApprovals}
            </span>
            {metrics.pendingApprovals > 0 && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Requires Action
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
            <span>Avg review SLA: &lt; 4 hrs</span>
            <Link
              href="/admin/businesses?status=pending"
              className="text-amber-800 font-bold hover:underline"
            >
              Open Queue →
            </Link>
          </div>
        </motion.div>

        {/* Registered Platform Users */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Registered Accounts
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#1E3A8A]">
              {metrics.totalUsers}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              ({metrics.totalCustomers} customers)
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>Owners: {metrics.totalBusinessOwners}</span>
            <Link
              href="/admin/users"
              className="text-[#2563EB] font-bold hover:underline"
            >
              Manage Users →
            </Link>
          </div>
        </motion.div>

        {/* Enquiries & Value Facilitated */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Customer Enquiries & Leads
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#1E3A8A]">
              {metrics.totalEnquiries.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              Live Leads
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>Avg {metrics.avgRating} ★ across reviews</span>
            <Link
              href="/admin/analytics"
              className="text-[#2563EB] font-bold hover:underline"
            >
              Analytics →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── 3. URGENT APPROVAL WORKFLOW QUEUE ──────────────────────────── */}
      {pendingBusinesses.length > 0 && (
        <section className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <h2 className="text-base font-extrabold text-[#1E3A8A] font-sans">
                  Action Required: Pending Provider Approvals
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  {pendingBusinesses.length} awaiting review
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                New businesses must be verified for government licenses, address validity,
                and contact numbers before appearing on the public customer directory.
              </p>
            </div>

            <Link
              href="/admin/businesses?status=pending"
              className="text-xs text-[#2563EB] hover:text-[#1E3A8A] font-bold flex items-center gap-1 hover:underline"
            >
              <span>View Full Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBusinesses.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 hover:border-blue-300 hover:bg-white transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80">
                      {b.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1.5">
                      {b.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {b.tagline}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                    Pending
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {b.locality}, {b.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      Owner: {b.ownerName} ({b.ownerEmail})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    onClick={() => setSelectedForReview(b)}
                    className="text-xs font-semibold text-slate-600 hover:text-[#1E3A8A] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Inspect Details
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedForReject(b);
                        setRejectModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveBusiness(b.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      ✓ Approve Listing
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 4. ANALYTICS PREVIEW & SERVICE TAXONOMY BREAKDOWN ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Enquiries Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-[#1E3A8A] font-sans">
                Customer Enquiry Velocity & Lead Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Weekly traffic across 6 core service sectors ({selectedCity})
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              High Demand
            </span>
          </div>

          {/* Clean Mock Bar Chart */}
          <div className="pt-2">
            <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {[
                { day: "Mon", val: 54, leads: 132 },
                { day: "Tue", val: 68, leads: 164 },
                { day: "Wed", val: 78, leads: 198 },
                { day: "Thu", val: 62, leads: 150 },
                { day: "Fri", val: 92, leads: 240 },
                { day: "Sat", val: 100, leads: 295 },
                { day: "Sun", val: 86, leads: 210 },
              ].map((item) => (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                >
                  <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.leads}
                  </div>
                  <div
                    style={{ height: `${item.val}%` }}
                    className="w-full max-w-[42px] rounded-t-lg bg-gradient-to-t from-[#1E3A8A] to-[#2563EB] group-hover:to-[#38BDF8] transition-all shadow-xs"
                  />
                  <span className="text-[11px] font-semibold text-slate-500">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-400 text-[10px] uppercase font-bold">
                Peak Hours
              </span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">
                9:30 AM – 1:00 PM
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-400 text-[10px] uppercase font-bold">
                Top Locality
              </span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">
                Koramangala, BLR
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-400 text-[10px] uppercase font-bold">
                Inquiry Conversion
              </span>
              <div className="font-bold text-emerald-600 text-sm mt-0.5">
                78.4% Won
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-[#1E3A8A] font-sans">
                Sector Popularity
              </h2>
              <Link
                href="/admin/categories"
                className="text-xs text-[#2563EB] hover:underline font-bold"
              >
                All (6) →
              </Link>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              {[
                { name: "Home Services (Electric, Plumbing)", pct: 44, color: "bg-[#2563EB]" },
                { name: "Health & Clinics", pct: 24, color: "bg-emerald-500" },
                { name: "Auto & Diagnostics", pct: 18, color: "bg-indigo-500" },
                { name: "Events & Weddings", pct: 14, color: "bg-purple-500" },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-slate-500 font-bold">{cat.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${cat.pct}%` }}
                      className={`h-full rounded-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/60 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#1E3A8A]">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Category Taxonomy Health</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              All 6 primary categories have active verified listings in Delhi NCR, Mumbai,
              and Bengaluru. Zero unassigned services detected.
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. RECENT DIRECTORY ENTRIES & REVIEWS ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-[#1E3A8A] font-sans">
              Recent Directory Additions
            </h2>
            <Link
              href="/admin/businesses"
              className="text-xs text-[#2563EB] hover:underline font-bold"
            >
              View All ({businesses.length}) →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentBusinesses.map((b) => (
              <div
                key={b.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0">
                    {b.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-xs truncate">
                      {b.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {b.category} · {b.locality}, {b.city}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      b.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : b.status === "pending"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {b.status}
                  </span>
                  <button
                    onClick={() => setSelectedForReview(b)}
                    className="p-1 text-slate-400 hover:text-[#2563EB] rounded-md transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Customer Feedback Stream */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-[#1E3A8A] font-sans">
              Recent Customer Reviews & Moderation
            </h2>
            <Link
              href="/admin/reviews"
              className="text-xs text-[#2563EB] hover:underline font-bold"
            >
              Moderation Hub →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {reviews.map((r) => (
              <div key={r.id} className="py-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{r.customerName}</span>
                    <span className="text-slate-400">on</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                      {r.businessName}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                    <span>{r.rating}.0</span>
                  </div>
                </div>

                <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                  "{r.comment}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Service: {r.serviceAvailed}</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded-md uppercase ${
                      r.status === "published"
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-rose-700 bg-rose-50"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. DETAIL INSPECTION MODAL ─────────────────────────────────── */}
      {selectedForReview && (
        <Modal
          isOpen={!!selectedForReview}
          onClose={() => setSelectedForReview(null)}
          title={selectedForReview.name}
          description={`${selectedForReview.category} · Application #${selectedForReview.id}`}
          className="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Status & Highlights */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-semibold text-[10px] uppercase">
                  Current Status
                </span>
                <div className="font-bold text-slate-800 uppercase">
                  {selectedForReview.status} ·{" "}
                  {selectedForReview.isVerified ? "Verified" : "Unverified"}
                </div>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-slate-400 font-semibold text-[10px] uppercase">
                  Experience
                </span>
                <div className="font-bold text-slate-800">
                  {selectedForReview.experienceYears} Years in Trade
                </div>
              </div>
            </div>

            {/* Tagline & Story */}
            <div className="space-y-1">
              <span className="font-bold text-slate-700">Business Story & Scope</span>
              <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                {selectedForReview.description}
              </p>
            </div>

            {/* Address & Contact Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700">Official Location</span>
                <p className="text-slate-600">
                  {selectedForReview.address}, {selectedForReview.locality},{" "}
                  {selectedForReview.city} – {selectedForReview.postalCode}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700">Authorized Contact</span>
                <p className="text-slate-600">
                  {selectedForReview.ownerName}
                  <br />
                  Phone: {selectedForReview.phone}
                  <br />
                  Email: {selectedForReview.email}
                </p>
              </div>
            </div>

            {/* Tax & Compliance */}
            {selectedForReview.gstin && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1E3A8A]">GSTIN Registered</span>
                  <div className="font-mono text-slate-700 font-bold mt-0.5">
                    {selectedForReview.gstin}
                  </div>
                </div>
                <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded-md">
                  Tax Compliant
                </span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedForReview(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
              >
                Close
              </button>
              {selectedForReview.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      setSelectedForReject(selectedForReview);
                      setSelectedForReview(null);
                      setRejectModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold cursor-pointer"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => {
                      approveBusiness(selectedForReview.id);
                      setSelectedForReview(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold shadow-md cursor-pointer"
                  >
                    Approve & Verify Listing
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── 7. REJECT CONFIRMATION MODAL ───────────────────────────────── */}
      {rejectModalOpen && selectedForReject && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Provider Application"
          description={`Provide a clear reason for rejecting ${selectedForReject.name}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              This message will be sent to the business owner ({selectedForReject.ownerEmail})
              so they can address compliance shortcomings and re-apply.
            </p>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Invalid trade license provided; phone number unreachable during verification check..."
                rows={4}
                className="w-full rounded-xl border border-slate-300 p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-50 cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

