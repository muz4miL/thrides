"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronUp, Star, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";

import haloImg from "@/assets/work-identity-halo.jpg";
import pulseImg from "@/assets/work-identity-pulse.jpg";
import zestImg from "@/assets/work-social-juice.jpg";
import voltexImg from "@/assets/work-ad-sneaker.jpg";
import skinImg from "@/assets/work-package-skin.jpg";
import riseImg from "@/assets/work-package-rise.jpg";
import voyaraImg from "@/assets/work-ads-travel.jpg";
import homeImg from "@/assets/work-campaign-home.jpg";
import identityImg from "@/assets/service-identity.jpg";
import creativeImg from "@/assets/service-creative.jpg";
import { SectionBadge } from "./SectionBadge";

export type TabKey = "ads" | "emails" | "landing" | "ugc";

export const ADS_VIDEOS = [
  "/videos/ads/13014537_2160_3840_24fps.mp4",
  "/videos/ads/17084724_1080_1920_29fps.mp4",
  "/videos/ads/5561960-uhd_2160_3840_25fps.mp4",
  "/videos/ads/6664406-uhd_2160_3744_30fps.mp4",
  "/videos/ads/7616839-hd_1080_1920_24fps.mp4",
];

export const UGC_VIDEOS = [
  "/videos/ads/17084724_1080_1920_29fps.mp4",
  "/videos/ads/7616839-hd_1080_1920_24fps.mp4",
  "/videos/ads/13014537_2160_3840_24fps.mp4",
  "/videos/ads/6664406-uhd_2160_3744_30fps.mp4",
  "/videos/ads/5561960-uhd_2160_3840_25fps.mp4",
];

interface EmailCardData {
  id: string;
  sender: string;
  subject: string;
  tag: string;
  heroImg: any;
  heading: string;
  subheading: string;
  ctaText: string;
  accentColor: string;
  theme: "dark" | "light";
}

const EMAILS_DATA: EmailCardData[] = [
  {
    id: "voltex",
    sender: "VOLTEX ACTIVE",
    subject: "The Recon Drop Is Live ⚡",
    tag: "LIMITED EDITION",
    heroImg: voltexImg,
    heading: "NO RESTOCKS. THE RECON DROP.",
    subheading: "Engineered for speed, durability, and relentless focus. Only 250 units worldwide.",
    ctaText: "SECURE YOUR DROP >",
    accentColor: "#EF4444",
    theme: "dark",
  },
  {
    id: "aura",
    sender: "AURA COFFEE",
    subject: "Your Private Reserve Roast ☕",
    tag: "SINGLE ORIGIN",
    heroImg: identityImg,
    heading: "Welcome to Pure Craft Coffee",
    subheading: "Handcrafted Italian roast. Freshly packed within 24 hours of small-batch roasting.",
    ctaText: "EXPLORE THE ROAST >",
    accentColor: "#0052FF",
    theme: "light",
  },
  {
    id: "luminate",
    sender: "LUMINATE CLINIC",
    subject: "Save $250 On Winter HydraGlow ✨",
    tag: "SPECIAL OFFER",
    heroImg: skinImg,
    heading: "Save $250 Before Our Offer Ends!",
    subheading: "Bespoke clinical dermatology and restorative medical aesthetics for lasting skin radiance.",
    ctaText: "CLAIM WINTER SPECIAL >",
    accentColor: "#0284C7",
    theme: "light",
  },
  {
    id: "rise",
    sender: "RISE BAKERY",
    subject: "Fresh Sourdough & Pastries At Your Door 🥐",
    tag: "MORNING DROP",
    heroImg: riseImg,
    heading: "Baked At 4 AM. Delivered At 7 AM.",
    subheading: "Warm butter croissants, rustic sourdough, and artisan jams delivered straight to your home.",
    ctaText: "ORDER BREAKFAST BOX >",
    accentColor: "#D97706",
    theme: "light",
  },
  {
    id: "voyara",
    sender: "VOYARA STAYS",
    subject: "Exclusive Villas Across 8 Countries 🌴",
    tag: "VIP RETREAT",
    heroImg: voyaraImg,
    heading: "Invest in Memories. Grow Your Escape.",
    subheading: "Private oceanfront sanctuaries with dedicated concierges and chef dining.",
    ctaText: "DISCOVER DESTINATIONS >",
    accentColor: "#0052FF",
    theme: "dark",
  },
];

