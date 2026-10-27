import { cn } from "@/lib/utils";
import React from "react";

interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
  hasShine?: boolean;
}

export function SectionBadge({
  children,
  className = "",
  hasShine = true,
}: SectionBadgeProps) {
  return (
    <div
      className={cn(
        "group relative inline-flex h-[38px] sm:h-[42px] items-center justify-center overflow-hidden rounded-full border border-white/12 bg-gradient-to-b from-[#1C1C22]/90 via-[#121217]/90 to-[#0A0A0E]/90 px-5 sm:px-6 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22),0_6px_20px_rgba(0,0,0,0.5)] backdrop-blur-md select-none transition-all duration-300 hover:border-white/25",
        className
      )}
    >
      {/* Specular glass shine streak */}
      {hasShine && (
        <span
          className="pointer-events-none absolute -inset-x-full top-0 h-full w-[200%] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transform -skew-x-12 animate-badge-shine"
          aria-hidden="true"
        />
      )}
      <span className="relative z-10 font-display text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] text-[#E4E4E7] uppercase">
        {children}
      </span>
    </div>
  );
}
