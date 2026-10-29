"use client";

import { useState } from "react";
import { adminLogoutFn, adminUpdateSubmissionStatusFn, adminDownloadCvFn } from "@/api/admin";
import { Check, AlertCircle, Menu } from "lucide-react";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { SubmissionsTab } from "@/components/admin/tabs/SubmissionsTab";
import { OurWorkManager } from "@/components/admin/OurWorkManager";
import { ServicesTab } from "@/components/admin/tabs/ServicesTab";
import { PortfolioTab } from "@/components/admin/tabs/PortfolioTab";
import { CaseStudiesTab } from "@/components/admin/tabs/CaseStudiesTab";
import { CareersTab } from "@/components/admin/tabs/CareersTab";
import { SettingsTab } from "@/components/admin/tabs/SettingsTab";

export function AdminDashboard({
  initialData,
  user,
}: {
  initialData: any;
  user: any;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("inbox");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Local state mirrors for optimistic UI
  const [submissions, setSubmissions] = useState<any[]>(initialData.submissions || []);
  const [services, setServices] = useState<any[]>(initialData.services || []);
  const [portfolio, setPortfolio] = useState<any[]>(initialData.portfolio || []);
  const [caseStudies, setCaseStudies] = useState<any[]>(initialData.caseStudies || []);
  const [vacancies, setVacancies] = useState<any[]>(initialData.vacancies || []);
  const [siteSettings, setSiteSettings] = useState<any>(initialData.siteSettings || {});
  const [workProjects] = useState<any[]>(initialData.workProjects || []);
  const [workPageSettings] = useState<any>(initialData.workPageSettings || {});

  // Notice Toast Banner
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
      showNotice(`Submission status updated to ${newStatus}`);
    } catch (err: any) {
      showNotice(err?.message || "Failed to update submission status", "error");
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

  const counts = {
    inboxNew: submissions.filter((s) => s.status === "new").length,
    ourWork: workProjects.length,
    services: services.length,
    portfolio: portfolio.length,
    caseStudies: caseStudies.length,
    careers: vacancies.length,
  };

  return (
    <div className="min-h-screen bg-[#08080B] text-white selection:bg-[#0052FF] selection:text-white flex">
      {/* ─── SIDEBAR ─────────────────────────────────────── */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* ─── MAIN CONTENT VIEWPORT ──────────────────────── */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#0A0B10]/80 px-4 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white hover:bg-white/[0.08]"
          >
            <Menu size={18} />
            <span className="text-xs font-semibold">Menu</span>
          </button>
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
            {activeTab.replace("-", " ")}
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 md:p-10 max-w-[1600px] w-full mx-auto">
          {activeTab === "inbox" && (
            <SubmissionsTab
              submissions={submissions}
              onUpdateStatus={handleUpdateStatus}
              onDownloadCv={handleDownloadCv}
            />
          )}

          {activeTab === "our-work" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <OurWorkManager
                initialProjects={workProjects}
                initialSettings={workPageSettings}
                onNotice={showNotice}
              />
            </div>
          )}

          {activeTab === "services" && (
            <ServicesTab
              services={services}
              setServices={setServices}
              onNotice={showNotice}
            />
          )}

          {activeTab === "portfolio" && (
            <PortfolioTab
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              onNotice={showNotice}
            />
          )}

          {activeTab === "case-studies" && (
            <CaseStudiesTab
              caseStudies={caseStudies}
              setCaseStudies={setCaseStudies}
              onNotice={showNotice}
            />
          )}

          {activeTab === "careers" && (
            <CareersTab
              vacancies={vacancies}
              setVacancies={setVacancies}
              onNotice={showNotice}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              onNotice={showNotice}
            />
          )}
        </main>
      </div>

      {/* Floating Notice Toast */}
      {notice && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs font-semibold shadow-2xl border backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200 ${
            notice.type === "success"
              ? "bg-[#0E0F18] text-white border-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.2)]"
              : "bg-[#0E0F18] text-white border-red-500/30 shadow-[0_0_24px_rgba(239,68,68,0.2)]"
          }`}
        >
          {notice.type === "success" ? (
            <Check size={16} className="text-emerald-400" />
          ) : (
            <AlertCircle size={16} className="text-red-400" />
          )}
          <span>{notice.text}</span>
        </div>
      )}
    </div>
  );
}
