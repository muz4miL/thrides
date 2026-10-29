"use client";

import { Wordmark } from "@/components/site/Wordmark";
import {
  Inbox,
  Briefcase,
  Layers,
  FileText,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
  ChevronRight,
  Shield,
  X,
} from "lucide-react";

export type AdminTab =
  | "inbox"
  | "our-work"
  | "services"
  | "portfolio"
  | "case-studies"
  | "careers"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  counts: {
    inboxNew: number;
    ourWork: number;
    services: number;
    portfolio: number;
    caseStudies: number;
    careers: number;
  };
  user: {
    email?: string;
    role?: string;
  };
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: any;
  count?: number;
  isBadgeHighlight?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  counts,
  user,
  onLogout,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const navGroups: NavGroup[] = [
    {
      group: "COMMUNICATIONS",
      items: [
        {
          id: "inbox" as AdminTab,
          label: "Submissions Inbox",
          icon: Inbox,
          count: counts.inboxNew,
          isBadgeHighlight: counts.inboxNew > 0,
        },
      ],
    },
    {
      group: "CONTENT & PORTFOLIO",
      items: [
        {
          id: "our-work" as AdminTab,
          label: "Our Work CMS",
          icon: Sparkles,
          count: counts.ourWork,
        },
        {
          id: "services" as AdminTab,
          label: "Agency Services",
          icon: Layers,
          count: counts.services,
        },
        {
          id: "portfolio" as AdminTab,
          label: "Legacy Portfolio",
          icon: Briefcase,
          count: counts.portfolio,
        },
        {
          id: "case-studies" as AdminTab,
          label: "Case Studies",
          icon: FileText,
          count: counts.caseStudies,
        },
      ],
    },
    {
      group: "ORGANIZATION",
      items: [
        {
          id: "careers" as AdminTab,
          label: "Careers & Jobs",
          icon: Users,
          count: counts.careers,
        },
        {
          id: "settings" as AdminTab,
          label: "Agency Settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-white/[0.08] bg-[#0A0B10] text-white transition-transform duration-300 ease-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wordmark variant="white" className="h-6 w-auto" />
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider text-neutral-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>CONSOLE</span>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden rounded-lg p-1 text-neutral-400 hover:text-white hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">
                {grp.group}
              </span>
              <div className="pt-1 space-y-1">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileOpen(false);
                      }}
                      className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-[#0052FF]/15 text-white shadow-[inset_0_0_16px_rgba(0,82,255,0.25)] border border-[#0052FF]/40 font-bold"
                          : "text-neutral-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={16}
                          className={`transition-colors ${
                            isActive
                              ? "text-[#4385FF]"
                              : "text-neutral-500 group-hover:text-neutral-300"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {typeof item.count === "number" && (
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                            item.isBadgeHighlight
                              ? "bg-[#0052FF] text-white shadow-[0_0_12px_rgba(0,82,255,0.6)]"
                              : isActive
                                ? "bg-white/20 text-white"
                                : "bg-white/[0.06] text-neutral-400 group-hover:bg-white/[0.1] group-hover:text-neutral-300"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-white/[0.06] space-y-3 bg-[#08080C]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2 text-xs font-medium text-neutral-400 hover:bg-white/[0.05] hover:text-white transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={13} className="text-[#4385FF]" />
              <span>View Public Site</span>
            </span>
            <ChevronRight size={13} className="text-neutral-600" />
          </a>

          {/* User Profile Card */}
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-[#0052FF] flex items-center justify-center font-display font-black text-xs text-white shadow-[0_0_12px_rgba(0,82,255,0.5)] shrink-0">
                t.
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.email || "admin@brandit.agency"}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                  <Shield size={10} className="text-emerald-400" />
                  <span className="capitalize">{user?.role || "Super Admin"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Log Out of Administration"
              className="rounded-lg p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
