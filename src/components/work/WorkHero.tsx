"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import type { WorkPageSettingsDoc } from "@/server/types";

interface WorkHeroProps {
  settings: WorkPageSettingsDoc;
  featuredSlug?: string | undefined;
  featuredTitle?: string | undefined;
  featuredClient?: string | undefined;
  featuredMediaUrl?: string | undefined;
  featuredMediaType?: "image" | "video" | undefined;
}

export function WorkHero({ settings }: WorkHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const mediaHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", mediaHandler);

    let rafId: number | null = null;
    const handleScroll = () => {
      if (mq.matches || window.innerWidth < 1024) return;
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        // Desktop scroll parallax restrained to max 20px
        const currentScroll = window.scrollY;
        const offset = Math.min(20, Math.max(0, currentScroll * 0.08));
        setParallaxY(offset);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", mediaHandler);
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const artworkSrc = "/work/midnight-gallery-cobalt-forms.png";

  return (
    <section
      aria-label="Editorial Work Showcase"
      className="relative overflow-hidden bg-[#070709] pt-6 sm:pt-8 md:pt-12 pb-16 sm:pb-20 md:pb-28 border-b border-white/[0.07]"
    >
      {/* Architectural ambient blue glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-[#0A5CFF]/[0.08] blur-[150px]"
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 relative z-10">
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

        {/* Main Composition: Editorial Text on Left, Edge-to-Edge Artwork on Right */}
        <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Bold Typography & Narrative */}
          <div className="lg:col-span-6 relative z-20">
            <div className="relative max-w-[620px]">
              {/* Subtle dark gradient backdrop behind text for optimal legibility */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 sm:-inset-8 -z-10 rounded-3xl bg-gradient-to-r from-[#070709] via-[#070709]/90 to-transparent blur-xl"
              />

              {/* Heading line 1 with upward reveal */}
              <div className="overflow-hidden">
                <h1
                  className={`font-display text-[clamp(42px,6.5vw,90px)] font-extrabold tracking-[-0.04em] text-[#F4F4F5] leading-[0.94] transition-all duration-700 ease-out ${
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
                  className={`block font-serif text-[clamp(42px,6.5vw,90px)] font-normal italic tracking-[-0.025em] text-[#c3d4ff] leading-[0.96] transition-all duration-700 ease-out ${
                    mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  {settings.heroHeadingLine2 || "On purpose."}
                </span>
              </div>

              {/* Supporting copy */}
              <p
                style={{ transitionDelay: "240ms" }}
                className={`mt-6 sm:mt-8 max-w-[540px] text-[15px] sm:text-[17px] md:text-[18px] text-[#A1A1AA] leading-relaxed transition-all duration-700 ease-out ${
                  mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                {settings.heroSupportingCopy ||
                  "We engineer brand positioning, digital platforms, and high-velocity creative campaigns designed to command attention and drive measurable business expansion."}
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
                  className="transition-transform duration-200 group-hover:translate-y-0.5 text-[#0A5CFF]"
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

          {/* Right Column / Mobile Visual: Edge-to-Edge Artwork blending into black background */}
          <div className="lg:col-span-6 w-full relative">
            {/* Parallax & Entrance Wrapper */}
            <div
              style={{
                transform:
                  prefersReducedMotion
                    ? "none"
                    : `translate3d(0, ${parallaxY}px, 0)`,
              }}
              className={`relative w-full overflow-hidden transition-all duration-1000 ease-out will-change-transform ${
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
              }`}
            >
              {/* Desktop Container: maintains 3:2 proportion, blends edge-to-edge into black */}
              <div className="hidden lg:block relative w-full aspect-[3/2] overflow-hidden select-none pointer-events-none">
                <img
                  src={artworkSrc}
                  alt="Midnight Gallery of Cobalt Forms"
                  className="h-full w-full object-contain object-right"
                  loading="eager"
                  decoding="async"
                />

                {/* Left blend mask gradient fading seamlessly into black background */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#070709] via-[#070709]/80 to-transparent"
                />
                {/* Bottom blend mask gradient */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070709] via-[#070709]/60 to-transparent"
                />
                {/* Top blend mask gradient */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#070709] to-transparent"
                />
                {/* Right blend mask gradient */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#070709] to-transparent"
                />
              </div>

              {/* Mobile Container: placed below text, cropped toward right-hand sculpture, zero overflow */}
              <div className="lg:hidden relative w-full h-[320px] sm:h-[420px] overflow-hidden rounded-2xl select-none pointer-events-none">
                <img
                  src={artworkSrc}
                  alt="Midnight Gallery of Cobalt Forms"
                  className="h-full w-full object-cover object-[78%_center]"
                  loading="eager"
                  decoding="async"
                />

                {/* Mobile edge blending gradients */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#070709] to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#070709] to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#070709] to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#070709] to-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
