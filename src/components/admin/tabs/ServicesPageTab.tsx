"use client";

import { useState, useTransition } from "react";
import {
  Sparkles,
  Layers,
  Edit2,
  Trash2,
  Copy,
  Plus,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  GripVertical,
  ExternalLink,
  Check,
  X,
  HelpCircle,
  FileText,
  Clock,
  ShieldCheck,
  Compass,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  ServicesPageContent,
  SpPackageSer,
  SpComparisonRowSer,
  SpProcessStepSer,
  SpChecklistItemSer,
  SpTimelineStepSer,
  SpCoreServiceSer,
  SpFaqSer,
} from "@/server/types";
import {
  saveSpSettingsAction,
  saveSpHeroAction,
  saveSpPackageAction,
  deleteSpPackageAction,
  duplicateSpPackageAction,
  toggleSpPackageVisibilityAction,
  saveSpComparisonRowAction,
  deleteSpComparisonRowAction,
  saveSpProcessStepAction,
  deleteSpProcessStepAction,
  saveSpChecklistItemAction,
  deleteSpChecklistItemAction,
  saveSpTimelineStepAction,
  deleteSpTimelineStepAction,
  saveSpCoreServiceAction,
  deleteSpCoreServiceAction,
  toggleSpCoreServiceVisibilityAction,
  saveSpFaqAction,
  deleteSpFaqAction,
  toggleSpFaqVisibilityAction,
  reorderSpItemsAction,
} from "@/server/services-page-actions";

interface ServicesPageTabProps {
  initialContent: ServicesPageContent;
  onNotice: (text: string, type?: "success" | "error") => void;
}

type SubSection =
  | "hero"
  | "packages"
  | "comparison"
  | "process"
  | "onboarding"
  | "core-services"
  | "faqs";

// Helper for sortable list items
function SortableItem({
  id,
  children,
  className = "",
}: {
  id: string;
  children: (dragHandleProps: any) => React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.75 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children({ ...attributes, ...listeners })}
    </div>
  );
}

