"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { StepVisual } from "./StepVisual";
import type { HowItWorksStep } from "./types";

interface JourneyStepProps {
  step: HowItWorksStep;
  index: number;
}

export function JourneyStep({ step, index }: JourneyStepProps) {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // Delay for the glowing node as the 1.2s line sweeps across
  const nodeDelay = 0.15 + index * 0.4;

  return (
    <motion.li
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 24, filter: "blur(6px)" }
      }
      whileInView={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex flex-col list-none"
    >
      {/* Time Label Above Node */}
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-[#C9A96A] bg-[#C9A96A]/10 border border-[#C9A96A]/25 px-2.5 py-0.5 rounded-md">
          {step.timeLabel}
        </span>
      </div>

      {/* Numbered Glowing Node (01, 02, 03) */}
      <div className="relative mb-5 flex items-center">
        <motion.div
          initial={
            shouldReduceMotion
              ? { scale: 1, opacity: 1 }
              : { scale: 0.85, opacity: 0.4 }
          }
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: nodeDelay, ease: "easeOut" }}
          className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0F] border border-[#0A5CFF] shadow-[0_0_16px_rgba(10,92,255,0.4)]"
        >
          <span className="font-mono text-xs font-bold text-[#F5F2EC]">
            {step.stepNumber}
          </span>
          <span className="absolute inset-0 rounded-full border border-white/20 animate-pulse pointer-events-none" />
        </motion.div>
      </div>

      {/* Step Card with 24px radius, hairline border & cursor spotlight */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCoords(null);
        }}
        className="group relative flex-1 rounded-[24px] border border-white/[0.08] bg-[#0A0A0F]/85 backdrop-blur-xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(10,92,255,0.1)] flex flex-col justify-between"
      >
        {/* Hairline top gradient highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-28 h-px bg-gradient-to-r from-[#0A5CFF] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Soft Cursor Spotlight Glow */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            isHovered && coords ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: coords
              ? `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(10, 92, 255, 0.12), transparent 80%), radial-gradient(140px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.05), transparent 70%)`
              : "none",
          }}
        />

        {/* Card Body */}
        <div className="relative z-10">
          <h3 className="font-display font-extrabold text-[19px] sm:text-[21px] text-[#F5F2EC] tracking-[-0.03em] leading-snug">
            {step.title}
          </h3>
          <p className="mt-2.5 text-[13.5px] sm:text-[14px] leading-relaxed text-neutral-400">
            {step.desc}
          </p>
        </div>

        {/* Specialized Mini Visual */}
        <div className="relative z-10">
          <StepVisual stepIndex={index} />
        </div>
      </div>
    </motion.li>
  );
}

