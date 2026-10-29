"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export type TabKey = "ads" | "emails" | "landing" | "ugc";

export interface ShowcaseMediaItem {
  video: string;
  poster: string;
}

export const SHOWCASE_DATA: Record<TabKey, ShowcaseMediaItem[]> = {
  ads: [
    {
      video: "/videos/ads/optimized/13014537_2160_3840_24fps.mp4",
      poster: "/videos/ads/optimized/13014537_2160_3840_24fps.webp",
    },
    {
      video: "/videos/ads/optimized/17084724_1080_1920_29fps.mp4",
      poster: "/videos/ads/optimized/17084724_1080_1920_29fps.webp",
    },
    {
      video: "/videos/ads/optimized/5561960-uhd_2160_3840_25fps.mp4",
      poster: "/videos/ads/optimized/5561960-uhd_2160_3840_25fps.webp",
    },
    {
      video: "/videos/ads/optimized/6664406-uhd_2160_3744_30fps.mp4",
      poster: "/videos/ads/optimized/6664406-uhd_2160_3744_30fps.webp",
    },
    {
      video: "/videos/ads/optimized/7616839-hd_1080_1920_24fps.mp4",
      poster: "/videos/ads/optimized/7616839-hd_1080_1920_24fps.webp",
    },
  ],
  emails: [],
  landing: [],
  ugc: [],
};

interface PhoneCardProps {
  item: ShowcaseMediaItem;
  index: number;
  isDuplicate?: boolean;
  isSectionNear: boolean;
}

