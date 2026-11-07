"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  ExternalLink,
  Globe,
  MapPin,
  Briefcase,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from "lucide-react";
import { adminSaveVacancyFn, adminDeleteVacancyFn } from "@/api/admin";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface CareersTabProps {
  vacancies: any[];
  setVacancies: React.Dispatch<React.SetStateAction<any[]>>;
  onNotice: (text: string, type?: "success" | "error") => void;
}

const DEPARTMENT_PRESETS = [
  "Media Buying",
  "Creative & Motion",
  "Design & UI/UX",
  "Copywriting",
  "Full-Stack Dev",
  "Operations",
];

const LOCATION_PRESETS = [
  { label: "100% Remote (Worldwide)", value: "100% Remote (Worldwide)", isRemote: true },
  { label: "Remote (EU / MENA / US)", value: "Remote (EU / MENA / US)", isRemote: true },
  { label: "Hybrid (Dubai / Remote)", value: "Dubai, UAE / Hybrid", isRemote: false },
  { label: "In-Studio (Dubai)", value: "Dubai, UAE / In-Studio", isRemote: false },
];

const EMPLOYMENT_PRESETS = [
  "Full-Time (Remote)",
  "Full-Time (Hybrid)",
  "Part-Time",
  "Contract / Project",
  "Freelance",
];

