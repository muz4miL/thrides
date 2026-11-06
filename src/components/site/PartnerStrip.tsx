"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { PartnerLogoDoc, PartnerLogoSettingsDoc } from "@/server/types";

interface PartnerStripProps {
  logos?: PartnerLogoDoc[];
  settings?: PartnerLogoSettingsDoc;
  align?: "left" | "center";
  isMobile?: boolean;
  className?: string;
}

export function PartnerStrip({
  logos = [],
  settings,
  align = "left",
  isMobile = false,
  className = "",
}: PartnerStripProps) {
  const [hiddenLogos, setHiddenLogos] = useState<Set<string>>(new Set());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const listener = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Section disabled or no logos
  if (settings && settings.sectionEnabled === false) {
    return null;
  }

  const activeLogos = logos.filter((l) => l.isActive && !hiddenLogos.has(l.id));
  if (activeLogos.length === 0) {
    return null;
  }

  const logoHeight = Math.max(24, Math.min(48, settings?.logoHeight || 32));
  const tone = settings?.tone || "original";
  const floatEffect = Boolean(settings?.floatEffect) && !prefersReducedMotion;
  const isMarquee = settings?.displayMode === "marquee" && !prefersReducedMotion;

  // Marquee duration
  const speedDurations = {
    slow: "36s",
    normal: "24s",
    fast: "14s",
  };
  const marqueeDuration = speedDurations[settings?.marqueeSpeed || "normal"];

  // Tone styling classes & styles
  const getToneStyle = (isHovered?: boolean) => {
    switch (tone) {
      case "muted":
        return "filter grayscale brightness-[1.1] opacity-75 hover:grayscale-0 hover:brightness-100 hover:opacity-100";
      case "mono-white":
        return "filter brightness-0 invert opacity-75 hover:opacity-100";
      case "original":
      default:
        return "opacity-90 hover:opacity-100";
    }
  };

  const handleImageError = (id: string) => {
    console.warn(`Partner logo failed to load (${id}), hiding gracefully.`);
    setHiddenLogos((prev) => new Set(prev).add(id));
  };

  const renderLogo = (logo: PartnerLogoDoc, index: number, isDuplicate = false) => {
    const aspectRatio = logo.width / (logo.height || 1);
    const calculatedWidth = Math.round(aspectRatio * logoHeight);

    const logoElement = (
      <div
        style={{
          height: `${logoHeight}px`,
          width: `${calculatedWidth}px`,
          animation: floatEffect
            ? `partnerFloat 6.5s ease-in-out infinite ${index * 0.75}s`
            : "none",
        }}
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 hover:-translate-y-0.5 ${getToneStyle()}`}
      >
        <Image
          src={logo.imageUrl}
          alt={logo.altText || logo.name}
          width={calculatedWidth}
          height={logoHeight}
          priority={index < 2 && !isDuplicate}
          loading={index < 2 && !isDuplicate ? "eager" : "lazy"}
          onError={() => handleImageError(logo.id)}
          className="h-full w-full object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.55)] select-none pointer-events-none"
        />
      </div>
    );

    if (logo.linkUrl && !isDuplicate) {
      return (
        <a
          key={`${logo.id}-${index}${isDuplicate ? "-dup" : ""}`}
          href={logo.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={logo.name}
          tabIndex={isDuplicate ? -1 : 0}
          aria-hidden={isDuplicate}
          className="group inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-black rounded-md"
        >
          {logoElement}
        </a>
      );
    }

    return (
      <div
        key={`${logo.id}-${index}${isDuplicate ? "-dup" : ""}`}
        title={logo.name}
        aria-hidden={isDuplicate}
        tabIndex={isDuplicate ? -1 : undefined}
        className="inline-flex items-center"
      >
        {logoElement}
      </div>
    );
  };

  // Marquee Mode
  if (isMarquee) {
    // Repeat enough items so the animation loops continuously
    const repeats = activeLogos.length < 5 ? 3 : 2;
    const duplicatedLogos: { logo: PartnerLogoDoc; isDup: boolean }[] = [];
    for (let r = 0; r < repeats; r++) {
      activeLogos.forEach((l) => duplicatedLogos.push({ logo: l, isDup: r > 0 }));
    }

    return (
      <div
        className={`relative overflow-hidden w-full max-w-[360px] sm:max-w-[420px] group ${className}`}
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
        <style jsx>{`
          @keyframes partnerMarquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          @keyframes partnerFloat {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-3px);
            }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: partnerMarquee ${marqueeDuration} linear infinite;
          }
          .marquee-track:hover,
          .marquee-track:focus-within {
            animation-play-state: paused;
          }
        `}</style>
        <div className="marquee-track flex items-center gap-6 sm:gap-8 py-1">
          {duplicatedLogos.map((item, idx) =>
            renderLogo(item.logo, idx, item.isDup)
          )}
        </div>
      </div>
    );
  }

  // Static Mode
  return (
    <div
      className={`flex flex-wrap items-center gap-4 sm:gap-6 ${
        align === "center" ? "justify-center" : "justify-start"
      } ${className}`}
    >
      <style jsx>{`
        @keyframes partnerFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
      `}</style>
      {activeLogos.map((logo, idx) => renderLogo(logo, idx))}
    </div>
  );
}