interface LandingCardData {
  id: string;
  client: string;
  url: string;
  title: string;
  highlight: string;
  description: string;
  stats: { label: string; value: string }[];
  tag: string;
  bgGradient: string;
}

const LANDING_DATA: LandingCardData[] = [
  {
    id: "capital",
    client: "HAVEN ASSETS",
    url: "havenassets.com/yields",
    title: "Get your commercial assets leased faster, for stronger yields.",
    highlight: "High-Yield Portfolio Acquisition",
    description: "Proven performance marketing and direct-response lead generation for prime commercial holdings.",
    stats: [
      { label: "Asset Volume", value: "$4.6M" },
      { label: "Avg Yield", value: "8.4%" },
      { label: "Close Rate", value: "94%" },
    ],
    tag: "COMMERCIAL B2B",
    bgGradient: "from-[#111116] via-[#161622] to-[#0d0d12]",
  },
  {
    id: "rewards",
    client: "WINBACK APP",
    url: "winback.io/daily-drop",
    title: "Win all your daily expenses back. Up to $150k.",
    highlight: "Daily Rewards & Gamified Fintech",
    description: "All without changing the way you shop or carrying extra cards. Backed by top tier banks.",
    stats: [
      { label: "Users Active", value: "180k+" },
      { label: "Cash Rewarded", value: "$1.2M" },
      { label: "App Rating", value: "4.9 ★" },
    ],
    tag: "CONSUMER APP",
    bgGradient: "from-[#0a1e12] via-[#0f2d1b] to-[#09150e]",
  },
  {
    id: "pulse-gym",
    client: "PULSE FITNESS",
    url: "pulsefitness.com/join",
    title: "Move Better. Feel Stronger. Train Without Limits.",
    highlight: "Premium Boutique Studio",
    description: "Personal training, recovery saunas, and science-backed conditioning under one luxury roof.",
    stats: [
      { label: "Members", value: "1,400+" },
      { label: "Retention", value: "92%" },
      { label: "Locations", value: "3" },
    ],
    tag: "HEALTH & FITNESS",
    bgGradient: "from-[#16102a] via-[#211640] to-[#120a22]",
  },
  {
    id: "energymatch",
    client: "SAVER COMPARISON",
    url: "savesmart.com/compare",
    title: "Save Smart. Compare Better. Reduce Utility Bills.",
    highlight: "Utility Comparison Engine",
    description: "Instant tariff matching for electricity, high-speed fiber broadband, and solar incentives.",
    stats: [
      { label: "Avg Saved", value: "$420/yr" },
      { label: "Comparison Time", value: "45s" },
      { label: "Happy Customers", value: "65k+" },
    ],
    tag: "LEAD GENERATION",
    bgGradient: "from-[#1b1c11] via-[#2d2e14] to-[#14150c]",
  },
  {
    id: "equ",
    client: "EQU NUTRITION",
    url: "equhealth.com/programs",
    title: "Ready for real results? We’re your pocket nutrition coach.",
    highlight: "Lifestyle Transformation",
    description: "Dietician-led flexible dieting, metabolic health plans, and community accountability.",
    stats: [
      { label: "Kg Lost", value: "12,000+" },
      { label: "Coaches", value: "24" },
      { label: "Client Success", value: "97%" },
    ],
    tag: "E-COMMERCE & COACHING",
    bgGradient: "from-[#1e1310] via-[#321c16] to-[#160c09]",
  },
];

/* -------------------------------------------------------------
   PHONE CARD MOCKUP (Used for Ads Creative & UGC)
------------------------------------------------------------- */
interface PhoneCardProps {
  videoSrc: string;
  index: number;
  isDuplicate?: boolean;
  isSectionNear: boolean;
}

