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
} from "lucide-react";

interface Vacancy {
  slug: string;
  jobTitle: string;
  department?: string;
  location?: string;
  type?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
}

export function CareersContent({ vacancies = [] }: { vacancies: Vacancy[] }) {
  const [expandedVacancy, setExpandedVacancy] = useState<string | null>(
    vacancies.length > 0 ? vacancies[0]?.slug ?? null : null,
  );

  // Application Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [candidateLocation, setCandidateLocation] = useState("");
  const [selectedVacancySlug, setSelectedVacancySlug] = useState<string>(
    vacancies.length > 0 ? vacancies[0]?.slug ?? "" : "general-talent-pool",
  );
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleApplyClick = (slug: string) => {
    setSelectedVacancySlug(slug);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
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
          vacancySlug: selectedVacancySlug,
          candidateLocation,
          portfolioUrl,
          cvOriginalFilename: cvFileName || "resume.pdf",
          cvData: cvBase64,
          _hp: honeypot,
        }),
      });

      const res = await response.json();

      if (res.success) {
        setSubmissionSuccess(
          res.message ||
            "Thank you! Your application has been securely submitted. Our talent acquisition team will review your portfolio and reach out.",
        );
        setFullName("");
        setEmail("");
        setCandidateLocation("");
        setPortfolioUrl("");
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B]">
      <Header />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="border-b border-black/[0.06] pt-12 pb-20 md:pt-16 md:pb-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                <Sparkles size={13} className="text-black" />
                <span>Careers at brandit.</span>
              </div>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#09090B] leading-[1.1]">
                Work with the Best. <br />
                <span className="font-serif italic font-normal text-[#3F3F46]">
                  Build at the Frontier.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[#52525B]">
                We are a relentless, high-autonomy agency operating out of Dubai. If you take
                extreme ownership of outcomes and pride yourself on world-class craft, this is your
                arena.
              </p>
            </div>
          </div>
        </section>

        {/* Vacancies Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#71717A]">
                Open Opportunities
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#09090B]">
                Current Active Vacancies
              </h2>
            </div>

            {vacancies && vacancies.length > 0 ? (
              <div className="space-y-6">
                {vacancies.map((job) => {
                  const isExpanded = expandedVacancy === job.slug;

                  return (
                    <div
                      key={job.slug}
                      className="overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-xs transition-all hover:border-black/20"
                    >
                      {/* Job Header Strip */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 gap-4 border-b border-black/[0.04]">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#71717A] mb-2">
                            {job.department && (
                              <span className="rounded-md bg-black/5 px-2.5 py-1 text-[#09090B]">
                                {job.department}
                              </span>
                            )}
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={13} />
                                {job.location}
                              </span>
                            )}
                            {job.type && (
                              <span className="flex items-center gap-1">
                                <Clock size={13} />
                                {job.type}
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-2xl font-bold text-[#09090B]">
                            {job.jobTitle}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleApplyClick(job.slug)}
                            className="inline-flex h-10 items-center gap-2 rounded-full bg-black px-5 text-xs font-bold text-white transition-all hover:bg-neutral-800 cursor-pointer"
                          >
                            <span>Apply Now</span>
                            <ArrowUpRight size={14} />
                          </button>
                          <button
                            onClick={() => setExpandedVacancy(isExpanded ? null : job.slug)}
                            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-black hover:bg-black/5 cursor-pointer"
                            aria-label="Toggle details"
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="p-6 sm:p-8 space-y-8 bg-[#FCFCFD]">
                          {job.description && (
                            <div>
                              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#71717A]">
                                About the Role
                              </h4>
                              <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#52525B]">
                                {job.description}
                              </p>
                            </div>
                          )}

                          {job.responsibilities && job.responsibilities.length > 0 && (
                            <div>
                              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#71717A]">
                                Core Responsibilities
                              </h4>
                              <ul className="mt-3 space-y-2">
                                {job.responsibilities.map((resp, rIdx) => (
                                  <li key={rIdx} className="flex items-start gap-2.5">
                                    <Check size={16} className="text-black shrink-0 mt-0.5" />
                                    <span className="text-sm text-[#3F3F46] leading-relaxed">
                                      {resp}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {job.requirements && job.requirements.length > 0 && (
                            <div>
                              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#71717A]">
                                What We’re Looking For
                              </h4>
                              <ul className="mt-3 space-y-2">
                                {job.requirements.map((req, qIdx) => (
                                  <li key={qIdx} className="flex items-start gap-2.5">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                                    <span className="text-sm text-[#3F3F46] leading-relaxed">
                                      {req}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-black/10 bg-white p-12 text-center">
                <Briefcase size={36} className="mx-auto text-neutral-400 mb-3" />
                <h3 className="font-display text-lg font-bold text-[#09090B]">
                  No Open Vacancies Currently
                </h3>
                <p className="mt-2 text-sm text-[#52525B]">
                  We are always open to world-class talent. Submit an open speculative application
                  below.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Application Form Section */}
        <section ref={formRef} className="bg-[#09090B] py-20 md:py-28 text-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Join the Team
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Submit Your Application
                </h2>
                <p className="mt-4 text-base leading-relaxed text-neutral-300">
                  We review every submission carefully. Send your portfolio and resume directly to
                  our leadership team.
                </p>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-xs text-neutral-300 space-y-3">
                  <p className="font-bold text-white uppercase tracking-wider">
                    Our Hiring Philosophy:
                  </p>
                  <p>• Portfolios and demonstrable proof over pedigree degrees.</p>
                  <p>• Speed, responsiveness, and clear communication.</p>
                  <p>• Fast decisions: no 8-round interview marathons.</p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-10 backdrop-blur-xl">
                  {submissionSuccess ? (
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-white">
                      <CheckCircle2 size={40} className="mx-auto text-white mb-4" />
                      <h3 className="font-display text-xl font-bold">Application Received</h3>
                      <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                        {submissionSuccess}
                      </p>
                      <button
                        onClick={() => setSubmissionSuccess(null)}
                        className="mt-6 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-neutral-200 cursor-pointer"
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
                            placeholder="e.g. Alex Morgan"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@example.com"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Position Applied For *
                          </label>
                          <select
                            value={selectedVacancySlug}
                            onChange={(e) => setSelectedVacancySlug(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-white focus:outline-none"
                          >
                            {vacancies.map((v) => (
                              <option key={v.slug} value={v.slug}>
                                {v.jobTitle} {v.department ? `(${v.department})` : ""}
                              </option>
                            ))}
                            {vacancies.length === 0 && (
                              <option value="general-talent-pool">
                                General Talent Pool / Speculative
                              </option>
                            )}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Location (City, Country)
                          </label>
                          <input
                            type="text"
                            value={candidateLocation}
                            onChange={(e) => setCandidateLocation(e.target.value)}
                            placeholder="e.g. Dubai, UAE"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                          Portfolio / Website / LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                        />
                      </div>

                      {/* File Upload for CV */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                          Upload CV / Resume (PDF, DOCX — Max 10MB) *
                        </label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-6 transition-all hover:border-white/50 hover:bg-white/10"
                        >
                          <UploadCloud size={28} className="text-neutral-400" />
                          <p className="mt-2 text-sm font-medium text-white">
                            {cvFileName ? cvFileName : "Click to browse and upload file"}
                          </p>
                          <p className="mt-1 text-xs text-neutral-400">
                            Stored securely in private agency archives
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

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-sm font-bold text-black transition-all hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
                      >
                        <span>
                          {isSubmitting ? "Uploading & Submitting..." : "Submit Application"}
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
