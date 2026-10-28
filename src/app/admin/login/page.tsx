"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/site/Wordmark";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
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
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] px-4 text-[#09090B]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block">
            <Wordmark variant="black" className="h-7 w-auto" />
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.04] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
            <ShieldCheck size={13} className="text-black" />
            <span>Management Console</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#09090B]">
            Sign in to Administration
          </h1>
          <p className="mt-1 text-xs text-[#71717A]">
            Authorized personnel only. Sessions are cryptographically signed.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          {errorMessage && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-50 p-3.5 text-xs text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-2">
                Administrator Username or Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#A1A1AA]">
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@brandit.agency or admin"
                  className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] py-3 pl-10 pr-4 text-sm text-[#09090B] placeholder-neutral-400 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-2">
                Secure Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#A1A1AA]">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] py-3 pl-10 pr-4 text-sm text-[#09090B] placeholder-neutral-400 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? "Authenticating..." : "Authorize Access"}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Autofill Helper */}
          <div className="mt-6 rounded-2xl border border-black/[0.06] bg-[#FAFAFA] p-3.5 text-center">
            <p className="text-[11px] text-[#71717A]">
              Default Credentials:{" "}
              <code className="font-semibold text-black">admin@brandit.agency</code>
            </p>
            <button
              type="button"
              onClick={handleAutofill}
              className="mt-2 text-xs font-bold text-black underline underline-offset-4 hover:text-neutral-600 cursor-pointer"
            >
              Click here to autofill credentials
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#A1A1AA]">
          <Link href="/" className="hover:text-black transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
