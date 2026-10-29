"use client";

/**
 * Thrides — Testimonials
 *
 * Concept: one quote at a time, set large in the brand's italic serif, paired
 * with the hard result it produced. A quiet roster on the right switches
 * between clients and doubles as the auto-play timer (thin blue line fills
 * along the active client).
 *
 * Needs: next, react, framer-motion, Tailwind.
 * Font: expects Instrument Serif exposed as --font-instrument-serif via next/font
 * (falls back to Georgia). Change SERIF below if your variable is named differently.
 *
 * !! The quotes and names below are PLACEHOLDERS. Replace them with real,
 * approved client testimonials before launch. Metrics come from your Our Work page.
 */

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  category: string;
  metric: string;
  metricLabel: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "apex",
    quote:
      "They didn't pitch us a campaign. They rebuilt how we're positioned, and the right clients started finding us.",
    name: "Daniel Reeve",
    role: "Managing Partner",
    company: "Apex Strategic Advisory",
    category: "Management consultancy",
    metric: "+184%",
    metricLabel: "qualified pipeline",
  },
  {
    id: "voltex",
    quote:
      "Every drop sold through faster than the last, and we always knew exactly what was shipping next.",
    name: "Maya Okafor",
    role: "Head of Growth",
    company: "Voltex Activewear",
    category: "Athletic apparel",
    metric: "4.6x",
    metricLabel: "return on ad spend",
  },
  {
    id: "pulse",
    quote:
      "Our community finally has something to come back to every week. The content engine just runs.",
    name: "Jordan Ellis",
    role: "Founder",
    company: "Pulse Performance",
    category: "Health & fitness",
    metric: "20",
    metricLabel: "pieces of content a month",
  },
  {
    id: "zest",
    quote:
      "Three weeks from brief to shelf-ready. Over a hundred stockists signed up before we'd even finished unpacking.",
    name: "Sofia Marchetti",
    role: "Co-founder",
    company: "Zest Botanicals",
    category: "Consumer goods",
    metric: "100+",
    metricLabel: "stockists secured",
  },
  {
    id: "lumina",
    quote:
      "The redesign paid for itself in retention alone. Baskets got bigger and customers kept coming back.",
    name: "Priya Nair",
    role: "Director of E-commerce",
    company: "Lumina Home & Living",
    category: "Modern retail",
    metric: "+92%",
    metricLabel: "average order value",
  },
];

const AUTOPLAY_MS = 9000;
const EASE = [0.22, 1, 0.36, 1] as const;
const SERIF: CSSProperties = {
  fontFamily:
    "var(--font-instrument-serif), var(--font-serif), 'Instrument Serif', Georgia, 'Times New Roman', serif",
};
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

function RevealQuote({ text, reduce }: { text: string; reduce: boolean }) {
  const words = text.split(" ");
  return (
    <p
      className="text-[clamp(1.65rem,3.3vw,2.75rem)] italic leading-[1.2] tracking-[-0.01em] text-[#F5F2EC]"
      style={SERIF}
    >
      {words.map((word, i) => (
        <span key={i}>
          <motion.span
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: i * 0.028, ease: EASE }}
          >
            {word}
          </motion.span>{" "}
        </span>
      ))}
    </p>
  );
}

