"use client";

import { useState, useEffect, useRef } from "react";
import { Pause, Play } from "lucide-react";
import Image from "next/image";

interface StatPill {
  id: string;
  value: string;
}

interface MarqueeItemData {
  id: string;
  text: string;
}

interface FloatingLogo {
  id: string;
  imageUrl: string;
  altText: string;
  name: string;
  width: number;
  height: number;
}

interface StripSettings {
  marqueeSectionEnabled: boolean;
  marqueeSpeedPixelsPerSec: number;
  logoCloudEnabled: boolean;
}

interface StatsStripProps {
  speedPixelsPerSecond?: number;
}

// 3D floating logo cloud — pure CSS, no library
function LogoCloud({ logos }: { logos: FloatingLogo[] }) {
  if (!logos.length) return null;

  // Deterministic orbital positions for up to 12 logos
  const positions = [
    { top: "12%", left: "8%",  dur: "7s",   delay: "0s",    rz: "-8deg",  sc: 1.0  },
    { top: "55%", left: "4%",  dur: "9s",   delay: "-2s",   rz: "6deg",   sc: 0.85 },
    { top: "78%", left: "18%", dur: "8s",   delay: "-1s",   rz: "-4deg",  sc: 0.9  },
    { top: "8%",  left: "88%", dur: "10s",  delay: "-3s",   rz: "10deg",  sc: 0.95 },
    { top: "40%", left: "92%", dur: "7.5s", delay: "-0.5s", rz: "-12deg", sc: 1.05 },
    { top: "75%", left: "82%", dur: "9.5s", delay: "-4s",   rz: "7deg",   sc: 0.8  },
    { top: "30%", left: "15%", dur: "8.5s", delay: "-1.5s", rz: "3deg",   sc: 0.75 },
    { top: "20%", left: "78%", dur: "11s",  delay: "-2.5s", rz: "-5deg",  sc: 0.9  },
    { top: "65%", left: "50%", dur: "6.5s", delay: "-0.8s", rz: "9deg",   sc: 0.7  },
    { top: "10%", left: "50%", dur: "9s",   delay: "-3.5s", rz: "-3deg",  sc: 0.85 },
    { top: "85%", left: "45%", dur: "8s",   delay: "-1.2s", rz: "5deg",   sc: 0.8  },
    { top: "50%", left: "35%", dur: "7s",   delay: "-4.5s", rz: "-9deg",  sc: 0.65 },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {logos.slice(0, 12).map((logo, i) => {
        const pos = positions[i % positions.length]!;
        return (
          <div
            key={logo.id}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: `rotateZ(${pos.rz}) scale(${pos.sc})`,
              animation: `floatLogo ${pos.dur} ease-in-out ${pos.delay} infinite alternate`,
              willChange: "transform, opacity",
              opacity: 0,
              filter: "grayscale(0.3) brightness(1.2)",
            }}
          >
            <Image
              src={logo.imageUrl}
              alt={logo.altText || logo.name}
              width={logo.width || 80}
              height={logo.height || 32}
              className="h-8 w-auto object-contain opacity-20"
              style={{ maxWidth: "100px" }}
              unoptimized
            />
          </div>
        );
      })}
    </div>
  );
}

export function LogoMarquee({ speedPixelsPerSecond }: StatsStripProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(58);
  const groupRef = useRef<HTMLDivElement>(null);

  const [pills, setPills] = useState<StatPill[]>([
    { id: "d1", value: "3 Years" },
    { id: "d2", value: "14+ Businesses" },
    { id: "d3", value: "8 Countries" },
  ]);
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItemData[]>([
    { id: "m1", text: "3 Years Track Record" },
    { id: "m2", text: "14+ Businesses Supported" },
    { id: "m3", text: "8 Countries Reached" },
    { id: "m4", text: "On-Purpose Marketing" },
    { id: "m5", text: "Conversion Websites" },
    { id: "m6", text: "Measurable Results" },
  ]);
  const [logos, setLogos] = useState<FloatingLogo[]>([]);
  const [settings, setSettings] = useState<StripSettings>({
    marqueeSectionEnabled: true,
    marqueeSpeedPixelsPerSec: speedPixelsPerSecond ?? 40,
    logoCloudEnabled: true,
  });

  // Fetch dynamic data
  useEffect(() => {
    fetch("/api/stats-strip")
      .then((r) => r.json())
      .then((data) => {
        if (data.pills?.length) setPills(data.pills);
        if (data.marqueeItems?.length) setMarqueeItems(data.marqueeItems);
        if (data.logos) setLogos(data.logos);
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {/* use defaults */});
  }, []);

  const effectiveSpeed = settings.marqueeSpeedPixelsPerSec ?? (speedPixelsPerSecond ?? 40);

  useEffect(() => {
    const measureWidth = () => {
      if (groupRef.current) {
        const width = groupRef.current.offsetWidth;
        if (width > 0) {
          const calculatedDuration = Math.max(15, Math.round(width / effectiveSpeed));
          setDuration(calculatedDuration);
        }
      }
    };
    measureWidth();
    const resizeObserver = new ResizeObserver(() => measureWidth());
    if (groupRef.current) resizeObserver.observe(groupRef.current);
    return () => resizeObserver.disconnect();
  }, [effectiveSpeed, marqueeItems]);

  if (!settings.marqueeSectionEnabled) return null;

  return (
    <section
      aria-label="Trust Bar"
      className="relative w-full overflow-hidden bg-[#08080B] py-8 sm:py-12 select-none border-y border-white/[0.08]"
    >
      {/* 3D floating logo cloud background */}
      {settings.logoCloudEnabled && logos.length > 0 && (
        <LogoCloud logos={logos} />
      )}

      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-4 z-10">
        {/* Stat pills */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center font-display text-[13px] sm:text-[15px] md:text-[16px] font-bold tracking-[0.14em] text-white uppercase">
            {pills.map((pill, i) => (
              <span key={pill.id} className="flex items-center gap-2 sm:gap-4">
                <span>{pill.value}</span>
                {i < pills.length - 1 && (
                  <span className="text-[#0052FF]">•</span>
                )}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Resume marquee animation" : "Pause marquee animation"}
            className="ml-2 grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-white/5 text-neutral-400 transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-white"
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
      <div className="relative mt-6 sm:mt-8 w-full overflow-hidden z-10 [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
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
          {[0, 1, 2, 3].map((rep) => (
            <div
              key={rep}
              ref={rep === 0 ? groupRef : undefined}
              className="flex shrink-0 items-center gap-10 sm:gap-14 px-6 sm:px-8"
              aria-hidden={rep > 0}
            >
              {marqueeItems.map((item, bIdx) => (
                <div
                  key={bIdx}
                  className="flex items-center gap-3 text-[17px] sm:text-[20px] font-bold text-white/75 hover:text-white tracking-tight transition-colors"
                >
                  <span className="font-display">{item.text}</span>
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
