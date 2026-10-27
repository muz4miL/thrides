import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { services, caseStudies } from "@/content/site";

export function ServiceCards() {
  return (
    <section
      id="services"
      aria-label="Our Services"
      className="relative w-full overflow-hidden bg-white pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 select-none border-b border-black/[0.06]"
    >
      {/* 1. Centred Section Introduction */}
      <div className="mx-auto flex max-w-[1040px] flex-col items-center px-4 sm:px-6 text-center">
        <div className="flex h-[40px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-5">
          <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
            Services & Expertise
          </span>
        </div>

        <h2 className="mt-4 sm:mt-6 text-center">
          <span className="block font-display text-[32px] sm:text-[44px] lg:text-[clamp(44px,5.2vw,68px)] font-bold lg:font-extrabold leading-[1] tracking-[-0.045em] text-[#09090B]">
            What’s Inside Every Move
          </span>
        </h2>

        <p className="mt-3 sm:mt-4 max-w-[640px] text-center text-[16px] sm:text-[18px] lg:text-[19px] font-normal leading-[1.4] text-[#52525B]">
          The services that put your brand in front of your customers with deliberate intent.
        </p>
      </div>

      {/* 2. Responsive 6-Service Grid */}
      <div className="mx-auto mt-12 sm:mt-16 max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((svc) => {
            const proof = svc.proofCaseStudyId
              ? caseStudies.find((cs) => cs.id === svc.proofCaseStudyId && cs.isPublished === true)
              : undefined;

            return (
              <div
                key={svc.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-black/[0.08] bg-[#FAFAFA] transition-all duration-200 hover:border-black/25 hover:shadow-lg"
              >
                {/* Visual Header Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3.5 left-3.5 rounded-full bg-black/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
                    {svc.includedIn}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-display text-[22px] sm:text-[24px] font-bold text-[#09090B] tracking-tight">
                      {svc.title}
                    </h3>
                    <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-[#52525B]">
                      {svc.summary}
                    </p>

                    {/* Bullet Highlights */}
                    <ul className="mt-5 space-y-2 border-t border-black/[0.06] pt-4">
                      {svc.bullets.slice(0, 3).map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[13px] text-[#3F3F46]">
                          <CheckCircle2 size={15} className="text-blue-700 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Action */}
                  <div className="mt-6 pt-4 border-t border-black/[0.06] bg-white -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 p-4 sm:px-6 rounded-b-[28px] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        {proof ? "Case Study" : "Deliverable Scope"}
                      </div>
                      <div className="text-[13px] font-bold text-[#09090B] truncate max-w-[200px]">
                        {proof ? proof.client : svc.includedIn.split("·")[0].trim()}
                      </div>
                    </div>
                    {proof ? (
                      <a
                        href={`/case-studies/${proof.slug}`}
                        className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-700 hover:text-blue-900"
                      >
                        <span>View Proof</span>
                        <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <a
                        href="/services"
                        className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-700 hover:text-blue-900"
                      >
                        <span>Full Details</span>
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <a
            href="/services"
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-black bg-white px-8 text-[15px] font-bold text-[#09090B] transition-colors hover:bg-neutral-100"
          >
            <span>Explore All Services & Deliverables</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
