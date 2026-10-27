import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowUpRight, Sparkles, TrendingUp, Check } from "lucide-react";
import { caseStudies as defaultStudies, serviceCategoryLabels } from "@/content/site";
import { getSiteContentFn } from "@/api/public";

export const Route = createFileRoute("/case-studies/")({
  loader: async () => {
    try {
      const content = await getSiteContentFn();
      if (content?.caseStudies && content.caseStudies.length > 0) {
        return {
          caseStudies: content.caseStudies.filter((cs: any) => cs.isPublished === true),
        };
      }
    } catch (e) {
      // Never substitute unpublished records on DB outage
    }
    return {
      caseStudies: defaultStudies.filter((cs) => cs.isPublished === true),
    };
  },
  head: () => ({
    meta: [
      { title: "Case Studies & Client Proof | Thrides" },
      {
        name: "description",
        content:
          "Explore detailed breakdowns of how Thrides engineered measurable results across market positioning, websites, social content, and search.",
      },
      { property: "og:title", content: "Case Studies | Thrides" },
    ],
  }),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  const { caseStudies } = Route.useLoaderData();
  const displayStudies = caseStudies || [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B]">
      <Header />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="border-b border-black/[0.06] pt-12 pb-16 md:pt-16 md:pb-20 bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                <Sparkles size={13} className="text-blue-700" />
                <span>Client Case Studies</span>
              </div>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#09090B] leading-[1.1]">
                Documented Proof. <br />
                <span className="font-serif italic font-normal text-blue-900">
                  Purpose Behind Every Move.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[#52525B]">
                We measure our work by commercial clarity and disciplined execution across our client partnerships.
              </p>
            </div>
          </div>
        </section>

        {/* Case Studies List */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 space-y-12">
            {displayStudies.length === 0 ? (
              <div className="rounded-[32px] border border-black/[0.08] bg-white p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-sm">
                <div className="inline-flex h-[36px] items-center justify-center rounded-full border border-blue-600/15 bg-blue-50 px-4 mb-4">
                  <span className="font-display text-[12px] font-semibold tracking-[0.16em] text-blue-900 uppercase">
                    Publishing Status
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#09090B]">
                  Client Case Studies in Final Review
                </h2>
                <p className="mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed max-w-xl mx-auto">
                  Over the past 3 years, Thrides has partnered with 14+ businesses across 8 countries. Detailed case studies with client-approved outcomes are being finalized for publication.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <a
                    href="/services"
                    className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#09090B] px-8 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
                  >
                    <span>View All Services & Packages</span>
                    <ArrowUpRight size={16} className="ml-1.5" />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex h-[52px] items-center justify-center rounded-full border border-black/15 bg-[#FAFAFA] px-8 text-sm font-bold text-[#09090B] transition-colors hover:bg-neutral-100"
                  >
                    <span>Request Relevant Samples</span>
                  </a>
                </div>
              </div>
            ) : (
              displayStudies.map((study: any) => (
                <article
                  key={study.slug || study.id}
                  className="overflow-hidden rounded-[32px] border border-black/[0.08] bg-white shadow-sm transition-all duration-300 hover:border-black/25 hover:shadow-md"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
                    {/* Left Content */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="rounded-full bg-blue-50 text-blue-900 border border-blue-200/50 px-3 py-0.5 text-xs font-bold">
                            {study.industry}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                            Client: {study.client}
                          </span>
                        </div>

                        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090B]">
                          <Link
                            to="/case-studies/$slug"
                            params={{ slug: study.slug }}
                            className="hover:text-blue-700 transition-colors"
                          >
                            {study.title}
                          </Link>
                        </h2>

                        <p className="mt-4 text-base leading-relaxed text-[#52525B]">
                          {study.summary || study.challenge}
                        </p>

                        {/* Deliverables tags */}
                        {study.delivered && study.delivered.length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-1.5">
                            {study.delivered.map((del: string, idx: number) => (
                              <span
                                key={idx}
                                className="rounded-md border border-black/10 bg-[#FAFAFA] px-2.5 py-1 text-xs font-medium text-[#3F3F46]"
                              >
                                {del}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action link */}
                      <div className="mt-8 pt-6 border-t border-black/[0.06] flex items-center justify-between">
                        <Link
                          to="/case-studies/$slug"
                          params={{ slug: study.slug }}
                          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
                        >
                          <span>Read Full Case Study</span>
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </div>

                    {/* Right: Key Result Metric Box */}
                    <div className="lg:col-span-5">
                      {study.results && study.results.length > 0 ? (
                        <div className="rounded-3xl bg-[#09090B] p-8 text-white shadow-lg">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">
                            <TrendingUp size={16} className="text-blue-400" />
                            <span>Key Project Metrics</span>
                          </div>
                          <div className="space-y-6">
                            {study.results.map((res: any, idx: number) => (
                              <div key={idx} className="border-l-2 border-blue-500 pl-4">
                                <div className="font-display text-3xl font-extrabold text-white">
                                  {res.metric}
                                </div>
                                <div className="text-sm font-semibold text-neutral-300">
                                  {res.label}
                                </div>
                                {res.context && (
                                  <div className="text-xs text-neutral-400 mt-0.5">{res.context}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100">
                          <img
                            src={study.cover}
                            alt={study.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
