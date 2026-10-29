"use client";

import React, { useRef, useState, useCallback } from "react";
import { Instrument_Serif } from "next/font/google";
import { TrustStrip } from "./TrustStrip";
import { FormStepper } from "./FormStepper";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
});

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-16 sm:py-20 lg:py-24 bg-[#070709] overflow-hidden select-none">
      {/* 1. Slow-Drifting Blue Radial Glow Behind the Form */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-1/4 h-[650px] w-[650px] rounded-full bg-[#0A5CFF]/[0.09] blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-10 h-[500px] w-[500px] rounded-full bg-[#0A5CFF]/[0.05] blur-[150px]"
      />

      {/* 2. Film Grain Overlay (3% opacity, blend mode overlay) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay"
      >
        <filter id="noiseFilter-contact">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter-contact)" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1320px] w-full px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Minimal, high-impact narrative (~35%)        */}
          {/* On mobile: Headline first, trust strip below form         */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 xl:col-span-5 space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-[clamp(44px,5.8vw,78px)] font-extrabold tracking-[-0.04em] text-[#F5F2EC] leading-[0.98]">
                Good things
                <br />
                start with
                <span
                  className={`${instrumentSerif.className} block text-[#0A5CFF] text-[1.08em] font-normal italic tracking-normal mt-1 leading-[1.05]`}
                >
                  a conversation.
                </span>
              </h1>

              <p className="text-[15px] sm:text-[16px] text-neutral-400 leading-relaxed max-w-sm">
                Tell us what you&apos;re building. We&apos;ll find the right next step.
              </p>
            </div>

            {/* Desktop Trust Strip & Contact Avatar */}
            <div className="hidden lg:block pt-4">
              <TrustStrip />
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Focused Luxury Form Card (~65%)             */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 xl:col-span-7 w-full">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setCoords(null);
              }}
              className="group relative rounded-[24px] border border-white/[0.08] bg-[#0A0A0F]/85 backdrop-blur-2xl p-6 sm:p-9 shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300 hover:border-white/20"
            >
              {/* Hairline top gradient highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 w-36 h-px bg-gradient-to-r from-[#0A5CFF] to-transparent opacity-80"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-[#0A5CFF] to-transparent opacity-70"
              />

              {/* Soft Cursor Spotlight Glow */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                  isHovered && coords ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background: coords
                    ? `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(10, 92, 255, 0.12), transparent 80%), radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.05), transparent 70%)`
                    : "none",
                }}
              />

              {/* Form Stepper Content */}
              <div className="relative z-10">
                <FormStepper />
              </div>
            </div>

            {/* Mobile Trust Strip (appears below form on mobile) */}
            <div className="lg:hidden mt-8 pt-4 border-t border-white/[0.08]">
              <TrustStrip />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