function PhoneCard({ videoSrc, index, isDuplicate, isSectionNear }: PhoneCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isSectionNear) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReduced) {
        video.muted = true;
        video.play().catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isSectionNear]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = (index * 2.3 + (isDuplicate ? 1.5 : 0)) % video.duration;
    }
  };

  return (
    <div className="relative h-[330px] w-[172px] shrink-0 select-none sm:h-[390px] sm:w-[204px] md:h-[450px] md:w-[234px] lg:h-[470px] lg:w-[244px]">
      {/* Left side volume buttons */}
      <div className="absolute -left-[3px] top-[75px] h-[22px] w-[3px] rounded-l-sm bg-gradient-to-b from-[#e8e8ea] via-[#c8c8d0] to-[#8a8a90] sm:top-[90px] sm:h-[26px] md:top-[105px] md:h-[30px]" />
      <div className="absolute -left-[3px] top-[103px] h-[22px] w-[3px] rounded-l-sm bg-gradient-to-b from-[#e8e8ea] via-[#c8c8d0] to-[#8a8a90] sm:top-[122px] sm:h-[26px] md:top-[142px] md:h-[30px]" />

      {/* Right side power button */}
      <div className="absolute -right-[3px] top-[82px] h-[34px] w-[3px] rounded-r-sm bg-gradient-to-b from-[#e8e8ea] via-[#c8c8d0] to-[#8a8a90] sm:top-[98px] sm:h-[40px] md:top-[114px] md:h-[46px]" />

      {/* Phone outer frame: titanium silver border */}
      <div className="relative h-full w-full rounded-[30px] bg-gradient-to-b from-[#e8e8ea] via-[#c8c8d0] to-[#8a8a90] p-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_60px_rgba(0,0,0,0.65)] sm:rounded-[36px] md:rounded-[42px]">
        {/* Thin black bezel padding */}
        <div className="relative h-full w-full rounded-[28px] bg-[#0c0c0e] p-[4px] sm:rounded-[34px] sm:p-[5px] md:rounded-[40px] md:p-[6px]">
          {/* Inner screen radius with overflow hidden */}
          <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-[#121214] sm:rounded-[30px] md:rounded-[35px]">
            {/* Dynamic island */}
            <div className="pointer-events-none absolute top-[6px] left-1/2 z-20 flex h-[15px] w-[60px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-1 sm:top-[7px] sm:h-[18px] sm:w-[72px] sm:pr-1.5 md:top-[9px] md:h-[20px] md:w-[80px] md:pr-2">
              <div className="h-[5px] w-[5px] rounded-full bg-[#0d1b2a] shadow-[inset_0_0_2px_#415a77] ring-1 ring-[#1b263b]/70 md:h-[6px] md:w-[6px]" />
            </div>

            {/* Video element */}
            <video
              ref={videoRef}
              src={`${videoSrc}#t=0.1`}
              muted
              loop
              playsInline
              preload={isSectionNear ? "metadata" : "none"}
              disablePictureInPicture
              controls={false}
              draggable={false}
              onLoadedMetadata={handleLoadedMetadata}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   EMAIL CARD MOCKUP (Used for Emails tab)
------------------------------------------------------------- */
function EmailCard({ item }: { item: EmailCardData }) {
  const isDark = item.theme === "dark";

  return (
    <div className="relative h-[340px] w-[210px] shrink-0 select-none overflow-hidden rounded-[26px] border border-white/10 bg-[#0d0d10] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:h-[400px] sm:w-[245px] md:h-[460px] md:w-[280px]">
      <div
        className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[20px] p-4 sm:p-5 ${
          isDark
            ? "bg-[#131318] text-white"
            : "bg-[#FAFAFA] text-[#09090B]"
        }`}
      >
        {/* Header: Sender & Tag */}
        <div>
          <div className="flex items-center justify-between border-b pb-2.5 border-current/10">
            <span className="font-display text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
              {item.sender}
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: item.accentColor }}
            >
              {item.tag}
            </span>
          </div>

          {/* Subject Line */}
          <p className="mt-2 text-[11px] sm:text-[12px] font-medium opacity-70 truncate">
            {item.subject}
          </p>

          {/* Hero Visual */}
          <div className="relative mt-2.5 aspect-[16/10] w-full overflow-hidden rounded-[14px]">
            <img
              src={typeof item.heroImg === "string" ? item.heroImg : item.heroImg?.src || ""}
              alt={item.heading}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Heading */}
          <h4 className="mt-3 font-display text-[15px] sm:text-[18px] font-extrabold leading-[1.1] tracking-tight">
            {item.heading}
          </h4>

          {/* Subheading */}
          <p className="mt-1.5 text-[11px] sm:text-[12px] leading-relaxed opacity-75 line-clamp-2">
            {item.subheading}
          </p>
        </div>

        {/* Action Button & Footer */}
        <div className="mt-3 pt-2.5 border-t border-current/10">
          <div
            className="flex h-[36px] sm:h-[38px] w-full items-center justify-center rounded-full text-[11px] font-bold text-white shadow-md transition-transform duration-200 hover:scale-[1.02]"
            style={{ backgroundColor: item.accentColor }}
          >
            <span>{item.ctaText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   LANDING PAGE CARD MOCKUP (Used for Landing Pages tab)
------------------------------------------------------------- */
function LandingPageCard({ item }: { item: LandingCardData }) {
  return (
    <div className="relative h-[340px] w-[220px] shrink-0 select-none overflow-hidden rounded-[26px] border border-white/10 bg-[#0e0e12] shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:h-[400px] sm:w-[255px] md:h-[460px] md:w-[290px] flex flex-col">
      {/* Browser chrome header with macOS-style dots */}
      <div className="flex h-10 items-center justify-between border-b border-white/10 bg-[#16161c] px-4">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex h-6 items-center rounded-md bg-black/40 px-3 text-[10px] text-neutral-400 font-mono">
          https://{item.url}
        </div>
        <div className="w-6" />
      </div>

      {/* Screen Content */}
      <div
        className={`flex-1 p-5 sm:p-6 flex flex-col justify-between bg-gradient-to-b ${item.bgGradient}`}
      >
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur-md">
            <Sparkles size={11} className="text-[#0052FF]" />
            <span>{item.tag}</span>
          </div>

          <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-[#0052FF]">
            {item.highlight}
          </p>

          <h4 className="mt-2 font-display text-[18px] sm:text-[22px] font-extrabold leading-[1.12] tracking-tight text-white">
            {item.title}
          </h4>

          <p className="mt-3 text-[12px] sm:text-[13px] leading-relaxed text-neutral-300">
            {item.description}
          </p>

          {/* Key Metrics Grid */}
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
            {item.stats.map((s, idx) => (
              <div key={idx} className="rounded-xl bg-black/35 p-2 text-center border border-white/5">
                <span className="block font-display text-[15px] sm:text-[17px] font-extrabold text-white">
                  {s.value}
                </span>
                <span className="block text-[9px] sm:text-[10px] font-medium text-neutral-400 mt-0.5">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating pill action */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            {item.client}
          </span>
          <div className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0052FF] hover:underline">
            <span>View Funnel</span>
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   MAIN COMPONENT: Creative that Converts
------------------------------------------------------------- */
const TABS: { id: TabKey; label: string }[] = [
  { id: "ads", label: "Ads Creative" },
  { id: "emails", label: "Emails" },
  { id: "landing", label: "Landing Pages" },
  { id: "ugc", label: "UGC" },
];

export function OurWorkSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("ads");
  const sectionRef = useRef<HTMLElement>(null);
  const [isSectionNear, setIsSectionNear] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionNear(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Our Work"
      className="relative w-full overflow-hidden bg-[#000000] pt-16 sm:pt-22 lg:pt-28 pb-16 sm:pb-22 lg:pb-28 select-none scroll-mt-24"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 text-center">
        {/* Pill badge at top */}
        <SectionBadge>OUR WORK</SectionBadge>

        {/* Section Heading: Creative that Converts */}
        <h2 className="mt-5 sm:mt-7 lg:mt-9 flex flex-col items-center text-center">
          <span className="block font-display text-[34px] sm:text-[50px] lg:text-[clamp(50px,6vw,96px)] font-extrabold leading-[0.98] lg:leading-[0.95] tracking-[-0.04em] text-white">
            Creative that
          </span>
          <span className="block font-serif text-[38px] sm:text-[54px] lg:text-[clamp(54px,6.5vw,104px)] font-normal italic leading-[0.98] lg:leading-[0.95] tracking-[-0.02em] text-white mt-1">
            Converts
          </span>
        </h2>

        {/* Interactive Category Tabs Switcher */}
        <div
          role="tablist"
          aria-label="Work categories"
          className="mt-8 sm:mt-10 lg:mt-12 inline-flex items-center gap-1 sm:gap-2 rounded-full border border-white/10 bg-[#0c0c10] p-1.5 sm:p-2 backdrop-blur-md"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[13px] sm:text-[15px] font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-white text-black font-semibold shadow-md"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Moving Row of Mockups with Infinite Marquee */}
      <div className="showcase-row relative mt-10 sm:mt-14 lg:mt-16 w-full overflow-hidden">
        <div className="showcase-track flex w-max will-change-transform">
          {/* TAB: Ads Creative */}
          {activeTab === "ads" && (
            <>
              {/* Set 1 */}
              <div className="flex shrink-0 items-center gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10">
                {ADS_VIDEOS.map((src, idx) => (
                  <PhoneCard
                    key={`ads-1-${idx}`}
                    videoSrc={src}
                    index={idx}
                    isSectionNear={isSectionNear}
                  />
                ))}
              </div>
              {/* Set 2 (Duplicate for infinite seamless loop) */}
              <div
                className="flex shrink-0 items-center gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10"
                aria-hidden="true"
              >
                {ADS_VIDEOS.map((src, idx) => (
                  <PhoneCard
                    key={`ads-2-${idx}`}
                    videoSrc={src}
                    index={idx}
                    isDuplicate
                    isSectionNear={isSectionNear}
                  />
                ))}
              </div>
            </>
          )}

          {/* TAB: Emails */}
          {activeTab === "emails" && (
            <>
              {/* Set 1 */}
              <div className="flex shrink-0 items-center gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10">
                {EMAILS_DATA.map((item) => (
                  <EmailCard key={`email-1-${item.id}`} item={item} />
                ))}
              </div>
              {/* Set 2 (Duplicate for infinite seamless loop) */}
              <div
                className="flex shrink-0 items-center gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10"
                aria-hidden="true"
              >
                {EMAILS_DATA.map((item) => (
                  <EmailCard key={`email-2-${item.id}`} item={item} />
                ))}
              </div>
            </>
          )}

          {/* TAB: Landing Pages */}
          {activeTab === "landing" && (
            <>
              {/* Set 1 */}
              <div className="flex shrink-0 items-center gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10">
                {LANDING_DATA.map((item) => (
                  <LandingPageCard key={`landing-1-${item.id}`} item={item} />
                ))}
              </div>
              {/* Set 2 (Duplicate for infinite seamless loop) */}
              <div
                className="flex shrink-0 items-center gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10"
                aria-hidden="true"
              >
                {LANDING_DATA.map((item) => (
                  <LandingPageCard key={`landing-2-${item.id}`} item={item} />
                ))}
              </div>
            </>
          )}

          {/* TAB: UGC */}
          {activeTab === "ugc" && (
            <>
              {/* Set 1 */}
              <div className="flex shrink-0 items-center gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10">
                {UGC_VIDEOS.map((src, idx) => (
                  <PhoneCard
                    key={`ugc-1-${idx}`}
                    videoSrc={src}
                    index={idx}
                    isSectionNear={isSectionNear}
                  />
                ))}
              </div>
              {/* Set 2 (Duplicate for infinite seamless loop) */}
              <div
                className="flex shrink-0 items-center gap-6 sm:gap-8 lg:gap-10 pr-6 sm:pr-8 lg:pr-10"
                aria-hidden="true"
              >
                {UGC_VIDEOS.map((src, idx) => (
                  <PhoneCard
                    key={`ugc-2-${idx}`}
                    videoSrc={src}
                    index={idx}
                    isDuplicate
                    isSectionNear={isSectionNear}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 flex w-full max-w-[1140px] flex-col items-center justify-between gap-8 px-5 sm:px-8 md:flex-row md:gap-6">
        {/* Left: "Want more inspiration?" */}
        <div className="text-center md:text-left">
          <p className="font-display text-[26px] sm:text-[30px] font-bold leading-[1.05] tracking-tight text-white">
            Want more
          </p>
          <p className="font-serif text-[28px] sm:text-[34px] italic font-normal leading-[1.05] tracking-tight text-neutral-300 mt-0.5">
            inspiration?
          </p>
        </div>

        {/* Center: "Go to Creative Library" pill button */}
        <a
          href="/our-work"
          aria-label="Go to Creative Library"
          className="group inline-flex h-[56px] sm:h-[62px] items-center justify-center gap-3 rounded-full bg-white px-8 sm:px-10 text-[16px] sm:text-[18px] font-bold text-black transition-all duration-300 hover:bg-[#0052FF] hover:text-white hover:scale-105 shadow-xl select-none"
        >
          <span>Go to Creative Library</span>
          <ArrowUpRight
            className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </a>

        {/* Right: Google Reviews Trust Badge */}
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
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#141418] px-2.5 py-0.5 text-[11px] font-semibold text-white/90">
              4.9 | 5<span className="text-[#FBBF24]">★</span>
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-neutral-400">
            Discover why 14+ Businesses Choose Thrides.
          </p>
        </div>
      </div>
    </section>
  );
}
