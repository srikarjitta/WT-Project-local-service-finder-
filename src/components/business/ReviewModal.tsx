'use client';
import React, { useState } from 'react';
import { X, CheckCircle2, Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Rating } from '@/components/common/Rating';
import { Business } from '@/types';

interface ReviewModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  business,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('Srikar Reddy');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        onSuccess?.();
        onClose();
      }, 1200);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#DBEAFE] overflow-hidden z-10 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-600 p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Write a Review</h3>
            <p className="text-xs text-blue-100">{business.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-[#1E3A8A]">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-500">
              Your genuine review helps other locals find the best quality services.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Interactive Rating */}
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Overall Experience Rating
              </label>
              <Rating
                value={rating}
                interactive
                size="lg"
                onChange={(val) => setRating(val)}
                className="justify-center"
              />
              <span className="text-xs font-semibold text-blue-700 mt-2 block">
                {rating === 5 && 'Outstanding - Highly Recommend!'}
                {rating === 4 && 'Very Good - Satisfied with work'}
                {rating === 3 && 'Average - Met basic expectations'}
                {rating === 2 && 'Below Average - Needs improvement'}
                {rating === 1 && 'Unsatisfactory'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Review
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share specific details about pricing, punctuality, communication, and work quality..."
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <ThumbsUp className="w-3.5 h-3.5" />
                Verified customer review
              </div>
              <span>Posting as: <strong className="text-slate-700">{name}</strong></span>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} className="font-bold">
                Publish Review
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

