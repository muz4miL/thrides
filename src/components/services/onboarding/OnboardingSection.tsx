"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";
import { TimelineStep } from "./TimelineStep";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
});

const DEFAULT_CHECKLIST_ITEMS = [
  {
    title: "A plan behind every move",
    desc: "Everything ties to your goals.",
  },
  {
    title: "Strategy backed by data",
    desc: "We research before we create.",
  },
  {
    title: "Plain-language reporting",
    desc: "You always know what's working.",
  },
];

const DEFAULT_TIMELINE_STEPS = [
  {
    dayLabel: "Day 1",
    title: "Welcome",
    desc: "A named contact from hour one.",
  },
  {
    dayLabel: "Day 2",
    title: "First 48 Hours",
    desc: "30 minutes. One action plan.",
  },
  {
    dayLabel: "Day 5",
    title: "Kickoff Call",
    desc: "Goals, timeline, deliverables. Locked.",
  },
  {
    dayLabel: "Day 14",
    title: "Live Delivery",
    desc: "Track progress in real time.",
  },
];

interface OnboardingSectionProps {
  checklistItems?: { title: string; desc: string }[] | undefined;
  timelineSteps?: { dayLabel: string; title: string; desc: string }[] | undefined;
}

export function OnboardingSection({
  checklistItems = DEFAULT_CHECKLIST_ITEMS,
  timelineSteps = DEFAULT_TIMELINE_STEPS,
}: OnboardingSectionProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const displayChecklist = checklistItems && checklistItems.length > 0 ? checklistItems : DEFAULT_CHECKLIST_ITEMS;
  const displayTimeline = timelineSteps && timelineSteps.length > 0 ? timelineSteps : DEFAULT_TIMELINE_STEPS;

  // Scroll tracking across the timeline
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 60%", "end 60%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressScaleY = shouldReduceMotion ? scrollYProgress : smoothProgress;
  const cometTopPercent = useTransform(progressScaleY, (v) => `${Math.max(0, Math.min(100, v * 100))}%`);

  // Calculate active step based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const stepCount = displayTimeline.length || 4;
      const stepIdx = Math.min(Math.floor(latest * stepCount), stepCount - 1);
      setActiveStep(Math.max(0, stepIdx));
    });
    return () => unsubscribe();
  }, [scrollYProgress, displayTimeline.length]);

  const currentActiveIndex = hoveredStep !== null ? hoveredStep : activeStep;

  // Map 4 phases to the 3 checklist items
  // Phase 0 -> Item 0 | Phase 1 & 2 -> Item 1 | Phase 3 -> Item 2
  const activeChecklistIndex =
    currentActiveIndex === 0 ? 0 : currentActiveIndex <= 2 ? 1 : 2;

  return (
    <section
      className="relative py-24 sm:py-32 bg-[#060608] border-t border-b border-white/[0.05] select-none"
      style={{ overflowX: "clip" }}
    >
      {/* 1. Ambient luxury gold radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-[#D4AF37]/[0.035] blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-10 h-[500px] w-[500px] rounded-full bg-[#B8860B]/[0.03] blur-[150px]"
      />

      {/* 2. 3% Film Grain SVG Noise Filter */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay"
      >
        <filter id="noiseFilter-onboarding">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter-onboarding)" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT COLUMN: Sticky storytelling panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-[112px] lg:self-start space-y-6">
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6B93C] block">
                CLIENT ONBOARDING
              </span>

              <h2 className="mt-3 font-display text-[clamp(28px,3.8vw,46px)] font-extrabold tracking-[-0.04em] text-[#F5F2EC] leading-[1.1]">
                The first two weeks{" "}
                <span
                  className={`${instrumentSerif.className} italic font-normal text-[#F5F2EC] text-[1.12em] tracking-normal`}
                >
                  set the tone
                </span>
              </h2>

              <p className="mt-4 text-[14.5px] sm:text-[15.5px] leading-relaxed text-neutral-400">
                No guesswork. No black holes. A clear plan from day one.
              </p>
            </div>

            {/* Checklist Items reacting dynamically to active phase */}
            <div className="pt-2 space-y-3.5">
              {displayChecklist.slice(0, 3).map((item, i) => {
                const isItemActive = activeChecklistIndex === i;
                return (
                  <div
                    key={`${item.title}-${i}`}
                    className={`flex items-start gap-3.5 transition-all duration-300 ease-out ${
                      isItemActive
                        ? "opacity-100 translate-x-1"
                        : "opacity-45 translate-x-0"
                    }`}
                  >
                    <div
                      className={`mt-0.5 h-6 w-6 flex items-center justify-center rounded-full shrink-0 transition-all duration-300 ${
                        isItemActive
                          ? "bg-[#D4AF37]/20 border border-[#D4AF37]/60 shadow-[0_0_12px_rgba(212,175,55,0.35)]"
                          : "bg-white/[0.04] border border-white/10"
                      }`}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="overflow-visible"
                      >
                        <motion.path
                          d="M4 12.5L9.5 18L20 6.5"
                          stroke={isItemActive ? "#D4AF37" : "#A1A1AA"}
                          strokeWidth="2.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={
                            shouldReduceMotion
                              ? { pathLength: 1, opacity: 1 }
                              : { pathLength: 0, opacity: 0 }
                          }
                          whileInView={{ pathLength: 1, opacity: 1 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.15 + i * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      </svg>
                    </div>

                    <div>
                      <h3
                        className={`font-display font-bold text-[14.5px] leading-snug transition-colors duration-300 ${
                          isItemActive ? "text-white" : "text-neutral-400"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`mt-0.5 text-[13px] leading-relaxed transition-colors duration-300 ${
                          isItemActive ? "text-neutral-300" : "text-neutral-500"
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Scrolling phase cards with gold timeline track */}
          <div className="lg:col-span-7 space-y-4">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6B93C] block mb-6">
              WHAT HAPPENS WHEN YOU JOIN
            </span>

            <div ref={timelineRef} className="relative space-y-8 sm:space-y-10">
              {/* Unfilled vertical track */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-6 bottom-6 w-[2px] -translate-x-1/2 bg-white/[0.08] pointer-events-none"
              />

              {/* Faint 6px blur glow duplicate underneath filled portion */}
              <motion.div
                aria-hidden="true"
                style={{
                  scaleY: progressScaleY,
                  transformOrigin: "top",
                  background: "var(--gold-metal)",
                }}
                className="absolute left-0 top-6 bottom-6 w-[2px] -translate-x-1/2 blur-[6px] opacity-70 pointer-events-none"
              />

              {/* Progress/filled portion using --gold-metal with glow */}
              <motion.div
                aria-hidden="true"
                style={{
                  scaleY: progressScaleY,
                  transformOrigin: "top",
                  background: "var(--gold-metal)",
                }}
                className="absolute left-0 top-6 bottom-6 w-[2px] -translate-x-1/2 shadow-[0_0_14px_rgba(212,175,55,0.7),0_0_22px_rgba(212,175,55,0.4)] pointer-events-none z-10"
              />

              {/* Glowing gold "comet" dot riding the leading edge */}
              <motion.div
                aria-hidden="true"
                style={{
                  top: cometTopPercent,
                }}
                className="absolute left-0 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#FFF1B8] border-2 border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.95),0_0_24px_rgba(212,175,55,0.6)] pointer-events-none z-30 transition-transform duration-100"
              >
                <span className="animate-ping absolute inset-0 rounded-full bg-[#E6B93C] opacity-75" />
              </motion.div>

              {displayTimeline.map((step, index) => (
                <div
                  key={`${step.title}-${index}`}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <TimelineStep
                    step={step}
                    index={index}
                    dayLabel={step.dayLabel}
                    isActive={currentActiveIndex === index}
                    isPassed={index < currentActiveIndex}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
