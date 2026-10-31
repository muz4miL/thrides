"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import { JourneyStep } from "./JourneyStep";
import { HOW_IT_WORKS_STEPS, HowItWorksStep } from "./types";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
});

export function HowItWorksSection({ steps }: { steps?: HowItWorksStep[] | undefined } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const displaySteps = steps && steps.length > 0 ? steps : HOW_IT_WORKS_STEPS;

  return (
    <section
      id="how-it-works"
      aria-label="How it works process"
      className="relative py-24 sm:py-32 overflow-hidden bg-[#060608] border-t border-b border-white/[0.05] select-none"
    >
      {/* 1. Ambient slow-drifting blue radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-[#0A5CFF]/[0.07] blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[550px] w-[550px] rounded-full bg-[#0A5CFF]/[0.05] blur-[150px]"
      />

      {/* 2. 3% Film Grain SVG Noise Filter */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay"
      >
        <filter id="noiseFilter-process">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter-process)" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
        <div className="max-w-2xl mb-14 sm:mb-18">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#0A5CFF] block">
            SIMPLE PROCESS
          </span>

          <h2 className="mt-3 font-display text-[clamp(32px,4.5vw,56px)] font-extrabold tracking-[-0.04em] text-[#F5F2EC] leading-[1.08]">
            How it{" "}
            <span
              className={`${instrumentSerif.className} italic font-normal text-[#F5F2EC] text-[1.12em] tracking-normal`}
            >
              works
            </span>
          </h2>

          <p className="mt-3 text-[15px] sm:text-[16px] text-neutral-400 leading-relaxed">
            Three steps from your first conversation to results in progress.
          </p>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-[52px] left-[18px] right-[18px] h-[2px] pointer-events-none z-0"
          >
            <div className="absolute inset-0 bg-white/[0.08] shadow-[0_0_8px_rgba(10,92,255,0.15)]" />

            <motion.div
              initial={
                shouldReduceMotion
                  ? { scaleX: 1, opacity: 1 }
                  : { scaleX: 0, opacity: 1 }
              }
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0 origin-left bg-gradient-to-r from-[#0A5CFF] via-[#0A5CFF] to-[#60A5FA] shadow-[0_0_14px_#0A5CFF,0_0_22px_#0A5CFF]"
            />
          </div>

          <ol className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8 relative z-10 m-0 p-0">
            {displaySteps.map((step, idx) => (
              <JourneyStep key={step.stepNumber} step={step} index={idx} />
            ))}
          </ol>
        </div>

        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 16 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 sm:mt-18 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#0A5CFF] shadow-[0_0_12px_#0A5CFF]">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
            <p className="text-[13.5px] font-mono text-neutral-300">
              Clear timelines, guaranteed delivery dates, no guesswork.
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#0A5CFF] px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_0_24px_rgba(10,92,255,0.4)] hover:bg-[#004ADE] hover:shadow-[0_0_32px_rgba(10,92,255,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
          >
            <span>Book your free strategy call</span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
