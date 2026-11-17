'use client';
import React from 'react';
import Link from 'next/link';
import {
  Home,
  Wrench,
  Sparkles,
  Car,
  HeartPulse,
  GraduationCap,
  PartyPopper,
  Building2,
  ShoppingBag,
  Briefcase,
  PlaneTakeoff,
  Hotel,
  LucideIcon,
  ChevronRight,
} from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  compact?: boolean;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Wrench,
  Sparkles,
  Car,
  HeartPulse,
  GraduationCap,
  PartyPopper,
  Building2,
  ShoppingBag,
  Briefcase,
  PlaneTakeoff,
  Hotel,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  compact = false,
  className,
}) => {
  const IconComponent = ICON_MAP[category.iconName] || Home;

  return (
    <Link
      href={`/search?category=${category.slug}`}
      className={cn(
        'group bg-white rounded-2xl p-4 md:p-5 border border-[#DBEAFE] transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-400 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden',
        className
      )}
    >
      {/* Subtle background glow */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-blue-50 group-hover:bg-blue-100/60 transition-colors pointer-events-none -z-0" />

      <div className="relative z-10">
        {/* Icon & count badge */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/60 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-105">
            <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 group-hover:text-blue-600 transition-colors bg-slate-50 group-hover:bg-blue-50 px-2 py-0.5 rounded-full border border-slate-100 group-hover:border-blue-100">
            {category.count}+ listings
          </span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-sm md:text-base text-[#1E3A8A] group-hover:text-blue-600 transition-colors leading-snug mb-1">
          {category.name}
        </h3>

        {/* Description or subcategories */}
        {!compact && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold group-hover:text-blue-700 relative z-10">
        <span>Explore Category</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

