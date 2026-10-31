import type { Metadata } from "next";
import { ServicesContent } from "./ServicesContent";
import { getServicesPageContent } from "@/server/services-page-service";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServicesPageContent();
  const settings = content.settings;

  const title = settings?.seoTitle || "Services & Packages | Thrides Growth Engine";
  const description =
    settings?.seoDescription ||
    "Start where you are. Grow from there. Dedicated marketing packages for every stage: Kickstart, Accelerate, and Authority.";
  const ogImage = settings?.ogImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function ServicesPage() {
  const content = await getServicesPageContent();
  return <ServicesContent data={content} />;
}
