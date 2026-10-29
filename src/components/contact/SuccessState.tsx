"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface SuccessStateProps {
  fullName: string;
}

const NEXT_STEPS = [
  {
    title: "We review your brief",
    day: "Day 1",
  },
  {
    title: "We talk it through",
    day: "Day 2",
  },
  {
    title: "We agree the next step",
    day: "Day 3",
  },
];

export function SuccessState({ fullName }: SuccessStateProps) {
  const shouldReduceMotion = useReducedMotion();
  const firstName = fullName.trim().split(" ")[0] || "there";

  return (
    <div className="py-8 sm:py-12 flex flex-col items-center text-center space-y-8 sm:space-y-10">
      {/* 1. Large Glowing Blue Badge with Self-Drawing Checkmark */}
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0A5CFF] shadow-[0_0_40px_rgba(10,92,255,0.55)]">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            className="overflow-visible"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="#FFFFFF"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={
                shouldReduceMotion
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>

      {/* 2. Calm Affirmation Headline */}
      <div className="space-y-2 max-w-lg">
        <h2 className="font-display text-[clamp(28px,3.8vw,44px)] font-extrabold tracking-[-0.035em] text-[#F5F2EC] leading-[1.15]">
          Thanks, {firstName}.
          <br />
          We&apos;ll reply within 4 hours.
        </h2>
      </div>

      {/* 3. Horizontal 3-Step Timeline with Day Labels */}
      <div className="w-full max-w-xl pt-4">
        <div className="relative">
          {/* Horizontal Connecting Blue Glowing Track */}
          <div
            aria-hidden="true"
            className="absolute top-2 left-6 right-6 h-[2px] bg-gradient-to-r from-[#0A5CFF]/30 via-[#0A5CFF] to-[#0A5CFF]/30 shadow-[0_0_10px_#0A5CFF] pointer-events-none"
          />

          <div className="grid grid-cols-3 gap-2 relative z-10">
            {NEXT_STEPS.map((step, idx) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center space-y-2.5 px-1"
              >
                {/* Glowing Node */}
                <div className="h-4 w-4 rounded-full bg-white border-2 border-[#0A5CFF] shadow-[0_0_12px_#0A5CFF,0_0_20px_#0A5CFF] shrink-0" />

                <div>
                  <p className="font-display font-medium text-[12.5px] sm:text-[13.5px] text-[#F5F2EC] leading-snug">
                    {step.title}
                  </p>
                  <span className="font-mono text-[11px] text-neutral-400 mt-1 block">
                    {step.day}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Secondary Action Link */}
      <div className="pt-2">
        <Link
          href="/our-work"
          className="inline-flex items-center gap-2 text-[13px] font-mono text-neutral-400 hover:text-white transition-colors underline-offset-4 hover:underline"
        >
          <span>While you wait, explore our case studies</span>
          <ArrowRight size={13} className="text-[#0A5CFF]" />
        </Link>
      </div>
    </div>
  );
}

