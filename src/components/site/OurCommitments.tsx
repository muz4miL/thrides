import { useEffect, useRef, useState } from "react";
import { ShieldCheck, CheckCircle2, Sparkles, BarChart3, UserCheck, ArrowUpRight } from "lucide-react";
import { SectionBadge } from "./SectionBadge";
import { whatYouCanCountOn } from "@/content/site";

interface CommitmentDetail {
  badge: string;
  titleSans: string;
  titleSerif: string;
  desc: string;
  icon: typeof ShieldCheck;
  metric: string;
}

const COMMITMENT_ITEMS: CommitmentDetail[] = [
  {
    badge: "100% ON-TIME SLA",
    titleSans: "Delivery dates",
    titleSerif: "in writing",
    desc: "Every sprint and milestone comes with committed delivery dates set in writing. You always know exactly when assets and campaigns arrive—zero delays, zero surprises.",
    icon: ShieldCheck,
    metric: "Guaranteed SLA",
  },
  {
    badge: "ZERO-RISK APPROVAL",
    titleSans: "Revisions until",
    titleSerif: "you approve",
    desc: "You’re never stuck with creative you don’t like. We iterate, refine, and polish until you are completely satisfied with the work before anything goes live.",
    icon: CheckCircle2,
    metric: "100% Satisfaction",
  },
  {
    badge: "QUARTERLY PIVOT PLEDGE",
    titleSans: "A 3-month",
    titleSerif: "plan review",
    desc: "On monthly packages, if commercial results fall behind benchmarks, we proactively audit and adjust the strategy roadmap with you. We share direct accountability.",
    icon: Sparkles,
    metric: "Shared Risk",
  },
  {
    badge: "100% JARGON-FREE",
    titleSans: "Plain-language",
    titleSerif: "reporting",
    desc: "No confusing technical vanity metrics or marketing fluff designed to mask results. Just crystal-clear numbers tracking real pipeline, conversion, and revenue impact.",
    icon: BarChart3,
    metric: "Real Revenue Data",
  },
  {
    badge: "DIRECT EXECUTIVE ACCESS",
    titleSans: "Dedicated executive",
    titleSerif: "partnership",
    desc: "A dedicated kickoff call, a named point of contact, and agreed response times under 24 hours. You’re treated like a flagship partner, not a support ticket.",
    icon: UserCheck,
    metric: "<24h SLA",
  },
];

export function OurCommitments() {
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="commitments"
      aria-label="Our Commitments & Guarantees"
      className="relative w-full overflow-hidden bg-[#060608] pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 border-b border-white/[0.06] select-none scroll-mt-24"
    >
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Header Block matching Defiant */}
        <div className="flex flex-col items-center text-center">
          <SectionBadge>OUR COMMITMENTS</SectionBadge>

          <h2 className="mt-5 font-display text-[clamp(36px,5.2vw,72px)] font-extrabold tracking-[-0.03em] text-white leading-[1.04] max-w-4xl">
            What you can <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-white">count on</span>
          </h2>

          <p className="mt-5 max-w-[760px] font-sans text-[16px] sm:text-[18px] text-[#A1A1AA] leading-relaxed">
            Most agencies sell vague promises and hide behind fine print. We give you five non-negotiable guarantees in writing before we touch a single campaign.
          </p>
        </div>

        {/* 5 High-End Cards Grid: 3 in row 1, 2 wide in row 2 */}
        <div
          className={`mt-14 sm:mt-18 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 transition-all duration-700 ease-out ${
            hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {COMMITMENT_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isWide = idx >= 3;

            return (
              <div
                key={idx}
                className={`group relative flex flex-col justify-between rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-[#0E0E13] to-[#07070A] p-7 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/25 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,82,255,0.08)] ${
                  isWide ? "lg:col-span-1" : ""
                }`}
              >
                {/* Top specular edge highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                <div>
                  {/* Top Bar: Icon + Pill Badge */}
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.06]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0052FF]/15 text-[#0052FF] border border-[#0052FF]/30 shadow-inner group-hover:scale-105 transition-transform">
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <span className="rounded-full border border-[#0052FF]/30 bg-[#0052FF]/10 px-3 py-1 font-mono text-[10px] font-bold tracking-wider text-[#0052FF] uppercase">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title with Italic Serif */}
                  <h3 className="font-display text-[24px] sm:text-[28px] font-bold text-white tracking-tight leading-[1.15]">
                    {item.titleSans} <br />
                    <span className="font-serif italic font-normal text-white">
                      {item.titleSerif}
                    </span>
                  </h3>

                  {/* Description */}
                  <p className="mt-4 text-[15px] leading-relaxed text-[#A1A1AA]">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Metric Stamp */}
                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[12px]">
                  <span className="text-[#71717A] font-medium">Standard</span>
                  <span className="font-display font-bold text-white flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {item.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