export default function Testimonials() {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = TESTIMONIALS[active] ?? TESTIMONIALS[0]!;
  const paused = userPaused || hover || focusIn;

  const go = useCallback((i: number) => {
    setActive((i + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    const d = delta[e.key];
    if (!d) return;
    e.preventDefault();
    const next = (active + d + TESTIMONIALS.length) % TESTIMONIALS.length;
    go(next);
    tabs.current[next]?.focus();
  };

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative isolate overflow-hidden bg-[#050507] py-28 text-[#F5F2EC] md:py-36"
    >
      <style>{`@keyframes ts-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>

      {/* ambient layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-[#0A5CFF] opacity-[0.10] blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="mx-auto max-w-[1200px] px-6">
        {/* header */}
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-mono text-[11px] tracking-[0.22em] text-[#0A5CFF]">
              CLIENT WORDS
            </p>
            <h2
              id="testimonials-heading"
              className="max-w-[16ch] text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.04em]"
            >
              Clients say it better than we do.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Resume auto-play" : "Pause auto-play"}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A5CFF]"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden fill="currentColor">
              {userPaused ? (
                <path d="M2 1l7 4-7 4z" />
              ) : (
                <path d="M2 1h2v8H2zM6 1h2v8H6z" />
              )}
            </svg>
            {userPaused ? "Play" : "Pause"}
          </button>
        </div>

        {/* card with gradient hairline */}
        <div className="rounded-[28px] bg-[linear-gradient(135deg,rgba(10,92,255,0.7),rgba(255,255,255,0.06)_32%,rgba(255,255,255,0.03)_68%,rgba(10,92,255,0.28))] p-px shadow-[0_40px_120px_-40px_rgba(10,92,255,0.35)]">
          <div
            onMouseMove={onMove}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setFocusIn(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusIn(false);
            }}
            className="relative grid overflow-hidden rounded-[27px] bg-[#08080b] lg:grid-cols-[1.65fr_1fr]"
          >
            {/* cursor spotlight */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(420px circle at var(--mx, 30%) var(--my, 15%), rgba(10,92,255,0.10), transparent 60%)",
              }}
            />

            {/* quote panel */}
            <div
              id="ts-panel"
              role="tabpanel"
              aria-labelledby={`ts-tab-${current.id}`}
              className="relative flex min-h-[460px] flex-col justify-between gap-12 p-8 md:min-h-[500px] md:p-14"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-2 left-6 select-none text-[11rem] leading-none text-[#0A5CFF] opacity-[0.18] md:left-10"
                style={SERIF}
              >
                &ldquo;
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  className="relative flex flex-1 flex-col justify-between gap-12"
                  exit={reduce ? { opacity: 1, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.18 } }}
                >
                  <div className="pt-12 md:pt-14">
                    <RevealQuote text={current.quote} reduce={reduce} />
                  </div>

                  <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        aria-hidden
                        className="grid h-12 w-12 place-items-center rounded-full border border-[#0A5CFF]/50 bg-[#0A5CFF]/10 text-sm font-semibold text-[#9DBDFF]"
                      >
                        {initials(current.name)}
                      </span>
                      <div>
                        <p className="font-semibold tracking-[-0.01em]">{current.name}</p>
                        <p className="text-sm text-white/55">
                          {current.role}, {current.company}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-5xl font-bold leading-none tracking-[-0.05em] md:text-6xl">
                        {current.metric}
                      </p>
                      <p className="mt-2 text-sm text-white/55">{current.metricLabel}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* roster */}
            <div
              role="tablist"
              aria-label="Choose a client"
              onKeyDown={onKeyDown}
              className="relative flex overflow-x-auto border-t border-white/[0.07] lg:flex-col lg:overflow-visible lg:border-l lg:border-t-0"
            >
              {TESTIMONIALS.map((t, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    id={`ts-tab-${t.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="ts-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => go(i)}
                    className={`relative flex min-w-[220px] shrink-0 flex-col items-start gap-1 px-7 py-6 text-left transition-[opacity,background-color] duration-500 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0A5CFF] lg:min-w-0 lg:flex-1 lg:justify-center lg:border-b lg:border-white/[0.07] lg:last:border-b-0 ${
                      isActive
                        ? "bg-white/[0.035] opacity-100"
                        : "opacity-45 hover:opacity-85"
                    }`}
                  >
                    <span className="font-semibold tracking-[-0.01em]">{t.company}</span>
                    <span className="text-sm text-white/55">{t.category}</span>

                    {isActive && (
                      <span
                        aria-hidden
                        onAnimationEnd={() => go(active + 1)}
                        className="absolute inset-x-0 bottom-0 h-px origin-left bg-[#0A5CFF] shadow-[0_0_12px_#0A5CFF]"
                        style={
                          reduce
                            ? { transform: "scaleX(1)" }
                            : {
                                animation: `ts-progress ${AUTOPLAY_MS}ms linear forwards`,
                                animationPlayState: paused ? "paused" : "running",
                              }
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/our-work"
            className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A5CFF]"
          >
            <span className="border-b border-white/20 pb-0.5 transition-colors group-hover:border-[#0A5CFF]">
              See the work behind these results
            </span>
            <span aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export { Testimonials };
