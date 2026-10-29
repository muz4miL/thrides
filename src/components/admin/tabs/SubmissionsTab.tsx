"use client";

import { Download, ExternalLink } from "lucide-react";

interface SubmissionsTabProps {
  submissions: any[];
  onUpdateStatus: (id: string, status: "new" | "in_review" | "contacted" | "archived") => Promise<void>;
  onDownloadCv: (cvStorageKey: string, candidateName: string) => Promise<void>;
}

export function SubmissionsTab({ submissions, onUpdateStatus, onDownloadCv }: SubmissionsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Lead & Client Submissions
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Review general strategy inquiries, consultation bookings, and job applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-mono font-medium text-neutral-300">
            Total Inquiries: <strong className="text-white">{submissions.length}</strong>
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Client / Applicant</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Project / Details</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {submissions.length > 0 ? (
                submissions.map((sub: any) => (
                  <tr key={sub._id} className="transition-colors hover:bg-white/[0.02]">
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
                        {sub.data?.fullName || "Anonymous"}
                      </div>
                      {sub.data?.company && (
                        <div className="text-[11px] text-neutral-400 mt-0.5">{sub.data.company}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-neutral-200">{sub.data?.email || "—"}</div>
                      {sub.data?.phoneWhatsApp && (
                        <a
                          href={`https://wa.me/${sub.data.phoneWhatsApp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>{sub.data.phoneWhatsApp}</span>
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      {sub.type === "contact" && (
                        <div>
                          <div className="font-medium text-white">
                            {sub.data?.serviceOfInterest || "General Inquiry"}
                          </div>
                          <p className="mt-0.5 text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                            {sub.data?.message}
                          </p>
                        </div>
                      )}
                      {sub.type === "studio" && (
                        <div>
                          <div className="font-medium text-white">
                            {sub.data?.shootType} ({sub.data?.duration})
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            Date: {sub.data?.preferredDate || "Flexible"}
                          </div>
                          {sub.data?.equipmentRequirements && (
                            <div className="text-[11px] text-neutral-400 line-clamp-1">
                              Gear: {sub.data.equipmentRequirements}
                            </div>
                          )}
                        </div>
                      )}
                      {sub.type === "career" && (
                        <div>
                          <div className="font-medium text-white">
                            {sub.data?.vacancyTitle}
                          </div>
                          {sub.data?.portfolioUrl && (
                            <a
                              href={sub.data.portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#4385FF] hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <span>Portfolio Link</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-neutral-400 font-mono text-[11px]">
                      {sub.submittedAt
                        ? new Date(sub.submittedAt).toLocaleDateString()
                        : "Recent"}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={sub.status || "new"}
                        onChange={(e) => onUpdateStatus(sub._id, e.target.value as any)}
                        className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-bold outline-none cursor-pointer ${
                          sub.status === "new"
                            ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                            : sub.status === "contacted"
                              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                              : sub.status === "in_review"
                                ? "border-[#0052FF]/30 bg-[#0052FF]/15 text-[#4385FF]"
                                : "border-white/10 bg-white/5 text-neutral-400"
                        }`}
                      >
                        <option value="new" className="bg-[#0D0E17] text-white">New</option>
                        <option value="in_review" className="bg-[#0D0E17] text-white">In Review</option>
                        <option value="contacted" className="bg-[#0D0E17] text-white">Contacted</option>
                        <option value="archived" className="bg-[#0D0E17] text-white">Archived</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {sub.type === "career" && sub.data?.cvStorageKey && (
                        <button
                          onClick={() =>
                            onDownloadCv(
                              sub.data.cvStorageKey,
                              sub.data.fullName || "Candidate",
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                        >
                          <Download size={12} className="text-[#4385FF]" />
                          <span>Download CV</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-neutral-400">
                    <p className="text-sm font-medium">No submissions in inbox yet.</p>
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
    </div>
  );
}
