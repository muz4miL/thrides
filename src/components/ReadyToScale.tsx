import { ArrowUpRight } from "lucide-react";
import { SectionBadge } from "./site/SectionBadge";

export default function ReadyToScale() {
  return (
    <section
      id="final-cta"
      aria-label="Ready to Scale"
      className="relative w-full overflow-hidden bg-[#000000] pt-16 sm:pt-22 lg:pt-28 pb-16 sm:pb-22 lg:pb-28 select-none border-t border-white/[0.06] scroll-mt-24"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Eyebrow and Section Header */}
        <div className="flex flex-col items-center text-center max-w-[840px] mx-auto">
          <SectionBadge>YOU MADE IT THIS FAR</SectionBadge>

          <h2 className="mt-5 sm:mt-7 text-center">
            <span className="block font-display text-[36px] sm:text-[54px] lg:text-[72px] font-extrabold leading-[0.98] lg:leading-[0.95] tracking-[-0.04em] text-white">
              Ready to{" "}
              <span className="font-serif italic font-normal text-white">
                Scale?
              </span>
            </span>
          </h2>

          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] lg:text-[19px] leading-relaxed text-[#A1A1AA] max-w-[660px]">
            Whether you’re <strong className="text-white font-semibold">scaling to $1M/month</strong> or heading towards a <strong className="text-white font-semibold">$100M+ valuation</strong>. Thrides becomes your unfair advantage in creative, media, and performance.
          </p>
        </div>

        {/* Architectural Banner Container */}
        <div className="relative mt-12 sm:mt-16 overflow-hidden rounded-[30px] sm:rounded-[44px] border border-white/10 bg-[#08080C] shadow-2xl">
          {/* Ambient Blue Backlight */}
          <div
            className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#0052FF]/20 blur-3xl"
            aria-hidden="true"
          />

          {/* Banner Graphic Layer */}
          <div className="relative w-full overflow-hidden min-h-[270px] sm:min-h-[340px] lg:min-h-[440px] flex items-center justify-between">
            <picture className="absolute inset-0 h-full w-full pointer-events-none select-none">
              <source media="(max-width: 768px)" srcSet="/readytoScale-mobile.png" />
              <img
                src="/readytoScale.png"
                alt="Ready to scale? Make your next move with Thrides"
                className="h-full w-full object-cover object-center select-none"
                loading="lazy"
              />
            </picture>

            {/* Contrast and glow overlays */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 md:bg-gradient-to-r md:from-black/40 md:via-transparent md:to-black/50" />

            {/* Ambient blue glow behind button */}
            <div className="pointer-events-none absolute right-4 md:right-16 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#0052FF]/25 blur-[90px]" />

            {/* Floating Hero Bouncy Pulsing Button on the Right (Centered on mobile) */}
            <div className="relative z-20 w-full flex justify-center md:justify-end px-4 sm:px-10 lg:px-16 py-8 md:py-0">
              <a
                href="/contact"
                aria-label="Book a Growth Audit"
                className="group relative inline-flex h-[68px] sm:h-[78px] w-full max-w-[320px] sm:max-w-[360px] items-center justify-between rounded-full bg-[#000000] p-[5px] transition-all duration-300 hover:bg-[#0052FF] hover:scale-[1.03] active:scale-[0.98] select-none shadow-[0_0_35px_rgba(0,82,255,0.35)]"
              >
                {/* Animated Outer Blue Pulse */}
                <span
                  className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-[#0052FF] animate-hero-border-pulse"
                  aria-hidden="true"
                />

                {/* Inner Pill */}
                <div className="relative z-10 flex h-full w-full items-center justify-between rounded-full border border-white/20 px-5 sm:px-6 transition-colors duration-300 group-hover:border-white/50">
                  <span className="text-[16px] sm:text-[17px] font-medium text-white transition-colors duration-300">
                    Book a
                  </span>

                  {/* Central Blue Icon Tile with t. */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-[12px] bg-[#0052FF] blur-[8px] opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
                    <div className="relative grid h-[42px] w-[42px] sm:h-[46px] sm:w-[46px] place-items-center rounded-[12px] bg-[#0052FF] shadow-[0_0_14px_rgba(0,82,255,0.55)]">
                      <span className="font-display text-[22px] sm:text-[24px] font-black text-white leading-none pl-0.5">
                        t.
                      </span>
                    </div>
                  </div>

                  <span className="text-[16px] sm:text-[17px] font-medium text-white transition-colors duration-300">
                    Growth Audit
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
