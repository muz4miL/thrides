"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Monitor,
  FileText,
  Users,
  Search,
  Mail,
  HelpCircle,
  Check,
} from "lucide-react";
import type { ServiceOption } from "./types";

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: "Marketing Consultancy",
    label: "Marketing Consultancy",
    icon: BarChart2,
    feedback: "We'll align on growth bottlenecks, unit economics, and scalable marketing roadmaps.",
  },
  {
    id: "Website Design & Development",
    label: "Website Design & Development",
    icon: Monitor,
    feedback: "Great timing. We build high-converting digital platforms that turn visitors into clients.",
  },
  {
    id: "Content Creation",
    label: "Content Creation",
    icon: FileText,
    feedback: "High-velocity creative that commands attention across every channel.",
  },
  {
    id: "Social Media Marketing",
    label: "Social Media Marketing",
    icon: Users,
    feedback: "Organic and paid reach engineered for maximum community engagement and conversion.",
  },
  {
    id: "SEO",
    label: "SEO",
    icon: Search,
    feedback: "Good choice, we'll bring someone who lives and breathes SEO.",
  },
  {
    id: "Email Marketing",
    label: "Email Marketing",
    icon: Mail,
    feedback: "Automated sequences, segmentation, and retention campaigns that drive repeatable revenue.",
  },
];

const NOT_SURE_OPTION: ServiceOption = {
  id: "Not sure yet",
  label: "Not sure yet",
  icon: HelpCircle,
  feedback: "No worries at all. We'll listen to your goals and recommend the exact best path forward.",
};

interface ChipSelectProps {
  selected: string[];
  onChange: (newSelected: string[]) => void;
}

export function ChipSelect({ selected, onChange }: ChipSelectProps) {
  const isNotSureSelected = selected.includes(NOT_SURE_OPTION.id);

  const toggleService = (serviceId: string) => {
    if (serviceId === NOT_SURE_OPTION.id) {
      if (isNotSureSelected) {
        onChange([]);
      } else {
        onChange([NOT_SURE_OPTION.id]);
      }
      return;
    }

    // Toggle specific service and ensure "Not sure yet" is removed
    const filtered = selected.filter((id) => id !== NOT_SURE_OPTION.id);
    if (filtered.includes(serviceId)) {
      onChange(filtered.filter((id) => id !== serviceId));
    } else {
      onChange([...filtered, serviceId]);
    }
  };

  // Determine feedback text
  let feedbackText = "";
  if (selected.length === 1) {
    if (isNotSureSelected) {
      feedbackText = NOT_SURE_OPTION.feedback;
    } else {
      const match = SERVICE_OPTIONS.find((s) => s.id === selected[0]);
      if (match) feedbackText = match.feedback;
    }
  } else if (selected.length > 1) {
    feedbackText = "A connected multi-channel approach. We'll map how these work together for maximum impact.";
  }

  return (
    <div className="space-y-4">
      {/* 6 Grid Chips */}
      <fieldset className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 border-0 p-0 m-0">
        <legend className="sr-only">Services you need help with</legend>
        {SERVICE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected.includes(opt.id);

          return (
            <button
              key={opt.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggleService(opt.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleService(opt.id);
                }
              }}
              className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 sm:py-3.5 text-left border transition-all duration-200 cursor-pointer select-none ${
                isSelected
                  ? "border-[#0A5CFF] bg-[#0A5CFF]/[0.12] shadow-[0_0_18px_rgba(10,92,255,0.22)] ring-1 ring-[#0A5CFF]/40 -translate-y-[1px]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] hover:-translate-y-[1px]"
              } active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5CFF]`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors shrink-0 ${
                  isSelected
                    ? "bg-[#0A5CFF] text-white"
                    : "bg-white/[0.04] text-neutral-400 group-hover:text-white"
                }`}
              >
                <Icon size={16} />
              </div>

              <span
                className={`font-display text-[13px] sm:text-[13.5px] font-medium leading-snug flex-1 ${
                  isSelected ? "text-white" : "text-neutral-300 group-hover:text-white"
                }`}
              >
                {opt.label}
              </span>

              {/* Checkmark badge when selected */}
              {isSelected && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0A5CFF] text-white shrink-0 animate-in zoom-in-75 duration-150">
                  <Check size={10} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
        {/* 7th Option: Full-width "Not sure yet" option spanning all columns */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isNotSureSelected}
          onClick={() => toggleService(NOT_SURE_OPTION.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleService(NOT_SURE_OPTION.id);
            }
          }}
          className={`col-span-1 sm:col-span-2 md:col-span-3 group relative flex items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:py-3.5 text-left border transition-all duration-200 cursor-pointer select-none ${
            isNotSureSelected
              ? "border-[#0A5CFF] bg-[#0A5CFF]/[0.12] shadow-[0_0_18px_rgba(10,92,255,0.22)] ring-1 ring-[#0A5CFF]/40 -translate-y-[1px]"
              : "border-dashed border-white/10 bg-white/[0.015] hover:border-white/25 hover:bg-white/[0.03] hover:-translate-y-[1px]"
          } active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5CFF]`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors shrink-0 ${
                isNotSureSelected
                  ? "bg-[#0A5CFF] text-white"
                  : "bg-white/[0.04] text-neutral-400 group-hover:text-white"
              }`}
            >
              <HelpCircle size={16} />
            </div>

            <div>
              <span
                className={`font-display text-[13px] sm:text-[13.5px] font-medium leading-snug ${
                  isNotSureSelected ? "text-white" : "text-neutral-300 group-hover:text-white"
                }`}
              >
                Not sure yet
              </span>
              <span className="hidden sm:inline text-neutral-400 text-xs ml-2 font-normal">
                — we&apos;ll help you choose the right path on our call
              </span>
            </div>
          </div>

          {/* Checkmark badge when selected */}
          {isNotSureSelected && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0A5CFF] text-white shrink-0 animate-in zoom-in-75 duration-150">
              <Check size={10} strokeWidth={3} />
            </span>
          )}
        </button>
      </fieldset>

      {/* Live feedback text fading in below chips */}
      <div aria-live="polite" className="min-h-[28px] pt-1">
        <AnimatePresence mode="wait">
          {feedbackText && (
            <motion.p
              key={feedbackText}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="font-serif italic text-[14px] sm:text-[15px] text-[#c3d4ff] leading-relaxed"
            >
              {feedbackText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

