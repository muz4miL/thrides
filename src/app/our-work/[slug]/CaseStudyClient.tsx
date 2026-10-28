"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, Quote, Sparkles } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CaseStudyBlocksRenderer } from "@/components/work/CaseStudyBlocksRenderer";
import type { WorkProjectDoc } from "@/server/types";

interface CaseStudyClientProps {
  project: WorkProjectDoc;
  nextProject: WorkProjectDoc | null;
  isPreview?: boolean;
}

export function CaseStudyClient({
  project,
  nextProject,
  isPreview = false,
}: CaseStudyClientProps) {
  const accentColor = project.accentColor || "#0052FF";

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[#0052FF] selection:text-white">
      <Header />

      {/* Preview Notice Banner */}
      {isPreview && (
        <div className="bg-[#0052FF] px-4 py-2 text-center text-xs font-bold text-white tracking-wider uppercase">
          ADMIN PREVIEW MODE — THIS VERSION IS NOT INDEXED BY SEARCH ENGINES
        </div>
      )}

      <main className="flex flex-col">
        {/* 1. TOP BREADCRUMB & METADATA BAR */}
        <div className="border-b border-white/[0.08] bg-[#0A0A0D] py-4">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 flex items-center justify-between">
            <Link
              href="/our-work"
              className="group inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span>Back to all Work</span>
            </Link>

            <div className="flex items-center gap-3">
              {project.isConceptWork && (
                <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Concept Exploration
                </span>
              )}
              <span
                style={{ color: accentColor }}
                className="font-mono text-xs font-bold uppercase tracking-wider"
              >
                {project.industry}
              </span>
            </div>
          </div>
        </div>

        {/* 2. EDITORIAL HERO & POSITIONING STATEMENT */}
        <section className="pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 border-b border-white/[0.08]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0052FF] block mb-3">
                {project.clientName} • {project.year}
              </span>

              <h1 className="font-display text-[clamp(36px,5vw,68px)] font-extrabold tracking-[-0.04em] text-white leading-[1.02]">
                {project.title}
              </h1>

              <p className="mt-6 text-[17px] sm:text-[19px] md:text-[21px] leading-relaxed text-[#D4D4D8] font-normal max-w-3xl">
                {project.summary}
              </p>
            </div>

            {/* Quick Meta Snapshot Grid */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/[0.08]">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300 block">
                  CLIENT
                </span>
                <span className="mt-1 font-display font-semibold text-white text-[15px] block">
                  {project.clientName}
                </span>
              </div>

              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300 block">
                  INDUSTRY
                </span>
                <span className="mt-1 font-display font-semibold text-white text-[15px] block">
                  {project.industry}
                </span>
              </div>

              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300 block">
                  TIMELINE / YEAR
                </span>
                <span className="mt-1 font-display font-semibold text-white text-[15px] block">
                  {project.year}
                </span>
              </div>

              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-300 block">
                  DELIVERY
                </span>
                {project.externalUrl ? (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 font-display font-semibold text-[#0052FF] hover:underline text-[15px]"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <span className="mt-1 font-display font-semibold text-neutral-300 text-[15px] block">
                    Enterprise Deployment
                  </span>
                )}
              </div>
            </div>

            {/* Services Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {project.services.map((service, i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono text-neutral-300"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 3. DOMINANT HERO MEDIA BANNER */}
        <section className="py-8 sm:py-12 bg-[#09090C]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-[24px] sm:rounded-[36px] border border-white/10 bg-[#111114] shadow-2xl">
              {project.mediaType === "video" ? (
                <video
                  src={project.heroMediaUrl}
                  poster={project.posterUrl || project.thumbnailUrl}
                  controls
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={project.heroMediaUrl || project.thumbnailUrl}
                  alt={project.altText || project.title}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              )}
            </div>
          </div>
        </section>

        {/* 4. CHALLENGE & APPROACH NARRATIVE */}
        <section className="py-16 sm:py-24 border-b border-white/[0.08]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Challenge */}
              <div className="lg:col-span-6 space-y-4">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0052FF] block">
                  THE CHALLENGE
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  The Friction Point
                </h2>
                <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#A1A1AA]">
                  {project.challenge}
                </p>
              </div>

              {/* Approach */}
              <div className="lg:col-span-6 space-y-4">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0052FF] block">
                  OUR APPROACH
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  The Purpose-Built Solution
                </h2>
                <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#A1A1AA]">
                  {project.approach}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. MODULAR CONTENT BLOCKS */}
        {project.blocks && project.blocks.length > 0 && (
          <section className="py-16 sm:py-24 border-b border-white/[0.08]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
              <CaseStudyBlocksRenderer blocks={project.blocks} accentColor={accentColor} />
            </div>
          </section>
        )}

        {/* 6. VERIFIED OUTCOMES (IF NOT ALREADY IN A BLOCK) */}
        {project.results && project.results.length > 0 && (
          <section className="py-16 sm:py-24 border-b border-white/[0.08] bg-[#0A0A0E]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
              <div className="max-w-2xl mb-12">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0052FF] block">
                  MEASURED RESULTS
                </span>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white">
                  Commercial Performance
                </h2>
                <p className="mt-2 text-sm text-[#A1A1AA]">
                  Verified post-launch results documented directly with the client.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {project.results.map((res, i) => (
                  <div
                    key={i}
                    className="p-8 rounded-[24px] border border-white/10 bg-[#111114] flex flex-col justify-between"
                  >
                    <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {res.metric}
                    </span>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <span className="font-display text-base font-bold text-neutral-200 block">
                        {res.label}
                      </span>
                      {res.context && (
                        <span className="font-mono text-xs text-neutral-300 block mt-1">
                          {res.context}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. CLIENT TESTIMONIAL (IF AVAILABLE) */}
        {project.testimonial && project.testimonial.quote && (
          <section className="py-16 sm:py-24 border-b border-white/[0.08]">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 text-center">
              <Quote size={40} className="mx-auto text-[#0052FF] mb-6 opacity-60" />
              <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-white leading-relaxed">
                "{project.testimonial.quote}"
              </blockquote>
              <div className="mt-8">
                <span className="font-display font-bold text-white text-base sm:text-lg block">
                  {project.testimonial.clientName}
                </span>
                <span className="font-mono text-xs text-neutral-300 block mt-1">
                  {project.testimonial.clientTitle} • {project.testimonial.companyName}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* 8. CONTEXTUAL PROJECT ENQUIRY ACTION */}
        <section className="py-20 sm:py-28 bg-gradient-to-b from-[#070709] to-[#0A0D17] border-b border-white/[0.08] text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0052FF] block mb-3">
              SIMILAR CHALLENGES?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Ready to engineer your advantage?
            </h2>
            <p className="mt-4 text-[15px] sm:text-[17px] text-[#A1A1AA] leading-relaxed max-w-xl mx-auto">
              We consult directly with founders and marketing heads. Book a free 30-minute strategy call to review your current positioning.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={`/contact?project=${project.slug}&client=${encodeURIComponent(project.clientName)}`}
                className="group inline-flex items-center gap-2 rounded-full bg-[#0052FF] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:shadow-[0_0_35px_rgba(0,82,255,0.4)]"
              >
                <span>Discuss a Similar Project</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* 9. NEXT PROJECT NAVIGATION */}
        {nextProject && (
          <nav aria-label="Next Project" className="py-12 sm:py-16 bg-[#070709]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-[28px] border border-white/10 bg-[#111114]">
                <div>
                  <span className="font-mono text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                    NEXT CASE STUDY
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-bold text-white">
                    {nextProject.title}
                  </h3>
                  <span className="text-xs font-mono text-[#0052FF] mt-1 block">
                    {nextProject.industry} • {nextProject.clientName}
                  </span>
                </div>

                <Link
                  href={`/our-work/${nextProject.slug}`}
                  className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </nav>
        )}
      </main>

      <Footer />
    </div>
  );
}
