import { ArrowUpRight, MessageSquare, Mail, Phone } from "lucide-react";
import { siteMeta } from "@/content/site";

export default function ReadyToScale() {
  return (
    <section
      id="final-cta"
      aria-label="Ready to be chosen"
      className="relative w-full overflow-hidden bg-white pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 select-none"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* High-Contrast Architectural Shell Card */}
        <div className="relative overflow-hidden rounded-[36px] sm:rounded-[44px] bg-[#09090B] px-6 py-16 sm:px-12 sm:py-20 lg:py-24 text-center text-white shadow-2xl">
          {/* Subtle Navy Glow */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-700/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-800/15 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-[760px] flex flex-col items-center">
            {/* Eyebrow */}
            <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-white/15 bg-white/[0.08] px-4">
              <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-white/80 uppercase">
                Free Strategy Call
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-5 font-display text-[34px] sm:text-[50px] lg:text-[64px] font-extrabold leading-[0.96] tracking-tight text-white">
              Ready to be chosen,{" "}
              <span className="font-serif italic font-normal text-blue-400">
                not just seen?
              </span>
            </h2>

            {/* Body */}
            <p className="mt-5 max-w-[620px] text-[16px] sm:text-[18px] lg:text-[19px] leading-relaxed text-[#A1A1AA]">
              Book a free 30-minute strategy call. We’ll review your current marketing and show you what will make the biggest difference first.
            </p>

            {/* Button */}
            <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a
                href="/contact"
                className="inline-flex h-[60px] items-center justify-center gap-2.5 rounded-full bg-white px-8 text-[16px] font-bold text-[#09090B] transition-all hover:bg-neutral-200 active:scale-[0.98]"
              >
                <span>Book a Free Strategy Call</span>
                <ArrowUpRight size={18} className="stroke-[2.5]" />
              </a>

              <a
                href={`https://wa.me/${siteMeta.contact.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[60px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                <MessageSquare size={17} />
                <span>WhatsApp Directly</span>
              </a>
            </div>

            {/* Reply Guarantee & Contact Line */}
            <div className="mt-8 pt-6 border-t border-white/10 text-[13px] sm:text-[14px] text-[#A1A1AA] flex flex-wrap items-center justify-center gap-3">
              <span className="text-white font-medium">{siteMeta.contact.responseTime}</span>
              <span>•</span>
              <a
                href={`mailto:${siteMeta.contact.email}`}
                className="inline-flex items-center gap-1.5 hover:text-white underline-offset-4 hover:underline"
              >
                <Mail size={13} />
                <span>{siteMeta.contact.email}</span>
              </a>
              <span>•</span>
              <a
                href={`tel:${siteMeta.contact.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-1.5 hover:text-white underline-offset-4 hover:underline"
              >
                <Phone size={13} />
                <span>{siteMeta.contact.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
