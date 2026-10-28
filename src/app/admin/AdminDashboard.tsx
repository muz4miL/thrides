"use client";

import { useState } from "react";
import { Wordmark } from "@/components/site/Wordmark";
import {
  adminLogoutFn,
  adminUpdateSubmissionStatusFn,
  adminSaveServiceFn,
  adminSavePortfolioFn,
  adminDeletePortfolioFn,
  adminSaveCaseStudyFn,
  adminDeleteCaseStudyFn,
  adminSaveStudioEquipmentFn,
  adminDeleteStudioEquipmentFn,
  adminSaveVacancyFn,
  adminDeleteVacancyFn,
  adminUpdateSiteSettingsFn,
  adminDownloadCvFn,
} from "@/api/admin";
import {
  Inbox,
  Layers,
  Briefcase,
  FileText,
  Camera,
  Users,
  Settings,
  LogOut,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldCheck,
  Save,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";
import { OurWorkManager } from "@/components/admin/OurWorkManager";

type AdminTab =
  | "inbox"
  | "our-work"
  | "services"
  | "portfolio"
  | "case-studies"
  | "studio-gear"
  | "careers"
  | "settings";

export function AdminDashboard({
  initialData,
  user,
}: {
  initialData: any;
  user: any;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("inbox");

  // Local state mirrors for optimistic UI
  const [submissions, setSubmissions] = useState<any[]>(initialData.submissions || []);
  const [services, setServices] = useState<any[]>(initialData.services || []);
  const [portfolio, setPortfolio] = useState<any[]>(initialData.portfolio || []);
  const [caseStudies, setCaseStudies] = useState<any[]>(initialData.caseStudies || []);
  const [equipment, setEquipment] = useState<any[]>(initialData.studioEquipment || []);
  const [categories] = useState<any[]>(initialData.studioCategories || []);
  const [vacancies, setVacancies] = useState<any[]>(initialData.vacancies || []);
  const [siteSettings, setSiteSettings] = useState<any>(initialData.siteSettings || {});
  const [workProjects, setWorkProjects] = useState<any[]>(initialData.workProjects || []);
  const [workPageSettings, setWorkPageSettings] = useState<any>(initialData.workPageSettings || {});

  // Notification Banner
  const [notice, setNotice] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showNotice = (text: string, type: "success" | "error" = "success") => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const handleLogout = async () => {
    await adminLogoutFn();
    window.location.href = "/admin/login";
  };

  // 1. Submissions Status Handler
  const handleUpdateStatus = async (
    id: string,
    newStatus: "new" | "in_review" | "contacted" | "archived",
  ) => {
    try {
      await adminUpdateSubmissionStatusFn({ data: { id, status: newStatus } });
      setSubmissions((prev) =>
        prev.map((sub) => (sub._id === id ? { ...sub, status: newStatus } : sub)),
      );
      showNotice(`Submission marked as ${newStatus}`);
    } catch (err: any) {
      showNotice(err?.message || "Failed to update status", "error");
    }
  };

  // 2. Download CV Handler
  const handleDownloadCv = async (cvStorageKey: string, candidateName: string) => {
    try {
      const res = await adminDownloadCvFn({ data: { cvStorageKey } });
      if (res.success && res.dataBase64) {
        const link = document.createElement("a");
        link.href = `data:application/octet-stream;base64,${res.dataBase64}`;
        link.download = `${candidateName.replace(/\s+/g, "_")}_CV.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotice("CV downloaded securely.");
      }
    } catch (err: any) {
      showNotice(err?.message || "Failed to download CV", "error");
    }
  };

  // 3. Save Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminUpdateSiteSettingsFn({ data: siteSettings });
      showNotice("Site settings updated successfully.");
    } catch (err: any) {
      showNotice(err?.message || "Failed to save settings", "error");
    }
  };

  // Editing state modals / drawers
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<any | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<any | null>(null);
  const [editingGear, setEditingGear] = useState<any | null>(null);
  const [editingVacancy, setEditingVacancy] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#09090B]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-white px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <div className="flex items-center gap-4">
            <Wordmark variant="black" className="h-6 w-auto" />
            <span className="hidden sm:inline-block rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-[#52525B] hover:bg-black/5 hover:text-black"
            >
              <span>View Live Site</span>
              <ExternalLink size={12} />
            </a>

            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[#FAFAFA] px-3 py-1 text-xs font-medium text-[#09090B]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{user?.email || "Admin"}</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-black px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-neutral-800"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notice Toast */}
      {notice && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-semibold shadow-xl border ${
            notice.type === "success"
              ? "bg-black text-white border-black"
              : "bg-red-600 text-white border-red-700"
          }`}
        >
          {notice.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Main Admin Layout */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-black/[0.08] pb-4">
          {[
            {
              id: "inbox",
              label: "Submissions Inbox",
              icon: Inbox,
              count: submissions.filter((s) => s.status === "new").length,
            },
            {
              id: "our-work",
              label: "Our Work & Case Studies",
              icon: Briefcase,
              count: workProjects.length,
            },
            { id: "services", label: "Services", icon: Layers, count: services.length },
            { id: "portfolio", label: "Legacy Portfolio", icon: Briefcase, count: portfolio.length },
            {
              id: "case-studies",
              label: "Case Studies",
              icon: FileText,
              count: caseStudies.length,
            },
            { id: "studio-gear", label: "Studio Gear", icon: Camera, count: equipment.length },
            { id: "careers", label: "Careers & Applicants", icon: Users, count: vacancies.length },
            { id: "settings", label: "Site Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-black text-white shadow-xs"
                    : "bg-white text-[#52525B] border border-black/10 hover:border-black/25 hover:text-black"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-black/5 text-[#09090B]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="mt-8">
          {/* TAB 1: SUBMISSIONS INBOX */}
          {activeTab === "inbox" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#09090B]">
                    Lead & Rental Submissions
                  </h2>
                  <p className="text-xs text-[#71717A]">
                    Review general inquiries, studio bookings, and applicant submissions.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-black/[0.06] bg-[#FAFAFA] text-[#71717A] uppercase font-bold tracking-wider">
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
                    <tbody className="divide-y divide-black/[0.04]">
                      {submissions.length > 0 ? (
                        submissions.map((sub: any) => (
                          <tr key={sub._id} className="hover:bg-neutral-50/70">
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  sub.type === "contact"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : sub.type === "studio"
                                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                {sub.type}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="font-bold text-[#09090B]">
                                {sub.data?.fullName || "Anonymous"}
                              </div>
                              {sub.data?.company && (
                                <div className="text-[11px] text-[#71717A]">{sub.data.company}</div>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <div>{sub.data?.email}</div>
                              {sub.data?.phoneWhatsApp && (
                                <a
                                  href={`https://wa.me/${sub.data.phoneWhatsApp.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-semibold text-emerald-600 hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  {sub.data.phoneWhatsApp}
                                </a>
                              )}
                            </td>
                            <td className="px-5 py-4 max-w-xs">
                              {sub.type === "contact" && (
                                <div>
                                  <div className="font-medium text-[#09090B]">
                                    {sub.data?.serviceOfInterest || "General Inquiry"}
                                  </div>
                                  <p className="mt-0.5 text-[11px] text-[#52525B] line-clamp-2">
                                    {sub.data?.message}
                                  </p>
                                </div>
                              )}
                              {sub.type === "studio" && (
                                <div>
                                  <div className="font-medium text-[#09090B]">
                                    {sub.data?.shootType} ({sub.data?.duration})
                                  </div>
                                  <div className="text-[11px] text-[#71717A]">
                                    Date: {sub.data?.preferredDate || "Flexible"}
                                  </div>
                                  {sub.data?.equipmentRequirements && (
                                    <div className="text-[11px] text-[#52525B] line-clamp-1">
                                      Gear: {sub.data.equipmentRequirements}
                                    </div>
                                  )}
                                </div>
                              )}
                              {sub.type === "career" && (
                                <div>
                                  <div className="font-medium text-[#09090B]">
                                    {sub.data?.vacancyTitle}
                                  </div>
                                  {sub.data?.portfolioUrl && (
                                    <a
                                      href={sub.data.portfolioUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] text-blue-600 underline flex items-center gap-1"
                                    >
                                      Portfolio Link
                                      <ExternalLink size={10} />
                                    </a>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4 text-[#71717A]">
                              {sub.submittedAt
                                ? new Date(sub.submittedAt).toLocaleDateString()
                                : "Recent"}
                            </td>
                            <td className="px-5 py-4">
                              <select
                                value={sub.status || "new"}
                                onChange={(e) => handleUpdateStatus(sub._id, e.target.value as any)}
                                className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                                  sub.status === "new"
                                    ? "border-amber-300 bg-amber-50 text-amber-800"
                                    : sub.status === "contacted"
                                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                      : sub.status === "in_review"
                                        ? "border-blue-300 bg-blue-50 text-blue-800"
                                        : "border-neutral-200 bg-neutral-100 text-neutral-600"
                                }`}
                              >
                                <option value="new">New</option>
                                <option value="in_review">In Review</option>
                                <option value="contacted">Contacted</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>
                            <td className="px-5 py-4 text-right">
                              {sub.type === "career" && sub.data?.cvStorageKey && (
                                <button
                                  onClick={() =>
                                    handleDownloadCv(
                                      sub.data.cvStorageKey,
                                      sub.data.fullName || "Candidate",
                                    )
                                  }
                                  className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-black hover:bg-neutral-50 shadow-2xs"
                                >
                                  <Download size={12} />
                                  <span>Download CV</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-[#71717A]">
                            No submissions in inbox yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OUR WORK & CASE STUDIES CMS */}
          {activeTab === "our-work" && (
            <OurWorkManager
              initialProjects={workProjects}
              initialSettings={workPageSettings}
              onNotice={showNotice}
            />
          )}

          {/* TAB 2: SERVICES MANAGER */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#09090B]">
                    Core Services (6 Pillars)
                  </h2>
                  <p className="text-xs text-[#71717A]">
                    Edit service titles, descriptions, visible tags, and order.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((srv: any) => (
                  <div
                    key={srv.slug}
                    className="flex flex-col justify-between rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs font-bold text-[#A1A1AA]">
                          ORDER: {srv.order}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            srv.isPublished
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {srv.isPublished ? "PUBLISHED" : "DRAFT"}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-bold text-[#09090B]">
                        {srv.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#52525B] leading-relaxed line-clamp-3">
                        {srv.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1">
                        {srv.visibleTags?.map((tag: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="rounded bg-[#FAFAFA] border border-black/[0.06] px-2 py-0.5 text-[10px] text-[#3F3F46]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-end">
                      <button
                        onClick={() => setEditingService(srv)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-neutral-50"
                      >
                        <Edit2 size={12} />
                        <span>Edit Service</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PORTFOLIO MANAGER */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#09090B]">
                    Portfolio Projects (10 Supplied Cards)
                  </h2>
                  <p className="text-xs text-[#71717A]">
                    Manage 16:9 media, outcome lines, and categories.
                  </p>
                </div>
                <button
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
                  className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
                >
                  <Plus size={14} />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((item: any) => (
                  <div
                    key={item.slug || item._id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-xs"
                  >
                    <div>
                      <div className="aspect-[16/9] w-full bg-neutral-100 overflow-hidden relative">
                        {item.mediaSrc ? (
                          <img
                            src={item.mediaSrc}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-[#71717A]">
                            16:9 Media Frame
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                          {item.client}
                        </div>
                        <h3 className="mt-1 font-display text-base font-bold text-[#09090B]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-[#52525B] line-clamp-2">
                          <span className="font-semibold text-black">Outcome: </span>
                          {item.outcome}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-black/[0.04]">
                      <span className="text-[11px] text-[#A1A1AA]">Order: {item.order}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingPortfolio(item)}
                          className="rounded-md border border-black/10 bg-white p-1.5 text-black hover:bg-neutral-50"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this portfolio item?")) {
                              await adminDeletePortfolioFn({ data: { id: item._id } });
                              setPortfolio((prev) => prev.filter((p) => p._id !== item._id));
                              showNotice("Project deleted.");
                            }
                          }}
                          className="rounded-md border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CASE STUDIES MANAGER */}
          {activeTab === "case-studies" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#09090B]">
                    Case Studies & Transformations
                  </h2>
                  <p className="text-xs text-[#71717A]">
                    Manage detailed revenue breakdowns, challenge/strategy, and verified metrics.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingCaseStudy({
                      slug: "",
                      client: "",
                      industry: "",
                      title: "",
                      challenge: "",
                      strategy: "",
                      objectives: [],
                      deliverables: [],
                      results: [],
                      isPublished: true,
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
                >
                  <Plus size={14} />
                  <span>Create Case Study</span>
                </button>
              </div>

              <div className="space-y-4">
                {caseStudies.map((cs: any) => (
                  <div
                    key={cs.slug}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                          {cs.industry}
                        </span>
                        <span className="text-xs font-bold text-[#71717A]">
                          Client: {cs.client}
                        </span>
                        <span className="text-xs text-[#A1A1AA]">
                          Slug: /case-studies/{cs.slug}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-bold text-[#09090B]">
                        {cs.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {cs.results?.map((r: any, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-md border border-black/10 bg-[#FAFAFA] px-2 py-0.5 text-xs font-semibold text-[#09090B]"
                          >
                            {r.metric} — {r.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/case-studies/${cs.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-black/10 p-2 text-black hover:bg-neutral-50"
                        title="Preview Public Page"
                      >
                        <Eye size={15} />
                      </a>
                      <button
                        onClick={() => setEditingCaseStudy(cs)}
                        className="rounded-lg border border-black/10 p-2 text-black hover:bg-neutral-50"
                        title="Edit Case Study"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("Delete this case study?")) {
                            await adminDeleteCaseStudyFn({ data: { id: cs._id } });
                            setCaseStudies((prev) => prev.filter((c) => c._id !== cs._id));
                            showNotice("Case study removed.");
                          }
                        }}
                        className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: STUDIO GEAR MANAGER */}
          {activeTab === "studio-gear" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#09090B]">
                    Studio Gear Inventory (12 Categories)
                  </h2>
                  <p className="text-xs text-[#71717A]">
                    Update equipment name, specs, and availability status.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingGear({
                      categorySlug: "cameras",
                      name: "",
                      specs: "",
                      status: "available at studio",
                      isPublished: true,
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
                >
                  <Plus size={14} />
                  <span>Add Equipment</span>
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-black/[0.06] bg-[#FAFAFA] text-[#71717A] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Item Name</th>
                      <th className="px-5 py-3.5">Specifications</th>
                      <th className="px-5 py-3.5">Availability Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {equipment.map((item: any) => (
                      <tr key={item._id} className="hover:bg-neutral-50/70">
                        <td className="px-5 py-3.5 font-bold uppercase text-[#71717A]">
                          {item.categorySlug}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-[#09090B]">{item.name}</td>
                        <td className="px-5 py-3.5 text-[#52525B] max-w-sm">{item.specs}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                              item.status === "available at studio"
                                ? "bg-black text-white"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => setEditingGear(item)}
                            className="rounded-md border border-black/10 bg-white p-1 text-black hover:bg-neutral-50"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm("Delete this gear record?")) {
                                await adminDeleteStudioEquipmentFn({ data: { id: item._id } });
                                setEquipment((prev) => prev.filter((e) => e._id !== item._id));
                                showNotice("Gear removed.");
                              }
                            }}
                            className="rounded-md border border-red-200 bg-red-50 p-1 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CAREERS & VACANCIES */}
          {activeTab === "careers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#09090B]">
                    Vacancies & Job Postings
                  </h2>
                  <p className="text-xs text-[#71717A]">
                    Open, close, or archive job postings. Applications appear in the Inbox tab.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingVacancy({
                      slug: "",
                      jobTitle: "",
                      department: "Media Buying",
                      location: "Dubai, UAE",
                      type: "Full-time",
                      description: "",
                      responsibilities: [],
                      requirements: [],
                      isOpen: true,
                      isArchived: false,
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
                >
                  <Plus size={14} />
                  <span>Create Vacancy</span>
                </button>
              </div>

              <div className="space-y-4">
                {vacancies.map((v: any) => (
                  <div
                    key={v.slug}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            v.isOpen
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {v.isOpen ? "ACCEPTING APPLICATIONS" : "CLOSED"}
                        </span>
                        <span className="text-xs font-semibold text-[#71717A]">
                          {v.department} • {v.location}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-bold text-[#09090B]">
                        {v.jobTitle}
                      </h3>
                      <p className="mt-1 text-xs text-[#52525B] line-clamp-2">{v.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingVacancy(v)}
                        className="rounded-lg border border-black/10 p-2 text-black hover:bg-neutral-50"
                        title="Edit Vacancy"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("Delete this vacancy posting?")) {
                            await adminDeleteVacancyFn({ data: { id: v._id } });
                            setVacancies((prev) => prev.filter((item) => item._id !== v._id));
                            showNotice("Vacancy removed.");
                          }
                        }}
                        className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SITE SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-[#09090B]">
                  Global Agency Settings & Founder Bio
                </h2>
                <p className="text-xs text-[#71717A]">
                  Update contact coordinates, WhatsApp links, and Umar Farooq narrative.
                </p>
              </div>

              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl border border-black/[0.08] bg-white p-7 shadow-sm space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-1.5">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={siteSettings.contactEmail || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, contactEmail: e.target.value })
                      }
                      className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-2.5 text-xs text-black focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={siteSettings.phoneWhatsApp || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, phoneWhatsApp: e.target.value })
                      }
                      className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-2.5 text-xs text-black focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] mb-1.5">
                    WhatsApp Direct URL
                  </label>
                  <input
                    type="url"
                    value={siteSettings.whatsappLink || ""}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, whatsappLink: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-2.5 text-xs text-black focus:border-black focus:outline-none"
                  />
                </div>

                <div className="border-t border-black/[0.06] pt-5">
                  <h3 className="font-display text-sm font-bold text-[#09090B] mb-3">
                    Founder Narrative (Umar Farooq)
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#71717A] mb-1">
                        Bio Paragraph 1 (Arena & Background)
                      </label>
                      <textarea
                        rows={2}
                        value={siteSettings.founder?.bioParagraph1 || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            founder: {
                              ...siteSettings.founder,
                              bioParagraph1: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-2 text-xs text-black focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#71717A] mb-1">
                        Bio Paragraph 2 (Hands-on Seats)
                      </label>
                      <textarea
                        rows={2}
                        value={siteSettings.founder?.bioParagraph2 || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            founder: {
                              ...siteSettings.founder,
                              bioParagraph2: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-2 text-xs text-black focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800"
                >
                  <Save size={14} />
                  <span>Save Agency Settings</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL FOR SERVICES */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-[#09090B]">
              Edit Service: {editingService.title}
            </h3>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#71717A] mb-1">Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full rounded-xl border border-black/10 p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-[#71717A] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-black/10 p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-[#71717A] mb-1">
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
                  className="w-full rounded-xl border border-black/10 p-2.5"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="srvPublish"
                  checked={editingService.isPublished}
                  onChange={(e) =>
                    setEditingService({ ...editingService, isPublished: e.target.checked })
                  }
                  className="rounded"
                />
                <label htmlFor="srvPublish" className="font-bold">
                  Published on Public Site
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditingService(null)}
                className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await adminSaveServiceFn({ data: editingService });
                  setServices((prev) =>
                    prev.map((s) => (s._id === editingService._id ? editingService : s)),
                  );
                  setEditingService(null);
                  showNotice("Service updated successfully.");
                }}
                className="rounded-full bg-black px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL FOR PORTFOLIO */}
      {editingPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-[#09090B]">
              {editingPortfolio._id ? "Edit Portfolio Item" : "New Portfolio Project"}
            </h3>
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#71717A] mb-1">Client Name</label>
                  <input
                    type="text"
                    value={editingPortfolio.client}
                    onChange={(e) =>
                      setEditingPortfolio({ ...editingPortfolio, client: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#71717A] mb-1">Category</label>
                  <select
                    value={editingPortfolio.category}
                    onChange={(e) =>
                      setEditingPortfolio({ ...editingPortfolio, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/10 p-2.5"
                  >
                    <option value="Branding">Branding</option>
                    <option value="Video & Media">Video & Media</option>
                    <option value="Paid Ads">Paid Ads</option>
                    <option value="Web & Stores">Web & Stores</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#71717A] mb-1">Project Title</label>
                <input
                  type="text"
                  value={editingPortfolio.title}
                  onChange={(e) =>
                    setEditingPortfolio({ ...editingPortfolio, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-black/10 p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-[#71717A] mb-1">
                  Outcome Line (Key Result)
                </label>
                <textarea
                  rows={2}
                  value={editingPortfolio.outcome}
                  onChange={(e) =>
                    setEditingPortfolio({ ...editingPortfolio, outcome: e.target.value })
                  }
                  className="w-full rounded-xl border border-black/10 p-2.5"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditingPortfolio(null)}
                className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const res = await adminSavePortfolioFn({ data: editingPortfolio });
                  if (!editingPortfolio._id) {
                    setPortfolio((prev) => [...prev, { ...editingPortfolio, _id: res.id }]);
                  } else {
                    setPortfolio((prev) =>
                      prev.map((p) => (p._id === editingPortfolio._id ? editingPortfolio : p)),
                    );
                  }
                  setEditingPortfolio(null);
                  showNotice("Portfolio saved successfully.");
                }}
                className="rounded-full bg-black px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
