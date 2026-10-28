import { Suspense } from "react";
import type { Metadata } from "next";
import { getPublicWorkPageData } from "@/server/work-service";
import { OurWorkPageClient } from "./OurWorkPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicWorkPageData();

  return {
    title: settings?.seo?.title || "Our Work & Case Studies | Thrides",
    description:
      settings?.seo?.description ||
      "Explore selected client proof, positioning roadmaps, conversion websites, and measurable growth engineered by Thrides across 8 countries.",
    openGraph: {
      title: settings?.seo?.title || "Our Work — Thrides Portfolio & Proof",
      description:
        settings?.seo?.description ||
        "Explore selected client proof, positioning roadmaps, conversion websites, and measurable growth engineered by Thrides across 8 countries.",
      images: settings?.seo?.ogImage ? [{ url: settings.seo.ogImage }] : undefined,
    },
    alternates: {
      canonical: "/our-work",
    },
  };
}

export default async function OurWorkPage() {
  const { settings, projects } = await getPublicWorkPageData();

  // JSON-LD structured data for creative work portfolio
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: settings.seo.title,
    description: settings.seo.description,
    url: "https://thrides.com/our-work",
    hasPart: projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.title,
      headline: p.title,
      description: p.summary,
      creator: {
        "@type": "Organization",
        name: "Thrides",
      },
      image: p.thumbnailUrl,
      url: `https://thrides.com/our-work/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-[#070709]" />}>
        <OurWorkPageClient settings={settings} projects={projects} />
      </Suspense>
    </>
  );
}
