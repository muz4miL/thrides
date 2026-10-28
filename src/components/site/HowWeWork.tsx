"use client";

import { useEffect, useRef, useState } from "react";
import { SectionBadge } from "./SectionBadge";
import { ArrowUpRight } from "lucide-react";

/* -------------------------------------------------------------
   TYPES & DATA FOR HOW WE WORK
------------------------------------------------------------- */
type ChartChannel = "blended" | "meta" | "google" | "retention";

interface ChannelData {
  label: string;
  roas: string;
  points: number[]; // normalized 0-100 values
  color: string;
}

const CHANNEL_DATA: Record<ChartChannel, ChannelData> = {
  blended: {
    label: "Blended",
    roas: "5.4x ROAS",
    points: [22, 34, 38, 48, 52, 68, 74, 88],
    color: "#0052FF",
  },
  meta: {
    label: "Meta Ads",
    roas: "5.6x ROAS",
    points: [18, 28, 42, 46, 60, 66, 80, 92],
    color: "#3B82F6",
  },
  google: {
    label: "Google Ads",
    roas: "4.8x ROAS",
    points: [30, 36, 40, 50, 54, 62, 70, 78],
    color: "#60A5FA",
  },
  retention: {
    label: "Retention",
    roas: "16.5x ROAS",
    points: [40, 48, 55, 65, 72, 82, 89, 98],
    color: "#10B981",
  },
};

interface FunnelStep {
  id: string;
  name: string;
  metric: string;
  detail: string;
}

const FUNNEL_STEPS: FunnelStep[] = [
  {
    id: "discover",
    name: "Discover",
    metric: "Reach",
    detail: "High-tempo paid media and targeted reach that capture commercial intent.",
  },
  {
    id: "visit",
    name: "Visit",
    metric: "Speed",
    detail: "Sub-second landing pages engineered for immediate message match.",
  },
  {
    id: "enquire",
    name: "Enquire",
    metric: "CVR",
    detail: "High-converting forms and frictionless checkout flows that capture pipeline.",
  },
  {
    id: "retain",
    name: "Retain",
    metric: "LTV",
    detail: "Automated post-purchase sequences that turn buyers into repeat brand advocates.",
  },
];

interface RetentionMessage {
  type: string;
  subject: string;
  stat: string;
  timing: string;
}

const RETENTION_MESSAGES: RetentionMessage[] = [
  {
    type: "Welcome Flow",
    subject: "Private Founder Welcome & VIP Onboarding",
    stat: "52% Open Rate",
    timing: "Trigger: Instant",
  },
  {
    type: "Follow-Up Sequence",
    subject: "Behavioral Follow-up & Custom Recommendations",
    stat: "28% CTR",
    timing: "Trigger: 48h Post-Visit",
  },
  {
    type: "Re-engagement",
    subject: "Exclusive 60-Day Repeat Member Privilege",
    stat: "+34% Repeat LTV",
    timing: "Trigger: 60 Days",
  },
];

