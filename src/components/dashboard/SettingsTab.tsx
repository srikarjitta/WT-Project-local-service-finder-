'use client';
import React, { useState } from 'react';
import { Bell, Lock, Shield, CheckCircle2, Save } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const SettingsTab: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [promoOffers, setPromoOffers] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-8 shadow-xs space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#1E3A8A]">Account Settings</h2>
        <p className="text-xs text-slate-500">Configure your communication alerts, privacy, and account security</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings successfully updated!</span>
        </div>
      )}

      {/* Notifications Section */}
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-[#1E3A8A] flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-blue-600" />
            Communication & Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-blue-50/50 transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-800 block">WhatsApp Instant Updates</span>
                <span className="text-[11px] text-slate-500 block">Receive provider quote responses directly on WhatsApp</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-blue-50/50 transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-800 block">SMS Notifications</span>
                <span className="text-[11px] text-slate-500 block">Text message when a business calls or responds to your enquiry</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-blue-50/50 transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Email Invoices & Summaries</span>
                <span className="text-[11px] text-slate-500 block">Weekly service recommendations and booking receipts</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-blue-50/50 transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Promotions & Seasonal Discounts</span>
                <span className="text-[11px] text-slate-500 block">Exclusive festive deals for AC services, salons, and car care</span>
              </div>
              <input
                type="checkbox"
                checked={promoOffers}
                onChange={(e) => setPromoOffers(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Password Security section */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-[#1E3A8A] flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-blue-600" />
            Security & Password
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="New password (min 8 chars)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" className="font-bold px-6" leftIcon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

