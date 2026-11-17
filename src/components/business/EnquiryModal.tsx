'use client';
import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Phone, User, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Business } from '@/types';

interface EnquiryModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  selectedServiceName?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  business,
  isOpen,
  onClose,
  selectedServiceName,
}) => {
  const [selectedService, setSelectedService] = useState(
    selectedServiceName || (business.services[0]?.name ?? 'General Enquiry')
  );
  const [fullName, setFullName] = useState('Srikar Reddy');
  const [phone, setPhone] = useState('+91 98480 11223');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#DBEAFE] overflow-hidden z-10 animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-600 p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-blue-200 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Instant Price Quote & Availability</span>
            </div>
            <h3 className="text-lg font-bold text-white">Send Enquiry</h3>
            <p className="text-xs text-blue-100 line-clamp-1">{business.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-[#1E3A8A]">Enquiry Sent Successfully!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your request for <span className="font-semibold text-blue-600">{selectedService}</span> has been transmitted to <span className="font-semibold text-slate-900">{business.name}</span>.
            </p>
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-[#1E3A8A] flex items-center justify-center gap-2">
              <span>Expected response time:</span>
              <span className="font-bold">{business.responseTime}</span>
            </div>
            <div className="pt-2">
              <Button variant="primary" onClick={handleReset} fullWidth>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Service Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Service You Are Interested In
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
              >
                {business.services.map((svc) => (
                  <option key={svc.id} value={svc.name}>
                    {svc.name} {svc.price ? `(${svc.price})` : ''}
                  </option>
                ))}
                <option value="General Consultation / Other">General Consultation / Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Date / Time (Optional)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Details / Note
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  placeholder="Describe your requirement, issue, or address details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="font-bold min-w-[140px]"
              >
                Send Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

