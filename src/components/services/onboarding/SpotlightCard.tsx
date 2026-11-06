"use client";

import React, { useRef, useState, useCallback, type HTMLAttributes } from "react";

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  numeral?: string;
  isActive?: boolean;
  isHero?: boolean;
  children: React.ReactNode;
}

export function SpotlightCard({
  numeral,
  isActive = true,
  isHero = false,
  className = "",
  children,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setCoords(null);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-[24px] border transition-all duration-400 ease-out gold-card-hover ${
        isActive
          ? "border-[rgba(212,175,55,0.45)] shadow-[0_0_35px_rgba(212,175,55,0.1),0_20px_50px_rgba(0,0,0,0.65)]"
          : "border-white/[0.04] shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
      } bg-[#0A0A0F]/90 backdrop-blur-xl overflow-hidden ${
        isHero ? "p-7 sm:p-9" : "p-6 sm:p-7"
      } ${className}`}
      style={
        {
          "--mouse-x": coords ? `${coords.x}px` : "50%",
          "--mouse-y": coords ? `${coords.y}px` : "50%",
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Hairline gradient top highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/* Top-left hairline metallic gold accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-[rgba(212,175,55,0.8)] via-[rgba(247,224,138,0.5)] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-px h-28 bg-gradient-to-b from-[rgba(212,175,55,0.7)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Mouse Cursor Spotlight Glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: coords
            ? `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, rgba(212, 175, 55, 0.08), transparent 80%), radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(255, 241, 184, 0.04), transparent 70%)`
            : "none",
        }}
      />

      {/* Hero Ambient subtle gradient if hero */}
      {isHero && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#D4AF37]/[0.035] blur-3xl"
        />
      )}

      {/* Large Ghost Numeral (01, 02, 03, 04) - Stroke only in rgba(212,175,55,0.18), brightening on active/hover */}
      {numeral && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-4 select-none font-mono text-5xl sm:text-6xl font-black tracking-tighter transition-all duration-300"
          style={{
            WebkitTextStroke: isActive
              ? "1px rgba(212, 175, 55, 0.55)"
              : isHovered
                ? "1px rgba(212, 175, 55, 0.42)"
                : "1px rgba(212, 175, 55, 0.18)",
            color: "transparent",
            textShadow: isActive
              ? "0 0 30px rgba(212, 175, 55, 0.28)"
              : isHovered
                ? "0 0 24px rgba(212, 175, 55, 0.18)"
                : "0 0 16px rgba(212, 175, 55, 0.05)",
          }}
        >
          {numeral}
        </span>
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
