import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Book a Free Strategy Call | Thrides",
  description:
    "Tell us about your business. We reply within 24 hours, and your first 30-minute call is free.",
  openGraph: {
    title: "Book a Free Strategy Call | Thrides",
    description:
      "Tell us about your business. We reply within 24 hours, and your first 30-minute call is free.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
