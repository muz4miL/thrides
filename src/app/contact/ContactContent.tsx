"use client";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ContactSection } from "@/components/contact/ContactSection";

export function ContactContent() {
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col justify-between selection:bg-[#0A5CFF] selection:text-white">
      <Header />
      <main className="flex-1">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
