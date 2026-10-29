"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
});

export interface CtaBannerProps {
  eyebrow: string;
  headingPrefix: string;
  accentText: string;
  buttonText: string;
  buttonHref?: string;
  imageSrc: string;
  mobileObjectPosition?: string; // e.g. "85% center" or "75% center"
  className?: string;
}

export function CtaBanner({
  eyebrow,
  headingPrefix,
  accentText,
  buttonText,
  buttonHref = "/contact",
  imageSrc,
  mobileObjectPosition = "80% center",
  className = "",
}: CtaBannerProps) {
  const shouldReduceMotion = useReducedMotion();

  // Strip trailing arrow character if user provides it, so we can use standard Lucide icon
  const cleanButtonLabel = buttonText.replace(/[↗→]/g, "").trim();

  return (
    <div className={`relative w-full ${className}`}>
      {/* Outer entrance reveal wrapper */}
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 16 }
        }
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="group relative w-full overflow-hidden rounded-[28px] sm:rounded-[32px] md:rounded-[36px] border border-white/[0.08] bg-[#0A0A0F] shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
      >
        {/* Hairline top highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"
        />

        {/* ========================================================= */}
        {/* DESKTOP LAYOUT (>= lg): ~3:1 aspect ratio with artwork on right */}
        {/* ========================================================= */}
        <div className="hidden lg:block relative w-full aspect-[3/1] min-h-[420px] max-h-[480px]">
          {/* Separate wrapper for desktop hover image movement (up to 8px) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden"
          >
            <div
              className={`w-full h-full ${
                shouldReduceMotion
                  ? ""
                  : "transition-transform duration-700 ease-out group-hover:scale-[1.02] group-hover:translate-x-1.5"
              }`}
            >
              <img
                src={imageSrc}
                alt=""
                loading="lazy"
                decoding="async"
                width={2172}
                height={724}
                className="h-full w-full object-cover object-right"
              />
            </div>
          </div>

          {/* Left subtle dark gradient overlay for text readability */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/90 to-transparent z-10"
          />

          {/* Left real HTML Content */}
          <div className="relative z-20 h-full max-w-[580px] p-10 xl:p-14 flex flex-col justify-between items-start">
            <div>
              <span className="font-mono text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#0A5CFF] block mb-3.5">
                {eyebrow}
              </span>

              <h2 className="font-display text-[clamp(34px,3.6vw,52px)] font-extrabold text-[#F5F2EC] tracking-[-0.035em] leading-[1.08]">
                {headingPrefix}{" "}
                <span
                  className={`${instrumentSerif.className} italic font-normal text-[#c3d4ff] text-[1.12em] block mt-1 tracking-normal`}
                >
                  {accentText}
                </span>
              </h2>
            </div>

            <div className="pt-6">
              <Link
                href={buttonHref}
                className="inline-flex h-[52px] xl:h-[56px] items-center justify-center gap-2.5 rounded-full bg-[#0A5CFF] px-8 xl:px-9 text-[14.5px] xl:text-[15.5px] font-semibold text-white shadow-[0_0_24px_rgba(10,92,255,0.4)] hover:bg-[#004ADE] hover:shadow-[0_0_32px_rgba(10,92,255,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{cleanButtonLabel}</span>
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE & TABLET LAYOUT (< lg): Stacked composition        */}
        {/* ========================================================= */}
        <div className="lg:hidden flex flex-col">
          {/* Text and CTA above */}
          <div className="p-6 sm:p-8 flex flex-col space-y-5 relative z-10">
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0A5CFF] block mb-2">
                {eyebrow}
              </span>

              <h2 className="font-display text-[27px] sm:text-[34px] font-extrabold text-[#F5F2EC] tracking-[-0.035em] leading-[1.12]">
                {headingPrefix}{" "}
                <span
                  className={`${instrumentSerif.className} italic font-normal text-[#c3d4ff] text-[1.12em] block mt-1 tracking-normal`}
                >
                  {accentText}
                </span>
              </h2>
            </div>

            <div>
              <Link
                href={buttonHref}
                className="w-full inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-[#0A5CFF] px-6 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(10,92,255,0.35)] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{cleanButtonLabel}</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* Separate artwork region below with ~4:3 landscape ratio */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#0A0A0F]">
            {/* Blend top edge of artwork into dark background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0A0A0F] to-transparent z-10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0A0A0F] to-transparent z-10"
            />

            <img
              src={imageSrc}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ objectPosition: mobileObjectPosition }}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
