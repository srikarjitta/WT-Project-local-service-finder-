"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function CustomerLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine whether current path is an Admin, Business Owner, or dedicated Auth route
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname === "/auth";
  const isBusinessOwner =
    pathname === "/business" ||
    pathname.startsWith("/business/profile") ||
    pathname.startsWith("/business/services") ||
    pathname.startsWith("/business/hours") ||
    pathname.startsWith("/business/photos") ||
    pathname.startsWith("/business/enquiries") ||
    pathname.startsWith("/business/reviews") ||
    pathname.startsWith("/business/analytics");

  if (isAdmin || isAuth || isBusinessOwner) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
