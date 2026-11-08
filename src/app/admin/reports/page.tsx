"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  Building2,
  FileText,
  User,
  XCircle,
} from "lucide-react";
import { useAdmin, AdminReport, ReportStatus } from "@/context/AdminContext";
import { Modal } from "@/components/ui/modal";

export default function AdminReportsPage() {
  const { reports, updateReportStatus, suspendBusiness } = useAdmin();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [resolutionText, setResolutionText] = useState("");

  const filteredReports = reports.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  const handleResolve = () => {
    if (selectedReport && resolutionText.trim()) {
      updateReportStatus(selectedReport.id, "resolved", resolutionText.trim());
      setSelectedReport(null);
      setResolutionText("");
    }
  };

  const handleDismiss = () => {
    if (selectedReport) {
      updateReportStatus(
        selectedReport.id,
        "dismissed",
        "Dismissed after investigation: No platform guideline violation found."
      );
      setSelectedReport(null);
      setResolutionText("");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 1. HEADER ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1E3A8A] font-sans">
              Disputes, Grievances & Fraud Prevention
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-blue-200">
              {reports.length} total tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Investigate customer billing complaints, uncertified technicians, and competitor defamation reports.
          </p>
        </div>
      </div>

      {/* ── 2. STATUS TABS ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        {[
          { key: "all", label: "All Tickets", count: reports.length },
          {
            key: "under_review",
            label: "Under Review",
            count: reports.filter((r) => r.status === "under_review").length,
            highlight: true,
          },
          {
            key: "pending",
            label: "Pending Initial Review",
            count: reports.filter((r) => r.status === "pending").length,
          },
          {
            key: "resolved",
            label: "Resolved Cases",
            count: reports.filter((r) => r.status === "resolved").length,
          },
          {
            key: "dismissed",
            label: "Dismissed",
            count: reports.filter((r) => r.status === "dismissed").length,
          },
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
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

      {/* ── 3. TICKETS LIST ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-slate-200 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No active dispute tickets</h3>
            <p className="text-xs text-slate-500">
              All reported complaints in this category have been resolved.
            </p>
          </div>
        ) : (
          filteredReports.map((r) => (
            <motion.div
              key={r.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 p-5 space-y-3 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      r.severity === "high"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : r.severity === "medium"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-blue-100 text-blue-800 border border-blue-300"
                    }`}
                  >
                    {r.severity} Severity
                  </span>
                  <span className="font-mono text-slate-400 text-xs">#{r.id}</span>
                  <span className="font-bold text-slate-900 text-xs">{r.reason}</span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase self-start sm:self-auto ${
                    r.status === "resolved"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : r.status === "under_review"
                      ? "bg-amber-50 text-amber-800 border border-amber-200 animate-pulse"
                      : r.status === "dismissed"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Target Subject
                  </span>
                  <div className="font-bold text-[#1E3A8A] mt-0.5 truncate">
                    {r.targetName}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">
                    Type: {r.targetType}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Filed By
                  </span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {r.reporterName}
                  </div>
                  <div className="text-[10px] text-slate-500">{r.reporterEmail}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Timestamp
                  </span>
                  <div className="text-slate-700 mt-0.5">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                <strong>Complaint Details:</strong> {r.details}
              </div>

              {r.resolutionNotes && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <strong>Resolution Recorded:</strong> {r.resolutionNotes}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {r.status !== "resolved" && r.status !== "dismissed" && (
                  <button
                    onClick={() => {
                      setSelectedReport(r);
                      setResolutionText(
                        r.targetType === "business"
                          ? "Business was suspended pending submission of verified trade credentials."
                          : "Review was hidden from public discovery."
                      );
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Action Ticket →
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ── 4. RESOLUTION MODAL ─────────────────────────────────────────── */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Take Action on Ticket #${selectedReport.id}`}
          description={`Complaint against ${selectedReport.targetName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Alleged Violation</span>
              <p className="text-slate-600">{selectedReport.details}</p>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Resolution Decision & Notes</label>
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold">Automated Governance Options</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedReport.targetType === "business" && (
                  <button
                    type="button"
                    onClick={() => {
                      suspendBusiness(
                        selectedReport.targetId,
                        `Suspended pursuant to dispute ticket #${selectedReport.id}`
                      );
                      alert("Business status updated to Suspended in directory.");
                    }}
                    className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Suspend Business Immediately
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Dismiss Complaint
              </button>
              <button
                type="button"
                onClick={handleResolve}
                disabled={!resolutionText.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer disabled:opacity-50"
              >
                Record Resolution
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

