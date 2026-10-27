import { useState } from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { caseStudies, serviceCategoryLabels, type ServiceCategory } from "@/content/site";

export function OurWorkSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "consultancy", label: "Consultancy" },
    { id: "web-dev", label: "Websites" },
    { id: "content", label: "Content" },
    { id: "social-media", label: "Social Media" },
    { id: "seo", label: "SEO" },
    { id: "email-marketing", label: "Email" },
  ];

  const published = caseStudies.filter((cs) => cs.isPublished === true);
  const filteredStudies =
    selectedFilter === "all"
      ? published
      : published.filter((cs) =>
          cs.categories.includes(selectedFilter as ServiceCategory),
        );

  return (
    <section
      id="work"
      aria-label="Our Work Portfolio"
      className="relative w-full overflow-hidden bg-white pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 select-none"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
          <div className="flex h-[38px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-5">
            <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
              Selected Work & Proof
            </span>
          </div>

          <h2 className="mt-4 sm:mt-5 text-center">
            <span className="block font-display text-[32px] sm:text-[44px] lg:text-[clamp(44px,5vw,68px)] font-bold lg:font-extrabold leading-[1] tracking-[-0.045em] text-[#09090B]">
              Every Appearance Counted
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 max-w-[620px] text-center text-[15px] sm:text-[18px] font-normal leading-[1.4] text-[#52525B]">
            Work delivered with clear commercial intent across 14+ businesses and 8 countries.
          </p>
        </div>

        {/* If case studies are in review */}
        {filteredStudies.length === 0 ? (
          <div className="mt-12 rounded-[32px] border border-black/[0.08] bg-[#FAFAFA] p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-sm">
            <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-blue-600/15 bg-blue-50 px-4 mb-4">
              <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-blue-900 uppercase">
                Client Case Studies
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#09090B]">
              Client Outcomes in Review
            </h3>
            <p className="mt-3 text-base text-[#52525B] leading-relaxed max-w-xl mx-auto">
              Over 3 years, Thrides has partnered with 14+ businesses across 8 countries. Verified case-study breakdowns with client-approved metrics are being finalized for publication.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/services"
                className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#09090B] px-6 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
              >
                <span>Explore Packages & Deliverables</span>
                <ArrowUpRight size={15} className="ml-1.5" />
              </a>
              <a
                href="/contact"
                className="inline-flex h-[48px] items-center justify-center rounded-full border border-black/15 bg-white px-6 text-sm font-bold text-[#09090B] transition-colors hover:bg-neutral-100"
              >
                <span>Request Project Samples</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Category Filters */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    selectedFilter === cat.id
                      ? "bg-[#09090B] text-white shadow-sm"
                      : "bg-[#FAFAFA] text-[#52525B] border border-black/[0.08] hover:bg-neutral-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Case Studies Cards Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudies.map((study) => (
            <article
              key={study.id}
              className="group flex flex-col justify-between overflow-hidden rounded-[30px] border border-black/[0.08] bg-[#FAFAFA] transition-all duration-300 hover:border-black/30 hover:shadow-xl"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200">
                <img
                  src={study.cover}
                  alt={`${study.client} showcase`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-[#09090B] shadow-sm">
                  {study.industry}
                </div>
              </div>

              {/* Body */}
              <div className="p-7 flex flex-col flex-1 justify-between">
                <div>
                  {/* Category badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {study.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-white border border-black/[0.08] px-2 py-0.5 text-[11px] font-medium text-neutral-600"
                      >
                        {serviceCategoryLabels[cat] || cat}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display text-[22px] font-bold text-[#09090B] tracking-tight group-hover:text-blue-700 transition-colors">
                    {study.client}
                  </h3>
                  <p className="mt-1 text-[14px] font-semibold text-blue-700">
                    {study.title}
                  </p>

                  <p className="mt-3 text-[14px] leading-relaxed text-[#52525B] line-clamp-3">
                    {study.summary}
                  </p>

                  {/* Highlight Metric */}
                  {study.results && study.results.length > 0 && (
                    <div className="mt-5 rounded-2xl bg-white border border-black/[0.06] p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-700" />
                        <span className="text-xs font-medium text-neutral-500">
                          {study.results[0].label}:
                        </span>
                      </div>
                      <span className="font-display text-base font-extrabold text-[#09090B]">
                        {study.results[0].metric}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer link to full case study */}
                <div className="mt-6 pt-5 border-t border-black/[0.06] flex items-center justify-between">
                  <a
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#09090B] group-hover:text-blue-700 transition-colors uppercase tracking-wider"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowUpRight size={14} className="stroke-[2.5]" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

            {/* View All Work CTA */}
            <div className="mt-12 text-center">
              <a
                href="/our-work"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#09090B] px-8 text-[15px] font-bold text-white transition-all hover:bg-neutral-800"
              >
                <span>View All Client Work & Case Studies</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
