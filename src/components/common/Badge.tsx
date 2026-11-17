'use strict';
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, ShieldCheck, Clock, Sparkles } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'verified' | 'success' | 'warning' | 'outline' | 'navy';
  size?: 'sm' | 'md';
  icon?: 'verified' | 'clock' | 'sparkle' | 'none';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon = 'none',
  className,
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 text-white font-medium',
    secondary: 'bg-blue-100 text-blue-800 font-medium border border-blue-200/80',
    verified: 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-xs',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 font-medium',
    outline: 'bg-white text-slate-700 border border-slate-200 font-medium',
    navy: 'bg-brand-navy text-white font-medium',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-full gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 rounded-full gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon === 'verified' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100 shrink-0" />}
      {icon === 'clock' && <Clock className="w-3.5 h-3.5 shrink-0" />}
      {icon === 'sparkle' && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
      {children}
    </span>
  );
};

