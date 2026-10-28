"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  ArrowUpRight,
  Sparkles,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Phone,
} from "lucide-react";
import {
  siteMeta,
  packageOptions,
  serviceInterestOptions,
  budgetOptions,
} from "@/content/site";

export function ContactContent() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneWhatsApp, setPhoneWhatsApp] = useState("");
  const [company, setCompany] = useState("");
  const [packageInterest, setPackageInterest] = useState("Not sure yet");
  const [serviceOfInterest, setServiceOfInterest] = useState("Not sure yet");
  const [budgetRange, setBudgetRange] = useState("Not sure yet");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const pkgParam = params.get("package");
      const srvParam = params.get("service");

      if (pkgParam) {
        if (pkgParam.toLowerCase().includes("kickstart")) setPackageInterest("Kickstart (3 Weeks)");
        else if (pkgParam.toLowerCase().includes("accelerate")) setPackageInterest("Accelerate (Most Popular)");
        else if (pkgParam.toLowerCase().includes("authority")) setPackageInterest("Authority (Custom-Built)");
      }

      if (srvParam) {
        const found = serviceInterestOptions.find((s) =>
          s.toLowerCase().includes(srvParam.toLowerCase()),
        );
        if (found) setServiceOfInterest(found);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phoneWhatsApp,
          company,
          packageInterest,
          serviceOfInterest,
          budgetRange,
          message,
          _hp: honeypot,
        }),
      });

      const res = await response.json();

      if (res.success) {
        setSubmissionSuccess(
          "Thank you! Your enquiry has been received. We review every message personally and will reply within 24 hours with clear next steps.",
        );
        setFullName("");
        setEmail("");
        setPhoneWhatsApp("");
        setCompany("");
        setMessage("");
      } else {
        throw new Error(res.error || "Unable to save your enquiry. Please reach out via WhatsApp or email directly.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmissionError(
        msg || "Something went wrong sending your message. Please reach out directly at info@thrides.com or via WhatsApp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B]">
      <Header />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="border-b border-black/[0.06] pt-12 pb-16 md:pt-16 md:pb-20 bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                <Sparkles size={13} className="text-blue-700" />
                <span>Free 30-Minute Consultation</span>
              </div>

              <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#09090B] leading-[1.1]">
                Let’s Talk About <br />
                <span className="font-serif italic font-normal text-blue-900">
                  Your Marketing
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[#52525B]">
                Tell us where your business is today. We’ll reply within 24 hours with clear next steps, and your first 30-minute call is free.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section: Form & Direct Contact Channels */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Form */}
              <div className="lg:col-span-7">
                <div className="rounded-[32px] border border-black/[0.08] bg-white p-7 sm:p-10 shadow-sm">
                  <div className="mb-6">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#09090B]">
                      Send us a message
                    </h2>
                    <p className="mt-1.5 text-sm text-[#52525B]">
                      Fill out this quick form and we’ll prepare specific recommendations for your business.
                    </p>
                  </div>

                  {submissionSuccess ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-7 text-center">
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 size={28} />
                      </div>
                      <h3 className="mt-4 font-display text-xl font-bold text-emerald-950">
                        Enquiry Received
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-emerald-800">
                        {submissionSuccess}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmissionSuccess(null)}
                        className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-emerald-800 px-6 text-xs font-bold text-white transition-colors hover:bg-emerald-900"
                      >
                        Submit another enquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="hidden" aria-hidden="true">
                        <input
                          type="text"
                          name="_hp"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </div>

                      {submissionError && (
                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-900">
                          <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
                          <span>{submissionError}</span>
                        </div>
                      )}

                      {/* Name */}
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-xs font-bold uppercase tracking-wider text-[#09090B] mb-2"
                        >
                          Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#09090B] placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Email & Phone Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-xs font-bold uppercase tracking-wider text-[#09090B] mb-2"
                          >
                            Email <span className="text-red-600">*</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#09090B] placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-xs font-bold uppercase tracking-wider text-[#09090B] mb-2"
                          >
                            Phone / WhatsApp <span className="text-red-600">*</span>
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            required
                            value={phoneWhatsApp}
                            onChange={(e) => setPhoneWhatsApp(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#09090B] placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Business Name and Website */}
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-xs font-bold uppercase tracking-wider text-[#09090B] mb-2"
                        >
                          Business Name & Website (if you have one)
                        </label>
                        <input
                          id="company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Acme Corp / acme.com"
                          className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#09090B] placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Package interest & Service needed */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="packageInterest"
                            className="block text-xs font-bold uppercase tracking-wider text-[#09090B] mb-2"
                          >
                            Which package interests you?
                          </label>
                          <select
                            id="packageInterest"
                            value={packageInterest}
                            onChange={(e) => setPackageInterest(e.target.value)}
                            className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#09090B] focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                          >
                            {packageOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="serviceOfInterest"
                            className="block text-xs font-bold uppercase tracking-wider text-[#09090B] mb-2"
                          >
                            What do you need help with?
                          </label>
                          <select
                            id="serviceOfInterest"
                            value={serviceOfInterest}
                            onChange={(e) => setServiceOfInterest(e.target.value)}
                            className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#09090B] focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                          >
                            {serviceInterestOptions.map((s, i) => (
                              <option key={i} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Budget Range */}
                      <div>
                        <label
                          htmlFor="budgetRange"
                          className="block text-xs font-bold uppercase tracking-wider text-[#09090B] mb-2"
                        >
                          Estimated Budget Range (Optional)
                        </label>
                        <select
                          id="budgetRange"
                          value={budgetRange}
                          onChange={(e) => setBudgetRange(e.target.value)}
                          className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#09090B] focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
                        >
                          {budgetOptions.map((b, i) => (
                            <option key={i} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Biggest Challenge */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-xs font-bold uppercase tracking-wider text-[#09090B] mb-2"
                        >
                          What’s the biggest challenge in your marketing right now?
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us what you're trying to solve..."
                          className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] p-4 text-sm text-[#09090B] placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors resize-y"
                        />
                      </div>

                      {/* Submit Button & Microcopy */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex w-full h-[56px] items-center justify-center gap-2 rounded-full bg-[#09090B] text-base font-bold text-white transition-all hover:bg-neutral-800 disabled:opacity-50 shadow-md cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span>Submitting enquiry...</span>
                          ) : (
                            <>
                              <span>Submit Consultation Request</span>
                              <ArrowUpRight size={17} className="stroke-[2.5]" />
                            </>
                          )}
                        </button>

                        <p className="mt-3 text-center text-xs text-[#71717A]">
                          No automated lock-in. We reply within 24 hours to coordinate your free 30-minute consultation.
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-8">
                {/* Route 1: Direct Messaging & Call Coordination */}
                <div className="rounded-[32px] border border-black/[0.08] bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                    <Calendar size={16} />
                    <span>Direct Coordination</span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-bold text-[#09090B]">
                    Request a Strategy Call
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#52525B]">
                    We do not use automated calendar booking links. Send a message on WhatsApp or call us directly to coordinate a convenient 30-minute consultation slot with our strategists.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <a
                      href={`https://wa.me/${siteMeta.contact.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                    >
                      <MessageSquare size={17} />
                      <span>Message on WhatsApp to Coordinate</span>
                    </a>

                    <a
                      href={`tel:${siteMeta.contact.phone.replace(/\s+/g, "")}`}
                      className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full border border-black/[0.12] bg-[#FAFAFA] text-sm font-bold text-[#09090B] transition-colors hover:bg-neutral-100"
                    >
                      <Phone size={16} />
                      <span>Call {siteMeta.contact.phoneDisplay}</span>
                    </a>
                  </div>
                </div>

                {/* What Happens Next */}
                <div className="rounded-[32px] border border-black/[0.08] bg-white p-8 shadow-sm">
                  <h3 className="font-display text-xl font-bold text-[#09090B]">
                    What Happens Next
                  </h3>

                  <div className="mt-5 space-y-4">
                    {[
                      {
                        num: "1",
                        title: "We read your message and look at your business.",
                      },
                      {
                        num: "2",
                        title: "We reply within 24 hours with a few questions or a time to talk.",
                      },
                      {
                        num: "3",
                        title: "You get a free 30-minute call with clear recommendations, whether or not you hire us.",
                      },
                    ].map((step) => (
                      <div key={step.num} className="flex items-start gap-3.5">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-800 text-xs font-bold mt-0.5">
                          {step.num}
                        </span>
                        <p className="text-sm leading-relaxed text-[#3F3F46]">
                          {step.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Contact Details */}
                <div className="rounded-[32px] bg-[#09090B] p-8 text-white shadow-md">
                  <h3 className="font-display text-lg font-bold">Get in Touch</h3>
                  <div className="mt-4 space-y-3.5 text-sm text-neutral-300">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-blue-400 shrink-0" />
                      <a href={`mailto:${siteMeta.contact.email}`} className="hover:text-white underline-offset-4 hover:underline">
                        {siteMeta.contact.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-blue-400 shrink-0" />
                      <a href={`tel:${siteMeta.contact.phone.replace(/\s+/g, "")}`} className="hover:text-white underline-offset-4 hover:underline">
                        {siteMeta.contact.phoneDisplay}
                      </a>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <span>{siteMeta.contact.office}</span>
                    </div>

                    <div className="flex items-center gap-3 pt-2 text-xs text-neutral-400 border-t border-white/10">
                      <Clock size={14} className="text-blue-400 shrink-0" />
                      <span>{siteMeta.contact.responseTime}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10">
                    <p className="text-xs italic text-blue-300">
                      “{siteMeta.contact.closingLine}”
                    </p>
                  </div>
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