function PhoneCard({ item, index, isDuplicate, isSectionNear }: PhoneCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isSectionNear) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReduced) {
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    } else {
      video.pause();
    }
  }, [isSectionNear]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = (index * 1.8 + (isDuplicate ? 1.1 : 0)) % video.duration;
    }
  };

  return (
    <div className="relative h-[302px] w-[155px] shrink-0 select-none sm:h-[380px] sm:w-[195px] md:h-[440px] md:w-[225px] transform-gpu">
      {/* Left side volume buttons */}
      <div className="absolute -left-[2.5px] top-[75px] h-[20px] w-[2.5px] rounded-l-sm bg-gradient-to-b from-[#e8e8ea] via-[#c8c8d0] to-[#8a8a90] sm:top-[90px] sm:h-[24px] md:top-[102px] md:h-[28px]" />
      <div className="absolute -left-[2.5px] top-[102px] h-[20px] w-[2.5px] rounded-l-sm bg-gradient-to-b from-[#e8e8ea] via-[#c8c8d0] to-[#8a8a90] sm:top-[122px] sm:h-[24px] md:top-[138px] md:h-[28px]" />

      {/* Right side power button */}
      <div className="absolute -right-[2.5px] top-[80px] h-[32px] w-[2.5px] rounded-r-sm bg-gradient-to-b from-[#e8e8ea] via-[#c8c8d0] to-[#8a8a90] sm:top-[96px] sm:h-[38px] md:top-[112px] md:h-[44px]" />

      {/* Phone outer frame: 2px silver gradient border */}
      <div className="relative h-full w-full rounded-[28px] bg-gradient-to-b from-[#e8e8ea] via-[#c8c8d0] to-[#8a8a90] p-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.65)] sm:rounded-[34px] md:rounded-[40px]">
        {/* Thin black bezel padding */}
        <div className="relative h-full w-full rounded-[26px] bg-[#0c0c0e] p-[3.5px] sm:rounded-[32px] sm:p-[4.5px] md:rounded-[38px] md:p-[5.5px]">
          {/* Inner screen radius with overflow hidden */}
          <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-[#121214] sm:rounded-[27px] md:rounded-[32px]">
            {/* Dynamic island */}
            <div className="pointer-events-none absolute top-[6px] left-1/2 z-20 flex h-[14px] w-[54px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-1.5 sm:top-[7px] sm:h-[16px] sm:w-[64px] sm:pr-2 md:top-[8px] md:h-[18px] md:w-[74px] md:pr-2">
              {/* Camera lens dot */}
              <div className="h-[4.5px] w-[4.5px] rounded-full bg-[#0d1b2a] shadow-[inset_0_0_2px_#415a77] ring-1 ring-[#1b263b]/70 md:h-[5.5px] md:w-[5.5px]" />
            </div>

            {/* Video element with instant poster & faststart */}
            <video
              ref={videoRef}
              src={item.video}
              poster={item.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              disablePictureInPicture
              controls={false}
              draggable={false}
              onLoadedMetadata={handleLoadedMetadata}
              className="h-full w-full object-cover transform-gpu"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS: { id: TabKey; label: string; active?: boolean }[] = [
  { id: "ads", label: "Ads Creative", active: true },
  { id: "emails", label: "Emails" },
  { id: "landing", label: "Landing Pages" },
  { id: "ugc", label: "UGC" },
];

export default function CreativeShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>("ads");
  const [tooltipTab, setTooltipTab] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isSectionNear, setIsSectionNear] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionNear(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "400px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activeVideos = SHOWCASE_DATA[activeTab] || SHOWCASE_DATA.ads;

  return (
    <section
      ref={sectionRef}
      id="creative"
      aria-label="Our work"
      className="relative w-full overflow-x-hidden bg-[#000000] pt-14 pb-14 md:pt-20 md:pb-18 select-none"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 text-center">
        {/* Pill badge at top */}
        <div className="inline-flex h-9 items-center justify-center rounded-full border border-white/[0.08] bg-gradient-to-b from-[#1a1a1a] to-[#050505] px-5 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)] md:h-[48px] md:w-[310px] md:px-0">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 md:text-[11px]">
            OUR WORK
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-10 flex flex-col items-center text-center md:mt-14">
          <span className="font-display text-[clamp(40px,6.5vw,88px)] font-bold tracking-[-0.04em] text-[#d4d4d4] leading-[0.95]">
            Creative that
          </span>
          <span className="font-serif text-[clamp(44px,7vw,96px)] font-normal italic tracking-[-0.03em] text-[#e5e5e5] leading-[0.95]">
            Converts
          </span>
        </h2>

        {/* Tabs container */}
        <div
          role="tablist"
          aria-label="Creative categories"
          className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#0b0b0d] p-1.5 md:mt-10 md:gap-2 md:p-2"
        >
          {TABS.map((tab) => {
            const isAds = tab.id === "ads";
            const isActive = activeTab === tab.id;

            return (
              <div key={tab.id} className="relative">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-disabled={!isAds}
                  onClick={(e) => {
                    if (!isAds) {
                      e.preventDefault();
                      setTooltipTab(tab.id);
                    } else {
                      setActiveTab("ads");
                      setTooltipTab(null);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isAds) setTooltipTab(tab.id);
                  }}
                  onMouseLeave={() => setTooltipTab(null)}
                  className={`relative rounded-full px-4 py-1.5 text-[13.5px] md:px-6 md:py-2 md:text-[14.5px] transition-colors ${
                    isActive
                      ? "bg-[#d4d4d4] font-semibold text-[#111111]"
                      : "cursor-not-allowed bg-[#050505] font-medium text-white/90 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>

                {/* Coming Soon Tooltip for inactive tabs */}
                {!isAds && tooltipTab === tab.id && (
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute -top-10 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#222226] px-2.5 py-1 text-[11px] font-medium text-white shadow-lg animate-in fade-in zoom-in-95 duration-150"
                  >
                    Coming soon
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#222226]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Moving row of phone mockups - 2x faster, smaller, instant loading */}
      <div className="showcase-row relative mt-10 w-full overflow-hidden md:mt-12">
        <div className="showcase-track flex w-max will-change-transform">
          {/* Set 1: primary accessible phones */}
          <div className="flex shrink-0 items-center gap-5 pr-5 sm:gap-7 sm:pr-7 md:gap-8 md:pr-8">
            {activeVideos.map((item, idx) => (
              <PhoneCard
                key={`s1-${idx}`}
                item={item}
                index={idx}
                isSectionNear={isSectionNear}
              />
            ))}
          </div>

          {/* Set 2: identical duplicate set for 100% seamless infinite loop */}
          <div
            className="flex shrink-0 items-center gap-5 pr-5 sm:gap-7 sm:pr-7 md:gap-8 md:pr-8"
            aria-hidden="true"
          >
            {activeVideos.map((item, idx) => (
              <PhoneCard
                key={`s2-${idx}`}
                item={item}
                index={idx}
                isDuplicate
                isSectionNear={isSectionNear}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="mx-auto mt-12 flex w-full max-w-[1100px] flex-col items-center justify-between gap-8 px-4 md:mt-16 md:flex-row md:gap-6">
        {/* Left: "Want more inspiration?" */}
        <div className="text-center md:text-right">
          <p className="font-serif text-[26px] not-italic leading-[1.05] tracking-tight text-[#e5e5e5] md:text-[32px]">
            Want more
            <br />
            inspiration?
          </p>
        </div>

        {/* Center: "Go to Creative Library" pill button */}
        <a
          href="/our-work"
          className="group inline-flex h-[52px] items-center justify-center gap-3 rounded-full bg-white px-8 font-sans text-[17px] font-semibold text-black shadow-[0_10px_30px_rgba(255,255,255,0.12)] transition-transform duration-250 hover:scale-[1.03] md:h-[60px] md:px-11 md:text-[20px]"
        >
          <span>Go to Creative Library</span>
          <ArrowUpRight
            className="h-5 w-5 transition-transform duration-250 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:h-6 md:w-6"
            strokeWidth={2.5}
          />
        </a>

        {/* Right: Google review badge and copy */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="inline-flex items-center gap-2">
            {/* Inline Google G logo */}
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            {/* 4.9 | 5★ badge */}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#111114] px-2.5 py-0.5 text-[11px] font-semibold text-white/90">
              4.9 | 5<span className="text-[#FBBF24]">★</span>
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-white/85 md:text-[14px]">
            Discover why 300+ Brands Choose Thrides.
          </p>
        </div>
      </div>
    </section>
  );
}
