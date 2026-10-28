"use client";

import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { caseStudies, serviceCategoryLabels, type ServiceCategory } from "@/content/site";
import Link from "next/link";

export function OurWorkContent() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filterTabs = [
    { id: "all", label: "All Work" },
    { id: "consultancy", label: "Consultancy" },
    { id: "web-dev", label: "Websites" },
    { id: "content", label: "Content" },
    { id: "social-media", label: "Social Media" },
    { id: "seo", label: "SEO" },
    { id: "email-marketing", label: "Email" },
  ];

  const published = caseStudies.filter((cs) => cs.isPublished === true);
  const filtered =
    activeCategory === "all"
      ? published
      : published.filter((cs) =>
          cs.categories.includes(activeCategory as ServiceCategory),
        );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B]">
      <Header />

      <main className="flex flex-col">
        {/* Header Hero */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-black/[0.06] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                <Sparkles size={13} className="text-blue-700" />
                <span>Selected Work & Case Studies</span>
              </div>

              <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#09090B] leading-[1.1]">
                Every Appearance. <br />
                <span className="font-serif italic font-normal text-blue-900">
                  On Purpose.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[#52525B]">
                Discover how we research the market, build conversion-focused digital experiences, and run campaigns that turn attention into clients.
              </p>
            </div>

            {/* Filter Tabs if published work exists */}
            {published.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-2 pt-8 border-t border-black/[0.06]">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                      activeCategory === tab.id
                        ? "bg-[#09090B] text-white shadow-sm"
                        : "bg-[#FAFAFA] text-[#52525B] border border-black/[0.08] hover:bg-neutral-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Portfolio Content */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            {filtered.length === 0 ? (
              <div className="rounded-[32px] border border-black/[0.08] bg-white p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-sm">
                <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-blue-600/15 bg-blue-50 px-4 mb-4">
                  <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-blue-900 uppercase">
                    Client Case Studies
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#09090B]">
                  Client Case Studies in Final Review
                </h2>
                <p className="mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed max-w-xl mx-auto">
                  Over the past 3 years, Thrides has partnered with 14+ businesses across 8 countries. Detailed case studies with verified outcome data are currently being finalized with our client partners.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    href="/services"
                    className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#09090B] px-8 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
                  >
                    <span>View All Services & Packages</span>
                    <ArrowUpRight size={16} className="ml-1.5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-[52px] items-center justify-center rounded-full border border-black/15 bg-[#FAFAFA] px-8 text-sm font-bold text-[#09090B] transition-colors hover:bg-neutral-100"
                  >
                    <span>Request Relevant Samples</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((study) => (
                  <article
                    key={study.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-[32px] border border-black/[0.08] bg-white transition-all duration-300 hover:border-black/30 hover:shadow-xl"
                  >
                    {/* Media Visual */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200">
                      <img
                        src={typeof study.cover === "string" ? study.cover : study.cover?.src || ""}
                        alt={study.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-[#09090B] shadow-sm">
                        {study.industry}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-7 flex flex-col flex-1 justify-between">
                      <div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {study.categories.map((c, i) => (
                            <span
                              key={i}
                              className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
                            >
                              {serviceCategoryLabels[c] || c}
                            </span>
                          ))}
                        </div>

                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#09090B] group-hover:text-blue-700 transition-colors">
                          {study.client}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-blue-800">
                          {study.title}
                        </p>

                        <p className="mt-3 text-sm leading-relaxed text-[#52525B] line-clamp-3">
                          {study.summary}
                        </p>
                      </div>

                      {/* Card Link */}
                      <div className="mt-6 pt-5 border-t border-black/[0.06] flex items-center justify-between">
                        <Link
                          href={`/case-studies/${study.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#09090B] group-hover:text-blue-700 transition-colors uppercase tracking-wider"
                        >
                          <span>Explore Case Study</span>
                          <ArrowUpRight size={14} className="stroke-[2.5]" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Bottom Call to Action */}
            <div className="mt-20 rounded-[32px] bg-[#09090B] p-8 sm:p-12 text-white text-center">
              <h3 className="font-display text-2xl sm:text-3xl font-bold">
                Want to see what we can build for your business?
              </h3>
              <p className="mt-3 text-neutral-300 max-w-xl mx-auto text-sm sm:text-base">
                Book a free 30-minute strategy call. We’ll review your market and recommend clear priorities.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-[#09090B] transition-transform hover:bg-neutral-200"
                >
                  <span>Request a Free Strategy Call</span>
                  <ArrowUpRight size={16} className="stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
