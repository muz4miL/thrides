"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { categoryLabels, type Category, type Project } from "@/content/site";

export function ProjectDialog({
  project,
  onClose,
  onService,
}: {
  project: Project | null;
  onClose: () => void;
  onService: (c: Category) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (project && !d.open) {
      opener.current = document.activeElement;
      d.showModal();
    }
    if (!project && d.open) d.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      onClose={() => {
        onClose();
        (opener.current as HTMLElement | null)?.focus?.();
      }}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-labelledby="project-title"
      className="m-auto max-h-[92vh] w-[min(960px,94vw)] overflow-y-auto rounded-shell border border-border bg-panel p-0 text-foreground backdrop:bg-background/80 backdrop:backdrop-blur-sm"
    >
      {project && (
        <div className="p-5 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {project.categories.map((c) => categoryLabels[c]).join(" · ")}
                {project.isConcept && " · Concept"}
              </p>
              <h2 id="project-title" className="display-sans mt-2 text-4xl md:text-5xl">
                {project.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-surface"
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_260px]">
            <div className="grid gap-3">
              {project.gallery.map((g, i) => (
                <img
                  key={i}
                  src={g}
                  alt={`${project.title} image ${i + 1}`}
                  width={1024}
                  height={1024}
                  className="w-full rounded-tile"
                />
              ))}
            </div>
            <aside className="flex flex-col gap-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Our role</p>
                <p className="mt-1 font-semibold">{project.contribution}</p>
              </div>
              <p className="text-muted-foreground">{project.summary}</p>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Deliverables
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {project.deliverables.map((d) => (
                    <li key={d} className="rounded-full bg-surface px-3 py-1 text-sm">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              {(() => {
                const primaryCat = project.categories[0] ?? "identity";
                return (
                  <button
                    type="button"
                    onClick={() => {
                      ref.current?.close();
                      onService(primaryCat);
                    }}
                    className="mt-auto rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground"
                  >
                    Ask about {categoryLabels[primaryCat]} ↗
                  </button>
                );
              })()}
            </aside>
          </div>
        </div>
      )}
    </dialog>
  );
}
