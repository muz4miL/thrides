"use client";

import type { CaseStudyBlock } from "@/server/types";
import { Check, Quote, ArrowUpRight, Play } from "lucide-react";
import { useState, useRef } from "react";

interface CaseStudyBlocksRendererProps {
  blocks: CaseStudyBlock[];
  accentColor?: string | undefined;
}

export function CaseStudyBlocksRenderer({
  blocks,
  accentColor = "#0052FF",
}: CaseStudyBlocksRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-16 sm:space-y-24 md:space-y-32">
      {blocks.map((block) => (
        <section key={block.id} aria-label={`Content block ${block.type}`} className="w-full">
          {renderBlock(block, accentColor)}
        </section>
      ))}
    </div>
  );
}

function renderBlock(block: CaseStudyBlock, accentColor: string) {
  switch (block.type) {
    case "full_width_image": {
      const isLight = block.theme === "light";
      const aspectStyle =
        block.aspectRatio === "21/9"
          ? "aspect-[21/9]"
          : block.aspectRatio === "16/9"
          ? "aspect-[16/9]"
          : "aspect-auto max-h-[750px]";

      return (
        <div
          className={`overflow-hidden rounded-[24px] sm:rounded-[36px] border ${
            isLight ? "bg-[#F5F5F7] border-black/10 text-black" : "bg-[#111114] border-white/10 text-white"
          }`}
        >
          <div className={`relative w-full overflow-hidden ${aspectStyle}`}>
            <img
              src={block.url}
              alt={block.altText}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          {block.caption && (
            <div className="p-4 sm:p-6 border-t border-inherit">
              <p
                className={`font-mono text-[12px] sm:text-[13px] ${
                  isLight ? "text-neutral-600" : "text-neutral-400"
                }`}
              >
                {block.caption}
              </p>
            </div>
          )}
        </div>
      );
    }

    case "two_image_split": {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="overflow-hidden rounded-[20px] sm:rounded-[28px] border border-white/10 bg-[#111114] aspect-[4/3] sm:aspect-[16/11]">
              <img
                src={block.imageLeft.url}
                alt={block.imageLeft.altText}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-[20px] sm:rounded-[28px] border border-white/10 bg-[#111114] aspect-[4/3] sm:aspect-[16/11]">
              <img
                src={block.imageRight.url}
                alt={block.imageRight.altText}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          {(block.caption || block.imageLeft.caption || block.imageRight.caption) && (
            <p className="font-mono text-[12px] text-neutral-400 text-center pt-2">
              {block.caption || block.imageLeft.caption || block.imageRight.caption}
            </p>
          )}
        </div>
      );
    }

    case "portrait_gallery": {
      return (
        <div className="space-y-6">
          {block.heading && (
            <h4 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              {block.heading}
            </h4>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {block.items.map((item, i) => (
              <figure
                key={i}
                className="overflow-hidden rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#111114] flex flex-col"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                  <img
                    src={item.url}
                    alt={item.altText}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                {item.caption && (
                  <figcaption className="p-4 font-mono text-[11px] text-neutral-400 border-t border-white/5">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      );
    }

    case "video": {
      return (
        <div className="overflow-hidden rounded-[24px] sm:rounded-[36px] border border-white/10 bg-[#111114]">
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            <video
              src={block.url}
              poster={block.posterUrl}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          </div>
          {block.caption && (
            <div className="p-4 sm:p-5 border-t border-white/5">
              <p className="font-mono text-[12px] text-neutral-400">{block.caption}</p>
            </div>
          )}
        </div>
      );
    }

    case "text_image_split": {
      const isLeft = block.imagePosition === "left";

      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div
            className={`lg:col-span-6 overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/10 bg-[#111114] aspect-[4/3] ${
              isLeft ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <img
              src={block.imageUrl}
              alt={block.altText}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div
            className={`lg:col-span-6 flex flex-col justify-center space-y-4 ${
              isLeft ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {block.eyebrow && (
              <span
                style={{ color: accentColor }}
                className="font-mono text-[11px] font-bold uppercase tracking-widest block"
              >
                {block.eyebrow}
              </span>
            )}
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {block.heading}
            </h3>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#A1A1AA]">
              {block.body}
            </p>
          </div>
        </div>
      );
    }

    case "editorial_text": {
      return (
        <div className="mx-auto max-w-3xl border-l-2 pl-6 sm:pl-8 py-2" style={{ borderColor: accentColor }}>
          {block.eyebrow && (
            <span
              style={{ color: accentColor }}
              className="font-mono text-[11px] font-bold uppercase tracking-widest block mb-2"
            >
              {block.eyebrow}
            </span>
          )}
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {block.heading}
          </h3>
          <p className="mt-4 text-[16px] sm:text-[17px] text-[#A1A1AA] leading-relaxed">
            {block.body}
          </p>
          {block.highlight && (
            <blockquote className="mt-6 font-serif italic text-lg sm:text-xl text-neutral-200 border-t border-white/10 pt-4">
              "{block.highlight}"
            </blockquote>
          )}
        </div>
      );
    }

    case "verified_results": {
      return (
        <div className="rounded-[28px] sm:rounded-[36px] border border-white/10 bg-gradient-to-b from-[#111116] to-[#0A0A0D] p-8 sm:p-12">
          {block.title && (
            <div className="mb-8">
              <span
                style={{ color: accentColor }}
                className="font-mono text-xs font-bold uppercase tracking-widest block"
              >
                VERIFIED OUTCOMES
              </span>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
                {block.title}
              </h3>
              {block.subtitle && (
                <p className="mt-2 text-sm text-[#A1A1AA]">{block.subtitle}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-white/[0.08]">
            {block.metrics.map((m, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {m.metric}
                </span>
                <span className="font-display text-sm font-bold text-neutral-200 mt-1">
                  {m.label}
                </span>
                {m.context && (
                  <span className="font-mono text-[11px] text-neutral-400 mt-1">
                    {m.context}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "quote_testimonial": {
      return (
        <div className="rounded-[28px] sm:rounded-[36px] border border-white/10 bg-[#111114] p-8 sm:p-12 relative overflow-hidden">
          <Quote
            size={48}
            className="absolute top-6 right-6 text-white/5 pointer-events-none"
          />
          <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl text-white leading-relaxed max-w-2xl">
            "{block.quote}"
          </blockquote>

          <div className="mt-8 flex items-center gap-4 pt-6 border-t border-white/[0.08]">
            {block.avatarUrl && (
              <img
                src={block.avatarUrl}
                alt={block.author}
                className="h-12 w-12 rounded-full object-cover border border-white/20"
              />
            )}
            <div>
              <span className="font-display font-bold text-white text-base block">
                {block.author}
              </span>
              <span className="font-mono text-xs text-neutral-400 block mt-0.5">
                {block.role}
                {block.company ? ` • ${block.company}` : ""}
              </span>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
