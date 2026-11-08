"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminProvider } from "@/context/AdminContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { AdminCommandPalette } from "@/components/admin/AdminCommandPalette";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Allow /admin/login to render standalone without dashboard sidebar & topnav
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#F8FAFC]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900 font-sans antialiased selection:bg-[#2563EB]/15 selection:text-[#1E3A8A]">
      {/* Responsive Collapsible Sidebar */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Administrative Workplace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <AdminTopNav onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Global Quick Command Palette Modal */}
        <AdminCommandPalette />

        {/* Body View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
