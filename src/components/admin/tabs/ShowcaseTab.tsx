"use client";

import React, { useState, useEffect } from "react";
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
  Edit2,
  GripVertical,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Sliders,
  Smartphone,
  Mail,
  Globe,
  Film,
  Video,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { ShowcaseItemDoc, ShowcaseSettingsDoc, ShowcaseCategory } from "@/server/types";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface ShowcaseTabProps {
  onNotice?: (msg: string, type?: "success" | "error") => void;
}

// ── Sortable Item Row ────────────────────────────────────────────────────────
function SortableShowcaseRow({
  item,
  onEdit,
  onToggleActive,
  onDeleteRequest,
}: {
  item: ShowcaseItemDoc;
  onEdit: (item: ShowcaseItemDoc) => void;
  onToggleActive: (id: string, current: boolean) => Promise<void>;
  onDeleteRequest: (id: string, name: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3.5 rounded-2xl border p-4 transition-all ${
        item.isActive
          ? "border-white/[0.08] bg-[#0A0B10] hover:border-white/20"
          : "border-white/[0.04] bg-[#07070A] opacity-60"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="cursor-grab text-neutral-600 hover:text-neutral-300 shrink-0 p-1"
        title="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>

      {/* Visual Media Thumbnail Preview */}
      <div className="relative h-14 w-10 sm:h-16 sm:w-12 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center">
        {item.posterUrl ? (
          <img src={item.posterUrl} alt="" className="h-full w-full object-cover" />
        ) : item.heroImg ? (
          <img src={item.heroImg} alt="" className="h-full w-full object-cover" />
        ) : item.videoUrl ? (
          <Video size={18} className="text-blue-400" />
        ) : (
          <Sparkles size={16} className="text-neutral-500" />
        )}
      </div>

      {/* Info Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-display text-sm font-bold text-white truncate">
            {item.title || item.client || item.sender || "Untitled Item"}
          </h4>
          <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-mono uppercase text-neutral-400">
            {item.category}
          </span>
        </div>

        <p className="text-xs text-neutral-400 truncate mt-0.5">
          {item.category === "ads" || item.category === "ugc"
            ? item.videoUrl || "No video URL configured"
            : item.category === "emails"
            ? `${item.sender || ""} · ${item.subject || ""}`
            : `${item.client || ""} · ${item.url || item.highlight || ""}`}
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onToggleActive(item.id, item.isActive)}
          title={item.isActive ? "Hide from public view" : "Show on public view"}
          className={`rounded-xl p-2 transition-colors ${
            item.isActive
              ? "text-emerald-400 hover:bg-emerald-500/10"
              : "text-neutral-600 hover:bg-white/5"
          }`}
        >
          {item.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>

        <button
          type="button"
          onClick={() => onEdit(item)}
          title="Edit item details"
          className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Edit2 size={14} />
        </button>

        <button
          type="button"
          onClick={() => onDeleteRequest(item.id, item.title || item.client || item.sender || "this item")}
          title="Delete item"
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ── MAIN TAB COMPONENT ───────────────────────────────────────────────────────
export function ShowcaseTab({ onNotice }: ShowcaseTabProps) {
  const [activeCategory, setActiveCategory] = useState<ShowcaseCategory | "settings">("ads");
  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState<ShowcaseItemDoc[]>([]);
  const [settings, setSettings] = useState<ShowcaseSettingsDoc>({
    id: "default",
    sectionBadge: "OUR WORK",
    headingPrefix: "Creative that",
    headingItalic: "Converts",
    marqueeSpeedSeconds: 32,
    sectionEnabled: true,
    updatedAt: new Date().toISOString(),
  });

  // Modal Editing State
  const [editingItem, setEditingItem] = useState<ShowcaseItemDoc | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/showcase");
      const data = await res.json();
      if (data.items) setItems(data.items);
      if (data.settings) setSettings(data.settings);
    } catch {
      onNotice?.("Failed to load showcase data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = items
    .filter((i) => i.category === activeCategory)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Reorder
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredItems.findIndex((i) => i.id === active.id);
    const newIndex = filteredItems.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(filteredItems, oldIndex, newIndex);

    // Update local state
    const otherItems = items.filter((i) => i.category !== activeCategory);
    const updatedCategoryItems = reordered.map((item, idx) => ({ ...item, sortOrder: idx }));
    setItems([...otherItems, ...updatedCategoryItems]);

    try {
      await fetch("/api/admin/showcase/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: updatedCategoryItems.map((i) => i.id) }),
      });
      onNotice?.("Order updated");
    } catch {
      onNotice?.("Failed to save new order", "error");
    }
  };

  // Toggle visibility
  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/admin/showcase/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isActive: !current } : i)));
      onNotice?.(!current ? "Item published to live site" : "Item hidden from live site");
    } catch {
      onNotice?.("Failed to update status", "error");
    }
  };

  // Save item (Create or Update)
  const handleSaveItem = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/admin/showcase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingItem),
        });
        const data = await res.json();
        if (data.success && data.item) {
          setItems((prev) => [...prev, data.item]);
          onNotice?.("New showcase item added!");
        }
      } else {
        await fetch(`/api/admin/showcase/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingItem),
        });
        setItems((prev) => prev.map((i) => (i.id === editingItem.id ? editingItem : i)));
        onNotice?.("Showcase item updated!");
      }
      setEditingItem(null);
    } catch {
      onNotice?.("Failed to save item", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    try {
      await fetch(`/api/admin/showcase/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
      onNotice?.("Showcase item deleted");
    } catch {
      onNotice?.("Failed to delete item", "error");
    }
  };

  // Update Settings
  const updateSetting = async (updates: Partial<ShowcaseSettingsDoc>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    try {
      await fetch("/api/admin/showcase/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      onNotice?.("Settings saved");
    } catch {
      onNotice?.("Failed to save settings", "error");
    }
  };

  // Open New Item Form
  const handleOpenNew = () => {
    setIsNew(true);
    setEditingItem({
      id: "",
      category: activeCategory === "settings" ? "ads" : activeCategory,
      title: "",
      videoUrl: "",
      posterUrl: "",
      sender: "",
      subject: "",
      tag: "",
      heroImg: "",
      heading: "",
      subheading: "",
      ctaText: "",
      accentColor: "#0056F5",
      theme: "dark",
      client: "",
      url: "",
      highlight: "",
      description: "",
      stats: [
        { label: "Metric 1", value: "100%" },
        { label: "Metric 2", value: "2x" },
      ],
      bgGradient: "from-[#111116] via-[#161622] to-[#0d0d12]",
      sortOrder: filteredItems.length,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw size={22} className="animate-spin text-[#0052FF]" />
        <span className="text-xs text-neutral-500">Loading showcase items…</span>
      </div>
    );
  }

  const categoryTabs: { id: ShowcaseCategory | "settings"; label: string; icon: any }[] = [
    { id: "ads", label: "Ads Creative (Phones)", icon: Smartphone },
    { id: "emails", label: "Emails", icon: Mail },
    { id: "landing", label: "Landing Pages", icon: Globe },
    { id: "ugc", label: "UGC (Phones)", icon: Film },
    { id: "settings", label: "Settings", icon: Sliders },
  ];

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This will permanently delete this showcase item from the live site."
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 mb-2">
            <Sparkles size={11} />
            <span>INTERACTIVE COMPONENT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Creative That Converts CMS
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Control the moving phone mockups, video loops, email cards, and landing page funnels seen on Home and Our Work.
          </p>
        </div>

        {activeCategory !== "settings" && (
          <button
            type="button"
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 rounded-xl btn-shiny-blue px-4 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer shrink-0"
          >
            <Plus size={15} />
            <span>Add Showcase Item</span>
          </button>
        )}
      </div>

      {/* Category Pills Navigation */}
      <div className="flex gap-1.5 p-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] w-fit flex-wrap">
        {categoryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          const count = items.filter((i) => i.category === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0056F5]/25 text-white border border-[#0056F5]/50 shadow-[0_0_16px_rgba(0,86,245,0.3)]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={14} className={isActive ? "text-[#4385FF]" : "text-neutral-500"} />
              <span>{tab.label}</span>
              {tab.id !== "settings" && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px]">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── LIST VIEW FOR ACTIVE CATEGORY ── */}
      {activeCategory !== "settings" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>
              Showing {filteredItems.length} items in{" "}
              <strong className="text-white capitalize">{activeCategory}</strong>. Drag handle to reorder.
            </span>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2.5">
                {filteredItems.map((item) => (
                  <SortableShowcaseRow
                    key={item.id}
                    item={item}
                    onEdit={(it) => {
                      setIsNew(false);
                      setEditingItem({ ...it });
                    }}
                    onToggleActive={handleToggleActive}
                    onDeleteRequest={(id, name) => setDeleteTarget({ id, name })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {filteredItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <Sparkles size={24} className="mx-auto text-neutral-600 mb-2" />
              <p className="text-sm font-semibold text-neutral-400">No items in this category yet</p>
              <p className="text-xs text-neutral-600 mt-1">Click "Add Showcase Item" above to add your first mockup.</p>
            </div>
          )}
        </div>
      ) : (
        /* ── SHOWCASE SETTINGS ── */
        <div className="space-y-5 max-w-xl rounded-2xl border border-white/[0.08] bg-[#0A0B10] p-6">
          <h3 className="font-display text-base font-bold text-white">Showcase Section Display Settings</h3>

          {/* Enabled Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
            <div>
              <p className="text-sm font-semibold text-white">Enable Section on Site</p>
              <p className="text-xs text-neutral-500">Show or hide the entire "Creative that Converts" block</p>
            </div>
            <button
              type="button"
              onClick={() => updateSetting({ sectionEnabled: !settings.sectionEnabled })}
              className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                settings.sectionEnabled ? "bg-[#0056F5]" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                  settings.sectionEnabled ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Heading Prefix */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Heading Prefix (Standard Font)</label>
            <input
              type="text"
              value={settings.headingPrefix}
              onChange={(e) => setSettings((s) => ({ ...s, headingPrefix: e.target.value }))}
              onBlur={() => updateSetting({ headingPrefix: settings.headingPrefix })}
              className="w-full rounded-xl border border-white/10 bg-[#0E0F18] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. Creative that"
            />
          </div>

          {/* Heading Italic */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Heading Accent (Serif Italic)</label>
            <input
              type="text"
              value={settings.headingItalic}
              onChange={(e) => setSettings((s) => ({ ...s, headingItalic: e.target.value }))}
              onBlur={() => updateSetting({ headingItalic: settings.headingItalic })}
              className="w-full rounded-xl border border-white/10 bg-[#0E0F18] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-serif italic"
              placeholder="e.g. Converts"
            />
          </div>

          {/* Marquee Speed */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-neutral-400">Marquee Animation Speed</span>
              <span className="font-mono text-blue-400 font-bold">{settings.marqueeSpeedSeconds}s duration</span>
            </div>
            <input
              type="range"
              min={15}
              max={60}
              step={1}
              value={settings.marqueeSpeedSeconds}
              onChange={(e) => setSettings((s) => ({ ...s, marqueeSpeedSeconds: Number(e.target.value) }))}
              onMouseUp={() => updateSetting({ marqueeSpeedSeconds: settings.marqueeSpeedSeconds })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500">Lower seconds = faster continuous slide.</p>
          </div>
        </div>
      )}

      {/* ── EDIT / CREATE MODAL ── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-blue-400">
                  {editingItem.category.toUpperCase()} SHOWCASE
                </span>
                <h3 className="text-xl font-bold text-white font-display">
                  {isNew ? "New Showcase Item" : `Edit "${editingItem.title || "Item"}"`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="rounded-full p-2 text-neutral-400 hover:text-white hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Fields Based on Category */}
            <div className="space-y-4 text-xs">
              {/* Category Selector */}
              <div>
                <label className="block text-neutral-400 font-semibold mb-1.5">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ads">Ads Creative (Phone Mockup)</option>
                  <option value="ugc">UGC (Phone Mockup)</option>
                  <option value="emails">Emails Newsletter Card</option>
                  <option value="landing">Landing Page Funnel</option>
                </select>
              </div>

              {/* Title / Label */}
              <div>
                <label className="block text-neutral-400 font-semibold mb-1.5">Internal Title / Label</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Voltex Active Sneaker Drop"
                />
              </div>

              {/* VIDEO FIELDS (Ads & UGC) */}
              {(editingItem.category === "ads" || editingItem.category === "ugc") && (
                <>
                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1.5">
                      Video MP4 URL (Vertical 9:16)
                    </label>
                    <input
                      type="text"
                      value={editingItem.videoUrl || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                      placeholder="e.g. /videos/ads/optimized/13014537_2160_3840_24fps.mp4"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1.5">
                      Poster Image WebP URL (Instant fallback preview)
                    </label>
                    <input
                      type="text"
                      value={editingItem.posterUrl || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, posterUrl: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                      placeholder="e.g. /videos/ads/optimized/13014537_2160_3840_24fps.webp"
                    />
                  </div>
                </>
              )}

              {/* EMAIL CARD FIELDS */}
              {editingItem.category === "emails" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1.5">Sender Brand Name</label>
                      <input
                        type="text"
                        value={editingItem.sender || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, sender: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white"
                        placeholder="e.g. VOLTEX ACTIVE"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1.5">Pill Badge Tag</label>
                      <input
                        type="text"
                        value={editingItem.tag || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white"
                        placeholder="e.g. LIMITED EDITION"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1.5">Subject Line</label>
                    <input
                      type="text"
                      value={editingItem.subject || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, subject: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white"
                      placeholder="e.g. The Recon Drop Is Live ⚡"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1.5">Hero Image URL</label>
                    <input
                      type="text"
                      value={editingItem.heroImg || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, heroImg: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white font-mono"
                      placeholder="e.g. /images/case-studies/voltex-thumb.webp"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1.5">Email Headline</label>
                    <input
                      type="text"
                      value={editingItem.heading || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, heading: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white"
                      placeholder="e.g. NO RESTOCKS. THE RECON DROP."
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1.5">Subheading / Description</label>
                    <textarea
                      rows={2}
                      value={editingItem.subheading || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, subheading: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white resize-none"
                      placeholder="Short body text..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1.5">CTA Button Text</label>
                      <input
                        type="text"
                        value={editingItem.ctaText || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, ctaText: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white"
                        placeholder="e.g. SECURE YOUR DROP >"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1.5">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editingItem.accentColor || "#0056F5"}
                          onChange={(e) => setEditingItem({ ...editingItem, accentColor: e.target.value })}
                          className="h-9 w-9 rounded-lg bg-transparent cursor-pointer border border-white/10"
                        />
                        <span className="font-mono text-neutral-300">{editingItem.accentColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1.5">Card Theme</label>
                      <select
                        value={editingItem.theme || "dark"}
                        onChange={(e) => setEditingItem({ ...editingItem, theme: e.target.value as any })}
                        className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white"
                      >
                        <option value="dark">Dark Theme</option>
                        <option value="light">Light Theme</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* LANDING PAGE FIELDS */}
              {editingItem.category === "landing" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1.5">Client / Brand Name</label>
                      <input
                        type="text"
                        value={editingItem.client || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white"
                        placeholder="e.g. HAVEN ASSETS"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1.5">Display URL Path</label>
                      <input
                        type="text"
                        value={editingItem.url || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white font-mono"
                        placeholder="e.g. havenassets.com/yields"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1.5">Highlight Headline</label>
                    <input
                      type="text"
                      value={editingItem.highlight || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, highlight: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white"
                      placeholder="e.g. High-Yield Portfolio Acquisition"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1.5">Funnel Pitch Description</label>
                    <textarea
                      rows={2}
                      value={editingItem.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white resize-none"
                      placeholder="Proven performance marketing..."
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1.5">Industry Tag</label>
                    <input
                      type="text"
                      value={editingItem.tag || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#07070A] p-2.5 text-white"
                      placeholder="e.g. COMMERCIAL B2B"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl btn-shiny-blue px-6 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                <span>{isNew ? "Create Showcase Item" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
