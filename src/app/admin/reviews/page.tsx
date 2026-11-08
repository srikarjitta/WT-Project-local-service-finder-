"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Search,
  Filter,
  CheckCircle2,
  EyeOff,
  Trash2,
  AlertTriangle,
  Building2,
  ShieldAlert,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { useAdmin, AdminReview, ReviewStatus } from "@/context/AdminContext";

export default function AdminReviewsPage() {
  const { reviews, moderateReview, deleteReview } = useAdmin();

  const [statusTab, setStatusTab] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState("");

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (statusTab !== "all") {
        if (statusTab === "pending" && (r.status === "pending" || (r.status as string) === "flagged")) {
          // match pending queue
        } else if (r.status !== statusTab) {
          return false;
        }
      }
      if (ratingFilter !== "all" && r.rating !== parseInt(ratingFilter)) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matches =
          r.customerName.toLowerCase().includes(q) ||
          r.businessName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [reviews, statusTab, ratingFilter, searchFilter]);

  const pendingCount = reviews.filter((r) => r.status === "pending" || (r.status as string) === "flagged").length;

  return (
    <div className="space-y-6">
      {/* ── 1. HEADER ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1E3A8A] font-sans">
              Customer Reviews & Reputation Moderation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-blue-200">
              {reviews.length} total reviews
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ensure platform trust by moderating flagged reviews, offensive language, and competitor disputes.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{pendingCount} reviews pending moderation</span>
          </div>
        )}
      </div>

      {/* ── 2. TABS & SEARCH ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        {[
          { key: "all", label: "All Reviews", count: reviews.length },
          {
            key: "pending",
            label: "Pending Queue",
            count: pendingCount,
            highlight: pendingCount > 0,
          },
          {
            key: "published",
            label: "Published & Live",
            count: reviews.filter((r) => r.status === "published").length,
          },
          {
            key: "hidden",
            label: "Hidden / Removed",
            count: reviews.filter((r) => r.status === "hidden").length,
          },
        ].map((tab) => {
          const isActive = statusTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#1E3A8A] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : tab.highlight
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters row */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search reviews by customer, business, or keyword..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none text-slate-800 placeholder-slate-400 text-xs"
          />
        </div>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none text-xs cursor-pointer"
        >
          <option value="all">All Star Ratings</option>
          <option value="5">5 Stars only</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star only</option>
        </select>
      </div>

      {/* ── 3. REVIEWS STREAM ───────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-slate-200 space-y-2">
            <Star className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">No reviews in this view</h3>
            <p className="text-xs text-slate-400">
              Try switching tabs or clearing search criteria.
            </p>
          </div>
        ) : (
          filteredReviews.map((r) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl bg-white border p-5 shadow-xs transition-all space-y-3 ${
                r.status === "pending"
                  ? "border-amber-300 bg-amber-50/20"
                  : "border-slate-200/90"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {r.customerName[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      {r.customerName}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-[#2563EB]" />
                      <span className="font-semibold text-[#1E3A8A]">
                        {r.businessName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Star Rating */}
                  <div className="flex items-center text-amber-500 font-bold text-xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= r.rating ? "fill-amber-500" : "text-slate-200"
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 text-slate-700">{r.rating}.0</span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      r.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : r.status === "pending"
                        ? "bg-amber-100 text-amber-800 border border-amber-300 font-extrabold"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                "{r.comment}"
              </div>

              {/* Flagged Reason Box */}
              {r.flaggedReason && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Flagged Issue:</span> {r.flaggedReason}
                  </div>
                </div>
              )}

              {/* Footer: Service Availed & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                <span className="text-[11px] text-slate-400">
                  Service availed: <strong className="text-slate-600">{r.serviceAvailed}</strong> · Verified booking
                </span>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {r.status !== "published" && (
                    <button
                      onClick={() => moderateReview(r.id, "published")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  )}

                  {r.status !== "hidden" && (
                    <button
                      onClick={() => moderateReview(r.id, "hidden")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide from Public</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm("Permanently delete this review record?")) {
                        deleteReview(r.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

