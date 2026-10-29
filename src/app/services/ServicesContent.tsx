"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HeroButton } from "@/components/site/HeroButton";
import { WhoItsFor } from "@/components/site/WhoItsFor";
import ReadyToScale from "@/components/ReadyToScale";
import { OnboardingSection } from "@/components/services/onboarding/OnboardingSection";
import { HowItWorksSection } from "@/components/services/how-it-works/HowItWorksSection";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import {
  packageComparisonRows,
  services,
  whatHappensWhenYouJoin,
  whatItsLikeToWork,
  faqs,
} from "@/content/site";

// tiny scroll-reveal hook
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e && e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function ServicesContent() {
  const [showComparison, setShowComparison] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileExpandedService, setMobileExpandedService] = useState<string | null>(
    services[0]?.id || "",
  );

  const [heroEntered, setHeroEntered] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const processReveal = useReveal();
  const servicesReveal = useReveal();
  const faqReveal = useReveal();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setHeroEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#08080B] text-white selection:bg-[#0052FF] selection:text-white">
      <Header />
      <main className="flex flex-col">

        {/* 1. CINEMATIC HERO */}
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

        {/* 2. THE THREE PACKAGES (Identical to Home Screen WhoItsFor Component) */}
        <WhoItsFor
          id="packages"
          onCompareClick={() => setShowComparison((s) => !s)}
        >
          {/* Collapsible comparison matrix inside packages section */}
          <div className="mt-8">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowComparison((s) => !s)}
                aria-expanded={showComparison}
                aria-controls="comparison-matrix"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-neutral-300 hover:text-white hover:border-white/20 transition-all cursor-pointer text-[12px] font-mono uppercase tracking-wider font-semibold"
              >
                <span>{showComparison ? "Hide" : "Show"} Full 24-Point Deliverables Comparison</span>
                <ChevronDown size={14} className={`transition-transform duration-300 text-[#0052FF] ${showComparison ? "rotate-180" : ""}`} />
              </button>
            </div>

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
        </WhoItsFor>

        {/* 3. HOW IT WORKS (PREMIUM ANIMATED JOURNEY) */}
        <HowItWorksSection />

        {/* 3.5 CLIENT ONBOARDING (LUXURY TIMELINE) */}
        <OnboardingSection />

        {/* 4. ALL SIX SERVICES IN DETAIL */}
        <section
          id="all-services"
          ref={servicesReveal.ref as React.RefObject<HTMLElement>}
          className="scroll-mt-24 py-24 md:py-32 bg-[#08080B]"
        >
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
            <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16 transition-all duration-700 ${servicesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0052FF]">Capabilities</span>
                <h2 className="mt-3 font-display text-[clamp(28px,3.8vw,48px)] font-extrabold tracking-[-0.04em] text-white leading-tight">
                  Six Core Services,{" "}
                  <span className="font-serif font-normal italic text-white/60">One Cohesive Team</span>
                </h2>
              </div>
              <p className="text-[14px] text-neutral-400 max-w-sm leading-relaxed sm:text-right">
                Every service works standalone or combined within your growth package.
              </p>
            </div>

            {/* Desktop */}
            <div className="hidden lg:block divide-y divide-white/[0.07]">
              {services.map((svc, sIdx) => (
                <div
                  key={svc.id}
                  style={{ transitionDelay: `${sIdx * 60}ms` }}
                  className={`py-12 grid grid-cols-12 gap-8 items-center group transition-all duration-700 ${servicesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                >
                  <div className="col-span-1">
                    <span className="font-mono text-xs font-bold text-[#0052FF]">
                      {String(sIdx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="col-span-4">
                    <div className="inline-flex items-center rounded-full bg-[#0052FF]/10 border border-[#0052FF]/25 px-3 py-0.5 text-[10px] font-mono font-bold text-[#0052FF] uppercase tracking-wider mb-2.5">
                      {svc.includedIn}
                    </div>
                    <h3 className="font-display text-[24px] font-extrabold text-white tracking-[-0.03em] group-hover:text-[#0052FF] transition-colors">
                      {svc.title}
                    </h3>
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-neutral-400">
                      {svc.summary}
                    </p>
                  </div>

                  <div className="col-span-4">
                    <ul className="space-y-2">
                      {svc.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-[13px] text-neutral-300">
                          <Check size={13} className="text-[#0052FF] shrink-0 mt-0.5" />
                          <span className="leading-snug">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-3">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#07070A]">
                      <img
                        src={typeof svc.image === "string" ? svc.image : svc.image?.src || ""}
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

            {/* Mobile */}
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
                          <img src={typeof svc.image === "string" ? svc.image : svc.image?.src || ""} alt={svc.title} className="h-full w-full object-cover" />
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
                        <div className="pt-2">
                          <a
                            href={`/contact?service=${svc.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0052FF] hover:underline"
                          >
                            Enquire about {svc.title} <ArrowUpRight size={12} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. FAQS */}
        <section
          id="faq"
          ref={faqReveal.ref as React.RefObject<HTMLElement>}
          className="py-24 md:py-32 bg-[#060608] border-t border-white/[0.05]"
        >
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className={`lg:col-span-4 transition-all duration-700 ${faqReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0052FF]">FAQ</span>
                <h2 className="mt-3 font-display text-[clamp(26px,3vw,38px)] font-extrabold tracking-[-0.04em] text-white leading-tight">
                  Common questions before booking
                </h2>
                <p className="mt-3 text-[14px] text-neutral-400 leading-relaxed">
                  Have a different question? Ask it directly on your free 30-minute strategy call.
                </p>
                <div className="mt-6">
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0052FF] hover:text-blue-400 transition-colors"
                  >
                    Ask a question directly <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>

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

        {/* 6. FINAL CTA: Ready to Scale (Identical to Home Screen) */}
        <ReadyToScale />

      </main>
      <Footer />
    </div>
  );
}
