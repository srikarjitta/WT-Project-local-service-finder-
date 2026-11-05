"use client";

import React, { useState } from "react";
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
  Search,
  Filter,
  Check,
  X,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBusiness, type CustomerEnquiry } from "@/context/BusinessContext";

const PIPELINE_STAGES = [
  { id: "all", label: "All Leads" },
  { id: "new", label: "New Leads", badgeCount: true },
  { id: "contacted", label: "Contacted" },
  { id: "quote_sent", label: "Quote Sent" },
  { id: "won", label: "Won / Completed" },
  { id: "lost", label: "Lost / Declined" },
];

export default function BusinessEnquiriesPage() {
  const { enquiries, business, updateEnquiryStatus } = useBusiness();
  const [activeStage, setActiveStage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [ownerNotesInput, setOwnerNotesInput] = useState("");
  const [statusSelect, setStatusSelect] = useState<CustomerEnquiry["status"]>("new");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStage = activeStage === "all" ? true : e.status === activeStage;
    const matchesSearch =
      e.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.customerPhone.includes(searchQuery) ||
      e.serviceRequested.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.locality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleOpenModal = (enq: CustomerEnquiry) => {
    setSelectedEnquiry(enq);
    setStatusSelect(enq.status);
    setOwnerNotesInput(enq.ownerNotes || "");
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    updateEnquiryStatus(selectedEnquiry.id, statusSelect, ownerNotesInput);
    setSelectedEnquiry(null);
    showToast("Enquiry updated successfully!");
  };

  const getStatusBadge = (status: CustomerEnquiry["status"]) => {
    switch (status) {
      case "new":
        return <Badge variant="warning">New Lead</Badge>;
      case "contacted":
        return <Badge variant="info">Contacted</Badge>;
      case "quote_sent":
        return <Badge variant="secondary">Quote Sent</Badge>;
      case "won":
        return <Badge variant="success">Won / Completed</Badge>;
      case "lost":
        return <Badge variant="default">Lost</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/business" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Enquiries & Leads</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage incoming customer requests, follow-ups, and quotation conversions.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search leads by name, phone, locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center space-x-3 text-emerald-900 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Pipeline Stage Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {PIPELINE_STAGES.map((stg) => {
          const count =
            stg.id === "all"
              ? enquiries.length
              : enquiries.filter((e) => e.status === stg.id).length;
          const isActive = activeStage === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => setActiveStage(stg.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{stg.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-indigo-800 text-indigo-100" : "bg-slate-200 text-slate-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Enquiries List */}
      <Card>
        <CardContent className="p-0">
          {filteredEnquiries.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Inbox className="h-10 w-10 text-slate-300 mx-auto" />
              <div className="text-sm font-semibold text-slate-800">No enquiries found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No customer leads match the current stage or search filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-slate-900">
                        {enq.customerName}
                      </span>
                      {getStatusBadge(enq.status)}
                      <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        {enq.source}
                      </span>
                      <span className="text-[11px] text-slate-400">({enq.createdAt})</span>
                    </div>

                    <div className="text-xs text-indigo-600 font-semibold flex items-center space-x-2">
                      <span>Service: {enq.serviceRequested}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-normal">Location: {enq.locality}</span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      "{enq.message}"
                    </p>

                    {enq.ownerNotes && (
                      <div className="text-[11px] text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-200/60 flex items-center space-x-1.5">
                        <FileText className="h-3 w-3 text-amber-600 shrink-0" />
                        <span><strong>Notes:</strong> {enq.ownerNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center sm:flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`tel:${enq.customerPhone}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        Call ({enq.customerPhone})
                      </a>
                      <a
                        href={`https://wa.me/${enq.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello ${enq.customerName}, thank you for inquiring about ${enq.serviceRequested} with ${business.name}. How can we assist you today?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5 mr-1" />
                        WhatsApp
                      </a>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleOpenModal(enq)}
                    >
                      Update Status / Notes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for Details & Status Updates */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry: ${selectedEnquiry.customerName}`}
          description={`Customer phone: ${selectedEnquiry.customerPhone} • Received ${selectedEnquiry.createdAt}`}
        >
          <form onSubmit={handleSaveModal} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Pipeline Status</label>
              <select
                value={statusSelect}
                onChange={(e) => setStatusSelect(e.target.value as any)}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="new">New Lead (Awaiting Response)</option>
                <option value="contacted">Contacted (Called / Messaged)</option>
                <option value="quote_sent">Quote Sent (Price Shared)</option>
                <option value="won">Won / Job Completed</option>
                <option value="lost">Lost / Declined by Customer</option>
              </select>
            </div>

            <Textarea
              label="Private Owner Notes / Quotation Details"
              value={ownerNotesInput}
              onChange={(e) => setOwnerNotesInput(e.target.value)}
              placeholder="e.g. Quoted ₹1200 for 3 fans; visit scheduled for Saturday 11am."
              rows={3}
            />

            <div className="flex justify-end space-x-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setSelectedEnquiry(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Updates</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
