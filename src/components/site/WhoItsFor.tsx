import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { packages } from "@/content/site";

export function WhoItsFor() {
  return (
    <section
      id="packages-overview"
      aria-label="Packages Overview"
      className="relative w-full overflow-hidden bg-[#FAFAFA] pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 border-t border-b border-black/[0.06] select-none"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Eyebrow and Heading */}
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
          <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-4">
            <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
              Packages
            </span>
          </div>

          <h2 className="mt-4 font-display text-[32px] sm:text-[44px] lg:text-[54px] font-extrabold leading-[1.02] tracking-tight text-[#09090B]">
            Choose how you{" "}
            <span className="font-serif italic font-normal text-[#18181B]">
              want to grow
            </span>
          </h2>

          <p className="mt-4 text-[16px] sm:text-[18px] text-[#52525B] max-w-[620px]">
            Start with a package, not a guess. We match your marketing to where your business is today.
          </p>
        </div>

        {/* 3 Packages Cards Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col justify-between rounded-[30px] border p-8 sm:p-9 transition-all duration-200 ${
                pkg.isPopular
                  ? "border-blue-600 bg-white shadow-xl ring-2 ring-blue-600/20"
                  : "border-black/[0.08] bg-white shadow-sm hover:border-black/25 hover:shadow-md"
              }`}
            >
              {/* Badge if Popular */}
              {pkg.badge && (
                <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  <Sparkles size={12} />
                  <span>{pkg.badge}</span>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#71717A]">
                  {pkg.tagline}
                </p>
                <h3 className="mt-2 font-display text-[28px] sm:text-[32px] font-bold text-[#09090B]">
                  {pkg.name}
                </h3>
                <p className="mt-3 text-[15px] font-medium leading-snug text-[#27272A]">
                  {pkg.heading}
                </p>

                {/* Problem Box */}
                <div className="mt-5 rounded-2xl bg-[#FAFAFA] border border-black/[0.05] p-4 text-[13px] text-[#52525B]">
                  <span className="font-semibold text-[#09090B]">The problem:</span> {pkg.theProblem}
                </div>

                {/* Key Deliverables Highlights */}
                <div className="mt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                    What you get:
                  </span>
                  <ul className="mt-3 space-y-2.5">
                    {pkg.deliverables.slice(0, 4).map((del, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[#3F3F46]">
                        <Check size={16} className="text-blue-700 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </li>
                    ))}
                    {pkg.deliverables.length > 4 && (
                      <li className="text-[13px] text-[#71717A] pl-6 font-medium">
                        + {pkg.deliverables.length - 4} more deliverables
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Timeline & Action */}
              <div className="mt-8 pt-6 border-t border-black/[0.08]">
                <div className="flex items-center justify-between text-xs text-[#71717A] mb-4">
                  <span>Timeline: {pkg.timeline}</span>
                  <span className="font-semibold text-[#09090B]">{pkg.investment}</span>
                </div>

                <a
                  href={`/contact?package=${pkg.id}`}
                  className={`inline-flex w-full h-[52px] items-center justify-center gap-2 rounded-full font-bold text-[15px] transition-all ${
                    pkg.isPopular
                      ? "bg-blue-700 text-white hover:bg-blue-800 shadow-md shadow-blue-700/20"
                      : "bg-[#09090B] text-white hover:bg-neutral-800"
                  }`}
                >
                  <span>{pkg.ctaText}</span>
                  <ArrowUpRight size={16} className="stroke-[2.5]" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Link and Free Call Recommendation */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-white border border-black/[0.08] p-6 sm:p-8">
          <div>
            <h4 className="font-display text-[18px] sm:text-[20px] font-bold text-[#09090B]">
              Not sure which fits?
            </h4>
            <p className="text-[14px] sm:text-[15px] text-[#52525B] mt-0.5">
              We’ll review your business and recommend the right starting point on a free 30-minute call.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <a
              href="/services#packages"
              className="inline-flex h-[46px] items-center gap-1.5 text-[15px] font-semibold text-[#09090B] underline-offset-4 hover:underline py-1 px-2"
            >
              <span>Compare All Packages</span>
              <span aria-hidden="true">→</span>
            </a>

            <a
              href="/contact"
              className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#09090B] px-6 text-[14px] font-bold text-white transition-colors hover:bg-neutral-800"
            >
              Book a Free Strategy Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
