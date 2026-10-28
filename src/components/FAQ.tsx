"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/content/site";
import { SectionBadge } from "./site/SectionBadge";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section
      id="faq"
      aria-label="Questions Before You Book"
      className="relative w-full overflow-hidden bg-[#060608] pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 border-b border-white/[0.06] select-none scroll-mt-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative mx-auto max-w-[1040px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <SectionBadge>CLARITY FIRST</SectionBadge>

          <h2 className="mt-5 font-display text-[clamp(36px,5.2vw,72px)] font-extrabold tracking-[-0.03em] text-white leading-[1.04] max-w-4xl">
            Questions Before <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-white">You Book</span>
          </h2>

          <p className="mt-5 max-w-[700px] font-sans text-[16px] sm:text-[18px] text-[#A1A1AA] leading-relaxed">
            Everything you need to know about our packages, guarantees, and strategy calls.
          </p>
        </div>

        {/* Accordion list */}
        <div className="mt-12 sm:mt-16 space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0C0C10] transition-all duration-200 hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-6 sm:p-7 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <span className="font-display text-[17px] sm:text-[19px] font-bold text-white pr-4 leading-snug">
                    {faq.q}
                  </span>
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 bg-[#0052FF] text-white border-[#0052FF] shadow-[0_0_12px_rgba(0,82,255,0.5)]"
                        : "group-hover:border-white/20"
                    }`}
                  >
                    <Plus size={16} className="stroke-[2.5]" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-7 pt-2 text-[15px] sm:text-[16px] leading-relaxed text-[#A1A1AA] border-t border-white/[0.05]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
