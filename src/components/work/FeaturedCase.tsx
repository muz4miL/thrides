"use client";

import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CountUp } from "./CountUp";
import type { WorkProject } from "./work-data";

interface FeaturedCaseProps {
  project: WorkProject;
  totalCount?: number;
}

export function FeaturedCase({ project, totalCount = 5 }: FeaturedCaseProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-24, 24]
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const formattedTotal = String(totalCount).padStart(2, "0");

  return (
    <section aria-label="Signature Exhibit" className="relative w-full">
      {/* Eyebrow Header Row */}
      <div className="mb-6 flex items-center justify-between font-mono text-[11px] sm:text-xs tracking-[0.2em] text-[#0A5CFF]">
        <span>SIGNATURE WORK</span>
        <span>
          {project.number} / {formattedTotal}
        </span>
      </div>

      {/* Full-Width Exhibit Card */}
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group relative isolate overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#08080B] p-5 sm:p-7 lg:p-9 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-white/[0.18]"
      >
        {/* Soft cursor spotlight glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(550px circle at ${mousePos.x}% ${mousePos.y}%, rgba(10,92,255,0.12), transparent 70%)`,
          }}
        />

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[60fr_40fr] lg:gap-12 xl:gap-16">
          {/* Left Column: Contained Parallax Image (60%) */}
          <div
            ref={imageContainerRef}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#0D0D12] border border-white/[0.06]"
          >
            <motion.div
              style={{ y: parallaxY }}
              className="relative h-[115%] w-full -top-[7.5%]"
            >
              <Image
                src={project.image}
                alt={project.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center select-none transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </motion.div>
          </div>

          {/* Right Column: Museum-Placard Editorial Copy (40%) */}
          <div className="flex flex-col justify-center py-2 lg:py-6">
            {/* Category Chip */}
            <div className="mb-5 sm:mb-6">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#D4D4D8]">
                {project.category}
              </span>
            </div>

            {/* Exhibit Title */}
            <h3 className="font-sans text-[clamp(2rem,3.4vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#F5F2EC]">
              {project.titlePrefix}
              <span className="font-serif italic font-normal text-[#0A5CFF] pl-1.5">
                {project.titleAccent}
              </span>
            </h3>

            {/* One-line commercial outcome */}
            <p className="mt-4 text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
              {project.outcome}
            </p>

            {/* Metrics Row */}
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/[0.08] pt-7">
              <div>
                <p className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#F5F2EC]">
                  <CountUp value={project.metric} />
                </p>
                <p className="mt-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#71717A]">
                  {project.metricLabel}
                </p>
              </div>

              {project.secondaryMetric && (
                <div>
                  <p className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#F5F2EC]">
                    <CountUp value={project.secondaryMetric} />
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#71717A]">
                    {project.secondaryMetricLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Action Pill */}
            <div className="mt-8 sm:mt-10">
              <Link
                href={`/our-work/${project.slug}`}
                className="group/btn inline-flex items-center gap-2 rounded-full border border-[#0A5CFF]/40 bg-[#0A5CFF]/10 px-6 py-3 text-sm font-semibold text-[#0A5CFF] transition-all duration-300 hover:border-[#0A5CFF] hover:bg-[#0A5CFF] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A5CFF]"
              >
                <span>View case study</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                >
                  ↗
                </span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
