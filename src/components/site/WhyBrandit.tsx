import { ArrowUpRight } from "lucide-react";

export function WhyBrandit() {
  const brandPillars = [
    {
      channel: "Your Website",
      desc: "The place every visitor decides whether to trust you. Built to turn visits into enquiries.",
      number: "01",
    },
    {
      channel: "Your Social Media",
      desc: "Content that gets noticed and builds trust before the first conversation.",
      number: "02",
    },
    {
      channel: "Search Results",
      desc: "Be the business people find when they search for what you sell.",
      number: "03",
    },
    {
      channel: "Their Inbox",
      desc: "Stay in front of past customers and warm leads, and earn repeat business.",
      number: "04",
    },
    {
      channel: "Your Strategy",
      desc: "The research and roadmap behind all of it, so nothing is a guess.",
      number: "05",
    },
  ];

  return (
    <section
      id="belief"
      aria-label="What We Believe & Where Your Brand Shows Up"
      className="relative w-full overflow-hidden bg-white pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 select-none border-b border-black/[0.06]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Part 1: What We Believe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-black/10 bg-black/[0.04] px-4">
              <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-[#3F3F46] uppercase">
                What We Believe
              </span>
            </div>

            <h2 className="mt-4 font-display text-[32px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.02] tracking-tight text-[#09090B]">
              Attention should never be{" "}
              <span className="font-serif italic font-normal text-[#18181B]">
                accidental
              </span>
            </h2>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center pt-2">
            <p className="text-[17px] sm:text-[19px] lg:text-[20px] leading-relaxed text-[#3F3F46] font-medium">
              Anyone can show up everywhere. The hard part is showing up in the right places, with the right message, for a reason you can explain.
            </p>
            <p className="mt-4 text-[16px] sm:text-[17px] leading-relaxed text-[#71717A]">
              That’s the work we do. <strong className="font-semibold text-[#09090B]">Thrides</strong> is a digital creative agency that makes your brand impossible to miss and easy to choose.
            </p>
          </div>
        </div>

        {/* Part 2: Where Your Brand Shows Up */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-black/[0.08]">
          <div className="max-w-[700px]">
            <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-blue-600/15 bg-blue-50 px-4">
              <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-blue-900 uppercase">
                Presence With Purpose
              </span>
            </div>

            <h3 className="mt-4 font-display text-[28px] sm:text-[38px] lg:text-[46px] font-extrabold leading-[1.05] tracking-tight text-[#09090B]">
              Be found. Be trusted.{" "}
              <span className="font-serif italic font-normal text-blue-800">
                Be chosen.
              </span>
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandPillars.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-[26px] border border-black/[0.08] bg-[#FAFAFA] p-7 transition-all duration-200 hover:border-black/25 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      {item.number}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-blue-700" />
                  </div>
                  <h4 className="mt-4 font-display text-[21px] font-bold text-[#09090B]">
                    {item.channel}
                  </h4>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[#52525B]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Final CTA Card in the grid */}
            <div className="relative rounded-[26px] border border-black bg-[#09090B] p-7 text-white flex flex-col justify-between shadow-sm">
              <div>
                <span className="font-display text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Ready?
                </span>
                <h4 className="mt-4 font-display text-[21px] font-bold text-white">
                  Start with a clear roadmap
                </h4>
                <p className="mt-2.5 text-[15px] leading-relaxed text-neutral-300">
                  Book a free 30-minute call. You leave with clear recommendations.
                </p>
              </div>
              <a
                href="/contact"
                className="mt-6 inline-flex items-center justify-between rounded-full bg-white px-5 py-3 text-sm font-bold text-[#09090B] transition-colors hover:bg-neutral-200"
              >
                <span>Book Free Call</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
