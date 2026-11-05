"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Clock,
  Images,
  Inbox,
  Star,
  TrendingUp,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessProvider, useBusiness } from "@/context/BusinessContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: (ctx: ReturnType<typeof useBusiness>) => React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/business", icon: LayoutDashboard },
  { name: "Business Profile", href: "/business/profile", icon: Building2 },
  { name: "Services Catalog", href: "/business/services", icon: Briefcase },
  { name: "Photos & Media", href: "/business/photos", icon: Images },
  { name: "Operating Hours", href: "/business/hours", icon: Clock },
  {
    name: "Customer Enquiries",
    href: "/business/enquiries",
    icon: Inbox,
    badge: (ctx) => {
      const count = ctx.enquiries.filter((e) => e.status === "new").length;
      return count > 0 ? (
        <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      ) : null;
    },
  },
  {
    name: "Ratings & Reviews",
    href: "/business/reviews",
    icon: Star,
    badge: (ctx) => (
      <span className="ml-auto text-xs text-amber-600 font-semibold flex items-center">
        4.8 ★
      </span>
    ),
  },
  { name: "Analytics & Growth", href: "/business/analytics", icon: TrendingUp },
];

function BusinessShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ctx = useBusiness();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            LSF
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs truncate max-w-[180px]">
              {ctx.business.name}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center">
              <ShieldCheck className="h-3 w-3 mr-0.5" /> Verified Business
            </div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 shadow-xs",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand & Portal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href="/business" className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              LSF
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm tracking-tight">Local Service Finder</div>
              <div className="text-[11px] text-indigo-600 font-medium">Business Portal</div>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Business Card snippet */}
        <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Listing</span>
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              <ShieldCheck className="h-3 w-3 mr-0.5 text-emerald-600" /> JD-Verified
            </span>
          </div>
          <div className="font-bold text-xs text-slate-900 mt-1 truncate">
            {ctx.business.name}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
            <span>{ctx.business.locality}, {ctx.business.city}</span>
            <span className="text-indigo-600 font-medium">{ctx.business.profileCompletionScore}% complete</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors group",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span className="truncate">{item.name}</span>
                {item.badge && item.badge(ctx)}
                {isActive && !item.badge && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-indigo-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Demo Controls */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <button
            onClick={() => {
              if (confirm("Reset all business portal data back to sample defaults?")) {
                ctx.resetToDefaults();
              }
            }}
            className="w-full flex items-center justify-center space-x-1.5 text-xs text-slate-500 hover:text-indigo-600 hover:bg-slate-50 py-1.5 px-2 rounded-lg border border-dashed border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <Link
            href="/"
            className="flex items-center justify-between text-xs text-slate-500 hover:text-indigo-600 font-medium px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span>Customer View</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/auth"
            className="flex items-center justify-between text-xs text-slate-500 hover:text-indigo-600 font-medium px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span>Sign In / Register</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <div className="hidden md:flex bg-white border-b border-slate-200 px-6 py-3 items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">Live Business:</span>
            <span className="text-xs font-bold text-slate-900">{ctx.business.name}</span>
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="h-3 w-3 mr-1 text-emerald-600" /> Verified Listing
            </span>
            <span className="inline-flex items-center text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              {ctx.business.locality}, {ctx.business.city}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1 text-amber-500 font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              <span>4.8 Rating</span>
              <span className="text-slate-400 font-normal">({ctx.reviews.length} reviews)</span>
            </div>
            <span className="text-slate-300">|</span>
            <Link href="/business/profile">
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Edit Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <BusinessProvider>
      <BusinessShell>{children}</BusinessShell>
    </BusinessProvider>
  );
}
