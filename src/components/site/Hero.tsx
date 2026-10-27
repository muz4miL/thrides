import { ArrowUpRight } from "lucide-react";
import heroMosaicImg from "@/assets/brandit-hero-mosaic.png";
import { siteMeta } from "@/content/site";

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Hero overview"
      className="relative mx-auto w-full overflow-hidden rounded-[36px] sm:rounded-[44px] md:rounded-[52px] bg-white border border-black/[0.08] min-h-[580px] lg:h-[calc(100vh-140px)] lg:min-h-[620px] lg:max-h-[720px] shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
    >
      {/* ========================================================
          DESKTOP LAYOUT (>= 1024px / lg)
         ======================================================== */}
      <div className="hidden lg:grid lg:grid-cols-[50fr_50fr] h-full">
        {/* Left: Text, CTA & Microcopy */}
        <div className="rise-in z-10 flex flex-col justify-center px-10 py-10 lg:px-14 xl:px-16 h-full">
          {/* Headline: Your Brand, / Everywhere. / On Purpose. */}
          <h1 className="select-none text-[clamp(44px,4.5vw,82px)] font-extrabold leading-[0.92] tracking-[-0.05em] text-[#09090B]">
            <span className="block font-display">Your Brand,</span>
            <span className="block font-serif font-normal italic tracking-[-0.03em] text-[1.06em] leading-[0.9] -ml-1 text-[#18181B]">
              Everywhere.
            </span>
            <span className="block font-display">On Purpose.</span>
          </h1>

          {/* Subtitle description from brief */}
          <p className="mt-5 max-w-lg text-[16px] xl:text-[17px] text-[#52525B] leading-relaxed">
            {siteMeta.subHeadline}
          </p>

          {/* Button, Secondary Link & Microcopy */}
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-5 sm:gap-6">
              {/* Primary Pill Button */}
              <a
                href="/contact"
                aria-label="Book a free strategy call"
                className="group relative inline-flex h-[76px] w-[340px] shrink-0 items-center justify-between rounded-full bg-black p-[5px] transition-all duration-200 hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4 select-none"
              >
                <span
                  className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-black/30 animate-hero-border-pulse"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex h-full w-full items-center justify-between rounded-full border border-white/20 px-6 transition-colors duration-200 group-hover:border-white/40">
                  <span className="text-[16px] font-medium text-white transition-colors duration-200">
                    Book a Free
                  </span>

                  <div className="relative flex items-center justify-center">
                    <div className="relative grid h-[44px] w-[44px] place-items-center rounded-[14px] bg-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                      <ArrowUpRight
                        size={20}
                        className="stroke-[3] text-black transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>

                  <span className="text-[16px] font-medium text-white transition-colors duration-200">
                    Strategy Call
                  </span>
                </div>
              </a>

              {/* Secondary link: See the Packages → */}
              <a
                href="/services#packages"
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#09090B] hover:text-blue-700 underline-offset-4 hover:underline py-2 px-3 transition-colors"
              >
                <span>See the Packages</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* Microcopy below CTA */}
            <p className="text-[13px] text-[#71717A] max-w-md">
              {siteMeta.microcopy}
            </p>
          </div>
        </div>

        {/* Right: Seamless Floating Artwork (~50%) */}
        <div className="relative h-full w-full overflow-hidden bg-white">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-white via-white/60 to-transparent" />
          <img
            src={heroMosaicImg}
            alt="Thrides visual agency showcase"
            className="h-full w-full object-cover object-[70%_center] select-none"
            loading="eager"
          />
        </div>
      </div>

      {/* ========================================================
          MOBILE & TABLET LAYOUT (< 1024px)
         ======================================================== */}
      <div className="flex lg:hidden flex-col items-center justify-center text-center px-4 py-8 sm:py-10 w-full h-full select-none">
        {/* Top Centered Headline */}
        <h1 className="select-none flex flex-col items-center">
          <span className="block font-display text-[36px] sm:text-[46px] font-extrabold leading-[0.92] tracking-[-0.05em] text-[#09090B]">
            Your Brand,
          </span>
          <span className="block font-serif font-normal italic tracking-[-0.03em] text-[1.08em] leading-[0.92] text-[#18181B] -my-0.5">
            Everywhere.
          </span>
          <span className="block font-display text-[36px] sm:text-[46px] font-extrabold leading-[0.92] tracking-[-0.05em] text-[#09090B]">
            On Purpose.
          </span>
        </h1>

        {/* Subtitle description */}
        <p className="mt-3.5 text-center text-[14px] sm:text-[15px] text-[#52525B] max-w-[340px] leading-relaxed">
          {siteMeta.subHeadline}
        </p>

        {/* Center: Thrides Monogram Badge */}
        <div className="relative my-7 sm:my-8 flex items-center justify-center w-full max-w-[420px] overflow-hidden">
          <div className="pointer-events-none absolute z-10 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Central Brand Squircle */}
          <div className="relative z-20 flex shrink-0 items-center justify-center py-2">
            <div className="relative grid h-[88px] w-[88px] place-items-center rounded-[24px] bg-[#09090B] shadow-lg">
              <span className="font-display text-[46px] font-black leading-none text-white select-none">
                t<span className="text-blue-500">.</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pill CTA Button */}
        <div className="w-full flex flex-col items-center gap-3">
          <a
            href="/contact"
            aria-label="Book a free strategy call"
            className="group relative inline-flex h-[68px] sm:h-[72px] w-full max-w-[340px] items-center justify-between rounded-full bg-black p-[5px] transition-colors duration-200 hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4 select-none"
          >
            <span
              className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-black/30 animate-hero-border-pulse"
              aria-hidden="true"
            />

            <div className="relative z-10 flex h-full w-full items-center justify-between rounded-full border border-white/20 px-5 sm:px-6 transition-colors duration-200">
              <span className="text-[15px] sm:text-[16px] font-medium text-white transition-colors duration-200">
                Book a Free
              </span>

              <div className="relative flex items-center justify-center">
                <div className="relative grid h-[40px] w-[40px] place-items-center rounded-[12px] bg-white shadow-sm">
                  <ArrowUpRight size={18} className="stroke-[3] text-black" />
                </div>
              </div>

              <span className="text-[15px] sm:text-[16px] font-medium text-white transition-colors duration-200">
                Strategy Call
              </span>
            </div>
          </a>

          <a
            href="/services#packages"
            className="text-[14px] font-semibold text-[#09090B] underline-offset-4 hover:underline"
          >
            See the Packages →
          </a>

          {/* Microcopy below CTA */}
          <p className="text-[12px] text-[#71717A] max-w-[320px] mt-1">
            {siteMeta.microcopy}
          </p>
        </div>
      </div>
    </section>
  );
}
