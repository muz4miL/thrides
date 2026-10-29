"use client";

import { useState, useEffect } from "react";
import {
  Download,
  ExternalLink,
  Search,
  Filter,
  Eye,
  Trash2,
  X,
  Check,
  Save,
  MessageSquare,
  Building,
  User,
  Clock,
  Sparkles,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Globe,
} from "lucide-react";
import { adminUpdateSubmissionNotesFn, adminDeleteSubmissionFn } from "@/api/admin";

interface SubmissionsTabProps {
  submissions: any[];
  onUpdateStatus: (id: string, status: any) => Promise<void>;
  onDownloadCv: (cvStorageKey: string, candidateName: string) => Promise<void>;
  onNotice?: (text: string, type?: "success" | "error") => void;
  onRefresh?: () => Promise<void>;
}

export function SubmissionsTab({
  submissions: initialSubmissions,
  onUpdateStatus,
  onDownloadCv,
  onNotice,
  onRefresh,
}: SubmissionsTabProps) {
  const [submissions, setSubmissions] = useState<any[]>(initialSubmissions || []);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [internalNotes, setInternalNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Sync state with parent updates
  useEffect(() => {
    setSubmissions(initialSubmissions || []);
  }, [initialSubmissions]);

  // Filter submissions
  const filtered = submissions.filter((sub) => {
    const data = sub.data || {};
    const matchesSearch =
      searchQuery === "" ||
      (data.fullName && data.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (data.email && data.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (data.company && data.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (data.message && data.message.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && sub.status !== statusFilter) return false;
    if (typeFilter !== "all" && sub.type !== typeFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleManualRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenDetail = (sub: any) => {
    setSelectedSubmission(sub);
    setInternalNotes(sub.internalNotes || "");
  };

  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;
    setIsSavingNotes(true);
    try {
      await adminUpdateSubmissionNotesFn({
        data: { id: selectedSubmission._id, notes: internalNotes },
      });
      setSubmissions((prev) =>
        prev.map((s) => (s._id === selectedSubmission._id ? { ...s, internalNotes } : s)),
      );
      setSelectedSubmission((prev: any) => (prev ? { ...prev, internalNotes } : null));
      onNotice?.("Internal notes saved successfully.");
    } catch (err: any) {
      onNotice?.(err?.message || "Failed to save notes", "error");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await adminDeleteSubmissionFn({ data: { id } });
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      if (selectedSubmission?._id === id) setSelectedSubmission(null);
      onNotice?.("Enquiry record deleted.");
    } catch (err: any) {
      onNotice?.(err?.message || "Failed to delete submission", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Lead &amp; Client Submissions
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Review incoming project briefs, contact enquiries, and applicant portfolios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              title="Refresh inbox"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#4385FF]" : "text-[#4385FF]"} />
              <span className="hidden sm:inline">{isRefreshing ? "Syncing..." : "Refresh"}</span>
            </button>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-mono font-medium text-neutral-300">
            <span>Showing:</span>
            <strong className="text-white">{filtered.length}</strong>
            <span className="text-neutral-500">/</span>
            <span>{submissions.length} Total</span>
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-3 shadow-xl backdrop-blur-xl">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, company, or brief keywords..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-white/10 bg-[#0E0F18] px-3 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-white/10 bg-[#0E0F18] px-3 py-2 text-xs text-white focus:border-[#0052FF] focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="contact">Contact &amp; Briefs</option>
            <option value="career">Job Applications</option>
            <option value="studio">Studio Bookings</option>
          </select>
        </div>
      </div>

      {/* ─── DESKTOP VIEW: LUXURY DATA TABLE (sm:block) ─── */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Client / Lead</th>
                <th className="px-5 py-3.5">Services &amp; Scope</th>
                <th className="px-5 py-3.5">Budget / Timeline</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {paginated.length > 0 ? (
                paginated.map((sub: any) => {
                  const data = sub.data || {};
                  const servicesList = data.services || (data.serviceOfInterest ? [data.serviceOfInterest] : []);

                  return (
                    <tr
                      key={sub._id}
                      onClick={() => handleOpenDetail(sub)}
                      className="transition-colors hover:bg-white/[0.03] cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            sub.type === "contact"
                              ? "bg-[#0052FF]/15 text-[#4385FF] border border-[#0052FF]/30"
                              : sub.type === "studio"
                                ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                                : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {sub.type}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">
                          {data.fullName || "Anonymous"}
                        </div>
                        <div className="text-[11px] text-neutral-400">{data.email || "—"}</div>
                        {data.company && (
                          <div className="text-[10.5px] text-neutral-500 flex items-center gap-1 mt-0.5">
                            <Building size={10} />
                            <span>{data.company}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {servicesList.slice(0, 2).map((srv: string, sIdx: number) => (
                            <span
                              key={sIdx}
                              className="rounded bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[9.5px] font-medium text-neutral-300"
                            >
                              {srv}
                            </span>
                          ))}
                          {servicesList.length > 2 && (
                            <span className="text-[10px] text-neutral-500 font-mono self-center">
                              +{servicesList.length - 2} more
                            </span>
                          )}
                        </div>
                        {data.message && (
                          <p className="mt-1 text-[11px] text-neutral-400 line-clamp-1">
                            {data.message}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 font-mono text-[11px] text-neutral-300">
                        <div>{data.budgetRange || "Flexible"}</div>
                        {data.timeline && (
                          <div className="text-[10px] text-neutral-500 mt-0.5">{data.timeline}</div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-neutral-400 font-mono text-[11px]">
                        {sub.submittedAt
                          ? new Date(sub.submittedAt).toLocaleDateString()
                          : "Recent"}
                      </td>

                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={sub.status || "new"}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            await onUpdateStatus(sub._id, newStatus as any);
                            setSubmissions((prev) =>
                              prev.map((s) => (s._id === sub._id ? { ...s, status: newStatus } : s)),
                            );
                          }}
                          className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-bold outline-none cursor-pointer ${
                            sub.status === "new"
                              ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                              : sub.status === "contacted"
                                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                                : sub.status === "qualified"
                                  ? "border-purple-500/30 bg-purple-500/15 text-purple-300"
                                  : sub.status === "closed"
                                    ? "border-neutral-500/30 bg-neutral-500/15 text-neutral-400"
                                    : sub.status === "in_review"
                                      ? "border-[#0052FF]/30 bg-[#0052FF]/15 text-[#4385FF]"
                                      : "border-white/10 bg-white/5 text-neutral-400"
                          }`}
                        >
                          <option value="new" className="bg-[#0D0E17] text-white">New</option>
                          <option value="in_review" className="bg-[#0D0E17] text-white">In Review</option>
                          <option value="contacted" className="bg-[#0D0E17] text-white">Contacted</option>
                          <option value="qualified" className="bg-[#0D0E17] text-white">Qualified</option>
                          <option value="closed" className="bg-[#0D0E17] text-white">Closed</option>
                          <option value="archived" className="bg-[#0D0E17] text-white">Archived</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(sub)}
                            className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                            title="View Full Dossier"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sub._id)}
                            className="rounded-lg border border-red-500/20 bg-red-500/5 p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            title="Delete Enquiry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-neutral-400">
                    <p className="text-sm font-medium">No matching enquiries found.</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      New contact requests and job applications will appear here in real-time.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MOBILE VIEW: STACKED DOSSIER CARDS (sm:hidden) ─── */}
      <div className="sm:hidden space-y-3">
        {paginated.length > 0 ? (
          paginated.map((sub: any) => {
            const data = sub.data || {};
            const servicesList = data.services || (data.serviceOfInterest ? [data.serviceOfInterest] : []);

            return (
              <div
                key={sub._id}
                onClick={() => handleOpenDetail(sub)}
                className="rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-4 space-y-3 cursor-pointer hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                        sub.type === "contact"
                          ? "bg-[#0052FF]/15 text-[#4385FF] border border-[#0052FF]/30"
                          : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {sub.type}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>

                  <select
                    value={sub.status || "new"}
                    onClick={(e) => e.stopPropagation()}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      await onUpdateStatus(sub._id, newStatus as any);
                      setSubmissions((prev) =>
                        prev.map((s) => (s._id === sub._id ? { ...s, status: newStatus } : s)),
                      );
                    }}
                    className={`rounded-lg border px-2 py-0.5 font-mono text-[10px] font-bold outline-none cursor-pointer ${
                      sub.status === "new"
                        ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                        : "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                    }`}
                  >
                    <option value="new" className="bg-[#0D0E17] text-white">New</option>
                    <option value="in_review" className="bg-[#0D0E17] text-white">In Review</option>
                    <option value="contacted" className="bg-[#0D0E17] text-white">Contacted</option>
                    <option value="qualified" className="bg-[#0D0E17] text-white">Qualified</option>
                    <option value="closed" className="bg-[#0D0E17] text-white">Closed</option>
                    <option value="archived" className="bg-[#0D0E17] text-white">Archived</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{data.fullName || "Anonymous"}</h4>
                  <div className="text-xs text-neutral-400 mt-0.5">{data.email}</div>
                  {data.company && (
                    <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Building size={11} />
                      <span>{data.company}</span>
                    </div>
                  )}
                </div>

                {servicesList.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {servicesList.map((srv: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="rounded bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[9px] font-medium text-neutral-300"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px]">
                  <span className="font-mono text-neutral-400">
                    Budget: <strong className="text-white">{data.budgetRange || "Flexible"}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(sub);
                      }}
                      className="text-xs font-semibold text-[#4385FF] hover:underline"
                    >
                      View Dossier →
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-8 text-center text-neutral-400">
            <p className="text-sm font-medium">No matching enquiries found.</p>
            <p className="text-xs text-neutral-500 mt-1">
              New contact requests and job applications will appear here in real-time.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-white/[0.01] px-5 py-3 text-xs">
          <span className="text-neutral-400 font-mono text-[11px]">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 font-semibold text-neutral-300 disabled:opacity-30 hover:bg-white/[0.08] cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 font-semibold text-neutral-300 disabled:opacity-30 hover:bg-white/[0.08] cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ENQUIRY DETAIL MODAL / DRAWER */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-white/[0.12] bg-[#0E0F18] p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto my-auto flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF]">
                  ENQUIRY DOSSIER
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {selectedSubmission.data?.fullName || "Anonymous Lead"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="rounded-xl p-2 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Dossier Content */}
            <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-5 text-xs">
              {/* Client Contact Coordinate Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedSubmission.data?.email}`}
                    className="font-mono font-medium text-white hover:text-[#4385FF] flex items-center gap-1.5 transition-colors"
                  >
                    <Mail size={13} className="text-[#4385FF]" />
                    <span>{selectedSubmission.data?.email || "Not provided"}</span>
                  </a>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                    Phone / WhatsApp
                  </span>
                  {selectedSubmission.data?.phoneWhatsApp ? (
                    <a
                      href={`https://wa.me/${selectedSubmission.data.phoneWhatsApp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-medium text-emerald-400 hover:underline flex items-center gap-1.5"
                    >
                      <Phone size={13} />
                      <span>{selectedSubmission.data.phoneWhatsApp}</span>
                    </a>
                  ) : (
                    <span className="font-mono text-neutral-500">Not provided</span>
                  )}
                </div>

                {selectedSubmission.data?.company && (
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                      Organization
                    </span>
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Building size={13} className="text-[#4385FF]" />
                      <span>{selectedSubmission.data.company}</span>
                    </span>
                  </div>
                )}

                {selectedSubmission.data?.websiteUrl && (
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                      Website URL
                    </span>
                    <a
                      href={selectedSubmission.data.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 underline underline-offset-2"
                    >
                      <Globe size={13} className="text-[#4385FF]" />
                      <span className="truncate">{selectedSubmission.data.websiteUrl}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Scope & Strategic Parameters */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                  Requested Capabilities &amp; Timeline
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedSubmission.data?.services || [selectedSubmission.data?.serviceOfInterest]).map(
                    (s: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-[#0052FF]/15 border border-[#0052FF]/30 px-2.5 py-1 text-xs font-semibold text-[#4385FF]"
                      >
                        {s}
                      </span>
                    ),
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] text-xs">
                  <div>
                    Budget: <strong className="text-white font-mono">{selectedSubmission.data?.budgetRange || "Flexible"}</strong>
                  </div>
                  <div>
                    Timeline: <strong className="text-white font-mono">{selectedSubmission.data?.timeline || "Flexible"}</strong>
                  </div>
                </div>
              </div>

              {/* Full Submitted Brief */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
                  Project Brief &amp; Notes
                </span>
                <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedSubmission.data?.message || "No project brief text was provided."}
                </p>
              </div>

              {/* Private Internal Admin Notes */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0B10] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                    <Sparkles size={11} className="text-[#4385FF]" />
                    <span>Private Internal Notes (Admin Only)</span>
                  </span>
                  <span className="text-[10px] text-neutral-500">Never shared with client</span>
                </div>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record call takeaways, qualification criteria, estimated deal size, or next actions..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none leading-relaxed"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isSavingNotes}
                    onClick={handleSaveNotes}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#0043DB] shadow-[0_0_16px_rgba(0,82,255,0.4)] disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Save size={13} />
                    <span>{isSavingNotes ? "Saving..." : "Save Internal Note"}</span>
                  </button>
                </div>
              </div>

              {/* CV Download (For Career Submissions) */}
              {selectedSubmission.type === "career" && selectedSubmission.data?.cvStorageKey && (
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div>
                    <span className="font-semibold text-white block">Candidate Resume / CV</span>
                    <span className="text-neutral-400 text-[11px]">
                      {selectedSubmission.data?.cvOriginalFilename || "Applicant_CV.pdf"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onDownloadCv(
                        selectedSubmission.data.cvStorageKey,
                        selectedSubmission.data.fullName || "Candidate",
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] px-4 py-2 font-semibold text-white transition-colors"
                  >
                    <Download size={13} className="text-[#4385FF]" />
                    <span>Download CV</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/[0.08] shrink-0">
              <button
                type="button"
                onClick={() => handleDelete(selectedSubmission._id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 size={13} />
                <span>Delete Record</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="rounded-xl border border-white/10 px-5 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/5 cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
