"use client";

import { useState, useRef, useCallback } from "react";
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
  User,
  Mail,
  Phone,
  Link,
  Loader2,
  X,
  FileText,
  Timer,
  MessageSquare,
  TrendingUp,
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

// ─── Floating Stat Card Data ─────────────────────────────────────────────────
interface StatCardData {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  value: string;
  color: string;
}
const STAT_CARDS: StatCardData[] = [
  { icon: Timer, label: "Response Time", value: "48h", color: "#0052FF" },
  { icon: Globe, label: "Work Style", value: "100% Remote", color: "#10B981" },
  { icon: TrendingUp, label: "Ad Budgets", value: "7-Figure+", color: "#8B5CF6" },
  { icon: MapPin, label: "Team Timezones", value: "8+ Zones", color: "#F59E0B" },
];

// ─── Location Marquee ─────────────────────────────────────────────────────────
const LOCATIONS = [
  "London",
  "Dubai",
  "Berlin",
  "Bali",
  "Toronto",
  "Lahore",
  "Singapore",
  "New York",
  "Amsterdam",
  "Sydney",
  "Lagos",
  "Karachi",
];

// ─── Hire Steps ───────────────────────────────────────────────────────────────
const HIRE_STEPS = [
  {
    num: "01",
    title: "Apply",
    desc: "Submit your profile, portfolio links, and best wins. 5 minutes, no cover-letter essays.",
  },
  {
    num: "02",
    title: "Portfolio Review",
    desc: "Our leadership team reviews every application within 48 hours — no auto-rejections.",
  },
  {
    num: "03",
    title: "One Conversation",
    desc: "One focused capability call. No panel interviews, no take-home tests.",
  },
  {
    num: "04",
    title: "Paid Work",
    desc: "If we're aligned, we move straight to a paid trial or immediate offer.",
  },
];

