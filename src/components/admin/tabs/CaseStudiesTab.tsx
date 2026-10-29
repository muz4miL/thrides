"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, X, Check } from "lucide-react";
import { adminSaveCaseStudyFn, adminDeleteCaseStudyFn } from "@/api/admin";

interface CaseStudiesTabProps {
  caseStudies: any[];
  setCaseStudies: React.Dispatch<React.SetStateAction<any[]>>;
  onNotice: (text: string, type?: "success" | "error") => void;
}

export function CaseStudiesTab({ caseStudies, setCaseStudies, onNotice }: CaseStudiesTabProps) {
  const [editingCaseStudy, setEditingCaseStudy] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editingCaseStudy) return;
    setIsSaving(true);
    try {
      const res = await adminSaveCaseStudyFn({ data: editingCaseStudy });
      if (!editingCaseStudy._id) {
        setCaseStudies((prev) => [...prev, { ...editingCaseStudy, _id: res.id }]);
      } else {
        setCaseStudies((prev) =>
          prev.map((c) => (c._id === editingCaseStudy._id ? editingCaseStudy : c)),
        );
      }
      setEditingCaseStudy(null);
      onNotice("Case study saved successfully.");
    } catch (err: any) {
      onNotice(err?.message || "Failed to save case study", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    try {
      await adminDeleteCaseStudyFn({ data: { id } });
      setCaseStudies((prev) => prev.filter((c) => c._id !== id));
      onNotice("Case study removed.");
    } catch (err: any) {
      onNotice(err?.message || "Failed to delete case study", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Transformation Case Studies
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Break down commercial turnarounds, performance metrics, and tactical strategies.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditingCaseStudy({
              slug: "",
              client: "",
              industry: "Real Estate",
              title: "",
              challenge: "",
              strategy: "",
              results: [{ metric: "+140%", label: "Revenue Growth" }],
              isPublished: true,
            })
          }
          className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#0043DB] shadow-[0_0_20px_rgba(0,82,255,0.4)] transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Create Case Study</span>
        </button>
      </div>

      <div className="space-y-4">
        {caseStudies.map((cs: any) => (
          <div
            key={cs.slug || cs._id}
            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-6 shadow-xl backdrop-blur-xl transition-all hover:border-white/20 gap-5"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-md bg-[#0052FF]/15 border border-[#0052FF]/30 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#4385FF]">
                  {cs.industry || "General"}
                </span>
                <span className="text-xs font-semibold text-neutral-300">
                  Client: <strong className="text-white font-medium">{cs.client}</strong>
                </span>
                <span className="font-mono text-[11px] text-neutral-500">
                  /case-studies/{cs.slug}
                </span>
              </div>

              <h3 className="mt-2.5 font-display text-lg font-bold text-white tracking-tight">
                {cs.title}
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {cs.results?.map((r: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-neutral-200"
                  >
                    <strong className="text-[#4385FF] font-bold">{r.metric}</strong>
                    <span className="text-neutral-400">{r.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/case-studies/${cs.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="Preview Public Case Study"
              >
                <Eye size={15} />
              </a>
              <button
                type="button"
                onClick={() => setEditingCaseStudy(cs)}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="Edit Case Study"
              >
                <Edit2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(cs._id)}
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                title="Delete Case Study"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-7 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF]">
                  CASE STUDY CMS
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  {editingCaseStudy._id ? "Edit Case Study" : "New Case Study"}
                </h3>
              </div>
              <button
                onClick={() => setEditingCaseStudy(null)}
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
                    value={editingCaseStudy.client || ""}
                    onChange={(e) =>
                      setEditingCaseStudy({ ...editingCaseStudy, client: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1.5">Industry</label>
                  <input
                    type="text"
                    value={editingCaseStudy.industry || ""}
                    onChange={(e) =>
                      setEditingCaseStudy({ ...editingCaseStudy, industry: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">Title</label>
                <input
                  type="text"
                  value={editingCaseStudy.title || ""}
                  onChange={(e) =>
                    setEditingCaseStudy({ ...editingCaseStudy, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">URL Slug</label>
                <input
                  type="text"
                  value={editingCaseStudy.slug || ""}
                  onChange={(e) =>
                    setEditingCaseStudy({ ...editingCaseStudy, slug: e.target.value })
                  }
                  placeholder="e.g. fam-properties"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setEditingCaseStudy(null)}
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
                <span>{isSaving ? "Saving..." : "Save Case Study"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
