"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/[0.1] bg-[#0E0F18] shadow-[0_32px_80px_rgba(0,0,0,0.85)] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Top accent stripe */}
        <div
          className={`h-[2px] w-full ${
            danger
              ? "bg-gradient-to-r from-transparent via-red-500 to-transparent"
              : "bg-gradient-to-r from-transparent via-[#0052FF] to-transparent"
          }`}
        />

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-start gap-4">
            <div
              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                danger
                  ? "border-red-500/20 bg-red-500/10"
                  : "border-[#0052FF]/20 bg-[#0052FF]/10"
              }`}
            >
              <AlertTriangle
                size={18}
                className={danger ? "text-red-400" : "text-[#4385FF]"}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white leading-snug">
                {title}
              </h3>
              {description && (
                <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-2.5 justify-end">
            <button
              onClick={onCancel}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/[0.07] hover:text-white transition-all"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition-all ${
                danger
                  ? "bg-red-600 hover:bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.25)]"
                  : "bg-[#0052FF] hover:bg-blue-500 shadow-[0_0_16px_rgba(0,82,255,0.25)]"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

