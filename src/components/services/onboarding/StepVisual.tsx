"use client";

import React from "react";
import { Calendar, Check, Clock, UserCheck, ShieldCheck } from "lucide-react";

interface StepVisualProps {
  stepIndex: number;
}

export function StepVisual({ stepIndex }: StepVisualProps) {
  // Step 01: Welcome
  if (stepIndex === 0) {
    return (
      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#7A5A12] flex items-center justify-center text-white font-mono text-[13px] font-bold border border-white/20 shadow-inner">
              TH
            </div>
            {/* Pulsing online green dot */}
            <span className="absolute bottom-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0A0A0F]" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-[13.5px] text-[#F5F2EC]">
                Your named contact
              </span>
              <UserCheck size={13} className="text-[#E6B93C]" />
            </div>
            <p className="text-[12px] text-neutral-400 font-mono tracking-tight">
              Direct access via Slack & Email
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10.5px] font-semibold px-2.5 py-1 rounded-full gold-status-pill gold-shine gold-shine-d1">
          <span className="gold-text-gradient">Assigned Day 1</span>
        </span>
      </div>
    );
  }

  // Step 02: Kickoff Call (Hero Bento Visual)
  if (stepIndex === 1) {
    const agendaChips = [
      { label: "Goals", icon: "01" },
      { label: "Timeline", icon: "02" },
      { label: "Deliverables", icon: "03" },
      { label: "Needs", icon: "04" },
    ];

    return (
      <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-4">
        {/* Calendar schedule chip */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full gold-status-pill gold-shine gold-shine-d2 text-[#FFF1B8]">
            <Calendar size={13} className="text-[#E6B93C]" />
            <span className="font-mono text-[11.5px] font-medium tracking-wide">
              First 48 Hours · 30m Deep Dive
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 tracking-tight">
            Video Call + Action Plan
          </span>
        </div>

        {/* Agenda Chips List */}
        <div>
          <div className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-neutral-400 mb-2.5">
            Confirmed Agenda
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {agendaChips.map((chip) => (
              <div
                key={chip.label}
                className="group/chip relative flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 transition-all duration-200 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.05]"
              >
                <span className="font-mono text-[10px] gold-text-gradient font-bold">
                  {chip.icon}
                </span>
                <span className="font-display text-[12.5px] font-medium text-[#F5F2EC]">
                  {chip.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 03: Agreed Response Times
  if (stepIndex === 2) {
    return (
      <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
        {/* Pill badge: Reply within 4h with pulsing gold dot */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full gold-status-pill gold-shine gold-shine-d3 shadow-[0_0_15px_rgba(212,175,55,0.18)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6B93C] opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          </span>
          <span className="font-display font-semibold text-[13px] gold-text-gradient">
            Reply within 4h
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11.5px]">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <span>Guaranteed in service agreement</span>
        </div>
      </div>
    );
  }

  // Step 04: Progress You Can See
  if (stepIndex === 3) {
    return (
      <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-2.5">
        <div className="flex items-center justify-between text-[11.5px] font-mono">
          <span className="text-neutral-400">Live Delivery Status</span>
          <span className="text-[#F7E08A] flex items-center gap-1.5 font-medium">
            <Clock size={12} className="text-[#E6B93C]" /> Real-time tracking
          </span>
        </div>

        {/* Segmented Status Bar: Delivered · In progress · Next */}
        <div className="grid grid-cols-3 gap-2">
          {/* Segment 1: Delivered */}
          <div className="space-y-1.5">
            <div
              className="h-2 rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              style={{ background: "var(--gold-metal)" }}
            />
            <div className="flex items-center justify-between text-[10.5px] font-mono text-neutral-300">
              <span>Delivered</span>
              <Check size={10} className="text-[#E6B93C]" />
            </div>
          </div>

          {/* Segment 2: In progress (with shimmering pulse/gradient) */}
          <div className="space-y-1.5">
            <div className="relative h-2 rounded-full overflow-hidden bg-neutral-800">
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#B8860B] via-[#FFF1B8] to-[#B8860B] animate-[shimmer_2s_infinite]"
                style={{
                  backgroundSize: "200% 100%",
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10.5px] font-mono text-[#F5F2EC]">
              <span>In progress</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.8)] animate-pulse" />
            </div>
          </div>

          {/* Segment 3: Next */}
          <div className="space-y-1.5">
            <div className="h-2 rounded-full bg-white/[0.08]" />
            <div className="flex items-center justify-between text-[10.5px] font-mono text-neutral-500">
              <span>Next</span>
              <span>—</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
