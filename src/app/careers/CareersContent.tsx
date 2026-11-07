"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  ArrowUpRight,
  Sparkles,
  Check,
  ChevronDown,
  Briefcase,
  MapPin,
  Clock,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  Globe,
  DollarSign,
  Laptop,
  Zap,
  ShieldCheck,
  Send,
} from "lucide-react";

interface Vacancy {
  slug: string;
  jobTitle: string;
  department?: string;
  location?: string;
  isRemote?: boolean;
  employmentType?: string;
  salaryRange?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
}

export function CareersContent({ vacancies = [] }: { vacancies: Vacancy[] }) {
  const [expandedVacancy, setExpandedVacancy] = useState<string | null>(
    vacancies.length > 0 ? vacancies[0]?.slug ?? null : null,
  );
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  // Application Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneWhatsApp, setPhoneWhatsApp] = useState("");
  const [candidateLocation, setCandidateLocation] = useState("");
  const [workplacePreference, setWorkplacePreference] = useState("100% Remote");
  const [selectedVacancySlug, setSelectedVacancySlug] = useState<string>(
    vacancies.length > 0 ? vacancies[0]?.slug ?? "" : "general-talent-pool",
  );
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleApplyClick = (slug: string) => {
    setSelectedVacancySlug(slug);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 400);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setSubmissionError("CV file size exceeds 10MB limit.");
        return;
      }
      setCvFile(file);
      setCvFileName(file.name);
      setSubmissionError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      let cvBase64 = "";
      if (cvFile) {
        cvBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(cvFile);
        });
      }

      const response = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phoneWhatsApp,
          vacancySlug: selectedVacancySlug,
          candidateLocation,
          workplacePreference,
          portfolioUrl,
          message: coverNote,
          cvOriginalFilename: cvFileName || "resume.pdf",
          cvData: cvBase64,
          _hp: honeypot,
        }),
      });

      const res = await response.json();

      if (res.success) {
        setSubmissionSuccess(
          res.message ||
            "Your application has been received! Our leadership team reviews remote portfolios within 48 hours and will contact you directly.",
        );
        setFullName("");
        setEmail("");
        setPhoneWhatsApp("");
        setCandidateLocation("");
        setPortfolioUrl("");
        setCoverNote("");
        setCvFile(null);
        setCvFileName("");
      } else {
        throw new Error(res.error || "Failed to submit application. Please try again.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmissionError(msg || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter vacancies
  const filteredVacancies = vacancies.filter((v) => {
    if (filterDepartment === "all") return true;
    if (filterDepartment === "remote") {
      return (
        v.isRemote ||
        String(v.location || "").toLowerCase().includes("remote") ||
        String(v.location || "").toLowerCase().includes("worldwide")
      );
    }
    return v.department?.toLowerCase().includes(filterDepartment.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[#0052FF] selection:text-white">
      <Header />

      <main className="flex flex-col">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-white/[0.08] pt-24 pb-20 md:pt-32 md:pb-28">
          {/* Ambient Lighting Blurs */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#0052FF]/15 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/2 -left-32 h-[350px] w-[350px] rounded-full bg-[#3B82F6]/10 blur-[100px]" />

          <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0052FF]/40 bg-[#0052FF]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#60A5FA] backdrop-blur-md">
                <Globe size={13} className="text-[#60A5FA] animate-pulse" />
                <span className="font-mono uppercase text-[11px] font-bold">
                  Global &amp; Distributed • 100% Remote Friendly
                </span>
              </div>

              {/* Headline */}
              <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
                Work with Thrides. <br />
                <span className="font-serif italic font-normal text-white/70">
                  From anywhere in the world.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-neutral-300 max-w-2xl">
                We don’t care about fixed office desks, corporate timeclocks, or outdated credentials.
                If you are among the top 1% of media buyers, motion designers, creative strategists, or engineers,
                you can work with us from anywhere on the planet.
              </p>

              {/* Quick Remote CTA */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="btn-shiny-blue inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded-full cursor-pointer"
                >
                  <span>Apply Remotely Now</span>
                  <ArrowUpRight size={15} />
                </button>

                <a
                  href="#open-vacancies"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span>Explore Open Roles ({vacancies.length})</span>
                  <ChevronDown size={14} />
                </a>
              </div>
            </div>

            {/* 3 Core Remote Culture Pillars */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 pt-12 border-t border-white/[0.08]">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-xl bg-[#0052FF]/15 border border-[#0052FF]/30 grid place-items-center text-[#60A5FA] mb-4">
                  <Laptop size={18} />
                </div>
                <h3 className="font-display text-base font-bold text-white">100% Remote Freedom</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Work from your home studio in London, a café in Bali, or your desk in Dubai.
                  We measure output and commercial impact, never seat time.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 grid place-items-center text-emerald-400 mb-4">
                  <Zap size={18} />
                </div>
                <h3 className="font-display text-base font-bold text-white">Proof Over Pedigree</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Show us high-converting ad reels, viral hooks, and clean ROAS case studies.
                  Great portfolios and relentless curiosity win every time.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-xl bg-purple-500/15 border border-purple-500/30 grid place-items-center text-purple-400 mb-4">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="font-display text-base font-bold text-white">Fast-Track Hiring</h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Zero 8-round corporate marathons. We review applications within 48 hours,
                  run one focused capability conversation, and move straight to paid work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VACANCIES LIST SECTION */}
        <section id="open-vacancies" className="py-20 md:py-28 relative">
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#60A5FA]">
                  OPEN OPPORTUNITIES
                </span>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Current Open Vacancies
                </h2>
                <p className="mt-2 text-sm text-neutral-400">
                  Select a role to review responsibilities and submit your profile.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterDepartment("all")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    filterDepartment === "all"
                      ? "bg-[#0052FF] text-white shadow-[0_0_15px_rgba(0,82,255,0.4)]"
                      : "border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  All ({vacancies.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDepartment("remote")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    filterDepartment === "remote"
                      ? "bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      : "border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  100% Remote
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDepartment("Media Buying")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    filterDepartment === "Media Buying"
                      ? "bg-[#0052FF] text-white"
                      : "border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  Media Buying
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDepartment("Creative")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    filterDepartment === "Creative"
                      ? "bg-[#0052FF] text-white"
                      : "border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  Video &amp; Motion
                </button>
              </div>
            </div>

            {/* Vacancy Cards */}
            {filteredVacancies.length > 0 ? (
              <div className="space-y-5">
                {filteredVacancies.map((job) => {
                  const isExpanded = expandedVacancy === job.slug;
                  const isRemote =
                    job.isRemote ||
                    String(job.location || "").toLowerCase().includes("remote") ||
                    String(job.location || "").toLowerCase().includes("worldwide");

                  return (
                    <div
                      key={job.slug}
                      className="overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0E0F18]/90 backdrop-blur-xl transition-all hover:border-[#0052FF]/40 shadow-xl"
                    >
                      {/* Card Header Strip */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 sm:p-8 gap-5 border-b border-white/[0.06]">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            {/* Remote badge */}
                            {isRemote ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-[#0052FF]/20 border border-[#0052FF]/40 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#60A5FA]">
                                <Globe size={11} />
                                <span>100% REMOTE</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                                <MapPin size={11} />
                                <span>HYBRID / STUDIO</span>
                              </span>
                            )}

                            {job.department && (
                              <span className="rounded-md bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 text-neutral-300 text-[11px]">
                                {job.department}
                              </span>
                            )}

                            {job.location && (
                              <span className="flex items-center gap-1 text-neutral-400 text-xs">
                                <MapPin size={12} className="text-neutral-500" />
                                {job.location}
                              </span>
                            )}

                            {job.employmentType && (
                              <span className="flex items-center gap-1 text-neutral-400 font-mono text-xs">
                                <Clock size={12} className="text-neutral-500" />
                                {job.employmentType}
                              </span>
                            )}

                            {job.salaryRange && (
                              <span className="inline-flex items-center gap-1 font-mono text-emerald-400 text-xs font-bold">
                                <DollarSign size={12} />
                                <span>{job.salaryRange}</span>
                              </span>
                            )}
                          </div>

                          <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                            {job.jobTitle}
                          </h3>

                          {job.description && (
                            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl line-clamp-2">
                              {job.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
                          <button
                            type="button"
                            onClick={() => handleApplyClick(job.slug)}
                            className="btn-shiny-blue inline-flex h-11 items-center gap-2 rounded-full px-6 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                          >
                            <span>Apply Remotely</span>
                            <ArrowUpRight size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedVacancy(isExpanded ? null : job.slug)}
                            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            aria-label="Toggle role details"
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-[#60A5FA]" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Role Details */}
                      {isExpanded && (
                        <div className="p-6 sm:p-8 space-y-6 bg-black/40 border-t border-white/[0.04] animate-in fade-in duration-200">
                          {job.description && (
                            <div>
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#60A5FA]">
                                ABOUT THIS ROLE
                              </h4>
                              <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                                {job.description}
                              </p>
                            </div>
                          )}

                          {job.responsibilities && job.responsibilities.length > 0 && (
                            <div>
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#60A5FA]">
                                CORE RESPONSIBILITIES
                              </h4>
                              <ul className="mt-3 space-y-2.5">
                                {job.responsibilities.map((resp, rIdx) => (
                                  <li key={rIdx} className="flex items-start gap-3">
                                    <Check size={15} className="text-[#60A5FA] shrink-0 mt-0.5" />
                                    <span className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                      {resp}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {job.requirements && job.requirements.length > 0 && (
                            <div>
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#60A5FA]">
                                WHAT WE ARE LOOKING FOR
                              </h4>
                              <ul className="mt-3 space-y-2.5">
                                {job.requirements.map((req, qIdx) => (
                                  <li key={qIdx} className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#60A5FA] shrink-0" />
                                    <span className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                      {req}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                            <span className="text-xs text-neutral-400">
                              Ready to make your mark?
                            </span>
                            <button
                              type="button"
                              onClick={() => handleApplyClick(job.slug)}
                              className="text-xs font-bold text-[#60A5FA] hover:text-white underline underline-offset-4 cursor-pointer"
                            >
                              Jump to Application Form ↓
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-[#0E0F18]/90 p-12 text-center">
                <Briefcase size={36} className="mx-auto text-neutral-500 mb-3" />
                <h3 className="font-display text-lg font-bold text-white">
                  No Specific Roles Open in This Category
                </h3>
                <p className="mt-2 text-sm text-neutral-400">
                  We are always seeking world-class remote creators and media buyers. Submit an open speculative application below.
                </p>
              </div>
            )}

            {/* Speculative Talent Callout Card */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0E0F18] via-[#121526] to-[#0E0F18] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#60A5FA]">
                  OPEN SPECULATIVE TALENT POOL
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-1">
                  Don&apos;t see your exact role listed?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
                  If you have exceptional skills in 3D design, motion graphics, AI automation, or direct-response copywriting, we create custom roles for elite talent.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleApplyClick("general-talent-pool")}
                className="rounded-full border border-[#0052FF]/40 bg-[#0052FF]/15 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#60A5FA] hover:bg-[#0052FF] hover:text-white transition-all shrink-0 cursor-pointer"
              >
                Submit Speculative Profile →
              </button>
            </div>
          </div>
        </section>

        {/* APPLICATION FORM SECTION */}
        <section
          ref={formRef}
          className="relative py-20 md:py-28 border-t border-white/[0.08] bg-[#0A0B10]"
        >
          <div className="pointer-events-none absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-[#0052FF]/10 blur-[120px]" />

          <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Context & Culture */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#60A5FA]">
                    REMOTE APPLICATION
                  </span>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                    Submit Your Profile. <br />
                    <span className="font-serif italic font-normal text-white/70">
                      Show us what you’ve built.
                    </span>
                  </h2>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300">
                    We review portfolios with obsessive care. Send us your links, your case numbers,
                    or your showreel. We respect your time with rapid, straightforward decisions.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-xs text-neutral-300 space-y-3.5 backdrop-blur-md">
                  <p className="font-bold text-white uppercase tracking-wider font-mono text-[11px] text-[#60A5FA]">
                    What We Value in Candidates:
                  </p>
                  <div className="flex items-start gap-2.5">
                    <Check size={14} className="text-[#60A5FA] shrink-0 mt-0.5" />
                    <span>Real proof of performance: high ROAS, viral view counts, or clean engineering.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={14} className="text-[#60A5FA] shrink-0 mt-0.5" />
                    <span>Extreme remote autonomy: proactive communication, self-starter mentality.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={14} className="text-[#60A5FA] shrink-0 mt-0.5" />
                    <span>Commercial empathy: understanding why creative decisions drive business growth.</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 space-y-1">
                  <p>🔒 Your personal data and CV are stored in private, encrypted agency archives.</p>
                  <p>⚡ You will receive an email confirmation upon successful submission.</p>
                </div>
              </div>

              {/* Right Column: Submission Form */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-white/[0.12] bg-[#0E0F18]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                  {submissionSuccess ? (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center text-white space-y-4">
                      <div className="h-14 w-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 grid place-items-center mx-auto text-emerald-400">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="font-display text-2xl font-bold">Application Received!</h3>
                      <p className="text-sm text-neutral-300 leading-relaxed max-w-md mx-auto">
                        {submissionSuccess}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmissionSuccess(null)}
                        className="rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        Submit Another Profile
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

                      {/* Honeypot anti-spam */}
                      <input
                        type="text"
                        name="_hp"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                      />

                      {/* Full Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            ref={nameInputRef}
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Elena Rostova"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="elena@example.com"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                          />
                        </div>
                      </div>

                      {/* Role Applied For & Workplace Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                            Role Applied For *
                          </label>
                          <select
                            value={selectedVacancySlug}
                            onChange={(e) => setSelectedVacancySlug(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#12131F] px-4 py-3 text-sm text-white focus:border-[#0052FF] focus:outline-none"
                          >
                            {vacancies.map((v) => (
                              <option key={v.slug} value={v.slug}>
                                {v.jobTitle} {v.isRemote ? "— 100% Remote" : ""}
                              </option>
                            ))}
                            <option value="general-talent-pool">
                              General Remote Talent Pool (Speculative)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                            Workplace Preference
                          </label>
                          <select
                            value={workplacePreference}
                            onChange={(e) => setWorkplacePreference(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#12131F] px-4 py-3 text-sm text-white focus:border-[#0052FF] focus:outline-none"
                          >
                            <option value="100% Remote">100% Remote (Worldwide)</option>
                            <option value="Hybrid">Hybrid (Dubai / Remote)</option>
                            <option value="Open to Either">Open to Either</option>
                          </select>
                        </div>
                      </div>

                      {/* Location & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                            Current Location &amp; Timezone *
                          </label>
                          <input
                            type="text"
                            required
                            value={candidateLocation}
                            onChange={(e) => setCandidateLocation(e.target.value)}
                            placeholder="e.g. London, UK (GMT) or Bali (UTC+8)"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                            WhatsApp / Phone (Optional)
                          </label>
                          <input
                            type="text"
                            value={phoneWhatsApp}
                            onChange={(e) => setPhoneWhatsApp(e.target.value)}
                            placeholder="+44 7911 123456"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                          />
                        </div>
                      </div>

                      {/* Portfolio URL */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                          Portfolio / Showreel / LinkedIn URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                          placeholder="https://behance.net/yourname, loom.com/..., or linkedin.com/in/..."
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                        />
                      </div>

                      {/* Short Pitch / Cover Note */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                          Quick Pitch / Highlight Your Best Win (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={coverNote}
                          onChange={(e) => setCoverNote(e.target.value)}
                          placeholder="Briefly tell us about a campaign, creative asset, or project you're most proud of..."
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF] leading-relaxed"
                        />
                      </div>

                      {/* CV / Resume File Upload */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                          Upload CV / Resume (PDF, DOCX — Max 10MB) *
                        </label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] p-6 transition-all hover:border-[#0052FF] hover:bg-[#0052FF]/5"
                        >
                          <UploadCloud size={30} className="text-[#60A5FA]" />
                          <p className="mt-2 text-sm font-semibold text-white">
                            {cvFileName ? cvFileName : "Click or drag to upload your CV"}
                          </p>
                          <p className="mt-1 text-xs text-neutral-400">
                            PDF or DOCX up to 10MB • Private and secure
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-shiny-blue inline-flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 cursor-pointer"
                      >
                        <Send size={15} />
                        <span>
                          {isSubmitting ? "Uploading & Submitting..." : "Submit Remote Application"}
                        </span>
                        <ArrowUpRight size={15} />
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
