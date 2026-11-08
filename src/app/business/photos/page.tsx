"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Images,
  Plus,
  Trash2,
  Star,
  ArrowLeft,
  CheckCircle2,
  Upload,
  Eye,
  Camera,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { useBusiness, type BusinessPhoto } from "@/context/BusinessContext";

const ALBUMS = [
  { id: "all", label: "All Photos" },
  { id: "portfolio", label: "Work & Portfolio" },
  { id: "facade", label: "Storefront & Signboard" },
  { id: "interior", label: "Office & Workshop" },
  { id: "certificate", label: "Certifications & Awards" },
];

const SAMPLE_PRESETS = [
  {
    label: "Main Distribution Board",
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    category: "portfolio" as const,
  },
  {
    label: "Service Van & Tools",
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    category: "facade" as const,
  },
  {
    label: "Technician Testing Voltage",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    category: "portfolio" as const,
  },
  {
    label: "Modern Electrical Wiring",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    category: "portfolio" as const,
  },
];

export default function BusinessPhotosPage() {
  const { photos, addPhoto, deletePhoto, setCoverPhoto } = useBusiness();
  const [activeAlbum, setActiveAlbum] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<"facade" | "interior" | "portfolio" | "certificate">("portfolio");
  const [caption, setCaption] = useState("");
  const [isCover, setIsCover] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredPhotos = activeAlbum === "all" ? photos : photos.filter((p) => p.category === activeAlbum);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    addPhoto({
      url: url.trim(),
      category,
      caption: caption || "Business photo",
      isCover: isCover || photos.length === 0,
    });

    setIsModalOpen(false);
    setUrl("");
    setCaption("");
    setIsCover(false);
    showToast("Photo added to gallery!");
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setUrl(preset.url);
    setCategory(preset.category);
    setCaption(preset.label);
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Photos & Media Gallery</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Showcase your storefront, verified team, and previous high-quality work to build customer trust.
            </p>
          </div>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center space-x-3 text-emerald-900 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Album Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {ALBUMS.map((alb) => (
          <button
            key={alb.id}
            onClick={() => setActiveAlbum(alb.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeAlbum === alb.id
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {alb.label}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {ALBUMS.find((a) => a.id === activeAlbum)?.label} ({filteredPhotos.length})
          </CardTitle>
          <CardDescription className="text-xs">
            The cover photo will be displayed prominently on search result cards and Google rich snippets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPhotos.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
              <Camera className="h-10 w-10 text-slate-300 mx-auto" />
              <div className="text-sm font-semibold text-slate-800">No photos in this album yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload storefront, interior, or certificate photos to showcase your business credibility.
              </p>
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1.5" /> Add First Photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex flex-col justify-end shadow-xs"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Badges & Actions */}
                  <div className="relative p-3 flex flex-col space-y-2 z-10 text-white">
                    <p className="text-xs font-semibold line-clamp-1">{photo.caption}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/20">
                      <div>
                        {photo.isCover ? (
                          <Badge variant="success" className="bg-emerald-600 text-white border-none shadow-xs text-[10px]">
                            <Star className="h-3 w-3 mr-1 fill-white" /> Primary Cover
                          </Badge>
                        ) : (
                          <button
                            onClick={() => {
                              setCoverPhoto(photo.id);
                              showToast("Updated primary cover photo!");
                            }}
                            className="text-[11px] bg-white/25 hover:bg-white/40 text-white px-2 py-0.5 rounded-md backdrop-blur-xs transition-colors cursor-pointer"
                          >
                            Set as Cover
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (confirm("Remove this photo?")) {
                            deletePhoto(photo.id);
                            showToast("Photo removed from gallery.");
                          }
                        }}
                        className="p-1 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Photo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Photo to Gallery"
        description="Provide a direct photo URL or choose from curated professional sample photos"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {/* Presets Quick Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Quick Pick Professional Photos:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="text-left p-2 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs transition-all flex items-center space-x-2"
                >
                  <img src={preset.url} alt="" className="h-8 w-8 rounded object-cover shrink-0" />
                  <span className="truncate font-medium text-slate-800">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Image URL *"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Album Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="portfolio">Work & Portfolio</option>
              <option value="facade">Storefront & Signboard</option>
              <option value="interior">Office & Workshop</option>
              <option value="certificate">Certifications & Awards</option>
            </select>
          </div>

          <Input
            label="Photo Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Living room LED lighting installation"
          />

          <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={isCover}
              onChange={(e) => setIsCover(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span>Set as primary cover photo for search result cards</span>
          </label>

          <div className="flex justify-end space-x-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Photo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
