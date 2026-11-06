"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SpotlightCard } from "./SpotlightCard";
import { StepVisual } from "./StepVisual";

interface TimelineStepProps {
  step: {
    title: string;
    desc: string;
  };
  index: number;
  dayLabel: string;
  isActive: boolean;
  isPassed?: boolean;
  stepRef?: (el: HTMLDivElement | null) => void;
}

export function TimelineStep({
  step,
  index,
  dayLabel,
  isActive,
  isPassed = false,
  stepRef,
}: TimelineStepProps) {
  const shouldReduceMotion = useReducedMotion();
  const isHero = index === 1; // 02 Kickoff Call is larger/taller bento hero
  const numeral = `0${index + 1}`;

  return (
    <motion.div
      ref={stepRef}
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 28 }
      }
      whileInView={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative pl-8 sm:pl-12 transition-all duration-400 ease-out ${
        shouldReduceMotion
          ? isActive
            ? "opacity-100"
            : "opacity-40"
          : isActive
            ? "opacity-100 scale-100 filter-none"
            : "opacity-40 scale-[0.97] blur-[1px] hover:opacity-80 hover:scale-[0.985] hover:blur-none"
      }`}
    >
      {/* Node Marker on the Timeline Track */}
      <div className="absolute left-0 top-6 -translate-x-1/2 flex items-center justify-center z-20">
        {isActive ? (
          /* Active pulsing ring node */
          <div className="relative h-6 w-6 rounded-full flex items-center justify-center bg-[#D4AF37]/20 border-[1.5px] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.7)] transition-all duration-500">
            <span className="gold-pulse-ring absolute inset-0 rounded-full border border-[#D4AF37]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#FFF1B8] shadow-[0_0_10px_rgba(212,175,55,0.95)]" />
          </div>
        ) : isPassed ? (
          /* Passed filled gold node */
          <div className="h-5 w-5 rounded-full flex items-center justify-center bg-[#D4AF37] border-[1.5px] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.45)] transition-all duration-500">
            <div className="h-2 w-2 rounded-full bg-[#FFF1B8]" />
          </div>
        ) : (
          /* Upcoming dim node */
          <div className="h-5 w-5 rounded-full flex items-center justify-center bg-neutral-900 border border-white/20 transition-all duration-500">
            <div className="h-2 w-2 rounded-full bg-neutral-600" />
          </div>
        )}
      </div>

      {/* Day label badge: Day 1 · Phase 01 */}
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className={`font-mono text-[11px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-md gold-pill-badge gold-shine ${
            index === 0
              ? "gold-shine-d1"
              : index === 1
                ? "gold-shine-d2"
                : index === 2
                  ? "gold-shine-d3"
                  : "gold-shine-d4"
          }`}
        >
          <span className="gold-pill-text">
            {dayLabel} · Phase {numeral}
          </span>
        </span>
      </div>

      {/* Spotlight Bento Card */}
      <SpotlightCard
        numeral={numeral}
        isActive={isActive}
        isHero={isHero}
        className={
          isHero
            ? "ring-1 ring-[rgba(212,175,55,0.35)] shadow-[0_0_30px_rgba(212,175,55,0.06)]"
            : ""
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className={`font-display font-extrabold text-[#F5F2EC] tracking-[-0.03em] ${
                isHero
                  ? "text-[21px] sm:text-[24px]"
                  : "text-[18px] sm:text-[20px]"
              }`}
            >
              {step.title}
            </h3>
            <p className="mt-2 text-[14px] sm:text-[15px] leading-relaxed text-neutral-400 max-w-xl">
              {step.desc}
            </p>
          </div>
        </div>

        {/* Mini Visual Component */}
        <StepVisual stepIndex={index} />
      </SpotlightCard>
    </motion.div>
  );
}
