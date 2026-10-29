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
      className={`group relative rounded-[24px] border transition-all duration-500 ease-out ${
        isActive
          ? "border-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:border-white/25 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(10,92,255,0.12)]"
          : "border-white/[0.04] shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
      } bg-[#0A0A0F]/85 backdrop-blur-xl overflow-hidden ${
        isHero ? "p-7 sm:p-9 ring-1 ring-[#0A5CFF]/20" : "p-6 sm:p-7"
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

      {/* Top-left hairline electric-blue accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-[#0A5CFF] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-px h-28 bg-gradient-to-b from-[#0A5CFF] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Mouse Cursor Spotlight Glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: coords
            ? `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, rgba(10, 92, 255, 0.14), transparent 80%), radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.06), transparent 70%)`
            : "none",
        }}
      />

      {/* Hero Ambient subtle gradient if hero */}
      {isHero && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#0A5CFF]/[0.07] blur-3xl"
        />
      )}

      {/* Large Ghost Numeral (01, 02, 03, 04) with Champagne-Gold Touch */}
      {numeral && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-4 select-none font-mono text-5xl sm:text-6xl font-black tracking-tighter"
          style={{
            WebkitTextStroke: "1px rgba(201, 169, 106, 0.16)",
            color: "transparent",
            textShadow: "0 0 24px rgba(201, 169, 106, 0.08)",
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
