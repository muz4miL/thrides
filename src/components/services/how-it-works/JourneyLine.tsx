"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface JourneyLineProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function JourneyLine({
  orientation = "horizontal",
  className = "",
}: JourneyLineProps) {
  const shouldReduceMotion = useReducedMotion();

  if (orientation === "horizontal") {
    return (
      <div
        aria-hidden="true"
        className={`relative w-full h-[2px] pointer-events-none ${className}`}
      >
        {/* Background Track with subtle blue glow */}
        <div className="absolute inset-0 bg-white/[0.08] shadow-[0_0_8px_rgba(10,92,255,0.15)]" />

        {/* Animated Blue Fill Line: draws left to right ~1.2s */}
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
          className="absolute inset-0 origin-left bg-gradient-to-r from-[#0A5CFF] via-[#0A5CFF] to-[#60A5FA] shadow-[0_0_12px_#0A5CFF,0_0_20px_#0A5CFF]"
        />
      </div>
    );
  }

  // Vertical orientation for mobile
  return (
    <div
      aria-hidden="true"
      className={`relative w-[2px] h-full pointer-events-none ${className}`}
    >
      {/* Background Track */}
      <div className="absolute inset-0 bg-white/[0.08] shadow-[0_0_8px_rgba(10,92,255,0.15)]" />

      {/* Animated Blue Fill Line: draws top to bottom ~1.2s */}
      <motion.div
        initial={
          shouldReduceMotion
            ? { scaleY: 1, opacity: 1 }
            : { scaleY: 0, opacity: 1 }
        }
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0 origin-top bg-gradient-to-b from-[#0A5CFF] via-[#0A5CFF] to-[#60A5FA] shadow-[0_0_12px_#0A5CFF,0_0_20px_#0A5CFF]"
      />
    </div>
  );
}

