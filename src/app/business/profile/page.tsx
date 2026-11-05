"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Save, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getOwnerBusiness, getCategories, saveBusinessProfile } from "@/actions/business";
import type { Business, Category } from "@/types/database.types";
import Link from "next/link";

export default function BusinessProfilePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingBusiness, setExistingBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    tagline: "",
    description: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    address: "",
    locality: "",
    city: "",
    postal_code: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function init() {
      try {
        const [cats, { business }] = await Promise.all([
          getCategories(),
          getOwnerBusiness(),
        ]);
        setCategories(cats);
        if (business) {
          setExistingBusiness(business);
          setFormData({
            name: business.name || "",
            category_id: business.category_id || "",
            tagline: business.tagline || "",
            description: business.description || "",
            phone: business.phone || "",
            whatsapp: business.whatsapp || "",
            email: business.email || "",
            website: business.website || "",
            address: business.address || "",
            locality: business.locality || "",
            city: business.city || "",
            postal_code: business.postal_code || "",
          });
        } else if (cats.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: cats[0].id }));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSaving(true);
    setErrors({});

    try {
      const res = await saveBusinessProfile(formData, existingBusiness?.id);
      if (res.success) {
        setFeedback({
          type: "success",
          message: existingBusiness
            ? "Business profile updated successfully!"
            : "Business profile created successfully! It is now pending approval.",
        });
        if (!existingBusiness) {
          setTimeout(() => router.push("/business"), 1500);
        }
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save profile." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-96 bg-gray-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/business" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {existingBusiness ? "Edit Business Profile" : "Register Business Profile"}
            </h1>
            <p className="text-sm text-gray-500">
              Provide accurate information to help customers discover your services.
            </p>
          </div>
        </div>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Business Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">General Information</CardTitle>
            <CardDescription>Primary identity and categorization of your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Apex Electrical Solutions"
                error={errors.name}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Primary Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Tagline / Short Hook"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. Licensed residential & commercial electrical repairs"
              helperText="A brief headline displayed under your business name"
            />

            <Textarea
              label="Full Description *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your expertise, experience, and the services you provide in detail..."
              rows={4}
              error={errors.description}
              required
            />
          </CardContent>
        </Card>

        {/* Section 2: Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Contact Details</CardTitle>
            <CardDescription>How customers reach out to your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Phone Number *"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                error={errors.phone}
                required
              />

              <Input
                label="WhatsApp Number"
                name="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                helperText="For direct customer WhatsApp chats"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@apexelectrical.com"
              />

              <Input
                label="Website URL"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://apexelectrical.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Physical Address & Locality */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Location & Service Area</CardTitle>
            <CardDescription>Where your office is located and which neighborhoods you serve</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Street Address / Shop No. *"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Shop #4, Metro Complex, Road No. 2"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Locality / Area *"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Indiranagar"
                required
              />

              <Input
                label="City *"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Bengaluru"
                required
              />

              <Input
                label="Postal / PIN Code *"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="560038"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Action */}
        <div className="flex justify-end space-x-3 pt-2">
          <Link href="/business">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={isSaving} className="min-w-[140px]">
            <Save className="h-4 w-4 mr-2" />
            {existingBusiness ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
