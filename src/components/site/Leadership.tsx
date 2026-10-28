"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Shield, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { SectionBadge } from "./SectionBadge";
import { teamMembers } from "@/content/site";

export function Leadership() {
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="leadership"
      aria-label="Executive Leadership Team"
      className="relative w-full overflow-hidden bg-[#060608] pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 border-b border-white/[0.06] select-none scroll-mt-24"
    >
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Header Block matching Defiant */}
        <div className="flex flex-col items-center text-center">
          <SectionBadge>LEADERSHIP</SectionBadge>

          <h2 className="mt-5 font-display text-[clamp(36px,5.2vw,72px)] font-extrabold tracking-[-0.03em] text-white leading-[1.04] max-w-4xl">
            The minds behind <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-white">the machine</span>
          </h2>

          <p className="mt-5 max-w-[760px] font-sans text-[16px] sm:text-[18px] text-[#A1A1AA] leading-relaxed">
            Senior growth practitioners who personally architect strategy and run operations daily. No account managers passing notes to junior contractors.
          </p>
        </div>

        {/* 2 Executive Grand Cards Grid */}
        <div
          className={`mt-14 sm:mt-18 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto transition-all duration-700 ease-out ${
            hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* LEADER 1: Mamoon */}
          <div className="group relative flex flex-col justify-between rounded-[32px] border border-white/[0.08] bg-gradient-to-b from-[#0F0F14] to-[#07070A] p-8 sm:p-10 shadow-2xl transition-all duration-300 hover:border-white/25 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,82,255,0.12)] overflow-hidden">
            {/* Top specular highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#0052FF]/40 to-transparent"
            />

            <div>
              {/* Header: Monogram Avatar + Credentials */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-7 mb-7 border-b border-white/[0.06]">
                <div className="relative flex h-20 w-20 sm:h-22 sm:w-22 shrink-0 items-center justify-center rounded-2xl border border-[#0052FF]/40 bg-gradient-to-b from-[#0052FF]/20 to-[#0052FF]/5 shadow-[0_0_25px_rgba(0,82,255,0.25)]">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#0052FF] select-none">
                    M
                  </span>
                  <span className="absolute -bottom-2.5 rounded-full border border-[#0052FF]/40 bg-[#060608] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0052FF]">
                    Partner
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Strategy Lead
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-[28px] sm:text-[32px] font-extrabold text-white tracking-tight">
                    Mamoon
                  </h3>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0052FF] mt-0.5">
                    Chief Strategist &amp; Growth Architect
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#A1A1AA]">
                A full-stack digital marketer who leads strategy across every Thrides project. He researches market dynamics, architects conversion funnels, and personally verifies every deliverable against commercial business objectives before it reaches you.
              </p>

              {/* Superpowers Pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Market Intelligence",
                  "Full-Funnel CRO",
                  "Performance Attribution",
                  "Unit Economics",
                ].map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] font-medium text-neutral-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Direct Philosophy Quote */}
              <div className="mt-7 rounded-2xl border border-white/[0.06] bg-[#0A0A0F] p-4.5">
                <p className="font-serif italic text-[15px] sm:text-[16px] text-white/90 leading-snug">
                  “Marketing without a mathematical hypothesis is just expensive guesswork. Every move we make has clear commercial intent behind it.”
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between">
              <span className="font-mono text-[12px] text-neutral-400">
                14+ Brands Scaled • 8 Countries
              </span>
              <a
                href="#enquiry"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0052FF] hover:text-white transition-colors"
              >
                <span>Request Strategy Call</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* LEADER 2: Jidran */}
          <div className="group relative flex flex-col justify-between rounded-[32px] border border-white/[0.08] bg-gradient-to-b from-[#0F0F14] to-[#07070A] p-8 sm:p-10 shadow-2xl transition-all duration-300 hover:border-white/25 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,82,255,0.12)] overflow-hidden">
            {/* Top specular highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#0052FF]/40 to-transparent"
            />

            <div>
              {/* Header: Monogram Avatar + Credentials */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-7 mb-7 border-b border-white/[0.06]">
                <div className="relative flex h-20 w-20 sm:h-22 sm:w-22 shrink-0 items-center justify-center rounded-2xl border border-[#0052FF]/40 bg-gradient-to-b from-[#0052FF]/20 to-[#0052FF]/5 shadow-[0_0_25px_rgba(0,82,255,0.25)]">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#0052FF] select-none">
                    J
                  </span>
                  <span className="absolute -bottom-2.5 rounded-full border border-[#0052FF]/40 bg-[#060608] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0052FF]">
                    Partner
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Operations Lead
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-[28px] sm:text-[32px] font-extrabold text-white tracking-tight">
                    Jidran
                  </h3>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0052FF] mt-0.5">
                    Operations Head &amp; Delivery Director
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#A1A1AA]">
                Runs the day-to-day operations and production delivery at Thrides. He keeps every project running on schedule, manages timelines and communication, and ensures every delivery commitment we make is met with zero compromise.
              </p>

              {/* Superpowers Pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Agile Sprint Delivery",
                  "Creative Production",
                  "Client SLA Enforcement",
                  "Execution Workflows",
                ].map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] font-medium text-neutral-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Direct Philosophy Quote */}
              <div className="mt-7 rounded-2xl border border-white/[0.06] bg-[#0A0A0F] p-4.5">
                <p className="font-serif italic text-[15px] sm:text-[16px] text-white/90 leading-snug">
                  “Commitments in writing mean nothing without relentless execution. We run production so our clients never have to wonder where their deliverables are.”
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between">
              <span className="font-mono text-[12px] text-neutral-400">
                100% On-Time Delivery SLA Track Record
              </span>
              <a
                href="#enquiry"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0052FF] hover:text-white transition-colors"
              >
                <span>Schedule Operations Review</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
