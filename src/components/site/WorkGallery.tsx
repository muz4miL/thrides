"use client";

import { useMemo, useState } from "react";
import { categoryLabels, projects, type Category, type Project } from "@/content/site";
import { SectionHeading } from "./SectionHeading";

type Filter = "all" | Category;
const filters: Filter[] = ["all", "identity", "social", "ads", "packages"];

export function WorkGallery({
  filter,
  setFilter,
  onOpen,
}: {
  filter: Filter;
  setFilter: (f: Filter) => void;
  onOpen: (p: Project) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const list = useMemo(
    () => projects.filter((p) => filter === "all" || p.categories.includes(filter)),
    [filter],
  );
  const ordered =
    filter === "all" ? [...list].sort((a, b) => Number(b.featured) - Number(a.featured)) : list;
  const shown = expanded ? ordered : ordered.slice(0, 6);

  return (
    <section id="work" className="shell px-4 py-14 md:px-10 md:py-20">
      <SectionHeading label="Selected work" sans="Let the work" serif="do the talking." />
      <div
        role="group"
        aria-label="Filter work"
        className="no-scrollbar mx-auto mt-10 flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-border bg-surface p-1.5 [scrollbar-width:none] md:w-fit"
      >
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => {
              setFilter(f);
              setExpanded(false);
            }}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm transition-colors md:px-5 ${filter === f ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {f === "all" ? "All" : categoryLabels[f]}
          </button>
        ))}
      </div>

      <div key={filter} className="rise-in mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <button key={p.id} type="button" onClick={() => onOpen(p)} className="group text-left">
            <div className="relative aspect-square overflow-hidden rounded-tile bg-surface">
              <img
                src={p.cover}
                alt={`${p.title} preview`}
                width={1024}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {p.isConcept && (
                <span className="absolute left-3 top-3 rounded-full bg-panel/80 px-2.5 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  Concept
                </span>
              )}
            </div>
            <div className="mt-4 flex items-start justify-between gap-3 px-1">
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight">{p.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {p.categories[0] ? categoryLabels[p.categories[0]] : ""}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {p.contribution}
              </span>
            </div>
          </button>
        ))}
      </div>

      {ordered.length > 6 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium hover:border-primary"
          >
            {expanded ? "Show less" : `Show more (${ordered.length - 6})`}
          </button>
        </div>
      )}
    </section>
  );
}
