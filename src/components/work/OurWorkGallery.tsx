"use client";

import { FeaturedCase } from "./FeaturedCase";
import { GalleryGrid } from "./GalleryGrid";
import { ProjectIndex } from "./ProjectIndex";
import { WORK_PROJECTS } from "./work-data";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function OurWorkGallery() {
  const featured = WORK_PROJECTS.find((p) => p.isFeatured) || WORK_PROJECTS[0]!;
  const galleryProjects = WORK_PROJECTS.filter((p) => !p.isFeatured);

  return (
    <div className="relative isolate overflow-hidden bg-[#050507] py-20 sm:py-28 md:py-32 text-[#F5F2EC]">
      {/* 1. Luxury Atmosphere: Faint Blue Ambient Glow behind Featured Card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-48 -z-10 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-[#0A5CFF] opacity-[0.08] blur-[140px]"
      />

      {/* 2. Very Faint Grid Masked with Radial Fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* 3. 3% Film Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 space-y-28 md:space-y-32">
        {/* Section 1: Featured Exhibit (Apex Only) */}
        <FeaturedCase project={featured} totalCount={WORK_PROJECTS.length} />

        {/* Section 2: The Gallery (Voltex, Pulse, Zest, Lumina) */}
        <GalleryGrid projects={galleryProjects} />

        {/* Section 3: Quiet Archive Index (All 5 Projects) */}
        <ProjectIndex projects={WORK_PROJECTS} />
      </div>
    </div>
  );
}
