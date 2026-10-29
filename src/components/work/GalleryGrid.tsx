"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { ProjectCard } from "./ProjectCard";
import { CursorPill } from "./CursorPill";
import type { WorkProject } from "./work-data";

interface GalleryGridProps {
  projects: WorkProject[];
}

export function GalleryGrid({ projects }: GalleryGridProps) {
  const [cursorState, setCursorState] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setCursorState((prev) => ({
      ...prev,
      x: e.clientX,
      y: e.clientY,
    }));
  };

  const handleMouseEnterCard = (e: MouseEvent<HTMLDivElement>) => {
    setCursorState({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeaveCard = () => {
    setCursorState((prev) => ({ ...prev, visible: false }));
  };

  // Find projects by id
  const voltex = projects.find((p) => p.id === "voltex");
  const pulse = projects.find((p) => p.id === "pulse");
  const zest = projects.find((p) => p.id === "zest");
  const lumina = projects.find((p) => p.id === "lumina");

  return (
    <section aria-label="The Gallery" className="relative w-full">
      {/* Desktop Floating Mouse-Following Pill */}
      <CursorPill
        isVisible={cursorState.visible}
        mouseX={cursorState.x}
        mouseY={cursorState.y}
        label="View case ↗"
      />

      {/* Eyebrow Header Row */}
      <div className="mb-6 flex items-center justify-between font-mono text-[11px] sm:text-xs tracking-[0.2em] text-[#0A5CFF]">
        <span>THE GALLERY</span>
        <span className="text-white/40">02 — 05 / 05</span>
      </div>

      {/* 12-Column Explicit Bento Grid */}
      <div
        onMouseMove={handleMouseMove}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12"
      >
        {/* Card 1: Voltex Activewear (Cols 1-5, Row 1 & 2 on Desktop) */}
        {voltex && (
          <ProjectCard
            project={voltex}
            gridSpanClass="md:col-span-1 lg:col-span-5 lg:row-span-2"
            aspectClass="aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] xl:aspect-[5/6]"
            onMouseEnter={handleMouseEnterCard}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeaveCard}
          />
        )}

        {/* Card 2: Pulse Performance (Cols 6-12, Row 1 on Desktop) */}
        {pulse && (
          <ProjectCard
            project={pulse}
            gridSpanClass="md:col-span-1 lg:col-span-7 lg:row-start-1"
            aspectClass="aspect-[4/5] md:aspect-[16/10] lg:aspect-[16/10]"
            onMouseEnter={handleMouseEnterCard}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeaveCard}
          />
        )}

        {/* Card 3: Zest Botanicals (Cols 6-12, Row 2 on Desktop) */}
        {zest && (
          <ProjectCard
            project={zest}
            gridSpanClass="md:col-span-1 lg:col-span-7 lg:row-start-2"
            aspectClass="aspect-[4/5] md:aspect-[16/10] lg:aspect-[16/10]"
            onMouseEnter={handleMouseEnterCard}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeaveCard}
          />
        )}

        {/* Card 4: Lumina Home & Living (Cols 1-12, Row 3 Cinematic on Desktop) */}
        {lumina && (
          <ProjectCard
            project={lumina}
            gridSpanClass="md:col-span-2 lg:col-span-12 lg:row-start-3"
            aspectClass="aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9]"
            onMouseEnter={handleMouseEnterCard}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeaveCard}
          />
        )}
      </div>
    </section>
  );
}
