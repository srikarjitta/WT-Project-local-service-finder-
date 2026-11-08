"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Building2,
  Users,
  FolderTree,
  Star,
  AlertTriangle,
  ArrowRight,
  X,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export function AdminCommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    businesses,
    users,
    categories,
  } = useAdmin();

  const [query, setQuery] = useState("");

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredBusinesses = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.locality.toLowerCase().includes(query.toLowerCase()) ||
      b.city.toLowerCase().includes(query.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (url: string) => {
    setIsCommandPaletteOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={() => setIsCommandPaletteOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-[#2563EB]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses, users, categories or jump to page..."
            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-slate-100 text-slate-500 font-mono font-semibold px-2 py-0.5 rounded-md border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 text-xs space-y-3">
          {/* Quick Pages */}
          {!query && (
            <div>
              <div className="px-3 py-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => handleSelect("/admin/businesses")}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-[#1E3A8A] font-semibold text-left transition-colors cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Business Verifications</span>
                </button>
                <button
                  onClick={() => handleSelect("/admin/users")}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-[#1E3A8A] font-semibold text-left transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#2563EB]" />
                  <span>User Directory</span>
                </button>
                <button
                  onClick={() => handleSelect("/admin/categories")}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-[#1E3A8A] font-semibold text-left transition-colors cursor-pointer"
                >
                  <FolderTree className="w-4 h-4 text-[#2563EB]" />
                  <span>Service Categories</span>
                </button>
                <button
                  onClick={() => handleSelect("/admin/reviews")}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-[#1E3A8A] font-semibold text-left transition-colors cursor-pointer"
                >
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Review Moderation</span>
                </button>
              </div>
            </div>
          )}

          {/* Businesses Search Results */}
          {filteredBusinesses.length > 0 && (
            <div>
              <div className="px-3 py-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                Businesses ({filteredBusinesses.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredBusinesses.slice(0, 4).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelect(`/admin/businesses?search=${encodeURIComponent(b.name)}`)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-[#1E3A8A] font-medium text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 group-hover:text-[#2563EB]">
                          {b.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {b.category} · {b.locality}, {b.city}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                        b.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : b.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {b.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Users Search Results */}
          {filteredUsers.length > 0 && (
            <div>
              <div className="px-3 py-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                Users ({filteredUsers.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredUsers.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelect(`/admin/users?search=${encodeURIComponent(u.name)}`)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-[#1E3A8A] font-medium text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name[0]}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 group-hover:text-[#2563EB]">
                          {u.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {u.email} · {u.city}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase px-2 py-0.5 bg-slate-100 rounded-md">
                      {u.role.replace("_", " ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories Search Results */}
          {filteredCategories.length > 0 && query && (
            <div>
              <div className="px-3 py-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                Categories ({filteredCategories.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect("/admin/categories")}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-[#1E3A8A] font-medium text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderTree className="w-4 h-4 text-[#2563EB]" />
                      <span className="font-bold text-slate-900">{c.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {c.businessCount} listings
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query &&
            filteredBusinesses.length === 0 &&
            filteredUsers.length === 0 &&
            filteredCategories.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No matching records found for "{query}"
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span className="text-[#2563EB] font-bold">ServiFind Global Search</span>
        </div>
      </motion.div>
    </div>
  );
}

