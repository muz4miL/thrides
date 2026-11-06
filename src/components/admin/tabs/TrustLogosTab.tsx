"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  UploadCloud,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  Sun,
  Moon,
  RefreshCw,
} from "lucide-react";
import type { PartnerLogoDoc, PartnerLogoSettingsDoc } from "@/server/types";
import { PartnerStrip } from "@/components/site/PartnerStrip";

interface TrustLogosTabProps {
  onNotice?: (msg: string, type?: "success" | "error") => void;
}

interface UploadProgressItem {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error" | "warning";
  warning?: string;
  error?: string;
}

// Sortable Item Card
function SortableLogoCard({
  logo,
  onUpdate,
  onDeleteRequest,
  checkerboardLight,
  onToggleCheckerboard,
}: {
  logo: PartnerLogoDoc;
  onUpdate: (id: string, updates: Partial<PartnerLogoDoc>) => Promise<void>;
  onDeleteRequest: (logo: PartnerLogoDoc) => void;
  checkerboardLight: boolean;
  onToggleCheckerboard: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: logo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.75 : 1,
  };

  const [name, setName] = useState(logo.name);
  const [altText, setAltText] = useState(logo.altText);
  const [linkUrl, setLinkUrl] = useState(logo.linkUrl || "");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(logo.id, {
        name,
        altText,
        linkUrl: linkUrl.trim() === "" ? null : linkUrl.trim(),
      });
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border transition-all duration-200 bg-[#0A0B12]/80 backdrop-blur-md p-4 sm:p-5 ${
        isDragging
          ? "border-[#0052FF] shadow-[0_0_25px_rgba(0,82,255,0.35)]"
          : "border-white/[0.08] hover:border-white/[0.15]"
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
        {/* Left: Drag Handle + Thumbnail */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
            aria-label="Drag to reorder"
          >
            <GripVertical size={18} />
          </button>

          {/* Thumbnail preview with checkerboard background toggle */}
          <div className="relative group shrink-0">
            <div
              className={`h-16 w-32 rounded-xl border border-white/10 flex items-center justify-center p-2 overflow-hidden transition-colors ${
                checkerboardLight
                  ? "bg-neutral-200"
                  : "bg-[#06070B]"
              }`}
              style={{
                backgroundImage: checkerboardLight
                  ? "linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)"
                  : "linear-gradient(45deg, #12131C 25%, transparent 25%), linear-gradient(-45deg, #12131C 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #12131C 75%), linear-gradient(-45deg, transparent 75%, #12131C 75%)",
                backgroundSize: "12px 12px",
                backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
              }}
            >
              <img
                src={logo.imageUrl}
                alt={logo.altText || logo.name}
                className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-sm"
              />
            </div>

            {/* Checkerboard mode toggle pill */}
            <button
              type="button"
              onClick={onToggleCheckerboard}
              title={`Switch to ${checkerboardLight ? "Dark" : "Light"} background to inspect transparency`}
              className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-neutral-400 hover:text-white transition-all shadow-md"
            >
              {checkerboardLight ? <Moon size={11} /> : <Sun size={11} />}
            </button>
          </div>

          {/* Quick info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-white text-[15px] truncate max-w-[180px]">
                {logo.name}
              </span>
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                {logo.width}x{logo.height}
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate max-w-[220px]">
              {logo.altText}
            </p>
          </div>
        </div>

        {/* Center: Inline Editing Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:flex-1 lg:max-w-xl">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Logo Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Partner Name"
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Alt Text <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => {
                setAltText(e.target.value);
                setIsDirty(true);
              }}
              placeholder="SEO description"
              required
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Link URL (Optional)
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value);
                setIsDirty(true);
              }}
              placeholder="https://..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
          {isDirty && (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || altText.trim() === ""}
              className="px-3 py-1.5 rounded-lg bg-[#0052FF] text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <Check size={13} />
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
          )}

          {/* Active / Inactive Toggle */}
          <button
            type="button"
            onClick={() => onUpdate(logo.id, { isActive: !logo.isActive })}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider border transition-colors ${
              logo.isActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-white/[0.04] text-neutral-500 border-white/10 hover:text-white"
            }`}
          >
            {logo.isActive ? "Active" : "Hidden"}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDeleteRequest(logo)}
            title="Delete logo"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function TrustLogosTab({ onNotice }: TrustLogosTabProps) {
  const [logos, setLogos] = useState<PartnerLogoDoc[]>([]);
  const [settings, setSettings] = useState<PartnerLogoSettingsDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadQueue, setUploadQueue] = useState<UploadProgressItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PartnerLogoDoc | null>(null);
  const [checkerboardLight, setCheckerboardLight] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/partner-logos");
      const data = await res.json();
      if (data.success) {
        setLogos(data.logos || []);
        setSettings(data.settings);
      } else {
        onNotice?.(data.error || "Failed to load partner logos", "error");
      }
    } catch {
      onNotice?.("Network error loading logos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Upload handler
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (logos.length + fileArray.length > 12) {
      onNotice?.(`Maximum 12 partner logos allowed (current: ${logos.length}).`, "error");
      return;
    }

    setIsUploading(true);
    for (const file of fileArray) {
      const queueId = `${file.name}-${Date.now()}`;
      setUploadQueue((prev) => [
        ...prev,
        { id: queueId, name: file.name, progress: 30, status: "uploading" },
      ]);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "));

      try {
        const res = await fetch("/api/admin/partner-logos", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          setLogos((prev) => [...prev, data.logo]);
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === queueId
                ? {
                    ...q,
                    progress: 100,
                    status: data.warning ? "warning" : "done",
                    warning: data.warning,
                  }
                : q
            )
          );
          if (data.warning) {
            onNotice?.(data.warning, "error");
          } else {
            onNotice?.(`Uploaded "${data.logo.name}" successfully`, "success");
          }
        } else {
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === queueId
                ? { ...q, progress: 100, status: "error", error: data.error }
                : q
            )
          );
          onNotice?.(data.error || "Upload failed", "error");
        }
      } catch (err: any) {
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === queueId
              ? { ...q, progress: 100, status: "error", error: "Network error" }
              : q
          )
        );
        onNotice?.("Network error uploading file", "error");
      }
    }
    setIsUploading(false);
  };

  // Reorder handler
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = logos.findIndex((item) => item.id === active.id);
    const newIndex = logos.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const previousLogos = [...logos];
    const newOrder = arrayMove(logos, oldIndex, newIndex);
    setLogos(newOrder);

    try {
      const res = await fetch("/api/admin/partner-logos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: newOrder.map((l) => l.id) }),
      });
      const data = await res.json();
      if (!data.success) {
        setLogos(previousLogos);
        onNotice?.(data.error || "Failed to persist reorder", "error");
      } else {
        onNotice?.("Logos reordered successfully", "success");
      }
    } catch {
      setLogos(previousLogos);
      onNotice?.("Network error reordering logos", "error");
    }
  };

  // Update logo item
  const handleUpdateLogo = async (id: string, updates: Partial<PartnerLogoDoc>) => {
    try {
      const res = await fetch(`/api/admin/partner-logos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setLogos((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
        onNotice?.("Logo updated", "success");
      } else {
        onNotice?.(data.error || "Failed to update logo", "error");
      }
    } catch {
      onNotice?.("Network error updating logo", "error");
    }
  };

  // Delete logo confirmed
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/partner-logos/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setLogos((prev) => prev.filter((l) => l.id !== deleteTarget.id));
        onNotice?.(`Deleted "${deleteTarget.name}"`, "success");
      } else {
        onNotice?.(data.error || "Failed to delete logo", "error");
      }
    } catch {
      onNotice?.("Network error deleting logo", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  // Settings update
  const handleSaveSettings = async (newSettings: Partial<PartnerLogoSettingsDoc>) => {
    if (!settings) return;
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/admin/partner-logos/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        onNotice?.("Settings saved and live site revalidated", "success");
      } else {
        onNotice?.(data.error || "Failed to save settings", "error");
      }
    } catch {
      onNotice?.("Network error saving settings", "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0052FF]">
              HOME PAGE CMS
            </span>
            <span className="font-mono text-xs text-neutral-500">·</span>
            <span className="font-mono text-xs text-neutral-400">
              {logos.length}/12 Logos
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trust & Partner Logos
          </h2>
          <p className="mt-1 text-sm text-neutral-400 max-w-xl">
            Manage the official certification and platform partner badges shown right below the hero CTA.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchData}
            title="Reload data"
            className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || logos.length >= 12}
            className="px-4 py-2.5 rounded-xl bg-[#0052FF] text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(0,82,255,0.35)] flex items-center gap-2"
          >
            <UploadCloud size={16} />
            <span>Upload Logos</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/webp,image/avif,image/jpeg"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* LIVE PREVIEW BOX */}
      {settings && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#07080D] p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-3">
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-[#0052FF]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-300">
                Live Hero Strip Preview
              </span>
            </div>
            <span className="font-mono text-[11px] text-neutral-500">
              {settings.sectionEnabled ? "Section Visible" : "Section Hidden on Live Site"}
            </span>
          </div>

          <div className="py-6 px-4 rounded-xl bg-black/60 border border-white/[0.04] flex items-center justify-center min-h-[90px]">
            {settings.sectionEnabled ? (
              <PartnerStrip logos={logos} settings={settings} align="center" />
            ) : (
              <p className="text-xs font-mono text-neutral-500 italic">
                (Partner logo section is currently disabled in settings below)
              </p>
            )}
          </div>
        </div>
      )}

      {/* DRAG AND DROP UPLOAD ZONE */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="group relative rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.015] hover:bg-white/[0.03] hover:border-[#0052FF]/50 p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center"
      >
        <div className="h-12 w-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-[#0052FF] group-hover:border-[#0052FF]/40 transition-colors mb-3">
          <UploadCloud size={24} />
        </div>
        <p className="font-display font-bold text-white text-base">
          Drag and drop partner logos here, or <span className="text-[#0052FF] group-hover:underline">browse</span>
        </p>
        <p className="mt-1 text-xs font-mono text-neutral-400">
          Transparent PNG/WebP, max 2 MB, height ~160px+ (Auto-trimmed & retina-optimized)
        </p>
      </div>

      {/* UPLOAD QUEUE PROGRESS */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2">
          {uploadQueue.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#0E0F18] text-xs font-mono"
            >
              <div className="flex items-center gap-2.5 truncate max-w-md">
                {item.status === "uploading" && <RefreshCw size={13} className="animate-spin text-[#0052FF]" />}
                {item.status === "done" && <Check size={13} className="text-emerald-400" />}
                {item.status === "warning" && <AlertCircle size={13} className="text-amber-400" />}
                {item.status === "error" && <AlertCircle size={13} className="text-rose-400" />}
                <span className="text-white truncate">{item.name}</span>
              </div>
              <div>
                {item.status === "uploading" && <span className="text-neutral-400">Processing...</span>}
                {item.status === "done" && <span className="text-emerald-400">Ready</span>}
                {item.status === "warning" && <span className="text-amber-400">{item.warning}</span>}
                {item.status === "error" && <span className="text-rose-400">{item.error}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOGO LIST (DRAG-TO-REORDER) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">
            Active Logo Order ({logos.length})
          </h3>
          <span className="text-xs font-mono text-neutral-400">
            Drag items or use keyboard to reorder
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : logos.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-neutral-400 font-mono text-xs">
            No partner logos yet. Upload your first logo above.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={logos.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {logos.map((logo) => (
                  <SortableLogoCard
                    key={logo.id}
                    logo={logo}
                    onUpdate={handleUpdateLogo}
                    onDeleteRequest={(target) => setDeleteTarget(target)}
                    checkerboardLight={checkerboardLight}
                    onToggleCheckerboard={() => setCheckerboardLight((prev) => !prev)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* SETTINGS PANEL */}
      {settings && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-[#0052FF]" />
              <h3 className="font-display font-bold text-lg text-white">
                Partner Strip Presentation Settings
              </h3>
            </div>
            {isSavingSettings && (
              <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <RefreshCw size={12} className="animate-spin" /> Saving...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Display Mode */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                Display Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveSettings({ displayMode: "static" })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    settings.displayMode === "static"
                      ? "border-[#0052FF] bg-[#0052FF]/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                  }`}
                >
                  Static Row
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSettings({ displayMode: "marquee" })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    settings.displayMode === "marquee"
                      ? "border-[#0052FF] bg-[#0052FF]/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                  }`}
                >
                  Infinite Marquee
                </button>
              </div>
            </div>

            {/* Marquee Speed */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                Marquee Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["slow", "normal", "fast"] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => handleSaveSettings({ marqueeSpeed: spd })}
                    className={`py-2 px-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      settings.marqueeSpeed === spd
                        ? "border-[#0052FF] bg-[#0052FF]/15 text-white"
                        : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Height Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                <span>Logo Height</span>
                <span className="text-[#0052FF]">{settings.logoHeight}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="48"
                step="2"
                value={settings.logoHeight}
                onChange={(e) => handleSaveSettings({ logoHeight: Number(e.target.value) })}
                className="w-full accent-[#0052FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>Compact (24px)</span>
                <span>Default (32px)</span>
                <span>Prominent (48px)</span>
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                Color Tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "original", label: "Original" },
                  { id: "muted", label: "Muted Grayscale" },
                  { id: "mono-white", label: "Mono White" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSaveSettings({ tone: t.id as any })}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition-all ${
                      settings.tone === t.id
                        ? "border-[#0052FF] bg-[#0052FF]/15 text-white"
                        : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gentle Float Effect Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                Float Animation
              </label>
              <button
                type="button"
                onClick={() => handleSaveSettings({ floatEffect: !settings.floatEffect })}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  settings.floatEffect
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                }`}
              >
                <span>Idle Float (3px)</span>
                <span>{settings.floatEffect ? "Enabled" : "Disabled"}</span>
              </button>
            </div>

            {/* Section Visibility Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                Section On/Off
              </label>
              <button
                type="button"
                onClick={() => handleSaveSettings({ sectionEnabled: !settings.sectionEnabled })}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  settings.sectionEnabled
                    ? "border-[#0052FF]/40 bg-[#0052FF]/10 text-blue-400"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-400"
                }`}
              >
                <span>Strip on Home Page</span>
                <span>{settings.sectionEnabled ? "Visible" : "Hidden"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0C0D16] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 size={20} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Delete Partner Logo
              </h3>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white font-semibold">"{deleteTarget.name}"</strong>? This will remove the logo from the home page.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 text-xs font-semibold transition-colors shadow-lg shadow-rose-500/20"
              >
                Delete Logo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
