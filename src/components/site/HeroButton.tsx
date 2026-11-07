import { ArrowUpRight } from "lucide-react";

interface HeroButtonProps {
  href?: string;
  leftText?: string;
  rightText?: string;
  ariaLabel?: string;
  className?: string;
}

export function HeroButton({
  href = "/contact",
  leftText = "Book a",
  rightText = "Growth Audit",
  ariaLabel,
  className = "",
}: HeroButtonProps) {
  const label = ariaLabel || `${leftText} ${rightText}`;

  return (
    <a
      href={href}
      aria-label={label}
      className={`group relative inline-flex h-[64px] sm:h-[70px] w-full max-w-[345px] shrink-0 items-center justify-between rounded-full btn-shiny-blue px-6 sm:px-7 select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 ${className}`}
    >
      {/* Outer ambient pulsing blue aura */}
      <span
        className="pointer-events-none absolute -inset-1 rounded-full bg-[#0056F5]/40 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Glossy top glass reflection highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0.5 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full"
      />

      {/* Left text */}
      <span className="relative z-10 text-[16px] sm:text-[17px] font-bold text-white tracking-tight whitespace-nowrap drop-shadow-sm">
        {leftText}
      </span>

      {/* Central Glass Brand Badge with t. */}
      <div className="relative z-10 mx-2 flex items-center justify-center shrink-0">
        <div className="grid h-[36px] w-[36px] sm:h-[40px] sm:w-[40px] place-items-center rounded-full bg-black/25 backdrop-blur-md border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] group-hover:bg-black/35 group-hover:scale-105 transition-all">
          <span className="font-display text-[18px] sm:text-[20px] font-black text-white leading-none pl-0.5">
            t.
          </span>
        </div>
      </div>

      {/* Right text + subtle arrow */}
      <div className="relative z-10 flex items-center gap-1.5">
        <span className="text-[16px] sm:text-[17px] font-bold text-white tracking-tight whitespace-nowrap drop-shadow-sm">
          {rightText}
        </span>
        <ArrowUpRight
          size={16}
          className="stroke-[3] text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
        />
      </div>
    </a>
  );
}
