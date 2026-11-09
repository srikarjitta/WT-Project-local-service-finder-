'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { MOCK_USER_REVIEWS } from '@/data/userMockData';
import { Rating } from '@/components/common/Rating';
import { EmptyState } from '@/components/common/EmptyState';

export const ReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState(MOCK_USER_REVIEWS);

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A8A]">My Reviews & Ratings</h2>
          <p className="text-xs text-slate-500">
            Reviews you have written for local businesses in your area
          </p>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-[#DBEAFE] p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.businessImage}
                    alt={rev.businessName}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <Link href={`/business/${rev.businessId}`}>
                      <h4 className="font-bold text-sm sm:text-base text-[#1E3A8A] hover:text-blue-600 transition-colors">
                        {rev.businessName}
                      </h4>
                    </Link>
                    <span className="text-xs text-slate-500">{rev.businessCategory}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{rev.date}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {rev.status}
                  </span>
                </div>
              </div>

              <div>
                <Rating value={rev.rating} showCount={false} size="sm" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/60">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Publicly visible to all users</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert('Edit review modal simulated.')}
                    className="px-3 py-1 rounded-xl text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(rev.id)}
                    className="px-3 py-1 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title="No Reviews Written Yet"
          description="Have you recently hired a technician or visited a salon? Share your feedback to help the community discover the best local talent."
          actionLabel="Find Businesses to Review"
          onAction={() => (window.location.href = '/search')}
        />
      )}
    </div>
  );
};

