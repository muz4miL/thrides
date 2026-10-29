"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { WorkProject } from "./work-data";

interface ProjectIndexProps {
  projects: WorkProject[];
}

export function ProjectIndex({ projects }: ProjectIndexProps) {
  const [activeItem, setActiveItem] = useState<WorkProject | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      aria-label="Exhibit Archive Index"
      onMouseMove={handleMouseMove}
      className="relative w-full"
    >
      {/* Floating Cursor Thumbnail Preview (Desktop Only) */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              left: mousePos.x + 24,
              top: mousePos.y - 80,
              pointerEvents: "none",
              zIndex: 40,
            }}
            className="hidden md:block overflow-hidden rounded-[14px] border border-white/20 bg-[#08080B] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="relative h-28 w-44">
              <Image
                src={activeItem.image}
                alt={activeItem.alt}
                fill
                sizes="176px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2.5 right-2.5">
                <p className="font-mono text-[10px] tracking-wider text-white/90 truncate">
                  {activeItem.metric}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Eyebrow Header */}
      <div className="mb-6 flex items-center justify-between font-mono text-[11px] sm:text-xs tracking-[0.2em] text-[#0A5CFF]">
        <span>ARCHIVE INDEX</span>
        <span className="text-white/40">01 — 05</span>
      </div>

      {/* Index List Container */}
      <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/our-work/${project.slug}`}
            onMouseEnter={() => setActiveItem(project)}
            onMouseLeave={() => setActiveItem(null)}
            className="group flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6 transition-colors duration-300 hover:bg-white/[0.02] px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl"
          >
            {/* Number & Client */}
            <div className="flex items-center gap-6 sm:gap-8">
              <span className="font-mono text-xs sm:text-sm tracking-wider text-[#71717A] group-hover:text-[#0A5CFF] transition-colors">
                {project.number}
              </span>
              <span className="font-sans text-base sm:text-lg font-semibold text-[#F5F2EC] group-hover:text-white transition-colors">
                {project.client}
              </span>
            </div>

            {/* Category & Year */}
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
              <span className="text-xs sm:text-sm text-[#A1A1AA] hidden md:inline">
                {project.category}
              </span>

              <span className="font-mono text-xs text-[#71717A]">
                {project.year}
              </span>

              <span className="inline-flex items-center font-mono text-xs text-[#0A5CFF] rounded-full border border-[#0A5CFF]/30 bg-[#0A5CFF]/10 px-3 py-0.5">
                {project.metric}
              </span>

              <span
                aria-hidden="true"
                className="text-sm text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
              >
                ↗
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
