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
  Plus,
  Trash2,
  GripVertical,
  UploadCloud,
  Check,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Sliders,
  BarChart3,
  Type,
  Image as ImageIcon,
} from "lucide-react";

interface StatPill {
  id: string;
  value: string;
  sortOrder: number;
  isActive: boolean;
}

interface MarqueeItemData {
  id: string;
  text: string;
  sortOrder: number;
  isActive: boolean;
}

interface FloatingLogo {
  id: string;
  name: string;
  altText: string;
  imageUrl: string;
  width: number;
  height: number;
  sortOrder: number;
  isActive: boolean;
}

interface StripSettings {
  marqueeSectionEnabled: boolean;
  marqueeSpeedPixelsPerSec: number;
  logoCloudEnabled: boolean;
}

interface StatsStripTabProps {
  onNotice?: (msg: string, type?: "success" | "error") => void;
}

type ActiveSection = "pills" | "marquee" | "logos" | "settings";

// ─── Sortable Pill Row ─────────────────────────────────────────────────────
function SortablePillRow({
  pill,
  onUpdate,
  onDelete,
}: {
  pill: StatPill;
  onUpdate: (id: string, updates: Partial<StatPill>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: pill.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  const [value, setValue] = useState(pill.value);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (value.trim() === pill.value) return;
    setSaving(true);
    await onUpdate(pill.id, { value: value.trim() });
    setSaving(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0a0b10] p-3">
      <button {...attributes} {...listeners} className="cursor-grab text-neutral-600 hover:text-neutral-400">
        <GripVertical size={16} />
      </button>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Enter" && save()}
        className="flex-1 bg-transparent text-sm text-white outline-none placeholder-neutral-600 font-bold tracking-widest uppercase"
        placeholder="e.g. 3 Years"
      />
      {saving && <RefreshCw size={14} className="animate-spin text-neutral-500" />}
      <button
        onClick={() => onUpdate(pill.id, { isActive: !pill.isActive })}
        title={pill.isActive ? "Hide" : "Show"}
        className={`rounded-lg p-1.5 text-xs transition-colors ${pill.isActive ? "text-emerald-400 hover:text-emerald-300" : "text-neutral-600 hover:text-neutral-400"}`}
      >
        {pill.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <button
        onClick={() => onDelete(pill.id)}
        className="rounded-lg p-1.5 text-neutral-600 hover:text-red-400 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Sortable Marquee Row ──────────────────────────────────────────────────
function SortableMarqueeRow({
  item,
  onUpdate,
  onDelete,
}: {
  item: MarqueeItemData;
  onUpdate: (id: string, updates: Partial<MarqueeItemData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  const [text, setText] = useState(item.text);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (text.trim() === item.text) return;
    setSaving(true);
    await onUpdate(item.id, { text: text.trim() });
    setSaving(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0a0b10] p-3">
      <button {...attributes} {...listeners} className="cursor-grab text-neutral-600 hover:text-neutral-400">
        <GripVertical size={16} />
      </button>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Enter" && save()}
        className="flex-1 bg-transparent text-sm text-white outline-none placeholder-neutral-600"
        placeholder="e.g. On-Purpose Marketing"
      />
      {saving && <RefreshCw size={14} className="animate-spin text-neutral-500" />}
      <button
        onClick={() => onUpdate(item.id, { isActive: !item.isActive })}
        title={item.isActive ? "Hide" : "Show"}
        className={`rounded-lg p-1.5 transition-colors ${item.isActive ? "text-emerald-400 hover:text-emerald-300" : "text-neutral-600 hover:text-neutral-400"}`}
      >
        {item.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <button
        onClick={() => onDelete(item.id)}
        className="rounded-lg p-1.5 text-neutral-600 hover:text-red-400 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Sortable Logo Card ────────────────────────────────────────────────────
function SortableLogoCard({
  logo,
  onUpdate,
  onDelete,
}: {
  logo: FloatingLogo;
  onUpdate: (id: string, updates: Partial<FloatingLogo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: logo.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1, zIndex: isDragging ? 50 : undefined };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0a0b10] p-3">
      <button {...attributes} {...listeners} className="cursor-grab text-neutral-600 hover:text-neutral-400 shrink-0">
        <GripVertical size={16} />
      </button>
      <div className="h-10 w-16 shrink-0 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
        <Image
          src={logo.imageUrl}
          alt={logo.altText || logo.name}
          width={logo.width || 64}
          height={logo.height || 32}
          className="h-8 w-auto object-contain"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate">{logo.name}</p>
        <p className="text-[10px] text-neutral-500 truncate">{logo.altText}</p>
      </div>
      <button
        onClick={() => onUpdate(logo.id, { isActive: !logo.isActive })}
        title={logo.isActive ? "Hide" : "Show"}
        className={`shrink-0 rounded-lg p-1.5 transition-colors ${logo.isActive ? "text-emerald-400 hover:text-emerald-300" : "text-neutral-600 hover:text-neutral-400"}`}
      >
        {logo.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <button
        onClick={() => onDelete(logo.id)}
        className="shrink-0 rounded-lg p-1.5 text-neutral-600 hover:text-red-400 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── MAIN TAB ─────────────────────────────────────────────────────────────
export function StatsStripTab({ onNotice }: StatsStripTabProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("pills");
  const [loading, setLoading] = useState(true);

  const [pills, setPills] = useState<StatPill[]>([]);
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItemData[]>([]);
  const [logos, setLogos] = useState<FloatingLogo[]>([]);
  const [settings, setSettings] = useState<StripSettings>({
    marqueeSectionEnabled: true,
    marqueeSpeedPixelsPerSec: 40,
    logoCloudEnabled: true,
  });

  // New pill / item input
  const [newPillValue, setNewPillValue] = useState("");
  const [newMarqueeText, setNewMarqueeText] = useState("");

  // Logo upload state
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load all data
  const loadAll = async () => {
    setLoading(true);
    try {
      const [pillsRes, marqueeRes, logosRes, settingsRes] = await Promise.all([
        fetch("/api/admin/stats-strip/stat-pills"),
        fetch("/api/admin/stats-strip/marquee-items"),
        fetch("/api/admin/stats-strip/logos"),
        fetch("/api/admin/stats-strip/settings"),
      ]);
      const [pillsData, marqueeData, logosData, settingsData] = await Promise.all([
        pillsRes.json(),
        marqueeRes.json(),
        logosRes.json(),
        settingsRes.json(),
      ]);
      if (pillsData.pills) setPills(pillsData.pills);
      if (marqueeData.items) setMarqueeItems(marqueeData.items);
      if (logosData.logos) setLogos(logosData.logos);
      if (settingsData.settings) setSettings(settingsData.settings);
    } catch {
      onNotice?.("Failed to load stats strip data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // ── Stat Pills ──────────────────────────────────────────────────────────
  const addPill = async () => {
    if (!newPillValue.trim()) return;
    try {
      const res = await fetch("/api/admin/stats-strip/stat-pills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newPillValue.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setPills((prev) => [...prev, data.pill]);
        setNewPillValue("");
        onNotice?.("Stat pill added");
      } else {
        onNotice?.(data.error || "Failed to add", "error");
      }
    } catch {
      onNotice?.("Failed to add stat pill", "error");
    }
  };

  const updatePill = async (id: string, updates: Partial<StatPill>) => {
    try {
      await fetch(`/api/admin/stats-strip/stat-pills/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      setPills((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    } catch {
      onNotice?.("Failed to update", "error");
    }
  };

  const deletePill = async (id: string) => {
    try {
      await fetch(`/api/admin/stats-strip/stat-pills/${id}`, { method: "DELETE" });
      setPills((prev) => prev.filter((p) => p.id !== id));
      onNotice?.("Stat pill deleted");
    } catch {
      onNotice?.("Failed to delete", "error");
    }
  };

  const handlePillDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = pills.findIndex((p) => p.id === active.id);
    const newIdx = pills.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(pills, oldIdx, newIdx).map((p, i) => ({ ...p, sortOrder: i }));
    setPills(reordered);
    await Promise.all(reordered.map((p, i) =>
      fetch(`/api/admin/stats-strip/stat-pills/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: i }),
      })
    ));
  };

  // ── Marquee Items ───────────────────────────────────────────────────────
  const addMarqueeItem = async () => {
    if (!newMarqueeText.trim()) return;
    try {
      const res = await fetch("/api/admin/stats-strip/marquee-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newMarqueeText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMarqueeItems((prev) => [...prev, data.item]);
        setNewMarqueeText("");
        onNotice?.("Marquee item added");
      } else {
        onNotice?.(data.error || "Failed to add", "error");
      }
    } catch {
      onNotice?.("Failed to add marquee item", "error");
    }
  };

  const updateMarqueeItem = async (id: string, updates: Partial<MarqueeItemData>) => {
    try {
      await fetch(`/api/admin/stats-strip/marquee-items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      setMarqueeItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    } catch {
      onNotice?.("Failed to update", "error");
    }
  };

  const deleteMarqueeItem = async (id: string) => {
    try {
      await fetch(`/api/admin/stats-strip/marquee-items/${id}`, { method: "DELETE" });
      setMarqueeItems((prev) => prev.filter((m) => m.id !== id));
      onNotice?.("Marquee item deleted");
    } catch {
      onNotice?.("Failed to delete", "error");
    }
  };

  const handleMarqueeDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = marqueeItems.findIndex((m) => m.id === active.id);
    const newIdx = marqueeItems.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(marqueeItems, oldIdx, newIdx).map((m, i) => ({ ...m, sortOrder: i }));
    setMarqueeItems(reordered);
    await Promise.all(reordered.map((m, i) =>
      fetch(`/api/admin/stats-strip/marquee-items/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: i }),
      })
    ));
  };

  // ── Logos ───────────────────────────────────────────────────────────────
  const uploadLogo = async (file: File) => {
    setUploading(true);
    setUploadWarning(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", file.name.replace(/\.[^.]+$/, ""));
      fd.append("altText", file.name.replace(/\.[^.]+$/, ""));
      const res = await fetch("/api/admin/stats-strip/logos", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setLogos((prev) => [...prev, data.logo]);
        if (data.warning) setUploadWarning(data.warning);
        else onNotice?.("Logo uploaded — it will float in the background");
      } else {
        onNotice?.(data.error || "Upload failed", "error");
      }
    } catch {
      onNotice?.("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadLogo);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ["image/png", "image/webp", "image/jpeg", "image/avif"].includes(f.type)
    );
    files.forEach(uploadLogo);
  };

  const updateLogo = async (id: string, updates: Partial<FloatingLogo>) => {
    try {
      await fetch(`/api/admin/stats-strip/logos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      setLogos((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    } catch {
      onNotice?.("Failed to update", "error");
    }
  };

  const deleteLogo = async (id: string) => {
    try {
      await fetch(`/api/admin/stats-strip/logos/${id}`, { method: "DELETE" });
      setLogos((prev) => prev.filter((l) => l.id !== id));
      onNotice?.("Logo deleted");
    } catch {
      onNotice?.("Failed to delete", "error");
    }
  };

  const handleLogoDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = logos.findIndex((l) => l.id === active.id);
    const newIdx = logos.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(logos, oldIdx, newIdx);
    setLogos(reordered);
    await fetch("/api/admin/stats-strip/logos/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((l) => l.id) }),
    });
  };

  // ── Settings ────────────────────────────────────────────────────────────
  const updateSetting = async (key: keyof StripSettings, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    try {
      await fetch("/api/admin/stats-strip/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      onNotice?.("Settings saved");
    } catch {
      onNotice?.("Failed to save settings", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw size={22} className="animate-spin text-[#0052FF]" />
        <span className="text-xs text-neutral-500">Loading stats strip data…</span>
      </div>
    );
  }

  const sections: { id: ActiveSection; label: string; icon: React.ReactNode }[] = [
    { id: "pills", label: "Stat Pills", icon: <BarChart3 size={15} /> },
    { id: "marquee", label: "Marquee Items", icon: <Type size={15} /> },
    { id: "logos", label: "Floating Logos", icon: <ImageIcon size={15} /> },
    { id: "settings", label: "Settings", icon: <Sliders size={15} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Stats Strip</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Manage the "3 YEARS · 14+ BUSINESSES · 8 COUNTRIES" section — stat pills, scrolling marquee, and floating logo cloud.
        </p>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 p-1 rounded-xl border border-white/[0.08] bg-white/[0.02] w-fit flex-wrap">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
              activeSection === s.id
                ? "bg-[#0052FF]/20 text-white border border-[#0052FF]/40"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* ── STAT PILLS ── */}
      {activeSection === "pills" && (
        <div className="space-y-4">
          <p className="text-xs text-neutral-500">
            These bold uppercase labels appear as "3 YEARS • 14+ BUSINESSES • 8 COUNTRIES". Drag to reorder.
          </p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePillDragEnd}>
            <SortableContext items={pills.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {pills.map((pill) => (
                  <SortablePillRow key={pill.id} pill={pill} onUpdate={updatePill} onDelete={deletePill} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add new pill */}
          <div className="flex gap-2">
            <input
              value={newPillValue}
              onChange={(e) => setNewPillValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPill()}
              placeholder="e.g. 50+ Projects"
              className="flex-1 rounded-xl border border-white/10 bg-[#0a0b10] px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-[#0052FF] focus:outline-none"
            />
            <button
              onClick={addPill}
              className="flex items-center gap-1.5 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
            >
              <Plus size={14} /> Add Pill
            </button>
          </div>
        </div>
      )}

      {/* ── MARQUEE ITEMS ── */}
      {activeSection === "marquee" && (
        <div className="space-y-4">
          <p className="text-xs text-neutral-500">
            These scroll continuously in the ticker below the stat pills. Drag to reorder. Toggle visibility to hide without deleting.
          </p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleMarqueeDragEnd}>
            <SortableContext items={marqueeItems.map((m) => m.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {marqueeItems.map((item) => (
                  <SortableMarqueeRow key={item.id} item={item} onUpdate={updateMarqueeItem} onDelete={deleteMarqueeItem} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex gap-2">
            <input
              value={newMarqueeText}
              onChange={(e) => setNewMarqueeText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMarqueeItem()}
              placeholder="e.g. Performance-First Creative"
              className="flex-1 rounded-xl border border-white/10 bg-[#0a0b10] px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-[#0052FF] focus:outline-none"
            />
            <button
              onClick={addMarqueeItem}
              className="flex items-center gap-1.5 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>
        </div>
      )}

      {/* ── FLOATING LOGOS ── */}
      {activeSection === "logos" && (
        <div className="space-y-4">
          <p className="text-xs text-neutral-500">
            These logos float in 3D in the background of the stats section. Upload PNG/WebP with transparent backgrounds for best effect. Max 20 logos.
          </p>

          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all ${
              isDraggingFile
                ? "border-[#0052FF] bg-[#0052FF]/10"
                : "border-white/[0.1] hover:border-white/20 hover:bg-white/[0.02]"
            }`}
          >
            {uploading ? (
              <RefreshCw size={24} className="animate-spin text-[#0052FF]" />
            ) : (
              <UploadCloud size={24} className="text-neutral-500" />
            )}
            <p className="text-xs text-neutral-500">
              {uploading ? "Uploading…" : "Drop PNG/WebP/AVIF here, or click to select"}
            </p>
            <p className="text-[10px] text-neutral-700">Max 2 MB · Transparent PNG/WebP preferred · Max 20 logos</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/webp,image/avif,image/jpeg"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {uploadWarning && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{uploadWarning}</span>
            </div>
          )}

          {logos.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLogoDragEnd}>
              <SortableContext items={logos.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {logos.map((logo) => (
                    <SortableLogoCard key={logo.id} logo={logo} onUpdate={updateLogo} onDelete={deleteLogo} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {logos.length === 0 && !uploading && (
            <div className="text-center py-8 text-xs text-neutral-600">
              No floating logos yet. Upload your first logo above.
            </div>
          )}
        </div>
      )}

      {/* ── SETTINGS ── */}
      {activeSection === "settings" && (
        <div className="space-y-4 max-w-lg">
          <p className="text-xs text-neutral-500">Control visibility and behaviour of the stats strip section.</p>

          {/* Marquee enabled */}
          <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0a0b10] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Marquee section enabled</p>
              <p className="text-xs text-neutral-500 mt-0.5">Show or hide the entire stats strip on the homepage</p>
            </div>
            <button
              onClick={() => updateSetting("marqueeSectionEnabled", !settings.marqueeSectionEnabled)}
              className={`relative h-6 w-11 rounded-full transition-colors ${settings.marqueeSectionEnabled ? "bg-[#0052FF]" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${settings.marqueeSectionEnabled ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          {/* Logo cloud enabled */}
          <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0a0b10] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Floating logo cloud</p>
              <p className="text-xs text-neutral-500 mt-0.5">Show 3D floating logos in the background</p>
            </div>
            <button
              onClick={() => updateSetting("logoCloudEnabled", !settings.logoCloudEnabled)}
              className={`relative h-6 w-11 rounded-full transition-colors ${settings.logoCloudEnabled ? "bg-[#0052FF]" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${settings.logoCloudEnabled ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          {/* Marquee speed */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0a0b10] px-4 py-3 space-y-3">
            <div>
              <p className="text-sm font-semibold text-white">Marquee speed</p>
              <p className="text-xs text-neutral-500 mt-0.5">Pixels per second (20 = slow, 40 = default, 80 = fast)</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={10}
                max={120}
                step={5}
                value={settings.marqueeSpeedPixelsPerSec}
                onChange={(e) => setSettings((prev) => ({ ...prev, marqueeSpeedPixelsPerSec: Number(e.target.value) }))}
                onMouseUp={(e) => updateSetting("marqueeSpeedPixelsPerSec", Number((e.target as HTMLInputElement).value))}
                className="flex-1 accent-[#0052FF]"
              />
              <span className="text-sm font-mono text-white w-10 text-right">{settings.marqueeSpeedPixelsPerSec}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

