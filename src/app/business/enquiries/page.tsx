"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  getOwnerBusiness,
  getBusinessEnquiries,
  updateEnquiryStatus,
} from "@/actions/business";
import type { Business, Enquiry } from "@/types/database.types";

const STATUS_FILTERS = [
  { id: "all", label: "All Enquiries" },
  { id: "new", label: "New Leads" },
  { id: "in_progress", label: "In Progress" },
  { id: "responded", label: "Responded" },
  { id: "closed", label: "Closed" },
];

export default function BusinessEnquiriesPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Status update form inside modal
  const [newStatus, setNewStatus] = useState<"new" | "in_progress" | "responded" | "closed">("new");
  const [ownerNotes, setOwnerNotes] = useState("");

  const loadData = async (filter?: string) => {
    try {
      setIsLoading(true);
      const { business: currentBiz } = await getOwnerBusiness();
      setBusiness(currentBiz);

      if (currentBiz) {
        const items = await getBusinessEnquiries(currentBiz.id, filter || activeFilter);
        setEnquiries(items);
      }
    } catch (err) {
      console.error("Error loading enquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeFilter);
  }, [activeFilter]);

  const handleOpenDetail = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setNewStatus(enq.status);
    setOwnerNotes(enq.owner_notes || "");
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !selectedEnquiry) return;

    try {
      setIsUpdating(true);
      setFeedback(null);

      const res = await updateEnquiryStatus(
        business.id,
        selectedEnquiry.id,
        newStatus,
        ownerNotes
      );

      if (res.success) {
        setFeedback({ type: "success", message: "Enquiry status updated successfully!" });
        setSelectedEnquiry(null);
        await loadData(activeFilter);
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update status." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: Enquiry["status"]) => {
    switch (status) {
      case "new":
        return <Badge variant="warning">New Lead</Badge>;
      case "in_progress":
        return <Badge variant="info">In Progress</Badge>;
      case "responded":
        return <Badge variant="success">Responded</Badge>;
      case "closed":
        return <Badge variant="default">Closed</Badge>;
    }
  };

  if (isLoading && !business) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-64 bg-gray-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-gray-600">Please create your business profile before accessing the enquiries inbox.</p>
        <Link href="/business/profile">
          <Button>Create Business Profile</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/business" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enquiries Inbox</h1>
            <p className="text-sm text-gray-500">
              Manage incoming customer messages, quote requests, and follow-ups.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`rounded-xl p-4 flex items-center space-x-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === f.id
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      <Card>
        <CardContent className="p-0">
          {enquiries.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Inbox className="h-10 w-10 text-gray-400 mx-auto" />
              <div className="text-sm font-medium text-gray-900">No enquiries found</div>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {activeFilter === "all"
                  ? "You have not received any customer enquiries yet."
                  : `No enquiries in "${STATUS_FILTERS.find((f) => f.id === activeFilter)?.label}" state.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => handleOpenDetail(enq)}
                  className="p-4 sm:p-5 hover:bg-gray-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-sm text-gray-900">
                        {enq.customer_name}
                      </span>
                      {getStatusBadge(enq.status)}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{enq.message}</p>
                    <div className="flex items-center space-x-4 text-[11px] text-gray-400 pt-1">
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" /> {enq.customer_phone}
                      </span>
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" /> {enq.customer_email}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-gray-400 shrink-0">
                    <div className="flex items-center sm:justify-end space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(enq.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="text-[11px] text-indigo-600 font-medium hover:underline block mt-1">
                      View Details & Respond →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry from ${selectedEnquiry.customer_name}`}
          description={`Received on ${new Date(selectedEnquiry.created_at).toLocaleString()}`}
        >
          <div className="space-y-5">
            {/* Customer Details Box */}
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Customer Contact
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block">Phone</span>
                  <a
                    href={`tel:${selectedEnquiry.customer_phone}`}
                    className="font-medium text-indigo-600 hover:underline flex items-center"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" />
                    {selectedEnquiry.customer_phone}
                  </a>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Email</span>
                  <a
                    href={`mailto:${selectedEnquiry.customer_email}`}
                    className="font-medium text-indigo-600 hover:underline flex items-center"
                  >
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    {selectedEnquiry.customer_email}
                  </a>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={`tel:${selectedEnquiry.customer_phone}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 mr-1" /> Call Customer
                </a>
                <a
                  href={`https://wa.me/${selectedEnquiry.customer_phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 mr-1" /> Chat on WhatsApp
                </a>
                <a
                  href={`mailto:${selectedEnquiry.customer_email}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-semibold hover:bg-sky-100 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 mr-1" /> Send Email
                </a>
              </div>
            </div>

            {/* Message Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Customer Message
              </label>
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 leading-relaxed">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleStatusUpdate} className="space-y-4 pt-2 border-t border-gray-100">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(e.target.value as "new" | "in_progress" | "responded" | "closed")
                  }
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="new">New Lead</option>
                  <option value="in_progress">In Progress (Reviewing)</option>
                  <option value="responded">Responded (Contacted Customer)</option>
                  <option value="closed">Closed / Completed</option>
                </select>
              </div>

              <Textarea
                label="Internal Notes (Visible only to you)"
                value={ownerNotes}
                onChange={(e) => setOwnerNotes(e.target.value)}
                placeholder="e.g. Quoted ₹1200 on phone; customer agreed for Tuesday 10am visit."
                rows={2}
              />

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setSelectedEnquiry(null)}>
                  Close
                </Button>
                <Button type="submit" isLoading={isUpdating}>
                  Save Status
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
