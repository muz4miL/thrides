import { Quote, Sparkles } from "lucide-react";
import { caseStudies } from "@/content/site";
import { SectionBadge } from "./SectionBadge";

const STAT_CALLOUTS = [
  { metric: "+52%", label: "REVENUE GROWTH (YEAR ON YEAR)" },
  { metric: "+43%", label: "INCREASE IN CVR (YEAR ON YEAR)" },
  { metric: "14+", label: "CONSECUTIVE RECORD REVENUE MONTHS" },
];

export function TestimonialsSection() {
  const testimonials = caseStudies
    .filter((cs) => cs.isPublished === true && cs.testimonialQuote)
    .slice(0, 3)
    .map((cs, idx) => ({
      quote: cs.testimonialQuote!,
      clientName: cs.testimonialAuthor || cs.client,
      clientTitle: cs.testimonialRole || cs.industry,
      companyName: cs.client,
      stat: STAT_CALLOUTS[idx % STAT_CALLOUTS.length],
    }));

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      aria-label="Client Feedback & Endorsements"
      className="relative w-full overflow-hidden bg-[#060608] pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 select-none border-b border-white/[0.06] scroll-mt-24"
    >
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <SectionBadge>CLIENT FEEDBACK</SectionBadge>

          <h2 className="mt-5 font-display text-[clamp(36px,5.2vw,72px)] font-extrabold tracking-[-0.03em] text-white leading-[1.04] max-w-4xl">
            Hear from our <span className="font-serif italic font-normal text-white">Clients</span>
          </h2>

          <p className="mt-5 max-w-[760px] font-sans text-[16px] sm:text-[18px] text-[#A1A1AA] leading-relaxed">
            Real founders and marketing leaders sharing their experience scaling with Thrides.
          </p>
        </div>

        {/* 3 Structured Dark Obsidian Cards */}
        <div className="mt-14 sm:mt-18 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-[28px] border border-white/[0.08] bg-[#0C0C10] p-7 sm:p-8 transition-all duration-300 hover:border-white/20 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] shadow-2xl"
            >
              {/* Top specular highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
              />

              <div>
                <Quote size={24} className="text-[#0052FF] mb-5 opacity-80" />
                <p className="font-serif text-[18px] sm:text-[20px] italic leading-relaxed text-white/95">
                  “{t.quote}”
                </p>

                {/* Growth Metric Badge */}
                <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
                  <span className="font-display text-xl font-black text-emerald-400 block">
                    {t.stat.metric}
                  </span>
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-neutral-400 uppercase mt-0.5 block">
                    {t.stat.label}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[16px] font-bold text-white">
                    {t.clientName}
                  </h3>
                  <p className="text-[13px] text-[#A1A1AA]">
                    {t.clientTitle}
                  </p>
                </div>
                <div className="rounded-full bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/30 px-3 py-1 text-[11px] font-bold tracking-wide">
                  {t.companyName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
