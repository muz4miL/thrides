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
  stepRef?: (el: HTMLDivElement | null) => void;
}

export function TimelineStep({
  step,
  index,
  dayLabel,
  isActive,
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
          : { opacity: 0, y: 28, filter: "blur(6px)" }
      }
      whileInView={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative pl-8 sm:pl-12 transition-opacity duration-500 ease-out ${
        isActive ? "opacity-100" : "opacity-45 hover:opacity-85"
      }`}
    >
      {/* Node Marker on the Timeline Track */}
      <div className="absolute left-0 top-6 -translate-x-1/2 flex items-center justify-center">
        {/* Outer Glow Ring if Active */}
        <div
          className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-500 ${
            isActive
              ? "bg-[#0A5CFF]/20 border border-[#0A5CFF] shadow-[0_0_16px_#0A5CFF]"
              : "bg-neutral-900 border border-white/20"
          }`}
        >
          {/* Inner Core */}
          <div
            className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
              isActive
                ? "bg-white shadow-[0_0_8px_#0A5CFF]"
                : "bg-neutral-500"
            }`}
          />
        </div>
      </div>

      {/* Day label badge in mono text beside/above the card */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="font-mono text-[11px] font-bold tracking-wider text-[#C9A96A] bg-[#C9A96A]/10 border border-[#C9A96A]/25 px-2.5 py-0.5 rounded-md">
          {dayLabel}
        </span>
        <span className="font-mono text-[11px] text-neutral-400">
          Phase {numeral}
        </span>
      </div>

      {/* Spotlight Bento Card */}
      <SpotlightCard
        numeral={numeral}
        isActive={isActive}
        isHero={isHero}
        className={isHero ? "ring-1 ring-[#0A5CFF]/30" : ""}
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
