"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Save,
  ArrowLeft,
  CheckCircle2,
  Tag,
  Phone,
  Mail,
  Globe,
  MapPin,
  CreditCard,
  ShieldCheck,
  Plus,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBusiness } from "@/context/BusinessContext";

const AVAILABLE_CATEGORIES = [
  "Home Services",
  "Electrical & Electronics",
  "Plumbing & Sanitation",
  "Carpentry & Furniture",
  "Automotive & Garage",
  "Health & Wellness",
  "Event & Catering",
  "Professional Services",
];

export default function BusinessProfilePage() {
  const { business, updateProfile } = useBusiness();
  const [formData, setFormData] = useState({ ...business });
  const [newTag, setNewTag] = useState("");
  const [savedToast, setSavedToast] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (key: keyof typeof business.amenities, val: any) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: val,
      },
    }));
  };

  const handlePaymentToggle = (mode: string) => {
    const current = formData.amenities.paymentsAccepted;
    const exists = current.includes(mode);
    const updated = exists ? current.filter((m) => m !== mode) : [...current, mode];
    handleAmenityChange("paymentsAccepted", updated);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!formData.specializations.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newTag.trim()],
      }));
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/business" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Profile</h1>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3 w-3 mr-1 text-emerald-600" /> Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your complete digital listing as seen by local customers on search.
            </p>
          </div>
        </div>

        <Button onClick={handleSubmit} className="shadow-sm">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {savedToast && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center space-x-3 text-emerald-900 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">Business profile details updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Business Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Business Identity & Registration</CardTitle>
            <CardDescription>Primary trade name and legal structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registered Business Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Business Structure</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership Firm">Partnership Firm</option>
                  <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                  <option value="Private Limited Company">Private Limited Company</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Year Established"
                name="yearEstablished"
                type="number"
                value={formData.yearEstablished}
                onChange={handleInputChange}
              />

              <Input
                label="GSTIN / Business Registration No."
                name="gstin"
                value={formData.gstin || ""}
                onChange={handleInputChange}
                placeholder="29AAAAA0000A1Z5"
                helperText="Adds the 'GST Verified' trust badge to your listing"
              />
            </div>

            <Input
              label="Tagline / Short Subtitle"
              name="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              placeholder="e.g. Certified electricians with 24/7 emergency dispatch"
            />

            <Input
              label="Primary Contact Person / Business Owner"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Section 2: Categories & Specializations (Tags) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Category & Specializations</CardTitle>
            <CardDescription>
              Help customers find you when searching for specific services or keywords
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Primary Industry Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {AVAILABLE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Specializations & Keywords</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.specializations.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 text-indigo-400 hover:text-indigo-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="e.g. Inverter Rewiring, Commercial Panel, Geyser Fitting"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4 mr-1" /> Add Tag
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Omni-Channel Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Contact & Communications</CardTitle>
            <CardDescription>Direct channels through which customers connect with you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Mobile Phone *"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />

              <Input
                label="WhatsApp Business Number *"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                helperText="Enables 1-click WhatsApp customer chat"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Office Landline / Secondary"
                name="secondaryPhone"
                value={formData.secondaryPhone}
                onChange={handleInputChange}
              />

              <Input
                label="Customer Support Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <Input
                label="Website URL"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Detailed Location & Landmark */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Physical Location & Landmark</CardTitle>
            <CardDescription>Precise locality details to rank high in nearby searches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Street Address / Shop No. *"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Prominent Landmark *"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              placeholder="e.g. Opposite BDA Complex, Near Empire Hotel"
              helperText="Helps local customers and technicians pinpoint your office"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Locality / Neighborhood *"
                name="locality"
                value={formData.locality}
                onChange={handleInputChange}
                required
              />

              <Input
                label="City *"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />

              <Input
                label="PIN Code *"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Business Amenities & Payment Modes (Justdial Style) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Payment Modes & Service Amenities</CardTitle>
            <CardDescription>Displayed as amenity badges on your public listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Accepted Modes of Payment</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["UPI / GPay / PhonePe", "Credit & Debit Cards", "Cash", "Net Banking"].map((mode) => {
                  const isChecked = formData.amenities.paymentsAccepted.includes(mode);
                  return (
                    <label
                      key={mode}
                      className={`flex items-center space-x-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-indigo-50 border-indigo-200 text-indigo-900"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handlePaymentToggle(mode)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span>{mode}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700">Facility Badges</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.hasEmergencyService}
                    onChange={(e) => handleAmenityChange("hasEmergencyService", e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">24/7 Emergency Service Dispatch</span>
                    <span className="text-slate-500 text-[11px]">Displays 'Emergency Available' badge</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.homeVisitsAvailable}
                    onChange={(e) => handleAmenityChange("homeVisitsAvailable", e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Doorstep & Home Visits Available</span>
                    <span className="text-slate-500 text-[11px]">Technicians travel to customer premises</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.hasParking}
                    onChange={(e) => handleAmenityChange("hasParking", e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Customer Parking Available</span>
                    <span className="text-slate-500 text-[11px]">2-wheeler and 4-wheeler parking space</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.isAirConditioned}
                    onChange={(e) => handleAmenityChange("isAirConditioned", e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Air Conditioned Waiting Lounge</span>
                    <span className="text-slate-500 text-[11px]">Comfortable waiting area for clients</span>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-3 pt-2">
          <Link href="/business">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="min-w-[140px]">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
