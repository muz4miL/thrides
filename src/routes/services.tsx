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
} from "lucide-react";
import {
  packages,
  packageComparisonRows,
  services,
  caseStudies,
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
  const [showTable, setShowTable] = useState(true);
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

  return (
    <div className="min-h-screen bg-[#08080B] text-white selection:bg-[#0052FF] selection:text-white">
      {/* Global Navigation Header */}
      <Header />

      <main className="flex flex-col">
        {/* ========================================================
            1. CINEMATIC SERVICES HERO
           ======================================================== */}
        <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-4 md:px-6 pt-2 pb-4">
          <section
            ref={heroRef}
            id="services-hero"
            aria-label="Services & Packages Hero Overview"
            className="relative mx-auto w-full overflow-hidden rounded-[36px] sm:rounded-[44px] md:rounded-[52px] bg-[#000000] border border-white/[0.08] min-h-[580px] lg:h-[calc(100vh-140px)] lg:min-h-[650px] lg:max-h-[740px] shadow-2xl flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 select-none"
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
              {/* Subtle dark vignette to ensure crisp readability while keeping vibrant cobalt metallic flanks */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-[#000000]/75 via-[#000000]/30 to-[#000000]/85"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#000000_90%)] opacity-70"
              />
            </div>

            {/* Content Container (Centered in dark negative space) */}
            <div className="relative z-10 flex flex-col items-center max-w-4xl">
              {/* Small Restrained Eyebrow */}
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
                className={`mt-5 select-none font-display text-[clamp(42px,5.8vw,88px)] font-extrabold tracking-[-0.04em] text-[#F4F4F5] leading-[0.96] transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
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
                className={`mt-5 sm:mt-6 max-w-[580px] font-sans text-[15px] sm:text-[17px] text-[#A1A1AA] leading-relaxed transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
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
                className={`mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
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
            2. THE 3 PACKAGES
           ======================================================== */}
        <section
          id="packages"
          className="scroll-mt-28 py-20 md:py-28 bg-[#08080B]"
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#0052FF]">
                <Sparkles size={13} className="text-[#0052FF]" />
                <span>01 • GROWTH STAGES</span>
              </div>

              <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Start with a package,{" "}
                <span className="font-serif italic font-normal text-white">
                  not a guess
                </span>
              </h2>

              <p className="mt-3 text-[15px] sm:text-[16px] text-neutral-400 leading-relaxed max-w-xl">
                Every business scales at a different cadence. Pick the tier that matches your current pipeline and upgrade seamlessly as you expand.
              </p>
            </div>

            {/* 3 Packages Cards Grid */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
              {packages.map((pkg) => {
                const isFeatured = pkg.isPopular;

                return (
                  <div
                    key={pkg.id}
                    className={`relative flex flex-col justify-between rounded-[32px] border p-7 sm:p-9 transition-all duration-300 hover:border-white/20 shadow-xl ${
                      isFeatured
                        ? "border-[#0052FF]/60 bg-gradient-to-b from-[#0F1426] to-[#0A0D18] shadow-[0_0_35px_rgba(0,82,255,0.22)] ring-1 ring-[#0052FF]/40 hover:border-[#0052FF]"
                        : "border-white/[0.08] bg-[#0C0C10]"
                    }`}
                  >
                    {/* Specular top highlight */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    />

                    {/* Featured Popular Badge */}
                    {pkg.badge && (
                      <div className="absolute -top-3.5 right-8 inline-flex items-center gap-1.5 rounded-full bg-[#0052FF] px-4 py-1 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(0,82,255,0.5)]">
                        <Sparkles size={12} />
                        <span>{pkg.badge}</span>
                      </div>
                    )}

                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0052FF]">
                        {pkg.tagline}
                      </span>

                      <h3 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {pkg.name}
                      </h3>

                      <p className="mt-2.5 text-[14.5px] font-medium leading-snug text-neutral-300">
                        {pkg.heading}
                      </p>

                      {/* The Problem Box */}
                      <div className="mt-5 rounded-2xl bg-[#07070A] border border-white/[0.06] p-4 text-[13px] text-neutral-300 leading-relaxed">
                        <span className="font-bold text-white">The problem: </span>
                        {pkg.theProblem}
                      </div>

                      {/* Deliverables List */}
                      <div className="mt-6">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                          What you get:
                        </span>
                        <ul className="mt-3 space-y-2.5">
                          {pkg.deliverables.map((del, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 text-[13.5px] text-neutral-300"
                            >
                              <Check
                                size={15}
                                className="text-[#0052FF] shrink-0 mt-0.5"
                              />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Timeline, Payment & Promise */}
                      <div className="mt-7 space-y-2.5 pt-5 border-t border-white/[0.08] text-xs text-neutral-400">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-300">Timeline:</span>
                          <span className="text-white font-medium">{pkg.timeline}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-300">Payment:</span>
                          <span className="text-white font-medium">{pkg.payment}</span>
                        </div>
                        <div className="pt-2 text-[12px] leading-relaxed text-neutral-400 italic">
                          <span className="font-semibold not-italic text-neutral-300">
                            Our promise:{" "}
                          </span>
                          {pkg.promise}
                        </div>
                      </div>
                    </div>

                    {/* Card CTA & Investment */}
                    <div className="mt-8 pt-6 border-t border-white/[0.08]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs text-neutral-400">Investment:</span>
                        <span className="font-mono text-sm font-bold text-white">
                          {pkg.investment}
                        </span>
                      </div>

                      <a
                        href={`/contact?package=${pkg.id}`}
                        className={`inline-flex w-full h-[50px] items-center justify-center gap-2 rounded-full font-bold text-[14px] transition-all cursor-pointer ${
                          isFeatured
                            ? "bg-[#0052FF] text-white hover:bg-[#0043DB] shadow-[0_0_20px_rgba(0,82,255,0.4)]"
                            : "bg-white/[0.05] text-white hover:bg-white/[0.12] border border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span>{pkg.ctaText}</span>
                        <ArrowUpRight size={16} className="stroke-[2.5]" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Free Call Recommendation Banner */}
            <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#0C0F1E] via-[#0E132A] to-[#0A0D18] border border-[#0052FF]/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
              <div>
                <h4 className="font-display text-lg sm:text-xl font-bold text-white">
                  Not sure which tier fits your business?
                </h4>
                <p className="text-sm sm:text-base text-neutral-300 mt-1">
                  Tell us where your business is today and we’ll map out the exact package on a free 30-minute call.
                </p>
              </div>
              <a
                href="/contact"
                className="inline-flex h-[48px] shrink-0 items-center justify-center rounded-full bg-[#0052FF] px-7 text-sm font-bold text-white transition-all hover:bg-[#0043DB] shadow-[0_0_18px_rgba(0,82,255,0.4)] cursor-pointer"
              >
                Book a Free Strategy Call
              </a>
            </div>

            {/* ========================================================
                PACKAGE COMPARISON TABLE
               ======================================================== */}
            <div className="mt-16 sm:mt-24">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Compare Packages
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    Side-by-side breakdown of scope, deliverables, and turnaround schedules.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTable((s) => !s)}
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#0052FF] hover:text-blue-400 uppercase tracking-wider cursor-pointer"
                >
                  <span>{showTable ? "Hide Matrix" : "Show Matrix"}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      showTable ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {showTable && (
                <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#0C0C10] shadow-2xl">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-[#07070A]">
                        <th className="py-4 px-6 font-display font-bold text-white w-1/4">
                          Deliverable
                        </th>
                        <th className="py-4 px-6 font-display font-bold text-white w-1/4">
                          Kickstart
                        </th>
                        <th className="py-4 px-6 font-display font-black text-[#0052FF] bg-[#0052FF]/[0.08] w-1/4">
                          Accelerate (Featured)
                        </th>
                        <th className="py-4 px-6 font-display font-bold text-white w-1/4">
                          Authority
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {packageComparisonRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-[#0C0C10]" : "bg-[#0E0E14]"}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================
            3. HOW IT WORKS & WHAT HAPPENS WHEN YOU JOIN
           ======================================================== */}
        <section className="py-20 md:py-28 bg-[#060608] border-t border-b border-white/[0.06]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            {/* Part A: How It Works */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#0052FF]">
                <span>02 • SIMPLE PROCESS</span>
              </div>

              <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                How It Works
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  step: "01",
                  title: "Free strategy call",
                  desc: "30 minutes. We review your current marketing, market positioning, and growth levers.",
                },
                {
                  step: "02",
                  title: "Your custom plan",
                  desc: "We recommend the package and commercial priorities that will make the biggest revenue difference.",
                },
                {
                  step: "03",
                  title: "We build & launch",
                  desc: "You get a locked timeline, delivery milestones, and high-tempo execution from day one.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-[28px] border border-white/[0.08] bg-[#0C0C10] p-8 hover:border-white/20 transition-all duration-300 shadow-xl"
                >
                  <span className="font-display text-3xl sm:text-4xl font-black text-[#0052FF]">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-neutral-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Part B: What Happens When You Join */}
            <div className="mt-20 pt-16 border-t border-white/[0.08]">
              <div className="max-w-3xl">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#0052FF]">
                  Client Onboarding
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  A smooth start, because the first two weeks set the tone
                </h3>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {whatHappensWhenYouJoin.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/[0.07] bg-[#0E0E14] p-6 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#0052FF]/15 text-[#0052FF] font-mono font-bold text-xs mb-4 border border-[#0052FF]/30">
                      0{idx + 1}
                    </div>
                    <h4 className="font-display text-lg font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Part C: What It’s Like to Work With Thrides */}
            <div className="mt-16 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0F1017] to-[#07070A] p-8 sm:p-12 text-white shadow-2xl">
              <h3 className="font-display text-2xl sm:text-3xl font-bold">
                What It’s Like to Work With Thrides
              </h3>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {whatItsLikeToWork.map((item, idx) => (
                  <div key={idx} className="border-l-2 border-[#0052FF] pl-6">
                    <h4 className="font-display text-lg font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. WHAT’S INSIDE EVERY PACKAGE (The 6 Services)
           ======================================================== */}
        <section
          id="services-details"
          className="scroll-mt-28 py-20 md:py-28 bg-[#08080B]"
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#0052FF]">
                <span>03 • SERVICE BREAKDOWN</span>
              </div>

              <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                The services that put your brand in front of your customers
              </h2>

              <p className="mt-3 text-neutral-400 text-[15px] sm:text-[16px]">
                Each service is engineered around business intent, conversion psychology, and measurable pipeline.
              </p>
            </div>

            {/* The 6 Services Expanded Cards */}
            <div className="mt-14 space-y-10">
              {services.map((svc) => {
                const proof = svc.proofCaseStudyId
                  ? caseStudies.find((cs) => cs.id === svc.proofCaseStudyId)
                  : undefined;

                return (
                  <div
                    key={svc.id}
                    id={svc.slug}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-[32px] border border-white/[0.08] bg-[#0C0C10] p-7 sm:p-10 transition-all duration-300 hover:border-white/20 shadow-xl"
                  >
                    {/* Visual Preview */}
                    <div className="lg:col-span-5">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#07070A]">
                        <img
                          src={svc.image}
                          alt={svc.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#0052FF]/15 text-[#0052FF] border border-[#0052FF]/30 px-3.5 py-1 text-xs font-mono font-bold">
                          <span>Included in: {svc.includedIn}</span>
                        </div>

                        <h3 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-white">
                          {svc.title}
                        </h3>

                        <p className="mt-3 text-[15px] sm:text-[16px] leading-relaxed text-neutral-300">
                          {svc.summary}
                        </p>

                        <ul className="mt-6 space-y-2.5">
                          {svc.bullets.map((bullet, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 text-sm text-neutral-300"
                            >
                              <Check
                                size={15}
                                className="text-[#0052FF] shrink-0 mt-0.5"
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Service Proof Preview Link */}
                      <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                        {proof && proof.isPublished ? (
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-semibold text-neutral-400">
                              Documented Proof:
                            </span>
                            <a
                              href={`/case-studies/${proof.slug}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#0052FF] hover:underline"
                            >
                              <span>{proof.client}</span>
                              <ArrowUpRight size={13} />
                            </a>
                          </div>
                        ) : (
                          <a
                            href="/contact"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0052FF] hover:underline"
                          >
                            <span>Request relevant sample deliverables</span>
                            <ArrowUpRight size={13} />
                          </a>
                        )}

                        <a
                          href="#packages"
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider hover:text-[#0052FF] transition-colors"
                        >
                          <span>See Which Package Includes This</span>
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            5. QUESTIONS BEFORE YOU BOOK (FAQ)
           ======================================================== */}
        <FAQ />

        {/* ========================================================
            6. FINAL CTA
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
