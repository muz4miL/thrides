"use client";

import React from "react";
import { Calendar, Rocket } from "lucide-react";

interface StepVisualProps {
  stepIndex: number;
}

export function StepVisual({ stepIndex }: StepVisualProps) {
  // Step 1: Free strategy call -> Mini visual: a "30 min" chip with a calendar icon
  if (stepIndex === 0) {
    return (
      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full gold-status-pill gold-shine gold-shine-d1 text-[#FFF1B8]">
          <Calendar size={13} className="text-[#E6B93C]" />
          <span className="font-mono text-[11.5px] font-medium tracking-wide">30 min</span>
        </div>
        <span className="font-mono text-[11px] text-neutral-400 tracking-tight">
          Video Call · No Obligation
        </span>
      </div>
    );
  }

  // Step 2: Your plan -> Mini visual: a small package card with 3 horizontal priority bars at different fills
  if (stepIndex === 1) {
    return (
      <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
          <span>Priority Allocation</span>
          <span className="text-[#E6B93C] font-semibold">Custom Package</span>
        </div>

        <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3">
          {/* Bar 1 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10.5px] font-mono text-neutral-300">
              <span>Positioning & Funnel</span>
              <span className="text-[#F7E08A]">85%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)] w-[85%]"
                style={{ background: "var(--gold-metal)" }}
              />
            </div>
          </div>

          {/* Bar 2 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10.5px] font-mono text-neutral-300">
              <span>Website Performance</span>
              <span className="text-neutral-400">65%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full w-[65%]"
                style={{ background: "linear-gradient(90deg, #7A5A12 0%, #D4AF37 100%)" }}
              />
            </div>
          </div>

          {/* Bar 3 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10.5px] font-mono text-neutral-300">
              <span>Content & Paid Engine</span>
              <span className="text-neutral-400">45%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-neutral-600 w-[45%]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: We build -> Mini visual: a small timeline strip with a "Kickoff" marker
  if (stepIndex === 2) {
    return (
      <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-neutral-400">Timeline & Delivery</span>
          <span className="text-[#F7E08A] flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.7)] animate-pulse" />
            Execution Ready
          </span>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#F7E08A]">
              <Rocket size={13} />
            </div>
            <div>
              <span className="font-display font-medium text-[12.5px] text-[#F5F2EC] block leading-snug">
                Kickoff Marker
              </span>
              <span className="font-mono text-[10.5px] text-neutral-400 block mt-0.5">
                Sprint 1 Milestones Locked
              </span>
            </div>
          </div>

          <span className="font-mono text-[10.5px] font-semibold px-2.5 py-0.5 rounded-md gold-status-pill gold-shine gold-shine-d3">
            <span className="gold-text-gradient">Agreed</span>
          </span>
        </div>
      </div>
    );
  }

  return null;
}

