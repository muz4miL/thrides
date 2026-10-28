"use client";

import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  Camera,
  Mic,
  Film,
  Clock,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Category {
  slug: string;
  name: string;
}

interface Equipment {
  categorySlug?: string;
  categoryId?: string;
  name: string;
  status?: string;
  specs?: string;
}

export function StudioContent({
  categories = [],
  equipment = [],
}: {
  categories: Category[];
  equipment: Equipment[];
}) {
  const [openCategory, setOpenCategory] = useState<string | null>("cameras");

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneWhatsApp, setPhoneWhatsApp] = useState("");
  const [shootType, setShootType] = useState("Commercial Video");
  const [preferredDate, setPreferredDate] = useState("");
  const [duration, setDuration] = useState("Full Day (8 Hours)");
  const [equipmentRequirements, setEquipmentRequirements] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      const response = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phoneWhatsApp,
          shootType,
          preferredDate,
          duration,
          equipmentRequirements,
          message,
          _hp: honeypot,
        }),
      });

      const res = await response.json();

      if (res.success) {
        setSubmissionSuccess(
          res.message ||
            "Thank you! Your studio booking request has been submitted. Our studio manager will confirm availability within 2 business hours.",
        );
        setFullName("");
        setEmail("");
        setPhoneWhatsApp("");
        setPreferredDate("");
        setEquipmentRequirements("");
        setMessage("");
      } else {
        throw new Error(res.error || "Failed to submit enquiry.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmissionError(
        msg || "Failed to submit enquiry. Please check your details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const equipmentByCategory = (catSlug: string) =>
    equipment.filter((e) => e.categorySlug === catSlug || e.categoryId === catSlug);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B]">
      <Header />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-12 pb-20 md:pt-16 md:pb-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                <Sparkles size={13} className="text-black" />
                <span>Production Infrastructure</span>
              </div>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#09090B] leading-[1.1]">
                brandit. Studio. <br />
                <span className="font-serif italic font-normal text-[#3F3F46]">
                  A Space Engineered for Visual Authority.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[#52525B]">
                Our private Dubai production facility equipped with seamless cyclorama walls,
                soundproofing, high-output lighting grids, podcasting suites, and broadcast cinema
                gear. Available for client productions and external dry-hire.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#enquire"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-black px-7 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
                >
                  <span>Book Space or Equipment</span>
                  <ArrowUpRight size={16} />
                </a>
                <a
                  href="https://wa.me/971525347120?text=Hi%20brandit.%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20booking%20the%20space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-black/15 bg-white px-7 text-sm font-semibold text-[#09090B] transition-all hover:bg-black/5"
                >
                  <MessageSquare size={16} />
                  <span>Check Instant Date via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Space Highlights Grid */}
        <section className="py-16 md:py-24 border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Film,
                  title: "Seamless Cyclorama Wall",
                  desc: "Cornerless white infinity cove with ceiling-mounted overhead lighting rails, perfect for automotive, fashion, commercial, and high-key product shoots.",
                },
                {
                  icon: Mic,
                  title: "Sound-Treated Podcast Suite",
                  desc: "Fully isolated acoustic suite with multi-camera Sony cinema angles, Shure broadcast microphones, and real-time live monitoring.",
                },
                {
                  icon: Camera,
                  title: "Client Lounge & Production Bay",
                  desc: "High-speed 1Gbps fiber internet, client review monitors, makeup and wardrobe vanity stations, and dedicated catering lounge.",
                },
              ].map((h, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-black/[0.08] bg-white p-7 shadow-sm transition-all hover:border-black/25"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-black text-white">
                    <h.icon size={20} />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-[#09090B]">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#52525B]">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 12 Equipment Categories Accordion */}
        {categories.length > 0 && (
          <section className="py-20 md:py-28 bg-[#FAFAFA]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
              <div className="max-w-3xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#71717A]">
                  In-House Gear Arsenal
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#09090B]">
                  Precision Gear
                </h2>
                <p className="mt-3 text-base text-[#52525B]">
                  Every item is maintained to strict cinema standards. Status tags indicate whether
                  gear is housed permanently on-site or prepped on advance request.
                </p>
              </div>

              <div className="mt-12 space-y-4">
                {categories.map((cat) => {
                  const items = equipmentByCategory(cat.slug);
                  const isOpen = openCategory === cat.slug;

                  return (
                    <div
                      key={cat.slug}
                      className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white transition-all shadow-xs"
                    >
                      <button
                        onClick={() => setOpenCategory(isOpen ? null : cat.slug)}
                        className="flex w-full items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-neutral-50"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-display text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">
                            {cat.name}
                          </span>
                          <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-[#52525B]">
                            {items.length} items
                          </span>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-black transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-black/[0.06] p-5 sm:p-6 bg-[#FCFCFD]">
                          {items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {items.map((eq, eqIdx) => (
                                <div
                                  key={eqIdx}
                                  className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-2xs"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-display text-sm font-bold text-[#09090B]">
                                      {eq.name}
                                    </h4>
                                    {eq.status && (
                                      <span
                                        className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                          eq.status === "available at studio"
                                            ? "bg-black text-white"
                                            : "bg-neutral-100 text-[#52525B] border border-black/10"
                                        }`}
                                      >
                                        {eq.status}
                                      </span>
                                    )}
                                  </div>
                                  {eq.specs && (
                                    <p className="mt-2 text-xs leading-relaxed text-[#52525B]">
                                      {eq.specs}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-[#71717A] italic">
                              Full equipment list available upon request.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Studio Booking & Enquiry Form */}
        <section id="enquire" className="scroll-mt-24 bg-[#09090B] py-20 md:py-28 text-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column */}
              <div className="lg:col-span-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Reservations & Inquiries
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Book the Space or Custom Gear Package
                </h2>
                <p className="mt-4 text-base leading-relaxed text-neutral-300">
                  Whether you need a half-day podcast session, a full commercial shoot with cinema
                  lighting, or equipment dry-hire, our production team will confirm availability
                  promptly.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-neutral-400" />
                    <span className="text-sm text-neutral-200">
                      Standard Operating Hours: 08:00 — 22:00 Daily (24/7 on request)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-neutral-400" />
                    <a
                      href="https://wa.me/971525347120?text=Hi%20brandit.%20Studio"
                      className="text-sm text-white underline underline-offset-4 hover:text-neutral-300"
                    >
                      Instant WhatsApp Hotline: +971 52 534 7120
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Submission Form */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-10 backdrop-blur-xl">
                  {submissionSuccess ? (
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-white">
                      <CheckCircle2 size={40} className="mx-auto text-white mb-4" />
                      <h3 className="font-display text-xl font-bold">Request Received</h3>
                      <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                        {submissionSuccess}
                      </p>
                      <button
                        onClick={() => setSubmissionSuccess(null)}
                        className="mt-6 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-neutral-200 cursor-pointer"
                      >
                        Submit Another Booking
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {submissionError && (
                        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
                          <AlertCircle size={16} className="shrink-0" />
                          <span>{submissionError}</span>
                        </div>
                      )}

                      <input
                        type="text"
                        name="_hp"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Tariq Al Mansoor"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Work Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tariq@company.com"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Phone / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            value={phoneWhatsApp}
                            onChange={(e) => setPhoneWhatsApp(e.target.value)}
                            placeholder="+971 50 123 4567"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Shoot Type
                          </label>
                          <select
                            value={shootType}
                            onChange={(e) => setShootType(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-white focus:outline-none"
                          >
                            <option value="Commercial Video">Commercial Video</option>
                            <option value="Podcast Production">Podcast Production</option>
                            <option value="Product Photography">Product Photography</option>
                            <option value="Fashion / Editorial">Fashion / Editorial</option>
                            <option value="Corporate Interview">Corporate Interview</option>
                            <option value="Dry-Hire Space Only">Dry-Hire Space Only</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Preferred Date
                          </label>
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Duration
                          </label>
                          <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-white focus:outline-none"
                          >
                            <option value="Half Day (4 Hours)">Half Day (4 Hours)</option>
                            <option value="Full Day (8 Hours)">Full Day (8 Hours)</option>
                            <option value="Multi-Day Shoot">Multi-Day Shoot</option>
                            <option value="Hourly Podcast Session">Hourly Podcast Session</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                          Specific Gear or Crew Needed
                        </label>
                        <input
                          type="text"
                          value={equipmentRequirements}
                          onChange={(e) => setEquipmentRequirements(e.target.value)}
                          placeholder="e.g. Cinema 4K A-Cam, Master Prime lenses, Sound Operator"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                          Project Details / Special Requests
                        </label>
                        <textarea
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Briefly describe your production concept, crew size, or set requirements..."
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-sm font-bold text-black transition-all hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
                      >
                        <span>
                          {isSubmitting ? "Submitting Request..." : "Submit Studio Request"}
                        </span>
                        <ArrowUpRight size={16} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
