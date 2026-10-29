"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import { adminUpdateSiteSettingsFn } from "@/api/admin";

interface SettingsTabProps {
  siteSettings: any;
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>;
  onNotice: (text: string, type?: "success" | "error") => void;
}

export function SettingsTab({ siteSettings, setSiteSettings, onNotice }: SettingsTabProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminUpdateSiteSettingsFn({ data: siteSettings });
      onNotice("Agency settings saved successfully.");
    } catch (err: any) {
      onNotice(err?.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-white">
          Agency Settings &amp; Leadership Bio
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Configure direct inquiry dispatch coordinates, WhatsApp routing, and executive founder positioning.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-white/[0.08] bg-[#0E0F18]/90 p-7 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Primary Contact Email
            </label>
            <input
              type="email"
              value={siteSettings.contactEmail || ""}
              onChange={(e) =>
                setSiteSettings({ ...siteSettings, contactEmail: e.target.value })
              }
              placeholder="info@thrides.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white focus:border-[#0052FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Phone / WhatsApp Number
            </label>
            <input
              type="text"
              value={siteSettings.phoneWhatsApp || ""}
              onChange={(e) =>
                setSiteSettings({ ...siteSettings, phoneWhatsApp: e.target.value })
              }
              placeholder="+971 52 534 7120"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white focus:border-[#0052FF] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            WhatsApp Direct Action URL
          </label>
          <input
            type="url"
            value={siteSettings.whatsappLink || ""}
            onChange={(e) =>
              setSiteSettings({ ...siteSettings, whatsappLink: e.target.value })
            }
            placeholder="https://wa.me/971525347120"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white focus:border-[#0052FF] focus:outline-none"
          />
        </div>

        <div className="border-t border-white/[0.08] pt-6">
          <div className="mb-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF]">
              LEADERSHIP NARRATIVE
            </span>
            <h3 className="font-display text-base font-bold text-white mt-1">
              Founder Profile ({siteSettings.founder?.name || "Umar Farooq"})
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                Bio Paragraph 1 (Arena &amp; Background)
              </label>
              <textarea
                rows={3}
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
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                Bio Paragraph 2 (Hands-on Seats &amp; Systems)
              </label>
              <textarea
                rows={3}
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
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white focus:border-[#0052FF] focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0043DB] shadow-[0_0_24px_rgba(0,82,255,0.4)] disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save size={15} />
            <span>{isSaving ? "Saving Settings..." : "Save Agency Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
