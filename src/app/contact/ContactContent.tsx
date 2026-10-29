"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  Edit3,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { siteMeta, serviceInterestOptions, budgetOptions } from "@/content/site";

// Step 1 available services
const AVAILABLE_SERVICES = [
  ...serviceInterestOptions,
  "Not sure yet",
];

// Step 2 timeline choices
const TIMELINE_OPTIONS = [
  "Within 2 weeks",
  "1 to 2 months",
  "3+ months",
  "Flexible / exploring",
];

// Step 2 budget choices with guidance
const BUDGET_OPTIONS = [
  ...budgetOptions.filter((b) => b !== "Not sure yet"),
  "I’d like your guidance",
];

export function ContactContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  // Form Step State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [projectBrief, setProjectBrief] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneWhatsApp, setPhoneWhatsApp] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Validation & UI State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState("");

  // Initialize Idempotency Key & URL Parameters
  useEffect(() => {
    setIdempotencyKey(`thride_enq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const pkgParam = params.get("package");
      const srvParam = params.get("service");

      if (srvParam) {
        const matched = AVAILABLE_SERVICES.find(
          (s) => s.toLowerCase().includes(srvParam.toLowerCase()) || srvParam.toLowerCase().includes(s.toLowerCase()),
        );
        if (matched) setSelectedServices([matched]);
      } else if (pkgParam) {
        if (pkgParam.toLowerCase().includes("kickstart")) {
          setSelectedServices(["Website Design & Development", "Social Media Marketing"]);
        } else if (pkgParam.toLowerCase().includes("accelerate")) {
          setSelectedServices(["Website Design & Development", "Content Creation", "SEO"]);
        } else if (pkgParam.toLowerCase().includes("authority")) {
          setSelectedServices(["Marketing Consultancy", "Website Design & Development", "Content Creation", "SEO"]);
        }
      }
    }
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    let disposed = false;
    async function initMotion() {
      try {
        const { gsap } = await import("gsap");
        if (disposed || !rootRef.current) return;

        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from("[data-contact-hero]", {
            y: 24,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all",
          });
          gsap.from(formCardRef.current, {
            y: 28,
            opacity: 0,
            duration: 0.9,
            delay: 0.2,
            ease: "power3.out",
            clearProps: "all",
          });
        });
      } catch {
        // Fallback: static visibility
      }
    }
    void initMotion();
    return () => {
      disposed = true;
    };
  }, []);

  // Service Chip Toggle (with mutual exclusivity for "Not sure yet")
  const toggleService = (srv: string) => {
    setValidationError(null);
    if (srv === "Not sure yet") {
      setSelectedServices((prev) =>
        prev.includes("Not sure yet") ? [] : ["Not sure yet"],
      );
      return;
    }

    setSelectedServices((prev) => {
      const withoutNotSure = prev.filter((s) => s !== "Not sure yet");
      if (withoutNotSure.includes(srv)) {
        return withoutNotSure.filter((s) => s !== srv);
      }
      return [...withoutNotSure, srv];
    });
  };

  // Step 1 Validation & Next
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      setValidationError("Please select at least one service of interest or choose 'Not sure yet'.");
      return;
    }
    setValidationError(null);
    setCurrentStep(2);
    scrollToFormTop();
  };

  // Step 2 Next or Skip
  const handleProceedToStep3 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);
    setCurrentStep(3);
    scrollToFormTop();
  };

  const scrollToFormTop = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Step 3 Submission Handler
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSubmissionError(null);

    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setValidationError("Please provide your name (at least 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setValidationError("Please enter a valid business email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneWhatsApp: phoneWhatsApp.trim(),
        company: companyName.trim(),
        services: selectedServices,
        serviceOfInterest: selectedServices.join(", "),
        budgetRange: selectedBudget || "I'd like your guidance",
        timeline: selectedTimeline || "Flexible / exploring",
        websiteUrl: websiteUrl.trim(),
        message: projectBrief.trim(),
        sourcePage: "/contact",
        idempotencyKey,
        _hp: honeypot,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setIsSuccess(true);
        scrollToFormTop();
      } else {
        throw new Error(json.error || "Unable to save your enquiry. Please reach out to info@thrides.com directly.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmissionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstName = fullName.trim().split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-[#08080B] text-white selection:bg-[#0052FF] selection:text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        <div ref={rootRef} className="mx-auto max-w-[1300px] px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* ═══════════════════════════════════════════════════════
                LEFT COLUMN: EDITORIAL NARRATIVE & CONTACT CONSTELLATION
               ═══════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-10 lg:sticky lg:top-28">
              <div>
                {/* Eyebrow */}
                <div data-contact-hero className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4385FF] animate-pulse" />
                  <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-neutral-300">
                    LET’S MAKE YOUR NEXT MOVE COUNT
                  </span>
                </div>

                {/* Editorial Headline */}
                <h1
                  data-contact-hero
                  className="mt-6 font-display text-[clamp(44px,5.2vw,78px)] font-extrabold tracking-[-0.04em] text-white leading-[0.98]"
                >
                  <span className="block">Good things</span>
                  <span className="block">start with</span>
                  <span className="block font-serif font-normal italic text-[#4385FF] mt-1">
                    a conversation.
                  </span>
                </h1>

                {/* Supporting Copy */}
                <p
                  data-contact-hero
                  className="mt-6 text-[15px] sm:text-[16px] text-neutral-300 leading-relaxed max-w-md"
                >
                  Tell us what you’re building, what needs to change, or where you want to go. We’ll help you find the right next step.
                </p>

                {/* What Happens Next Sequence */}
                <div data-contact-hero className="mt-10 pt-8 border-t border-white/[0.08] space-y-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF] block">
                    WHAT HAPPENS NEXT
                  </span>

                  <div className="space-y-3.5 text-xs text-neutral-300">
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-[#4385FF] text-[11px] mt-0.5">01</span>
                      <p className="leading-snug">
                        <strong className="text-white font-semibold">We review your brief.</strong> Our strategists analyze your current digital presence and objectives.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-[#4385FF] text-[11px] mt-0.5">02</span>
                      <p className="leading-snug">
                        <strong className="text-white font-semibold">We talk through the opportunity.</strong> A free 30-minute discovery call focused on practical clarity.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-[#4385FF] text-[11px] mt-0.5">03</span>
                      <p className="leading-snug">
                        <strong className="text-white font-semibold">We agree on the right next step.</strong> You receive a clear scope, timeline, and execution roadmap.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Coordinate Channels */}
                <div data-contact-hero className="mt-10 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-6 text-xs text-neutral-400">
                  <a
                    href={`mailto:${siteMeta.contact.email}`}
                    className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                  >
                    <Mail size={14} className="text-[#4385FF]" />
                    <span className="font-mono font-medium underline underline-offset-4 decoration-white/20 group-hover:decoration-white">
                      {siteMeta.contact.email}
                    </span>
                  </a>

                  {siteMeta.contact.phone && (
                    <a
                      href={`https://wa.me/${siteMeta.contact.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                    >
                      <Phone size={14} className="text-emerald-400" />
                      <span className="font-mono font-medium underline underline-offset-4 decoration-white/20 group-hover:decoration-white">
                        {siteMeta.contact.phoneDisplay}
                      </span>
                    </a>
                  )}
                </div>
              </div>

              {/* Decorative Subtle Blue Constellation Arc (CSS/SVG) */}
              <div aria-hidden="true" className="relative h-28 w-full overflow-hidden pointer-events-none select-none opacity-40">
                <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path
                    d="M 10 110 C 120 10 260 110 390 20"
                    stroke="#0052FF"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    strokeOpacity="0.5"
                  />
                  <circle cx="10" cy="110" r="3" fill="#0052FF" />
                  <circle cx="200" cy="65" r="4" fill="#4385FF" />
                  <circle cx="390" cy="20" r="3" fill="#0052FF" />
                </svg>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                RIGHT COLUMN: 3-STEP CONVERSATIONAL ENQUIRY FORM
               ═══════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7">
              <div
                ref={formCardRef}
                className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0E0F18]/90 p-6 sm:p-9 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
              >
                {/* Subtle Top Specular Line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#0052FF]/40 to-transparent"
                />

                {/* ─── SUCCESS EXPERIENCE ─────────────────────── */}
                {isSuccess ? (
                  <div className="py-8 text-center space-y-6 animate-in fade-in duration-300">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0052FF]/15 border border-[#0052FF]/30 shadow-[0_0_30px_rgba(0,82,255,0.4)]">
                      <Check size={32} className="text-[#4385FF] stroke-[2.5]" />
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#4385FF]">
                        ENQUIRY CONFIRMED
                      </span>
                      <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Your next chapter is underway.
                      </h2>
                      <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed pt-1">
                        Thanks, <strong className="text-white">{firstName}</strong>. Your enquiry has reached Thrides. We review every brief personally and will reach out to <span className="font-mono text-[#4385FF]">{email}</span> within 24 hours.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 max-w-md mx-auto text-left text-xs text-neutral-400 space-y-2">
                      <div className="font-semibold text-white">What we are doing now:</div>
                      <p className="leading-relaxed">
                        Our lead strategist is inspecting your industry landscape. When we connect, we’ll dive straight into actionable opportunities for your brand.
                      </p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link
                        href="/our-work"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0052FF] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_24px_rgba(0,82,255,0.45)] hover:bg-[#0043DB] transition-all"
                      >
                        <span>Explore Our Work</span>
                        <ArrowUpRight size={15} />
                      </Link>

                      <Link
                        href="/"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all"
                      >
                        Return to Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Header & Step Indicator */}
                    <div className="border-b border-white/[0.08] pb-6 mb-8">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-[#4385FF]">
                          STEP {currentStep} OF 3
                        </span>
                        <span className="text-xs text-neutral-400">
                          {currentStep === 1 && "Scope & Direction"}
                          {currentStep === 2 && "Commercial Context"}
                          {currentStep === 3 && "Contact Dispatch"}
                        </span>
                      </div>

                      {/* 3-Segment Progress Bar */}
                      <div className="mt-3 grid grid-cols-3 gap-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3}>
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${currentStep >= 1 ? "bg-[#0052FF]" : "bg-white/10"}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${currentStep >= 2 ? "bg-[#0052FF]" : "bg-white/10"}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${currentStep === 3 ? "bg-[#0052FF]" : "bg-white/10"}`} />
                      </div>

                      <h2 className="mt-5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        {currentStep === 1 && "What can we help you with?"}
                        {currentStep === 2 && "A little context about your business."}
                        {currentStep === 3 && "Where should we reach you?"}
                      </h2>
                      <p className="mt-1.5 text-xs text-neutral-400">
                        {currentStep === 1 && "Select the capabilities your business needs today. Multi-select welcome."}
                        {currentStep === 2 && "This step is optional. Share what you feel comfortable with, or skip ahead."}
                        {currentStep === 3 && "Confirm your contact coordinates so we can prepare your strategy call."}
                      </p>
                    </div>

                    {/* Validation or Submission Errors */}
                    {(validationError || submissionError) && (
                      <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 animate-in fade-in duration-200">
                        <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                        <span>{validationError || submissionError}</span>
                      </div>
                    )}

                    {/* ─── STEP 1 ─────────────────────────────── */}
                    {currentStep === 1 && (
                      <form onSubmit={handleProceedToStep2} className="space-y-6 animate-in fade-in duration-200">
                        <fieldset className="space-y-3">
                          <legend className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                            SELECT CAPABILITIES <span className="text-[#4385FF]">*</span>
                          </legend>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {AVAILABLE_SERVICES.map((srv) => {
                              const isChecked = selectedServices.includes(srv);

                              return (
                                <label
                                  key={srv}
                                  className={`relative flex items-center justify-between rounded-2xl border p-4 text-xs font-semibold transition-all duration-150 cursor-pointer select-none min-h-[50px] ${
                                    isChecked
                                      ? "border-[#0052FF] bg-[#0052FF]/15 text-white shadow-[0_0_18px_rgba(0,82,255,0.25)]"
                                      : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20 hover:bg-white/[0.05]"
                                  }`}
                                >
                                  <span className="pr-2">{srv}</span>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleService(srv)}
                                    className="sr-only"
                                    aria-checked={isChecked}
                                  />
                                  <span
                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                                      isChecked
                                        ? "border-[#4385FF] bg-[#0052FF] text-white"
                                        : "border-white/20 bg-transparent"
                                    }`}
                                  >
                                    {isChecked && <Check size={10} className="stroke-[3]" />}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </fieldset>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label htmlFor="briefInput" className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                              TELL US A LITTLE ABOUT IT <span className="text-neutral-500 font-normal">(OPTIONAL)</span>
                            </label>
                            <span className="font-mono text-[10px] text-neutral-500">
                              {projectBrief.length}/2500
                            </span>
                          </div>
                          <textarea
                            id="briefInput"
                            rows={4}
                            value={projectBrief}
                            maxLength={2500}
                            onChange={(e) => setProjectBrief(e.target.value)}
                            placeholder="What are you working on, and what would you like to improve?"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#0052FF] leading-relaxed transition-all"
                          />
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_24px_rgba(0,82,255,0.45)] hover:bg-[#0043DB] transition-all cursor-pointer"
                          >
                            <span>Continue to Context</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      </form>
                    )}

                    {/* ─── STEP 2 ─────────────────────────────── */}
                    {currentStep === 2 && (
                      <form onSubmit={handleProceedToStep3} className="space-y-6 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="companyInput" className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                              BUSINESS / BRAND NAME
                            </label>
                            <input
                              id="companyInput"
                              type="text"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="e.g. Acme Holdings"
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label htmlFor="websiteInput" className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                              WEBSITE OR SOCIAL URL
                            </label>
                            <input
                              id="websiteInput"
                              type="text"
                              value={websiteUrl}
                              onChange={(e) => setWebsiteUrl(e.target.value)}
                              placeholder="e.g. acme.com or instagram.com/..."
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Budget Ranges */}
                        <div>
                          <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                            ESTIMATED MONTHLY / PROJECT BUDGET
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {BUDGET_OPTIONS.map((b) => {
                              const isSelected = selectedBudget === b;
                              return (
                                <button
                                  type="button"
                                  key={b}
                                  onClick={() => setSelectedBudget(isSelected ? "" : b)}
                                  className={`rounded-xl border p-3 text-xs font-semibold text-center transition-all cursor-pointer select-none ${
                                    isSelected
                                      ? "border-[#0052FF] bg-[#0052FF]/20 text-white shadow-[0_0_16px_rgba(0,82,255,0.3)]"
                                      : "border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06]"
                                  }`}
                                >
                                  {b}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Timeline Choices */}
                        <div>
                          <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                            PREFERRED START TIMELINE
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {TIMELINE_OPTIONS.map((t) => {
                              const isSelected = selectedTimeline === t;
                              return (
                                <button
                                  type="button"
                                  key={t}
                                  onClick={() => setSelectedTimeline(isSelected ? "" : t)}
                                  className={`rounded-xl border p-3 text-xs font-semibold text-center transition-all cursor-pointer select-none ${
                                    isSelected
                                      ? "border-[#0052FF] bg-[#0052FF]/20 text-white shadow-[0_0_16px_rgba(0,82,255,0.3)]"
                                      : "border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06]"
                                  }`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Navigation buttons */}
                        <div className="pt-4 flex items-center justify-between border-t border-white/[0.08]">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronLeft size={16} />
                            <span>Back to Scope</span>
                          </button>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleProceedToStep3()}
                              className="text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            >
                              Skip for now
                            </button>

                            <button
                              type="submit"
                              className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(0,82,255,0.4)] hover:bg-[#0043DB] transition-all cursor-pointer"
                            >
                              <span>Next: Contact Details</span>
                              <ArrowRight size={15} />
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* ─── STEP 3 ─────────────────────────────── */}
                    {currentStep === 3 && (
                      <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in duration-200">
                        {/* Summary of selections with Edit shortcuts */}
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4385FF]">
                              ENQUIRY SUMMARY
                            </span>
                            <button
                              type="button"
                              onClick={() => setCurrentStep(1)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Edit3 size={11} />
                              <span>Edit Scope</span>
                            </button>
                          </div>

                          <div>
                            <span className="text-neutral-500 block text-[10.5px]">Selected Scope:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {selectedServices.map((s) => (
                                <span
                                  key={s}
                                  className="rounded-md bg-[#0052FF]/15 border border-[#0052FF]/30 px-2 py-0.5 font-mono text-[10px] text-[#4385FF] font-semibold"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {(companyName || selectedBudget || selectedTimeline) && (
                            <div className="grid grid-cols-2 gap-2 text-neutral-300 pt-1">
                              {companyName && (
                                <div>
                                  <span className="text-neutral-500 text-[10.5px] block">Company:</span>
                                  <span className="font-semibold text-white">{companyName}</span>
                                </div>
                              )}
                              {selectedBudget && (
                                <div>
                                  <span className="text-neutral-500 text-[10.5px] block">Budget:</span>
                                  <span className="font-semibold text-white">{selectedBudget}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Required Fields */}
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="nameInput" className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                              YOUR FULL NAME <span className="text-[#4385FF]">*</span>
                            </label>
                            <input
                              id="nameInput"
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. John Doe"
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label htmlFor="emailInput" className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                              BUSINESS EMAIL ADDRESS <span className="text-[#4385FF]">*</span>
                            </label>
                            <input
                              id="emailInput"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="john@company.com"
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label htmlFor="phoneInput" className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                              PHONE / WHATSAPP NUMBER <span className="text-neutral-500 font-normal">(OPTIONAL)</span>
                            </label>
                            <input
                              id="phoneInput"
                              type="tel"
                              value={phoneWhatsApp}
                              onChange={(e) => setPhoneWhatsApp(e.target.value)}
                              placeholder="+1 (555) 000-0000"
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-xs text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Anti-Spam Honeypot (Visually Hidden) */}
                        <div className="hidden" aria-hidden="true">
                          <input
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                          />
                        </div>

                        {/* Navigation & Submit */}
                        <div className="pt-4 flex items-center justify-between border-t border-white/[0.08]">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronLeft size={16} />
                            <span>Back</span>
                          </button>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_28px_rgba(0,82,255,0.45)] hover:bg-[#0043DB] disabled:opacity-50 transition-all cursor-pointer"
                          >
                            <span>{isSubmitting ? "Dispatching Brief..." : "Send My Enquiry ↗"}</span>
                          </button>
                        </div>

                        <p className="text-[11px] text-neutral-500 text-center pt-1">
                          We’ll use these details strictly to respond to your enquiry. Never shared or spammed.
                        </p>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
