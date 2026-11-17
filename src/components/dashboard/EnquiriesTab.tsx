'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Phone, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { MOCK_USER_ENQUIRIES } from '@/data/userMockData';
import { Button } from '@/components/common/Button';

export const EnquiriesTab: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = MOCK_USER_ENQUIRIES.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A8A]">My Enquiries & Price Quotes</h2>
          <p className="text-xs text-slate-500">
            Track communication and quotations received from local service providers
          </p>
        </div>

        {/* Filter status buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#DBEAFE] rounded-2xl shadow-2xs text-xs">
          {['all', 'Pending', 'Responded', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterStatus.toLowerCase() === st.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Cards List */}
      <div className="space-y-4">
        {filtered.map((enq) => (
          <div
            key={enq.id}
            className="bg-white rounded-3xl border border-[#DBEAFE] p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={enq.businessImage}
                  alt={enq.businessName}
                  className="w-12 h-12 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <Link href={`/business/${enq.businessId}`}>
                    <h3 className="font-bold text-sm sm:text-base text-[#1E3A8A] hover:text-blue-600 transition-colors">
                      {enq.businessName}
                    </h3>
                  </Link>
                  <span className="text-xs text-slate-500 font-medium">
                    {enq.businessCategory} • Ref: {enq.id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{enq.date}</span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                    enq.status === 'Responded'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : enq.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {enq.status === 'Responded' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  {enq.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {enq.status === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                  {enq.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="font-bold text-slate-700 block mb-0.5">
                  Requested Service: {enq.serviceRequested}
                </span>
                <p className="text-slate-600">{enq.message}</p>
              </div>

              {/* Provider Response Note if available */}
              {enq.responseNote && (
                <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-blue-900">Provider Response:</span>
                    <p className="text-blue-800 leading-relaxed mt-0.5">{enq.responseNote}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Provider Phone: <strong className="text-slate-800">{enq.phone}</strong></span>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${enq.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Provider</span>
                </a>
                <Link
                  href={`/business/${enq.businessId}`}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-2xs"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

