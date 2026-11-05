"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  Inbox,
  Star,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Phone,
  MessageCircle,
  Eye,
  TrendingUp,
  MapPin,
  Calendar,
  AlertCircle,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBusiness } from "@/context/BusinessContext";

export default function BusinessOverviewPage() {
  const { business, services, photos, enquiries, reviews, stats, updateProfile, updateEnquiryStatus } =
    useBusiness();

  const newLeads = enquiries.filter((e) => e.status === "new");
  const wonLeads = enquiries.filter((e) => e.status === "won");
  const conversionRate = enquiries.length > 0
    ? Math.round(((wonLeads.length + enquiries.filter((e) => e.status === "contacted" || e.status === "quote_sent").length) / enquiries.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* 1. Hero Listing Header (Justdial-Inspired Trust & Visibility Banner) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {business.name}
            </h1>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              JD-Verified
            </span>
            <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              Est. {business.yearEstablished}
            </span>
            {business.gstin && (
              <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                GST Registered
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            {business.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
            <span className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
              {business.locality}, {business.city} ({business.pincode})
            </span>
            <span className="flex items-center">
              <Phone className="h-3.5 w-3.5 mr-1 text-slate-400" />
              {business.phone}
            </span>
            <span className="flex items-center text-emerald-600 font-medium">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Open Now (Closes 8:30 PM)
            </span>
          </div>
        </div>

        {/* Right Controls: Visibility & Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Public Search Visibility:</span>
            <button
              onClick={() => updateProfile({ isPubliclyVisible: !business.isPubliclyVisible })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                business.isPubliclyVisible ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  business.isPubliclyVisible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-xs font-semibold text-slate-700">
              {business.isPubliclyVisible ? "Live" : "Paused"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/business/profile">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </Link>
            <Link href="/business/services">
              <Button size="sm">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Service
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Profile Health & Completion Progress (Justdial Standard) */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50/40 to-white rounded-2xl border border-indigo-100 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Listing Discovery Score
            </span>
            <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-300">
              {business.profileCompletionScore}% Complete
            </Badge>
          </div>
          <p className="text-xs text-slate-600 max-w-xl">
            Listings with 90%+ completion score receive up to <strong>3.4x more customer calls and WhatsApp inquiries</strong> on local searches.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link href="/business/photos">
            <Button size="sm" variant="outline" className="bg-white text-xs h-8">
              Upload Work Photos (+5%)
            </Button>
          </Link>
          <Link href="/business/profile">
            <Button size="sm" className="text-xs h-8">
              Complete Profile →
            </Button>
          </Link>
        </div>
      </div>

      {/* 3. SaaS High-Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Customer Enquiries
            </CardTitle>
            <Inbox className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{enquiries.length}</div>
            <div className="flex items-center text-[11px] text-emerald-600 font-medium mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+18% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/20 hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Urgent New Leads
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{newLeads.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Requires immediate follow-up</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lead Conversion Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{conversionRate}%</div>
            <p className="text-[11px] text-slate-500 mt-1">Contacted & won client jobs</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xs transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Customer Reputation
            </CardTitle>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 flex items-center">
              4.8
              <span className="text-xs text-slate-400 font-normal ml-1.5">
                ({reviews.length} reviews)
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Top Rated in Indiranagar</p>
          </CardContent>
        </Card>
      </div>

      {/* 4. Urgent Action Center (New Incoming Leads Awaiting Reply) */}
      {newLeads.length > 0 && (
        <Card className="border-amber-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  New Customer Inquiries ({newLeads.length})
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Responding within 15 minutes increases job booking rate by 65%.
              </CardDescription>
            </div>
            <Link href="/business/enquiries">
              <Button variant="ghost" size="sm" className="text-xs text-indigo-600">
                View All Enquiries →
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100">
            {newLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-slate-900">{lead.customerName}</span>
                    <Badge variant="warning" className="text-[10px]">
                      {lead.source}
                    </Badge>
                    <span className="text-[11px] text-slate-400">({lead.createdAt})</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Requested: <span className="text-indigo-600">{lead.serviceRequested}</span>
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1">{lead.message}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={`tel:${lead.customerPhone}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ${lead.customerName}, thank you for inquiring about ${lead.serviceRequested} with ${business.name}. How can we assist you?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1" />
                    WhatsApp
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8"
                    onClick={() => updateEnquiryStatus(lead.id, "contacted", "Called customer")}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Mark Contacted
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 5. Listing Quick Summary & Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Services Status Card */}
        <Card className="hover:border-indigo-300 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Services Catalog</CardTitle>
              <Briefcase className="h-4 w-4 text-indigo-600" />
            </div>
            <CardDescription className="text-xs">
              {services.length} active service offerings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-slate-600 space-y-1">
              {services.slice(0, 3).map((s) => (
                <div key={s.id} className="flex justify-between py-1 border-b border-slate-100 last:border-none">
                  <span className="truncate pr-2">{s.name}</span>
                  <span className="font-semibold text-slate-800 shrink-0">
                    {s.priceType === "fixed" ? `₹${s.priceMin}` : "Quote"}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/business/services" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Manage All Services →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Photos Card */}
        <Card className="hover:border-indigo-300 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Storefront & Gallery</CardTitle>
              <Building2 className="h-4 w-4 text-indigo-600" />
            </div>
            <CardDescription className="text-xs">
              {photos.length} photos uploaded
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-1.5 rounded-lg overflow-hidden">
              {photos.slice(0, 3).map((p) => (
                <img
                  key={p.id}
                  src={p.url}
                  alt={p.caption}
                  className="h-16 w-full object-cover rounded-md"
                />
              ))}
            </div>
            <Link href="/business/photos" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Manage Photos →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Operating Hours Card */}
        <Card className="hover:border-indigo-300 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Weekly Schedule</CardTitle>
              <Clock className="h-4 w-4 text-indigo-600" />
            </div>
            <CardDescription className="text-xs">
              Monday – Saturday (8:30 AM – 8:30 PM)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Weekdays:</span>
                <span className="font-medium">8:30 AM - 8:30 PM</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Sunday:</span>
                <span className="font-medium">10:00 AM - 3:00 PM</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                <span>Emergency 24x7:</span>
                <span>Active</span>
              </div>
            </div>
            <Link href="/business/hours" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Edit Working Hours →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
