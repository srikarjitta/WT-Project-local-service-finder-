import type { Metadata } from "next";
import React, { Suspense } from "react";
import "./globals.css";
import { CustomerLayoutWrapper } from "@/components/layout/CustomerLayoutWrapper";

export const metadata: Metadata = {
  title: "ServiFind — Local Service Finder & Governance",
  description: "Discover, compare and connect with verified local service professionals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900">
        <Suspense fallback={null}>
          <CustomerLayoutWrapper>{children}</CustomerLayoutWrapper>
        </Suspense>
      </body>
    </html>
  );
}
