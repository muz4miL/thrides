"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/site/Wordmark";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, Sparkles } from "lucide-react";
import { adminLoginFn } from "@/api/admin";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const resolvedEmail = email.trim().includes("@")
      ? email.trim()
      : `${email.trim()}@brandit.agency`;

    try {
      const res = await adminLoginFn({
        data: {
          email: resolvedEmail,
          password,
        },
      });

      if (res.success) {
        window.location.href = "/admin";
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "Invalid administrative credentials. Access attempt logged.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofill = () => {
    setEmail("admin@brandit.agency");
    setPassword("BrandIt2026AdminSecure!");
    setErrorMessage(null);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#08080B] px-4 py-12 text-white selection:bg-[#0052FF] selection:text-white overflow-hidden">
      {/* Background Cinematic Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[360px] w-[620px] rounded-full bg-[#0052FF]/12 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-[240px] w-[400px] rounded-full bg-[#4385FF]/8 blur-[110px]"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <Wordmark variant="white" className="h-8 w-auto" />
          </div>

          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4385FF] animate-pulse" />
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-neutral-300">
                MANAGEMENT CONSOLE
              </span>
            </div>
          </div>

          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.03em] text-white">
            Sign in to{" "}
            <span className="font-serif italic font-normal text-[#4385FF]">Administration</span>
          </h1>
          <p className="mt-2 text-xs text-neutral-400">
            Authorized personnel only. Sessions are cryptographically verified.
          </p>
        </div>

        {/* Luxury Glassmorphic Card */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0E0F18]/90 p-7 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
          {/* Top specular hairline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#0052FF]/40 to-transparent"
          />

          {errorMessage && (
            <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Administrator Username or Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@brandit.agency"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-[#0052FF] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#0052FF] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Secure Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-[#0052FF] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#0052FF] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0052FF] py-4 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_28px_rgba(0,82,255,0.45)] transition-all hover:bg-[#0043DB] hover:shadow-[0_0_36px_rgba(0,82,255,0.6)] disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? "Authenticating Session..." : "Authorize Access"}</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          {/* Quick Autofill Helper */}
          <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <p className="text-[11px] text-neutral-400">
              Default Credentials:{" "}
              <code className="font-mono text-neutral-200">admin@brandit.agency</code>
            </p>
            <button
              type="button"
              onClick={handleAutofill}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[11px] font-semibold text-neutral-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
            >
              <Sparkles size={11} className="text-[#4385FF]" />
              <span>Click here to autofill credentials</span>
            </button>
          </div>
        </div>

        {/* Return to site */}
        <div className="mt-8 text-center text-xs text-neutral-500">
          <Link href="/" className="hover:text-white transition-colors duration-200">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
