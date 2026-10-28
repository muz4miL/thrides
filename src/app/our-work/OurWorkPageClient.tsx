"use client";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WorkHero } from "@/components/work/WorkHero";
import { WorkFeaturedPinned } from "@/components/work/WorkFeaturedPinned";
import { WorkProjectIndex } from "@/components/work/WorkProjectIndex";
import { WorkClosingCta } from "@/components/work/WorkClosingCta";
import type { WorkProjectDoc, WorkPageSettingsDoc } from "@/server/types";

interface OurWorkPageClientProps {
  settings: WorkPageSettingsDoc;
  projects: WorkProjectDoc[];
}

export function OurWorkPageClient({ settings, projects }: OurWorkPageClientProps) {
  const featured = projects.find((p) => p.isFeatured) || projects[0];

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[#0052FF] selection:text-white">
      <Header />
      <main className="flex flex-col">
        {/* A. Editorial Hero */}
        <WorkHero
          settings={settings}
          featuredSlug={featured?.slug}
          featuredTitle={featured?.title}
          featuredClient={featured?.clientName}
          featuredMediaUrl={featured?.heroMediaUrl}
          featuredMediaType={featured?.mediaType}
        />

        {/* B. Featured Signature Sequence (GSAP ScrollTrigger Pinned on Desktop) */}
        <WorkFeaturedPinned projects={projects} />

        {/* C. Project Index (12-column alternating 7/5 rhythm & URL filter sync) */}
        <WorkProjectIndex
          projects={projects}
          categoryOrder={settings.categoryOrder}
          intro={settings.galleryIntro}
        />

        {/* D. Editorial Closing Invitation */}
        <WorkClosingCta settings={settings} />
      </main>
      <Footer />
    </div>
  );
}
