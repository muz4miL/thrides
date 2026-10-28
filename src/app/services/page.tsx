import type { Metadata } from "next";
import { ServicesContent } from "./ServicesContent";

export const metadata: Metadata = {
  title: "Services & Packages | Thrides Growth Engine",
  description:
    "Start where you are. Grow from there. Dedicated marketing packages for every stage: Kickstart, Accelerate, and Authority.",
  openGraph: {
    title: "Services & Packages | Thrides Growth Engine",
    description:
      "Start where you are. Grow from there. Dedicated marketing packages for every stage: Kickstart, Accelerate, and Authority.",
    type: "website",
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
