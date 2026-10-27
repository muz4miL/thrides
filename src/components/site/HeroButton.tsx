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
      className={`group relative inline-flex h-[74px] sm:h-[80px] w-full max-w-[345px] shrink-0 items-center justify-between rounded-full bg-[#000000] p-[5px] transition-colors duration-200 hover:bg-[#0052FF] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 select-none ${className}`}
    >
      {/* Animated Outer Blue Pulse */}
      <span
        className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-[#0052FF] animate-hero-border-pulse"
        aria-hidden="true"
      />

      {/* Inner Pill Container */}
      <div className="relative z-10 flex h-full w-full items-center justify-between rounded-full border border-white/20 px-5 sm:px-6 transition-colors duration-200 group-hover:border-white/50">
        <span className="text-[16px] sm:text-[18px] font-medium text-white transition-colors duration-200 whitespace-nowrap">
          {leftText}
        </span>

        {/* Central Glowing Brand Squircle with t. */}
        <div className="relative mx-2 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-[14px] bg-[#0052FF] blur-[10px] opacity-40 transition-opacity duration-200 group-hover:opacity-85" />
          <div className="relative grid h-[42px] w-[42px] sm:h-[46px] sm:w-[46px] place-items-center rounded-[14px] bg-[#0052FF] shadow-[0_0_18px_rgba(0,82,255,0.55)]">
            <span className="font-display text-[20px] sm:text-[22px] font-black text-white leading-none pl-0.5 group-hover:scale-105 transition-transform">
              t.
            </span>
          </div>
        </div>

        <span className="text-[16px] sm:text-[18px] font-medium text-white transition-colors duration-200 whitespace-nowrap">
          {rightText}
        </span>
      </div>
    </a>
  );
}