/* -------------------------------------------------------------
   MAIN COMPONENT: HowWeWork
------------------------------------------------------------- */
export function HowWeWork() {
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Card 1 State (Daily Performance)
  const [activeChannel, setActiveChannel] = useState<ChartChannel>("blended");

  // Card 2 State (Full-Funnel Ownership)
  const [activeStep, setActiveStep] = useState<string>("visit");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // SVG Line generator for Card 1
  const chartPoints = CHANNEL_DATA[activeChannel].points;
  const svgWidth = 320;
  const svgHeight = 110;
  const pointCoords = chartPoints.map((val, idx) => {
    const x = (idx / (chartPoints.length - 1)) * (svgWidth - 24) + 12;
    const y = svgHeight - (val / 100) * (svgHeight - 24) - 12;
    return { x, y };
  });

  const pathD = pointCoords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = pointCoords[idx - 1];
    if (!prev) return acc;
    const cpX = (prev.x + curr.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }, "");

  const areaD = `${pathD} L ${svgWidth - 12} ${svgHeight} L 12 ${svgHeight} Z`;

  return (
    <section
      ref={sectionRef}
      id="how-we-work"
      aria-label="How We Work & Growth Methodology"
      className="relative w-full overflow-hidden bg-[#060608] pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 border-t border-b border-white/[0.06] select-none scroll-mt-24"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#0052FF]/[0.035] blur-[140px] rounded-full"
      />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* ========================================================
            HEADER
           ======================================================== */}
        <div className="flex flex-col items-center text-center">
          <SectionBadge>HOW WE WORK</SectionBadge>

          <h2 className="mt-4 font-display text-[clamp(36px,4vw,58px)] font-extrabold tracking-[-0.03em] text-white leading-[1.05]">
            Built for growth. <br />
            <span className="font-serif italic font-normal text-white">
              Connected at every level.
            </span>
          </h2>

          <p className="mt-3.5 max-w-[700px] font-sans text-[15px] sm:text-[17px] text-[#A1A1AA] leading-relaxed">
            Real profit-driven scale requires more than disconnected tactics. We align market intelligence, high-converting creative systems, and precision attribution into one unified growth engine.
          </p>
        </div>

        {/* ========================================================
            RESPONSIVE ASYMMETRIC GRID
            Row 1: 7 cols + 5 cols
            Row 2: 5 cols + 7 cols
            Row 3: 6 cols + 6 cols
           ======================================================== */}
        <div className="mt-9 sm:mt-10 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* ----------------------------------------------------
              CARD 1: Daily Performance (7 columns)
              Wider card: Concise text beside visual on lg+ screens
             ---------------------------------------------------- */}
          <div
            style={{
              transitionDelay: hasEntered ? "0ms" : "0ms",
            }}
            className={`group relative rounded-[24px] border border-white/[0.08] bg-[#0C0C10] p-6 sm:p-7 shadow-2xl transition-all duration-[600ms] ease-out hover:border-white/20 md:col-span-7 flex flex-col justify-center motion-reduce:transform-none motion-reduce:transition-none ${
              hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"
            }`}
          >
            {/* Top specular edge highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-6 lg:items-center">
              {/* Text Left on lg+ */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0052FF]">
                    01 • Performance
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[9.5px] text-neutral-400">
                    Illustrative dashboard
                  </span>
                </div>

                <h3 className="mt-2.5 font-display text-[21px] sm:text-[23px] font-bold text-white tracking-tight leading-snug">
                  Daily Performance <span className="font-serif italic font-normal text-white">Tracking</span>
                </h3>

                <p className="mt-2 text-[13.5px] leading-relaxed text-[#A1A1AA]">
                  We set north-star metrics that drive enterprise revenue and track them daily. Custom views give complete visibility without vanity metrics.
                </p>
              </div>

              {/* Visual Right on lg+ */}
              <div className="mt-5 lg:mt-0 lg:col-span-7 rounded-2xl border border-white/[0.07] bg-[#07070A] p-3.5 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/[0.06]">
                  {/* Channel Selector Buttons */}
                  <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Performance Channels">
                    {(["blended", "meta", "google", "retention"] as ChartChannel[]).map((ch) => {
                      const isActive = activeChannel === ch;
                      return (
                        <button
                          key={ch}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setActiveChannel(ch)}
                          className={`rounded-lg px-2 py-1 text-[10.5px] font-semibold transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-[#0052FF] text-white shadow-[0_0_12px_rgba(0,82,255,0.4)]"
                              : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                          }`}
                        >
                          {CHANNEL_DATA[ch].label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active ROAS pill */}
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[11.5px] font-bold text-emerald-400">
                      {CHANNEL_DATA[activeChannel].roas}
                    </span>
                  </div>
                </div>

                {/* Chart SVG */}
                <div className="relative mt-2.5 h-[105px] w-full">
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="h-full w-full overflow-visible"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0052FF" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#0052FF" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid guide lines */}
                    <line x1="0" y1="28" x2={svgWidth} y2="28" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="0" y1="62" x2={svgWidth} y2="62" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="0" y1="96" x2={svgWidth} y2="96" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                    {/* Area fill */}
                    <path d={areaD} fill="url(#chartGradient)" />

                    {/* Stroke path draws once on entry */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={CHANNEL_DATA[activeChannel].color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 500,
                        strokeDashoffset: hasEntered ? 0 : 500,
                        transition: "stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1), stroke 300ms ease",
                      }}
                    />

                    {/* Endpoint glow dot */}
                    {pointCoords.length > 0 && pointCoords[pointCoords.length - 1] && (
                      <circle
                        cx={pointCoords[pointCoords.length - 1]!.x}
                        cy={pointCoords[pointCoords.length - 1]!.y}
                        r="4"
                        fill="#FFFFFF"
                        stroke={CHANNEL_DATA[activeChannel].color}
                        strokeWidth="2"
                        className={`transition-all duration-500 ${hasEntered ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                      />
                    )}
                  </svg>
                </div>

                <div className="mt-1 flex items-center justify-between font-mono text-[9.5px] text-neutral-500">
                  <span>Day 01</span>
                  <span>Day 15</span>
                  <span>Day 30 (Scaled)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              CARD 2: Full-Funnel Ownership (5 columns)
             ---------------------------------------------------- */}
          <div
            style={{
              transitionDelay: hasEntered ? "70ms" : "0ms",
            }}
            className={`group relative rounded-[24px] border border-white/[0.08] bg-[#0C0C10] p-6 sm:p-7 shadow-2xl transition-all duration-[600ms] ease-out hover:border-white/20 md:col-span-5 flex flex-col justify-between motion-reduce:transform-none motion-reduce:transition-none ${
              hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"
            }`}
          >
            {/* Top specular edge highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />

            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0052FF]">
                02 • Conversion Engine
              </span>

              <h3 className="mt-2.5 font-display text-[21px] sm:text-[23px] font-bold text-white tracking-tight leading-snug">
                Full-Funnel <span className="font-serif italic font-normal text-white">Ownership</span>
              </h3>

              <p className="mt-2 text-[13.5px] leading-relaxed text-[#A1A1AA]">
                From first touch to checkout, we optimize every stage of your customer journey. Landing pages, conversion rate optimization, and friction-free funnels.
              </p>
            </div>

            {/* Connected Journey Nodes Visual */}
            <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#07070A] p-3.5 sm:p-4">
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/[0.06]">
                <span className="text-[10.5px] font-mono text-neutral-400">Connected Customer Flow</span>
                <span className="text-[10px] font-mono text-[#0052FF] font-semibold">Interactive</span>
              </div>

              {/* 4 Interactive Nodes */}
              <div className="grid grid-cols-4 gap-1 relative">
                {/* Connecting track line */}
                <div
                  aria-hidden="true"
                  className="absolute top-[17px] left-[12%] right-[12%] h-[2px] bg-white/[0.08] -z-0"
                >
                  <div
                    style={{
                      width: hasEntered ? "100%" : "0%",
                      transition: "width 800ms cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                    className="h-full bg-gradient-to-r from-[#0052FF] to-blue-400"
                  />
                </div>

                {FUNNEL_STEPS.map((step, sIdx) => {
                  const isSelected = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStep(step.id)}
                      onMouseEnter={() => setActiveStep(step.id)}
                      onFocus={() => setActiveStep(step.id)}
                      style={{
                        transitionDelay: hasEntered ? `${120 + sIdx * 60}ms` : "0ms",
                      }}
                      className="group/node relative z-10 flex flex-col items-center text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0052FF] rounded-xl p-1"
                    >
                      <div
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                          isSelected
                            ? "bg-[#0052FF] border-[#0052FF] text-white shadow-[0_0_14px_rgba(0,82,255,0.6)] scale-110"
                            : "bg-[#101015] border-white/15 text-neutral-400 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        <span className="text-[10.5px] sm:text-[11px] font-bold font-mono">
                          {step.metric.charAt(0)}
                        </span>
                      </div>
                      <span
                        className={`mt-1.5 text-[10.5px] sm:text-[11px] font-semibold tracking-tight transition-colors ${
                          isSelected ? "text-white font-bold" : "text-neutral-400"
                        }`}
                      >
                        {step.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detail explanation callout */}
              <div className="mt-2.5 rounded-xl border border-white/[0.06] bg-[#0E0E14] p-2.5 text-[11.5px] sm:text-[12px] leading-relaxed text-neutral-300 min-h-[44px] flex items-center">
                {FUNNEL_STEPS.find((s) => s.id === activeStep)?.detail}
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              CARD 3: Creative Volume (5 columns)
              Artwork: Cobalt.png at 3:2 ratio beneath copy
             ---------------------------------------------------- */}
          <div
            style={{
              transitionDelay: hasEntered ? "140ms" : "0ms",
            }}
            className={`group relative rounded-[24px] border border-white/[0.08] bg-[#0C0C10] p-6 sm:p-7 shadow-2xl transition-all duration-[600ms] ease-out hover:border-white/20 md:col-span-5 flex flex-col justify-between motion-reduce:transform-none motion-reduce:transition-none ${
              hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"
            }`}
          >
            {/* Top specular edge highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />

            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0052FF]">
                03 • Creative Production
              </span>

              <h3 className="mt-2.5 font-display text-[21px] sm:text-[23px] font-bold text-white tracking-tight leading-snug">
                Creative Volume <span className="font-serif italic font-normal text-white">&amp; diversity</span>
              </h3>

              <p className="mt-2 text-[13.5px] leading-relaxed text-[#A1A1AA]">
                We engineer dedicated creative systems producing winning ad variations across formats. Every concept starts with audience psychology and scales with data.
              </p>
            </div>

            {/* Concept Creative Artwork (3:2 Ratio) with gentle 1.025 scale on hover */}
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 aspect-[3/2] w-full bg-[#07070A] group/creative shadow-lg">
              <img
                src="/Cobalt.png"
                alt="Concept creative showcasing product and editorial campaign ad variations"
                className="h-full w-full object-cover transition-transform duration-[450ms] ease-out group-hover/creative:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none will-change-transform"
                loading="lazy"
              />
              <div className="absolute bottom-2.5 right-2.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 px-2.5 py-0.5 font-mono text-[9.5px] font-medium text-neutral-300 shadow-md pointer-events-none">
                Concept creative
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              CARD 4: Retention (7 columns)
              Wider card: Concise text beside visual on lg+ screens
             ---------------------------------------------------- */}
          <div
            style={{
              transitionDelay: hasEntered ? "210ms" : "0ms",
            }}
            className={`group relative rounded-[24px] border border-white/[0.08] bg-[#0C0C10] p-6 sm:p-7 shadow-2xl transition-all duration-[600ms] ease-out hover:border-white/20 md:col-span-7 flex flex-col justify-center motion-reduce:transform-none motion-reduce:transition-none ${
              hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"
            }`}
          >
            {/* Top specular edge highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-6 lg:items-center">
              {/* Text Left on lg+ */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0052FF]">
                    04 • Lifecycle &amp; LTV
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[9.5px] text-neutral-400">
                    Illustrative sequence
                  </span>
                </div>

                <h3 className="mt-2.5 font-display text-[21px] sm:text-[23px] font-bold text-white tracking-tight leading-snug">
                  Retention <span className="font-serif italic font-normal text-white">&amp; lifetime value</span>
                </h3>

                <p className="mt-2 text-[13.5px] leading-relaxed text-[#A1A1AA]">
                  We turn first-time buyers into repeat customers through automated messaging. Tailored email and SMS sequences maximize customer lifetime value.
                </p>
              </div>

              {/* Stack of 3 Message Previews Right on lg+ */}
              <div className="mt-5 lg:mt-0 lg:col-span-7 space-y-2">
                {RETENTION_MESSAGES.map((msg, mIdx) => (
                  <div
                    key={mIdx}
                    style={{
                      transitionDelay: hasEntered ? `${220 + mIdx * 80}ms` : "0ms",
                    }}
                    className={`rounded-xl border border-white/[0.07] bg-[#08080C] p-2.5 sm:p-3 transition-all duration-500 hover:border-white/20 hover:bg-[#0E0E14] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 motion-reduce:transform-none motion-reduce:transition-none ${
                      hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg bg-[#0052FF]/15 text-[#0052FF] font-mono text-[10.5px] font-bold border border-[#0052FF]/25">
                        0{mIdx + 1}
                      </div>
                      <div>
                        <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                          {msg.type} • <span className="text-neutral-500">{msg.timing}</span>
                        </p>
                        <p className="text-[12px] sm:text-[12.5px] font-medium text-white line-clamp-1">
                          {msg.subject}
                        </p>
                      </div>
                    </div>

                    <span className="self-start sm:self-center shrink-0 rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10.5px] font-bold text-emerald-400 border border-emerald-500/20">
                      {msg.stat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              CARD 5: Blended Attribution (6 columns)
             ---------------------------------------------------- */}
          <div
            style={{
              transitionDelay: hasEntered ? "280ms" : "0ms",
            }}
            className={`group relative rounded-[24px] border border-white/[0.08] bg-[#0C0C10] p-6 sm:p-7 shadow-2xl transition-all duration-[600ms] ease-out hover:border-white/20 md:col-span-6 flex flex-col justify-between motion-reduce:transform-none motion-reduce:transition-none ${
              hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"
            }`}
          >
            {/* Top specular edge highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />

            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0052FF]">
                05 • Cross-Channel Data
              </span>

              <h3 className="mt-2.5 font-display text-[21px] sm:text-[23px] font-bold text-white tracking-tight leading-snug">
                Blended <span className="font-serif italic font-normal text-white">Attribution</span>
              </h3>

              <p className="mt-2 text-[13.5px] leading-relaxed text-[#A1A1AA]">
                We unify Meta, Google, and direct channels into a single source of truth. You always know which dollar drives real commercial profit.
              </p>
            </div>

            {/* Channels Connected to Central Thrides Mark Visual */}
            <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#07070A] p-3.5 sm:p-4 relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/[0.06]">
                <span className="text-[10.5px] font-mono text-neutral-400">Channel Network</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Unified View</span>
              </div>

              <div className="grid grid-cols-3 items-center gap-2 relative">
                {/* Left channel nodes */}
                <div className="space-y-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center transition-colors hover:border-white/25">
                    <span className="block text-[11px] font-bold text-white">Meta Ads</span>
                    <span className="block font-mono text-[9.5px] text-neutral-400">Paid Social</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center transition-colors hover:border-white/25">
                    <span className="block text-[11px] font-bold text-white">Google Search</span>
                    <span className="block font-mono text-[9.5px] text-neutral-400">High-Intent</span>
                  </div>
                </div>

                {/* Central Thrides Hub */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#0052FF] text-white shadow-[0_0_24px_rgba(0,82,255,0.6)] border border-white/30">
                    <span className="font-display text-2xl font-black leading-none">t.</span>
                    {/* Pulsing ring */}
                    <span className="absolute -inset-1 rounded-2xl border border-[#0052FF] animate-ping opacity-30" />
                  </div>
                  <span className="mt-1.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-neutral-300">
                    Growth Hub
                  </span>
                </div>

                {/* Right channel nodes */}
                <div className="space-y-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center transition-colors hover:border-white/25">
                    <span className="block text-[11px] font-bold text-white">TikTok Creative</span>
                    <span className="block font-mono text-[9.5px] text-neutral-400">Viral Reach</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center transition-colors hover:border-white/25">
                    <span className="block text-[11px] font-bold text-white">Klaviyo / SMS</span>
                    <span className="block font-mono text-[9.5px] text-neutral-400">Retention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              CARD 6: Profit-First Strategy (6 columns)
             ---------------------------------------------------- */}
          <div
            style={{
              transitionDelay: hasEntered ? "350ms" : "0ms",
            }}
            className={`group relative rounded-[24px] border border-white/[0.08] bg-[#0C0C10] p-6 sm:p-7 shadow-2xl transition-all duration-[600ms] ease-out hover:border-white/20 md:col-span-6 flex flex-col justify-between motion-reduce:transform-none motion-reduce:transition-none ${
              hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"
            }`}
          >
            {/* Top specular edge highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0052FF]">
                  06 • Unit Economics
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[9.5px] text-neutral-400">
                  Illustrative breakdown
                </span>
              </div>

              <h3 className="mt-2.5 font-display text-[21px] sm:text-[23px] font-bold text-white tracking-tight leading-snug">
                Profit-first <span className="font-serif italic font-normal text-white">Strategy</span>
              </h3>

              <p className="mt-2 text-[13.5px] leading-relaxed text-[#A1A1AA]">
                We align ad spend directly to contribution margin and unit economics. Every campaign is engineered around true net profit, not vanity ROAS.
              </p>
            </div>

            {/* Profit & Unit Economics Composition Visual */}
            <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#07070A] p-3.5 sm:p-4">
              <div className="flex items-center justify-between text-[10.5px] font-mono text-neutral-400 pb-2 border-b border-white/[0.06]">
                <span>Contribution Margin Model</span>
                <span className="text-emerald-400 font-bold">+$36,000 Net Profit</span>
              </div>

              {/* Segmented Bar Visual - reveals on entry */}
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden flex">
                  <div
                    style={{
                      width: hasEntered ? "38%" : "0%",
                      transition: "width 700ms cubic-bezier(0.16, 1, 0.3, 1) 300ms",
                    }}
                    className="h-full bg-neutral-600"
                    title="COGS & Ops: 38%"
                  />
                  <div
                    style={{
                      width: hasEntered ? "26%" : "0%",
                      transition: "width 700ms cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                    }}
                    className="h-full bg-blue-500"
                    title="Ad Spend: 26%"
                  />
                  <div
                    style={{
                      width: hasEntered ? "36%" : "0%",
                      transition: "width 700ms cubic-bezier(0.16, 1, 0.3, 1) 500ms",
                    }}
                    className="h-full bg-emerald-400"
                    title="Net Profit: 36%"
                  />
                </div>

                {/* Legend / Breakdown Details */}
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10.5px] sm:text-[11px]">
                  <div className="rounded-lg bg-white/[0.03] p-2 border border-white/[0.05]">
                    <span className="text-neutral-500 block text-[9.5px]">COGS / Ops</span>
                    <span className="text-neutral-300 font-bold">$38k (38%)</span>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-2 border border-white/[0.05]">
                    <span className="text-neutral-500 block text-[9.5px]">Ad Spend</span>
                    <span className="text-blue-400 font-bold">$26k (26%)</span>
                  </div>
                  <div className="rounded-lg bg-emerald-500/10 p-2 border border-emerald-500/20">
                    <span className="text-emerald-400 block text-[9.5px]">Contribution</span>
                    <span className="text-emerald-400 font-black">$36k (36%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            BOTTOM CTA: Growth Audit
           ======================================================== */}
        <div className="mt-12 sm:mt-14 flex justify-center">
          <a
            href="#enquiry"
            className="group relative inline-flex items-center gap-3.5 rounded-full border border-[#0052FF]/60 bg-gradient-to-b from-[#111116] to-[#050508] px-8 sm:px-9 py-3.5 shadow-[0_0_30px_rgba(0,82,255,0.3)] transition-all duration-300 hover:scale-105 hover:border-[#0052FF] hover:shadow-[0_0_50px_rgba(0,82,255,0.55)] cursor-pointer"
          >
            <span className="font-display text-[15px] sm:text-[16px] font-bold text-white tracking-wide">
              Book a
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0052FF] text-white text-[12px] font-black shadow-[0_0_12px_#0052FF]">
              t.
            </span>
            <span className="font-display text-[15px] sm:text-[16px] font-bold text-white tracking-wide">
              Growth Audit
            </span>
            <ArrowUpRight
              size={17}
              className="text-[#0052FF] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
