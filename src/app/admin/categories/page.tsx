"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderTree,
  Plus,
  Wrench,
  Car,
  HeartPulse,
  GraduationCap,
  PartyPopper,
  Briefcase,
  Zap,
  Hammer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Edit,
  House,
  Utensils,
  Camera,
} from "lucide-react";
import { useAdmin, AdminCategory } from "@/context/AdminContext";
import { Modal } from "@/components/ui/modal";

const ICON_MAP: Record<string, React.ElementType> = {
  Wrench: Wrench,
  Car: Car,
  car: Car,
  HeartPulse: HeartPulse,
  "heart-pulse": HeartPulse,
  GraduationCap: GraduationCap,
  "graduation-cap": GraduationCap,
  PartyPopper: PartyPopper,
  Briefcase: Briefcase,
  briefcase: Briefcase,
  Zap: Zap,
  Hammer: Hammer,
  Sparkles: Sparkles,
  sparkles: Sparkles,
  House: House,
  house: House,
  Utensils: Utensils,
  utensils: Utensils,
  Camera: Camera,
  camera: Camera,
};

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    iconName: "Wrench",
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      iconName: "Wrench",
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: AdminCategory) => {
    setEditingCat(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description,
      iconName: c.iconName,
      isActive: c.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    if (editingCat) {
      updateCategory(editingCat.id, {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        iconName: formData.iconName,
        isActive: formData.isActive,
      });
    } else {
      addCategory({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        iconName: formData.iconName,
        isActive: formData.isActive,
        colorScheme: {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
        },
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ── 1. HEADER ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1E3A8A] font-sans">
              Service Taxonomy & Category Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-blue-200">
              {categories.length} active sectors
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organize local service domains, sub-specializations, and directory navigation tags.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white font-bold text-xs shadow-xs hover:brightness-110 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Category</span>
        </button>
      </div>

      {/* ── 2. CATEGORIES GRID ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c) => {
          const IconComp = ICON_MAP[c.iconName] || Wrench;
          return (
            <motion.div
              key={c.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-blue-100 shadow-2xs">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      c.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {c.isActive ? "Active in Nav" : "Hidden"}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-[#1E3A8A] text-base">
                    {c.name}
                  </h3>
                  <code className="text-[10px] font-mono text-[#2563EB] font-semibold">
                    /{c.slug}
                  </code>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Listings
                    </span>
                    <div className="font-extrabold text-[#1E3A8A] text-sm mt-0.5">
                      {c.businessCount}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Total Leads
                    </span>
                    <div className="font-extrabold text-emerald-600 text-sm mt-0.5">
                      {c.enquiryCount}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:text-[#1E3A8A] px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete category "${c.name}"?`)) {
                        deleteCategory(c.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── 3. ADD / EDIT MODAL ─────────────────────────────────────────── */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCat ? `Edit Category: ${editingCat.name}` : "Create New Category"}
          description="Service categories dictate the primary homepage filters and matching algorithm"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Category Title</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  setFormData({
                    ...formData,
                    name: val,
                    slug: editingCat ? formData.slug : autoSlug,
                  });
                }}
                placeholder="e.g. Appliance Repair & Servicing"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="appliance-repair"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Lucide React Icon</label>
              <select
                value={formData.iconName}
                onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Wrench">Wrench (Home Services / Mechanical)</option>
                <option value="Zap">Zap (Electrician / Energy)</option>
                <option value="Hammer">Hammer (Carpentry / Construction)</option>
                <option value="Car">Car (Automotive / Garages)</option>
                <option value="HeartPulse">HeartPulse (Clinics / Diagnostics)</option>
                <option value="GraduationCap">GraduationCap (Tutors / Coaching)</option>
                <option value="PartyPopper">PartyPopper (Events / Banquets)</option>
                <option value="Briefcase">Briefcase (Legal / Chartered Accountants)</option>
                <option value="Sparkles">Sparkles (Cleaning / Detailing)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of professions and requirements covered under this sector..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="activeCheck"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded text-[#2563EB] focus:ring-blue-500"
              />
              <label htmlFor="activeCheck" className="font-semibold text-slate-700 cursor-pointer">
                Publicly discoverable on ServiFind customer home and search
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold transition-all shadow-xs cursor-pointer"
              >
                {editingCat ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

