"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { ChipSelect } from "./ChipSelect";
import { DetailsToggle } from "./DetailsToggle";
import { SuccessState } from "./SuccessState";
import type { ContactFormData, StepNumber } from "./types";

interface FormStepperProps {
  onSuccess?: (name: string) => void;
}

const PREFERRED_TIMES = [
  "Morning (9am - 12pm)",
  "Afternoon (12pm - 5pm)",
  "As soon as possible",
];

export function FormStepper({ onSuccess }: FormStepperProps) {
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState<StepNumber>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ContactFormData>({
    services: [],
    details: "",
    fullName: "",
    email: "",
    company: "",
    preferredTime: "As soon as possible",
    _hp: "",
  });

  // Validation checks
  const isStep1Valid = formData.services.length > 0;
  const isNameValid = formData.fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isStep2Valid = isNameValid && isEmailValid;

  // Handle step progression
  const handleNext = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2);
    } else if (step === 2 && isStep2Valid) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  // Submission to API
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isStep1Valid || !isStep2Valid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          services: formData.services,
          message: formData.details.trim(),
          timeline: formData.preferredTime,
          sourcePage: "/contact",
          _hp: formData._hp,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit enquiry.");
      }

      setStep("success");
      if (onSuccess) onSuccess(formData.fullName);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or reach out directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress percentage
  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  // Animation variants
  const stepVariants = {
    enter: { opacity: 0, x: shouldReduceMotion ? 0 : 12 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : -12 },
  };

  if (step === "success") {
    return <SuccessState fullName={formData.fullName} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Single 1px progress line + "ABOUT 40 SECONDS" mono text */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-neutral-400">
          <span>STEP 0{step} / 03</span>
          <span className="uppercase text-neutral-400">ABOUT 40 SECONDS</span>
        </div>

        <div className="relative h-[2px] w-full rounded-full bg-white/[0.08] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0A5CFF] via-[#0A5CFF] to-[#60A5FA] shadow-[0_0_8px_#0A5CFF]"
            initial={{ width: "33%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Multi-Step Screens with AnimatePresence */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step-1"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display text-[26px] sm:text-[32px] font-extrabold tracking-[-0.035em] text-[#F5F2EC] leading-tight">
                What can we help you with?
              </h2>
            </div>

            {/* Chip Select */}
            <ChipSelect
              selected={formData.services}
              onChange={(services) =>
                setFormData((prev) => ({ ...prev, services }))
              }
            />

            {/* Expandable Optional Details */}
            <DetailsToggle
              value={formData.details}
              onChange={(details) =>
                setFormData((prev) => ({ ...prev, details }))
              }
            />

            {/* Bottom Actions: Continue button appears once selection is made */}
            <div className="flex items-center justify-end pt-4 min-h-[52px]">
              <AnimatePresence>
                {isStep1Valid && (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A5CFF] px-7 py-3 text-[14px] font-semibold text-white shadow-[0_0_24px_rgba(10,92,255,0.4)] hover:bg-[#004ADE] hover:shadow-[0_0_30px_rgba(10,92,255,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span>Continue</span>
                    <ArrowRight size={15} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display text-[26px] sm:text-[32px] font-extrabold tracking-[-0.035em] text-[#F5F2EC] leading-tight">
                Who are we speaking with?
              </h2>
              <p className="mt-1.5 text-[14px] text-neutral-400">
                We&apos;ll send your calendar confirmation and custom plan here.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Full Name */}
              <div className="relative">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Your Name
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    type="text"
                    autoFocus
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isStep2Valid) {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    placeholder="Alex Morgan"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-[15px] text-white placeholder-neutral-600 focus:border-[#0A5CFF] focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#0A5CFF] transition-all"
                  />
                  {isNameValid && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0A5CFF]/20 text-[#0A5CFF]">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              </div>

              {/* Work Email */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Work Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isStep2Valid) {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    placeholder="alex@company.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-[15px] text-white placeholder-neutral-600 focus:border-[#0A5CFF] focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#0A5CFF] transition-all"
                  />
                  {isEmailValid && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0A5CFF]/20 text-[#0A5CFF]">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!isStep2Valid}
                onClick={handleNext}
                className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold transition-all ${
                  isStep2Valid
                    ? "bg-[#0A5CFF] text-white shadow-[0_0_24px_rgba(10,92,255,0.4)] hover:bg-[#004ADE] hover:-translate-y-0.5 cursor-pointer"
                    : "bg-white/[0.06] text-neutral-500 cursor-not-allowed"
                } active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
              >
                <span>Continue</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step-3"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display text-[26px] sm:text-[32px] font-extrabold tracking-[-0.035em] text-[#F5F2EC] leading-tight">
                A few quick details
              </h2>
              <p className="mt-1.5 text-[14px] text-neutral-400">
                Helps us personalize your call and conduct advance research.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Company / Website */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5"
                >
                  Company or Website
                </label>
                <input
                  id="company"
                  type="text"
                  autoFocus
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  placeholder="Acme Co or acme.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-[15px] text-white placeholder-neutral-600 focus:border-[#0A5CFF] focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#0A5CFF] transition-all"
                />
              </div>

              {/* Preferred Contact Time */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Preferred Call Time
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PREFERRED_TIMES.map((timeOption) => {
                    const isSelected = formData.preferredTime === timeOption;
                    return (
                      <button
                        key={timeOption}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            preferredTime: timeOption,
                          }))
                        }
                        className={`rounded-xl px-3 py-2.5 text-xs font-display font-medium border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#0A5CFF] bg-[#0A5CFF]/15 text-white shadow-[0_0_14px_rgba(10,92,255,0.25)]"
                            : "border-white/[0.07] bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/20"
                        } active:scale-[0.98]`}
                      >
                        {timeOption}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Honeypot field (hidden) */}
              <input
                type="text"
                name="_hp"
                value={formData._hp}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, _hp: e.target.value }))
                }
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Error Message if API fails */}
              {submitError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                  {submitError}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A5CFF] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_0_24px_rgba(10,92,255,0.4)] hover:bg-[#004ADE] hover:shadow-[0_0_30px_rgba(10,92,255,0.6)] hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Enquiry</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

