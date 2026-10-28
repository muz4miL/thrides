"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import type { WorkProjectDoc } from "@/server/types";

interface WorkProjectIndexProps {
  projects: WorkProjectDoc[];
  categoryOrder?: string[] | undefined;
  intro?: string | undefined;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Work",
  consultancy: "Consultancy",
  "web-dev": "Websites & Platforms",
  content: "Content Strategy",
  "social-media": "Social Media",
  seo: "SEO Visibility",
  "email-marketing": "Email & Retention",
};

export function WorkProjectIndex({
  projects,
  categoryOrder = ["all", "consultancy", "web-dev", "content", "social-media", "seo", "email-marketing"],
  intro,
}: WorkProjectIndexProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read active category from URL, default to "all"
  const urlCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState<string>(urlCategory);

  // Sync state if URL changes externally (e.g. back button)
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (catId === "all") {
        params.delete("category");
      } else {
        params.set("category", catId);
      }
      const newQuery = params.toString() ? `?${params.toString()}` : "";
      router.push(`${pathname}${newQuery}`, { scroll: false });
    });
  };

  // Filter projects by active category
  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.categories && p.categories.includes(activeCategory));

  return (
    <section
      id="project-index"
      aria-label="Project Index & Gallery"
      className="bg-[#070709] py-20 sm:py-28 md:py-36 border-b border-white/[0.08]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
        {/* Section Header & Narrative Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-bold text-[#0052FF] uppercase tracking-widest block">
              CATALOGUE / 2024–2026
            </span>
            <h2 className="mt-3 font-display text-[clamp(32px,4vw,56px)] font-extrabold text-white tracking-[-0.03em] leading-tight">
              Selected Client Portfolio
            </h2>
            <p className="mt-3 text-[15px] sm:text-[16px] text-[#A1A1AA] leading-relaxed">
              {intro ||
                "A deliberate balance of strategic advisory platforms, high-velocity consumer drop stores, and compounding media creative."}
            </p>
          </div>

          <div className="font-mono text-xs text-neutral-400">
            SHOWING {filteredProjects.length} OF {projects.length} PROJECTS
          </div>
        </div>

        {/* Filter Tabs Bar (Sticky or Horizontal Scrollable) */}
        <div className="mt-8 flex flex-wrap items-center gap-2 pb-6 border-b border-white/[0.06]">
          {categoryOrder.map((catKey) => {
            const label = CATEGORY_LABELS[catKey] || catKey.charAt(0).toUpperCase() + catKey.slice(1);
            const isSelected = activeCategory === catKey;

            return (
              <button
                key={catKey}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectCategory(catKey)}
                className={`relative rounded-full px-4 sm:px-5 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#0052FF] text-white shadow-[0_0_20px_rgba(0,82,255,0.4)]"
                    : "bg-[#111114] text-[#A1A1AA] border border-white/[0.08] hover:text-white hover:border-white/20 hover:bg-[#18181C]"
                }`}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="mt-16 rounded-[28px] border border-white/[0.08] bg-[#111114] p-12 text-center max-w-xl mx-auto">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-neutral-400 mb-4">
              <SlidersHorizontal size={20} />
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              No projects in this category yet
            </h3>
            <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">
              We frequently finalize verified client results. Try exploring all work or request relevant private case studies directly.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => handleSelectCategory("all")}
                className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black hover:bg-neutral-200 transition-colors"
              >
                Reset to All Work
              </button>
              <Link
                href="/contact"
                className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
              >
                Request Custom Samples
              </Link>
            </div>
          </div>
        ) : (
          /* 12-Column Editorial Grid with Alternating 7/5 & 5/7 Rhythm */
          <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-16 sm:gap-y-20 items-start">
            {filteredProjects.map((project, idx) => {
              // 4-item alternating rhythm:
              // Index 0: 7 cols (landscape 16/10)
              // Index 1: 5 cols (portrait 4/5)
              // Index 2: 5 cols (portrait 4/5)
              // Index 3: 7 cols (landscape 16/10)
              const cyclePos = idx % 4;
              const isWide = cyclePos === 0 || cyclePos === 3;
              const colSpanClass = isWide ? "lg:col-span-7" : "lg:col-span-5";
              const aspectClass = isWide ? "aspect-[16/10]" : "aspect-[4/5]";

              return (
                <div key={project.slug} className={`w-full ${colSpanClass}`}>
                  <ProjectGalleryCard project={project} aspectClass={aspectClass} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// Sub-component for individual project card with micro-interactions
function ProjectGalleryCard({
  project,
  aspectClass,
}: {
  project: WorkProjectDoc;
  aspectClass: string;
}) {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <article className="group flex flex-col">
      {/* Project Image / Media Wrapper */}
      <Link
        href={`/our-work/${project.slug}`}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onPointerMove={handlePointerMove}
        className={`relative block w-full overflow-hidden rounded-[20px] sm:rounded-[24px] border border-white/[0.08] bg-[#111114] shadow-xl ${aspectClass}`}
      >
        <img
          src={project.thumbnailUrl || project.heroMediaUrl}
          alt={project.altText || project.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.025]"
          loading="lazy"
        />

        {/* Ambient gradient vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-80"
        />

        {/* Top Badges: Category & Year */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 font-mono text-[10.5px] font-bold text-white border border-white/10 uppercase tracking-wider">
            {project.industry}
          </span>
          <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 font-mono text-[10.5px] text-neutral-300 border border-white/10">
            {project.year}
          </span>
        </div>

        {/* Bounded Cursor Badge (Follows Pointer within Card Bounds on Fine-Pointer Devices) */}
        {isHovered && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-30 hidden sm:flex items-center gap-1.5 rounded-full bg-[#0052FF] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-xl transition-opacity duration-200"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span>View</span>
            <ArrowUpRight size={13} />
          </div>
        )}
      </Link>

      {/* Typography & Metadata Below Image */}
      <div className="mt-4 sm:mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0052FF] block">
            {project.clientName}
          </span>
          <h3 className="mt-1 font-display text-[18px] sm:text-[20px] font-bold text-white leading-snug group-hover:text-[#0052FF] transition-colors">
            <Link href={`/our-work/${project.slug}`}>{project.title}</Link>
          </h3>
          <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-[#A1A1AA] line-clamp-2">
            {project.summary}
          </p>
        </div>

        <Link
          href={`/our-work/${project.slug}`}
          className="shrink-0 mt-1 inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-semibold text-white/70 hover:text-white transition-colors group-hover:text-white"
          aria-label={`View case study for ${project.title}`}
        >
          <span className="hidden sm:inline">Case study</span>
          <ArrowUpRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] text-[#0052FF]"
          />
        </Link>
      </div>
    </article>
  );
}
