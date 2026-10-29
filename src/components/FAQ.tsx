"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/content/site";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const half = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, half);
  const rightFaqs = faqs.slice(half);

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

  const renderFaqItem = (faq: { q: string; a: string }, actualIdx: number) => {
    const isOpen = openIndex === actualIdx;
    return (
      <div key={actualIdx} className="border-b border-white/[0.08] transition-colors">
        <button
          type="button"
          onClick={() => toggleItem(actualIdx)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between py-4 sm:py-5 text-left group cursor-pointer gap-4"
        >
          <span
            className={`text-[15px] sm:text-[16px] font-normal tracking-tight transition-colors leading-snug ${
              isOpen ? "text-[#4385FF] font-medium" : "text-white/90 group-hover:text-white"
            }`}
          >
            {faq.q}
          </span>
          <span
            className={`shrink-0 flex items-center justify-center text-neutral-400 group-hover:text-white transition-transform duration-200 ${
              isOpen ? "rotate-45 text-[#4385FF]" : ""
            }`}
          >
            <Plus size={16} strokeWidth={1.75} />
          </span>
        </button>

        {isOpen && (
          <div className="pb-5 pt-0 text-[13.5px] sm:text-[14px] leading-relaxed text-[#A1A1AA] animate-in fade-in duration-200">
            {faq.a}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative w-full overflow-hidden bg-[#060608] pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 border-b border-white/[0.06] select-none scroll-mt-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="font-display text-[clamp(40px,5.8vw,80px)] font-extrabold tracking-[-0.035em] text-white leading-[1.02]">
            Frequently Asked <span className="font-serif italic font-normal text-white">Questions</span>
          </h2>

          <p className="mt-4 max-w-[620px] font-sans text-[15px] sm:text-[16px] text-[#A1A1AA] leading-relaxed">
            Everything you need to know about our partnerships, delivery cadence, and strategy.
          </p>
        </div>

        {/* 2-Column Minimalist Defiant-Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-0 items-start">
          <div className="flex flex-col">
            {leftFaqs.map((faq, idx) => renderFaqItem(faq, idx))}
          </div>

          <div className="flex flex-col">
            {rightFaqs.map((faq, idx) => renderFaqItem(faq, half + idx))}
          </div>
        </div>
      </div>
    </section>
  );
}
