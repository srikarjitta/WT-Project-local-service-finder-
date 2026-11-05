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
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/business", icon: LayoutDashboard },
  { name: "Business Profile", href: "/business/profile", icon: Building2 },
  { name: "Services", href: "/business/services", icon: Briefcase },
  { name: "Photos & Media", href: "/business/photos", icon: Images },
  { name: "Operating Hours", href: "/business/hours", icon: Clock },
  { name: "Enquiries Inbox", href: "/business/enquiries", icon: Inbox },
];

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            LS
          </div>
          <span className="font-semibold text-gray-900 text-sm">Business Portal</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <Link href="/business" className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              LS
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">Local Service Finder</div>
              <div className="text-xs text-indigo-600 font-medium">Business Portal</div>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-gray-400")} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4 text-indigo-600" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Customer Link */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-gray-500 hover:text-indigo-600 font-medium px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>Customer View</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-700 font-medium">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span>Owner Access Verified</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Role: business_owner</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
