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
    desc: "Everything we do ties back to your business goals.",
  },
  {
    title: "Strategy backed by business intelligence",
    desc: "We research your market, competitors, and customers before we create anything.",
  },
  {
    title: "Plain-language reporting",
    desc: "You always know what's working and what we're changing.",
  },
];

const DEFAULT_TIMELINE_STEPS = [
  {
    dayLabel: "Day 1",
    title: "Welcome",
    desc: "A welcome message and a named point of contact from day one.",
  },
  {
    dayLabel: "Day 2",
    title: "Kickoff Call",
    desc: "We confirm your goals, timeline, deliverables, and what we need from you.",
  },
  {
    dayLabel: "Day 5",
    title: "Agreed Response Times",
    desc: "You know how quickly we reply, with agreed SLAs from the start.",
  },
  {
    dayLabel: "Day 14",
    title: "Progress You Can See",
    desc: "You always know what's in progress, what's next, and what has been delivered.",
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
    offset: ["start 65%", "end 60%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  const fillHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

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

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#060608] border-t border-b border-white/[0.05] select-none">
      {/* 1. Subtle, slow ambient radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-[#0A5CFF]/[0.06] blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-10 h-[500px] w-[500px] rounded-full bg-[#0A5CFF]/[0.05] blur-[150px]"
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
          {/* LEFT COLUMN */}
          <div className="lg:col-span-5 lg:sticky lg:top-[120px] self-start space-y-6">
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#0A5CFF] block">
                CLIENT ONBOARDING
              </span>

              <h2 className="mt-3 font-display text-[clamp(28px,3.8vw,46px)] font-extrabold tracking-[-0.04em] text-[#F5F2EC] leading-[1.1]">
                A smooth start, because the{" "}
                <span
                  className={`${instrumentSerif.className} italic font-normal text-[#F5F2EC] text-[1.12em] tracking-normal`}
                >
                  first two weeks
                </span>{" "}
                set the tone
              </h2>

              <p className="mt-5 text-[14.5px] sm:text-[15.5px] leading-relaxed text-neutral-400">
                No guesswork, no communication black holes. We establish
                structured check-ins, rapid feedback loops, and clear delivery
                roadmaps from day one.
              </p>
            </div>

            {/* Checklist Items with Self-Drawing SVG Checkmarks */}
            <div className="pt-2 space-y-4">
              {displayChecklist.map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3.5 group"
                >
                  <div className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full bg-[#0A5CFF]/10 border border-[#0A5CFF]/30 shrink-0 shadow-[0_0_12px_rgba(10,92,255,0.18)] transition-colors duration-200 group-hover:border-[#0A5CFF]/60 group-hover:bg-[#0A5CFF]/20">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="overflow-visible"
                    >
                      <motion.path
                        d="M4 12.5L9.5 18L20 6.5"
                        stroke="#0A5CFF"
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
                          duration: 0.65,
                          delay: 0.2 + i * 0.15,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-[14.5px] text-[#F5F2EC] leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-7 space-y-4">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#0A5CFF] block mb-6">
              WHAT HAPPENS WHEN YOU JOIN
            </span>

            <div ref={timelineRef} className="relative space-y-8 sm:space-y-10">
              <div
                aria-hidden="true"
                className="absolute left-0 top-6 bottom-6 w-[1px] bg-white/[0.08] shadow-[0_0_8px_rgba(10,92,255,0.15)] pointer-events-none"
              />

              <motion.div
                aria-hidden="true"
                style={{ height: fillHeight }}
                className="absolute left-0 top-6 w-[1.5px] bg-gradient-to-b from-[#0A5CFF] via-[#0A5CFF] to-[#60A5FA] shadow-[0_0_12px_#0A5CFF,0_0_20px_#0A5CFF] pointer-events-none z-10 origin-top"
              />

              <motion.div
                aria-hidden="true"
                style={{ top: fillHeight }}
                className="absolute left-0 top-6 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#0A5CFF] shadow-[0_0_14px_#0A5CFF,0_0_24px_#0A5CFF] pointer-events-none z-20 transition-transform duration-150"
              >
                <span className="animate-ping absolute inset-0 rounded-full bg-[#0A5CFF] opacity-60" />
              </motion.div>

              {displayTimeline.map((step, index) => (
                <div
                  key={step.title}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <TimelineStep
                    step={step}
                    index={index}
                    dayLabel={step.dayLabel}
                    isActive={currentActiveIndex === index}
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
