"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, TrendingUp, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { WorkProjectDoc } from "@/server/types";

// Register ScrollTrigger safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface WorkFeaturedPinnedProps {
  projects: WorkProjectDoc[];
}

export function WorkFeaturedPinned({ projects }: WorkFeaturedPinnedProps) {
  // Feature between 2 and 4 projects
  const featured = projects.filter((p) => p.isFeatured).slice(0, 4);
  const displayProjects = featured.length >= 2 ? featured : projects.slice(0, 3);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinnedSupported, setIsPinnedSupported] = useState(false);

  useEffect(() => {
    // If fewer than 2 projects, or if reduced motion is preferred, keep static presentation
    if (displayProjects.length < 2) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // Only enable GSAP ScrollTrigger pinning on desktop viewports with sufficient height
    mm.add("(min-width: 1024px) and (min-height: 650px)", () => {
      setIsPinnedSupported(true);
      const container = containerRef.current;
      const stage = stageRef.current;
      if (!container || !stage) return;

      const numTransitions = displayProjects.length - 1;
      const scrollPerTransition = window.innerHeight * 0.75;
      const totalScroll = numTransitions * scrollPerTransition;

      // Pin the stage
      const trigger = ScrollTrigger.create({
        trigger: container,
        pin: stage,
        start: "top 72px",
        end: `+=${totalScroll}`,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const rawIndex = Math.round(self.progress * numTransitions);
          const clamped = Math.max(0, Math.min(numTransitions, rawIndex));
          setActiveIndex(clamped);
        },
      });

      return () => {
        trigger.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, [displayProjects.length]);

  if (displayProjects.length === 0) return null;

  const currentProject = displayProjects[activeIndex] ?? displayProjects[0];
  if (!currentProject) return null;

  return (
    <section
      id="featured-work"
      aria-label="Featured Projects Sequence"
      ref={containerRef}
      className="relative bg-[#070709] border-b border-white/[0.08]"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP PINNED CINEMATIC STAGE (GSAP ScrollTrigger)
         ───────────────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className="hidden lg:flex min-h-[calc(100vh-80px)] w-full flex-col justify-center py-8 select-none"
      >
        <div className="mx-auto w-full max-w-[1440px] px-8">
          {/* Section Header & Interactive Progress */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#0052FF] uppercase tracking-widest">
                SIGNATURE WORK
              </span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-xs text-neutral-400">
                CASE {String(activeIndex + 1).padStart(2, "0")} / {String(displayProjects.length).padStart(2, "0")}
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="flex items-center gap-2">
              {displayProjects.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    i === activeIndex
                      ? "w-10 bg-[#0052FF]"
                      : i < activeIndex
                      ? "w-3 bg-white/40"
                      : "w-3 bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main 2-Column Split: Dynamic Narrative & Synchronized Visual */}
          <div className="grid grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 mb-4">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0052FF]">
                    {currentProject.industry}
                  </span>
                </div>

                <h3 className="font-display text-[clamp(28px,3vw,42px)] font-extrabold text-white leading-[1.08] tracking-[-0.03em]">
                  {currentProject.title}
                </h3>

                <p className="mt-4 text-[15px] leading-relaxed text-[#A1A1AA] line-clamp-3">
                  {currentProject.summary}
                </p>
              </div>

              {/* Verified Results Snippet */}
              {currentProject.results && currentProject.results.length > 0 && (
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-white/[0.08]">
                  {currentProject.results.slice(0, 2).map((res, i) => (
                    <div key={i}>
                      <span className="font-display text-2xl font-black text-white tracking-tight">
                        {res.metric}
                      </span>
                      <span className="block font-mono text-[11px] text-neutral-400 uppercase tracking-wider mt-0.5">
                        {res.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Services Tags */}
              <div className="flex flex-wrap gap-2">
                {currentProject.services.slice(0, 3).map((srv, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-white/5 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-neutral-300"
                  >
                    {srv}
                  </span>
                ))}
              </div>

              {/* Working Case Study CTA */}
              <div className="pt-2">
                <Link
                  href={`/our-work/${currentProject.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#0052FF] px-6 py-3 text-xs font-bold text-white transition-all hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(0,82,255,0.4)]"
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Right Media Stage Column */}
            <div className="col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#111114] shadow-2xl">
                {displayProjects.map((p, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <div
                      key={p.slug}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${
                        isCurrent
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-105 pointer-events-none"
                      }`}
                    >
                      {p.mediaType === "video" ? (
                        <video
                          src={p.heroMediaUrl}
                          poster={p.posterUrl || p.thumbnailUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={p.heroMediaUrl || p.thumbnailUrl}
                          alt={p.title}
                          className="h-full w-full object-cover"
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                      )}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE & TABLET STACKED PANELS (Accessible, No Pinning Trap)
         ───────────────────────────────────────────────────────────── */}
      <div className="lg:hidden py-14 px-4 sm:px-6">
        <div className="border-b border-white/[0.08] pb-4 mb-8">
          <span className="font-mono text-xs font-bold text-[#0052FF] uppercase tracking-widest block">
            FEATURED CASE STUDIES
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
            Curated Client Milestones
          </h2>
        </div>

        <div className="space-y-12">
          {displayProjects.map((project, idx) => (
            <article
              key={project.slug}
              className="flex flex-col rounded-[24px] border border-white/[0.08] bg-[#111114] overflow-hidden"
            >
              {/* Media Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                {project.mediaType === "video" ? (
                  <video
                    src={project.heroMediaUrl}
                    poster={project.posterUrl || project.thumbnailUrl}
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={project.heroMediaUrl || project.thumbnailUrl}
                    alt={project.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 font-mono text-[10px] font-bold text-white border border-white/10">
                  {project.industry}
                </div>
              </div>

              {/* Metadata & Actions */}
              <div className="p-6">
                <span className="font-mono text-[11px] text-neutral-400">
                  CASE 0{idx + 1} • {project.year}
                </span>
                <h3 className="mt-1 font-display text-xl font-bold text-white leading-snug">
                  {project.title}
                </h3>
                <p className="mt-3 text-[14px] text-neutral-400 leading-relaxed">
                  {project.summary}
                </p>

                {/* Results Preview */}
                {project.results && project.results.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 py-3 border-t border-b border-white/[0.06]">
                    {project.results.slice(0, 2).map((res, i) => (
                      <div key={i}>
                        <span className="font-display text-xl font-extrabold text-white">
                          {res.metric}
                        </span>
                        <span className="block font-mono text-[10px] text-neutral-400 uppercase">
                          {res.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-medium">
                    {project.clientName}
                  </span>
                  <Link
                    href={`/our-work/${project.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0052FF] px-4 py-2 text-xs font-bold text-white"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
