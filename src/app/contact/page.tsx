import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact & Discovery Call | Thrides — Your Brand, Everywhere. On Purpose.",
  description:
    "Good things start with a conversation. Tell us what you’re building, what needs to change, or where you want to go. Free 30-minute strategy call.",
  openGraph: {
    title: "Contact & Discovery Call | Thrides",
    description:
      "Good things start with a conversation. Let’s make your next move count.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
