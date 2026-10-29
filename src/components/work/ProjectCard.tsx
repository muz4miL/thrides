"use client";

import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { WorkProject } from "./work-data";

interface ProjectCardProps {
  project: WorkProject;
  aspectClass?: string;
  gridSpanClass?: string;
  onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: () => void;
}

export function ProjectCard({
  project,
  aspectClass = "aspect-[16/10]",
  gridSpanClass = "",
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [localMouse, setLocalMouse] = useState({ x: 50, y: 50 });

  const handleLocalMove = (e: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setLocalMouse({ x, y });
    }
    onMouseMove?.(e);
  };

  return (
    <article
      ref={cardRef}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#08080B] p-4 sm:p-5 lg:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-white/[0.22] ${gridSpanClass}`}
      onMouseEnter={onMouseEnter}
      onMouseMove={handleLocalMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Cursor spotlight on card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${localMouse.x}% ${localMouse.y}%, rgba(10,92,255,0.10), transparent 70%)`,
        }}
      />

      {/* Linked Image Region */}
      <Link
        href={`/our-work/${project.slug}`}
        aria-label={`View ${project.client} case study`}
        className="relative block w-full flex-1 overflow-hidden rounded-[18px] bg-[#0D0D12]"
      >
        <motion.div
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }
          }
          whileInView={
            reduceMotion
              ? { opacity: 1 }
              : { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }
          }
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`relative w-full overflow-hidden rounded-[18px] ${aspectClass}`}
        >
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw"
            className="object-cover object-center select-none transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {/* Hover rising dark gradient with key metric */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="font-mono text-xs tracking-wider text-white/90">
              {project.metric} · {project.metricLabel}
            </span>
          </div>
        </motion.div>
      </Link>

      {/* Placard Caption BELOW Image */}
      <motion.div
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }
        }
        className="mt-4 sm:mt-5 flex flex-col gap-1.5"
      >
        {/* Tiny Mono Client & Year */}
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#0A5CFF]">
            {project.client} / {project.year}
          </p>
        </div>

        {/* Title and Metric Chip Row */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-sans text-[1.2rem] sm:text-[1.35rem] lg:text-[1.45rem] font-semibold leading-snug tracking-[-0.02em] text-[#F5F2EC]">
            <Link
              href={`/our-work/${project.slug}`}
              className="transition-colors hover:text-white"
            >
              {project.title}
            </Link>
          </h3>

          {/* Thin Metric Chip */}
          <span className="inline-flex shrink-0 items-center rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-white/85">
            {project.metric}
          </span>
        </div>

        {/* One-Line Outcome */}
        <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed line-clamp-1">
          {project.outcome}
        </p>
      </motion.div>
    </article>
  );
}
