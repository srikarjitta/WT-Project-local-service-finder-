"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  ChevronDown,
  Shield,
  Layers,
  ArrowRight,
  X,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface AdminTopNavProps {
  onOpenMobileMenu: () => void;
}

export function AdminTopNav({ onOpenMobileMenu }: AdminTopNavProps) {
  const pathname = usePathname();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    selectedCity,
    setSelectedCity,
    setIsCommandPaletteOpen,
    seedMoreDemoData,
    metrics,
  } = useAdmin();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Breadcrumbs title resolution
  const getBreadcrumbs = () => {
    if (pathname === "/admin") return ["ServiFind Admin", "Platform Overview"];
    if (pathname.startsWith("/admin/businesses"))
      return ["ServiFind Admin", "Business Directory & Verifications"];
    if (pathname.startsWith("/admin/users"))
      return ["ServiFind Admin", "User & Role Management"];
    if (pathname.startsWith("/admin/categories"))
      return ["ServiFind Admin", "Categories & Taxonomy"];
    if (pathname.startsWith("/admin/reviews"))
      return ["ServiFind Admin", "Review Moderation"];
    if (pathname.startsWith("/admin/reports"))
      return ["ServiFind Admin", "Disputes & Reports"];
    if (pathname.startsWith("/admin/analytics"))
      return ["ServiFind Admin", "Deep Analytics"];
    if (pathname.startsWith("/admin/settings"))
      return ["ServiFind Admin", "System Governance & Settings"];
    return ["ServiFind Admin", "Operations"];
  };

  const breadcrumbs = getBreadcrumbs();
  const CITIES = [
    "All Cities",
    "Bengaluru",
    "New Delhi",
    "Mumbai",
    "Gurugram",
    "Chennai",
    "Hyderabad",
    "Pune",
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">{breadcrumbs[0]}</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-[#1E3A8A]">{breadcrumbs[1]}</span>
        </div>
      </div>

      {/* Center: Global Command Search Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-white text-slate-400 hover:text-slate-600 transition-all text-xs cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] transition-colors" />
            <span className="font-medium text-slate-500 group-hover:text-slate-700">
              Quick search businesses, users, categories...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-white border border-slate-200 rounded-md shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: City selector, Health status, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* City Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {cityDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Filter by Metro Region
              </div>
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setCityDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 font-medium hover:bg-blue-50 transition-colors flex items-center justify-between ${
                    selectedCity === city
                      ? "text-[#2563EB] font-bold bg-blue-50/60"
                      : "text-slate-700"
                  }`}
                >
                  <span>{city}</span>
                  {selectedCity === city && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live System Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Platform Live · v2.4</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-200" />
                    <span className="font-bold text-xs">Activity & System Alerts</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead()}
                      className="text-[11px] text-blue-100 hover:text-white font-medium underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications at this time
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs flex gap-3 ${
                          !n.read ? "bg-blue-50/40" : ""
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {n.type === "business_registration" ? (
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center">
                              <Shield className="w-3.5 h-3.5" />
                            </div>
                          ) : n.type === "report_filed" ? (
                            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                              <AlertCircle className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 truncate">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">
                            {n.message}
                          </p>
                          {n.linkHref && (
                            <Link
                              href={n.linkHref}
                              onClick={() => setNotificationsOpen(false)}
                              className="inline-flex items-center gap-1 text-[11px] text-[#2563EB] font-bold mt-1.5 hover:underline"
                            >
                              <span>Take Action</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Seed Button */}
        <button
          onClick={() => seedMoreDemoData()}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white font-semibold text-xs shadow-xs hover:shadow-blue-500/25 hover:brightness-110 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ New App</span>
        </button>
      </div>
    </header>
  );
}

