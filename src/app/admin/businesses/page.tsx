"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  Eye,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  Star,
} from "lucide-react";
import { useAdmin, AdminBusiness, BusinessStatus } from "@/context/AdminContext";
import { Modal } from "@/components/ui/modal";

function AdminBusinessesContent() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as BusinessStatus) || "all";

  const {
    businesses,
    categories,
    approveBusiness,
    rejectBusiness,
    suspendBusiness,
    restoreBusiness,
    toggleBusinessVerification,
    seedMoreDemoData,
  } = useAdmin();

  // Filters state
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>(initialStatus);
  const [searchFilter, setSearchFilter] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Inspection modal
  const [inspectingBiz, setInspectingBiz] = useState<AdminBusiness | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [targetRejectBiz, setTargetRejectBiz] = useState<AdminBusiness | null>(null);

  // Filtered dataset
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      // Status filter
      if (selectedStatusTab !== "all" && b.status !== selectedStatusTab) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && b.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matches =
          b.name.toLowerCase().includes(q) ||
          b.ownerName.toLowerCase().includes(q) ||
          b.locality.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.phone.includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [businesses, selectedStatusTab, selectedCategory, searchFilter]);

  // Counts by status
  const counts = {
    all: businesses.length,
    pending: businesses.filter((b) => b.status === "pending").length,
    approved: businesses.filter((b) => b.status === "approved").length,
    rejected: businesses.filter((b) => b.status === "rejected").length,
    suspended: businesses.filter((b) => b.status === "suspended").length,
  };

  const handleConfirmReject = () => {
    if (targetRejectBiz && rejectReason.trim()) {
      rejectBusiness(targetRejectBiz.id, rejectReason.trim());
      setRejectModalOpen(false);
      setRejectReason("");
      setTargetRejectBiz(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "ID,Name,Category,City,Locality,Owner,Phone,Status,Verified,Rating,Enquiries\n";
    const rows = filteredBusinesses
      .map(
        (b) =>
          `"${b.id}","${b.name}","${b.category}","${b.city}","${b.locality}","${b.ownerName}","${b.phone}","${b.status}","${b.isVerified}","${b.rating}","${b.enquiriesCount}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `servifind-businesses-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* ── 1. HEADER & CONTROLS ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1E3A8A] font-sans">
              Business Directory & Verification Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-blue-200">
              {businesses.length} total listings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Validate legal identities, trade authorizations, and approve or reject listings
            before customer discovery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => seedMoreDemoData()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white font-bold text-xs shadow-xs hover:brightness-110 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Simulate Application</span>
          </button>
        </div>
      </div>

      {/* ── 2. STATUS TABS ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { key: "all", label: "All Listings", count: counts.all },
          {
            key: "pending",
            label: "Pending Verification",
            count: counts.pending,
            highlight: counts.pending > 0,
          },
          { key: "approved", label: "Approved & Live", count: counts.approved },
          { key: "rejected", label: "Rejected", count: counts.rejected },
          { key: "suspended", label: "Suspended", count: counts.suspended },
        ].map((tab) => {
          const isActive = selectedStatusTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedStatusTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#1E3A8A] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : tab.highlight
                    ? "bg-amber-500 text-white animate-pulse"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 3. SEARCH & FILTER BAR ──────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 w-full flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by business name, locality, city, owner or phone..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none text-slate-800 placeholder-slate-400 text-xs"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-blue-400 text-xs cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode("cards")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "cards"
                ? "bg-white text-[#1E3A8A] shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-[#1E3A8A] shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Detailed Table View"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 4. LISTINGS DISPLAY: CARDS OR TABLE ─────────────────────────── */}
      {filteredBusinesses.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No businesses match the current filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clear filters, or seed a sample business application.
          </p>
          <button
            onClick={() => {
              setSelectedStatusTab("all");
              setSearchFilter("");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBusinesses.map((b) => (
            <motion.div
              key={b.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Category & Verification Status */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80">
                    {b.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      b.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : b.status === "pending"
                        ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                        : b.status === "suspended"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                {/* Name & Tagline */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-slate-900 text-sm truncate">
                      {b.name}
                    </h3>
                    {b.isVerified && (
                      <span title="Verified Provider">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {b.tagline}
                  </p>
                </div>

                {/* Location & Contact Snippet */}
                <div className="rounded-xl bg-slate-50 p-2.5 space-y-1.5 text-xs text-slate-600 border border-slate-100">
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
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400">Owner: {b.ownerName}</span>
                    <span className="font-bold text-amber-600 flex items-center">
                      <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                      {b.rating} ({b.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Rejection / Suspension Notice if applicable */}
                {b.rejectionReason && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-700">
                    <strong>Admin Note:</strong> {b.rejectionReason}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectingBiz(b)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#2563EB] py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {b.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          setTargetRejectBiz(b);
                          setRejectModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveBusiness(b.id)}
                        className="px-3 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold text-xs transition-all cursor-pointer shadow-2xs"
                      >
                        Approve
                      </button>
                    </>
                  )}

                  {b.status === "approved" && (
                    <button
                      onClick={() => suspendBusiness(b.id)}
                      className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Suspend
                    </button>
                  )}

                  {b.status === "suspended" && (
                    <button
                      onClick={() => restoreBusiness(b.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Restore Live
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Data Table View */
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Business Name & Category</th>
                  <th className="px-4 py-3">Owner Contact</th>
                  <th className="px-4 py-3">City & Locality</th>
                  <th className="px-4 py-3">Rating & Enquiries</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBusinesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{b.name}</div>
                      <div className="text-[11px] text-[#2563EB] font-medium">{b.category}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{b.ownerName}</div>
                      <div className="text-[11px] text-slate-500">{b.phone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-slate-800 font-medium">{b.locality}</div>
                      <div className="text-[11px] text-slate-500">{b.city}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-amber-600 flex items-center">
                        <Star className="w-3 h-3 fill-amber-500 mr-1" />
                        {b.rating} ({b.reviewCount})
                      </div>
                      <div className="text-[11px] text-slate-500">{b.enquiriesCount} leads</div>
                    </td>
                    <td className="px-4 py-3.5">
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
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setInspectingBiz(b)}
                        className="text-[#2563EB] hover:underline font-bold"
                      >
                        Inspect
                      </button>
                      {b.status === "pending" && (
                        <button
                          onClick={() => approveBusiness(b.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white font-bold"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 5. FULL INSPECTION MODAL ─────────────────────────────────────── */}
      {inspectingBiz && (
        <Modal
          isOpen={!!inspectingBiz}
          onClose={() => setInspectingBiz(null)}
          title={inspectingBiz.name}
          description={`ID: #${inspectingBiz.id} · Registered in ${inspectingBiz.city}`}
          className="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Service Category
                </span>
                <div className="font-bold text-slate-800 text-sm mt-0.5">
                  {inspectingBiz.category}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Verification Status
                </span>
                <div className="mt-0.5 flex items-center gap-1.5 font-bold uppercase text-slate-800">
                  {inspectingBiz.isVerified ? (
                    <span className="text-emerald-700 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Provider
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" /> Not Verified Yet
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-700">Detailed Description</span>
              <p className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 leading-relaxed">
                {inspectingBiz.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700">Address & Landmark</span>
                <p className="text-slate-600">
                  {inspectingBiz.address}
                  <br />
                  Locality: {inspectingBiz.locality}
                  <br />
                  City: {inspectingBiz.city} - {inspectingBiz.postalCode}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700">Communication Channels</span>
                <p className="text-slate-600">
                  Phone: {inspectingBiz.phone}
                  <br />
                  WhatsApp: {inspectingBiz.whatsapp}
                  <br />
                  Official Email: {inspectingBiz.email}
                </p>
              </div>
            </div>

            {inspectingBiz.gstin && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1E3A8A]">Registered GSTIN</span>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">
                    {inspectingBiz.gstin}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Active in Tax Records
                </span>
              </div>
            )}

            {/* Verification Toggle */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">ServiFind Verified Badge</span>
                <p className="text-[11px] text-slate-500">
                  Grants the verified badge icon and higher algorithmic discovery.
                </p>
              </div>
              <button
                onClick={() => toggleBusinessVerification(inspectingBiz.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  inspectingBiz.isVerified
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {inspectingBiz.isVerified ? "✓ Verified" : "Mark Verified"}
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setInspectingBiz(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
              >
                Close
              </button>
              {inspectingBiz.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      setTargetRejectBiz(inspectingBiz);
                      setInspectingBiz(null);
                      setRejectModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      approveBusiness(inspectingBiz.id);
                      setInspectingBiz(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold cursor-pointer shadow-md"
                  >
                    Approve Listing
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── 6. REJECT MODAL ─────────────────────────────────────────────── */}
      {rejectModalOpen && targetRejectBiz && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Provider Application"
          description={`Provide clear grounds for rejecting ${targetRejectBiz.name}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              The owner ({targetRejectBiz.ownerEmail}) will receive this compliance notice.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Unverifiable trade license or mismatched address proof..."
              rows={4}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
            />
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

export default function AdminBusinessesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-500 font-semibold">
          Loading business directory...
        </div>
      }
    >
      <AdminBusinessesContent />
    </Suspense>
  );
}
