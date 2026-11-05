"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Tag,
  Check,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useBusiness, type ServiceItem } from "@/context/BusinessContext";

export default function BusinessServicesPage() {
  const { services, addService, updateService, deleteService } = useBusiness();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "General Electrical",
    description: "",
    priceType: "fixed" as "fixed" | "range" | "contact",
    priceMin: "" as string | number,
    priceMax: "" as string | number,
    turnaroundTime: "Same Day Dispatch",
    warranty: "30 Days Service Warranty",
    isActive: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: "",
      category: "Electrical Inspection",
      description: "",
      priceType: "fixed",
      priceMin: "499",
      priceMax: "",
      turnaroundTime: "Same Day Dispatch",
      warranty: "30 Days Service Warranty",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      priceType: service.priceType,
      priceMin: service.priceMin ?? "",
      priceMax: service.priceMax ?? "",
      turnaroundTime: service.turnaroundTime || "Same Day Dispatch",
      warranty: service.warranty || "30 Days Service Warranty",
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      priceType: formData.priceType,
      priceMin: formData.priceMin !== "" ? Number(formData.priceMin) : undefined,
      priceMax: formData.priceMax !== "" ? Number(formData.priceMax) : undefined,
      turnaroundTime: formData.turnaroundTime,
      warranty: formData.warranty,
      isActive: formData.isActive,
    };

    if (editingService) {
      updateService(editingService.id, payload);
      showToast("Service updated successfully!");
    } else {
      addService(payload);
      showToast("New service added to catalog!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this service from your catalog?")) {
      deleteService(id);
      showToast("Service removed from catalog.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/business" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Services & Pricing Catalog</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your service list, transparent price ranges, and warranty assurances.
            </p>
          </div>
        </div>

        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center space-x-3 text-emerald-900 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Services List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Active Services ({services.length})</CardTitle>
            <CardDescription className="text-xs">
              Live offerings visible on customer search and booking drawers
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {services.map((service) => (
              <div
                key={service.id}
                className="py-4.5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{service.name}</h3>
                    <Badge variant="secondary" className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100">
                      {service.category}
                    </Badge>
                    {!service.isActive && (
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">
                        Paused
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-1">
                    <span className="font-bold text-slate-900 text-sm">
                      {service.priceType === "contact"
                        ? "Price on Request"
                        : service.priceType === "range"
                        ? `₹${service.priceMin} - ₹${service.priceMax}`
                        : `₹${service.priceMin}`}
                    </span>

                    {service.turnaroundTime && (
                      <span className="inline-flex items-center text-slate-500 text-[11px]">
                        <Clock className="h-3 w-3 mr-1 text-slate-400" />
                        {service.turnaroundTime}
                      </span>
                    )}

                    {service.warranty && (
                      <span className="inline-flex items-center text-emerald-700 text-[11px] font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                        <ShieldCheck className="h-3 w-3 mr-1 text-emerald-600" />
                        {service.warranty}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 pt-2 sm:pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => openEditModal(service)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Service" : "Add Service to Catalog"}
        description="Provide comprehensive pricing and turnaround expectations"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Service Title *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Full Home Electrical Safety Inspection"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Service Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Electrical Inspection">Electrical Inspection</option>
              <option value="Appliance Installation">Appliance Installation</option>
              <option value="Emergency Repairs">Emergency Repairs</option>
              <option value="Plumbing Services">Plumbing Services</option>
              <option value="Commercial Contracts">Commercial Contracts</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Pricing Model</label>
            <select
              value={formData.priceType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priceType: e.target.value as "fixed" | "range" | "contact",
                })
              }
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="fixed">Fixed Price</option>
              <option value="range">Price Range (Starting Min – Max)</option>
              <option value="contact">Quote on Request (Requires Site Inspection)</option>
            </select>
          </div>

          {formData.priceType === "fixed" && (
            <Input
              label="Standard Price (₹) *"
              type="number"
              value={formData.priceMin}
              onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
              required
            />
          )}

          {formData.priceType === "range" && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Price (₹) *"
                type="number"
                value={formData.priceMin}
                onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                required
              />
              <Input
                label="Max Price (₹) *"
                type="number"
                value={formData.priceMax}
                onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Turnaround Time"
              value={formData.turnaroundTime}
              onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
              placeholder="e.g. Within 2 Hours"
            />
            <Input
              label="Warranty Assurance"
              value={formData.warranty}
              onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
              placeholder="e.g. 30 Days Warranty"
            />
          </div>

          <Textarea
            label="Service Scope & What's Included"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Explain the inspection procedure, tools used, and parts included..."
            rows={3}
            required
          />

          <div className="flex justify-end space-x-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingService ? "Save Changes" : "Add Service"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
