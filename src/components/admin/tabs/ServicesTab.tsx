"use client";

import { useState } from "react";
import { Edit2, Sparkles, X, Check } from "lucide-react";
import { adminSaveServiceFn } from "@/api/admin";

interface ServicesTabProps {
  services: any[];
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  onNotice: (text: string, type?: "success" | "error") => void;
}

export function ServicesTab({ services, setServices, onNotice }: ServicesTabProps) {
  const [editingService, setEditingService] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editingService) return;
    setIsSaving(true);
    try {
      await adminSaveServiceFn({ data: editingService });
      setServices((prev) =>
        prev.map((s) => (s._id === editingService._id ? editingService : s)),
      );
      setEditingService(null);
      onNotice("Service updated successfully.");
    } catch (err: any) {
      onNotice(err?.message || "Failed to save service", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Core Agency Services
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Configure pillars, visible tags, publish statuses, and client descriptions.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1 text-xs font-mono font-medium text-neutral-300">
          <span>Active Services:</span>
          <strong className="text-white">{services.length}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((srv: any) => (
          <div
            key={srv.slug}
            className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-6 shadow-xl backdrop-blur-xl transition-all hover:border-white/20"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF]">
                  STAGE 0{srv.order || 1}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                    srv.isPublished
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-white/5 text-neutral-400 border border-white/10"
                  }`}
                >
                  {srv.isPublished ? "PUBLISHED" : "DRAFT"}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white tracking-tight">
                {srv.title}
              </h3>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed line-clamp-3">
                {srv.body || srv.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {srv.visibleTags?.map((tag: string, tIdx: number) => (
                  <span
                    key={tIdx}
                    className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">Order: {srv.order}</span>
              <button
                onClick={() => setEditingService(srv)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
              >
                <Edit2 size={12} className="text-[#4385FF]" />
                <span>Edit Service</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-7 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF]">
                  EDIT SERVICE
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  {editingService.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="rounded-full p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">Service Title</label>
                <input
                  type="text"
                  value={editingService.title || ""}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={editingService.body || editingService.description || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, body: e.target.value, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">
                  Visible Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editingService.visibleTags?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      visibleTags: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="srvPublish"
                  checked={Boolean(editingService.isPublished)}
                  onChange={(e) =>
                    setEditingService({ ...editingService, isPublished: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#0052FF] focus:ring-[#0052FF]"
                />
                <label htmlFor="srvPublish" className="font-semibold text-white cursor-pointer select-none">
                  Published on Public Website
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="rounded-xl border border-white/10 px-5 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-6 py-2 text-xs font-bold text-white hover:bg-[#0043DB] shadow-[0_0_20px_rgba(0,82,255,0.4)] disabled:opacity-50 cursor-pointer"
              >
                <Check size={14} />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
