import type { Metadata } from "next";
import { CareersContent } from "./CareersContent";
import { getCollections } from "@/server/db";

export const metadata: Metadata = {
  title: "Careers — brandit. | Join Our High-Performance Dubai Team",
  description:
    "Explore open roles in media buying, video production, brand strategy, and web engineering at brandit. in Dubai.",
  openGraph: {
    title: "Careers — brandit. Agency",
    description:
      "Explore open roles in media buying, video production, brand strategy, and web engineering at brandit. in Dubai.",
  },
};

export default async function CareersPage() {
  let vacancies: any[] = [];

  try {
    const { vacancies: vacCol } = await getCollections();
    vacancies = await vacCol
      .find({ isOpen: true, isArchived: false }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (err) {
    console.error("Careers DB load error (using fallback):", err);
  }

  return <CareersContent vacancies={vacancies} />;
}