export function CareersTab({ vacancies, setVacancies, onNotice }: CareersTabProps) {
  const [editingVacancy, setEditingVacancy] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "remote" | "closed">("all");

  // Responsibilities & Requirements temporary multiline strings for easy editing
  const [respText, setRespText] = useState("");
  const [reqText, setReqText] = useState("");

  const handleOpenEdit = (v: any) => {
    setEditingVacancy({ ...v });
    setRespText(Array.isArray(v.responsibilities) ? v.responsibilities.join("\n") : "");
    setReqText(Array.isArray(v.requirements) ? v.requirements.join("\n") : "");
  };

  const handleOpenNew = () => {
    setEditingVacancy({
      slug: "",
      jobTitle: "",
      department: "Media Buying",
      location: "100% Remote (Worldwide)",
      isRemote: true,
      employmentType: "Full-Time (Remote)",
      experienceLevel: "Senior",
      salaryRange: "Competitive / Project-based",
      description: "",
      isOpen: true,
      isArchived: false,
    });
    setRespText(
      "Structure, manage and scale ad budgets with extreme autonomy\nAnalyze performance metrics and conversion funnels\nCollaborate directly with creative strategists and video editors",
    );
    setReqText(
      "Demonstrated track record with verifiable portfolio or case studies\nHigh speed, responsiveness, and clear English communication\nSelf-directed problem solver who takes extreme ownership of outcomes",
    );
  };

  const handleQuickToggleOpen = async (v: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...v, isOpen: !v.isOpen };
    try {
      await adminSaveVacancyFn({ data: updated });
      setVacancies((prev) => prev.map((item) => (item._id === v._id ? updated : item)));
      onNotice(
        updated.isOpen
          ? `Role "${v.jobTitle}" is now actively accepting applications.`
          : `Role "${v.jobTitle}" is now closed.`,
      );
    } catch (err: any) {
      onNotice(err?.message || "Failed to update vacancy status", "error");
    }
  };

  const handleSave = async () => {
    if (!editingVacancy) return;
    if (!editingVacancy.jobTitle || editingVacancy.jobTitle.trim().length === 0) {
      onNotice("Please enter a job title", "error");
      return;
    }

    setIsSaving(true);
    try {
      const responsibilities = respText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const requirements = reqText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        ...editingVacancy,
        responsibilities,
        requirements,
      };

      const res = await adminSaveVacancyFn({ data: payload });
      const savedDoc = { ...payload, _id: res.id || editingVacancy._id, slug: res.slug || editingVacancy.slug };

      if (!editingVacancy._id) {
        setVacancies((prev) => [...prev, savedDoc]);
      } else {
        setVacancies((prev) =>
          prev.map((v) => (v._id === editingVacancy._id ? savedDoc : v)),
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

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    try {
      await adminDeleteVacancyFn({ data: { id } });
      setVacancies((prev) => prev.filter((v) => v._id !== id));
      onNotice("Job vacancy removed.");
    } catch (err: any) {
      onNotice(err?.message || "Failed to delete vacancy", "error");
    }
  };

  // Filter vacancies
  const filtered = vacancies.filter((v) => {
    const isRemote =
      v.isRemote ||
      String(v.location || "").toLowerCase().includes("remote") ||
      String(v.location || "").toLowerCase().includes("worldwide");

    if (activeFilter === "active") return v.isOpen;
    if (activeFilter === "closed") return !v.isOpen;
    if (activeFilter === "remote") return isRemote;
    return true;
  });

  const activeCount = vacancies.filter((v) => v.isOpen).length;
  const remoteCount = vacancies.filter((v) =>
    v.isRemote ||
    String(v.location || "").toLowerCase().includes("remote") ||
    String(v.location || "").toLowerCase().includes("worldwide"),
  ).length;

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={!!deleteTargetId}
        title="Delete Job Posting?"
        description="Are you sure you want to delete this job posting? Candidates will no longer be able to apply for this specific role."
        confirmLabel="Yes, delete role"
        cancelLabel="Cancel"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#4385FF]">
              ORGANIZATION &amp; TALENT
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white mt-0.5">
            Talent &amp; Careers Postings
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Publish remote and studio positions. Incoming candidate portfolios and CVs land directly in your{" "}
            <strong className="text-white">Submissions Inbox</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/careers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <span>View Public Careers</span>
            <ExternalLink size={13} />
          </a>

          <button
            type="button"
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0052FF] px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(0,82,255,0.45)] hover:shadow-[0_0_28px_rgba(0,82,255,0.65)] transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Post New Vacancy</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-3">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            activeFilter === "all"
              ? "bg-[#0052FF] text-white shadow-[0_0_12px_rgba(0,82,255,0.4)]"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          All Postings ({vacancies.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("active")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            activeFilter === "active"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Active / Accepting ({activeCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("remote")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            activeFilter === "remote"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          100% Remote Friendly ({remoteCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("closed")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            activeFilter === "closed"
              ? "bg-white/15 text-white"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Closed Roles ({vacancies.length - activeCount})
        </button>
      </div>

      {/* VACANCIES LIST */}
      <div className="space-y-4">
        {filtered.map((v: any) => {
          const isRemote =
            v.isRemote ||
            String(v.location || "").toLowerCase().includes("remote") ||
            String(v.location || "").toLowerCase().includes("worldwide");

          return (
            <div
              key={v.slug || v._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-6 shadow-xl backdrop-blur-xl transition-all hover:border-white/20 gap-5"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status chip */}
                  <span
                    className={`rounded-md px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                      v.isOpen
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/5 text-neutral-400 border border-white/10"
                    }`}
                  >
                    {v.isOpen ? "ACCEPTING APPLICATIONS" : "CLOSED ROLE"}
                  </span>

                  {/* Remote badge */}
                  {isRemote && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#0052FF]/15 border border-[#0052FF]/30 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#60A5FA]">
                      <Globe size={10} />
                      <span>100% REMOTE</span>
                    </span>
                  )}

                  {v.department && (
                    <span className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-neutral-300">
                      {v.department}
                    </span>
                  )}

                  <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                    <MapPin size={11} className="text-neutral-500" />
                    <span>{v.location}</span>
                  </span>

                  {v.employmentType && (
                    <span className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                      <Briefcase size={11} className="text-neutral-500" />
                      <span>{v.employmentType}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-display text-lg font-bold text-white tracking-tight">
                  {v.jobTitle}
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                  {v.description || "No description provided."}
                </p>

                {v.salaryRange && (
                  <div className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1">
                    <DollarSign size={11} />
                    <span>Compensation: {v.salaryRange}</span>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {/* One-click open toggle */}
                <button
                  type="button"
                  onClick={(e) => handleQuickToggleOpen(v, e)}
                  title={v.isOpen ? "Click to Close Role" : "Click to Re-open Role"}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    v.isOpen
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      : "border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {v.isOpen ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  <span>{v.isOpen ? "Active" : "Closed"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(v)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Edit Vacancy"
                >
                  <Edit2 size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTargetId(v._id)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                  title="Delete Vacancy"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-12 text-center text-neutral-400">
            <Briefcase size={32} className="mx-auto text-neutral-500 mb-3" />
            <p className="text-sm font-semibold text-white">No roles match this filter.</p>
            <p className="text-xs text-neutral-500 mt-1">
              Click &quot;Post New Vacancy&quot; to publish your next opening.
            </p>
          </div>
        )}
      </div>

      {/* EDIT / CREATE MODAL */}
      {editingVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF]">
                  TALENT &amp; HIRING
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  {editingVacancy._id ? "Edit Job Vacancy" : "Create New Job Vacancy"}
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
              {/* Job Title */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingVacancy.jobTitle || ""}
                  onChange={(e) =>
                    setEditingVacancy({ ...editingVacancy, jobTitle: e.target.value })
                  }
                  placeholder="e.g. Senior Remote Performance Marketer (Meta & Google)"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={editingVacancy.department || ""}
                  onChange={(e) =>
                    setEditingVacancy({ ...editingVacancy, department: e.target.value })
                  }
                  placeholder="e.g. Media Buying"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {DEPARTMENT_PRESETS.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setEditingVacancy({ ...editingVacancy, department: dept })}
                      className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                        editingVacancy.department === dept
                          ? "bg-[#0052FF] text-white"
                          : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location & Remote Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-neutral-300">
                    Location &amp; Workplace Type *
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingVacancy.isRemote)}
                      onChange={(e) =>
                        setEditingVacancy({ ...editingVacancy, isRemote: e.target.checked })
                      }
                      className="rounded border-white/20 bg-white/5 text-[#0052FF]"
                    />
                    <span className="text-[11px] text-cyan-300 font-medium">Tag as 100% Remote</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={editingVacancy.location || ""}
                  onChange={(e) =>
                    setEditingVacancy({ ...editingVacancy, location: e.target.value })
                  }
                  placeholder="e.g. 100% Remote (Worldwide) or Dubai, UAE / Hybrid"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {LOCATION_PRESETS.map((loc) => (
                    <button
                      key={loc.label}
                      type="button"
                      onClick={() =>
                        setEditingVacancy({
                          ...editingVacancy,
                          location: loc.value,
                          isRemote: loc.isRemote,
                        })
                      }
                      className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                        editingVacancy.location === loc.value
                          ? "bg-cyan-500/25 border border-cyan-500/40 text-cyan-200"
                          : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Employment Type & Compensation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1.5">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    value={editingVacancy.employmentType || ""}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, employmentType: e.target.value })
                    }
                    placeholder="Full-Time (Remote)"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none mb-2"
                  />
                  <div className="flex flex-wrap gap-1">
                    {EMPLOYMENT_PRESETS.map((emp) => (
                      <button
                        key={emp}
                        type="button"
                        onClick={() => setEditingVacancy({ ...editingVacancy, employmentType: emp })}
                        className={`rounded px-1.5 py-0.5 text-[9.5px] transition-all ${
                          editingVacancy.employmentType === emp
                            ? "bg-white/20 text-white"
                            : "bg-white/5 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {emp}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1.5">
                    Compensation / Salary Range (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingVacancy.salaryRange || ""}
                    onChange={(e) =>
                      setEditingVacancy({ ...editingVacancy, salaryRange: e.target.value })
                    }
                    placeholder="e.g. $4,000 – $6,500 / mo or Competitive"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Displayed transparently on the public careers listing.
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">
                  Role Overview / Description *
                </label>
                <textarea
                  rows={3}
                  value={editingVacancy.description || ""}
                  onChange={(e) =>
                    setEditingVacancy({ ...editingVacancy, description: e.target.value })
                  }
                  placeholder="Summary of why this role exists and the core mission..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Core Responsibilities */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Core Responsibilities (One per line)
                </label>
                <textarea
                  rows={3}
                  value={respText}
                  onChange={(e) => setRespText(e.target.value)}
                  placeholder="Lead campaign builds&#10;Optimize conversion rates&#10;Report weekly commercial KPIs"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none font-mono text-[11px] leading-relaxed"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  What We&apos;re Looking For / Requirements (One per line)
                </label>
                <textarea
                  rows={3}
                  value={reqText}
                  onChange={(e) => setReqText(e.target.value)}
                  placeholder="3+ years scaling DTC brands&#10;Strong mathematical and copywriting instincts&#10;Remote-first autonomy and speed"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-[#0052FF] focus:outline-none font-mono text-[11px] leading-relaxed"
                />
              </div>

              {/* Active Toggle */}
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
                  Actively Accepting Applications (Visible on public careers page)
                </label>
              </div>
            </div>

            {/* MODAL FOOTER */}
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
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0052FF] px-6 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(0,82,255,0.45)] hover:shadow-[0_0_28px_rgba(0,82,255,0.65)] disabled:opacity-50 cursor-pointer"
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
