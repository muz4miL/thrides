import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Target,
  BrainCircuit,
  MessageSquare,
  Users,
} from "lucide-react";
import { siteMeta, teamMembers } from "@/content/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Thrides | Our Team and How We Work" },
      {
        name: "description",
        content:
          "Meet the team behind Thrides and the thinking that guides every project: attention should never be accidental.",
      },
      { property: "og:title", content: "About Thrides | Our Team and How We Work" },
      {
        property: "og:description",
        content:
          "Meet the team behind Thrides and the thinking that guides every project: attention should never be accidental.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B]">
      <Header />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-black/[0.06] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                <Sparkles size={13} className="text-blue-700" />
                <span>Our Philosophy & Background</span>
              </div>

              <h1 className="mt-5 font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#09090B] leading-[1.1]">
                A digital creative agency that believes <br className="hidden sm:inline" />
                <span className="font-serif italic font-normal text-blue-900">
                  attention should never be accidental
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[#52525B] max-w-3xl">
                Three years, 14+ businesses, 8 countries, one idea: marketing works when every move has a purpose.
              </p>
            </div>

            {/* Numbers Metric Strip */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {siteMeta.trustNumbers.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-black/[0.08] bg-[#FAFAFA] p-8 shadow-sm transition-all hover:border-black/20"
                >
                  <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#09090B]">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm sm:text-base font-medium text-[#71717A]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 md:py-28 bg-[#FAFAFA]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#71717A]">
                  Our Story
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#09090B]">
                  Everywhere,{" "}
                  <span className="font-serif italic font-normal text-blue-900">
                    on purpose.
                  </span>
                </h2>
              </div>

              <div className="lg:col-span-7 space-y-6 text-base sm:text-lg leading-relaxed text-[#3F3F46]">
                <p>
                  Most businesses we meet aren’t bad at marketing. They have a good product and real customers waiting, but their brand isn’t where those customers are looking, or it shows up without a reason to be remembered.
                </p>
                <p>
                  <strong className="text-[#09090B]">Thrides exists to fix that.</strong> We put your brand in front of the right people: on your website, on social media, in search, and in their inbox.
                </p>
                <p>
                  Being everywhere is the easy part to promise. Doing it on purpose is the work: researching your market, choosing the right places, and making every appearance count. That’s what we mean by everywhere, on purpose.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What It’s Like to Work With Thrides */}
        <section className="py-20 md:py-28 bg-white border-t border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#71717A]">
                The Experience
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#09090B]">
                What It’s Like to Work With Thrides
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Target,
                  title: "One plan, not scattered services",
                  desc: "Everything we do ties back to your business goals. No random disjointed tasks.",
                },
                {
                  icon: BrainCircuit,
                  title: "Strategy backed by business intelligence",
                  desc: "We research your market, competitors, and customers before we create anything, so your marketing starts with an edge.",
                },
                {
                  icon: MessageSquare,
                  title: "Plain-language reporting",
                  desc: "You’ll always know what’s working and what we’re changing, without buzzwords.",
                },
                {
                  icon: Users,
                  title: "Treated like a guest",
                  desc: "A proper welcome, a clear point of contact, agreed response times, and updates without chasing.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-black/[0.08] bg-[#FAFAFA] p-7 transition-all hover:border-black/20"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white border border-black/[0.08] text-blue-700 shadow-sm mb-6">
                    <item.icon size={22} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#09090B]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#52525B]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-20 md:py-28 bg-[#FAFAFA]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#71717A]">
                Our People
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#09090B]">
                Meet the Team
              </h2>
              <p className="mt-3 text-base text-[#52525B]">
                Senior strategists directing every plan with dedicated execution.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-8 shadow-sm transition-all hover:border-black/25 flex flex-col sm:flex-row gap-6 items-start"
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
                    <h3 className="font-display text-2xl font-bold text-[#09090B]">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mt-1">
                      {member.role}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-[#52525B]">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agency Philosophy / Brand Commitment */}
        <section className="py-16 md:py-20 bg-white border-t border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="rounded-[32px] border border-black/[0.08] bg-[#FAFAFA] p-8 sm:p-12 text-center max-w-3xl mx-auto">
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#71717A]">
                Our Standard
              </span>
              <p className="mt-4 font-serif text-2xl sm:text-3xl italic leading-relaxed text-[#09090B]">
                “Attention should never be accidental. Let’s make yours on purpose.”
              </p>
              <p className="mt-4 text-sm text-[#52525B]">
                Every website, post, campaign, and email we produce is backed by research and built to deliver measurable commercial clarity.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="rounded-[36px] bg-[#09090B] p-8 sm:p-14 text-center text-white">
              <div className="max-w-2xl mx-auto">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
                  Want to see how this could work for your business?
                </h2>
                <p className="mt-4 text-base text-neutral-300">
                  Book a free 30-minute strategy call. We’ll review your current marketing and show you where the biggest opportunities are.
                </p>
                <div className="mt-8 flex justify-center">
                  <a
                    href="/contact"
                    className="inline-flex h-[56px] items-center justify-center gap-2 rounded-full bg-white px-8 text-[15px] font-bold text-[#09090B] transition-transform hover:bg-neutral-200"
                  >
                    <span>Book a Free Strategy Call</span>
                    <ArrowUpRight size={17} className="stroke-[2.5]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