export function ServicesPageTab({ initialContent, onNotice }: ServicesPageTabProps) {
  const [subSection, setSubSection] = useState<SubSection>("hero");
  const [isPending, startTransition] = useTransition();

  // Local state mirrors
  const [settings, setSettings] = useState(
    initialContent.settings || {
      _id: "",
      seoTitle: "Services & Packages | Thrides Growth Engine",
      seoDescription:
        "Start where you are. Grow from there. Dedicated marketing packages for every stage: Kickstart, Accelerate, and Authority.",
      ogImage: "",
      updatedAt: new Date(),
    }
  );

  const [hero, setHero] = useState(
    initialContent.hero || {
      _id: "",
      eyebrow: "SERVICES & PACKAGES",
      headingLine1: "Start where you are.",
      headingLineItalic: "Grow from there.",
      subCopy: "Strategy, websites, and content — packaged around your stage of growth.",
      ctaLeftText: "Book a",
      ctaRightText: "Free Strategy Call",
      ctaHref: "/contact",
      exploreLabel: "Explore packages",
      heroImageUrl: "/servicehero.png",
      updatedAt: new Date(),
    }
  );

  const [packages, setPackages] = useState<SpPackageSer[]>(initialContent.packages || []);
  const [comparisonRows, setComparisonRows] = useState<SpComparisonRowSer[]>(
    initialContent.comparisonRows || []
  );
  const [processSteps, setProcessSteps] = useState<SpProcessStepSer[]>(
    initialContent.processSteps || []
  );
  const [checklistItems, setChecklistItems] = useState<SpChecklistItemSer[]>(
    initialContent.checklistItems || []
  );
  const [timelineSteps, setTimelineSteps] = useState<SpTimelineStepSer[]>(
    initialContent.timelineSteps || []
  );
  const [coreServices, setCoreServices] = useState<SpCoreServiceSer[]>(
    initialContent.coreServices || []
  );
  const [faqs, setFaqs] = useState<SpFaqSer[]>(initialContent.faqs || []);

  // Modal editing states
  const [editingPackage, setEditingPackage] = useState<Partial<SpPackageSer> | null>(null);
  const [editingComparisonRow, setEditingComparisonRow] = useState<Partial<SpComparisonRowSer> | null>(null);
  const [editingProcessStep, setEditingProcessStep] = useState<Partial<SpProcessStepSer> | null>(null);
  const [editingChecklistItem, setEditingChecklistItem] = useState<Partial<SpChecklistItemSer> | null>(null);
  const [editingTimelineStep, setEditingTimelineStep] = useState<Partial<SpTimelineStepSer> | null>(null);
  const [editingCoreService, setEditingCoreService] = useState<Partial<SpCoreServiceSer> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<SpFaqSer> | null>(null);

  // Setup dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Reorder helper
  const handleGenericReorder = (
    items: any[],
    setItems: (updated: any[]) => void,
    collectionName: any,
    oldIndex: number,
    newIndex: number
  ) => {
    if (oldIndex === newIndex || newIndex < 0 || newIndex >= items.length) return;
    const reordered = arrayMove(items, oldIndex, newIndex).map((it, idx) => ({
      ...it,
      sortOrder: idx,
    }));
    setItems(reordered);
    startTransition(async () => {
      const res = await reorderSpItemsAction({
        collectionName,
        orderedIds: reordered.map((it) => it._id),
      });
      if (res.ok) {
        onNotice("Order updated successfully.");
      } else {
        onNotice(res.error || "Failed to update order", "error");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0052FF] animate-pulse" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              Services Page CMS
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Easily manage packages, pricing, how it works, onboarding, capabilities, and FAQ.
          </p>
        </div>

        <a
          href="/services"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#0052FF]/15 border border-[#0052FF]/40 px-4 py-2 text-xs font-semibold text-white hover:bg-[#0052FF]/25 transition-all shadow-[0_0_15px_rgba(0,82,255,0.25)] cursor-pointer"
        >
          <span>View Live Services Page</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Sub-Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 overflow-x-auto border-b border-white/[0.06]">
        {[
          { id: "hero", label: "Hero & SEO", icon: Compass },
          { id: "packages", label: `Packages (${packages.length})`, icon: Sparkles },
          { id: "comparison", label: `Comparison (${comparisonRows.length})`, icon: FileText },
          { id: "process", label: `How It Works (${processSteps.length})`, icon: Clock },
          { id: "onboarding", label: "Onboarding Journey", icon: ShieldCheck },
          { id: "core-services", label: `Core Capabilities (${coreServices.length})`, icon: Layers },
          { id: "faqs", label: `FAQ (${faqs.length})`, icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubSection(tab.id as SubSection)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0052FF] text-white shadow-[0_0_15px_rgba(0,82,255,0.4)]"
                  : "bg-white/[0.03] border border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────────
          1. HERO & SEO TAB
         ────────────────────────────────────────────────────────── */}
      {subSection === "hero" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hero Form */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Compass size={16} className="text-[#0052FF]" />
              Cinematic Hero Section
            </h3>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={hero.eyebrow}
                onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Headline Line 1
              </label>
              <input
                type="text"
                value={hero.headingLine1}
                onChange={(e) => setHero({ ...hero, headingLine1: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Headline Line 2 (Italic Accent)
              </label>
              <input
                type="text"
                value={hero.headingLineItalic}
                onChange={(e) => setHero({ ...hero, headingLineItalic: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Supporting Subcopy
              </label>
              <textarea
                rows={2}
                value={hero.subCopy}
                onChange={(e) => setHero({ ...hero, subCopy: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  CTA Left Text
                </label>
                <input
                  type="text"
                  value={hero.ctaLeftText}
                  onChange={(e) => setHero({ ...hero, ctaLeftText: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  CTA Right Text
                </label>
                <input
                  type="text"
                  value={hero.ctaRightText}
                  onChange={(e) => setHero({ ...hero, ctaRightText: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  CTA Destination URL
                </label>
                <input
                  type="text"
                  value={hero.ctaHref}
                  onChange={(e) => setHero({ ...hero, ctaHref: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Explore Scroll Label
                </label>
                <input
                  type="text"
                  value={hero.exploreLabel}
                  onChange={(e) => setHero({ ...hero, exploreLabel: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Background Image URL or Path
              </label>
              <input
                type="text"
                value={hero.heroImageUrl}
                onChange={(e) => setHero({ ...hero, heroImageUrl: e.target.value })}
                placeholder="/servicehero.png"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const res = await saveSpHeroAction(hero);
                  if (res.ok) onNotice("Hero updated successfully.");
                  else onNotice(res.error || "Failed to update hero", "error");
                });
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#004ADE] transition-all cursor-pointer shadow-[0_0_18px_rgba(0,82,255,0.4)] disabled:opacity-50"
            >
              <Check size={14} />
              <span>{isPending ? "Saving..." : "Save Hero Section"}</span>
            </button>
          </div>

          {/* SEO & Meta Form */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <FileText size={16} className="text-[#0052FF]" />
              SEO &amp; Open Graph Meta
            </h3>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={settings.seoTitle}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
              />
              <span className="text-[10.5px] font-mono text-neutral-500 mt-1 block">
                Recommended 50–60 characters ({settings.seoTitle.length} chars)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={settings.seoDescription}
                onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
              />
              <span className="text-[10.5px] font-mono text-neutral-500 mt-1 block">
                Recommended 150–160 characters ({settings.seoDescription.length} chars)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Social Share Image (OG Image URL)
              </label>
              <input
                type="text"
                value={settings.ogImage || ""}
                onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                placeholder="https://your-domain.com/og-services.jpg"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const res = await saveSpSettingsAction(settings);
                  if (res.ok) onNotice("SEO settings saved successfully.");
                  else onNotice(res.error || "Failed to save settings", "error");
                });
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#004ADE] transition-all cursor-pointer shadow-[0_0_18px_rgba(0,82,255,0.4)] disabled:opacity-50"
            >
              <Check size={14} />
              <span>{isPending ? "Saving..." : "Save SEO Settings"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          2. PACKAGES TAB
         ────────────────────────────────────────────────────────── */}
      {subSection === "packages" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-white">The Growth Collection</h3>
              <p className="text-xs text-neutral-400">
                Drag to reorder packages or use arrow buttons. Edit pricing, deliverables, and guarantee terms.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingPackage({
                  slug: `package-${Date.now().toString().slice(-4)}`,
                  name: "New Growth Package",
                  tagline: "Stage tagline",
                  heading: "Clear outcome description",
                  theProblem: "Customer pain point solved",
                  deliverables: ["Deliverable 1", "Deliverable 2", "Deliverable 3"],
                  timeline: "2 to 3 weeks",
                  payment: "One-time",
                  promise: "Guarantee terms",
                  investment: "Enquire for pricing",
                  ctaText: "Get Started",
                  badge: "",
                  isPopular: false,
                  visible: true,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#004ADE] transition-all shadow-[0_0_15px_rgba(0,82,255,0.35)] cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Package</span>
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;
              const oldIdx = packages.findIndex((p) => p._id === active.id);
              const newIdx = packages.findIndex((p) => p._id === over.id);
              handleGenericReorder(packages, setPackages, "packages", oldIdx, newIdx);
            }}
          >
            <SortableContext items={packages.map((p) => p._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {packages.map((pkg, idx) => (
                  <SortableItem key={pkg._id} id={pkg._id}>
                    {(dragHandleProps) => (
                      <div
                        className={`group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border p-5 backdrop-blur-xl transition-all ${
                          pkg.isPopular
                            ? "border-[#0052FF]/60 bg-[#0E1328]/80 shadow-[0_0_24px_rgba(0,82,255,0.15)]"
                            : "border-white/[0.08] bg-[#0E0F18]/90 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start md:items-center gap-3">
                          <button
                            {...dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 text-neutral-500 hover:text-white"
                            title="Drag to reorder"
                          >
                            <GripVertical size={16} />
                          </button>

                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[10px] font-bold text-[#0052FF]">
                                0{idx + 1}
                              </span>
                              <span className="font-display font-bold text-white text-base">
                                {pkg.name}
                              </span>
                              {pkg.badge && (
                                <span className="rounded-full bg-[#0052FF]/20 border border-[#0052FF]/40 px-2 py-0.5 text-[9.5px] font-mono font-bold text-white uppercase">
                                  {pkg.badge}
                                </span>
                              )}
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                                  pkg.visible
                                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                    : "bg-white/5 text-neutral-400 border border-white/10"
                                }`}
                              >
                                {pkg.visible ? "ACTIVE" : "HIDDEN"}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400 line-clamp-1">{pkg.heading}</p>
                            <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500 mt-1">
                              <span>Timeline: {pkg.timeline}</span>
                              <span>•</span>
                              <span>Investment: {pkg.investment}</span>
                              <span>•</span>
                              <span>{pkg.deliverables.length} Deliverables</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end md:self-center">
                          {/* Reorder Arrows for Mobile / Easy Click */}
                          <button
                            onClick={() =>
                              handleGenericReorder(packages, setPackages, "packages", idx, idx - 1)
                            }
                            disabled={idx === 0}
                            title="Move Up"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-20 cursor-pointer"
                          >
                            <MoveUp size={14} />
                          </button>
                          <button
                            onClick={() =>
                              handleGenericReorder(packages, setPackages, "packages", idx, idx + 1)
                            }
                            disabled={idx === packages.length - 1}
                            title="Move Down"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-20 cursor-pointer"
                          >
                            <MoveDown size={14} />
                          </button>

                          {/* Visibility Toggle */}
                          <button
                            onClick={() => {
                              startTransition(async () => {
                                const res = await toggleSpPackageVisibilityAction(
                                  pkg._id,
                                  !pkg.visible
                                );
                                if (res.ok) {
                                  setPackages((prev) =>
                                    prev.map((p) =>
                                      p._id === pkg._id ? { ...p, visible: !p.visible } : p
                                    )
                                  );
                                  onNotice(`Package ${pkg.visible ? "hidden" : "visible"}.`);
                                } else {
                                  onNotice(res.error || "Failed to toggle visibility", "error");
                                }
                              });
                            }}
                            title={pkg.visible ? "Hide Package" : "Publish Package"}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
                          >
                            {pkg.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => {
                              startTransition(async () => {
                                const res = await duplicateSpPackageAction(pkg._id);
                                if (res.ok) {
                                  onNotice("Package duplicated as draft.");
                                  window.location.reload();
                                } else {
                                  onNotice(res.error || "Failed to duplicate", "error");
                                }
                              });
                            }}
                            title="Duplicate Package"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
                          >
                            <Copy size={14} />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => setEditingPackage(pkg)}
                            title="Edit Package"
                            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.08] cursor-pointer"
                          >
                            <Edit2 size={12} className="text-[#0052FF]" />
                            <span>Edit</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${pkg.name}"?`)) {
                                startTransition(async () => {
                                  const res = await deleteSpPackageAction(pkg._id);
                                  if (res.ok) {
                                    setPackages((prev) => prev.filter((p) => p._id !== pkg._id));
                                    onNotice("Package deleted.");
                                  } else {
                                    onNotice(res.error || "Failed to delete", "error");
                                  }
                                });
                              }
                            }}
                            title="Delete Package"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* EDIT PACKAGE MODAL */}
          {editingPackage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-6 sm:p-8 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h3 className="font-display text-lg font-bold text-white">
                    {editingPackage._id ? `Edit ${editingPackage.name}` : "Create New Package"}
                  </h3>
                  <button
                    onClick={() => setEditingPackage(null)}
                    className="rounded-full p-1.5 text-neutral-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Package Name</label>
                    <input
                      type="text"
                      value={editingPackage.name || ""}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Slug / Key</label>
                    <input
                      type="text"
                      value={editingPackage.slug || ""}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, slug: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Tagline Quote</label>
                  <input
                    type="text"
                    value={editingPackage.tagline || ""}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, tagline: e.target.value })
                    }
                    placeholder="e.g. I'm just getting started"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Primary Heading</label>
                  <input
                    type="text"
                    value={editingPackage.heading || ""}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, heading: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Target Challenge / Problem</label>
                  <textarea
                    rows={2}
                    value={editingPackage.theProblem || ""}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, theProblem: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Deliverables List */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-medium text-neutral-300">
                      Deliverables Checklist ({editingPackage.deliverables?.length || 0})
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingPackage({
                          ...editingPackage,
                          deliverables: [...(editingPackage.deliverables || []), "New deliverable"],
                        })
                      }
                      className="text-[11px] font-mono text-[#0052FF] hover:underline"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {editingPackage.deliverables?.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={del}
                          onChange={(e) => {
                            const updated = [...(editingPackage.deliverables || [])];
                            updated[dIdx] = e.target.value;
                            setEditingPackage({ ...editingPackage, deliverables: updated });
                          }}
                          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingPackage.deliverables || []).filter((_, i) => i !== dIdx);
                            setEditingPackage({ ...editingPackage, deliverables: updated });
                          }}
                          className="text-neutral-500 hover:text-red-400 p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Timeline</label>
                    <input
                      type="text"
                      value={editingPackage.timeline || ""}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, timeline: e.target.value })
                      }
                      placeholder="e.g. 2 to 3 weeks"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Payment</label>
                    <input
                      type="text"
                      value={editingPackage.payment || ""}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, payment: e.target.value })
                      }
                      placeholder="One-time"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Investment</label>
                    <input
                      type="text"
                      value={editingPackage.investment || ""}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, investment: e.target.value })
                      }
                      placeholder="Enquire for pricing"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Guarantee / Promise</label>
                    <input
                      type="text"
                      value={editingPackage.promise || ""}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, promise: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={editingPackage.ctaText || ""}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, ctaText: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs items-center">
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={editingPackage.badge || ""}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, badge: e.target.value })
                      }
                      placeholder="Most Popular / Custom-Built"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="pkgPopular"
                      checked={Boolean(editingPackage.isPopular)}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, isPopular: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#0052FF]"
                    />
                    <label htmlFor="pkgPopular" className="text-neutral-300 cursor-pointer">
                      Featured / Popular Card Style
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="pkgVisible"
                      checked={Boolean(editingPackage.visible)}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, visible: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#0052FF]"
                    />
                    <label htmlFor="pkgVisible" className="text-neutral-300 cursor-pointer">
                      Visible on Public Site
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = await saveSpPackageAction(editingPackage);
                        if (res.ok) {
                          onNotice("Package saved successfully.");
                          setEditingPackage(null);
                          window.location.reload();
                        } else {
                          onNotice(res.error || "Failed to save package", "error");
                        }
                      });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-6 py-2 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_15px_rgba(0,82,255,0.4)] disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>{isPending ? "Saving..." : "Save Package"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          3. COMPARISON MATRIX TAB
         ────────────────────────────────────────────────────────── */}
      {subSection === "comparison" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Deliverables Comparison Matrix
              </h3>
              <p className="text-xs text-neutral-400">
                Detailed side-by-side feature comparison rows.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingComparisonRow({
                  feature: "New Feature",
                  kickstart: "Not included",
                  accelerate: "Included",
                  authority: "Full coverage",
                  sortOrder: comparisonRows.length,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_15px_rgba(0,82,255,0.35)] cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Comparison Row</span>
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;
              const oldIdx = comparisonRows.findIndex((c) => c._id === active.id);
              const newIdx = comparisonRows.findIndex((c) => c._id === over.id);
              handleGenericReorder(comparisonRows, setComparisonRows, "comparisonRows", oldIdx, newIdx);
            }}
          >
            <SortableContext
              items={comparisonRows.map((c) => c._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {comparisonRows.map((row, idx) => (
                  <SortableItem key={row._id} id={row._id}>
                    {(dragHandleProps) => (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0E0F18]/90 p-3.5 backdrop-blur-xl hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button
                            {...dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 text-neutral-500 hover:text-white"
                          >
                            <GripVertical size={15} />
                          </button>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-white text-xs block truncate">
                              {row.feature}
                            </span>
                            <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-0.5 truncate font-mono">
                              <span>K: {row.kickstart}</span>
                              <span>•</span>
                              <span className="text-[#0052FF]">A: {row.accelerate}</span>
                              <span>•</span>
                              <span>Au: {row.authority}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() =>
                              handleGenericReorder(
                                comparisonRows,
                                setComparisonRows,
                                "comparisonRows",
                                idx,
                                idx - 1
                              )
                            }
                            disabled={idx === 0}
                            className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                          >
                            <MoveUp size={13} />
                          </button>
                          <button
                            onClick={() =>
                              handleGenericReorder(
                                comparisonRows,
                                setComparisonRows,
                                "comparisonRows",
                                idx,
                                idx + 1
                              )
                            }
                            disabled={idx === comparisonRows.length - 1}
                            className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                          >
                            <MoveDown size={13} />
                          </button>
                          <button
                            onClick={() => setEditingComparisonRow(row)}
                            className="p-1 text-[#0052FF] hover:text-blue-300"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${row.feature}"?`)) {
                                startTransition(async () => {
                                  const res = await deleteSpComparisonRowAction(row._id);
                                  if (res.ok) {
                                    setComparisonRows((prev) =>
                                      prev.filter((c) => c._id !== row._id)
                                    );
                                    onNotice("Row deleted.");
                                  } else {
                                    onNotice(res.error || "Failed to delete", "error");
                                  }
                                });
                              }
                            }}
                            className="p-1 text-neutral-400 hover:text-red-400"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* EDIT COMPARISON ROW MODAL */}
          {editingComparisonRow && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <div className="w-full max-w-lg rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h3 className="font-display text-base font-bold text-white">
                    {editingComparisonRow._id ? "Edit Comparison Row" : "New Comparison Row"}
                  </h3>
                  <button
                    onClick={() => setEditingComparisonRow(null)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Feature Label</label>
                    <input
                      type="text"
                      value={editingComparisonRow.feature || ""}
                      onChange={(e) =>
                        setEditingComparisonRow({ ...editingComparisonRow, feature: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">
                      Kickstart Value
                    </label>
                    <input
                      type="text"
                      value={editingComparisonRow.kickstart || ""}
                      onChange={(e) =>
                        setEditingComparisonRow({
                          ...editingComparisonRow,
                          kickstart: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">
                      Accelerate Value
                    </label>
                    <input
                      type="text"
                      value={editingComparisonRow.accelerate || ""}
                      onChange={(e) =>
                        setEditingComparisonRow({
                          ...editingComparisonRow,
                          accelerate: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">
                      Authority Value
                    </label>
                    <input
                      type="text"
                      value={editingComparisonRow.authority || ""}
                      onChange={(e) =>
                        setEditingComparisonRow({
                          ...editingComparisonRow,
                          authority: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setEditingComparisonRow(null)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs text-neutral-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = await saveSpComparisonRowAction(editingComparisonRow);
                        if (res.ok) {
                          onNotice("Comparison row saved.");
                          setEditingComparisonRow(null);
                          window.location.reload();
                        } else {
                          onNotice(res.error || "Failed to save row", "error");
                        }
                      });
                    }}
                    className="rounded-xl bg-[#0052FF] px-5 py-2 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_15px_rgba(0,82,255,0.4)] disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Save Row"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          4. HOW IT WORKS (PROCESS STEPS) TAB
         ────────────────────────────────────────────────────────── */}
      {subSection === "process" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-white">How It Works (Journey)</h3>
              <p className="text-xs text-neutral-400">
                The 3-stage simple process on the services page.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingProcessStep({
                  stepNumber: `0${processSteps.length + 1}`,
                  timeLabel: "DAY 1",
                  title: "New Process Step",
                  desc: "Clear description of what happens in this step.",
                  sortOrder: processSteps.length,
                  visible: true,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_15px_rgba(0,82,255,0.35)] cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Step</span>
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;
              const oldIdx = processSteps.findIndex((s) => s._id === active.id);
              const newIdx = processSteps.findIndex((s) => s._id === over.id);
              handleGenericReorder(processSteps, setProcessSteps, "processSteps", oldIdx, newIdx);
            }}
          >
            <SortableContext
              items={processSteps.map((s) => s._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {processSteps.map((step, idx) => (
                  <SortableItem key={step._id} id={step._id}>
                    {(dragHandleProps) => (
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0E0F18]/90 p-4 backdrop-blur-xl hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3">
                          <button
                            {...dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 text-neutral-500 hover:text-white"
                          >
                            <GripVertical size={16} />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#0052FF]">
                                {step.stepNumber}
                              </span>
                              <span className="font-mono text-[10px] text-neutral-400 uppercase">
                                [{step.timeLabel}]
                              </span>
                              <h4 className="font-display font-bold text-white text-sm">
                                {step.title}
                              </h4>
                            </div>
                            <p className="text-xs text-neutral-400 mt-0.5">{step.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleGenericReorder(
                                processSteps,
                                setProcessSteps,
                                "processSteps",
                                idx,
                                idx - 1
                              )
                            }
                            disabled={idx === 0}
                            className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                          >
                            <MoveUp size={14} />
                          </button>
                          <button
                            onClick={() =>
                              handleGenericReorder(
                                processSteps,
                                setProcessSteps,
                                "processSteps",
                                idx,
                                idx + 1
                              )
                            }
                            disabled={idx === processSteps.length - 1}
                            className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                          >
                            <MoveDown size={14} />
                          </button>
                          <button
                            onClick={() => setEditingProcessStep(step)}
                            className="p-1.5 rounded-lg text-[#0052FF] hover:bg-white/5"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete step "${step.title}"?`)) {
                                startTransition(async () => {
                                  const res = await deleteSpProcessStepAction(step._id);
                                  if (res.ok) {
                                    setProcessSteps((prev) =>
                                      prev.filter((s) => s._id !== step._id)
                                    );
                                    onNotice("Step deleted.");
                                  } else {
                                    onNotice(res.error || "Failed to delete", "error");
                                  }
                                });
                              }
                            }}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* EDIT PROCESS STEP MODAL */}
          {editingProcessStep && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <div className="w-full max-w-lg rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h3 className="font-display text-base font-bold text-white">
                    {editingProcessStep._id ? "Edit Process Step" : "New Process Step"}
                  </h3>
                  <button
                    onClick={() => setEditingProcessStep(null)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-300 mb-1">
                        Step Number
                      </label>
                      <input
                        type="text"
                        value={editingProcessStep.stepNumber || ""}
                        onChange={(e) =>
                          setEditingProcessStep({
                            ...editingProcessStep,
                            stepNumber: e.target.value,
                          })
                        }
                        placeholder="01"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-300 mb-1">Time Label</label>
                      <input
                        type="text"
                        value={editingProcessStep.timeLabel || ""}
                        onChange={(e) =>
                          setEditingProcessStep({
                            ...editingProcessStep,
                            timeLabel: e.target.value,
                          })
                        }
                        placeholder="DAY 1 / WEEK 2"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingProcessStep.title || ""}
                      onChange={(e) =>
                        setEditingProcessStep({ ...editingProcessStep, title: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProcessStep.desc || ""}
                      onChange={(e) =>
                        setEditingProcessStep({ ...editingProcessStep, desc: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setEditingProcessStep(null)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs text-neutral-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = await saveSpProcessStepAction(editingProcessStep);
                        if (res.ok) {
                          onNotice("Process step saved.");
                          setEditingProcessStep(null);
                          window.location.reload();
                        } else {
                          onNotice(res.error || "Failed to save step", "error");
                        }
                      });
                    }}
                    className="rounded-xl bg-[#0052FF] px-5 py-2 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_15px_rgba(0,82,255,0.4)] disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Save Step"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          5. ONBOARDING (CHECKLIST & TIMELINE) TAB
         ────────────────────────────────────────────────────────── */}
      {subSection === "onboarding" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Checklist Items Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-white">Left: Key Commitments</h3>
                <p className="text-xs text-neutral-400">Items with animated checks on the left.</p>
              </div>
              <button
                onClick={() =>
                  setEditingChecklistItem({
                    title: "New Commitment",
                    desc: "Commitment details",
                    sortOrder: checklistItems.length,
                    visible: true,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052FF] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_12px_rgba(0,82,255,0.3)] cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {checklistItems.map((ci, idx) => (
                <div
                  key={ci._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0E0F18]/90 p-3.5"
                >
                  <div>
                    <h5 className="font-bold text-white text-xs">{ci.title}</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">{ci.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingChecklistItem(ci)}
                      className="p-1 text-[#0052FF] hover:text-blue-300"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${ci.title}"?`)) {
                          startTransition(async () => {
                            const res = await deleteSpChecklistItemAction(ci._id);
                            if (res.ok) {
                              setChecklistItems((prev) => prev.filter((i) => i._id !== ci._id));
                              onNotice("Item deleted.");
                            } else {
                              onNotice(res.error || "Failed to delete", "error");
                            }
                          });
                        }
                      }}
                      className="p-1 text-neutral-400 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Steps Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-white">Right: Timeline Steps</h3>
                <p className="text-xs text-neutral-400">Vertical timeline on the right.</p>
              </div>
              <button
                onClick={() =>
                  setEditingTimelineStep({
                    dayLabel: `Day ${timelineSteps.length * 7}`,
                    title: "New Timeline Stage",
                    desc: "Stage milestones and expectations",
                    sortOrder: timelineSteps.length,
                    visible: true,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052FF] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_12px_rgba(0,82,255,0.3)] cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Stage</span>
              </button>
            </div>

            <div className="space-y-2">
              {timelineSteps.map((ts, idx) => (
                <div
                  key={ts._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0E0F18]/90 p-3.5"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#0052FF]">
                      {ts.dayLabel}
                    </span>
                    <h5 className="font-bold text-white text-xs">{ts.title}</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">{ts.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingTimelineStep(ts)}
                      className="p-1 text-[#0052FF] hover:text-blue-300"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete stage "${ts.title}"?`)) {
                          startTransition(async () => {
                            const res = await deleteSpTimelineStepAction(ts._id);
                            if (res.ok) {
                              setTimelineSteps((prev) => prev.filter((i) => i._id !== ts._id));
                              onNotice("Stage deleted.");
                            } else {
                              onNotice(res.error || "Failed to delete", "error");
                            }
                          });
                        }
                      }}
                      className="p-1 text-neutral-400 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDIT CHECKLIST MODAL */}
          {editingChecklistItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <div className="w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-6 shadow-2xl space-y-3 text-xs">
                <h4 className="font-display text-sm font-bold text-white">Edit Commitment</h4>
                <div>
                  <label className="block text-neutral-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingChecklistItem.title || ""}
                    onChange={(e) =>
                      setEditingChecklistItem({ ...editingChecklistItem, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingChecklistItem.desc || ""}
                    onChange={(e) =>
                      setEditingChecklistItem({ ...editingChecklistItem, desc: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingChecklistItem(null)}
                    className="px-3 py-1.5 text-neutral-400"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = await saveSpChecklistItemAction(editingChecklistItem);
                        if (res.ok) {
                          onNotice("Saved.");
                          setEditingChecklistItem(null);
                          window.location.reload();
                        } else onNotice(res.error || "Error", "error");
                      });
                    }}
                    className="rounded-xl bg-[#0052FF] px-4 py-1.5 text-xs font-bold text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT TIMELINE MODAL */}
          {editingTimelineStep && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <div className="w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-6 shadow-2xl space-y-3 text-xs">
                <h4 className="font-display text-sm font-bold text-white">Edit Timeline Stage</h4>
                <div>
                  <label className="block text-neutral-300 mb-1">Day / Stage Label</label>
                  <input
                    type="text"
                    value={editingTimelineStep.dayLabel || ""}
                    onChange={(e) =>
                      setEditingTimelineStep({ ...editingTimelineStep, dayLabel: e.target.value })
                    }
                    placeholder="Day 1 / Day 14"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingTimelineStep.title || ""}
                    onChange={(e) =>
                      setEditingTimelineStep({ ...editingTimelineStep, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingTimelineStep.desc || ""}
                    onChange={(e) =>
                      setEditingTimelineStep({ ...editingTimelineStep, desc: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingTimelineStep(null)}
                    className="px-3 py-1.5 text-neutral-400"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = await saveSpTimelineStepAction(editingTimelineStep);
                        if (res.ok) {
                          onNotice("Saved.");
                          setEditingTimelineStep(null);
                          window.location.reload();
                        } else onNotice(res.error || "Error", "error");
                      });
                    }}
                    className="rounded-xl bg-[#0052FF] px-4 py-1.5 text-xs font-bold text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          6. CORE CAPABILITIES (SERVICES) TAB
         ────────────────────────────────────────────────────────── */}
      {subSection === "core-services" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-white">Six Core Services</h3>
              <p className="text-xs text-neutral-400">
                Editorial rows with image, summary, deliverables, and package inclusions.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingCoreService({
                  slug: `service-${Date.now().toString().slice(-4)}`,
                  title: "New Agency Capability",
                  includedIn: "Kickstart · Accelerate · Authority",
                  summary: "Service summary for clients.",
                  bullets: ["Key deliverable 1", "Key deliverable 2"],
                  imageUrl: "",
                  imageAlt: "Service Alt Text",
                  sortOrder: coreServices.length,
                  visible: true,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_15px_rgba(0,82,255,0.35)] cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Service</span>
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;
              const oldIdx = coreServices.findIndex((cs) => cs._id === active.id);
              const newIdx = coreServices.findIndex((cs) => cs._id === over.id);
              handleGenericReorder(coreServices, setCoreServices, "coreServices", oldIdx, newIdx);
            }}
          >
            <SortableContext
              items={coreServices.map((cs) => cs._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {coreServices.map((svc, idx) => (
                  <SortableItem key={svc._id} id={svc._id}>
                    {(dragHandleProps) => (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0E0F18]/90 p-4 backdrop-blur-xl hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3">
                          <button
                            {...dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 text-neutral-500 hover:text-white"
                          >
                            <GripVertical size={16} />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#0052FF]">
                                0{idx + 1}
                              </span>
                              <h4 className="font-display font-bold text-white text-sm">
                                {svc.title}
                              </h4>
                              <span className="text-[10px] font-mono text-neutral-400">
                                ({svc.includedIn})
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                              {svc.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                          <button
                            onClick={() =>
                              handleGenericReorder(
                                coreServices,
                                setCoreServices,
                                "coreServices",
                                idx,
                                idx - 1
                              )
                            }
                            disabled={idx === 0}
                            className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                          >
                            <MoveUp size={14} />
                          </button>
                          <button
                            onClick={() =>
                              handleGenericReorder(
                                coreServices,
                                setCoreServices,
                                "coreServices",
                                idx,
                                idx + 1
                              )
                            }
                            disabled={idx === coreServices.length - 1}
                            className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                          >
                            <MoveDown size={14} />
                          </button>
                          <button
                            onClick={() => {
                              startTransition(async () => {
                                const res = await toggleSpCoreServiceVisibilityAction(
                                  svc._id,
                                  !svc.visible
                                );
                                if (res.ok) {
                                  setCoreServices((prev) =>
                                    prev.map((c) =>
                                      c._id === svc._id ? { ...c, visible: !c.visible } : c
                                    )
                                  );
                                  onNotice(`Service ${svc.visible ? "hidden" : "visible"}.`);
                                } else onNotice(res.error || "Error", "error");
                              });
                            }}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                          >
                            {svc.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => setEditingCoreService(svc)}
                            className="p-1.5 rounded-lg text-[#0052FF] hover:bg-white/5"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete service "${svc.title}"?`)) {
                                startTransition(async () => {
                                  const res = await deleteSpCoreServiceAction(svc._id);
                                  if (res.ok) {
                                    setCoreServices((prev) =>
                                      prev.filter((c) => c._id !== svc._id)
                                    );
                                    onNotice("Service deleted.");
                                  } else onNotice(res.error || "Error", "error");
                                });
                              }
                            }}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* EDIT CORE SERVICE MODAL */}
          {editingCoreService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
              <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h3 className="font-display text-base font-bold text-white">
                    {editingCoreService._id ? `Edit ${editingCoreService.title}` : "New Service"}
                  </h3>
                  <button
                    onClick={() => setEditingCoreService(null)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Service Title</label>
                    <input
                      type="text"
                      value={editingCoreService.title || ""}
                      onChange={(e) =>
                        setEditingCoreService({ ...editingCoreService, title: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-300 mb-1">Slug</label>
                      <input
                        type="text"
                        value={editingCoreService.slug || ""}
                        onChange={(e) =>
                          setEditingCoreService({ ...editingCoreService, slug: e.target.value })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-300 mb-1">
                        Package Inclusions Tag
                      </label>
                      <input
                        type="text"
                        value={editingCoreService.includedIn || ""}
                        onChange={(e) =>
                          setEditingCoreService({
                            ...editingCoreService,
                            includedIn: e.target.value,
                          })
                        }
                        placeholder="Kickstart · Accelerate · Authority"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Summary</label>
                    <textarea
                      rows={3}
                      value={editingCoreService.summary || ""}
                      onChange={(e) =>
                        setEditingCoreService({ ...editingCoreService, summary: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white leading-relaxed"
                    />
                  </div>

                  {/* Bullet points */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-medium text-neutral-300">
                        Deliverable Bullets ({editingCoreService.bullets?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCoreService({
                            ...editingCoreService,
                            bullets: [...(editingCoreService.bullets || []), "New deliverable bullet"],
                          })
                        }
                        className="text-[11px] font-mono text-[#0052FF] hover:underline"
                      >
                        + Add Bullet
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {editingCoreService.bullets?.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => {
                              const updated = [...(editingCoreService.bullets || [])];
                              updated[bIdx] = e.target.value;
                              setEditingCoreService({ ...editingCoreService, bullets: updated });
                            }}
                            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingCoreService.bullets || []).filter(
                                (_, i) => i !== bIdx
                              );
                              setEditingCoreService({ ...editingCoreService, bullets: updated });
                            }}
                            className="text-neutral-500 hover:text-red-400 p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">
                      Custom Image URL (Optional - leave blank for default branded asset)
                    </label>
                    <input
                      type="text"
                      value={editingCoreService.imageUrl || ""}
                      onChange={(e) =>
                        setEditingCoreService({ ...editingCoreService, imageUrl: e.target.value })
                      }
                      placeholder="https://... or /image.jpg"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setEditingCoreService(null)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs text-neutral-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = await saveSpCoreServiceAction(editingCoreService);
                        if (res.ok) {
                          onNotice("Service saved.");
                          setEditingCoreService(null);
                          window.location.reload();
                        } else onNotice(res.error || "Failed to save", "error");
                      });
                    }}
                    className="rounded-xl bg-[#0052FF] px-5 py-2 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_15px_rgba(0,82,255,0.4)] disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Save Service"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          7. FAQS TAB
         ────────────────────────────────────────────────────────── */}
      {subSection === "faqs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-white">Services FAQ</h3>
              <p className="text-xs text-neutral-400">
                Frequently asked questions specific to booking packages and strategy calls.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingFaq({
                  question: "New Question?",
                  answer: "Clear, reassuring answer for prospective clients.",
                  sortOrder: faqs.length,
                  visible: true,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_15px_rgba(0,82,255,0.35)] cursor-pointer"
            >
              <Plus size={14} />
              <span>Add FAQ</span>
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;
              const oldIdx = faqs.findIndex((f) => f._id === active.id);
              const newIdx = faqs.findIndex((f) => f._id === over.id);
              handleGenericReorder(faqs, setFaqs, "faqs", oldIdx, newIdx);
            }}
          >
            <SortableContext items={faqs.map((f) => f._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2.5">
                {faqs.map((item, idx) => (
                  <SortableItem key={item._id} id={item._id}>
                    {(dragHandleProps) => (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0E0F18]/90 p-3.5 backdrop-blur-xl hover:border-white/20 transition-all">
                        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                          <button
                            {...dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 text-neutral-500 hover:text-white mt-0.5 sm:mt-0"
                          >
                            <GripVertical size={15} />
                          </button>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-white text-xs block">
                              {item.question}
                            </span>
                            <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                              {item.answer}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          <button
                            onClick={() =>
                              handleGenericReorder(faqs, setFaqs, "faqs", idx, idx - 1)
                            }
                            disabled={idx === 0}
                            className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                          >
                            <MoveUp size={13} />
                          </button>
                          <button
                            onClick={() =>
                              handleGenericReorder(faqs, setFaqs, "faqs", idx, idx + 1)
                            }
                            disabled={idx === faqs.length - 1}
                            className="p-1 text-neutral-400 hover:text-white disabled:opacity-20"
                          >
                            <MoveDown size={13} />
                          </button>
                          <button
                            onClick={() => {
                              startTransition(async () => {
                                const res = await toggleSpFaqVisibilityAction(
                                  item._id,
                                  !item.visible
                                );
                                if (res.ok) {
                                  setFaqs((prev) =>
                                    prev.map((f) =>
                                      f._id === item._id ? { ...f, visible: !f.visible } : f
                                    )
                                  );
                                  onNotice(`FAQ ${item.visible ? "hidden" : "visible"}.`);
                                } else onNotice(res.error || "Error", "error");
                              });
                            }}
                            className="p-1 text-neutral-400 hover:text-white"
                          >
                            {item.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                          </button>
                          <button
                            onClick={() => setEditingFaq(item)}
                            className="p-1 text-[#0052FF] hover:text-blue-300"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this FAQ?")) {
                                startTransition(async () => {
                                  const res = await deleteSpFaqAction(item._id);
                                  if (res.ok) {
                                    setFaqs((prev) => prev.filter((f) => f._id !== item._id));
                                    onNotice("FAQ deleted.");
                                  } else onNotice(res.error || "Error", "error");
                                });
                              }
                            }}
                            className="p-1 text-neutral-400 hover:text-red-400"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* EDIT FAQ MODAL */}
          {editingFaq && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <div className="w-full max-w-lg rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h3 className="font-display text-base font-bold text-white">
                    {editingFaq._id ? "Edit FAQ" : "New FAQ"}
                  </h3>
                  <button
                    onClick={() => setEditingFaq(null)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Question</label>
                    <input
                      type="text"
                      value={editingFaq.question || ""}
                      onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">Answer</label>
                    <textarea
                      rows={4}
                      value={editingFaq.answer || ""}
                      onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setEditingFaq(null)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs text-neutral-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = await saveSpFaqAction(editingFaq);
                        if (res.ok) {
                          onNotice("FAQ saved.");
                          setEditingFaq(null);
                          window.location.reload();
                        } else onNotice(res.error || "Failed to save FAQ", "error");
                      });
                    }}
                    className="rounded-xl bg-[#0052FF] px-5 py-2 text-xs font-bold text-white hover:bg-[#004ADE] shadow-[0_0_15px_rgba(0,82,255,0.4)] disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Save FAQ"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
