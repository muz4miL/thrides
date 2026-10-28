import type { Metadata } from "next";
import { StudioContent } from "./StudioContent";
import { getCollections } from "@/server/db";

export const metadata: Metadata = {
  title: "brandit. Studio — Premium Production & Podcast Space in Dubai",
  description:
    "Full-service Dubai studio featuring cyclorama wall, acoustic isolation, podcast suite, cinema lighting grid, and top-tier equipment rental.",
  openGraph: {
    title: "brandit. Studio — Production & Podcast Space",
    description:
      "Full-service Dubai studio featuring cyclorama wall, acoustic isolation, podcast suite, cinema lighting grid, and top-tier equipment rental.",
  },
};

export default async function StudioPage() {
  let categories: any[] = [];
  let equipment: any[] = [];

  try {
    const { studioCategories, studioEquipment } = await getCollections();
    const [catDocs, eqDocs] = await Promise.all([
      studioCategories.find({ isPublished: true }, { projection: { _id: 0 } }).sort({ order: 1 }).toArray(),
      studioEquipment.find({ isPublished: true }, { projection: { _id: 0 } }).sort({ order: 1 }).toArray(),
    ]);
    categories = catDocs;
    equipment = eqDocs;
  } catch (err) {
    console.error("Studio DB load error (using fallback):", err);
  }

  return <StudioContent categories={categories} equipment={equipment} />;
}
