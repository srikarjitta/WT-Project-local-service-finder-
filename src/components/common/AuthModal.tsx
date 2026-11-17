'use client';
import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onSuccess();
        onClose();
      }, 1000);
    }, 700);
  };

  const fillCustomerDemo = () => {
    setEmail('srikar.reddy@example.com');
    setPassword('password123');
    setName('Srikar Reddy');
    setPhone('+91 98480 11223');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#DBEAFE] overflow-hidden z-10 animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-blue-700 to-blue-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#4F46E5] flex items-center justify-center font-extrabold text-white text-xs shadow-sm">
              LSF
            </div>
            <span className="font-extrabold tracking-tight text-lg text-white">Local Service Finder</span>
            <span className="text-[10px] bg-blue-500/40 text-blue-100 font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
              Customer Portal
            </span>
          </div>
          <h3 className="text-xl font-bold">
            {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            {mode === 'login'
              ? 'Access your saved favourites, service enquiries, and customer dashboard.'
              : 'Join thousands of local residents discovering & booking trusted services.'}
          </p>
        </div>

        {/* Success toast */}
        {showSuccessToast && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Success! Redirecting to your dashboard...</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {/* Mode Switch Tabs */}
          <div className="flex p-1 bg-blue-50/70 rounded-xl border border-blue-100 mb-5">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={cn(
                'flex-1 py-2 text-xs font-bold rounded-lg transition-all',
                mode === 'login'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={cn(
                'flex-1 py-2 text-xs font-bold rounded-lg transition-all',
                mode === 'signup'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Quick Demo Pre-fill for Customer */}
          <div className="mb-4 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px]">
            <span className="text-slate-500 font-medium">Quick Demo:</span>
            <button
              type="button"
              onClick={fillCustomerDemo}
              className="px-2.5 py-1 bg-white border border-blue-200 text-blue-700 font-bold rounded-md hover:bg-blue-50 transition-colors shadow-2xs"
            >
              Auto-Fill Customer Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Srikar Reddy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to demo email.')}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              className="mt-2 text-sm font-semibold h-11"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {mode === 'login' ? 'Sign In as Customer' : 'Create Customer Account'}
            </Button>
          </form>

          <p className="text-center text-[11px] text-slate-400 mt-4">
            By proceeding, you agree to Local Service Finder&apos;s{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
