import { ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Hero overview"
      className="relative mx-auto w-full overflow-hidden rounded-[36px] sm:rounded-[44px] md:rounded-[52px] bg-[#000000] border border-white/[0.08] min-h-[560px] lg:h-[calc(100vh-140px)] lg:min-h-[600px] lg:max-h-[720px] shadow-2xl"
    >
      {/* ========================================================
          DESKTOP LAYOUT (>= 1024px / lg) - DEFIANT BLACK THEME
         ======================================================== */}
      <div className="hidden lg:grid lg:grid-cols-[48fr_52fr] h-full">
        {/* Left: Text, CTA & Partner Logos */}
        <div className="rise-in z-10 flex flex-col justify-center px-10 py-10 lg:px-14 xl:px-16 h-full">
          {/* Headline: We / Deliver / Growth */}
          <h1 className="select-none text-[clamp(60px,5.8vw,104px)] font-extrabold leading-[0.88] tracking-[-0.055em] text-[#D5D5D5]">
            <span className="block font-display">We</span>
            <span className="block font-serif font-normal italic tracking-[-0.035em] text-[1.07em] leading-[0.88] -ml-1 text-[#D5D5D5]">
              Deliver
            </span>
            <span className="block font-display">Growth.</span>
          </h1>

          {/* Subtitle description */}
          <p className="mt-5 max-w-md text-[17px] xl:text-[18px] text-[#A0A0AA] leading-relaxed">
            Brand identity, social content, and scalable performance campaigns built to convert.
          </p>

          {/* Button & Partner Logos on the same row */}
          <div className="mt-8 flex flex-wrap items-center gap-6 lg:gap-7">
            <a
              href="/contact"
              aria-label="Book a Growth Audit"
              className="group relative inline-flex h-[80px] w-[345px] shrink-0 items-center justify-between rounded-full bg-[#000000] p-[5px] transition-colors duration-200 hover:bg-[#F3FF00] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 select-none"
            >
              <span
                className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-[#F3FF00] animate-hero-border-pulse"
                aria-hidden="true"
              />

              <div className="relative z-10 flex h-full w-full items-center justify-between rounded-full border border-white/20 px-6 transition-colors duration-200 group-hover:border-[#b8c200]/70">
                <span className="text-[18px] font-medium text-white transition-colors duration-200 group-hover:text-black">
                  Book a
                </span>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-[14px] bg-[#F3FF00] blur-[10px] opacity-40 transition-opacity duration-200 group-hover:opacity-75" />
                  <div className="relative grid h-[46px] w-[46px] place-items-center rounded-[14px] bg-[#F3FF00] shadow-[0_0_16px_rgba(243,255,0,0.45)]">
                    <span className="font-display text-[22px] font-black text-black leading-none pl-0.5 group-hover:scale-105 transition-transform">
                      t.
                    </span>
                  </div>
                </div>

                <span className="text-[18px] font-medium text-white transition-colors duration-200 group-hover:text-black">
                  Growth Audit
                </span>
              </div>
            </a>

            <div className="flex items-center">
              <img
                src="/PartnerLogos.png"
                alt="Partner credentials: Meta, Google, Shopify Plus, Klaviyo"
                className="h-[36px] w-auto max-w-[320px] object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Right: Seamless Floating Artwork (~52%) */}
        <div className="relative h-full w-full overflow-hidden bg-[#000000]">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#000000] via-[#000000]/60 to-transparent" />
          <img
            src="/flatinghero.png"
            alt="Thrides visual showcase"
            className="h-full w-full object-cover object-[70%_center] select-none"
            loading="eager"
          />
        </div>
      </div>

      {/* ========================================================
          MOBILE & TABLET LAYOUT (< 1024px)
          Defiant Style Typography + Real Marquee Logos + Glowing Badge
         ======================================================== */}
      <div className="flex lg:hidden flex-col items-center justify-center text-center px-4 py-8 sm:py-10 w-full h-full select-none">
        {/* Top Centered Headline: We / Deliver / Growth. */}
        <h1 className="select-none flex flex-col items-center">
          <span className="block font-display text-[44px] sm:text-[54px] font-extrabold leading-[0.88] tracking-[-0.055em] text-[#D5D5D5]">
            We
          </span>
          <span className="block font-serif font-normal italic tracking-[-0.035em] text-[1.08em] leading-[0.88] text-[#D5D5D5] -my-1">
            Deliver
          </span>
          <span className="block font-display text-[44px] sm:text-[54px] font-extrabold leading-[0.88] tracking-[-0.055em] text-[#D5D5D5]">
            Growth.
          </span>
        </h1>

        {/* Subtitle description */}
        <p className="mt-3.5 text-center text-[15px] sm:text-[17px] text-[#A0A0AA] max-w-[290px] leading-relaxed">
          Brand identity, social content and advertising.
        </p>

        {/* Center: Glowing Brand Squircle with Real Marquee Logos Gliding Horizontally */}
        <div className="relative my-7 sm:my-8 flex items-center justify-center w-full max-w-[420px] overflow-hidden">
          {/* Intense ambient yellow glow blur */}
          <div className="pointer-events-none absolute z-10 h-36 w-36 rounded-full bg-[#F3FF00]/30 blur-3xl" />

          {/* Real Marquee Logos flowing behind the central badge */}
          <div className="absolute inset-x-0 z-0 flex items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)]">
            <div
              className="flex shrink-0 items-center gap-8 py-2 will-change-transform"
              style={{
                animation: "marquee-scroll 24s linear infinite",
              }}
            >
              <img
                src="/Line1-Logos-V2-scaled.png"
                alt=""
                className="h-[26px] w-auto max-w-none opacity-45 shrink-0"
              />
              <img
                src="/Line2-Logos-v3-scaled.png"
                alt=""
                className="h-[24px] w-auto max-w-none opacity-45 shrink-0"
              />
              <img
                src="/Line1-Logos-V2-scaled.png"
                alt=""
                className="h-[26px] w-auto max-w-none opacity-45 shrink-0"
              />
              <img
                src="/Line2-Logos-v3-scaled.png"
                alt=""
                className="h-[24px] w-auto max-w-none opacity-45 shrink-0"
              />
            </div>
          </div>

          {/* Central Glowing Brand Squircle (pinned on top) */}
          <div className="relative z-20 flex shrink-0 items-center justify-center py-2">
            <div className="absolute -inset-1.5 rounded-[28px] bg-[#F3FF00] opacity-80 blur-md" />
            <div className="relative grid h-[92px] w-[92px] place-items-center rounded-[26px] bg-[#F3FF00] shadow-[0_0_40px_rgba(243,255,0,0.55)]">
              <span className="font-display text-[54px] font-black leading-none text-black select-none pl-0.5">
                t.
              </span>
            </div>
          </div>
        </div>

        {/* Pill CTA Button with Glowing Outer Border */}
        <div className="w-full flex justify-center">
          <a
            href="/contact"
            aria-label="Book a Growth Audit"
            className="group relative inline-flex h-[72px] sm:h-[76px] w-full max-w-[340px] items-center justify-between rounded-full bg-[#000000] p-[5px] transition-colors duration-200 hover:bg-[#F3FF00] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 select-none"
          >
            {/* Animated Outer Yellow Pulse */}
            <span
              className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-[#F3FF00] animate-hero-border-pulse"
              aria-hidden="true"
            />

            {/* Inner Pill */}
            <div className="relative z-10 flex h-full w-full items-center justify-between rounded-full border border-white/20 px-5 sm:px-6 transition-colors duration-200 group-hover:border-[#b8c200]/70">
              <span className="text-[16px] sm:text-[17px] font-medium text-white transition-colors duration-200 group-hover:text-black">
                Book a
              </span>

              {/* Central Yellow Rounded Icon Tile with t. */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-[12px] bg-[#F3FF00] blur-[8px] opacity-60" />
                <div className="relative grid h-[42px] w-[42px] place-items-center rounded-[12px] bg-[#F3FF00] shadow-[0_0_12px_rgba(243,255,0,0.5)]">
                  <span className="font-display text-[22px] font-black text-black leading-none">
                    t.
                  </span>
                </div>
              </div>

              <span className="text-[16px] sm:text-[17px] font-medium text-white transition-colors duration-200 group-hover:text-black">
                Growth Audit
              </span>
            </div>
          </a>
        </div>

        {/* Partner Logos Strip Centered Below Button */}
        <div className="mt-5 flex items-center justify-center">
          <img
            src="/PartnerLogos.png"
            alt="Meta, Google, Shopify Plus, Klaviyo Partners"
            className="h-[28px] sm:h-[32px] w-auto max-w-[270px] sm:max-w-[300px] object-contain opacity-85"
          />
        </div>
      </div>
    </section>
  );
}
