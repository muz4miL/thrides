"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { WorkPageSettingsDoc } from "@/server/types";

interface WorkClosingCtaProps {
  settings: WorkPageSettingsDoc;
}

export function WorkClosingCta({ settings }: WorkClosingCtaProps) {
  const line1 = settings.closingCtaHeadingLine1 || "Your next chapter.";
  const line2 = settings.closingCtaHeadingLine2 || "Made unmistakable.";
  const copy =
    settings.closingCtaCopy ||
    "Whether scaling to category leadership or expanding across borders, Thrides becomes your strategic partner in creative, digital, and market positioning.";
  const buttonText = settings.closingCtaButtonText || "Book a Strategy Call";
  const destination = settings.closingCtaDestination || "/contact";

  return (
    <section
      aria-label="Work Closing Invitation"
      className="relative overflow-hidden bg-[#070709] py-24 sm:py-32 md:py-40 text-center"
    >
      {/* Ambient background light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[650px] rounded-full bg-[#0052FF]/10 blur-[150px]"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF] animate-pulse" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-300">
              START A CONVERSATION
            </span>
          </div>

          <h2>
            <span className="block font-display text-[clamp(36px,5.5vw,72px)] font-extrabold tracking-[-0.04em] text-white leading-[0.98]">
              {line1}
            </span>
            <span className="block font-serif text-[clamp(36px,5.5vw,72px)] font-normal italic tracking-[-0.025em] text-[#0052FF] mt-1">
              {line2}
            </span>
          </h2>

          <p className="mt-6 text-[15px] sm:text-[17px] text-[#A1A1AA] leading-relaxed max-w-xl mx-auto">
            {copy}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={destination}
              className="group inline-flex items-center gap-2 rounded-full bg-[#0052FF] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:shadow-[0_0_35px_rgba(0,82,255,0.45)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{buttonText}</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-neutral-300 hover:text-white hover:border-white/30 transition-all"
            >
              <span>View Packages & Pricing</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
