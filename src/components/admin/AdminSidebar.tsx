"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  FolderTree,
  Star,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  LogOut,
  X,
  Compass,
  Store,
  Layers,
  ChevronLeft,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function AdminSidebar({
  mobileOpen,
  setMobileOpen,
  isCollapsed,
  setIsCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { metrics, resetToDefaults, seedMoreDemoData } = useAdmin();

  const navItems = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Business Directory & Approvals",
      href: "/admin/businesses",
      icon: Building2,
      badge:
        metrics.pendingApprovals > 0 ? (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white animate-pulse">
            {metrics.pendingApprovals}
          </span>
        ) : null,
    },
    {
      name: "User & Role Management",
      href: "/admin/users",
      icon: Users,
      badge: (
        <span className="ml-auto text-[11px] text-slate-500 font-medium">
          {metrics.totalUsers}
        </span>
      ),
    },
    {
      name: "Categories & Taxonomy",
      href: "/admin/categories",
      icon: FolderTree,
      badge: null,
    },
    {
      name: "Review Moderation",
      href: "/admin/reviews",
      icon: Star,
      badge:
        metrics.flaggedReviewsCount > 0 ? (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white">
            {metrics.flaggedReviewsCount} flagged
          </span>
        ) : null,
    },
    {
      name: "Disputes & Reports",
      href: "/admin/reports",
      icon: AlertTriangle,
      badge:
        metrics.openReportsCount > 0 ? (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white">
            {metrics.openReportsCount}
          </span>
        ) : null,
    },
    {
      name: "Platform Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      name: "System Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 ease-in-out md:static ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-72"} shadow-xs md:shadow-none`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-3 group overflow-hidden"
          >
            {/* ServiFind Modern Brand Logo Mark */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#1E3A8A] text-lg tracking-tight font-sans">
                    ServiFind
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-blue-200/80">
                    Admin
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Operations & Governance
                </span>
              </motion.div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Pending Alert Box */}
        {!isCollapsed && metrics.pendingApprovals > 0 && (
          <div className="mx-3 mt-3 p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="font-semibold text-amber-900">
                {metrics.pendingApprovals} Verification Queue
              </span>
            </div>
            <Link
              href="/admin/businesses?status=pending"
              className="text-[#2563EB] hover:text-[#1E3A8A] font-bold text-[11px] hover:underline"
            >
              Review →
            </Link>
          </div>
        )}

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#1E3A8A] font-bold shadow-xs border border-blue-200/60"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#2563EB] rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-[#2563EB]"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{item.name}</span>
                    {item.badge}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Portal Switcher & Demo Shortcuts */}
        {!isCollapsed ? (
          <div className="p-3 mx-3 mb-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Cross-Portal Switcher
            </div>
            <Link
              href="/business"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-[#1E3A8A] hover:bg-white font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-indigo-600" /> Business Owner Portal
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
            <Link
              href="/auth"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-[#1E3A8A] hover:bg-white font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#2563EB]" /> Customer Directory
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-2">
              <button
                onClick={() => seedMoreDemoData()}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#2563EB] hover:border-blue-300 font-semibold text-[11px] transition-all cursor-pointer shadow-2xs"
                title="Add a sample pending business application"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>+ Seed Test App</span>
              </button>
              <button
                onClick={() => {
                  if (confirm("Reset admin state back to default ServiFind seed data?")) {
                    resetToDefaults();
                  }
                }}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                title="Reset demo data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-slate-100 flex flex-col items-center gap-2">
            <Link
              href="/business"
              title="Business Portal"
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
            >
              <Store className="w-4 h-4" />
            </Link>
            <button
              onClick={() => resetToDefaults()}
              title="Reset Demo Data"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Admin User Footer Card */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
              AD
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-xs truncate">
                    Dheeraj
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  admin@servifind.com
                </div>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={() => alert("Session management: Admin is authenticated.")}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Sign out / Session info"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

