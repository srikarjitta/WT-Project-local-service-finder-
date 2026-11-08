"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Bell,
  Save,
  RotateCcw,
  Sparkles,
  Database,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminSettingsPage() {
  const { resetToDefaults, seedMoreDemoData } = useAdmin();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Platform configs state
  const [configs, setConfigs] = useState({
    platformName: "ServiFind",
    supportEmail: "support@servifind.com",
    helplinePhone: "+91 1800 123 4567",
    defaultRadiusKm: "10",
    requireGstinForVerification: false,
    autoFreezeOnComplaints: true,
    complaintThreshold: "3",
    allowInstantChat: true,
    emailNotificationsEnabled: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── 1. HEADER ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1E3A8A] font-sans">
              System Governance & Platform Policies
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
              ServiFind v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global directory rules, compliance verification gates, and database administrative controls.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── 2. GENERAL BRAND SETTINGS ─────────────────────────────────── */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-[#2563EB]" />
            <h2 className="font-extrabold text-sm text-[#1E3A8A]">
              Platform Identity & Contact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Platform Brand Name</label>
              <input
                type="text"
                value={configs.platformName}
                onChange={(e) => setConfigs({ ...configs, platformName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Default Match Radius (km)</label>
              <input
                type="number"
                value={configs.defaultRadiusKm}
                onChange={(e) =>
                  setConfigs({ ...configs, defaultRadiusKm: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Customer Support Email</label>
              <input
                type="email"
                value={configs.supportEmail}
                onChange={(e) => setConfigs({ ...configs, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Toll-Free Helpline</label>
              <input
                type="text"
                value={configs.helplinePhone}
                onChange={(e) =>
                  setConfigs({ ...configs, helplinePhone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ── 3. COMPLIANCE & SAFETY POLICIES ───────────────────────────── */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-[#2563EB]" />
            <h2 className="font-extrabold text-sm text-[#1E3A8A]">
              Verification & Fraud Safeguards
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="font-bold text-slate-800">
                  Enforce Mandatory GSTIN for Commercial Listings
                </span>
                <p className="text-[11px] text-slate-500">
                  Requires valid 15-digit GST registration before listing approval can be granted.
                </p>
              </div>
              <input
                type="checkbox"
                checked={configs.requireGstinForVerification}
                onChange={(e) =>
                  setConfigs({
                    ...configs,
                    requireGstinForVerification: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="font-bold text-slate-800">
                  Automatic Business Suspension Threshold
                </span>
                <p className="text-[11px] text-slate-500">
                  Automatically set business status to Suspended if 3 or more severe billing complaints are filed.
                </p>
              </div>
              <input
                type="checkbox"
                checked={configs.autoFreezeOnComplaints}
                onChange={(e) =>
                  setConfigs({ ...configs, autoFreezeOnComplaints: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="font-bold text-slate-800">
                  Direct WhatsApp Quick-Quote Channel
                </span>
                <p className="text-[11px] text-slate-500">
                  Show click-to-WhatsApp link on approved listings.
                </p>
              </div>
              <input
                type="checkbox"
                checked={configs.allowInstantChat}
                onChange={(e) =>
                  setConfigs({ ...configs, allowInstantChat: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ── 4. DEMO STATE & DATABASE ACTIONS ──────────────────────────── */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database className="w-4 h-4 text-[#2563EB]" />
            <h2 className="font-extrabold text-sm text-[#1E3A8A]">
              Demo Data & System State
            </h2>
          </div>

          <p className="text-xs text-slate-600">
            Manage test applications and mock state for demonstration purposes. State persists
            automatically in browser storage.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => seedMoreDemoData()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate New Business Application</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm("Reset all administrative state back to original ServiFind defaults?")) {
                  resetToDefaults();
                  alert("Admin data reset to default seed.");
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset State to Defaults</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Governance Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}

