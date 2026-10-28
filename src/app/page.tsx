import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { LogoMarquee } from "@/components/site/LogoMarquee";
import { BrandIntro } from "@/components/site/BrandIntro";
import { ServiceCards } from "@/components/site/ServiceCards";
import { WhoItsFor } from "@/components/site/WhoItsFor";
import { OurWorkSection } from "@/components/site/OurWorkSection";
import { AboutCEO } from "@/components/site/AboutCEO";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import FAQ from "@/components/FAQ";
import ReadyToScale from "@/components/ReadyToScale";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Thrides | Digital Creative Agency",
  description:
    "Thrides is a digital creative agency that puts your brand in front of the right customers, with a purpose behind every move. Book a free strategy call.",
  openGraph: {
    title: "Thrides | Digital Creative Agency",
    description:
      "Thrides is a digital creative agency that puts your brand in front of the right customers, with a purpose behind every move. Book a free strategy call.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#08080B] text-white">
      {/* Navigation */}
      <Header />

      <main className="flex flex-col">
        {/* Section 1 — Hero */}
        <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-4 md:px-6 pt-2 pb-4">
          <Hero />
        </div>

        {/* Section 2 — Trust Bar (3 years · 14+ businesses · 8 countries) */}
        <LogoMarquee />

        {/* Section 3 — Welcome to thrides.® (Defiant Manifesto Section) */}
        <BrandIntro />

        {/* Section 4 — Services Overview (6 Services with Proof Previews) */}
        <ServiceCards />

        {/* Section 5 — Packages (Kickstart, Accelerate, Authority) */}
        <WhoItsFor />

        {/* Section 6 — Selected Proof / Our Work */}
        <OurWorkSection />

        {/* Section 7 — The On-Purpose Method, Guarantees & Team */}
        <AboutCEO />

        {/* Section 8 — Testimonials */}
        <TestimonialsSection />

        {/* Section 9 — Questions Before You Book (FAQ) */}
        <FAQ />

        {/* Section 10 — Final CTA: Ready to be chosen, not just seen? */}
        <ReadyToScale />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
