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
        // Refresh local state with copy
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

    // Validate required fields
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

    // Publication check
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
        // Update local list
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
    <div className="space-y-8">
      {/* Top Controls & Navigation Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/15 bg-blue-50 px-3 py-0.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <Sparkles size={12} />
            <span>EXHIBITION MANAGEMENT</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#09090B]">
            Our Work & Case Studies CMS
          </h2>
          <p className="text-xs text-[#52525B]">
            Curate published portfolio projects, modular case studies, and exhibition settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab("projects")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              subTab === "projects"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-[#52525B] border border-black/10 hover:border-black/25 hover:text-black"
            }`}
          >
            <span>Projects Catalogue ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("settings")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              subTab === "settings"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-[#52525B] border border-black/10 hover:border-black/25 hover:text-black"
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
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition-colors shadow-xs ml-2 cursor-pointer"
            >
              <Plus size={14} />
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
                className="w-full rounded-full border border-black/10 bg-white py-2 pl-4 pr-10 text-xs text-[#09090B] focus:border-black focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-black"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-black text-white"
                      : "bg-white text-neutral-600 border border-black/10 hover:bg-neutral-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project List */}
          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white p-12 text-center">
              <Layers size={32} className="mx-auto text-neutral-400 mb-3" />
              <h3 className="font-display font-bold text-base text-[#09090B]">No projects found</h3>
              <p className="text-xs text-[#52525B] mt-1">
                {searchQuery ? "Try clearing your search query." : "Click 'New Project' to create your first case study."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.slug}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4 transition-all hover:border-black/20 hover:shadow-xs"
                >
                  {/* Left: Reorder controls + Thumbnail + Details */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex flex-col gap-1 text-neutral-400">
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, "up")}
                        disabled={idx === 0}
                        className="hover:text-black disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, "down")}
                        disabled={idx === projects.length - 1}
                        className="hover:text-black disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-neutral-100">
                      <img
                        src={project.thumbnailUrl || project.heroMediaUrl}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                      {project.mediaType === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                          <Film size={14} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#0052FF]">
                          {project.clientName}
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="font-mono text-[11px] text-neutral-400">{project.year}</span>
                        {project.isPublished ? (
                          <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 text-[10px] font-bold">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.2 text-[10px] font-bold">
                            Draft
                          </span>
                        )}
                        {project.isFeatured && (
                          <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.2 text-[10px] font-bold inline-flex items-center gap-1">
                            <Star size={10} className="fill-current" />
                            Featured
                          </span>
                        )}
                        {project.isConceptWork && (
                          <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.2 text-[10px] font-bold">
                            Concept
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-[15px] text-[#09090B] truncate mt-0.5">
                        {project.title}
                      </h3>

                      <span className="font-mono text-[11px] text-neutral-400 block truncate">
                        /our-work/{project.slug} • {project.industry} • {project.blocks?.length || 0} blocks
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(project)}
                      className={`rounded-full p-2 text-xs transition-colors cursor-pointer ${
                        project.isFeatured
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-neutral-400 hover:text-black border border-black/10"
                      }`}
                      title={project.isFeatured ? "Unfeature" : "Feature on Signature Stage"}
                    >
                      <Star size={14} className={project.isFeatured ? "fill-current" : ""} />
                    </button>

                    <Link
                      href={`/our-work/${project.slug}?preview=true`}
                      target="_blank"
                      className="rounded-full border border-black/10 p-2 text-neutral-600 hover:text-black hover:border-black/30 transition-colors"
                      title="Preview Case Study"
                    >
                      <Eye size={14} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(project.slug)}
                      className="rounded-full border border-black/10 p-2 text-neutral-600 hover:text-black hover:border-black/30 transition-colors cursor-pointer"
                      title="Duplicate as Draft"
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingProject({ ...project })}
                      className="inline-flex items-center gap-1 rounded-full bg-black px-3.5 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(String(project._id || project.slug))}
                      className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
        <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 space-y-8 max-w-4xl">
          <div>
            <h3 className="font-display font-bold text-lg text-[#09090B]">Hero Presentation</h3>
            <p className="text-xs text-[#52525B]">Customize the typography and dominant media of /our-work</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={settings.heroEyebrow}
                onChange={(e) => setSettings({ ...settings, heroEyebrow: e.target.value })}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                Heading Line 1 (Bold Sans)
              </label>
              <input
                type="text"
                value={settings.heroHeadingLine1}
                onChange={(e) => setSettings({ ...settings, heroHeadingLine1: e.target.value })}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                Heading Line 2 (Italic Serif)
              </label>
              <input
                type="text"
                value={settings.heroHeadingLine2}
                onChange={(e) => setSettings({ ...settings, heroHeadingLine2: e.target.value })}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                Supporting Copy
              </label>
              <textarea
                rows={3}
                value={settings.heroSupportingCopy}
                onChange={(e) => setSettings({ ...settings, heroSupportingCopy: e.target.value })}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                Hero Media URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.heroMediaUrl}
                  onChange={(e) => setSettings({ ...settings, heroMediaUrl: e.target.value })}
                  className="flex-1 rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
                />
                <label className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-200 cursor-pointer">
                  <Upload size={13} />
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
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                Hero Project Annotation
              </label>
              <input
                type="text"
                value={settings.heroProjectAnnotation}
                onChange={(e) => setSettings({ ...settings, heroProjectAnnotation: e.target.value })}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                Motion Preset
              </label>
              <select
                value={settings.motionPreset}
                onChange={(e) =>
                  setSettings({ ...settings, motionPreset: e.target.value as "subtle" | "standard" | "reduced" })
                }
                className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden bg-white"
              >
                <option value="standard">Standard (Full Cinematic Pinning)</option>
                <option value="subtle">Subtle (Restrained Transition)</option>
                <option value="reduced">Reduced (Static Presentation)</option>
              </select>
            </div>
          </div>

          {/* Closing Invitation CTA */}
          <div className="pt-6 border-t border-black/10 space-y-4">
            <div>
              <h4 className="font-display font-bold text-base text-[#09090B]">Closing Invitation CTA</h4>
              <p className="text-xs text-[#52525B]">Configurable call-to-action at the bottom of the work page</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                  CTA Line 1
                </label>
                <input
                  type="text"
                  value={settings.closingCtaHeadingLine1}
                  onChange={(e) => setSettings({ ...settings, closingCtaHeadingLine1: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                  CTA Line 2
                </label>
                <input
                  type="text"
                  value={settings.closingCtaHeadingLine2}
                  onChange={(e) => setSettings({ ...settings, closingCtaHeadingLine2: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                  Supporting Paragraph
                </label>
                <textarea
                  rows={2}
                  value={settings.closingCtaCopy}
                  onChange={(e) => setSettings({ ...settings, closingCtaCopy: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={settings.closingCtaButtonText}
                  onChange={(e) => setSettings({ ...settings, closingCtaButtonText: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                  Button Destination
                </label>
                <input
                  type="text"
                  value={settings.closingCtaDestination}
                  onChange={(e) => setSettings({ ...settings, closingCtaDestination: e.target.value })}
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="pt-6 border-t border-black/10 space-y-4">
            <div>
              <h4 className="font-display font-bold text-base text-[#09090B]">SEO & Meta</h4>
              <p className="text-xs text-[#52525B]">Search engine indexing and social preview cards</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={settings.seo?.title || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, seo: { ...settings.seo, title: e.target.value } })
                  }
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={settings.seo?.description || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, seo: { ...settings.seo, description: e.target.value } })
                  }
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs focus:border-black focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-black/10 flex justify-end">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveSettings}
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-black/10 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0052FF]">
                  {editingProject._id ? "EDIT CASE STUDY" : "CREATE NEW PROJECT"}
                </span>
                <h3 className="font-display font-bold text-xl text-[#09090B]">
                  {editingProject.title || "Untitled Project"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="rounded-full border border-black/10 p-2 text-neutral-500 hover:text-black cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 text-xs">
              {/* Publication Status & Concept toggles */}
              <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-neutral-50 p-4 border border-black/5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.isPublished)}
                    onChange={(e) => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                    className="rounded border-black/20 text-[#0052FF] focus:ring-0"
                  />
                  <span className="font-bold text-[#09090B]">Published on Live Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.isFeatured)}
                    onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                    className="rounded border-black/20 text-[#0052FF] focus:ring-0"
                  />
                  <span className="font-bold text-[#09090B]">Feature on Signature Stage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.isConceptWork)}
                    onChange={(e) => setEditingProject({ ...editingProject, isConceptWork: e.target.checked })}
                    className="rounded border-black/20 text-[#0052FF] focus:ring-0"
                  />
                  <span className="font-bold text-[#09090B]">Mark as Concept Work</span>
                </label>
              </div>

              {/* Core Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={editingProject.clientName || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                    className="w-full rounded-xl border border-black/10 px-3.5 py-2 focus:border-black focus:outline-hidden"
                    placeholder="e.g. Apex Strategic Advisory"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
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
                    className="w-full rounded-xl border border-black/10 px-3.5 py-2 font-mono focus:border-black focus:outline-hidden"
                    placeholder="e.g. apex-advisory"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                    Case Study Title *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full rounded-xl border border-black/10 px-3.5 py-2 font-display font-semibold focus:border-black focus:outline-hidden"
                    placeholder="e.g. Apex Strategic Advisory: Corporate Positioning & Digital Platform"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={editingProject.industry || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, industry: e.target.value })}
                    className="w-full rounded-xl border border-black/10 px-3.5 py-2 focus:border-black focus:outline-hidden"
                    placeholder="e.g. Management Consultancy"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                    Year / Timeline
                  </label>
                  <input
                    type="text"
                    value={editingProject.year || "2026"}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full rounded-xl border border-black/10 px-3.5 py-2 focus:border-black focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                    Positioning Statement / Summary *
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.summary || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                    className="w-full rounded-xl border border-black/10 px-3.5 py-2 focus:border-black focus:outline-hidden"
                    placeholder="Concise executive narrative of what Thrides engineered and delivered..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
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
                          className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                            isChecked
                              ? "bg-black text-white"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
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
              <div className="pt-4 border-t border-black/10 space-y-4">
                <h4 className="font-display font-bold text-sm text-[#09090B]">Hero & Thumbnail Media</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                      Thumbnail URL (Catalogue & Grid)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingProject.thumbnailUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, thumbnailUrl: e.target.value })}
                        className="flex-1 rounded-xl border border-black/10 px-3.5 py-2 focus:border-black focus:outline-hidden"
                      />
                      <label className="inline-flex items-center gap-1 rounded-xl border border-black/15 bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-200 cursor-pointer">
                        <Upload size={12} />
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
                    <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                      Hero Media URL (Dominant Banner)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingProject.heroMediaUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, heroMediaUrl: e.target.value })}
                        className="flex-1 rounded-xl border border-black/10 px-3.5 py-2 focus:border-black focus:outline-hidden"
                      />
                      <label className="inline-flex items-center gap-1 rounded-xl border border-black/15 bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-200 cursor-pointer">
                        <Upload size={12} />
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
              <div className="pt-4 border-t border-black/10 space-y-4">
                <h4 className="font-display font-bold text-sm text-[#09090B]">Narrative Structure</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                      The Challenge (Friction Point)
                    </label>
                    <textarea
                      rows={4}
                      value={editingProject.challenge || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-2 focus:border-black focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase text-neutral-600 block mb-1">
                      Our Approach (The Solution)
                    </label>
                    <textarea
                      rows={4}
                      value={editingProject.approach || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, approach: e.target.value })}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-2 focus:border-black focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Verified Results Builder */}
              <div className="pt-4 border-t border-black/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-[#09090B]">Verified Outcomes / Metrics</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = editingProject.results || [];
                      setEditingProject({
                        ...editingProject,
                        results: [...cur, { metric: "+50%", label: "Metric Label", context: "Context note" }],
                      });
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 font-bold text-neutral-700 hover:bg-neutral-200 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingProject.results?.map((res, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Metric (+184%)"
                        value={res.metric}
                        onChange={(e) => updateResultItem(i, "metric", e.target.value)}
                        className="w-32 rounded-lg border border-black/10 px-2.5 py-1.5 font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Label (Qualified Pipeline)"
                        value={res.label}
                        onChange={(e) => updateResultItem(i, "label", e.target.value)}
                        className="flex-1 rounded-lg border border-black/10 px-2.5 py-1.5"
                      />
                      <input
                        type="text"
                        placeholder="Context (Compared to last year)"
                        value={res.context || ""}
                        onChange={(e) => updateResultItem(i, "context", e.target.value)}
                        className="flex-1 rounded-lg border border-black/10 px-2.5 py-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingProject.results || []).filter((_, idx) => idx !== i);
                          setEditingProject({ ...editingProject, results: updated });
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modular Blocks Builder */}
              <div className="pt-4 border-t border-black/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#09090B]">Modular Content Blocks</h4>
                    <p className="text-[11px] text-[#52525B]">Full-width images, split layouts, video reels, and editorial highlights</p>
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
                      className="rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-bold text-[#09090B] cursor-pointer"
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
                      className="rounded-xl border border-black/10 bg-neutral-50 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-black/5 pb-2">
                        <span className="font-mono text-[10px] font-bold uppercase text-[#0052FF]">
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
                            className="p-1 hover:text-black disabled:opacity-20 cursor-pointer"
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
                            className="p-1 hover:text-black disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProject.blocks || []).filter((_, idx) => idx !== bIdx);
                              setEditingProject({ ...editingProject, blocks: updated });
                            }}
                            className="p-1 text-red-500 hover:text-red-700 cursor-pointer ml-2"
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
                              className="flex-1 rounded-lg border border-black/10 px-3 py-1.5 bg-white"
                            />
                            <label className="inline-flex items-center gap-1 rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer">
                              <Upload size={12} />
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
                              className="w-full rounded-lg border border-black/10 px-3 py-1.5 bg-white"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={block.altText || ""}
                              placeholder="Alt text"
                              onChange={(e) => updateBlockItem(bIdx, { altText: e.target.value })}
                              className="w-full rounded-lg border border-black/10 px-3 py-1.5 bg-white"
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
                            className="w-full rounded-lg border border-black/10 px-3 py-1.5 font-bold bg-white"
                          />
                          <textarea
                            rows={3}
                            value={block.body}
                            placeholder="Narrative content..."
                            onChange={(e) => updateBlockItem(bIdx, { body: e.target.value })}
                            className="w-full rounded-lg border border-black/10 px-3 py-1.5 bg-white"
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
                            className="w-full rounded-lg border border-black/10 px-3 py-1.5 bg-white"
                          />
                          <input
                            type="text"
                            value={block.caption || ""}
                            placeholder="Video caption note"
                            onChange={(e) => updateBlockItem(bIdx, { caption: e.target.value })}
                            className="w-full rounded-lg border border-black/10 px-3 py-1.5 bg-white"
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
                              className="w-full rounded-lg border border-black/10 px-3 py-1.5 bg-white"
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
                              className="w-full rounded-lg border border-black/10 px-3 py-1.5 bg-white"
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
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/our-work/${editingProject.slug}?preview=true`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  <Eye size={13} />
                  <span>Preview Page</span>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="rounded-full px-5 py-2 text-xs font-semibold text-neutral-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveProject}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-black/10 text-center">
            <AlertCircle size={36} className="mx-auto text-red-600 mb-3" />
            <h4 className="font-display font-bold text-base text-[#09090B]">Delete this project?</h4>
            <p className="text-xs text-[#52525B] mt-1">
              This will permanently remove the case study and its modular blocks from the database.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
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
