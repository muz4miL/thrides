import { Quote } from "lucide-react";
import { caseStudies } from "@/content/site";

export function TestimonialsSection() {
  const testimonials = caseStudies
    .filter((cs) => cs.isPublished === true && cs.testimonialQuote)
    .slice(0, 3)
    .map((cs) => ({
      quote: cs.testimonialQuote!,
      clientName: cs.testimonialAuthor || cs.client,
      clientTitle: cs.testimonialRole || cs.industry,
      companyName: cs.client,
    }));

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Client Feedback & Endorsements"
      className="relative w-full overflow-hidden bg-white pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 select-none border-b border-black/[0.06]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="max-w-[700px]">
          <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-4">
            <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
              Client Feedback
            </span>
          </div>

          <h2 className="mt-4 font-display text-[32px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.02] tracking-tight text-[#09090B]">
            Hear from{" "}
            <span className="font-serif italic font-normal text-[#18181B]">
              Clients
            </span>
          </h2>
        </div>

        {/* 3 Structured Cards */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-[26px] border border-black/[0.08] bg-[#FAFAFA] p-7 sm:p-8 transition-all duration-200 hover:border-black/25 hover:shadow-md"
            >
              <div>
                <Quote size={24} className="text-blue-700 mb-4 opacity-70" />
                <p className="font-serif text-[17px] sm:text-[18px] italic leading-relaxed text-[#09090B]">
                  “{t.quote}”
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-black/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#09090B]">
                    {t.clientName}
                  </h3>
                  <p className="text-[12px] text-[#71717A]">
                    {t.clientTitle}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 text-blue-900 border border-blue-100 px-2.5 py-1 text-[11px] font-semibold">
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
