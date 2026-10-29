"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DetailsToggleProps {
  value: string;
  onChange: (val: string) => void;
}

export function DetailsToggle({ value, onChange }: DetailsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-[13px] font-mono text-[#0A5CFF] hover:text-[#3B82F6] transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:underline"
      >
        <span>{isOpen ? "Hide details −" : "Add details +"}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-1.5">
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value.slice(0, 1000))}
                rows={3}
                placeholder="Share any context, timelines, or specific goals you have in mind..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[13.5px] text-white placeholder-neutral-500 focus:border-[#0A5CFF] focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#0A5CFF] transition-all resize-none"
              />

              {/* Hide character counter until typing begins */}
              {value.length > 0 && (
                <div className="flex justify-end text-[11px] font-mono text-neutral-400">
                  <span>{value.length} / 1000</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

