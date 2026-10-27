import { ArrowUpRight } from "lucide-react";

export function BrandIntro() {
  return (
    <section
      id="about"
      aria-label="Welcome to thrides"
      className="relative w-full overflow-hidden bg-[#000000] rounded-t-[44px] sm:rounded-t-[64px] lg:rounded-t-[88px] py-16 sm:py-24 lg:py-[110px] px-5 sm:px-10 lg:px-12 flex flex-col items-center select-none border-t border-white/[0.08]"
    >
      {/* Ambient background glows for bespoke depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(243,255,0,0.09),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[260px] bg-blue-600/[0.08] blur-[110px] rounded-full"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex max-w-[1060px] w-full flex-col items-center text-center">
        {/* Main Heading: "Welcome to" + "thrides.®" (Defiant Style) */}
        <div className="flex flex-col items-center">
          <h2 className="text-center font-display text-[42px] sm:text-[58px] lg:text-[clamp(54px,6.8vw,102px)] font-extrabold tracking-[-0.05em] text-white leading-[1.01]">
            Welcome to
          </h2>
          <div
            className="mt-1 sm:mt-2 lg:mt-3 flex items-center justify-center"
            aria-label="thrides."
          >
            <span className="inline-flex items-baseline font-display font-black tracking-[-0.05em] text-[#F3FF00] text-[48px] sm:text-[68px] lg:text-[clamp(58px,7.5vw,114px)] leading-none select-none drop-shadow-[0_0_40px_rgba(243,255,0,0.32)]">
              thrides.
              <span className="font-display font-bold text-white text-[0.45em] align-top ml-1.5 opacity-90">
                ®
              </span>
            </span>
          </div>
        </div>

        {/* Paragraph 1 - High impact statement */}
        <p className="mt-8 sm:mt-10 lg:mt-12 max-w-[860px] text-center text-[17px] sm:text-[21px] lg:text-[clamp(20px,2.1vw,30px)] font-normal text-[#E4E4E7] leading-[1.48] tracking-tight">
          You’re here because you’re building something that matters.
          <span className="block mt-1 sm:mt-0 font-medium text-white">
            {" "}A business that wins. A brand that dominates.
          </span>
        </p>

        {/* Paragraph 2 - Agency capability */}
        <p className="mt-5 sm:mt-6 lg:mt-7 max-w-[860px] text-center text-[15px] sm:text-[18px] lg:text-[clamp(17px,1.8vw,24px)] font-normal text-[#A1A1AA] leading-[1.5]">
          We partner with fast-growing brands doing serious volume to create and scale performance-driven creative systems, iconic brand identity, and acquisition engines that fuel serious growth.
        </p>

        {/* Defiant Signature CTA: "Ready?" [t.] "Start Now" */}
        <div className="mt-10 sm:mt-13 lg:mt-16 flex justify-center w-full">
          <a
            href="/contact"
            aria-label="Start a project with Thrides"
            className="group relative inline-flex h-[76px] sm:h-[84px] lg:h-[90px] w-full max-w-[340px] sm:max-w-[350px] items-center justify-between rounded-full bg-[#000000] p-[5px] transition-all duration-300 hover:bg-[#F3FF00] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 select-none shadow-[0_0_35px_rgba(243,255,0,0.18)]"
          >
            {/* Animated outer glowing breathing border */}
            <span
              className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-[#F3FF00] animate-hero-border-pulse"
              aria-hidden="true"
            />

            {/* Inner charcoal outline inset */}
            <div className="relative z-10 flex h-full w-full items-center justify-between rounded-full border border-white/20 px-6 sm:px-7 transition-colors duration-300 group-hover:border-black/30">
              {/* Left Text: Ready? */}
              <span className="text-[17px] sm:text-[18px] font-bold text-white transition-colors duration-300 group-hover:text-black">
                Ready?
              </span>

              {/* Central Yellow Rounded-Square Icon Tile with t. */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-[14px] bg-[#F3FF00] blur-[10px] opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
                <div className="relative grid h-[44px] w-[44px] sm:h-[48px] sm:w-[48px] place-items-center rounded-[14px] bg-[#F3FF00] shadow-[0_0_18px_rgba(243,255,0,0.55)]">
                  <span className="font-display text-[22px] sm:text-[24px] font-black text-black leading-none pl-0.5">
                    t.
                  </span>
                </div>
              </div>

              {/* Right Text: Start Now */}
              <span className="text-[17px] sm:text-[18px] font-bold text-white transition-colors duration-300 group-hover:text-black">
                Start Now
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
