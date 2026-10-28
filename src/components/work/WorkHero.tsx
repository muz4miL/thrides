"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { WorkPageSettingsDoc } from "@/server/types";

interface WorkHeroProps {
  settings: WorkPageSettingsDoc;
  featuredSlug?: string | undefined;
  featuredTitle?: string | undefined;
  featuredClient?: string | undefined;
  featuredMediaUrl?: string | undefined;
  featuredMediaType?: "image" | "video" | undefined;
}

export function WorkHero({
  settings,
  featuredSlug,
  featuredTitle,
  featuredClient,
  featuredMediaUrl,
  featuredMediaType = "image",
}: WorkHeroProps) {
  const [mounted, setMounted] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance sequence immediately on mount
    setMounted(true);
  }, []);

  const heroMedia = featuredMediaUrl || settings.heroMediaUrl || "/images/work/work-identity-halo.jpg";
  const heroAnnotation =
    settings.heroProjectAnnotation ||
    (featuredClient ? `${featuredClient} — Digital Experience & Positioning` : "Selected Client Work");
  const heroLink = featuredSlug ? `/our-work/${featuredSlug}` : "#project-index";

  return (
    <section
      aria-label="Editorial Work Showcase"
      className="relative overflow-hidden bg-[#070709] pt-6 sm:pt-8 md:pt-12 pb-16 sm:pb-20 md:pb-28 border-b border-white/[0.07]"
    >
      {/* Subtle architectural ambient blue gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#0052FF]/10 blur-[140px]"
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
        {/* Top Eyebrow & Live Counter */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4 sm:pb-5">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF] animate-pulse" />
            <span className="font-mono text-[11px] sm:text-[12px] font-semibold tracking-[0.18em] uppercase text-neutral-300">
              {settings.heroEyebrow || "SELECTED WORK / THRIDES"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-neutral-300">
            <span>CURATED DIGITAL EXHIBITION</span>
            <span className="text-white/20">•</span>
            <span>8 COUNTRIES</span>
          </div>
        </div>

        {/* Main Asymmetrical Editorial Grid */}
        <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Left Column: Bold Typography & Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="max-w-[700px]">
              {/* Heading line 1 with upward reveal */}
              <div className="overflow-hidden">
                <h1
                  className={`font-display text-[clamp(42px,6.8vw,92px)] font-extrabold tracking-[-0.04em] text-[#F4F4F5] leading-[0.94] transition-all duration-700 ease-out ${
                    mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  {settings.heroHeadingLine1 || "Every appearance."}
                </h1>
              </div>

              {/* Heading line 2 with upward reveal */}
              <div className="overflow-hidden mt-1 sm:mt-2">
                <span
                  style={{ transitionDelay: "120ms" }}
                  className={`block font-serif text-[clamp(42px,6.8vw,92px)] font-normal italic tracking-[-0.025em] text-[#0052FF] leading-[0.96] transition-all duration-700 ease-out ${
                    mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  {settings.heroHeadingLine2 || "On purpose."}
                </span>
              </div>

              {/* Supporting copy */}
              <p
                style={{ transitionDelay: "240ms" }}
                className={`mt-6 sm:mt-8 max-w-[560px] text-[15px] sm:text-[17px] md:text-[18px] text-[#A1A1AA] leading-relaxed transition-all duration-700 ease-out ${
                  mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                {settings.heroSupportingCopy}
              </p>
            </div>

            {/* Quick Navigation and Scroll Trigger */}
            <div
              style={{ transitionDelay: "360ms" }}
              className={`mt-10 sm:mt-12 flex flex-wrap items-center gap-6 transition-all duration-700 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <a
                href="#featured-work"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-xs sm:text-[13px] font-semibold text-white hover:bg-white/[0.09] hover:border-white/30 transition-all cursor-pointer"
              >
                <span>Explore the work</span>
                <ArrowDown
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-y-0.5 text-[#0052FF]"
                />
              </a>

              <a
                href="#project-index"
                className="text-xs sm:text-[13px] font-medium text-neutral-400 hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Jump to all projects
              </a>
            </div>
          </div>

          {/* Right Column: Dominant Hero Featured Visual */}
          <div className="lg:col-span-5 w-full">
            <Link
              href={heroLink}
              className="group relative block overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/10 bg-[#111114] shadow-2xl transition-all duration-500 hover:border-white/25"
            >
              <div
                ref={mediaRef}
                className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4] w-full overflow-hidden"
              >
                {featuredMediaType === "video" ? (
                  <video
                    src={heroMedia}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`h-full w-full object-cover transition-transform duration-1000 ease-out will-change-transform ${
                      mounted ? "scale-100" : "scale-[1.04]"
                    }`}
                  />
                ) : (
                  <img
                    src={heroMedia}
                    alt={featuredTitle || heroAnnotation}
                    className={`h-full w-full object-cover transition-transform duration-1000 ease-out will-change-transform ${
                      mounted ? "scale-100" : "scale-[1.04]"
                    } group-hover:scale-[1.03]`}
                    loading="eager"
                  />
                )}

                {/* Subtle vignette for contrast */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none"
                />

                {/* Floating Bottom Project Annotation */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0052FF] block">
                      FEATURED CASE STUDY
                    </span>
                    <h2 className="mt-1 font-display text-base sm:text-lg font-bold text-white truncate">
                      {featuredTitle || heroAnnotation}
                    </h2>
                  </div>

                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-transform duration-200 group-hover:scale-110 group-hover:bg-[#0052FF]">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
