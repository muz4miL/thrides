"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
  buttonText?: string;
  buttonLeftText?: string;
  buttonRightText?: string;
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
  buttonLeftText = "Ready?",
  buttonRightText = "Start Now",
  buttonHref = "/contact",
  imageSrc,
  mobileObjectPosition = "80% center",
  className = "",
}: CtaBannerProps) {
  const shouldReduceMotion = useReducedMotion();

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

            {/* Signature Thrides Dual-Sided Capsule CTA Button (identical to 3rd component on home page) */}
            <div className="pt-6">
              <Link
                href={buttonHref}
                aria-label="Start a project with Thrides"
                className="group/btn relative inline-flex h-[68px] sm:h-[74px] w-full max-w-[320px] items-center justify-between rounded-full bg-[#000000] p-[5px] transition-all duration-300 hover:bg-[#0052FF] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 select-none shadow-[0_0_28px_rgba(0,82,255,0.22)] cursor-pointer"
              >
                {/* Animated outer glowing breathing border */}
                <span
                  className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-[#0052FF] animate-hero-border-pulse"
                  aria-hidden="true"
                />

                {/* Inner charcoal outline inset */}
                <div className="relative z-10 flex h-full w-full items-center justify-between rounded-full border border-white/20 px-6 transition-colors duration-300 group-hover/btn:border-white/50">
                  {/* Left Text: Ready? */}
                  <span className="text-[16px] sm:text-[17px] font-bold text-white transition-colors duration-300">
                    {buttonLeftText}
                  </span>

                  {/* Central Blue Icon Tile with t. */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-[12px] bg-[#0052FF] blur-[8px] opacity-60 transition-opacity duration-300 group-hover/btn:opacity-90" />
                    <div className="relative grid h-[42px] w-[42px] sm:h-[44px] sm:w-[44px] place-items-center rounded-[12px] bg-[#0052FF] shadow-[0_0_14px_rgba(0,82,255,0.55)]">
                      <span className="font-display text-[20px] sm:text-[22px] font-black text-white leading-none pl-0.5">
                        t.
                      </span>
                    </div>
                  </div>

                  {/* Right Text: Start Now */}
                  <span className="text-[16px] sm:text-[17px] font-bold text-white transition-colors duration-300">
                    {buttonRightText}
                  </span>
                </div>
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

            {/* Signature Thrides Dual-Sided Capsule CTA Button for Mobile */}
            <div>
              <Link
                href={buttonHref}
                aria-label="Start a project with Thrides"
                className="group/btn relative inline-flex h-[66px] sm:h-[72px] w-full max-w-[320px] items-center justify-between rounded-full bg-[#000000] p-[5px] transition-all duration-300 hover:bg-[#0052FF] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 select-none shadow-[0_0_28px_rgba(0,82,255,0.22)] cursor-pointer"
              >
                {/* Animated outer glowing breathing border */}
                <span
                  className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-[#0052FF] animate-hero-border-pulse"
                  aria-hidden="true"
                />

                {/* Inner charcoal outline inset */}
                <div className="relative z-10 flex h-full w-full items-center justify-between rounded-full border border-white/20 px-5 sm:px-6 transition-colors duration-300 group-hover/btn:border-white/50">
                  {/* Left Text: Ready? */}
                  <span className="text-[15px] sm:text-[17px] font-bold text-white transition-colors duration-300">
                    {buttonLeftText}
                  </span>

                  {/* Central Blue Icon Tile with t. */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-[12px] bg-[#0052FF] blur-[8px] opacity-60 transition-opacity duration-300 group-hover/btn:opacity-90" />
                    <div className="relative grid h-[40px] w-[40px] sm:h-[44px] sm:w-[44px] place-items-center rounded-[12px] bg-[#0052FF] shadow-[0_0_14px_rgba(0,82,255,0.55)]">
                      <span className="font-display text-[19px] sm:text-[22px] font-black text-white leading-none pl-0.5">
                        t.
                      </span>
                    </div>
                  </div>

                  {/* Right Text: Start Now */}
                  <span className="text-[15px] sm:text-[17px] font-bold text-white transition-colors duration-300">
                    {buttonRightText}
                  </span>
                </div>
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
