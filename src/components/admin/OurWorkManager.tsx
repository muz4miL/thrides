"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  Save,
  X,
  Sliders,
  Layers,
  FileText,
  Star,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import type {
  WorkProjectDoc,
  WorkPageSettingsDoc,
  CaseStudyBlock,
  CaseStudyBlockType,
} from "@/server/types";
import {
  adminSaveWorkProjectFn,
  adminDeleteWorkProjectFn,
  adminDuplicateWorkProjectFn,
  adminSaveWorkPageSettingsFn,
  adminUploadMediaFn,
} from "@/api/admin";

interface OurWorkManagerProps {
  initialProjects: WorkProjectDoc[];
  initialSettings: WorkPageSettingsDoc;
  onNotice: (text: string, type?: "success" | "error") => void;
}

const AVAILABLE_CATEGORIES = [
  { id: "consultancy", label: "Consultancy" },
  { id: "web-dev", label: "Websites & Platforms" },
  { id: "content", label: "Content Strategy" },
  { id: "social-media", label: "Social Media" },
  { id: "seo", label: "SEO Visibility" },
  { id: "email-marketing", label: "Email & Retention" },
];

export function OurWorkManager({
  initialProjects,
  initialSettings,
  onNotice,
}: OurWorkManagerProps) {
  const [subTab, setSubTab] = useState<"projects" | "settings">("projects");
  const [projects, setProjects] = useState<WorkProjectDoc[]>(initialProjects || []);
  const [settings, setSettings] = useState<WorkPageSettingsDoc>(initialSettings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "featured">("all");

  // Editing Project Modal State
  const [editingProject, setEditingProject] = useState<Partial<WorkProjectDoc> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────
  // 1. FILTERING & SEARCH
  // ─────────────────────────────────────────────────────────────
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.industry.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "published") return p.isPublished === true;
    if (statusFilter === "draft") return p.isPublished !== true;
    if (statusFilter === "featured") return p.isFeatured === true;
    return true;
  });

  // ─────────────────────────────────────────────────────────────
  // 2. PROJECT REORDERING (UP / DOWN)
  // ─────────────────────────────────────────────────────────────
  const handleMoveProject = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    if (moved) {
      updated.splice(targetIndex, 0, moved);
    }

    // Re-index orders
    const reordered = updated.map((p, i) => ({ ...p, order: i + 1 }));
    setProjects(reordered);

    try {
      await Promise.all(
        reordered.map((p) => adminSaveWorkProjectFn({ data: { _id: p._id, order: p.order } })),
      );
      onNotice("Project order updated successfully");
    } catch {
      onNotice("Failed to save reordered list", "error");
    }
  };

  const updateResultItem = (i: number, key: "metric" | "label" | "context", val: string) => {
    setEditingProject((prev) => {
      if (!prev) return prev;
      const results = (prev.results || []).map((r, idx) =>
        idx === i ? { ...r, [key]: val } : r,
      );
      return { ...prev, results };
    });
  };

  const updateBlockItem = (bIdx: number, patch: Record<string, any>) => {
    setEditingProject((prev) => {
      if (!prev) return prev;
      const blocks = (prev.blocks || []).map((b, idx) =>
        idx === bIdx ? ({ ...b, ...patch } as CaseStudyBlock) : b,
      );
      return { ...prev, blocks };
    });
  };

  // ─────────────────────────────────────────────────────────────
  // 3. DUPLICATE AS DRAFT
  // ─────────────────────────────────────────────────────────────
  const handleDuplicate = async (slug: string) => {
    try {
      const res = await adminDuplicateWorkProjectFn({ data: { slug } });
      if (res.success) {
        onNotice(`Duplicated as draft (${res.slug})`);
        const orig = projects.find((p) => p.slug === slug);
        if (orig) {
          const duplicateItem: WorkProjectDoc = {
            ...orig,
            _id: res.id,
            slug: res.slug,
            title: `${orig.title} (Draft Copy)`,
            isPublished: false,
            isDraft: true,
            isFeatured: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setProjects((prev) => [duplicateItem, ...prev]);
        }
      }
    } catch (err: any) {
      onNotice(err?.message || "Failed to duplicate project", "error");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 4. DELETE PROJECT
  // ─────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      await adminDeleteWorkProjectFn({ data: { id } });
      setProjects((prev) => prev.filter((p) => (p._id ? p._id !== id : p.slug !== id)));
      setDeleteConfirmId(null);
      onNotice("Project deleted successfully");
    } catch (err: any) {
      onNotice(err?.message || "Failed to delete project", "error");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 5. TOGGLE FEATURED
  // ─────────────────────────────────────────────────────────────
  const handleToggleFeatured = async (project: WorkProjectDoc) => {
    const newFeatured = !project.isFeatured;
    try {
      await adminSaveWorkProjectFn({
        data: { _id: project._id, slug: project.slug, isFeatured: newFeatured },
      });
      setProjects((prev) =>
        prev.map((p) => (p.slug === project.slug ? { ...p, isFeatured: newFeatured } : p)),
      );
      onNotice(newFeatured ? "Marked as featured on showcase" : "Removed from featured");
    } catch {
      onNotice("Failed to update featured status", "error");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 6. SAVE PROJECT (CREATE OR UPDATE)
  // ─────────────────────────────────────────────────────────────
  const handleSaveProject = async () => {
    if (!editingProject) return;

    if (!editingProject.title?.trim()) {
      onNotice("Project title is required", "error");
      return;
    }
    if (!editingProject.clientName?.trim()) {
      onNotice("Client name is required", "error");
      return;
    }
    if (!editingProject.slug?.trim()) {
      onNotice("Slug is required", "error");
      return;
    }

    if (editingProject.isPublished) {
      if (!editingProject.summary?.trim()) {
        onNotice("Published projects require a summary positioning statement", "error");
        return;
      }
      if (!editingProject.thumbnailUrl) {
        onNotice("Published projects require at least a thumbnail image", "error");
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        ...editingProject,
        categories: editingProject.categories || [],
        services: editingProject.services || [],
        results: editingProject.results || [],
        blocks: editingProject.blocks || [],
        isPublished: Boolean(editingProject.isPublished),
        isFeatured: Boolean(editingProject.isFeatured),
        order: editingProject.order ?? projects.length + 1,
      };

      const res = await adminSaveWorkProjectFn({ data: payload });
      if (res.success) {
        onNotice(editingProject._id ? "Project updated successfully" : "New project published to portfolio!");
        setProjects((prev) => {
          const index = prev.findIndex((p) => p.slug === editingProject.slug || (p._id && p._id === editingProject._id));
          const fullDoc = { ...payload, _id: res.id } as WorkProjectDoc;
          if (index >= 0) {
            const next = [...prev];
            next[index] = fullDoc;
            return next;
          }
          return [fullDoc, ...prev];
        });
        setEditingProject(null);
      }
    } catch (err: any) {
      onNotice(err?.message || "Failed to save project", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 7. SAVE PAGE SETTINGS
  // ─────────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await adminSaveWorkPageSettingsFn({ data: settings });
      onNotice("Portfolio page settings saved successfully!");
    } catch (err: any) {
      onNotice(err?.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 8. MEDIA UPLOAD HANDLER
  // ─────────────────────────────────────────────────────────────
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (url: string, mediaType: "image" | "video") => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminUploadMediaFn(formData);
      if (res.success && res.url) {
        onComplete(res.url, res.mediaType);
        onNotice("Media uploaded successfully");
      }
    } catch (err: any) {
      onNotice(err?.message || "Media upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Controls & Navigation Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0052FF]/30 bg-[#0052FF]/10 px-3 py-0.5 text-xs font-mono font-bold text-[#4385FF] uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            <span>EXHIBITION MANAGEMENT</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Our Work &amp; Case Studies CMS
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Curate published portfolio projects, modular case studies, and cinematic exhibition settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab("projects")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              subTab === "projects"
                ? "bg-[#0052FF] text-white shadow-[0_0_16px_rgba(0,82,255,0.4)]"
                : "bg-white/[0.04] text-neutral-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <span>Projects Catalogue ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("settings")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              subTab === "settings"
                ? "bg-[#0052FF] text-white shadow-[0_0_16px_rgba(0,82,255,0.4)]"
                : "bg-white/[0.04] text-neutral-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <Sliders size={13} className="inline mr-1.5" />
            <span>Page Settings</span>
          </button>

          {subTab === "projects" && (
            <button
              type="button"
              onClick={() =>
                setEditingProject({
                  title: "",
                  clientName: "",
                  slug: "",
                  industry: "Digital Technology",
                  year: "2026",
                  summary: "",
                  challenge: "",
                  approach: "",
                  services: ["Website Architecture"],
                  categories: ["web-dev"],
                  isPublished: false,
                  isDraft: true,
                  isFeatured: false,
                  featuredOrder: 0,
                  mediaType: "image",
                  thumbnailUrl: "/images/work/work-identity-halo.jpg",
                  heroMediaUrl: "/images/work/work-identity-halo.jpg",
                  altText: "",
                  accentColor: "#0052FF",
                  isConceptWork: false,
                  results: [{ metric: "+100%", label: "Key Outcome", context: "Verification metric" }],
                  blocks: [],
                })
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.08] border border-white/10 hover:bg-[#0052FF] px-4 py-2 text-xs font-bold text-white transition-all shadow-[0_0_16px_rgba(0,82,255,0.2)] cursor-pointer"
            >
              <Plus size={14} className="text-[#4385FF]" />
              <span>New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: PROJECTS CATALOGUE
         ───────────────────────────────────────────────────────────── */}
      {subTab === "projects" && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by client, title, industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-4 pr-10 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-hidden transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "published", label: "Published" },
                  { id: "draft", label: "Drafts" },
                  { id: "featured", label: "Featured" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold cursor-pointer shrink-0 transition-all ${
                    statusFilter === tab.id
                      ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                      : "bg-white/[0.04] text-neutral-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project List */}
          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0B10] p-12 text-center">
              <Layers size={32} className="mx-auto text-neutral-500 mb-3" />
              <h3 className="font-display font-bold text-base text-white">No projects found</h3>
              <p className="text-xs text-neutral-400 mt-1">
                {searchQuery ? "Try clearing your search query." : "Click 'New Project' to create your first case study."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.slug}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0A0B12]/90 p-4 transition-all hover:border-white/[0.18] hover:bg-[#0E0F18] shadow-md group"
                >
                  {/* Left: Reorder controls + Thumbnail + Details */}
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                    <div className="flex flex-col gap-1 text-neutral-500 pt-1 sm:pt-0 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, "up")}
                        disabled={idx === 0}
                        className="hover:text-white disabled:opacity-20 cursor-pointer p-1 rounded hover:bg-white/5 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, "down")}
                        disabled={idx === projects.length - 1}
                        className="hover:text-white disabled:opacity-20 cursor-pointer p-1 rounded hover:bg-white/5 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#08080C]">
                      <img
                        src={project.thumbnailUrl || project.heroMediaUrl}
                        alt={project.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {project.mediaType === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                          <Film size={14} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#4385FF]">
                          {project.clientName}
                        </span>
                        <span className="text-neutral-600">•</span>
                        <span className="font-mono text-[11px] text-neutral-400">{project.year}</span>
                        {project.isPublished ? (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold">
                            Draft
                          </span>
                        )}
                        {project.isFeatured && (
                          <span className="rounded-full bg-[#0052FF]/15 text-[#4385FF] border border-[#0052FF]/30 px-2 py-0.5 text-[10px] font-mono font-semibold inline-flex items-center gap-1">
                            <Star size={10} className="fill-current text-amber-400" />
                            Featured
                          </span>
                        )}
                        {project.isConceptWork && (
                          <span className="rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold">
                            Concept
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-sm sm:text-[15px] text-white truncate mt-1 group-hover:text-[#4385FF] transition-colors">
                        {project.title}
                      </h3>

                      <span className="font-mono text-[10.5px] text-neutral-400 block truncate mt-0.5">
                        /our-work/{project.slug} • {project.industry} • {project.blocks?.length || 0} blocks
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t border-white/[0.04] sm:border-0 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(project)}
                      className={`rounded-xl p-2 text-xs transition-colors cursor-pointer border ${
                        project.isFeatured
                          ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                          : "text-neutral-400 hover:text-white border-white/[0.08] hover:bg-white/[0.05]"
                      }`}
                      title={project.isFeatured ? "Unfeature" : "Feature on Signature Stage"}
                    >
                      <Star size={14} className={project.isFeatured ? "fill-current" : ""} />
                    </button>

                    <Link
                      href={`/our-work/${project.slug}?preview=true`}
                      target="_blank"
                      className="rounded-xl border border-white/[0.08] p-2 text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                      title="Preview Case Study"
                    >
                      <Eye size={14} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(project.slug)}
                      className="rounded-xl border border-white/[0.08] p-2 text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                      title="Duplicate as Draft"
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingProject({ ...project })}
                      className="inline-flex items-center gap-1 rounded-xl bg-white/[0.08] border border-white/10 hover:bg-[#0052FF] px-3 py-1.5 text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(String(project._id || project.slug))}
                      className="rounded-xl border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: PAGE SETTINGS
         ───────────────────────────────────────────────────────────── */}
      {subTab === "settings" && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0B12]/90 p-6 sm:p-8 space-y-8 max-w-4xl shadow-xl">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Hero Presentation</h3>
            <p className="text-xs text-neutral-400">Customize the typography and dominant media of /our-work</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={settings.heroEyebrow}
                onChange={(e) => setSettings({ ...settings, heroEyebrow: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                Heading Line 1 (Bold Sans)
              </label>
              <input
                type="text"
                value={settings.heroHeadingLine1}
                onChange={(e) => setSettings({ ...settings, heroHeadingLine1: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                Heading Line 2 (Italic Serif)
              </label>
              <input
                type="text"
                value={settings.heroHeadingLine2}
                onChange={(e) => setSettings({ ...settings, heroHeadingLine2: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                Supporting Copy
              </label>
              <textarea
                rows={3}
                value={settings.heroSupportingCopy}
                onChange={(e) => setSettings({ ...settings, heroSupportingCopy: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                Hero Media URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.heroMediaUrl}
                  onChange={(e) => setSettings({ ...settings, heroMediaUrl: e.target.value })}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
                />
                <label className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.1] px-4 py-2 text-xs font-bold text-white cursor-pointer transition-colors">
                  <Upload size={13} className="text-[#4385FF]" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) =>
                      handleFileUpload(e, (url) => setSettings({ ...settings, heroMediaUrl: url }))
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                Hero Project Annotation
              </label>
              <input
                type="text"
                value={settings.heroProjectAnnotation}
                onChange={(e) => setSettings({ ...settings, heroProjectAnnotation: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                Motion Preset
              </label>
              <select
                value={settings.motionPreset}
                onChange={(e) =>
                  setSettings({ ...settings, motionPreset: e.target.value as "subtle" | "standard" | "reduced" })
                }
                className="w-full rounded-xl border border-white/10 bg-[#0A0B12] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
              >
                <option value="standard">Standard (Full Cinematic Pinning)</option>
                <option value="subtle">Subtle (Restrained Transition)</option>
                <option value="reduced">Reduced (Static Presentation)</option>
              </select>
            </div>
          </div>

          {/* Closing Invitation CTA */}
          <div className="pt-6 border-t border-white/[0.08] space-y-4">
            <div>
              <h4 className="font-display font-bold text-base text-white">Closing Invitation CTA</h4>
              <p className="text-xs text-neutral-400">Configurable call-to-action at the bottom of the work page</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                  CTA Line 1
                </label>
                <input
                  type="text"
                  value={settings.closingCtaHeadingLine1}
                  onChange={(e) => setSettings({ ...settings, closingCtaHeadingLine1: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                  CTA Line 2
                </label>
                <input
                  type="text"
                  value={settings.closingCtaHeadingLine2}
                  onChange={(e) => setSettings({ ...settings, closingCtaHeadingLine2: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                  Supporting Paragraph
                </label>
                <textarea
                  rows={2}
                  value={settings.closingCtaCopy}
                  onChange={(e) => setSettings({ ...settings, closingCtaCopy: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={settings.closingCtaButtonText}
                  onChange={(e) => setSettings({ ...settings, closingCtaButtonText: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                  Button Destination
                </label>
                <input
                  type="text"
                  value={settings.closingCtaDestination}
                  onChange={(e) => setSettings({ ...settings, closingCtaDestination: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="pt-6 border-t border-white/[0.08] space-y-4">
            <div>
              <h4 className="font-display font-bold text-base text-white">SEO &amp; Meta</h4>
              <p className="text-xs text-neutral-400">Search engine indexing and social preview cards</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={settings.seo?.title || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, seo: { ...settings.seo, title: e.target.value } })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={settings.seo?.description || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, seo: { ...settings.seo, description: e.target.value } })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.08] flex justify-end">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveSettings}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0043DB] shadow-[0_0_20px_rgba(0,82,255,0.4)] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} />
              <span>{isSaving ? "Saving..." : "Save Page Settings"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: EDIT OR CREATE MODULAR PROJECT
         ───────────────────────────────────────────────────────────── */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#0A0B12] p-5 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.9)] border border-white/10 my-4 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4 shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#4385FF]">
                  {editingProject._id ? "EDIT CASE STUDY" : "CREATE NEW PROJECT"}
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  {editingProject.title || "Untitled Project"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="rounded-xl border border-white/10 p-2 text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-6 text-xs custom-scrollbar">
              {/* Publication Status & Concept toggles */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 rounded-2xl bg-white/[0.02] p-4 border border-white/[0.06]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.isPublished)}
                    onChange={(e) => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                    className="rounded border-white/20 bg-white/5 text-[#0052FF] focus:ring-0"
                  />
                  <span className="font-bold text-white">Published on Live Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.isFeatured)}
                    onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                    className="rounded border-white/20 bg-white/5 text-[#0052FF] focus:ring-0"
                  />
                  <span className="font-bold text-white">Feature on Signature Stage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.isConceptWork)}
                    onChange={(e) => setEditingProject({ ...editingProject, isConceptWork: e.target.checked })}
                    className="rounded border-white/20 bg-white/5 text-[#0052FF] focus:ring-0"
                  />
                  <span className="font-bold text-white">Mark as Concept Work</span>
                </label>
              </div>

              {/* Core Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={editingProject.clientName || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-white focus:border-[#0052FF] focus:outline-hidden"
                    placeholder="e.g. Apex Strategic Advisory"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={editingProject.slug || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 font-mono text-white focus:border-[#0052FF] focus:outline-hidden"
                    placeholder="e.g. apex-advisory"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                    Case Study Title *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 font-display font-semibold text-white focus:border-[#0052FF] focus:outline-hidden"
                    placeholder="e.g. Apex Strategic Advisory: Corporate Positioning & Digital Platform"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={editingProject.industry || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, industry: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-white focus:border-[#0052FF] focus:outline-hidden"
                    placeholder="e.g. Management Consultancy"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                    Year / Timeline
                  </label>
                  <input
                    type="text"
                    value={editingProject.year || "2026"}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-white focus:border-[#0052FF] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                    Positioning Statement / Summary *
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.summary || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-white focus:border-[#0052FF] focus:outline-hidden"
                    placeholder="Concise executive narrative of what Thrides engineered and delivered..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {AVAILABLE_CATEGORIES.map((cat) => {
                      const isChecked = editingProject.categories?.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            const cur = editingProject.categories || [];
                            const next = isChecked ? cur.filter((c) => c !== cat.id) : [...cur, cat.id];
                            setEditingProject({ ...editingProject, categories: next });
                          }}
                          className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                            isChecked
                              ? "bg-[#0052FF] text-white shadow-[0_0_12px_rgba(0,82,255,0.4)]"
                              : "bg-white/[0.04] text-neutral-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Media Settings */}
              <div className="pt-4 border-t border-white/[0.08] space-y-4">
                <h4 className="font-display font-bold text-sm text-white">Hero &amp; Thumbnail Media</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                      Thumbnail URL (Catalogue &amp; Grid)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingProject.thumbnailUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, thumbnailUrl: e.target.value })}
                        className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-white focus:border-[#0052FF] focus:outline-hidden"
                      />
                      <label className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.1] px-3 py-2 text-xs font-bold text-white cursor-pointer transition-colors">
                        <Upload size={12} className="text-[#4385FF]" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => setEditingProject({ ...editingProject, thumbnailUrl: url }))
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                      Hero Media URL (Dominant Banner)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingProject.heroMediaUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, heroMediaUrl: e.target.value })}
                        className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-white focus:border-[#0052FF] focus:outline-hidden"
                      />
                      <label className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.1] px-3 py-2 text-xs font-bold text-white cursor-pointer transition-colors">
                        <Upload size={12} className="text-[#4385FF]" />
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) =>
                            handleFileUpload(e, (url, type) =>
                              setEditingProject({
                                ...editingProject,
                                heroMediaUrl: url,
                                mediaType: type,
                              }),
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Narrative Sections: Challenge & Approach */}
              <div className="pt-4 border-t border-white/[0.08] space-y-4">
                <h4 className="font-display font-bold text-sm text-white">Narrative Structure</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                      The Challenge (Friction Point)
                    </label>
                    <textarea
                      rows={4}
                      value={editingProject.challenge || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-white focus:border-[#0052FF] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                      Our Approach (The Solution)
                    </label>
                    <textarea
                      rows={4}
                      value={editingProject.approach || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, approach: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-white focus:border-[#0052FF] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Verified Results Builder */}
              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-white">Verified Outcomes / Metrics</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = editingProject.results || [];
                      setEditingProject({
                        ...editingProject,
                        results: [...cur, { metric: "+50%", label: "Metric Label", context: "Context note" }],
                      });
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] px-3 py-1 font-bold text-white cursor-pointer transition-colors"
                  >
                    <Plus size={12} className="text-[#4385FF]" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingProject.results?.map((res, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        placeholder="Metric (+184%)"
                        value={res.metric}
                        onChange={(e) => updateResultItem(i, "metric", e.target.value)}
                        className="w-full sm:w-32 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono font-bold text-white"
                      />
                      <input
                        type="text"
                        placeholder="Label (Qualified Pipeline)"
                        value={res.label}
                        onChange={(e) => updateResultItem(i, "label", e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Context (Compared to last year)"
                        value={res.context || ""}
                        onChange={(e) => updateResultItem(i, "context", e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingProject.results || []).filter((_, idx) => idx !== i);
                          setEditingProject({ ...editingProject, results: updated });
                        }}
                        className="self-end sm:self-center p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modular Blocks Builder */}
              <div className="pt-4 border-t border-white/[0.08] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">Modular Content Blocks</h4>
                    <p className="text-[11px] text-neutral-400">Full-width images, split layouts, video reels, and editorial highlights</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        const type = e.target.value as CaseStudyBlockType;
                        if (!type) return;
                        const newId = `block-${Date.now()}`;
                        let newBlock: CaseStudyBlock;

                        if (type === "full_width_image") {
                          newBlock = {
                            id: newId,
                            type: "full_width_image",
                            url: "/images/work/service-identity.jpg",
                            altText: "Visual showcase",
                            caption: "Showcase caption",
                          };
                        } else if (type === "editorial_text") {
                          newBlock = {
                            id: newId,
                            type: "editorial_text",
                            eyebrow: "STRATEGIC NOTE",
                            heading: "Editorial Section Heading",
                            body: "Narrative body text explaining strategic execution and methodology.",
                          };
                        } else if (type === "two_image_split") {
                          newBlock = {
                            id: newId,
                            type: "two_image_split",
                            imageLeft: { url: "/images/work/service-web.jpg", altText: "Left image" },
                            imageRight: { url: "/images/work/work-identity-pulse.jpg", altText: "Right image" },
                            caption: "Dual view comparison",
                          };
                        } else if (type === "video") {
                          newBlock = {
                            id: newId,
                            type: "video",
                            url: "/videos/ads/13014537_2160_3840_24fps.mp4",
                            caption: "Campaign video reel",
                          };
                        } else {
                          newBlock = {
                            id: newId,
                            type: "full_width_image",
                            url: "/images/work/service-identity.jpg",
                            altText: "Visual showcase",
                          };
                        }

                        setEditingProject({
                          ...editingProject,
                          blocks: [...(editingProject.blocks || []), newBlock],
                        });
                        e.target.value = "";
                      }}
                      className="rounded-xl border border-white/15 bg-[#0C0D16] px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
                    >
                      <option value="">+ Add Content Block...</option>
                      <option value="full_width_image">Full-Width Image</option>
                      <option value="two_image_split">Two-Image Split</option>
                      <option value="editorial_text">Editorial Text</option>
                      <option value="video">Video Reel</option>
                    </select>
                  </div>
                </div>

                {/* Blocks List */}
                <div className="space-y-3">
                  {(editingProject.blocks || []).map((block, bIdx) => (
                    <div
                      key={block.id || bIdx}
                      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                        <span className="font-mono text-[10px] font-bold uppercase text-[#4385FF]">
                          BLOCK {bIdx + 1}: {block.type.replace(/_/g, " ")}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={bIdx === 0}
                            onClick={() => {
                              const updated = [...(editingProject.blocks || [])];
                              const [moved] = updated.splice(bIdx, 1);
                              if (moved) updated.splice(bIdx - 1, 0, moved);
                              setEditingProject({ ...editingProject, blocks: updated });
                            }}
                            className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={bIdx === (editingProject.blocks || []).length - 1}
                            onClick={() => {
                              const updated = [...(editingProject.blocks || [])];
                              const [moved] = updated.splice(bIdx, 1);
                              if (moved) updated.splice(bIdx + 1, 0, moved);
                              setEditingProject({ ...editingProject, blocks: updated });
                            }}
                            className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProject.blocks || []).filter((_, idx) => idx !== bIdx);
                              setEditingProject({ ...editingProject, blocks: updated });
                            }}
                            className="p-1 text-red-400 hover:text-red-300 cursor-pointer ml-2"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Block Specific Form Fields */}
                      {block.type === "full_width_image" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2 flex items-center gap-2">
                            <input
                              type="text"
                              value={block.url}
                              placeholder="Image URL"
                              onChange={(e) => updateBlockItem(bIdx, { url: e.target.value })}
                              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white"
                            />
                            <label className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.1] px-3 py-1.5 text-xs font-bold text-white cursor-pointer transition-colors">
                              <Upload size={12} className="text-[#4385FF]" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileUpload(e, (url) => updateBlockItem(bIdx, { url }))
                                }
                                className="hidden"
                              />
                            </label>
                          </div>
                          <div>
                            <input
                              type="text"
                              value={block.caption || ""}
                              placeholder="Caption note"
                              onChange={(e) => updateBlockItem(bIdx, { caption: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={block.altText || ""}
                              placeholder="Alt text"
                              onChange={(e) => updateBlockItem(bIdx, { altText: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white"
                            />
                          </div>
                        </div>
                      )}

                      {block.type === "editorial_text" && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.heading}
                            placeholder="Heading"
                            onChange={(e) => updateBlockItem(bIdx, { heading: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 font-display font-bold text-white"
                          />
                          <textarea
                            rows={3}
                            value={block.body}
                            placeholder="Narrative content..."
                            onChange={(e) => updateBlockItem(bIdx, { body: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white"
                          />
                        </div>
                      )}

                      {block.type === "video" && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.url}
                            placeholder="Video URL (/videos/ads/...)"
                            onChange={(e) => updateBlockItem(bIdx, { url: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white"
                          />
                          <input
                            type="text"
                            value={block.caption || ""}
                            placeholder="Video caption note"
                            onChange={(e) => updateBlockItem(bIdx, { caption: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white"
                          />
                        </div>
                      )}

                      {block.type === "two_image_split" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              value={block.imageLeft.url}
                              placeholder="Left image URL"
                              onChange={(e) =>
                                updateBlockItem(bIdx, {
                                  imageLeft: { ...block.imageLeft, url: e.target.value },
                                })
                              }
                              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={block.imageRight.url}
                              placeholder="Right image URL"
                              onChange={(e) =>
                                updateBlockItem(bIdx, {
                                  imageRight: { ...block.imageRight, url: e.target.value },
                                })
                              }
                              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-4 shrink-0 bg-[#0A0B12]">
              <div className="flex items-center gap-2">
                <Link
                  href={`/our-work/${editingProject.slug}?preview=true`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <Eye size={13} className="text-[#4385FF]" />
                  <span>Preview Page</span>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="rounded-xl px-5 py-2 text-xs font-semibold text-neutral-400 hover:text-white cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveProject}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0043DB] shadow-[0_0_20px_rgba(0,82,255,0.4)] transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save size={14} />
                  <span>{isSaving ? "Saving..." : editingProject.isPublished ? "Publish Project" : "Save as Draft"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#0A0B12] p-6 shadow-2xl border border-white/10 text-center">
            <AlertCircle size={36} className="mx-auto text-red-400 mb-3" />
            <h4 className="font-display font-bold text-base text-white">Delete this project?</h4>
            <p className="text-xs text-neutral-400 mt-1">
              This will permanently remove the case study and its modular blocks from the database.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
