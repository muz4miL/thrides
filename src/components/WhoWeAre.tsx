"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface AudienceCardItem {
  id: string;
  titleSerif: string;
  titleSans: string;
  description: ReactNode;
}

const AUDIENCE_CARDS: AudienceCardItem[] = [
  {
    id: "founders",
    titleSerif: "Founders",
    titleSans: "& CMO's",
    description: (
      <>
        <b className="font-semibold text-white">Growth isn't optional.</b> You've found a product
        that fits the market, now you need a team that can{" "}
        <b className="font-semibold text-white">scale it profitably.</b>
      </>
    ),
  },
  {
    id: "inhouse",
    titleSerif: "In-house",
    titleSans: "Teams",
    description: (
      <>
        <b className="font-semibold text-white">You need a creative & growth execution partner</b>{" "}
        that feels <b className="font-semibold text-white">&ldquo;in-house&rdquo;</b>. We plug into
        your brand to deliver breakthrough growth.
      </>
    ),
  },
  {
    id: "vc-funded",
    titleSerif: "VC Funded",
    titleSans: "Brands",
    description: (
      <>
        <b className="font-semibold text-white">The brands that reach 9 figure values?</b> They have{" "}
        <b className="font-semibold text-white">creative and growth</b> on rails. We help you become
        one of them.
      </>
    ),
  },
];

export default function WhoWeAre() {
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const el = cardsContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="who-we-are"
      aria-label="Who we are"
      className="relative w-full overflow-x-hidden bg-[#000000] pt-[72px] pb-[72px] md:pt-[120px] md:pb-[120px]"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 text-center">
        {/* Heading: two lines, tightly stacked */}
        <h2 className="flex flex-col items-center text-center select-none">
          <span className="font-display text-[clamp(48px,7vw,104px)] font-bold tracking-[-0.04em] text-[#d4d4d4] leading-[0.95]">
            Who we are
          </span>
          <span className="font-serif text-[clamp(48px,7vw,104px)] font-normal italic tracking-[-0.03em] text-[#e5e5e5] leading-[0.95]">
            Built for
          </span>
        </h2>

        {/* Paragraph ~72px below heading */}
        <p className="mx-auto mt-14 max-w-[760px] text-center font-sans text-[18px] font-normal leading-[1.4] text-white/85 md:mt-[72px] md:text-[24px]">
          Whether you're scaling to <b className="font-semibold text-white">$1M/month</b> or heading
          towards a <b className="font-semibold text-white">$100M+</b> valuation. Brand It becomes
          your unfair advantage in creative, performance &amp; production.
        </p>
      </div>

      {/* 3 Audience Cards Row ~80px below paragraph */}
      <div
        ref={cardsContainerRef}
        className="mx-auto mt-16 grid max-w-[1700px] grid-cols-1 gap-6 px-5 min-[900px]:mt-[80px] min-[900px]:grid-cols-3 min-[900px]:px-10 xl:px-[100px]"
      >
        {AUDIENCE_CARDS.map((card, idx) => (
          <div
            key={card.id}
            style={{
              transitionDelay: `${idx * 100}ms`,
            }}
            className={`audience-card flex min-h-[300px] flex-col justify-between rounded-[32px] border border-white/[0.05] bg-gradient-to-b from-[#0e0e11] to-[#050506] p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] min-[900px]:min-h-[380px] min-[900px]:p-[36px] transition-all duration-700 ease-out ${
              hasEntered
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-90 min-[900px]:opacity-0"
            }`}
          >
            {/* Top Block: 2 lines left aligned */}
            <h3 className="flex flex-col text-left select-none">
              <span className="font-serif text-[40px] font-normal italic tracking-[-0.03em] text-[#d4d4d4] leading-[0.95] min-[900px]:text-[44px] xl:text-[56px]">
                {card.titleSerif}
              </span>
              <span className="font-display text-[40px] font-bold tracking-[-0.04em] text-[#e5e5e5] leading-[0.95] min-[900px]:text-[44px] xl:text-[56px]">
                {card.titleSans}
              </span>
            </h3>

            {/* Bottom Block: pinned to bottom */}
            <p className="mt-8 text-left font-sans text-[16px] font-normal leading-[1.4] text-white/85 min-[900px]:mt-auto min-[900px]:text-[17px] xl:text-[18px]">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* COMPARE US Pill ~200px below cards (96px mobile) */}
      <div className="mt-24 flex justify-center px-4 md:mt-[200px]">
        <div className="inline-flex h-10 items-center justify-center rounded-full border border-white/[0.08] bg-gradient-to-b from-[#1a1a1a] to-[#050505] px-6 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)] md:h-[56px] md:w-[336px] md:px-0 select-none">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 md:text-[11px]">
            COMPARE US
          </span>
        </div>
      </div>
    </section>
  );
}
