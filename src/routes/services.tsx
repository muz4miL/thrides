import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HeroButton } from "@/components/site/HeroButton";
import FAQ from "@/components/FAQ";
import {
  ArrowUpRight,
  Check,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  packages,
  packageComparisonRows,
  services,
  whatHappensWhenYouJoin,
  whatItsLikeToWork,
} from "@/content/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Packages | Thrides Growth Engine" },
      {
        name: "description",
        content:
          "Start where you are. Grow from there. Dedicated marketing packages for every stage: Kickstart, Accelerate, and Authority.",
      },
      {
        property: "og:title",
        content: "Services & Packages | Thrides Growth Engine",
      },
      {
        property: "og:description",
        content:
          "Start where you are. Grow from there. Dedicated marketing packages for every stage: Kickstart, Accelerate, and Authority.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [showComparison, setShowComparison] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});

  // Mobile Comparison Selectors (default Kickstart vs Accelerate)
  const [comparePkgA, setComparePkgA] = useState<string>("kickstart");
  const [comparePkgB, setComparePkgB] = useState<string>("accelerate");

  // Service Explorer State (Desktop tabs & Mobile accordion)
  const [activeServiceId, setActiveServiceId] = useState<string>(services[0]?.id || "marketing-consultancy");
  const [mobileExpandedService, setMobileExpandedService] = useState<string | null>(services[0]?.id || "marketing-consultancy");

  const [heroEntered, setHeroEntered] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const togglePackageExpanded = (id: string) => {
    setExpandedPackages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectCompareA = (pkgId: string) => {
    setComparePkgA(pkgId);
    if (pkgId === comparePkgB) {
      // Auto-switch B to another package so they are never identical
      const fallback = packages.find((p) => p.id !== pkgId)?.id || "accelerate";
      setComparePkgB(fallback);
    }
  };

  const handleSelectCompareB = (pkgId: string) => {
    setComparePkgB(pkgId);
    if (pkgId === comparePkgA) {
      const fallback = packages.find((p) => p.id !== pkgId)?.id || "kickstart";
      setComparePkgA(fallback);
    }
  };

  const handleSeeWhichPackageIncludes = (svcId: string) => {
    setShowComparison(true);
    const featureMap: Record<string, string> = {
      "marketing-consultancy": "feature-strategy",
      "website-development": "feature-website",
      "content-creation": "feature-social-content",
      "social-media-marketing": "feature-social-content",
      "seo": "feature-seo",
      "email-marketing": "feature-email-marketing",
    };

    const targetId = featureMap[svcId] || "package-comparison";
    setHighlightedRow(targetId);

    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);

    setTimeout(() => {
      setHighlightedRow(null);
    }, 3200);
  };

  const activeService = services.find((s) => s.id === activeServiceId) || services[0];
  const pkgAData = packages.find((p) => p.id === comparePkgA) || packages[0];
  const pkgBData = packages.find((p) => p.id === comparePkgB) || packages[1];

  return (
    <div className="min-h-screen bg-[#08080B] text-white selection:bg-[#0052FF] selection:text-white">
      {/* Global Navigation Header */}
      <Header />

      <main className="flex flex-col">
        {/* ========================================================
            1. REFINED CINEMATIC SERVICES HERO
           ======================================================== */}
        <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-4 md:px-6 pt-2 pb-4">
          <section
            ref={heroRef}
            id="services-hero"
            aria-label="Services & Packages Hero Overview"
            className="relative mx-auto w-full overflow-hidden rounded-[36px] sm:rounded-[44px] md:rounded-[52px] bg-[#000000] border border-white/[0.08] min-h-[560px] lg:h-[calc(100vh-160px)] lg:min-h-[620px] lg:max-h-[700px] shadow-2xl flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 select-none"
          >
            {/* Background Artwork - servicehero.png */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src="/servicehero.png"
                alt=""
                aria-hidden="true"
                className={`h-full w-full object-cover object-bottom transition-transform duration-1000 ease-out will-change-transform motion-reduce:transform-none ${
                  heroEntered ? "scale-100" : "scale-105"
                }`}
                loading="eager"
              />
              {/* Restrained dark vignette ensuring crisp readability while preserving metallic ribbon detail */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-[#000000]/75 via-[#000000]/30 to-[#000000]/85"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#000000_90%)] opacity-70"
              />
            </div>

            {/* Content Container (Centered in dark negative space) */}
            <div className="relative z-10 flex flex-col items-center max-w-4xl">
              {/* Restrained Eyebrow */}
              <div
                style={{
                  transitionDelay: heroEntered ? "0ms" : "0ms",
                }}
                className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                  heroEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF] animate-pulse" />
                <span className="font-mono text-[11px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-neutral-300">
                  SERVICES &amp; PACKAGES
                </span>
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  transitionDelay: heroEntered ? "80ms" : "0ms",
                }}
                className={`mt-4 sm:mt-5 select-none font-display text-[clamp(40px,5.8vw,86px)] font-extrabold tracking-[-0.04em] text-[#F4F4F5] leading-[0.96] transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                  heroEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="block">Start where you are.</span>
                <span className="block font-serif font-normal italic tracking-[-0.025em] text-[#0052FF] mt-1 sm:mt-2">
                  Grow from there.
                </span>
              </h1>

              {/* Supporting Paragraph */}
              <p
                style={{
                  transitionDelay: heroEntered ? "160ms" : "0ms",
                }}
                className={`mt-4 sm:mt-5 max-w-[580px] font-sans text-[15px] sm:text-[17px] text-[#A1A1AA] leading-relaxed transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                  heroEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Choose the support your business needs today. We’ll bring the strategy, creative, and execution to help you grow.
              </p>

              {/* CTAs */}
              <div
                style={{
                  transitionDelay: heroEntered ? "240ms" : "0ms",
                }}
                className={`mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                  heroEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {/* Primary CTA reusing the exact homepage HeroButton */}
                <HeroButton
                  href="/contact"
                  leftText="Book a"
                  rightText="Free Strategy Call"
                  ariaLabel="Book a Free Strategy Call"
                />

                {/* Secondary CTA: Explore Packages */}
                <a
                  href="#packages"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-[14px] sm:text-[15px] font-semibold text-neutral-300 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white focus-visible:outline-2 focus-visible:outline-[#0052FF] cursor-pointer"
                >
                  <span>Explore Packages</span>
                  <ChevronDown
                    size={16}
                    className="text-neutral-400 transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-white"
                  />
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* ========================================================
            2. GROWTH STAGES — THE MAIN DECISION SECTION
           ======================================================== */}
        <section
          id="packages"
          className="scroll-mt-28 py-20 md:py-28 bg-[#08080B]"
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#0052FF]">
                <Sparkles size={13} className="text-[#0052FF]" />
                <span>Growth Stages</span>
              </div>

              <h2 className="mt-3.5 font-display text-[clamp(32px,4vw,54px)] font-extrabold tracking-tight text-white leading-tight">
                Start with a package,{" "}
                <span className="font-serif italic font-normal text-white">
                  not a guess
                </span>
              </h2>

              <p className="mt-3 text-[15px] sm:text-[16px] text-neutral-400 leading-relaxed">
                Clear scope, fixed timelines, and verified deliverables. Select your current growth stage and expand as pipeline demands.
              </p>
            </div>

            {/* 3 Packages Composition (Aligned baseline, independent card expansion) */}
            <div className="mt-12 sm:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {packages.map((pkg, idx) => {
                const isAccelerate = pkg.id === "accelerate";
                const isAuthority = pkg.id === "authority";
                const isExpanded = !!expandedPackages[pkg.id];
                const stageNum = `0${idx + 1}`;

                // Selection of decision-relevant key deliverables
                const keyDeliverables = isAccelerate
                  ? pkg.deliverables.slice(0, 4)
                  : isAuthority
                  ? pkg.deliverables.slice(0, 4)
                  : pkg.deliverables.slice(0, 3);

                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-[32px] border transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between shadow-2xl ${
                      isAccelerate
                        ? "border-[#0052FF]/60 bg-gradient-to-b from-[#0F1428] via-[#0B0F1E] to-[#070A14] shadow-[0_0_35px_rgba(0,82,255,0.2)] ring-1 ring-[#0052FF]/40"
                        : isAuthority
                        ? "border-white/[0.12] bg-[#0C0D12] hover:border-white/25"
                        : "border-white/[0.08] bg-[#0A0A0E] hover:border-white/20"
                    }`}
                  >
                    {/* Top specular highlight */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    />

                    {/* Most Popular Label for Accelerate */}
                    {isAccelerate && (
                      <div className="absolute -top-3.5 right-6 sm:right-8 inline-flex items-center gap-1.5 rounded-full bg-[#0052FF] px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(0,82,255,0.5)]">
                        <Sparkles size={11} />
                        <span>Most Popular</span>
                      </div>
                    )}

                    {/* Authority Custom Indicator */}
                    {isAuthority && (
                      <div className="absolute -top-3.5 right-6 sm:right-8 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#161722] px-3 py-1 text-[11px] font-mono font-medium text-neutral-300">
                        <span>Custom Scaled</span>
                      </div>
                    )}

                    {/* Header Info */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0052FF]">
                          {stageNum} / {pkg.name}
                        </span>
                      </div>

                      {/* Quoted Customer Situation */}
                      <p className="mt-2 font-serif italic text-[14px] text-neutral-400 leading-snug">
                        {pkg.tagline}
                      </p>

                      {/* Approved One-Sentence Outcome */}
                      <h3 className="mt-3 font-display text-[22px] sm:text-[24px] font-bold text-white tracking-tight leading-snug">
                        {pkg.heading}
                      </h3>

                      {/* Compact Decision-Relevant Deliverables */}
                      <div className="mt-5 pt-4 border-t border-white/[0.08]">
                        <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-400 block mb-2.5">
                          Core Inclusions
                        </span>
                        <ul className="space-y-2">
                          {keyDeliverables.map((del, dIdx) => (
                            <li
                              key={dIdx}
                              className="flex items-start gap-2 text-[13px] text-neutral-300 leading-snug"
                            >
                              <Check
                                size={14}
                                className="text-[#0052FF] shrink-0 mt-0.5"
                              />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Compact Timeline & Payment Information Row with Fine Divider */}
                      <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#06070B] p-3 flex items-center justify-between text-xs font-mono">
                        <div className="pr-2">
                          <span className="block text-[10px] text-neutral-500 uppercase">
                            Timeline
                          </span>
                          <span className="text-white font-medium text-[11.5px] line-clamp-1">
                            {pkg.timeline}
                          </span>
                        </div>
                        <div className="h-6 w-[1px] bg-white/10 shrink-0" />
                        <div className="pl-3">
                          <span className="block text-[10px] text-neutral-500 uppercase">
                            Payment
                          </span>
                          <span className="text-white font-medium text-[11.5px] line-clamp-1">
                            {pkg.payment}
                          </span>
                        </div>
                      </div>

                      {/* Full Package Details Disclosure */}
                      {isExpanded && (
                        <div
                          id={`pkg-details-${pkg.id}`}
                          className="mt-5 pt-4 border-t border-white/[0.08] space-y-4 animate-in fade-in duration-200"
                        >
                          {/* The Problem Statement */}
                          <div className="rounded-xl bg-[#08090D] border border-white/[0.06] p-3 text-[12.5px] text-neutral-300 leading-relaxed">
                            <span className="font-bold text-white">The problem: </span>
                            {pkg.theProblem}
                          </div>

                          {/* Full Deliverables List */}
                          <div>
                            <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                              Full Deliverables List ({pkg.deliverables.length})
                            </span>
                            <ul className="space-y-2">
                              {pkg.deliverables.map((del, fullIdx) => (
                                <li
                                  key={fullIdx}
                                  className="flex items-start gap-2 text-[12.5px] text-neutral-300 leading-snug"
                                >
                                  <Check
                                    size={13}
                                    className="text-emerald-400 shrink-0 mt-0.5"
                                  />
                                  <span>{del}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Guarantee / Promise */}
                          <div className="pt-2 text-[12px] leading-relaxed text-neutral-400 italic">
                            <span className="font-semibold not-italic text-neutral-300">
                              Our promise:{" "}
                            </span>
                            {pkg.promise}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA, Pricing & Disclosure Toggle */}
                    <div className="mt-6 pt-5 border-t border-white/[0.08]">
                      {/* Prominent Investment Language */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
                          Investment
                        </span>
                        <span className="font-mono text-[13px] font-bold text-white">
                          {isAuthority ? "Custom, confirmed on your call" : "Enquire for pricing"}
                        </span>
                      </div>

                      {/* Primary Package CTA */}
                      <a
                        href={`/contact?package=${pkg.id}`}
                        className={`inline-flex w-full h-[48px] sm:h-[50px] items-center justify-center gap-2 rounded-full font-bold text-[14px] transition-all cursor-pointer ${
                          isAccelerate
                            ? "bg-[#0052FF] text-white hover:bg-[#0043DB] shadow-[0_0_18px_rgba(0,82,255,0.4)]"
                            : "bg-white/[0.06] text-white hover:bg-white/[0.12] border border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span>{pkg.ctaText}</span>
                        <ArrowUpRight size={15} className="stroke-[2.5]" />
                      </a>

                      {/* View Full Package Disclosure Button */}
                      <button
                        type="button"
                        onClick={() => togglePackageExpanded(pkg.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`pkg-details-${pkg.id}`}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? "Hide full details" : "View full package"}</span>
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ========================================================
                3. HELP VISITORS CHOOSE (ASSISTANCE STRIP)
               ======================================================== */}
            <div className="mt-12 sm:mt-14 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#0B0D18] via-[#0E1328] to-[#080A12] p-7 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-xl text-center md:text-left">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#0052FF]">
                  Guidance &amp; Discovery
                </span>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
                  Not sure which fits?
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Tell us where your business is today and we’ll recommend the right one on a free call.
                </p>
              </div>

              <div className="relative z-10 shrink-0 w-full sm:w-auto flex justify-center">
                <HeroButton
                  href="/contact"
                  leftText="Book a"
                  rightText="Free Strategy Call"
                  ariaLabel="Book a Free Strategy Call"
                />
              </div>
            </div>

            {/* ========================================================
                4. PACKAGE COMPARISON — USEFUL ON EVERY SCREEN
               ======================================================== */}
            <div id="package-comparison" className="mt-16 sm:mt-24 scroll-mt-28">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Compare Packages
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    Side-by-side breakdown of scope, research depths, deliverables, and timelines.
                  </p>
                </div>

                {/* Show/Hide Comparison Real Button */}
                <button
                  type="button"
                  onClick={() => setShowComparison((s) => !s)}
                  aria-expanded={showComparison}
                  aria-controls="comparison-matrix-container"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs font-bold text-[#0052FF] hover:text-blue-400 hover:bg-white/[0.08] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Layers size={14} />
                  <span>{showComparison ? "Hide comparison" : "Show comparison"}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      showComparison ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {showComparison && (
                <div
                  id="comparison-matrix-container"
                  className="animate-in fade-in duration-300"
                >
                  {/* DESKTOP TABLE (>= 768px / md) */}
                  <div className="hidden md:block overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#0C0C10] shadow-2xl">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-[#07070A] sticky top-0 z-10">
                          <th className="py-4 px-6 font-display font-bold text-white w-1/4">
                            Feature / Scope
                          </th>
                          <th className="py-4 px-6 font-display font-bold text-white w-1/4">
                            01 / Kickstart
                          </th>
                          <th className="py-4 px-6 font-display font-black text-[#0052FF] bg-[#0052FF]/[0.08] w-1/4">
                            02 / Accelerate (Featured)
                          </th>
                          <th className="py-4 px-6 font-display font-bold text-white w-1/4">
                            03 / Authority
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {packageComparisonRows.map((row, idx) => {
                          const rowSlugMap: Record<string, string> = {
                            "Strategy": "feature-strategy",
                            "Website": "feature-website",
                            "Social & Content": "feature-social-content",
                            "Paid Campaigns": "feature-paid-campaigns",
                            "SEO": "feature-seo",
                            "Email Marketing": "feature-email-marketing",
                          };
                          const rowId = rowSlugMap[row.feature] || `row-${idx}`;
                          const isHighlighted = highlightedRow === rowId;

                          return (
                            <tr
                              key={idx}
                              id={rowId}
                              className={`transition-colors duration-300 ${
                                isHighlighted
                                  ? "bg-[#0052FF]/20 ring-1 ring-[#0052FF]"
                                  : idx % 2 === 0
                                  ? "bg-[#0C0C10]"
                                  : "bg-[#0E0E14]"
                              }`}
                            >
                              <td className="py-4 px-6 font-semibold text-neutral-200">
                                {row.feature}
                              </td>
                              <td className="py-4 px-6 text-neutral-400">
                                {row.kickstart}
                              </td>
                              <td className="py-4 px-6 font-medium text-white bg-[#0052FF]/[0.04]">
                                {row.accelerate}
                              </td>
                              <td className="py-4 px-6 text-neutral-400">
                                {row.authority}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE INTERACTIVE COMPARISON (< 768px) */}
                  <div className="block md:hidden space-y-4">
                    {/* Dual Package Selectors */}
                    <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl border border-white/[0.08] bg-[#0C0C10]">
                      <div>
                        <span className="block font-mono text-[10px] uppercase text-neutral-400 mb-1.5 font-bold">
                          Compare:
                        </span>
                        <div className="space-y-1">
                          {packages.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleSelectCompareA(p.id)}
                              className={`w-full py-1.5 px-2 rounded-lg text-left text-xs font-mono font-bold transition-all ${
                                comparePkgA === p.id
                                  ? "bg-[#0052FF] text-white"
                                  : "bg-white/[0.03] text-neutral-400 hover:text-white"
                              }`}
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="block font-mono text-[10px] uppercase text-neutral-400 mb-1.5 font-bold">
                          Against:
                        </span>
                        <div className="space-y-1">
                          {packages.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleSelectCompareB(p.id)}
                              className={`w-full py-1.5 px-2 rounded-lg text-left text-xs font-mono font-bold transition-all ${
                                comparePkgB === p.id
                                  ? "bg-[#0052FF] text-white"
                                  : "bg-white/[0.03] text-neutral-400 hover:text-white"
                              }`}
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stacked Feature Rows for Selected Pair */}
                    <div className="space-y-2.5">
                      {packageComparisonRows.map((row, idx) => {
                        const valA = row[comparePkgA as keyof typeof row];
                        const valB = row[comparePkgB as keyof typeof row];

                        return (
                          <div
                            key={idx}
                            className="rounded-xl border border-white/[0.07] bg-[#0A0B10] p-3.5"
                          >
                            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0052FF] block mb-2">
                              {row.feature}
                            </span>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="border-r border-white/10 pr-2">
                                <span className="block text-[10px] font-mono text-neutral-500 mb-0.5">
                                  {pkgAData.name}
                                </span>
                                <span className="text-white font-medium">
                                  {valA}
                                </span>
                              </div>
                              <div className="pl-1">
                                <span className="block text-[10px] font-mono text-neutral-500 mb-0.5">
                                  {pkgBData.name}
                                </span>
                                <span className="text-white font-medium">
                                  {valB}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================
            5. HOW IT WORKS — EDITORIAL, NOT THREE MORE CARDS
           ======================================================== */}
        <section className="py-20 md:py-28 bg-[#060608] border-t border-b border-white/[0.06]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#0052FF]">
                <span>02 • Simple Process</span>
              </div>

              <h2 className="mt-3.5 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                How It Works
              </h2>
            </div>

            {/* DESKTOP: Horizontal Editorial Sequence with Oversized Numbers */}
            <div className="hidden md:grid md:grid-cols-3 gap-8 mt-14 relative">
              {/* Fine connecting horizontal rule */}
              <div
                aria-hidden="true"
                className="absolute top-8 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
              />

              {[
                {
                  step: "01",
                  title: "Free strategy call",
                  desc: "30 minutes. We review your current marketing, market positioning, and commercial levers.",
                },
                {
                  step: "02",
                  title: "Your plan",
                  desc: "We recommend the package and priorities that will make the biggest difference.",
                },
                {
                  step: "03",
                  title: "We build",
                  desc: "You get a clear timeline, delivery dates, and a proper kickoff.",
                },
              ].map((item) => (
                <div key={item.step} className="relative z-10 flex flex-col">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-6xl lg:text-7xl font-black text-white/10 select-none">
                      {item.step}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#0052FF]" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-neutral-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* MOBILE: Vertical sequence with connecting line (< 768px) */}
            <div className="block md:hidden mt-10 space-y-8 relative pl-6 border-l border-white/15 ml-3">
              {[
                {
                  step: "01",
                  title: "Free strategy call",
                  desc: "30 minutes. We review your current marketing, market positioning, and commercial levers.",
                },
                {
                  step: "02",
                  title: "Your plan",
                  desc: "We recommend the package and priorities that will make the biggest difference.",
                },
                {
                  step: "03",
                  title: "We build",
                  desc: "You get a clear timeline, delivery dates, and a proper kickoff.",
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-[#0052FF] ring-4 ring-[#060608]" />
                  <span className="font-mono text-xs font-bold text-[#0052FF] uppercase">
                    Step {item.step}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* ========================================================
                6. CLIENT ONBOARDING — CLEAR AND REASSURING
               ======================================================== */}
            <div className="mt-24 pt-16 border-t border-white/[0.08]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left: Section Heading and Restrained Visual Anchor */}
                <div className="lg:col-span-5">
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#0052FF]">
                    03 • Client Onboarding
                  </span>
                  <h3 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    A smooth start, because the first two weeks set the tone
                  </h3>
                  <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
                    No guesswork, no communication black holes. We establish structured check-ins, rapid feedback loops, and clear delivery roadmaps from day one.
                  </p>

                  <div className="mt-8 hidden lg:flex items-center gap-3 p-4 rounded-2xl border border-white/[0.07] bg-[#0B0D14]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052FF] text-white font-black text-lg shadow-[0_0_15px_rgba(0,82,255,0.5)]">
                      t.
                    </div>
                    <div>
                      <span className="font-display font-bold text-sm text-white block">
                        On-Purpose Kickoff
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        Structured 14-day momentum guarantee
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Four Neatly Structured Rows with Fine Rules */}
                <div className="lg:col-span-7 divide-y divide-white/[0.08]">
                  {whatHappensWhenYouJoin.map((item, idx) => (
                    <div key={idx} className="py-5 first:pt-0 last:pb-0 flex items-start gap-4">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0052FF]/15 text-[#0052FF] font-mono text-xs font-bold border border-[#0052FF]/30 mt-0.5">
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-bold text-white">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ========================================================
                7. WHAT IT’S LIKE TO WORK WITH THRIDES
               ======================================================== */}
            <div className="mt-20 pt-16 border-t border-white/[0.08]">
              <div className="mb-10 max-w-2xl">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#0052FF]">
                  04 • Operational Principles
                </span>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
                  What It’s Like to Work With Thrides
                </h3>
              </div>

              {/* 3-Column Text Composition on Desktop, Compact Stacked on Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {whatItsLikeToWork.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-[#0052FF] pl-5 sm:pl-6"
                  >
                    <h4 className="font-display text-lg sm:text-xl font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm sm:text-[14.5px] text-neutral-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            8. SERVICE BREAKDOWN — AN INTERACTIVE SERVICE INDEX
           ======================================================== */}
        <section
          id="services-details"
          className="scroll-mt-28 py-20 md:py-28 bg-[#08080B]"
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#0052FF]">
                <span>05 • Interactive Index</span>
              </div>

              <h2 className="mt-3.5 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                The services that put your brand in front of your customers
              </h2>

              <p className="mt-3 text-neutral-400 text-[15px] sm:text-[16px]">
                Explore individual capabilities below to understand scope, deliverables, and exact package mappings.
              </p>
            </div>

            {/* DESKTOP: Two-Column Service Explorer (>= 1024px / lg) */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-8 mt-14 items-start">
              {/* Left Column: Vertical Service Index */}
              <div
                role="tablist"
                aria-label="Services Index"
                className="lg:col-span-4 space-y-1.5"
              >
                {services.map((svc, idx) => {
                  const isActive = activeServiceId === svc.id;
                  const numStr = `0${idx + 1}`;

                  return (
                    <button
                      key={svc.id}
                      type="button"
                      role="tab"
                      id={`tab-${svc.id}`}
                      aria-selected={isActive}
                      aria-controls={`panel-${svc.id}`}
                      onClick={() => setActiveServiceId(svc.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#0052FF]/15 border border-[#0052FF]/40 text-white shadow-lg"
                          : "bg-white/[0.02] border border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs font-bold ${
                            isActive ? "text-[#0052FF]" : "text-neutral-500"
                          }`}
                        >
                          {numStr}
                        </span>
                        <span className="font-display text-base font-bold text-white">
                          {svc.title}
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform ${
                          isActive ? "text-[#0052FF] translate-x-1" : "text-neutral-600"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Selected Service Detail Panel */}
              <div
                role="tabpanel"
                id={`panel-${activeService.id}`}
                aria-labelledby={`tab-${activeService.id}`}
                className="lg:col-span-8 rounded-[32px] border border-white/[0.08] bg-[#0C0C10] p-8 sm:p-10 shadow-2xl relative transition-all duration-200"
              >
                {/* Top specular highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Visual Preview */}
                  <div className="md:col-span-5">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#07070A]">
                      <img
                        src={activeService.image}
                        alt={activeService.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Service Text & Inclusions */}
                  <div className="md:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Package Inclusion Badge */}
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#0052FF]/15 text-[#0052FF] border border-[#0052FF]/30 px-3.5 py-1 text-xs font-mono font-bold">
                        <span>Included in: {activeService.includedIn}</span>
                      </div>

                      {/* Single Service Heading */}
                      <h3 className="mt-3.5 font-display text-2xl sm:text-3xl font-extrabold text-white">
                        {activeService.title}
                      </h3>

                      {/* Approved Description */}
                      <p className="mt-3 text-[14.5px] leading-relaxed text-neutral-300">
                        {activeService.summary}
                      </p>

                      {/* Bullet Points */}
                      <ul className="mt-5 space-y-2">
                        {activeService.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-[13px] text-neutral-300"
                          >
                            <Check
                              size={14}
                              className="text-[#0052FF] shrink-0 mt-0.5"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                      <a
                        href={`/contact?service=${activeService.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0052FF] hover:underline cursor-pointer"
                      >
                        <span>Request relevant sample deliverables</span>
                        <ArrowUpRight size={13} />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleSeeWhichPackageIncludes(activeService.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-[#0052FF] uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <span>See Which Package Includes This</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE: Vertical Accordion (< 1024px) */}
            <div className="block lg:hidden mt-8 space-y-3">
              {services.map((svc, sIdx) => {
                const isOpen = mobileExpandedService === svc.id;
                const numStr = `0${sIdx + 1}`;

                return (
                  <div
                    key={svc.id}
                    className="rounded-2xl border border-white/[0.08] bg-[#0C0C10] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpandedService(isOpen ? null : svc.id)
                      }
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#0052FF]">
                          {numStr}
                        </span>
                        <h3 className="font-display text-lg font-bold text-white">
                          {svc.title}
                        </h3>
                      </div>
                      <span className="text-xl font-mono text-neutral-400">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 pt-1 border-t border-white/[0.06] space-y-4 animate-in fade-in duration-200">
                        {/* Inclusion Info */}
                        <div className="inline-flex items-center rounded-full bg-[#0052FF]/15 text-[#0052FF] border border-[#0052FF]/30 px-3 py-0.5 text-[11px] font-mono font-bold">
                          <span>Included in: {svc.includedIn}</span>
                        </div>

                        {/* Image Preview */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-[#07070A]">
                          <img
                            src={svc.image}
                            alt={svc.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Summary */}
                        <p className="text-sm text-neutral-300 leading-relaxed">
                          {svc.summary}
                        </p>

                        {/* Bullets */}
                        <ul className="space-y-2">
                          {svc.bullets.map((bullet, mbIdx) => (
                            <li
                              key={mbIdx}
                              className="flex items-start gap-2 text-xs text-neutral-300"
                            >
                              <Check
                                size={14}
                                className="text-[#0052FF] shrink-0 mt-0.5"
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Actions */}
                        <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2.5">
                          <a
                            href={`/contact?service=${svc.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0052FF] hover:underline"
                          >
                            <span>Request relevant sample deliverables</span>
                            <ArrowUpRight size={13} />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleSeeWhichPackageIncludes(svc.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-[#0052FF] uppercase tracking-wider"
                          >
                            <span>See Which Package Includes This →</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            9. QUESTIONS BEFORE YOU BOOK (FAQ)
           ======================================================== */}
        <FAQ />

        {/* ========================================================
            10. FINAL STRATEGY CALL CTA
           ======================================================== */}
        <section className="py-20 md:py-28 bg-[#060608] border-t border-white/[0.06]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="relative overflow-hidden rounded-[36px] border border-white/[0.08] bg-gradient-to-b from-[#0E1018] to-[#060608] p-8 sm:p-14 lg:p-16 text-center text-white shadow-2xl">
              {/* Radial ambient glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0052FF]/10 blur-[130px] rounded-full"
              />

              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-white mb-4">
                  <span>START WHERE YOU ARE</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
                  Not sure which service you need?
                </h2>

                <p className="mt-4 text-base sm:text-lg text-neutral-300">
                  Just starting out? → <strong className="text-white">Kickstart</strong> · Want steady leads? → <strong className="text-white">Accelerate</strong> · Want to lead your market? → <strong className="text-white">Authority</strong>
                </p>

                <p className="mt-2 text-sm text-neutral-400">
                  Start with a free 30-minute strategy call. We’ll review your current marketing and recommend what will make the biggest difference for your business.
                </p>

                <div className="mt-8 flex justify-center w-full">
                  <HeroButton
                    href="/contact"
                    leftText="Book a"
                    rightText="Free Strategy Call"
                    ariaLabel="Book a Free Strategy Call"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
