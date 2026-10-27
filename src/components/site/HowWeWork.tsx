import { useEffect, useRef, useState } from "react";
import { SectionBadge } from "./SectionBadge";
import { ArrowUpRight, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

export function HowWeWork() {
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
      id="how-we-work"
      aria-label="How We Work & Growth Methodology"
      className="relative w-full overflow-hidden bg-[#060608] pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 border-t border-b border-white/[0.06] select-none scroll-mt-24"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#0052FF]/[0.04] blur-[140px] rounded-full"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Header Block matching Defiant */}
        <div className="flex flex-col items-center text-center">
          <SectionBadge>HOW WE WORK</SectionBadge>

          <h2 className="mt-5 font-display text-[clamp(36px,5.2vw,72px)] font-extrabold tracking-[-0.03em] text-white leading-[1.04] max-w-4xl">
            Scaling your brand <br className="hidden sm:inline" />
            goes <span className="font-serif italic font-normal text-white">so much deeper</span> than just “winning ads”
          </h2>

          <p className="mt-5 max-w-[760px] font-sans text-[16px] sm:text-[18px] text-[#A1A1AA] leading-relaxed">
            Real profit-driven scale requires more than disconnected creatives. You need an execution partner that operates at every level—from daily data attribution to high-converting creative engines—to unlock the next stage of growth.
          </p>
        </div>

        {/* 6 High-End Defiant-Style Cards Grid */}
        <div
          className={`mt-14 sm:mt-18 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 transition-all duration-700 ease-out ${
            hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* CARD 1: Daily Performance Tracking */}
          <div className="group relative flex flex-col justify-between rounded-[28px] border border-white/[0.08] bg-[#0C0C10] p-7 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div>
              <h3 className="font-display text-[26px] sm:text-[30px] font-bold text-white tracking-tight leading-[1.1]">
                Daily Performance <br />
                <span className="font-serif italic font-normal text-white">Tracking</span>
              </h3>
              <p className="mt-3.5 text-[15px] leading-relaxed text-[#A1A1AA]">
                We work together to set the north-star metrics that will drive real profit for your brand, then track them daily on custom live dashboards for total visibility.
              </p>
            </div>

            {/* Mockup 1: Live Performance Tracker Spreadsheet */}
            <div className="mt-8 pt-4 border-t border-white/[0.06]">
              <div className="rounded-xl border border-white/10 bg-[#07070A] p-3.5 shadow-inner">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono font-semibold tracking-wider text-neutral-300 uppercase">
                      thrides. Live Tracker
                    </span>
                  </div>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    +142% Target
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center px-2 py-1.5 rounded bg-white/[0.03] text-neutral-300">
                    <span className="text-white font-medium">Meta Ads Scale</span>
                    <span className="text-neutral-400">$12,450 spend</span>
                    <span className="text-emerald-400 font-bold">5.5x ROAS</span>
                  </div>
                  <div className="flex justify-between items-center px-2 py-1.5 rounded text-neutral-400">
                    <span>Google Search</span>
                    <span>$8,200 spend</span>
                    <span className="text-white font-semibold">4.8x ROAS</span>
                  </div>
                  <div className="flex justify-between items-center px-2 py-1.5 rounded text-neutral-400">
                    <span>Email & SMS Flows</span>
                    <span>$1,400 spend</span>
                    <span className="text-emerald-400 font-bold">16.0x ROAS</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#71717A]">
                  <span>Blended Growth</span>
                  <span className="text-white font-bold">5.48x Blended ROAS</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Full-Funnel Ownership */}
          <div className="group relative flex flex-col justify-between rounded-[28px] border border-white/[0.08] bg-[#0C0C10] p-7 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div>
              <h3 className="font-display text-[26px] sm:text-[30px] font-bold text-white tracking-tight leading-[1.1]">
                Full-Funnel <br />
                <span className="font-serif italic font-normal text-white">Ownership</span>
              </h3>
              <p className="mt-3.5 text-[15px] leading-relaxed text-[#A1A1AA]">
                From first impression to checkout retention, we optimize your full growth engine. That means landing pages, CRO, high-converting offers, and email flows.
              </p>
            </div>

            {/* Mockup 2: Full-Funnel CRO Browser Window */}
            <div className="mt-8 pt-4 border-t border-white/[0.06]">
              <div className="rounded-xl border border-white/10 bg-[#07070A] p-3.5 shadow-inner">
                {/* Browser top bar */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500/80" />
                    <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    thrides.com/convert/funnel-v3
                  </span>
                </div>

                {/* Funnel bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                      <span>Ad Impressions</span>
                      <span className="text-white font-semibold">420K (100%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-neutral-400 rounded-full w-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                      <span>Landing Page Visitors</span>
                      <span className="text-white font-semibold">38.6K (9.2% CTR)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full w-[65%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                      <span>Completed Purchases</span>
                      <span className="text-emerald-400 font-bold">2,140 (33.8% CVR)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[45%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: Creative Volume & Diversity */}
          <div className="group relative flex flex-col justify-between rounded-[28px] border border-white/[0.08] bg-[#0C0C10] p-7 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div>
              <h3 className="font-display text-[26px] sm:text-[30px] font-bold text-white tracking-tight leading-[1.1]">
                Creative Volume <br />
                <span className="font-serif italic font-normal text-white">&amp; diversity</span>
              </h3>
              <p className="mt-3.5 text-[15px] leading-relaxed text-[#A1A1AA]">
                We build creative systems that generate constant winning ads across UGC, statics, and motion. Every concept starts with market insights and ends with profitable scale.
              </p>
            </div>

            {/* Mockup 3: Dual iPhone Creative Ad Cards */}
            <div className="mt-8 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-center gap-3">
                {/* Phone 1 */}
                <div className="relative w-28 rounded-2xl border border-white/15 bg-gradient-to-b from-[#181820] to-[#0A0A0E] p-2 shadow-lg">
                  <div className="aspect-[9/14] rounded-xl bg-[#0052FF]/20 border border-[#0052FF]/30 flex flex-col items-center justify-between p-2 text-center">
                    <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                      5.6x ROAS
                    </span>
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px]">
                      ▶
                    </div>
                    <span className="text-[9px] text-white/90 font-medium leading-tight">
                      UGC Video Hook
                    </span>
                  </div>
                </div>

                {/* Phone 2 */}
                <div className="relative w-28 rounded-2xl border border-white/15 bg-gradient-to-b from-[#181820] to-[#0A0A0E] p-2 shadow-lg -mt-3">
                  <div className="aspect-[9/14] rounded-xl bg-purple-500/20 border border-purple-500/30 flex flex-col items-center justify-between p-2 text-center">
                    <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-purple-300">
                      Top Static
                    </span>
                    <span className="text-xs">✨</span>
                    <span className="text-[9px] text-white/90 font-medium leading-tight">
                      High-CTR Carousel
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: Retention & Lifetime Value */}
          <div className="group relative flex flex-col justify-between rounded-[28px] border border-white/[0.08] bg-[#0C0C10] p-7 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div>
              <h3 className="font-display text-[26px] sm:text-[30px] font-bold text-white tracking-tight leading-[1.1]">
                Retention <br />
                <span className="font-serif italic font-normal text-white">&amp; lifetime value</span>
              </h3>
              <p className="mt-3.5 text-[15px] leading-relaxed text-[#A1A1AA]">
                We turn one-time buyers into loyal repeat customers through automated email and SMS flows that build lasting affinity and drive recurring revenue.
              </p>
            </div>

            {/* Mockup 4: Stacked Postcards / VIP flows */}
            <div className="mt-8 pt-4 border-t border-white/[0.06]">
              <div className="relative h-28 flex items-center justify-center">
                {/* Back card */}
                <div className="absolute top-2 w-[85%] rounded-xl border border-white/10 bg-[#16161E] p-3 shadow-md transform rotate-2">
                  <div className="flex justify-between items-center text-[10px] text-neutral-400">
                    <span>SMS Re-Engagement</span>
                    <span className="text-emerald-400 font-bold">+28% Repeat CVR</span>
                  </div>
                </div>
                {/* Front card */}
                <div className="absolute top-7 w-[92%] rounded-xl border border-white/15 bg-gradient-to-r from-[#1E1E28] to-[#121218] p-3 shadow-xl transform -rotate-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-white">VIP Automated Flow</p>
                      <p className="text-[10px] text-neutral-400">48.2% Open Rate • Klaviyo Sync</p>
                    </div>
                    <span className="rounded-full bg-[#0052FF]/20 px-2.5 py-1 text-[10px] font-bold text-[#0052FF] border border-[#0052FF]/30">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 5: Blended Attribution */}
          <div className="group relative flex flex-col justify-between rounded-[28px] border border-white/[0.08] bg-[#0C0C10] p-7 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div>
              <h3 className="font-display text-[26px] sm:text-[30px] font-bold text-white tracking-tight leading-[1.1]">
                Blended <br />
                <span className="font-serif italic font-normal text-white">Attribution</span>
              </h3>
              <p className="mt-3.5 text-[15px] leading-relaxed text-[#A1A1AA]">
                We unify Meta, Google, TikTok, and retention channels into one clear view so you always know what is performing and exactly where to scale.
              </p>
            </div>

            {/* Mockup 5: Attribution Breakdown Widgets */}
            <div className="mt-8 pt-4 border-t border-white/[0.06]">
              <div className="rounded-xl border border-white/10 bg-[#07070A] p-3.5 shadow-inner">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg bg-white/[0.04] p-2 border border-white/[0.05]">
                    <span className="text-neutral-400 block text-[10px]">Google Spend</span>
                    <span className="text-white font-bold">$18,400</span>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] p-2 border border-white/[0.05]">
                    <span className="text-neutral-400 block text-[10px]">Meta Spend</span>
                    <span className="text-white font-bold">$34,200</span>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] p-2 border border-white/[0.05]">
                    <span className="text-neutral-400 block text-[10px]">Blended ROAS</span>
                    <span className="text-emerald-400 font-bold">5.4x Avg</span>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] p-2 border border-white/[0.05]">
                    <span className="text-neutral-400 block text-[10px]">Net Margin</span>
                    <span className="text-[#0052FF] font-bold">+38% Scale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 6: Profit-First Strategy */}
          <div className="group relative flex flex-col justify-between rounded-[28px] border border-white/[0.08] bg-[#0C0C10] p-7 sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div>
              <h3 className="font-display text-[26px] sm:text-[30px] font-bold text-white tracking-tight leading-[1.1]">
                Profit-first <br />
                <span className="font-serif italic font-normal text-white">Strategy</span>
              </h3>
              <p className="mt-3.5 text-[15px] leading-relaxed text-[#A1A1AA]">
                We align strategy and ad spend around one core outcome — profitable scale. Every single dollar tracked to contribution margin.
              </p>
            </div>

            {/* Mockup 6: iPhone Push Notification Card */}
            <div className="mt-8 pt-4 border-t border-white/[0.06]">
              <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-[#181822] to-[#0A0A0F] p-3.5 shadow-2xl">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 pb-2 mb-2 border-b border-white/[0.06]">
                  <span>21:45</span>
                  <div className="flex items-center gap-1.5">
                    <span>LTE 5G</span>
                    <span>🔋 100%</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0052FF] text-white font-black text-xs shadow-md">
                    t.
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                        THRIDES
                      </span>
                      <span className="text-[10px] text-neutral-400">1h ago</span>
                    </div>
                    <p className="text-[12px] font-semibold text-white mt-0.5">
                      Your ad campaign reached 5.6x ROI
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      An increase of 149% in 30 Days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Defiant-Style Bottom Glowing Pill CTA */}
        <div className="mt-14 sm:mt-18 flex justify-center">
          <a
            href="#enquiry"
            className="group relative inline-flex items-center gap-3.5 rounded-full border border-[#0052FF]/60 bg-gradient-to-b from-[#111116] to-[#050508] px-8 sm:px-10 py-4 shadow-[0_0_35px_rgba(0,82,255,0.35)] transition-all duration-300 hover:scale-105 hover:border-[#0052FF] hover:shadow-[0_0_55px_rgba(0,82,255,0.6)]"
          >
            <span className="font-display text-[15px] sm:text-[17px] font-bold text-white tracking-wide">
              Book a
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0052FF] text-white text-[12px] font-black shadow-[0_0_12px_#0052FF]">
              t.
            </span>
            <span className="font-display text-[15px] sm:text-[17px] font-bold text-white tracking-wide">
              Growth Audit
            </span>
            <ArrowUpRight
              size={18}
              className="text-[#0052FF] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
