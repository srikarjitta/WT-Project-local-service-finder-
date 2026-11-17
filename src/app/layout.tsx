import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServiFind — Local Service Finder & Directory",
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
        {children}
      </body>
    </html>
  );
}
