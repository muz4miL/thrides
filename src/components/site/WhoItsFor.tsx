"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Clock, ChevronDown, Sparkles, X, ShieldCheck } from "lucide-react";
import { packages, type PackageData } from "@/content/site";
import { SectionBadge } from "./SectionBadge";

import ribbon1 from "@/assets/ribbon-fin-1.png";
import ribbon2 from "@/assets/ribbon-fin-2.png";
import ribbon3 from "@/assets/ribbon-fin-3.png";

const ribbonMap: Record<string, any> = {
  kickstart: ribbon1,
  accelerate: ribbon2,
  authority: ribbon3,
};

const indexMap: Record<string, string> = {
  kickstart: "01",
  accelerate: "02",
  authority: "03",
};

export function WhoItsFor() {
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Entrance observer triggered when 20% of section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleToggleDetail = (pkgId: string) => {
    setActiveDetailId((prev) => (prev === pkgId ? null : pkgId));
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      requestAnimationFrame(() => {
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
        card.style.setProperty("--spotlight-opacity", "1");
      });
    }
  };

  const handleCardPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    requestAnimationFrame(() => {
      card.style.setProperty("--spotlight-opacity", "0");
    });
  };

  const activePackage = packages.find((p) => p.id === activeDetailId);

  return (
    <section
      ref={sectionRef}
      id="packages-overview"
      aria-label="Packages Overview"
      className="relative w-full overflow-hidden bg-[#060608] py-16 sm:py-20 select-none border-t border-b border-white/[0.06] scroll-mt-24"
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* 1. Header with Eyebrow, Heading and Subtitle */}
        <div
          className={`flex flex-col items-center text-center max-w-[800px] mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <SectionBadge>PACKAGES</SectionBadge>

          <h2 className="mt-4 text-center">
            <span className="block font-display text-[clamp(36px,4vw,56px)] font-extrabold leading-[1.02] tracking-tight text-white">
              Choose how you{" "}
              <span className="font-serif italic font-normal text-white">
                want to grow
              </span>
            </span>
          </h2>

          <p className="mt-4 text-[15px] sm:text-[17px] text-[#A1A1AA] max-w-[580px] leading-relaxed">
            Start with a package, not a guess. We match your marketing to where your business is today.
          </p>
        </div>

        {/* 2. Three Balanced Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {packages.map((pkg, idx) => {
            const isAccelerate = pkg.id === "accelerate";
            const isSelected = activeDetailId === pkg.id;
            const number = indexMap[pkg.id] || "01";
            const ribbonImg = ribbonMap[pkg.id];
            const remainingCount = Math.max(0, pkg.deliverables.length - 3);

            // Stagger animation timing: 0ms, 90ms, 180ms
            const transitionDelay = `${idx * 90}ms`;

            return (
              <div
                key={pkg.id}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={handleCardPointerLeave}
                style={{
                  transitionDelay: hasEntered ? transitionDelay : "0ms",
                }}
                className={`group relative flex flex-col justify-between rounded-[24px] p-6 sm:p-7 transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 ${
                  hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                } ${
                  isAccelerate
                    ? "bg-gradient-to-b from-[#0A1128] via-[#070B1A] to-[#050713] border border-[#0052FF]/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_35px_rgba(0,82,255,0.16)] hover:border-[#0052FF] hover:shadow-[0_0_45px_rgba(0,82,255,0.28)]"
                    : "bg-[#0C0C10] border border-white/10 hover:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_15px_35px_rgba(0,0,0,0.5)]"
                }`}
              >
                {/* Pointer-Followed Radial Highlight (Fine Pointers) */}
                <div
                  className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition-opacity duration-300"
                  style={{
                    opacity: "var(--spotlight-opacity, 0)",
                    background: `radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${
                      isAccelerate ? "rgba(0, 82, 255, 0.22)" : "rgba(255, 255, 255, 0.08)"
                    }, transparent 70%)`,
                  }}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col flex-1">
                  {/* Top Row: Index and Package Badge */}
                  <div className="flex items-center justify-between min-h-[26px]">
                    <span className="font-mono text-[12px] font-semibold tracking-wider text-neutral-400">
                      {number}
                    </span>

                    {pkg.badge && (
                      <div
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isAccelerate
                            ? "bg-[#0052FF] text-white shadow-sm shadow-[#0052FF]/30"
                            : "border border-white/15 bg-white/5 text-neutral-300"
                        }`}
                      >
                        {isAccelerate && <Sparkles size={10} />}
                        <span>{pkg.badge}</span>
                      </div>
                    )}
                  </div>

                  {/* Title and 88x88px Transparent Motif Container */}
                  <div className="mt-3 flex items-start justify-between gap-3 min-h-[92px]">
                    <div className="flex flex-col justify-center pt-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                        {pkg.tagline}
                      </span>
                      <h3 className="mt-1 font-display text-[26px] sm:text-[28px] font-extrabold tracking-tight text-white leading-tight">
                        {pkg.name}
                      </h3>
                    </div>

                    {/* Compact 88x88px Transparent Artwork Motif */}
                    <div className="relative h-[80px] w-[80px] sm:h-[88px] sm:w-[88px] shrink-0 flex items-center justify-center pointer-events-none">
                      <img
                        src={typeof ribbonImg === "string" ? ribbonImg : ribbonImg?.src || ""}
                        alt=""
                        className="h-full w-full object-contain select-none transition-all duration-250 ease-out group-hover:-translate-y-[3px] group-hover:drop-shadow-[0_8px_18px_rgba(0,82,255,0.45)]"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Short Outcome Description */}
                  <p className="text-[14px] sm:text-[15px] font-normal leading-relaxed text-neutral-300 min-h-[44px]">
                    {pkg.heading}
                  </p>

                  {/* Subtle Divider */}
                  <div className="border-t border-white/10 my-4" />

                  {/* Key 3 Deliverables */}
                  <div className="flex-1">
                    <ul className="space-y-2">
                      {pkg.deliverables.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[14px] text-neutral-200">
                          <span
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                              isAccelerate
                                ? "border-[#0052FF] text-[#0052FF]"
                                : "border-white/30 text-white/80"
                            }`}
                          >
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* View Full Package Disclosure Trigger */}
                    <button
                      type="button"
                      onClick={() => handleToggleDetail(pkg.id)}
                      aria-expanded={isSelected}
                      aria-controls={`package-detail-${pkg.id}`}
                      className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#0052FF] rounded"
                    >
                      <span>
                        {isSelected
                          ? "Hide package details"
                          : `View full package (+${remainingCount} more)`}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-250 ${
                          isSelected ? "rotate-180 text-[#0052FF]" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile Only: Inline accordion disclosure directly beneath card */}
                    <div
                      id={`package-detail-${pkg.id}`}
                      className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
                        isSelected ? "max-h-[500px] opacity-100 mt-4 pt-3 border-t border-white/10" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="rounded-xl bg-white/[0.04] p-3 text-[12px] text-neutral-300 mb-3 border border-white/5">
                        <span className="text-white font-semibold">The problem:</span> {pkg.theProblem}
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        All Deliverables:
                      </p>
                      <ul className="space-y-1.5">
                        {pkg.deliverables.slice(3).map((d, di) => (
                          <li key={di} className="flex items-start gap-2 text-[12px] text-neutral-300">
                            <span className="text-[#0052FF] mt-0.5">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-[11px] text-neutral-400 italic">
                        Promise: {pkg.promise}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Anchored Area: Timeline, Price and CTA */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-[12px] text-neutral-400 mb-3.5">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-neutral-500" />
                      <span>{pkg.timeline}</span>
                    </div>
                    <span className="font-medium text-neutral-300">{pkg.investment}</span>
                  </div>

                  <a
                    href={`/contact?package=${pkg.id}`}
                    aria-label={`Select ${pkg.name} package`}
                    className={`group/btn inline-flex w-full h-[48px] items-center justify-center gap-2 rounded-full font-bold text-[14px] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white select-none ${
                      isAccelerate
                        ? "bg-[#0052FF] text-white hover:bg-[#0043DB] shadow-md shadow-[#0052FF]/25 hover:scale-[1.01]"
                        : "bg-[#15151B] border border-white/15 text-white hover:bg-white/10 hover:border-white/30 hover:scale-[1.01]"
                    }`}
                  >
                    <span>{pkg.ctaText}</span>
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-200 group-hover/btn:translate-x-[3px] group-hover/btn:-translate-y-[3px]"
                      strokeWidth={2.5}
                    />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Desktop Full-Width Detail Area (Opens smoothly below the cards without stretching them) */}
        {activePackage && (
          <div
            id={`desktop-package-detail-${activePackage.id}`}
            className="hidden md:block mt-6 rounded-[24px] border border-white/12 bg-[#0C0C12] p-6 lg:p-8 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] font-semibold text-[#0052FF]">
                  {indexMap[activePackage.id]}
                </span>
                <h4 className="font-display text-[20px] font-bold text-white">
                  {activePackage.name} — Full Deliverables & Scope
                </h4>
                {activePackage.badge && (
                  <span className="rounded-full bg-[#0052FF]/20 border border-[#0052FF]/40 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                    {activePackage.badge}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveDetailId(null)}
                aria-label="Close details"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Problem Inset */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Target Challenge:
                </span>
                <p className="mt-2 text-[14px] leading-relaxed text-neutral-200 font-medium">
                  "{activePackage.theProblem}"
                </p>
                <div className="mt-4 pt-3 border-t border-white/5 text-[12px] text-neutral-400">
                  <span className="text-white font-semibold">Our Guarantee:</span> {activePackage.promise}
                </div>
              </div>

              {/* Complete Deliverables Checklist */}
              <div className="lg:col-span-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                  All Included Deliverables ({activePackage.deliverables.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activePackage.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-[13px] text-neutral-200 rounded-lg bg-black/25 p-2.5 border border-white/5"
                    >
                      <Check size={14} className="text-[#0052FF] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="text-[13px] text-neutral-400">
                    <span>Payment: <strong className="text-white font-medium">{activePackage.payment}</strong></span>
                    <span className="mx-2">•</span>
                    <span>Timeline: <strong className="text-white font-medium">{activePackage.timeline}</strong></span>
                  </div>

                  <a
                    href={`/contact?package=${activePackage.id}`}
                    className="inline-flex h-[42px] items-center justify-center gap-1.5 rounded-full bg-[#0052FF] px-6 text-[13px] font-bold text-white hover:bg-[#0043DB] transition-all"
                  >
                    <span>{activePackage.ctaText}</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Bottom Comparison and Strategy Call Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 border-t border-white/10 pt-8 text-center sm:text-left">
          <span className="font-serif text-[22px] sm:text-[26px] italic text-neutral-200">
            Not sure which fits?
          </span>

          <span className="hidden sm:inline-block h-4 w-px bg-white/20" aria-hidden="true" />

          <a
            href="/contact"
            className="group/link inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold text-white hover:text-[#0052FF] transition-colors"
          >
            <span>Book a free strategy call</span>
            <ArrowUpRight
              size={15}
              className="stroke-[2.5] transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />
          </a>

          <span className="hidden sm:inline-block h-4 w-px bg-white/20" aria-hidden="true" />

          <a
            href="/services#packages"
            className="text-[13px] text-neutral-400 hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Compare All Deliverables Matrix
          </a>
        </div>
      </div>
    </section>
  );
}
