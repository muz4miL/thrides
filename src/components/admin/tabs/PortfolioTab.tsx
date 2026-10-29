"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon } from "lucide-react";
import { adminSavePortfolioFn, adminDeletePortfolioFn } from "@/api/admin";

interface PortfolioTabProps {
  portfolio: any[];
  setPortfolio: React.Dispatch<React.SetStateAction<any[]>>;
  onNotice: (text: string, type?: "success" | "error") => void;
}

export function PortfolioTab({ portfolio, setPortfolio, onNotice }: PortfolioTabProps) {
  const [editingPortfolio, setEditingPortfolio] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editingPortfolio) return;
    setIsSaving(true);
    try {
      const res = await adminSavePortfolioFn({ data: editingPortfolio });
      if (!editingPortfolio._id) {
        setPortfolio((prev) => [...prev, { ...editingPortfolio, _id: res.id }]);
      } else {
        setPortfolio((prev) =>
          prev.map((p) => (p._id === editingPortfolio._id ? editingPortfolio : p)),
        );
      }
      setEditingPortfolio(null);
      onNotice("Portfolio project saved successfully.");
    } catch (err: any) {
      onNotice(err?.message || "Failed to save portfolio project", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio project?")) return;
    try {
      await adminDeletePortfolioFn({ data: { id } });
      setPortfolio((prev) => prev.filter((p) => p._id !== id));
      onNotice("Portfolio project deleted.");
    } catch (err: any) {
      onNotice(err?.message || "Failed to delete project", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Legacy Portfolio Projects
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage showcase entries, client outcomes, 16:9 imagery, and categorical tags.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditingPortfolio({
              slug: "",
              client: "",
              category: "Branding",
              title: "",
              outcome: "",
              mediaType: "image",
              order: portfolio.length + 1,
              isPublished: true,
            })
          }
          className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#0043DB] shadow-[0_0_20px_rgba(0,82,255,0.4)] transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item: any) => (
          <div
            key={item.slug || item._id}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 shadow-xl backdrop-blur-xl transition-all hover:border-white/20"
          >
            <div>
              <div className="aspect-[16/9] w-full bg-neutral-900/60 overflow-hidden relative">
                {item.mediaSrc || item.mediaUrl ? (
                  <img
                    src={item.mediaSrc || item.mediaUrl}
                    alt={item.title || "Project preview"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-xs text-neutral-500 gap-1.5">
                    <ImageIcon size={20} className="text-neutral-600" />
                    <span>16:9 Showcase Frame</span>
                  </div>
                )}
                <span className="absolute top-3 left-3 rounded-md bg-black/80 border border-white/10 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  {item.category || item.categories?.[0] || "Showcase"}
                </span>
              </div>

              <div className="p-5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF]">
                  {item.client || item.title}
                </div>
                <h3 className="mt-1 font-display text-base font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  <span className="font-semibold text-neutral-300">Outcome: </span>
                  {item.outcome || item.outcomeLine}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-white/[0.06] mt-4">
              <span className="font-mono text-[10px] text-neutral-500">Order: {item.order || 1}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPortfolio(item)}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-7 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF]">
                  PORTFOLIO CMS
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  {editingPortfolio._id ? "Edit Portfolio Item" : "New Portfolio Project"}
                </h3>
              </div>
              <button
                onClick={() => setEditingPortfolio(null)}
                className="rounded-full p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1.5">Client Name</label>
                  <input
                    type="text"
                    value={editingPortfolio.client || ""}
                    onChange={(e) =>
                      setEditingPortfolio({ ...editingPortfolio, client: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1.5">Category</label>
                  <select
                    value={editingPortfolio.category || "Branding"}
                    onChange={(e) =>
                      setEditingPortfolio({ ...editingPortfolio, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0E0F18] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                  >
                    <option value="Branding">Branding</option>
                    <option value="Video & Media">Video & Media</option>
                    <option value="Paid Ads">Paid Ads</option>
                    <option value="Web & Stores">Web & Stores</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Strategy">Strategy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">Project Title</label>
                <input
                  type="text"
                  value={editingPortfolio.title || ""}
                  onChange={(e) =>
                    setEditingPortfolio({ ...editingPortfolio, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">
                  Outcome Line (Key Commercial Result)
                </label>
                <textarea
                  rows={2}
                  value={editingPortfolio.outcome || editingPortfolio.outcomeLine || ""}
                  onChange={(e) =>
                    setEditingPortfolio({
                      ...editingPortfolio,
                      outcome: e.target.value,
                      outcomeLine: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">Media Image URL</label>
                <input
                  type="text"
                  value={editingPortfolio.mediaSrc || editingPortfolio.mediaUrl || ""}
                  onChange={(e) =>
                    setEditingPortfolio({
                      ...editingPortfolio,
                      mediaSrc: e.target.value,
                      mediaUrl: e.target.value,
                    })
                  }
                  placeholder="/assets/... or https://..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setEditingPortfolio(null)}
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
                <span>{isSaving ? "Saving..." : "Save Project"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
