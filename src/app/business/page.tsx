"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  Inbox,
  Star,
  Plus,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOwnerBusiness, getBusinessDashboardMetrics, getBusinessEnquiries } from "@/actions/business";
import type { Business, Enquiry } from "@/types/database.types";

export default function BusinessOverviewPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [metrics, setMetrics] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    totalServices: 0,
    totalReviews: 0,
    avgRating: "0.0",
  });
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const { business: currentBiz } = await getOwnerBusiness();
        setBusiness(currentBiz);

        if (currentBiz) {
          const [stats, enquiries] = await Promise.all([
            getBusinessDashboardMetrics(currentBiz.id),
            getBusinessEnquiries(currentBiz.id),
          ]);
          setMetrics(stats);
          setRecentEnquiries(enquiries.slice(0, 5));
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Onboarding Prompt if no business has been created yet
  if (!business) {
    return (
      <div className="py-12 max-w-2xl mx-auto text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
          <Building2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Local Service Finder</h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            You don't have an active business listing yet. Set up your digital profile so local customers can find and contact you.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/business/profile">
            <Button size="lg" className="rounded-xl shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Create Business Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusBadgeVariant = {
    pending: "warning",
    approved: "success",
    rejected: "destructive",
    suspended: "destructive",
  }[business.status] as "warning" | "success" | "destructive";

  return (
    <div className="space-y-8">
      {/* Top Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
            <Badge variant={statusBadgeVariant}>
              {business.status.toUpperCase()}
            </Badge>
            {business.is_verified && (
              <Badge variant="info">VERIFIED</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {business.locality}, {business.city}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/business/services">
            <Button variant="outline" size="sm">
              <Briefcase className="h-4 w-4 mr-2" />
              Manage Services
            </Button>
          </Link>
          <Link href="/business/profile">
            <Button size="sm">
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Notice if Pending or Rejected */}
      {business.status === "pending" && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-900">Listing is Under Review</h4>
            <p className="text-xs text-amber-700 mt-0.5">
              Your business profile is currently pending approval by the platform admin. Once approved, it will be visible in public search results.
            </p>
          </div>
        </div>
      )}

      {business.status === "rejected" && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-rose-900">Listing Requires Attention</h4>
            <p className="text-xs text-rose-700 mt-0.5">
              {business.rejection_reason || "Your listing was rejected by the admin. Please update your profile details and contact support."}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Enquiries
            </CardTitle>
            <Inbox className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalEnquiries}</div>
            <p className="text-xs text-gray-500 mt-1">Customer inquiries received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              New Leads
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{metrics.newEnquiries}</div>
            <p className="text-xs text-gray-500 mt-1">Unprocessed inquiries awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active Services
            </CardTitle>
            <Briefcase className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalServices}</div>
            <p className="text-xs text-gray-500 mt-1">Services offered in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating & Reviews
            </CardTitle>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              {metrics.avgRating}
              <span className="text-xs text-gray-400 font-normal ml-1.5">
                ({metrics.totalReviews} reviews)
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Customer feedback score</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Setup Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Business Profile Readiness</CardTitle>
          <CardDescription>Complete all sections to maximize customer trust and discoverability</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/business/services"
            className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-sm text-gray-900 group-hover:text-indigo-600">Services Catalog</div>
              <p className="text-xs text-gray-500 mt-0.5">List your offerings & price ranges</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/business/photos"
            className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-sm text-gray-900 group-hover:text-indigo-600">Photos & Media</div>
              <p className="text-xs text-gray-500 mt-0.5">Upload storefront and work photos</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/business/hours"
            className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-sm text-gray-900 group-hover:text-indigo-600">Operating Hours</div>
              <p className="text-xs text-gray-500 mt-0.5">Define your weekly schedule</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </CardContent>
      </Card>

      {/* Recent Enquiries Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Customer Enquiries</CardTitle>
            <CardDescription>Latest customer inquiries and booking requests</CardDescription>
          </div>
          <Link href="/business/enquiries">
            <Button variant="ghost" size="sm" className="text-indigo-600">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentEnquiries.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No customer enquiries yet. Once customers discover your business, their enquiries will appear here.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-gray-900">{enq.customer_name}</span>
                      <Badge variant={enq.status === "new" ? "warning" : "default"}>
                        {enq.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{enq.message}</p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
