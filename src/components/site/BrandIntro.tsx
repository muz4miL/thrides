import { ArrowUpRight } from "lucide-react";

export function BrandIntro() {
  return (
    <section
      id="about"
      aria-label="Welcome to thrides"
      className="relative w-full overflow-hidden bg-[#000000] rounded-t-[36px] sm:rounded-t-[54px] lg:rounded-t-[72px] py-10 sm:py-14 lg:py-16 px-5 sm:px-8 lg:px-12 flex flex-col items-center select-none border-t border-white/[0.08]"
    >
      {/* Ambient electric blue brand glows */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(0,82,255,0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[520px] h-[200px] bg-[#0052FF]/10 blur-[100px] rounded-full"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex max-w-[960px] w-full flex-col items-center text-center">
        {/* Main Heading: "Welcome to" + Original Thrides Logo */}
        <div className="flex flex-col items-center">
          <h2 className="text-center font-display text-[28px] sm:text-[40px] lg:text-[50px] font-extrabold tracking-[-0.04em] text-white leading-[1.05]">
            Welcome to
          </h2>
          <div
            className="mt-3 sm:mt-4 flex items-center justify-center relative"
            aria-label="thrides"
          >
            {/* Ambient blue glow behind mark */}
            <div
              className="pointer-events-none absolute -inset-x-8 -inset-y-4 bg-[#0052FF]/25 blur-[35px] rounded-full"
              aria-hidden="true"
            />
            <div className="relative flex items-center">
              <img
                src="/thrideLogo.png"
                alt="thrides"
                className="h-11 sm:h-15 md:h-18 lg:h-22 w-auto object-contain select-none drop-shadow-[0_0_24px_rgba(0,82,255,0.35)]"
                loading="eager"
              />
              <span className="font-display font-bold text-white text-[13px] sm:text-[18px] lg:text-[22px] self-start -mt-0.5 sm:-mt-1 ml-1 opacity-90 select-none">
                ®
              </span>
            </div>
          </div>
        </div>

        {/* Paragraph 1 - Concise High impact statement */}
        <p className="mt-5 sm:mt-6 max-w-[760px] text-center text-[16px] sm:text-[19px] lg:text-[22px] font-normal text-[#E4E4E7] leading-[1.45] tracking-tight">
          You’re here because you’re building something that matters.
          <span className="block mt-0.5 sm:mt-0 font-medium text-white">
            {" "}A business that wins. A brand that dominates.
          </span>
        </p>

        {/* Paragraph 2 - Agency capability */}
        <p className="mt-2.5 sm:mt-3.5 max-w-[720px] text-center text-[14px] sm:text-[15px] lg:text-[17px] font-normal text-[#A1A1AA] leading-[1.5]">
          We partner with fast-growing brands doing serious volume to create and scale performance-driven creative systems, iconic brand identity, and acquisition engines that fuel serious growth.
        </p>

        {/* Compact CTA: "Ready?" [t.] "Start Now" in Thrides Blue */}
        <div className="mt-7 sm:mt-8 flex justify-center w-full">
          <a
            href="/contact"
            aria-label="Start a project with Thrides"
            className="group relative inline-flex h-[68px] sm:h-[74px] w-full max-w-[320px] items-center justify-between rounded-full bg-[#000000] p-[5px] transition-all duration-300 hover:bg-[#0052FF] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 select-none shadow-[0_0_28px_rgba(0,82,255,0.22)]"
          >
            {/* Animated outer glowing breathing border */}
            <span
              className="pointer-events-none absolute -inset-[2px] rounded-full border-2 border-[#0052FF] animate-hero-border-pulse"
              aria-hidden="true"
            />

            {/* Inner charcoal outline inset */}
            <div className="relative z-10 flex h-full w-full items-center justify-between rounded-full border border-white/20 px-6 transition-colors duration-300 group-hover:border-white/50">
              {/* Left Text: Ready? */}
              <span className="text-[16px] sm:text-[17px] font-bold text-white transition-colors duration-300">
                Ready?
              </span>

              {/* Central Blue Icon Tile with t. */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-[12px] bg-[#0052FF] blur-[8px] opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
                <div className="relative grid h-[42px] w-[42px] sm:h-[44px] sm:w-[44px] place-items-center rounded-[12px] bg-[#0052FF] shadow-[0_0_14px_rgba(0,82,255,0.55)]">
                  <span className="font-display text-[20px] sm:text-[22px] font-black text-white leading-none pl-0.5">
                    t.
                  </span>
                </div>
              </div>

              {/* Right Text: Start Now */}
              <span className="text-[16px] sm:text-[17px] font-bold text-white transition-colors duration-300">
                Start Now
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
