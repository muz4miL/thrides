"use client";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WorkHero } from "@/components/work/WorkHero";
import { OurWorkGallery } from "@/components/work/OurWorkGallery";
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

        {/* B. Curated Exhibition Gallery (Featured Exhibit, 12-Col Gallery Grid & Archive Index) */}
        <OurWorkGallery />

        {/* D. Editorial Closing Invitation */}
        <WorkClosingCta settings={settings} />
      </main>
      <Footer />
    </div>
  );
}
