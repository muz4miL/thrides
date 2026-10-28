"use client";

import { useState, useEffect, useRef } from "react";
import { Pause, Play } from "lucide-react";
import { siteMeta } from "@/content/site";

interface LogoMarqueeProps {
  label?: string;
  speedPixelsPerSecond?: number;
}

export function LogoMarquee({
  label = siteMeta.trustBarSummary,
  speedPixelsPerSecond = 40,
}: LogoMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(58);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measureWidth = () => {
      if (groupRef.current) {
        const width = groupRef.current.offsetWidth;
        if (width > 0) {
          const calculatedDuration = Math.max(15, Math.round(width / speedPixelsPerSecond));
          setDuration(calculatedDuration);
        }
      }
    };

    measureWidth();
    const resizeObserver = new ResizeObserver(() => measureWidth());
    if (groupRef.current) resizeObserver.observe(groupRef.current);
    return () => resizeObserver.disconnect();
  }, [speedPixelsPerSecond]);

  const highlights = [
    "3 Years Track Record",
    "14+ Businesses Supported",
    "8 Countries Reached",
    "On-Purpose Marketing",
    "Conversion Websites",
    "Measurable Results",
  ];

  return (
    <section
      aria-label="Trust Bar"
      className="relative w-full overflow-hidden bg-[#08080B] py-8 sm:py-12 select-none border-y border-white/[0.08]"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4">
        {/* Trust Bar metrics */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center font-display text-[13px] sm:text-[15px] md:text-[16px] font-bold tracking-[0.14em] text-white uppercase">
            <span>3 years</span>
            <span className="text-[#0052FF]">•</span>
            <span>14+ businesses</span>
            <span className="text-[#0052FF]">•</span>
            <span>8 countries</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Resume logo marquee animation" : "Pause logo marquee animation"}
            className="grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-white/5 text-neutral-400 transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            title={isPaused ? "Resume marquee" : "Pause marquee"}
          >
            {isPaused ? (
              <Play size={10} className="ml-0.5 fill-current" />
            ) : (
              <Pause size={10} className="fill-current" />
            )}
          </button>
        </div>
      </div>

      {/* Overflow-clipped horizontal marquee track */}
      <div className="relative mt-6 sm:mt-8 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] focus-within:[&_.marquee-track]:[animation-play-state:paused] hover:[&_.marquee-track]:[animation-play-state:paused]">
        <div
          className="marquee-track flex w-max will-change-transform"
          style={{
            animationName: "marquee-scroll",
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {/* Repeat 4 times for smooth continuous scroll */}
          {[0, 1, 2, 3].map((rep) => (
            <div
              key={rep}
              ref={rep === 0 ? groupRef : undefined}
              className="flex shrink-0 items-center gap-10 sm:gap-14 px-6 sm:px-8"
              aria-hidden={rep > 0}
            >
              {highlights.map((item, bIdx) => (
                <div
                  key={bIdx}
                  className="flex items-center gap-3 text-[17px] sm:text-[20px] font-bold text-white/75 hover:text-white tracking-tight transition-colors"
                >
                  <span className="font-display">{item}</span>
                  <span className="text-blue-700 text-sm">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
