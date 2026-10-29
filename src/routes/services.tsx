import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HeroButton } from "@/components/site/HeroButton";
import {
  ArrowUpRight,
  Check,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import {
  packages,
  packageComparisonRows,
  services,
  whatHappensWhenYouJoin,
  whatItsLikeToWork,
  faqs,
} from "@/content/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Packages | Thrides Growth Engine" },
      {
        name: "description",
        content:
          "Start where you are. Grow from there. Dedicated marketing packages for every stage: Kickstart, Accelerate, and Authority.",
      },
      {
        property: "og:title",
        content: "Services & Packages | Thrides Growth Engine",
      },
      {
        property: "og:description",
        content:
          "Start where you are. Grow from there. Dedicated marketing packages for every stage: Kickstart, Accelerate, and Authority.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ServicesPage,
});

// tiny scroll-reveal hook
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// Abstract artwork for each package
function KickstartArt() {
  return (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="kg1" cx="30%" cy="60%" r="70%">
          <stop offset="0%" stopColor="#0052FF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="kl1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0052FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0052FF" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="280" height="160" fill="url(#kg1)" />
      {[35,75,115].map((y) => (
        <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="white" strokeOpacity="0.04" strokeWidth="1" />
      ))}
      {[20, 60, 100, 140, 180, 220].map((x, i) => {
        const h = [28, 52, 38, 70, 50, 85][i];
        return (
          <rect key={x} x={x} y={160 - h} width="20" height={h} rx="4"
            fill="#0052FF" fillOpacity={0.1 + i * 0.045} />
        );
      })}
      <rect x="220" y="75" width="20" height="85" rx="4" fill="url(#kl1)" />
      {[20,60,100,140,180,220].map((x,i)=>{const h=[28,52,38,70,50,85][i];return <circle key={`d${x}`} cx={x+10} cy={160-h} r="3" fill="#0052FF" fillOpacity={0.4+i*0.1}/>;})}
      <text x="14" y="20" fill="white" fillOpacity="0.25" fontSize="9" fontFamily="monospace" letterSpacing="2">STAGE 01</text>
    </svg>
  );
}

function AccelerateArt() {
  return (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="ag1" cx="60%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#0052FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="al1" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0052FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#0052FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="280" height="160" fill="url(#ag1)" />
      {[120,90,60,30].map((r,i)=>(
        <circle key={r} cx="280" cy="160" r={r} stroke="#0052FF" strokeOpacity={0.06+i*0.07} strokeWidth="1" fill="none"/>
      ))}
      {[0,56,112,168,224].map((x)=>(
        <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="white" strokeOpacity="0.025" strokeWidth="1"/>
      ))}
      <path d="M10 145 C60 145 80 110 120 90 C160 70 200 50 270 12" stroke="url(#al1)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="270" cy="12" r="5" fill="#0052FF" fillOpacity="0.95"/>
      <circle cx="270" cy="12" r="11" fill="#0052FF" fillOpacity="0.18"/>
      <text x="14" y="20" fill="white" fillOpacity="0.25" fontSize="9" fontFamily="monospace" letterSpacing="2">STAGE 02</text>
    </svg>
  );
}

function AuthorityArt() {
  const nodes: [number,number][] = [[140,80],[55,45],[225,45],[38,130],[242,130],[140,22],[85,118],[195,118]];
  const edges: [[number,number],[number,number]][] = [
    [[140,80],[55,45]],[[140,80],[225,45]],[[140,80],[38,130]],[[140,80],[242,130]],
    [[140,80],[140,22]],[[140,80],[85,118]],[[140,80],[195,118]],
    [[55,45],[140,22]],[[225,45],[140,22]],[[55,45],[38,130]],[[225,45],[242,130]],
  ];
  return (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="aag1" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#0052FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="280" height="160" fill="url(#aag1)"/>
      {edges.map(([[x1,y1],[x2,y2]],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0052FF" strokeOpacity="0.13" strokeWidth="1"/>
      ))}
      {nodes.map(([cx,cy],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r="4" fill="#0052FF" fillOpacity={0.28+i*0.08}/>
          <circle cx={cx} cy={cy} r="8" fill="#0052FF" fillOpacity="0.055"/>
        </g>
      ))}
      <circle cx="140" cy="80" r="7" fill="#0052FF" fillOpacity="0.9"/>
      <circle cx="140" cy="80" r="14" fill="#0052FF" fillOpacity="0.17"/>
      <text x="14" y="20" fill="white" fillOpacity="0.25" fontSize="9" fontFamily="monospace" letterSpacing="2">STAGE 03</text>
    </svg>
  );
}

const pkgArtMap: Record<string, React.ReactNode> = {
  kickstart: <KickstartArt />,
  accelerate: <AccelerateArt />,
  authority: <AuthorityArt />,
};

function ServicesPage() {
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});
  const [showComparison, setShowComparison] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileExpandedService, setMobileExpandedService] = useState<string | null>(services[0]?.id || "");

  const [heroEntered, setHeroEntered] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const packagesReveal = useReveal();
  const processReveal = useReveal();
  const servicesReveal = useReveal();
  const faqReveal = useReveal();
  const ctaReveal = useReveal();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const togglePkg = (id: string) =>
    setExpandedPackages((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-[#08080B] text-white selection:bg-[#0052FF] selection:text-white">
      <Header />
      <main className="flex flex-col">

        {/* ═══════════════════════════════════════════════════════
            1. CINEMATIC HERO (PRESERVED)
           ═══════════════════════════════════════════════════════ */}
        <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-4 md:px-6 pt-2 pb-4">
          <section
            ref={heroRef}
            id="services-hero"
            aria-label="Services & Packages Hero"
            className="relative mx-auto w-full overflow-hidden rounded-[36px] sm:rounded-[44px] md:rounded-[52px] bg-[#000000] border border-white/[0.08] min-h-[520px] lg:h-[calc(100vh-180px)] lg:min-h-[580px] lg:max-h-[640px] shadow-2xl flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-8 py-14 sm:py-16 select-none"
          >
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src="/servicehero.png"
                alt=""
                aria-hidden="true"
                className={`h-full w-full object-cover object-bottom transition-transform duration-1000 ease-out will-change-transform motion-reduce:transform-none ${heroEntered ? "scale-100" : "scale-105"}`}
                loading="eager"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#000000]/75 via-[#000000]/30 to-[#000000]/85" />
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#000000_90%)] opacity-70" />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-4xl">
              <div
                style={{ transitionDelay: heroEntered ? "0ms" : "0ms" }}
                className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md transition-all duration-700 ease-out ${heroEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF] animate-pulse" />
                <span className="font-mono text-[11px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-neutral-300">
                  SERVICES &amp; PACKAGES
                </span>
              </div>

              <h1
                style={{ transitionDelay: heroEntered ? "80ms" : "0ms" }}
                className={`mt-4 sm:mt-5 select-none font-display text-[clamp(40px,5.8vw,86px)] font-extrabold tracking-[-0.04em] text-[#F4F4F5] leading-[0.96] transition-all duration-700 ease-out ${heroEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <span className="block">Start where you are.</span>
                <span className="block font-serif font-normal italic tracking-[-0.025em] text-[#c3d4ff] mt-0.5">
                  Grow from there.
                </span>
              </h1>

              <p
                style={{ transitionDelay: heroEntered ? "160ms" : "0ms" }}
                className={`mt-3 sm:mt-4 max-w-[600px] font-sans text-[15px] sm:text-[17px] text-[#C9C9D0] leading-relaxed transition-all duration-700 ease-out ${heroEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                Strategy, websites, and content — packaged around your stage of growth.
              </p>

              <div
                style={{ transitionDelay: heroEntered ? "240ms" : "0ms" }}
                className={`mt-7 sm:mt-8 flex flex-col items-center gap-5 w-full transition-all duration-700 ease-out ${heroEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <HeroButton href="/contact" leftText="Book a" rightText="Free Strategy Call" ariaLabel="Book a Free Strategy Call" />
                <a
                  href="#packages"
                  className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-200 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:text-white"
                >
                  <span>Explore packages</span>
                  <ChevronDown size={13} className="transition-transform duration-200 group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* ═══════════════════════════════════════════════════════
            2. THE GROWTH COLLECTION — 3 EDITORIAL PACKAGE CARDS
           ═══════════════════════════════════════════════════════ */}
        <section
          id="packages"
          ref={packagesReveal.ref as React.RefObject<HTMLElement>}
          className="scroll-mt-24 py-24 md:py-32 bg-[#08080B]"
        >
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">

            <div className={`flex flex-col items-center text-center max-w-2xl mx-auto transition-all duration-700 ${packagesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0052FF]">
                <Sparkles size={12} />
                THE GROWTH COLLECTION
              </span>
              <h2 className="mt-4 font-display text-[clamp(32px,4vw,54px)] font-extrabold tracking-[-0.04em] text-white leading-tight">
                Start with a package,{" "}
                <span className="font-serif font-normal italic text-white/60">not a guess</span>
              </h2>
              <p className="mt-4 text-[15px] text-neutral-400 leading-relaxed max-w-lg">
                Clear scope. Fixed timelines. Every package comes with approved delivery dates and revisions until you're satisfied.
              </p>
            </div>

            {/* 3 Package Cards */}
            <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
              {packages.map((pkg, idx) => {
                const isAccelerate = pkg.id === "accelerate";
                const isAuthority = pkg.id === "authority";
                const isExpanded = !!expandedPackages[pkg.id];
                const art = pkgArtMap[pkg.id];

                return (
                  <div
                    key={pkg.id}
                    style={{ transitionDelay: `${idx * 80 + 100}ms` }}
                    className={`relative flex flex-col rounded-[28px] border overflow-hidden transition-all duration-700 ${packagesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${
                      isAccelerate
                        ? "border-[#0052FF]/50 bg-gradient-to-b from-[#0D1226] to-[#070A14] shadow-[0_0_52px_rgba(0,82,255,0.2)] ring-1 ring-[#0052FF]/25"
                        : "border-white/[0.09] bg-[#0B0B0F] hover:border-white/20"
                    }`}
                  >
                    {/* Top specular */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Badge */}
                    {isAccelerate && (
                      <div className="absolute -top-px left-0 right-0 flex justify-center pointer-events-none z-10">
                        <div className="inline-flex items-center gap-1.5 bg-[#0052FF] text-white text-[9.5px] font-mono font-black uppercase tracking-widest px-4 py-1 rounded-b-xl shadow-[0_4px_24px_rgba(0,82,255,0.55)]">
                          <Sparkles size={9} />
                          Most Popular
                        </div>
                      </div>
                    )}
                    {isAuthority && (
                      <div className="absolute -top-px left-0 right-0 flex justify-center pointer-events-none z-10">
                        <div className="inline-flex items-center gap-1.5 border border-white/15 bg-[#131420] text-neutral-400 text-[9.5px] font-mono font-bold uppercase tracking-widest px-4 py-1 rounded-b-xl">
                          Custom-Built
                        </div>
                      </div>
                    )}

                    {/* Abstract art strip */}
                    <div className={`w-full overflow-hidden ${isAccelerate ? "h-[120px]" : "h-[100px]"} bg-[#07080D]`}>
                      {art}
                    </div>

                    {/* Card body */}
                    <div className="flex flex-col flex-1 p-6 sm:p-7">

                      {/* Stage + name row */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#0052FF]">
                          0{idx + 1}
                        </span>
                        <span className="h-px flex-1 bg-white/[0.07]" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          {pkg.name}
                        </span>
                      </div>

                      {/* Tagline */}
                      <p className="font-serif italic text-[13px] text-neutral-500 leading-snug mb-2">
                        {pkg.tagline}
                      </p>

                      {/* Main heading — large and editorial */}
                      <h3 className={`font-display font-extrabold tracking-[-0.03em] text-white leading-snug ${isAccelerate ? "text-[26px] sm:text-[28px]" : "text-[22px] sm:text-[24px]"}`}>
                        {pkg.heading}
                      </h3>

                      {/* Core deliverables */}
                      <div className="mt-5 pt-4 border-t border-white/[0.07]">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500 block mb-3">
                          Core Inclusions
                        </span>
                        <ul className="space-y-2">
                          {pkg.deliverables.slice(0, isAccelerate ? 5 : 4).map((del, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2 text-[13px] text-neutral-300 leading-snug">
                              <Check size={13} className="text-[#0052FF] shrink-0 mt-0.5" />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Timeline + Payment grid */}
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                          <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-0.5">Timeline</span>
                          <span className="text-white font-semibold text-[12px] leading-snug">{pkg.timeline}</span>
                        </div>
                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                          <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-0.5">Payment</span>
                          <span className="text-white font-semibold text-[12px] leading-snug">{pkg.payment}</span>
                        </div>
                      </div>

                      {/* Expandable full details */}
                      {isExpanded && (
                        <div id={`pkg-details-${pkg.id}`} className="mt-5 pt-4 border-t border-white/[0.07] space-y-4 animate-in fade-in duration-200">
                          <div className="rounded-xl bg-[#06070B] border border-white/[0.05] p-3.5 text-[12.5px] text-neutral-300 leading-relaxed">
                            <span className="font-bold text-white">The problem: </span>
                            {pkg.theProblem}
                          </div>
                          <div>
                            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500 block mb-2.5">
                              Full Scope ({pkg.deliverables.length} deliverables)
                            </span>
                            <ul className="space-y-2">
                              {pkg.deliverables.map((del, fullIdx) => (
                                <li key={fullIdx} className="flex items-start gap-2 text-[12.5px] text-neutral-300 leading-snug">
                                  <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{del}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <p className="text-[12px] leading-relaxed text-neutral-400 italic">
                            <span className="font-semibold not-italic text-neutral-300">Our promise: </span>
                            {pkg.promise}
                          </p>
                        </div>
                      )}

                      <div className="flex-1" />

                      {/* Bottom CTA block */}
                      <div className="mt-6 pt-5 border-t border-white/[0.07]">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Investment</span>
                          <span className="font-mono text-[12px] font-bold text-white">
                            {isAuthority ? "Custom, confirmed on your call" : "Enquire for pricing"}
                          </span>
                        </div>

                        <a
                          href={`/contact?package=${pkg.id}`}
                          className={`inline-flex w-full h-[48px] items-center justify-center gap-2 rounded-full font-bold text-[14px] transition-all cursor-pointer ${
                            isAccelerate
                              ? "bg-[#0052FF] text-white hover:bg-[#0043DB] shadow-[0_0_28px_rgba(0,82,255,0.45)]"
                              : "bg-white/[0.05] text-white hover:bg-white/[0.10] border border-white/[0.09] hover:border-white/20"
                          }`}
                        >
                          <span>{pkg.ctaText}</span>
                          <ArrowUpRight size={15} className="stroke-[2.5]" />
                        </a>

                        <button
                          type="button"
                          onClick={() => togglePkg(pkg.id)}
                          aria-expanded={isExpanded}
                          aria-controls={`pkg-details-${pkg.id}`}
                          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-200 transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? "Hide details" : "View full scope"}</span>
                          <ChevronDown size={12} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Not sure strip */}
            <div className={`mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700 delay-300 ${packagesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <div>
                <p className="font-display font-bold text-white text-[15px]">Not sure which fits?</p>
                <p className="text-[13px] text-neutral-400 mt-0.5">Tell us where your business is today — we'll recommend the right one on a free call.</p>
              </div>
              <a
                href="/contact"
                className="shrink-0 inline-flex items-center gap-2 rounded-full border border-[#0052FF]/40 bg-[#0052FF]/10 text-[#0052FF] hover:bg-[#0052FF]/20 px-5 py-2.5 text-[13px] font-bold transition-all cursor-pointer"
              >
                Book free call <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Collapsible comparison matrix */}
            <div className={`mt-14 transition-all duration-700 delay-200 ${packagesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <button
                type="button"
                onClick={() => setShowComparison((s) => !s)}
                aria-expanded={showComparison}
                aria-controls="comparison-matrix"
                className="group flex items-center gap-3 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest font-bold">{showComparison ? "Hide" : "Show"} full comparison</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showComparison ? "rotate-180" : ""}`} />
              </button>

              {showComparison && (
                <div id="comparison-matrix" className="mt-6 animate-in fade-in duration-300 overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0B0B0F]">
                  <table className="w-full text-left text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/[0.07]">
                        <th className="py-3.5 px-5 font-mono text-[10px] uppercase tracking-wider text-neutral-400">Feature</th>
                        <th className="py-3.5 px-5 font-display font-bold text-white text-[13px]">Kickstart</th>
                        <th className="py-3.5 px-5 font-display font-bold text-[#0052FF] text-[13px] bg-[#0052FF]/[0.06]">Accelerate</th>
                        <th className="py-3.5 px-5 font-display font-bold text-white text-[13px]">Authority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {packageComparisonRows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"}>
                          <td className="py-3.5 px-5 font-semibold text-[12px] text-neutral-300">{row.feature}</td>
                          <td className="py-3.5 px-5 text-[12px] text-neutral-400">{row.kickstart}</td>
                          <td className="py-3.5 px-5 text-[12px] text-white bg-[#0052FF]/[0.04]">{row.accelerate}</td>
                          <td className="py-3.5 px-5 text-[12px] text-neutral-400">{row.authority}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            3. HOW IT WORKS + CLIENT ONBOARDING (unified)
           ═══════════════════════════════════════════════════════ */}
        <section
          ref={processReveal.ref as React.RefObject<HTMLElement>}
          className="py-24 md:py-32 bg-[#060608] border-t border-b border-white/[0.05]"
        >
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">

            {/* How It Works */}
            <div className={`transition-all duration-700 ${processReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0052FF]">Simple Process</span>
                  <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,46px)] font-extrabold tracking-[-0.04em] text-white leading-tight">
                    How It Works
                  </h2>
                </div>
                <p className="text-[14px] text-neutral-400 max-w-xs leading-relaxed sm:text-right">
                  Three steps from your first conversation to results in progress.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-white/[0.06]">
                {[
                  { step: "01", title: "Free strategy call", desc: "30 minutes. We review your current marketing, positioning, and goals. No obligation." },
                  { step: "02", title: "Your plan", desc: "We recommend the package and priorities that will make the biggest difference for your business." },
                  { step: "03", title: "We build", desc: "You get a clear timeline, delivery dates, and a structured kickoff. Then we get to work." },
                ].map((item, i) => (
                  <div
                    key={item.step}
                    style={{ transitionDelay: `${i * 100 + 80}ms` }}
                    className={`px-0 md:px-10 first:pl-0 last:pr-0 py-6 md:py-0 border-b md:border-b-0 border-white/[0.06] last:border-0 transition-all duration-700 ${processReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  >
                    <span className="font-display text-[72px] font-black text-white/[0.045] leading-none select-none block">
                      {item.step}
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF]" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0052FF]">Step {item.step}</span>
                    </div>
                    <h3 className="mt-3 font-display text-[21px] font-extrabold text-white tracking-[-0.02em]">{item.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-neutral-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div aria-hidden="true" className="my-20 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Client Onboarding */}
            <div className={`transition-all duration-700 delay-100 ${processReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                {/* Left copy + principles */}
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0052FF]">Client Onboarding</span>
                  <h2 className="mt-3 font-display text-[clamp(26px,3vw,40px)] font-extrabold tracking-[-0.04em] text-white leading-tight">
                    A smooth start, because the first two weeks set the tone
                  </h2>
                  <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-neutral-400">
                    No guesswork, no communication black holes. We establish structured check-ins, rapid feedback loops, and clear delivery roadmaps from day one.
                  </p>

                  <div className="mt-8 space-y-4">
                    {whatItsLikeToWork.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-[#0052FF]/12 border border-[#0052FF]/30 shrink-0">
                          <Check size={11} className="text-[#0052FF]" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-[14px] text-white leading-snug">{item.title}</p>
                          <p className="text-[13px] text-neutral-400 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: onboarding timeline */}
                <div className="space-y-0">
                  {whatHappensWhenYouJoin.map((item, i) => (
                    <div key={i} className="relative flex items-start gap-5 pb-8 last:pb-0">
                      {i < whatHappensWhenYouJoin.length - 1 && (
                        <div aria-hidden="true" className="absolute left-[17px] top-9 bottom-0 w-[1px] bg-gradient-to-b from-[#0052FF]/35 to-transparent" />
                      )}
                      <div className="relative z-10 shrink-0 h-[35px] w-[35px] flex items-center justify-center rounded-full bg-[#0052FF]/10 border border-[#0052FF]/30 text-[#0052FF] font-mono text-[10px] font-black">
                        0{i + 1}
                      </div>
                      <div className="pt-1">
                        <h4 className="font-display font-bold text-[16px] text-white leading-snug">{item.title}</h4>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-neutral-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            4. EDITORIAL SERVICE ROWS
           ═══════════════════════════════════════════════════════ */}
        <section
          id="services-details"
          ref={servicesReveal.ref as React.RefObject<HTMLElement>}
          className="scroll-mt-24 py-24 md:py-32 bg-[#08080B]"
        >
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">

            <div className={`max-w-2xl mb-16 transition-all duration-700 ${servicesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0052FF]">What We Do</span>
              <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,46px)] font-extrabold tracking-[-0.04em] text-white leading-tight">
                The services that put your brand in front of your customers
              </h2>
              <p className="mt-4 text-[14px] sm:text-[15px] text-neutral-400 leading-relaxed">
                Six capabilities. Every one tied to a package so you know exactly what you're getting.
              </p>
            </div>

            {/* Desktop: editorial stacked rows */}
            <div className="hidden lg:block divide-y divide-white/[0.06]">
              {services.map((svc, idx) => (
                <div
                  key={svc.id}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  className={`group py-10 grid grid-cols-12 gap-8 items-start transition-all duration-700 ${servicesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                >
                  {/* Number + title */}
                  <div className="col-span-4 flex items-start gap-5">
                    <span className="font-display text-[56px] font-black text-white/[0.05] leading-none select-none shrink-0 group-hover:text-white/[0.09] transition-colors duration-300">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="pt-2.5">
                      <div className="inline-flex items-center rounded-full bg-[#0052FF]/10 border border-[#0052FF]/25 px-2.5 py-0.5 text-[9px] font-mono font-bold text-[#0052FF] uppercase tracking-wider mb-2 leading-relaxed">
                        {svc.includedIn}
                      </div>
                      <h3 className="font-display text-[20px] font-extrabold text-white tracking-[-0.02em] leading-snug">
                        {svc.title}
                      </h3>
                    </div>
                  </div>

                  {/* Summary + bullets */}
                  <div className="col-span-5">
                    <p className="text-[14px] leading-relaxed text-neutral-300">{svc.summary}</p>
                    <ul className="mt-4 space-y-1.5">
                      {svc.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-[13px] text-neutral-400">
                          <ChevronRight size={13} className="text-[#0052FF] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image */}
                  <div className="col-span-3">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#07070A]">
                      <img
                        src={svc.image}
                        alt={svc.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <a
                      href={`/contact?service=${svc.slug}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#0052FF] hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      Enquire about this service
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile accordion */}
            <div className="block lg:hidden space-y-3">
              {services.map((svc, sIdx) => {
                const isOpen = mobileExpandedService === svc.id;
                return (
                  <div key={svc.id} className="rounded-2xl border border-white/[0.08] bg-[#0C0C10] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setMobileExpandedService(isOpen ? null : svc.id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#0052FF]">
                          {String(sIdx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-[17px] font-bold text-white">{svc.title}</h3>
                      </div>
                      <span className="text-neutral-400">
                        {isOpen ? <Minus size={17} /> : <Plus size={17} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-white/[0.06] space-y-4 animate-in fade-in duration-200">
                        <div className="inline-flex items-center rounded-full bg-[#0052FF]/10 border border-[#0052FF]/25 px-3 py-0.5 text-[10px] font-mono font-bold text-[#0052FF] uppercase tracking-wider">
                          {svc.includedIn}
                        </div>
                        <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/[0.07]">
                          <img src={svc.image} alt={svc.title} className="h-full w-full object-cover" />
                        </div>
                        <p className="text-[13.5px] text-neutral-300 leading-relaxed">{svc.summary}</p>
                        <ul className="space-y-1.5">
                          {svc.bullets.map((bullet, mbIdx) => (
                            <li key={mbIdx} className="flex items-start gap-2 text-[13px] text-neutral-400">
                              <ChevronRight size={13} className="text-[#0052FF] shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                        <a
                          href={`/contact?service=${svc.slug}`}
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#0052FF] hover:underline cursor-pointer"
                        >
                          Enquire about this service <ArrowUpRight size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            5. TWO-COLUMN FAQ
           ═══════════════════════════════════════════════════════ */}
        <section
          ref={faqReveal.ref as React.RefObject<HTMLElement>}
          className="py-24 md:py-32 bg-[#060608] border-t border-white/[0.05]"
        >
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 transition-all duration-700 ${faqReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

              {/* Left */}
              <div className="lg:col-span-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0052FF]">FAQ</span>
                <h2 className="mt-3 font-display text-[clamp(26px,3vw,40px)] font-extrabold tracking-[-0.04em] text-white leading-tight">
                  Questions before you book
                </h2>
                <p className="mt-4 text-[14px] text-neutral-400 leading-relaxed">
                  Can't find what you're looking for? Book a free call and ask us anything.
                </p>
                <a
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#0052FF]/40 bg-[#0052FF]/10 text-[#0052FF] hover:bg-[#0052FF]/20 px-5 py-2.5 text-[13px] font-bold transition-all cursor-pointer"
                >
                  Book free call <ArrowUpRight size={14} />
                </a>
              </div>

              {/* Right accordion */}
              <div className="lg:col-span-8">
                <div className="divide-y divide-white/[0.07]">
                  {faqs.map((item, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div key={i}>
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          aria-expanded={isOpen}
                          className="w-full flex items-start justify-between py-5 text-left gap-4 cursor-pointer group"
                        >
                          <span className="font-display font-bold text-[15px] sm:text-[16px] text-white group-hover:text-[#0052FF] transition-colors leading-snug">
                            {item.q}
                          </span>
                          <span className="shrink-0 mt-0.5 text-neutral-500 group-hover:text-[#0052FF] transition-colors">
                            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="pb-5 text-[14px] leading-relaxed text-neutral-300 animate-in fade-in duration-200">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            6. FINAL STRATEGY CALL CTA
           ═══════════════════════════════════════════════════════ */}
        <section
          ref={ctaReveal.ref as React.RefObject<HTMLElement>}
          className="py-20 md:py-28 bg-[#08080B]"
        >
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
            <div className={`relative overflow-hidden rounded-[36px] border border-white/[0.08] bg-gradient-to-b from-[#0D1120] to-[#060608] p-10 sm:p-16 text-center shadow-2xl transition-all duration-700 ${ctaReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[280px] bg-[#0052FF]/10 blur-[120px] rounded-full" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#0052FF]/35 to-transparent" />

              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-widest text-neutral-300 mb-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF] animate-pulse" />
                  Start Where You Are
                </span>

                <h2 className="font-display text-[clamp(28px,4vw,52px)] font-extrabold tracking-[-0.04em] text-white leading-tight">
                  Not sure which service you need?
                </h2>

                <p className="mt-4 text-[15px] sm:text-[16px] text-neutral-300 leading-relaxed max-w-lg">
                  Just starting out? <strong className="text-white">Kickstart.</strong>{" "}
                  Want steady leads? <strong className="text-white">Accelerate.</strong>{" "}
                  Want to lead your market? <strong className="text-white">Authority.</strong>
                </p>

                <p className="mt-2 text-[13px] text-neutral-500">
                  Start with a free 30-minute strategy call. We'll review your marketing and recommend what will make the biggest difference.
                </p>

                <div className="mt-8 flex justify-center">
                  <HeroButton href="/contact" leftText="Book a" rightText="Free Strategy Call" ariaLabel="Book a Free Strategy Call" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
