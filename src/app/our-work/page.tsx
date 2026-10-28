import type { Metadata } from "next";
import { OurWorkContent } from "./OurWorkContent";

export const metadata: Metadata = {
  title: "Our Work & Case Studies | Thrides",
  description:
    "Explore selected client proof, positioning roadmaps, conversion websites, and measurable growth engineered by Thrides across 8 countries.",
  openGraph: {
    title: "Our Work — Thrides Portfolio & Proof",
    description:
      "Explore selected client proof, positioning roadmaps, conversion websites, and measurable growth engineered by Thrides across 8 countries.",
  },
};

export default function OurWorkPage() {
  return <OurWorkContent />;
}
