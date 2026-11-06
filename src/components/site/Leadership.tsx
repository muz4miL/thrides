"use client";

import { useEffect, useRef, useState } from "react";
import { SectionBadge } from "./SectionBadge";
import { teamMembers } from "@/content/site";

export function Leadership() {
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
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
      id="leadership"
      aria-label="Executive Leadership Team"
      className="relative w-full overflow-hidden bg-[#060608] pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 border-b border-white/[0.06] select-none scroll-mt-24"
    >
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Header Block matching Defiant */}
        <div className="flex flex-col items-center text-center">
          <SectionBadge>LEADERSHIP</SectionBadge>

          <h2 className="mt-5 font-display text-[clamp(36px,5.2vw,72px)] font-extrabold tracking-[-0.03em] text-white leading-[1.04] max-w-4xl">
            The minds behind <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-white">the machine</span>
          </h2>

          <p className="mt-5 max-w-[760px] font-sans text-[16px] sm:text-[18px] text-[#A1A1AA] leading-relaxed">
            Senior growth practitioners who personally architect strategy and run operations daily. No account managers passing notes to junior contractors.
          </p>
        </div>

        {/* High-End Team Monogram Grid (Matching About Page) */}
        <div
          className={`mt-14 sm:mt-18 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto transition-all duration-700 ease-out ${
            hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {teamMembers.map((member, index) => (
            <article key={member.name} className="group flex flex-col">
              {/* High-End Portrait Image Stage */}
              <div
                style={{
                  background:
                    index % 2 === 0
                      ? "radial-gradient(ellipse at 70% 20%, rgba(30, 59, 128, 0.45) 0%, transparent 65%), #0d0f16"
                      : "radial-gradient(ellipse at 30% 80%, rgba(21, 69, 170, 0.4) 0%, transparent 70%), #0d0f16",
                }}
                className="relative aspect-[4/5] max-h-[480px] w-full overflow-hidden rounded-2xl border border-white/[0.09] flex items-center justify-center isolate group-hover:border-white/20 transition-all duration-500 shadow-2xl bg-[#0c1018]"
              >
                {member.image ? (
                  <>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                    />
                  </>
                ) : (
                  <>
                    {/* Giant Monogram Fallback */}
                    <strong className="font-display font-medium text-[#b8cdff] text-[clamp(80px,13vw,160px)] tracking-[-0.07em] group-hover:-translate-y-1.5 transition-transform duration-500 select-none">
                      {member.initials}
                    </strong>
                  </>
                )}

                {/* Top-right Index Badge (doesn't cut into forehead) */}
                <span className="absolute right-4 top-4 font-mono text-[9.5px] font-bold tracking-[0.18em] text-[#C3D4FF] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 z-10">
                  THRIDES / 0{index + 1}
                </span>

                {/* Bottom-left discreet pill */}
                <span className="absolute left-4 bottom-4 font-mono text-[9px] font-bold tracking-[0.18em] text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 z-10">
                  PARTNER
                </span>
              </div>

              {/* Person Info */}
              <div className="pt-6">
                <h3 className="font-display text-[28px] sm:text-[34px] font-semibold text-white tracking-tight">
                  {member.name}
                </h3>
                <p className="font-mono text-[10.5px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-[#82a7ff] mt-2 mb-3.5">
                  {member.role}
                </p>
                <p className="text-sm sm:text-[15px] leading-[1.8] text-[#A1A1AA] max-w-[480px]">
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
