'use client';
import React, { useState } from 'react';
import { X, Phone, MessageCircle, Copy, Check, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Business } from '@/types';

interface ContactModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'call' | 'whatsapp';
}

export const ContactModal: React.FC<ContactModalProps> = ({
  business,
  isOpen,
  onClose,
  defaultTab = 'call',
}) => {
  const [tab, setTab] = useState<'call' | 'whatsapp'>(defaultTab);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = business.phone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = business.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#DBEAFE] overflow-hidden z-10 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-600 p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Contact Business</h3>
            <p className="text-xs text-blue-100">{business.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-6 space-y-5">
          <div className="flex p-1 bg-blue-50/70 rounded-xl border border-blue-100">
            <button
              type="button"
              onClick={() => setTab('call')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'call'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Phone Call
            </button>
            <button
              type="button"
              onClick={() => setTab('whatsapp')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'whatsapp'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Chat
            </button>
          </div>

          {tab === 'call' ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
                <span className="text-xs font-medium text-slate-500">Official Contact Number</span>
                <div className="text-2xl font-black text-[#1E3A8A] mt-1 tracking-wide">
                  {business.phone}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Now • Available for calls
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex-1 inline-flex items-center justify-center font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 gap-2 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
                <Button
                  variant="outline"
                  onClick={() => handleCopy(business.phone)}
                  className="px-4 h-11"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-center">
                <span className="text-xs font-medium text-slate-500">WhatsApp Verified Business</span>
                <div className="text-xl font-black text-emerald-800 mt-1">
                  {business.whatsapp}
                </div>
                <p className="text-xs text-emerald-600 mt-1">
                  Typical reply time: <span className="font-bold">{business.responseTime}</span>
                </p>
              </div>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hi%20${encodeURIComponent(
                  business.name
                )},%20I%20found%20your%20listing%20on%20Local%20Service%20Finder%20and%20would%20like%20to%20know%20more%20about%20your%20services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center font-bold text-sm bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl h-11 gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                Open WhatsApp Chat
              </a>
            </div>
          )}

          {/* Trust guarantee */}
          <div className="pt-2 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Verified business profile. Local Service Finder never shares your personal numbers with third-party advertisers.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

