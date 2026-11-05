"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  CornerDownRight,
  Send,
  User,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useBusiness } from "@/context/BusinessContext";

export default function BusinessReviewsPage() {
  const { reviews, business, replyToReview } = useBusiness();
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    counts[r.rating] = (counts[r.rating] || 0) + 1;
  });

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText.trim());
    setActiveReplyId(null);
    setReplyText("");
    showToast("Reply published to customer review!");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/business" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Ratings & Reviews</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified customer feedback, reputation score, and direct owner replies.
            </p>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center space-x-3 text-emerald-900 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Scorecard & Rating Breakdown (Justdial Standard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scorecard */}
        <Card className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white border-none shadow-md">
          <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Reputation Score
              </span>
              <div className="flex items-baseline space-x-3 mt-2">
                <span className="text-5xl font-black">{avgRating}</span>
                <span className="text-indigo-200 text-lg font-bold">/ 5.0</span>
              </div>
              <div className="flex items-center space-x-1 mt-2 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-700/60 text-xs text-indigo-100 space-y-1">
              <div>Based on <strong>{totalReviews} verified reviews</strong></div>
              <div className="text-emerald-300 font-medium">96% of customers recommend {business.name}</div>
            </div>
          </CardContent>
        </Card>

        {/* 5-Star Rating Distribution */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Rating Distribution</CardTitle>
            <CardDescription className="text-xs">Breakdown by star ratings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = counts[star] || 0;
              const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center space-x-3 text-xs">
                  <span className="w-10 font-semibold text-slate-700 flex items-center">
                    {star} <Star className="h-3 w-3 ml-0.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-slate-500 font-medium">{count} ({pct}%)</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Customer Reviews Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Customer Reviews ({reviews.length})</CardTitle>
          <CardDescription className="text-xs">
            Direct feedback from verified customer bookings in {business.locality}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                        <span>{rev.customerName}</span>
                        {rev.isVerifiedCustomer && (
                          <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                            <ShieldCheck className="h-3 w-3 mr-0.5 text-emerald-600" /> Verified Customer
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Service: <span className="text-slate-600 font-medium">{rev.serviceAvailed}</span> • {rev.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${s <= rev.rating ? "fill-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed pl-10.5">
                  "{rev.comment}"
                </p>

                {/* Owner Reply if present */}
                {rev.ownerReply && (
                  <div className="ml-10.5 rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700">
                      <CornerDownRight className="h-3.5 w-3.5" />
                      <span>Response from {business.name}</span>
                      <span className="text-slate-400 font-normal">({rev.ownerReply.repliedAt})</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-5">{rev.ownerReply.text}</p>
                  </div>
                )}

                {/* Reply Button / Box */}
                {!rev.ownerReply && (
                  <div className="pl-10.5 pt-1">
                    {activeReplyId === rev.id ? (
                      <div className="space-y-2 mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <Textarea
                          placeholder="Write a polite, professional reply to this customer..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                          className="bg-white text-xs"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                            onClick={() => {
                              setActiveReplyId(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleSendReply(rev.id)}
                          >
                            <Send className="h-3 w-3 mr-1" /> Post Reply
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-indigo-600 h-7 px-2 hover:bg-indigo-50"
                        onClick={() => {
                          setActiveReplyId(rev.id);
                          setReplyText("");
                        }}
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Reply to Review
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
