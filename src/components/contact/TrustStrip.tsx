"use client";

import React, { useState } from "react";
import { Clock, Calendar, ShieldCheck, User } from "lucide-react";

export function TrustStrip() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="space-y-6">
      {/* 3 Trust Signals */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] sm:text-[13px] text-neutral-300">
        <div className="inline-flex items-center gap-2">
          <Clock size={14} className="text-[#0A5CFF] shrink-0" />
          <span>Reply within 4h</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <Calendar size={14} className="text-[#0A5CFF] shrink-0" />
          <span>Free 30-min call</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#0A5CFF] shrink-0" />
          <span>No sales pitch</span>
        </div>
      </div>

      {/* Named Point of Contact */}
      <div className="inline-flex items-center gap-3 pt-1">
        <div className="relative shrink-0">
          <div className="h-9 w-9 rounded-full overflow-hidden border border-white/20 bg-neutral-800 flex items-center justify-center shadow-inner">
            {!imgError ? (
              <img
                src="/images/contact-sarah.png"
                alt="Sarah"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={16} className="text-neutral-400" />
            )}
          </div>
          {/* Pulsing online emerald dot */}
          <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#0A0A0F]" />
          </span>
        </div>

        <span className="text-[13px] sm:text-[13.5px] font-medium text-neutral-300">
          Sarah, your point of contact
        </span>
      </div>
    </div>
  );
}

