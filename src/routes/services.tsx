import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import FAQ from "@/components/FAQ";
import {
  ArrowUpRight,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  FileCheck,
  TrendingUp,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import {
  packages,
  packageComparisonRows,
  services,
  caseStudies,
  whatHappensWhenYouJoin,
  whatItsLikeToWork,
  siteMeta,
} from "@/content/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Marketing Packages for Every Stage of Growth | Thrides" },
      {
        name: "description",
        content:
          "Three packages for where your business is today: Kickstart, Accelerate, and Authority. Websites, content, social media, SEO, and email.",
      },
      {
        property: "og:title",
        content: "Marketing Packages for Every Stage of Growth | Thrides",
      },
      {
        property: "og:description",
        content:
          "Three packages for where your business is today: Kickstart, Accelerate, and Authority. Websites, content, social media, SEO, and email.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [showTable, setShowTable] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B]">
      <Header />

      <main className="flex flex-col">
        {/* ========================================================
            1. HERO SECTION
           ======================================================== */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-black/[0.06] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                <Sparkles size={13} className="text-blue-700" />
                <span>Tailored Marketing Packages</span>
              </div>

              <h1 className="mt-5 font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#09090B] leading-[1.08]">
                Services & Packages: <br className="hidden sm:inline" />
                <span className="font-serif italic font-normal text-blue-900">
                  Start Where You Are.
                </span>{" "}
                Grow From There.
              </h1>

              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[#52525B] max-w-2xl">
                Most businesses don’t need everything at once. Choose the stage you’re at and we’ll build the right presence for you, with a clear plan behind it.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex h-[56px] items-center justify-center gap-2 rounded-full bg-[#09090B] px-8 text-[15px] font-bold text-white transition-all hover:bg-neutral-800"
                >
                  <span>Book a Free Strategy Call</span>
                  <ArrowUpRight size={17} className="stroke-[2.5]" />
                </a>

                <a
                  href="#packages"
                  className="inline-flex h-[56px] items-center justify-center rounded-full border border-black/[0.12] bg-[#FAFAFA] px-7 text-[15px] font-semibold text-[#09090B] transition-colors hover:bg-neutral-100"
                >
                  Explore Packages
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. THE 3 PACKAGES
           ======================================================== */}
        <section id="packages" className="py-20 md:py-28 bg-[#FAFAFA]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-4">
                <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
                  Growth Stages
                </span>
              </div>

              <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#09090B]">
                Start with a package,{" "}
                <span className="font-serif italic font-normal text-[#18181B]">
                  not a guess
                </span>
              </h2>
            </div>

            {/* 3 Packages Cards */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between rounded-[32px] border p-8 sm:p-10 transition-all duration-300 ${
                    pkg.isPopular
                      ? "border-blue-600 bg-white shadow-2xl ring-2 ring-blue-600/20"
                      : "border-black/[0.08] bg-white shadow-sm hover:border-black/25 hover:shadow-lg"
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3.5 right-8 inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                      <Sparkles size={12} />
                      <span>{pkg.badge}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#71717A]">
                      {pkg.tagline}
                    </span>
                    <h3 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#09090B]">
                      {pkg.name}
                    </h3>
                    <p className="mt-3 text-[15px] font-medium leading-snug text-[#27272A]">
                      {pkg.heading}
                    </p>

                    {/* The Problem */}
                    <div className="mt-5 rounded-2xl bg-[#FAFAFA] border border-black/[0.06] p-4 text-[13px] text-[#52525B]">
                      <span className="font-bold text-[#09090B]">The problem:</span> {pkg.theProblem}
                    </div>

                    {/* Deliverables */}
                    <div className="mt-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                        What you get:
                      </span>
                      <ul className="mt-3 space-y-2.5">
                        {pkg.deliverables.map((del, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[#3F3F46]">
                            <Check size={16} className="text-blue-700 shrink-0 mt-0.5" />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timeline, Payment & Promise */}
                    <div className="mt-7 space-y-2.5 pt-5 border-t border-black/[0.08] text-xs text-[#52525B]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#09090B]">Timeline:</span>
                        <span>{pkg.timeline}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#09090B]">Payment:</span>
                        <span>{pkg.payment}</span>
                      </div>
                      <div className="pt-2 text-[12.5px] leading-relaxed text-[#71717A] italic">
                        <span className="font-semibold not-italic text-[#09090B]">Our promise: </span>
                        {pkg.promise}
                      </div>
                    </div>
                  </div>

                  {/* Card CTA */}
                  <div className="mt-8 pt-6 border-t border-black/[0.08]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[#71717A]">Investment:</span>
                      <span className="text-sm font-bold text-[#09090B]">{pkg.investment}</span>
                    </div>

                    <a
                      href={`/contact?package=${pkg.id}`}
                      className={`inline-flex w-full h-[52px] items-center justify-center gap-2 rounded-full font-bold text-[15px] transition-all ${
                        pkg.isPopular
                          ? "bg-blue-700 text-white hover:bg-blue-800 shadow-md shadow-blue-700/20"
                          : "bg-[#09090B] text-white hover:bg-neutral-800"
                      }`}
                    >
                      <span>{pkg.ctaText}</span>
                      <ArrowUpRight size={16} className="stroke-[2.5]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Call Recommendation Banner */}
            <div className="mt-10 rounded-3xl bg-blue-50 border border-blue-200/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-lg sm:text-xl font-bold text-blue-950">
                  Not sure which fits?
                </h4>
                <p className="text-sm sm:text-base text-blue-900/80 mt-1">
                  Tell us where your business is today and we’ll recommend the right one on a free call.
                </p>
              </div>
              <a
                href="/contact"
                className="inline-flex h-[48px] shrink-0 items-center justify-center rounded-full bg-blue-700 px-6 text-sm font-bold text-white transition-colors hover:bg-blue-800 shadow-sm"
              >
                Book a Free Strategy Call
              </a>
            </div>

            {/* ========================================================
                PACKAGE COMPARISON TABLE
               ======================================================== */}
            <div className="mt-16 sm:mt-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#09090B]">
                    Compare Packages
                  </h3>
                  <p className="text-sm text-[#52525B] mt-1">
                    Side-by-side breakdown of scope, deliverables, and timelines.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTable((s) => !s)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900 uppercase tracking-wider"
                >
                  <span>{showTable ? "Hide Matrix" : "Show Matrix"}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${showTable ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {showTable && (
                <div className="overflow-x-auto rounded-3xl border border-black/[0.08] bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-black/[0.08] bg-neutral-50/70">
                        <th className="py-4 px-6 font-display font-bold text-[#09090B] w-1/4">
                          Deliverable
                        </th>
                        <th className="py-4 px-6 font-display font-bold text-[#09090B] w-1/4">
                          Kickstart
                        </th>
                        <th className="py-4 px-6 font-display font-bold text-blue-700 w-1/4">
                          Accelerate
                        </th>
                        <th className="py-4 px-6 font-display font-bold text-[#09090B] w-1/4">
                          Authority
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.06]">
                      {packageComparisonRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50/40"}
                        >
                          <td className="py-4 px-6 font-semibold text-[#09090B]">
                            {row.feature}
                          </td>
                          <td className="py-4 px-6 text-[#52525B]">
                            {row.kickstart}
                          </td>
                          <td className="py-4 px-6 font-medium text-blue-900 bg-blue-50/30">
                            {row.accelerate}
                          </td>
                          <td className="py-4 px-6 text-[#52525B]">
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
        <section className="py-20 md:py-28 bg-white border-t border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            {/* Part A: How It Works */}
            <div className="max-w-2xl">
              <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-4">
                <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
                  Simple Process
                </span>
              </div>

              <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#09090B]">
                How It Works
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Free strategy call",
                  desc: "30 minutes. We review your current marketing.",
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
                <div
                  key={item.step}
                  className="rounded-[28px] border border-black/[0.08] bg-[#FAFAFA] p-8"
                >
                  <span className="font-display text-3xl font-black text-blue-700">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold text-[#09090B]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#52525B]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Part B: What Happens When You Join */}
            <div className="mt-20 pt-16 border-t border-black/[0.08]">
              <div className="max-w-3xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#71717A]">
                  Client Onboarding
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#09090B]">
                  A smooth start, because the first two weeks set the tone
                </h3>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {whatHappensWhenYouJoin.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-700 font-bold text-xs mb-4">
                      {idx + 1}
                    </div>
                    <h4 className="font-display text-lg font-bold text-[#09090B]">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-[#52525B]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Part C: What It’s Like to Work With Thrides */}
            <div className="mt-16 rounded-3xl bg-[#09090B] p-8 sm:p-12 text-white">
              <h3 className="font-display text-2xl sm:text-3xl font-bold">
                What It’s Like to Work With Thrides
              </h3>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {whatItsLikeToWork.map((item, idx) => (
                  <div key={idx} className="border-l border-white/20 pl-6">
                    <h4 className="font-display text-lg font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
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
        <section id="services-details" className="py-20 md:py-28 bg-[#FAFAFA]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-4">
                <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
                  Service Breakdown
                </span>
              </div>

              <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#09090B]">
                The services that put your brand in front of your customers
              </h2>
            </div>

            {/* The 6 Services Expanded Cards */}
            <div className="mt-14 space-y-12">
              {services.map((svc) => {
                const proof = svc.proofCaseStudyId
                  ? caseStudies.find((cs) => cs.id === svc.proofCaseStudyId)
                  : undefined;

                return (
                  <div
                    key={svc.id}
                    id={svc.slug}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-[32px] border border-black/[0.08] bg-white p-8 sm:p-12 shadow-sm"
                  >
                    {/* Visual Preview */}
                    <div className="lg:col-span-5">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-neutral-100">
                        <img
                          src={svc.image}
                          alt={svc.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-900 border border-blue-200/50 px-3.5 py-1 text-xs font-bold">
                          <span>Included in: {svc.includedIn}</span>
                        </div>

                        <h3 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-[#09090B]">
                          {svc.title}
                        </h3>

                        <p className="mt-3 text-[15px] sm:text-[16px] leading-relaxed text-[#52525B]">
                          {svc.summary}
                        </p>

                        <ul className="mt-6 space-y-2.5">
                          {svc.bullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-sm text-[#3F3F46]">
                              <Check size={16} className="text-blue-700 shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Service Proof Preview Link */}
                      <div className="mt-8 pt-6 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-4">
                        {proof && proof.isPublished ? (
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-[#71717A]">
                              Documented Proof:
                            </span>
                            <a
                              href={`/case-studies/${proof.slug}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
                            >
                              <span>{proof.client}</span>
                              <ArrowUpRight size={13} />
                            </a>
                          </div>
                        ) : (
                          <a
                            href="/contact"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                          >
                            <span>Request relevant sample deliverables</span>
                            <ArrowUpRight size={13} />
                          </a>
                        )}

                        <a
                          href="#packages"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#09090B] uppercase tracking-wider hover:text-blue-700"
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
        <section className="py-20 md:py-28 bg-white border-t border-black/[0.06]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="rounded-[36px] bg-[#09090B] p-8 sm:p-14 lg:p-16 text-center text-white">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white mb-4">
                  <span>Start Where You Are</span>
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

                <div className="mt-8 flex justify-center">
                  <a
                    href="/contact"
                    className="inline-flex h-[56px] items-center justify-center gap-2 rounded-full bg-white px-8 text-[15px] font-bold text-[#09090B] transition-transform hover:bg-neutral-200"
                  >
                    <span>Book a Free Strategy Call</span>
                    <ArrowUpRight size={17} className="stroke-[2.5]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
