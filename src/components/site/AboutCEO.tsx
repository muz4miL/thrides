import { CheckCircle2, ShieldCheck } from "lucide-react";
import { onPurposeMethod, whatYouCanCountOn, teamMembers } from "@/content/site";

export function AboutCEO() {
  return (
    <section
      id="method-and-team"
      aria-label="The On-Purpose Method & Leadership Team"
      className="relative w-full overflow-hidden bg-[#FAFAFA] pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 border-t border-b border-black/[0.06] select-none"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* ========================================================
            PART 1: The On-Purpose Method
           ======================================================== */}
        <div className="max-w-[760px]">
          <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-4">
            <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
              How We Work
            </span>
          </div>

          <h2 className="mt-4 font-display text-[32px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.02] tracking-tight text-[#09090B]">
            The intent behind{" "}
            <span className="font-serif italic font-normal text-[#18181B]">
              every move
            </span>
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#52525B]">
            Four deliberate stages from market discovery to measurable revenue impact.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {onPurposeMethod.map((item) => (
            <div
              key={item.step}
              className="relative rounded-[26px] border border-black/[0.08] bg-white p-7 shadow-sm transition-all duration-200 hover:border-black/25 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="font-display text-2xl font-black text-blue-700">
                  {item.step}
                </span>
                <h3 className="mt-3 font-display text-[21px] font-bold text-[#09090B]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-[#52525B]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================
            PART 2: What You Can Count On (Guarantees)
           ======================================================== */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-black/[0.08]">
          <div className="max-w-[760px]">
            <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-blue-600/15 bg-blue-50 px-4">
              <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-blue-900 uppercase flex items-center gap-1.5">
                <ShieldCheck size={14} />
                <span>Our Commitments</span>
              </span>
            </div>

            <h3 className="mt-4 font-display text-[28px] sm:text-[38px] lg:text-[46px] font-extrabold leading-[1.05] tracking-tight text-[#09090B]">
              What you can{" "}
              <span className="font-serif italic font-normal text-blue-800">
                count on
              </span>
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatYouCanCountOn.map((guarantee, idx) => (
              <div
                key={idx}
                className="rounded-[24px] border border-black/[0.08] bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-blue-700 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-display text-[17px] font-bold text-[#09090B]">
                      {guarantee.title}
                    </h4>
                    <p className="mt-2 text-[14px] leading-relaxed text-[#52525B]">
                      {guarantee.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            PART 3: Meet the Team (Mamoon & Jidran)
           ======================================================== */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-black/[0.08]">
          <div className="max-w-[760px]">
            <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-4">
              <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
                Leadership
              </span>
            </div>

            <h3 className="mt-4 font-display text-[28px] sm:text-[38px] lg:text-[46px] font-extrabold leading-[1.05] tracking-tight text-[#09090B]">
              Meet the{" "}
              <span className="font-serif italic font-normal text-[#18181B]">
                Team
              </span>
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-6 items-start rounded-[28px] border border-black/[0.08] bg-white p-7 shadow-sm transition-all hover:border-black/25"
              >
                <div className="relative aspect-square w-24 sm:w-28 shrink-0 overflow-hidden rounded-2xl bg-[#09090B] flex flex-col items-center justify-center text-white shadow-sm border border-black/10">
                  <span className="font-display text-4xl font-extrabold tracking-tight text-white select-none">
                    {member.initials}
                  </span>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-neutral-400 select-none">
                    Thrides
                  </span>
                </div>

                <div className="flex flex-col justify-center">
                  <h4 className="font-display text-[22px] font-bold text-[#09090B]">
                    {member.name}
                  </h4>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mt-0.5">
                    {member.role}
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#52525B]">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
