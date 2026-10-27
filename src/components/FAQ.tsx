import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/content/site";

export default function FAQ() {
  // All accordion items collapsed on initial page load as required by brief
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
      className="relative w-full overflow-hidden bg-[#FAFAFA] pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 border-t border-b border-black/[0.06] select-none"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1040px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-4 mb-4">
            <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
              Clarity First
            </span>
          </div>

          <h2 className="font-display text-[32px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.02] tracking-tight text-[#09090B]">
            Questions Before You Book
          </h2>
          <p className="mt-3 text-[16px] text-[#52525B]">
            Everything you need to know about our packages, guarantees, and strategy calls.
          </p>
        </div>

        {/* Accordion list */}
        <div className="mt-10 sm:mt-12 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white transition-colors duration-150"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-neutral-50"
                >
                  <span className="font-display text-[16px] sm:text-[18px] font-bold text-[#09090B] pr-4">
                    {faq.q}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10 bg-[#FAFAFA] text-[#09090B] transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <Plus size={16} className="stroke-[2.5]" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-[15px] sm:text-[16px] leading-relaxed text-[#52525B] border-t border-black/[0.04]">
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
