"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Images,
  Upload,
  Trash2,
  Star,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import {
  getOwnerBusiness,
  getBusinessImages,
  saveBusinessImage,
  deleteBusinessImage,
  setCoverBusinessImage,
} from "@/actions/business";
import { createClient } from "@/lib/supabase/client";
import type { Business, BusinessImage } from "@/types/database.types";

export default function BusinessPhotosPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [images, setImages] = useState<BusinessImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal for URL-based or Direct Upload
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isCover, setIsCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const { business: currentBiz } = await getOwnerBusiness();
      setBusiness(currentBiz);

      if (currentBiz) {
        const items = await getBusinessImages(currentBiz.id);
        setImages(items);
      }
    } catch (err) {
      console.error("Error loading images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: "error", message: "File size exceeds 5MB limit." });
      return;
    }

    try {
      setIsUploading(true);
      setFeedback(null);
      const supabase = createClient();

      const fileExt = file.name.split(".").pop();
      const fileName = `${business.id}/${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("business-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("business-images")
        .getPublicUrl(fileName);

      // Save record in database
      const res = await saveBusinessImage(
        business.id,
        fileName,
        publicUrlData.publicUrl,
        file.name,
        images.length === 0 // If first image, auto-set as cover
      );

      if (res.success) {
        setFeedback({ type: "success", message: "Image uploaded successfully!" });
        await loadData();
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to record image" });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message:
          err.message ||
          "Upload failed. Ensure Supabase Storage bucket 'business-images' is configured, or add an image via URL.",
      });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !imageUrl) return;

    try {
      setIsUploading(true);
      setFeedback(null);
      const res = await saveBusinessImage(
        business.id,
        "external-url",
        imageUrl,
        caption || undefined,
        isCover || images.length === 0
      );

      if (res.success) {
        setIsModalOpen(false);
        setImageUrl("");
        setCaption("");
        setIsCover(false);
        setFeedback({ type: "success", message: "Photo added successfully!" });
        await loadData();
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save image" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetCover = async (imageId: string) => {
    if (!business) return;
    try {
      const res = await setCoverBusinessImage(business.id, imageId);
      if (res.success) {
        setFeedback({ type: "success", message: "Cover image updated!" });
        await loadData();
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const handleDelete = async (imageId: string, storagePath: string) => {
    if (!business) return;
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const res = await deleteBusinessImage(business.id, imageId, storagePath);
      if (res.success) {
        setFeedback({ type: "success", message: "Photo deleted." });
        setImages((prev) => prev.filter((img) => img.id !== imageId));
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
        <p className="text-gray-600">Please create your business profile before managing photos.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Photos & Media</h1>
            <p className="text-sm text-gray-500">
              Upload storefront, team, and previous work photos to attract more customers.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            variant="default"
            isLoading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Image URL
          </Button>
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

      {/* Gallery Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Photo Gallery ({images.length})</CardTitle>
          <CardDescription>
            The cover photo will be displayed prominently on search result cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl space-y-3">
              <Images className="h-10 w-10 text-gray-400 mx-auto" />
              <div className="text-sm font-medium text-gray-900">No photos added yet</div>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Profiles with photos receive up to 3x more customer inquiries. Upload your work today!
              </p>
              <div className="pt-2 flex justify-center space-x-2">
                <Button size="sm" onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-1.5" /> Add Image URL
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video flex flex-col justify-end shadow-xs"
                >
                  <img
                    src={img.url}
                    alt={img.caption || "Business photo"}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badges & Actions */}
                  <div className="relative p-3 flex items-center justify-between text-white z-10">
                    <div className="flex items-center space-x-1.5">
                      {img.is_cover ? (
                        <Badge variant="success" className="bg-emerald-600 text-white border-none shadow-xs">
                          <Star className="h-3 w-3 mr-1 fill-white" /> Cover Photo
                        </Badge>
                      ) : (
                        <button
                          onClick={() => handleSetCover(img.id)}
                          className="text-xs bg-white/20 hover:bg-white/40 text-white px-2 py-1 rounded-md backdrop-blur-xs transition-colors"
                        >
                          Set as Cover
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(img.id, img.storage_path)}
                      className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Image URL Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Image via URL"
        description="Provide a direct link to an image hosted online"
      >
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <Input
            label="Image URL *"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            required
          />

          <Input
            label="Caption (Optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Front office reception"
          />

          <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={isCover}
              onChange={(e) => setIsCover(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span>Set as primary cover photo</span>
          </label>

          <div className="flex justify-end space-x-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isUploading}>
              Add Photo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