export function CareersContent({ vacancies = [] }: { vacancies: Vacancy[] }) {
  const [expandedVacancy, setExpandedVacancy] = useState<string | null>(
    vacancies.length > 0 ? (vacancies[0]?.slug ?? null) : null,
  );
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  // Application Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneWhatsApp, setPhoneWhatsApp] = useState("");
  const [candidateLocation, setCandidateLocation] = useState("");
  const [workplacePreference, setWorkplacePreference] = useState("100% Remote");
  const [selectedVacancySlug, setSelectedVacancySlug] = useState<string>(
    vacancies.length > 0 ? (vacancies[0]?.slug ?? "") : "general-talent-pool",
  );
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  const [cvFileError, setCvFileError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
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

  const processFile = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setCvFileError("File exceeds 10MB limit. Please upload a smaller file.");
      setCvFile(null);
      setCvFileName("");
      return;
    }
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      setCvFileError("Only PDF or DOCX files are accepted.");
      setCvFile(null);
      setCvFileName("");
      return;
    }
    setCvFileError("");
    setCvFile(file);
    setCvFileName(file.name);
    setSubmissionError(null);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
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
    <>
      {/* Global keyframes injected once */}
      <style>{`
        @keyframes careers-float-0 {
          0%,100%{transform:translateY(0px) rotate(-1deg)}
          50%{transform:translateY(-14px) rotate(1deg)}
        }
        @keyframes careers-float-1 {
          0%,100%{transform:translateY(0px) rotate(1deg)}
          50%{transform:translateY(-10px) rotate(-1.5deg)}
        }
        @keyframes careers-float-2 {
          0%,100%{transform:translateY(0px) rotate(-0.5deg)}
          50%{transform:translateY(-18px) rotate(0.5deg)}
        }
        @keyframes careers-float-3 {
          0%,100%{transform:translateY(0px) rotate(1.5deg)}
          50%{transform:translateY(-8px) rotate(-0.5deg)}
        }
        @keyframes careers-marquee {
          0%{transform:translateX(0)}
          100%{transform:translateX(-50%)}
        }
        @keyframes careers-pulse-green {
          0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}
          50%{box-shadow:0 0 0 6px rgba(52,211,153,0)}
        }
        @media (prefers-reduced-motion: reduce) {
          [data-careers-float] { animation: none !important; }
          [data-careers-marquee] { animation: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#070709] text-white selection:bg-[#0052FF] selection:text-white overflow-x-hidden">
        <Header />

        <main className="flex flex-col">

          {/* ═══════════════════════════════════════════════════════════════════
              HERO — Two-column layout
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="relative overflow-hidden border-b border-white/[0.07] pt-28 pb-0 md:pt-36">
            {/* Background radial glow */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-[#0052FF]/12 blur-[140px]" />
            <div className="pointer-events-none absolute top-1/2 -left-32 h-[400px] w-[400px] rounded-full bg-[#3B82F6]/8 blur-[100px]" />
            {/* Subtle grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 md:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-24 md:pb-32">

                {/* LEFT: Copy */}
                <div className="lg:col-span-7 space-y-7">
                  {/* Badge Pill */}
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-[#0052FF]/40 bg-[#0052FF]/10 px-4 py-2 backdrop-blur-md">
                    <span
                      className="h-2 w-2 rounded-full bg-emerald-400 shrink-0"
                      style={{ animation: "careers-pulse-green 2s ease-in-out infinite" }}
                    />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#60A5FA]">
                      Global &amp; Distributed · 100% Remote Friendly
                    </span>
                  </div>

                  {/* H1 */}
                  <h1
                    className="font-display font-bold tracking-tight text-white leading-[1.03]"
                    style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
                  >
                    Work with Thrides.
                    <br />
                    <span
                      className="font-serif italic font-normal"
                      style={{
                        background: "linear-gradient(135deg, #93C5FD 0%, #3B82F6 50%, #1D4ED8 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      From anywhere in the world.
                    </span>
                  </h1>

                  {/* Body */}
                  <p className="text-lg leading-[1.65] text-white/70 max-w-[56ch]">
                    We don&apos;t care about fixed office desks, corporate timeclocks, or outdated credentials.
                    If you are among the top 1% of media buyers, motion designers, creative strategists, or engineers,
                    you can work with us from anywhere on the planet.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                      className="btn-shiny-blue inline-flex items-center gap-2.5 rounded-full px-7 text-sm font-bold uppercase tracking-wider text-white cursor-pointer group"
                      style={{ minHeight: "52px" }}
                    >
                      <span>Apply Remotely Now</span>
                      <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>

                    <a
                      href="#open-vacancies"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/25 transition-all duration-200"
                      style={{ minHeight: "52px" }}
                    >
                      <span>Explore Open Roles ({vacancies.length})</span>
                      <ChevronDown size={15} />
                    </a>
                  </div>
                </div>

                {/* RIGHT: Floating Stat Cards */}
                <div className="lg:col-span-5 relative min-h-[320px] hidden lg:block" aria-hidden="true">
                  {/* Soft ambient glow behind cards */}
                  <div className="absolute inset-0 rounded-3xl bg-[#0052FF]/6 blur-[60px]" />

                  {/* Card 0 — top-left */}
                  <div
                    data-careers-float
                    className="absolute left-0 top-8 w-[200px]"
                    style={{ animation: "careers-float-0 7s ease-in-out infinite", animationDelay: "0s" }}
                  >
                    <StatCard stat={STAT_CARDS[0]!} />
                  </div>

                  {/* Card 1 — top-right */}
                  <div
                    data-careers-float
                    className="absolute right-0 top-0 w-[195px]"
                    style={{ animation: "careers-float-1 8s ease-in-out infinite", animationDelay: "1.5s" }}
                  >
                    <StatCard stat={STAT_CARDS[1]!} />
                  </div>

                  {/* Card 2 — bottom-left */}
                  <div
                    data-careers-float
                    className="absolute left-10 bottom-10 w-[185px]"
                    style={{ animation: "careers-float-2 9s ease-in-out infinite", animationDelay: "0.8s" }}
                  >
                    <StatCard stat={STAT_CARDS[2]!} />
                  </div>

                  {/* Card 3 — bottom-right */}
                  <div
                    data-careers-float
                    className="absolute right-4 bottom-4 w-[190px]"
                    style={{ animation: "careers-float-3 6.5s ease-in-out infinite", animationDelay: "2s" }}
                  >
                    <StatCard stat={STAT_CARDS[3]!} />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Marquee Strip */}
            <div className="border-t border-white/[0.07] bg-white/[0.015] overflow-hidden py-3">
              <div
                data-careers-marquee
                className="flex gap-0 whitespace-nowrap"
                style={{ animation: "careers-marquee 24s linear infinite", width: "max-content" }}
              >
                {[...LOCATIONS, ...LOCATIONS].map((loc, i) => (
                  <span key={i} className="inline-flex items-center gap-3 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">
                    <span className="h-1 w-1 rounded-full bg-[#0052FF]/60 shrink-0" />
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════════
              VALUE CARDS — 3 Pillars
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="py-24 md:py-32 relative">
            <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 md:px-8">
              {/* Section Header */}
              <div className="mb-14 text-center max-w-2xl mx-auto">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#60A5FA]">
                  WHY THRIDES
                </span>
                <h2
                  className="mt-3 font-display font-bold text-white tracking-tight"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                >
                  Built for the Remote-First Elite
                </h2>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <ValueCard
                  icon={Laptop}
                  iconBg="rgba(0,82,255,0.15)"
                  iconBorder="rgba(0,82,255,0.3)"
                  iconColor="#60A5FA"
                  title="100% Remote Freedom"
                  body="Work from your home studio in London, a café in Bali, or your desk in Dubai. We measure output and commercial impact, never seat time."
                  stat="8+ timezones"
                  delay={0}
                />
                <ValueCard
                  icon={Zap}
                  iconBg="rgba(16,185,129,0.15)"
                  iconBorder="rgba(16,185,129,0.3)"
                  iconColor="#34D399"
                  title="Proof Over Pedigree"
                  body="Show us high-converting ad reels, viral hooks, and clean ROAS case studies. Great portfolios and relentless curiosity win every time."
                  stat="Results > credentials"
                  delay={0.08}
                />
                <ValueCard
                  icon={ShieldCheck}
                  iconBg="rgba(139,92,246,0.15)"
                  iconBorder="rgba(139,92,246,0.3)"
                  iconColor="#A78BFA"
                  title="Fast-Track Hiring"
                  body="Zero 8-round corporate marathons. We review applications within 48 hours, run one focused capability conversation, and move straight to paid work."
                  stat="48h response"
                  delay={0.16}
                />
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════════
              HOW WE HIRE — 4-Step Timeline
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="py-24 md:py-28 border-t border-white/[0.07] relative">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0052FF]/[0.03] to-transparent" />
            <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 md:px-8">
              <div className="mb-14 text-center">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#60A5FA]">
                  THE PROCESS
                </span>
                <h2
                  className="mt-3 font-display font-bold text-white tracking-tight"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                >
                  How We Hire
                </h2>
                <p className="mt-3 text-white/60 text-base max-w-lg mx-auto">
                  Straightforward, respectful of your time, and genuinely human.
                </p>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Connector line — desktop */}
                <div className="hidden md:block absolute top-[28px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gradient-to-r from-transparent via-[#0052FF]/50 to-transparent" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
                  {HIRE_STEPS.map((step, idx) => (
                    <div key={step.num} className="relative flex flex-col items-center md:items-start text-center md:text-left">
                      {/* Vertical connector — mobile */}
                      {idx < HIRE_STEPS.length - 1 && (
                        <div className="md:hidden absolute left-7 top-[56px] bottom-[-20px] w-px bg-gradient-to-b from-[#0052FF]/50 to-transparent" />
                      )}

                      {/* Number node */}
                      <div
                        className="relative z-10 h-14 w-14 rounded-full flex items-center justify-center font-display font-black text-lg text-white shrink-0 shadow-lg"
                        style={{
                          background: "linear-gradient(135deg, #1D4ED8, #0052FF)",
                          boxShadow: "0 0 0 4px rgba(0,82,255,0.15), 0 8px 24px rgba(0,82,255,0.3)",
                        }}
                      >
                        {step.num}
                      </div>

                      <div className="mt-5 md:mt-6">
                        <h3 className="font-display text-lg font-bold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-[1.65] text-white/60">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════════
              OPEN VACANCIES
          ═══════════════════════════════════════════════════════════════════ */}
          <section id="open-vacancies" className="py-24 md:py-32 border-t border-white/[0.07] relative">
            <div className="mx-auto max-w-[1360px] px-4 sm:px-6 md:px-8">

              {/* Section Header + Filter Row */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#60A5FA]">
                    OPEN OPPORTUNITIES
                  </span>
                  <h2
                    className="mt-2 font-display font-bold tracking-tight text-white"
                    style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                  >
                    Current Open Vacancies
                  </h2>
                  <p className="mt-2 text-white/60 text-base">
                    Select a role to review responsibilities and submit your profile.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { key: "all", label: `All (${vacancies.length})` },
                    { key: "remote", label: "100% Remote" },
                    { key: "Media Buying", label: "Media Buying" },
                    { key: "Creative", label: "Video & Motion" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilterDepartment(f.key)}
                      className={`relative rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                        filterDepartment === f.key
                          ? "bg-[#0052FF] text-white shadow-[0_0_20px_rgba(0,82,255,0.4)]"
                          : "border border-white/10 bg-white/[0.03] text-white/50 hover:text-white hover:bg-white/[0.08]"
                      }`}
                      style={{ minHeight: "40px" }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vacancy Cards */}
              {filteredVacancies.length > 0 ? (
                <div className="space-y-4">
                  {filteredVacancies.map((job) => {
                    const isExpanded = expandedVacancy === job.slug;
                    const isRemote =
                      job.isRemote ||
                      String(job.location || "").toLowerCase().includes("remote") ||
                      String(job.location || "").toLowerCase().includes("worldwide");

                    return (
                      <div
                        key={job.slug}
                        className="rounded-2xl border border-white/[0.1] bg-[#0E0F18]/90 backdrop-blur-xl transition-all duration-200 hover:border-[#0052FF]/40 shadow-xl overflow-hidden"
                      >
                        {/* Card Header — fully clickable */}
                        <button
                          type="button"
                          onClick={() => setExpandedVacancy(isExpanded ? null : job.slug)}
                          aria-expanded={isExpanded}
                          aria-controls={`job-panel-${job.slug}`}
                          className="w-full text-left"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 sm:p-8 gap-5">
                            <div className="space-y-2.5">
                              {/* Meta chips row */}
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Hiring Now badge */}
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-300">
                                  <span
                                    className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"
                                    style={{ animation: "careers-pulse-green 2s ease-in-out infinite" }}
                                  />
                                  Hiring Now
                                </span>

                                {isRemote ? (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-[#0052FF]/20 border border-[#0052FF]/40 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#60A5FA]">
                                    <Globe size={11} />
                                    <span>100% Remote</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-white/8 border border-white/10 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">
                                    <MapPin size={11} />
                                    <span>Hybrid / Studio</span>
                                  </span>
                                )}

                                {job.department && (
                                  <span className="rounded-md bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 text-white/60 text-[12px]">
                                    {job.department}
                                  </span>
                                )}

                                {job.location && (
                                  <span className="flex items-center gap-1 text-white/50 text-[12px]">
                                    <MapPin size={12} className="text-white/30" />
                                    {job.location}
                                  </span>
                                )}

                                {job.employmentType && (
                                  <span className="flex items-center gap-1 text-white/50 font-mono text-[12px]">
                                    <Clock size={12} className="text-white/30" />
                                    {job.employmentType}
                                  </span>
                                )}

                                {job.salaryRange && (
                                  <span className="inline-flex items-center gap-1 font-mono text-emerald-400 text-[12px] font-bold">
                                    <DollarSign size={12} />
                                    <span>{job.salaryRange}</span>
                                  </span>
                                )}
                              </div>

                              {/* Job Title */}
                              <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                                {job.jobTitle}
                              </h3>

                              {/* One-line description */}
                              {job.description && (
                                <p className="text-sm text-white/60 leading-relaxed max-w-3xl line-clamp-1">
                                  {job.description}
                                </p>
                              )}
                            </div>

                            {/* Right actions */}
                            <div className="flex items-center gap-3 shrink-0 self-start lg:self-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleApplyClick(job.slug)}
                                className="btn-shiny-blue inline-flex h-11 items-center gap-2 rounded-full px-6 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                              >
                                <span>Apply Remotely</span>
                                <ArrowUpRight size={14} />
                              </button>

                              <div
                                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/10 transition-colors pointer-events-none"
                                aria-hidden="true"
                              >
                                <ChevronDown
                                  size={18}
                                  className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#60A5FA]" : ""}`}
                                />
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Expandable Panel — CSS grid rows animation (no bleed) */}
                        <div
                          id={`job-panel-${job.slug}`}
                          className="grid transition-[grid-template-rows] duration-300 ease-out"
                          style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                        >
                          <div className="overflow-hidden">
                            <div className="border-t border-white/[0.07] p-6 sm:p-10 bg-black/30">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left: About + Responsibilities */}
                                <div className="space-y-6">
                                  {job.description && (
                                    <div>
                                      <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#60A5FA] mb-3">
                                        About This Role
                                      </h4>
                                      <p className="text-base leading-[1.7] text-white/70">
                                        {job.description}
                                      </p>
                                    </div>
                                  )}

                                  {job.responsibilities && job.responsibilities.length > 0 && (
                                    <div>
                                      <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#60A5FA] mb-3">
                                        Core Responsibilities
                                      </h4>
                                      <ul className="space-y-3">
                                        {job.responsibilities.map((resp, rIdx) => (
                                          <li key={rIdx} className="flex items-start gap-3">
                                            <span className="mt-0.5 h-5 w-5 rounded-full bg-[#0052FF]/20 border border-[#0052FF]/40 flex items-center justify-center shrink-0">
                                              <Check size={12} className="text-[#60A5FA]" />
                                            </span>
                                            <span className="text-base leading-[1.7] text-white/70">
                                              {resp}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Right: Requirements */}
                                <div className="space-y-6">
                                  {job.requirements && job.requirements.length > 0 && (
                                    <div>
                                      <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#60A5FA] mb-3">
                                        What We Are Looking For
                                      </h4>
                                      <ul className="space-y-3">
                                        {job.requirements.map((req, qIdx) => (
                                          <li key={qIdx} className="flex items-start gap-3">
                                            <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-[#60A5FA] shrink-0" />
                                            <span className="text-base leading-[1.7] text-white/70">
                                              {req}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Panel Footer */}
                              <div className="mt-8 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <p className="text-sm text-white/50">
                                  Ready to make your mark?
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleApplyClick(job.slug)}
                                  className="btn-shiny-blue inline-flex h-11 items-center gap-2 rounded-full px-6 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                                >
                                  Jump to Application Form
                                  <ArrowUpRight size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Empty state
                <div className="rounded-2xl border border-white/10 bg-[#0E0F18]/90 p-16 text-center">
                  <div className="h-16 w-16 rounded-2xl border border-white/10 bg-white/[0.03] grid place-items-center mx-auto mb-5">
                    <Briefcase size={28} className="text-white/30" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">
                    No Specific Roles Open in This Category
                  </h3>
                  <p className="mt-2 text-sm text-white/50 max-w-sm mx-auto">
                    We are always seeking world-class remote creators and media buyers.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleApplyClick("general-talent-pool")}
                    className="mt-6 btn-shiny-blue inline-flex h-11 items-center gap-2 rounded-full px-7 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                  >
                    Submit Speculative Profile
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              )}

              {/* Speculative Banner */}
              <div className="mt-6 relative rounded-2xl overflow-hidden">
                {/* Animated conic gradient border */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    padding: "1px",
                    background: "conic-gradient(from 0deg, #0052FF, #7C3AED, #0EA5E9, #0052FF)",
                    animation: "spin 8s linear infinite",
                    WebkitAnimation: "spin 8s linear infinite",
                  }}
                />
                <div
                  className="absolute inset-[1px] rounded-2xl"
                  style={{ background: "linear-gradient(135deg, #0E0F18 0%, #121526 100%)" }}
                />
                <div className="relative p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-[#60A5FA]" />
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#60A5FA]">
                        Open Speculative Talent Pool
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white">
                      Don&apos;t see your exact role listed?
                    </h3>
                    <p className="mt-2 text-sm text-white/60 max-w-xl leading-relaxed">
                      If you have exceptional skills in 3D design, motion graphics, AI automation, or direct-response copywriting,
                      we create custom roles for elite talent.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyClick("general-talent-pool")}
                    className="rounded-full border border-[#0052FF]/50 bg-[#0052FF]/15 px-7 py-3.5 text-sm font-bold tracking-wide text-[#60A5FA] hover:bg-[#0052FF] hover:text-white hover:border-[#0052FF] transition-all shrink-0 cursor-pointer"
                  >
                    Submit Speculative Profile →
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════════
              APPLICATION FORM
          ═══════════════════════════════════════════════════════════════════ */}
          <section
            ref={formRef}
            className="relative py-24 md:py-32 border-t border-white/[0.07]"
          >
            {/* Soft ambient — using rounded-full blur so it stays circular, never rectangular */}
            <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#0052FF]/8 blur-[140px] translate-x-1/4 translate-y-1/4" />
            <div className="pointer-events-none absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-[#3B82F6]/5 blur-[120px] -translate-x-1/4 -translate-y-1/4" />

            <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 md:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Left Column — Sticky */}
                <div className="lg:col-span-5 lg:sticky lg:top-[120px] lg:self-start space-y-7">
                  <div>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#60A5FA]">
                      REMOTE APPLICATION
                    </span>
                    <h2
                      className="mt-3 font-display font-bold tracking-tight text-white leading-tight"
                      style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
                    >
                      Submit Your Profile.
                      <br />
                      <span
                        className="font-serif italic font-normal"
                        style={{
                          background: "linear-gradient(135deg, #93C5FD 0%, #3B82F6 50%, #1D4ED8 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Show us what you&apos;ve built.
                      </span>
                    </h2>
                    <p className="mt-4 text-base leading-[1.65] text-white/65">
                      We review portfolios with obsessive care. Send us your links, your case numbers,
                      or your showreel. We respect your time with rapid, straightforward decisions.
                    </p>
                  </div>

                  {/* What We Value */}
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4 backdrop-blur-md">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#60A5FA]">
                      What We Value in Candidates
                    </p>
                    {[
                      "Real proof of performance: high ROAS, viral view counts, or clean engineering.",
                      "Extreme remote autonomy: proactive communication, self-starter mentality.",
                      "Commercial empathy: understanding why creative decisions drive business growth.",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 h-5 w-5 rounded-full bg-[#0052FF]/20 border border-[#0052FF]/40 flex items-center justify-center shrink-0">
                          <Check size={12} className="text-[#60A5FA]" />
                        </span>
                        <span className="text-sm text-white/65 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Privacy Notes */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[13px] text-white/40">
                      <ShieldCheck size={14} className="text-[#60A5FA] shrink-0" />
                      <span>Your data and CV are stored in private, encrypted agency archives.</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-white/40">
                      <Zap size={14} className="text-[#60A5FA] shrink-0" />
                      <span>You will receive an email confirmation upon successful submission.</span>
                    </div>
                  </div>
                </div>

                {/* Right Column — Form Card */}
                <div className="lg:col-span-7">
                  <div
                    className="rounded-3xl border border-white/[0.1] bg-[#0E0F18]/95 p-7 sm:p-10 shadow-2xl backdrop-blur-xl"
                    style={{ boxShadow: "0 0 0 1px rgba(0,82,255,0.08), 0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}
                  >
                    {submissionSuccess ? (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-10 text-center space-y-5">
                        <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 grid place-items-center mx-auto text-emerald-400">
                          <CheckCircle2 size={36} />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white">Application Received!</h3>
                        <p className="text-base text-white/65 leading-relaxed max-w-md mx-auto">
                          {submissionSuccess}
                        </p>
                        <button
                          type="button"
                          onClick={() => setSubmissionSuccess(null)}
                          className="rounded-full bg-white px-7 py-3 text-sm font-bold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors cursor-pointer"
                        >
                          Submit Another Profile
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {submissionError && (
                          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{submissionError}</span>
                          </div>
                        )}

                        {/* Honeypot */}
                        <input
                          type="text"
                          name="_hp"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                          className="hidden"
                          tabIndex={-1}
                          autoComplete="off"
                        />

                        {/* Full Name + Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField label="Full Name" required>
                            <div className="relative">
                              <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                              <input
                                ref={nameInputRef}
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. Elena Rostova"
                                className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder-white/30 focus:border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 transition-all"
                                style={{ height: "52px" }}
                              />
                            </div>
                          </FormField>

                          <FormField label="Email Address" required>
                            <div className="relative">
                              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="elena@example.com"
                                className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder-white/30 focus:border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 transition-all"
                                style={{ height: "52px" }}
                              />
                            </div>
                          </FormField>
                        </div>

                        {/* Role + Workplace */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField label="Role Applied For" required>
                            <div className="relative">
                              <Briefcase size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none z-10" />
                              <select
                                value={selectedVacancySlug}
                                onChange={(e) => setSelectedVacancySlug(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-[#12131F] pl-11 pr-10 text-sm text-white focus:border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 transition-all appearance-none"
                                style={{ height: "52px" }}
                              >
                                {vacancies.map((v) => (
                                  <option key={v.slug} value={v.slug}>
                                    {v.jobTitle}
                                    {v.isRemote ? " — Remote" : ""}
                                  </option>
                                ))}
                                <option value="general-talent-pool">
                                  General Remote Talent Pool
                                </option>
                              </select>
                              <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                            </div>
                          </FormField>

                          <FormField label="Workplace Preference">
                            <div className="relative">
                              <Globe size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none z-10" />
                              <select
                                value={workplacePreference}
                                onChange={(e) => setWorkplacePreference(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-[#12131F] pl-11 pr-10 text-sm text-white focus:border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 transition-all appearance-none"
                                style={{ height: "52px" }}
                              >
                                <option value="100% Remote">100% Remote (Worldwide)</option>
                                <option value="Hybrid">Hybrid (Dubai / Remote)</option>
                                <option value="Open to Either">Open to Either</option>
                              </select>
                              <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                            </div>
                          </FormField>
                        </div>

                        {/* Location + Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField label="Current Location & Timezone" required>
                            <div className="relative">
                              <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                              <input
                                type="text"
                                required
                                value={candidateLocation}
                                onChange={(e) => setCandidateLocation(e.target.value)}
                                placeholder="e.g. London, UK (GMT)"
                                className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder-white/30 focus:border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 transition-all"
                                style={{ height: "52px" }}
                              />
                            </div>
                          </FormField>

                          <FormField label="WhatsApp / Phone (Optional)">
                            <div className="relative">
                              <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                              <input
                                type="text"
                                value={phoneWhatsApp}
                                onChange={(e) => setPhoneWhatsApp(e.target.value)}
                                placeholder="+44 7911 123456"
                                className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder-white/30 focus:border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 transition-all"
                                style={{ height: "52px" }}
                              />
                            </div>
                          </FormField>
                        </div>

                        {/* Portfolio URL — full width */}
                        <FormField label="Portfolio / Showreel / LinkedIn URL" required>
                          <div className="relative">
                            <Link size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                            <input
                              type="url"
                              required
                              value={portfolioUrl}
                              onChange={(e) => setPortfolioUrl(e.target.value)}
                              placeholder="https://behance.net/yourname, loom.com/..., or linkedin.com/in/..."
                              className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder-white/30 focus:border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 transition-all"
                              style={{ height: "52px" }}
                            />
                          </div>
                        </FormField>

                        {/* Cover Note — full width with char counter */}
                        <FormField label="Quick Pitch / Highlight Your Best Win (Optional)">
                          <div className="relative">
                            <MessageSquare size={15} className="absolute left-4 top-4 text-white/30 pointer-events-none" />
                            <textarea
                              rows={4}
                              value={coverNote}
                              onChange={(e) => setCoverNote(e.target.value)}
                              placeholder="Briefly tell us about a campaign, creative asset, or project you're most proud of..."
                              className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 transition-all leading-relaxed resize-y"
                              style={{ minHeight: "120px" }}
                            />
                            <span className="absolute bottom-3 right-4 text-[12px] text-white/25 pointer-events-none select-none">
                              {coverNote.length}/500
                            </span>
                          </div>
                        </FormField>

                        {/* CV Upload Dropzone */}
                        <FormField label="Upload CV / Resume (PDF, DOCX — Max 10MB)" required={false}>
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-200 ${
                              isDragOver
                                ? "border-[#0052FF] bg-[#0052FF]/10"
                                : cvFile
                                ? "border-emerald-500/50 bg-emerald-500/5"
                                : cvFileError
                                ? "border-red-500/50 bg-red-500/5"
                                : "border-white/15 bg-white/[0.02] hover:border-[#0052FF]/60 hover:bg-[#0052FF]/5"
                            }`}
                          >
                            {cvFile ? (
                              <>
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 grid place-items-center mb-3">
                                  <FileText size={22} className="text-emerald-400" />
                                </div>
                                <p className="text-sm font-semibold text-white">{cvFileName}</p>
                                <p className="mt-1 text-xs text-white/40">
                                  {(cvFile.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCvFile(null);
                                    setCvFileName("");
                                    setCvFileError("");
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                  }}
                                  className="mt-3 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                >
                                  <X size={12} /> Remove file
                                </button>
                              </>
                            ) : (
                              <>
                                <div
                                  className="h-12 w-12 rounded-xl grid place-items-center mb-3"
                                  style={{ background: "rgba(0,82,255,0.15)", border: "1px solid rgba(0,82,255,0.3)", boxShadow: "0 0 20px rgba(0,82,255,0.2)" }}
                                >
                                  <UploadCloud size={22} className="text-[#60A5FA]" />
                                </div>
                                <p className="text-sm font-semibold text-white">
                                  {isDragOver ? "Drop it here" : "Click or drag to upload your CV"}
                                </p>
                                <p className="mt-1 text-xs text-white/40">PDF or DOCX · Max 10MB · Private & secure</p>
                              </>
                            )}

                            {cvFileError && (
                              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle size={12} /> {cvFileError}
                              </p>
                            )}

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>
                        </FormField>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-shiny-blue inline-flex w-full items-center justify-center gap-2.5 rounded-full text-sm font-bold uppercase tracking-wider text-white disabled:opacity-50 cursor-pointer transition-all"
                          style={{ height: "56px" }}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              <span>Uploading &amp; Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              <span>Submit Remote Application</span>
                              <ArrowUpRight size={16} />
                            </>
                          )}
                        </button>

                        {/* Privacy footer */}
                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1">
                          <span className="flex items-center gap-1.5 text-[13px] text-white/35">
                            <ShieldCheck size={13} className="text-[#60A5FA]" />
                            Encrypted &amp; private
                          </span>
                          <span className="flex items-center gap-1.5 text-[13px] text-white/35">
                            <Zap size={13} className="text-[#60A5FA]" />
                            48h response
                          </span>
                        </div>
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
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  stat,
}: {
  stat: { icon: React.ComponentType<{ size: number; className?: string }>; label: string; value: string; color: string };
}) {
  const Icon = stat.icon;
  return (
    <div
      className="rounded-2xl p-4 backdrop-blur-xl"
      style={{
        background: "rgba(14,15,24,0.85)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="h-9 w-9 rounded-xl grid place-items-center mb-3"
        style={{ background: `${stat.color}22`, border: `1px solid ${stat.color}44` }}
      >
        <Icon size={16} className="text-current" />
      </div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white/40 mb-0.5">
        {stat.label}
      </p>
      <p className="font-display font-bold text-white text-lg leading-tight">{stat.value}</p>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  iconBg,
  iconBorder,
  iconColor,
  title,
  body,
  stat,
  delay,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  title: string;
  body: string;
  stat: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--spotlight-x", `${x}px`);
    ref.current.style.setProperty("--spotlight-y", `${y}px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[#0052FF]/40 hover:-translate-y-1"
      style={{
        boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset",
        animationDelay: `${delay}s`,
      }}
    >
      {/* Hover spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(200px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(37,99,235,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Icon Tile */}
      <div
        className="h-12 w-12 rounded-xl grid place-items-center mb-5"
        style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
      >
        <Icon size={22} style={{ color: iconColor } as React.CSSProperties} />
      </div>

      <h3 className="font-display text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-white/65 leading-[1.65]">{body}</p>

      {/* Footer stat */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#60A5FA]/70">
          {stat}
        </span>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-white/80 mb-2">
        {label}
        {required && <span className="text-[#60A5FA] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
