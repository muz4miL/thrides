"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { adminSaveVacancyFn, adminDeleteVacancyFn } from "@/api/admin";

interface CareersTabProps {
  vacancies: any[];
  setVacancies: React.Dispatch<React.SetStateAction<any[]>>;
  onNotice: (text: string, type?: "success" | "error") => void;
}

export function CareersTab({ vacancies, setVacancies, onNotice }: CareersTabProps) {
  const [editingVacancy, setEditingVacancy] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editingVacancy) return;
    setIsSaving(true);
    try {
      const res = await adminSaveVacancyFn({ data: editingVacancy });
      if (!editingVacancy._id) {
        setVacancies((prev) => [...prev, { ...editingVacancy, _id: res.id }]);
      } else {
        setVacancies((prev) =>
          prev.map((v) => (v._id === editingVacancy._id ? editingVacancy : v)),
        );
      }
      setEditingVacancy(null);
      onNotice("Job vacancy saved successfully.");
    } catch (err: any) {
      onNotice(err?.message || "Failed to save vacancy", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await adminDeleteVacancyFn({ data: { id } });
      setVacancies((prev) => prev.filter((v) => v._id !== id));
      onNotice("Job vacancy removed.");
    } catch (err: any) {
      onNotice(err?.message || "Failed to delete vacancy", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Talent & Careers Postings
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Open, manage, or close active roles. Candidate submissions arrive in your Inbox tab.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditingVacancy({
              slug: "",
              jobTitle: "",
              department: "Media Buying",
              location: "Dubai, UAE / Hybrid",
              type: "Full-time",
              description: "",
              isOpen: true,
              isArchived: false,
            })
          }
          className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#0043DB] shadow-[0_0_20px_rgba(0,82,255,0.4)] transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Post New Vacancy</span>
        </button>
      </div>

      <div className="space-y-4">
        {vacancies.map((v: any) => (
          <div
            key={v.slug || v._id}
            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-6 shadow-xl backdrop-blur-xl transition-all hover:border-white/20 gap-5"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`rounded-md px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                    v.isOpen
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-white/5 text-neutral-400 border border-white/10"
                  }`}
                >
                  {v.isOpen ? "ACCEPTING APPLICATIONS" : "CLOSED ROLE"}
                </span>
                <span className="text-xs font-semibold text-neutral-400">
                  {v.department} • {v.location}
                </span>
              </div>

              <h3 className="mt-2.5 font-display text-lg font-bold text-white tracking-tight">
                {v.jobTitle}
              </h3>
              <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed line-clamp-2 max-w-2xl">
                {v.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditingVacancy(v)}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="Edit Vacancy"
              >
                <Edit2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(v._id)}
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                title="Delete Vacancy"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-7 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF]">
                  TALENT &amp; HIRING
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  {editingVacancy._id ? "Edit Vacancy" : "Create New Vacancy"}
                </h3>
              </div>
              <button
                onClick={() => setEditingVacancy(null)}
                className="rounded-full p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={editingVacancy.jobTitle || ""}
                  onChange={(e) =>
                    setEditingVacancy({ ...editingVacancy, jobTitle: e.target.value })
                  }
                  placeholder="e.g. Senior Performance Marketer"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1.5">Department</label>
                  <input
                    type="text"
                    value={editingVacancy.department || ""}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, department: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={editingVacancy.location || ""}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, location: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={editingVacancy.description || ""}
                  onChange={(e) =>
                    setEditingVacancy({ ...editingVacancy, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="vacOpen"
                  checked={Boolean(editingVacancy.isOpen)}
                  onChange={(e) =>
                    setEditingVacancy({ ...editingVacancy, isOpen: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#0052FF] focus:ring-[#0052FF]"
                />
                <label htmlFor="vacOpen" className="font-semibold text-white cursor-pointer select-none">
                  Actively Accepting Applications
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setEditingVacancy(null)}
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
                <span>{isSaving ? "Saving..." : "Save Vacancy"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
