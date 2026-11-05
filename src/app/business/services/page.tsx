"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  getOwnerBusiness,
  getBusinessServices,
  saveBusinessService,
  deleteBusinessService,
} from "@/actions/business";
import type { Business, BusinessService } from "@/types/database.types";

export default function BusinessServicesPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<BusinessService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<BusinessService | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_type: "fixed" as "fixed" | "range" | "contact",
    price_min: "" as string | number,
    price_max: "" as string | number,
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const { business: currentBiz } = await getOwnerBusiness();
      setBusiness(currentBiz);

      if (currentBiz) {
        const items = await getBusinessServices(currentBiz.id);
        setServices(items);
      }
    } catch (err) {
      console.error("Error loading services:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      price_type: "fixed",
      price_min: "",
      price_max: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: BusinessService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      price_type: service.price_type,
      price_min: service.price_min ?? "",
      price_max: service.price_max ?? "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        price_type: formData.price_type,
        price_min: formData.price_min !== "" ? Number(formData.price_min) : undefined,
        price_max: formData.price_max !== "" ? Number(formData.price_max) : undefined,
      };

      const res = await saveBusinessService(business.id, payload, editingService?.id);
      if (res.success) {
        setIsModalOpen(false);
        setFeedback({
          type: "success",
          message: editingService ? "Service updated successfully!" : "Service added successfully!",
        });
        await loadData();
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save service" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!business) return;
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await deleteBusinessService(business.id, serviceId);
      if (res.success) {
        setFeedback({ type: "success", message: "Service deleted successfully" });
        setServices((prev) => prev.filter((s) => s.id !== serviceId));
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to delete" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-64 bg-gray-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-gray-600">Please create your business profile before managing services.</p>
        <Link href="/business/profile">
          <Button>Create Business Profile</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/business" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services & Pricing</h1>
            <p className="text-sm text-gray-500">
              List the specific services your business offers, with clear pricing options.
            </p>
          </div>
        </div>

        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {feedback && (
        <div
          className={`rounded-xl p-4 flex items-center space-x-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Service Catalog ({services.length})</CardTitle>
          <CardDescription>These services are visible on your public listing</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl space-y-3">
              <Briefcase className="h-8 w-8 text-gray-400 mx-auto" />
              <div className="text-sm font-medium text-gray-900">No services added yet</div>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Add the key services you offer so customers can inquire about specific work.
              </p>
              <Button size="sm" onClick={openAddModal}>
                <Plus className="h-4 w-4 mr-2" /> Add First Service
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {services.map((service) => (
                <div key={service.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{service.name}</h4>
                      <Badge variant="secondary">
                        {service.price_type === "contact"
                          ? "Quote on Request"
                          : service.price_type === "range"
                          ? `₹${service.price_min ?? 0} - ₹${service.price_max ?? ""}`
                          : `₹${service.price_min ?? 0}`}
                      </Badge>
                    </div>
                    {service.description && (
                      <p className="text-xs text-gray-500">{service.description}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(service)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Service" : "Add New Service"}
        description="Provide service details and indicative pricing"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Service Title *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Switchboard Installation & Rewiring"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Pricing Model *</label>
            <select
              value={formData.price_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price_type: e.target.value as "fixed" | "range" | "contact",
                })
              }
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="fixed">Fixed Price</option>
              <option value="range">Price Range (Min - Max)</option>
              <option value="contact">Quote on Request (Contact for Price)</option>
            </select>
          </div>

          {formData.price_type === "fixed" && (
            <Input
              label="Price (₹) *"
              type="number"
              min="0"
              value={formData.price_min}
              onChange={(e) => setFormData({ ...formData, price_min: e.target.value })}
              placeholder="e.g. 499"
              required
            />
          )}

          {formData.price_type === "range" && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Price (₹) *"
                type="number"
                min="0"
                value={formData.price_min}
                onChange={(e) => setFormData({ ...formData, price_min: e.target.value })}
                placeholder="e.g. 500"
                required
              />
              <Input
                label="Max Price (₹) *"
                type="number"
                min="0"
                value={formData.price_max}
                onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
                placeholder="e.g. 1500"
                required
              />
            </div>
          )}

          <Textarea
            label="Service Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What is included in this service?"
            rows={3}
          />

          <div className="flex justify-end space-x-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingService ? "Save Changes" : "Create Service"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
