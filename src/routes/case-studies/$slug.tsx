import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, ArrowUpRight, Check, Quote, TrendingUp } from "lucide-react";
import { getCaseStudyBySlugFn } from "@/api/public";
import { getCaseStudy, caseStudies, serviceCategoryLabels } from "@/content/site";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: async ({ params }) => {
    let study = null;
    try {
      study = await getCaseStudyBySlugFn({ data: params.slug });
    } catch (e) {
      // Database outage must never substitute unpublished records
    }

    if (!study) {
      study = getCaseStudy(params.slug);
    }

    if (!study || !study.isPublished) {
      throw notFound();
    }

    return { study };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.study
      ? `${loaderData.study.client} Case Study | Thrides`
      : "Case Study | Thrides";
    const description =
      loaderData?.study?.summary ||
      `How Thrides engineered purposeful marketing for ${loaderData?.study?.client || "our client"}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CaseStudyDetailPage,
});

function CaseStudyDetailPage() {
  const { study } = Route.useLoaderData();

  // Find related projects excluding current - strictly published only
  const relatedProjects = caseStudies
    .filter((cs) => cs.slug !== study.slug && cs.isPublished === true)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B]">
      <Header />

      <main className="flex flex-col">
        {/* Breadcrumb & Navigation */}
        <div className="border-b border-black/[0.06] bg-white py-4">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 flex items-center justify-between">
            <Link
              to="/our-work"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#52525B] transition-colors hover:text-black"
            >
              <ArrowLeft size={14} />
              <span>Back to all Work</span>
            </Link>
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
              {study.industry}
            </span>
          </div>
        </div>

        {/* Title Header */}
        <section className="border-b border-black/[0.06] pt-12 pb-16 md:pt-16 md:pb-20 bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#09090B]">
                <span>Client: {study.client}</span>
              </div>
              <h1 className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#09090B] leading-[1.15]">
                {study.title}
              </h1>
              {study.summary && (
                <p className="mt-4 text-lg sm:text-xl leading-relaxed text-[#52525B]">
                  {study.summary}
                </p>
              )}

              {/* Service categories */}
              {study.categories && study.categories.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {study.categories.map((cat: any, i: number) => (
                    <span
                      key={i}
                      className="rounded-full bg-blue-50 text-blue-900 border border-blue-200/50 px-3 py-1 text-xs font-semibold"
                    >
                      {serviceCategoryLabels[cat] || cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Impact Metric Bar */}
            {study.results && study.results.length > 0 && (
              <div className="mt-12 rounded-3xl bg-[#09090B] p-6 sm:p-10 text-white shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">
                  <TrendingUp size={16} className="text-blue-400" />
                  <span>Key Project Metrics</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {study.results.map((res: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-blue-500 pl-4">
                      <div className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                        {res.metric}
                      </div>
                      <div className="mt-1 text-xs sm:text-sm font-semibold text-neutral-200">
                        {res.label}
                      </div>
                      {res.context && (
                        <div className="mt-1 text-xs text-neutral-400">{res.context}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Media Gallery / Cover */}
        {study.cover && (
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 mt-10">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[32px] bg-neutral-100 shadow-md">
              <img
                src={study.cover}
                alt={study.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Narrative */}
              <div className="lg:col-span-8 space-y-12">
                {/* The Challenge / Brief */}
                {study.challenge && (
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#09090B]">
                      The Starting Brief & Challenge
                    </h2>
                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#52525B]">
                      {study.challenge}
                    </p>
                  </div>
                )}

                {/* Work Delivered */}
                {study.delivered && study.delivered.length > 0 && (
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#09090B]">
                      The Strategy & Work Delivered
                    </h2>
                    <ul className="mt-5 space-y-3">
                      {study.delivered.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-700 text-white text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-base text-[#3F3F46] leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Testimonial Quote */}
                {study.testimonialQuote && (
                  <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
                    <Quote size={28} className="text-blue-700" />
                    <p className="mt-4 text-lg italic text-[#09090B] leading-relaxed font-serif">
                      “{study.testimonialQuote}”
                    </p>
                    {study.testimonialAuthor && (
                      <div className="mt-4 pt-4 border-t border-black/[0.06]">
                        <p className="font-display font-bold text-[#09090B]">
                          {study.testimonialAuthor}
                        </p>
                        <p className="text-xs text-[#71717A]">{study.testimonialRole}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar Specs & Deliverables */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm">
                  <h3 className="font-display text-base font-bold uppercase tracking-wider text-[#71717A]">
                    Key Deliverables
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {(study.delivered || []).map((del: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check size={16} className="text-blue-700 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-[#3F3F46]">{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Consultation Card */}
                <div className="rounded-2xl bg-[#09090B] p-6 text-white shadow-md">
                  <h3 className="font-display text-lg font-bold">Need Similar Results?</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                    We will review your current marketing and recommend the package that makes the biggest difference first.
                  </p>
                  <a
                    href="/contact"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-xs font-bold text-[#09090B] transition-all hover:bg-neutral-200"
                  >
                    <span>Book a Free Strategy Call</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Case Studies */}
        {relatedProjects.length > 0 && (
          <section className="py-16 border-t border-black/[0.06] bg-white">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
              <h3 className="font-display text-2xl font-bold text-[#09090B] mb-8">
                Explore More Client Proof
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedProjects.map((rel) => (
                  <Link
                    key={rel.slug}
                    to="/case-studies/$slug"
                    params={{ slug: rel.slug }}
                    className="group rounded-3xl border border-black/[0.08] p-6 bg-[#FAFAFA] hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                        {rel.industry}
                      </span>
                      <h4 className="mt-2 font-display text-xl font-bold text-[#09090B] group-hover:text-blue-700 transition-colors">
                        {rel.client}: {rel.title}
                      </h4>
                      <p className="mt-2 text-sm text-[#52525B] line-clamp-2">
                        {rel.summary}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs font-bold text-[#09090B] group-hover:text-blue-700">
                      <span>View Case Study</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
