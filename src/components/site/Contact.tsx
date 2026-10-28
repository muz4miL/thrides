"use client";

import { useState, type FormEvent } from "react";
import { serviceOptions } from "@/content/site";

const field =
  "w-full rounded-2xl border border-input bg-surface px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

export function Contact({
  service,
  setService,
}: {
  service: string;
  setService: (s: string) => void;
}) {
  const [brief, setBrief] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setCopied(false);
    setBrief(
      `Project brief for Brand It\n\nName: ${f.get("name")}\nEmail: ${f.get("email")}\nService: ${f.get("service")}\n\n${f.get("message")}`,
    );
  };

  return (
    <section id="contact" className="shell grid gap-10 px-5 py-14 md:grid-cols-2 md:px-14 md:py-20">
      <div>
        <h2 className="text-[48px] md:text-[clamp(56px,5.2vw,76px)]">
          <span className="display-sans block">Have something</span>
          <span className="display-serif block text-[1.08em]">in mind?</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">Tell us what you’re building.</p>
      </div>
      <div>
        <form onSubmit={submit} className="grid gap-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Demo form · messages aren’t sent yet
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sr-only" htmlFor="name">
              Name
            </label>
            <input id="name" name="name" required placeholder="Name" className={field} />
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              className={field}
            />
          </div>
          <label className="sr-only" htmlFor="service">
            Service
          </label>
          <select
            id="service"
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={field}
          >
            {serviceOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="message">
            Project message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Tell us about your project"
            className={field}
          />
          <button
            type="submit"
            className="mt-1 w-fit rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground"
          >
            Create project brief ↗
          </button>
        </form>
        {brief && (
          <div className="mt-5 rounded-tile border border-border bg-surface p-5" aria-live="polite">
            <p className="text-sm text-muted-foreground">
              Your brief is ready to copy — nothing has been sent.
            </p>
            <pre className="mt-3 whitespace-pre-wrap text-sm">{brief}</pre>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(brief).then(() => setCopied(true))}
              className="mt-4 rounded-full border border-border px-4 py-2 text-sm hover:border-primary"
            >
              {copied ? "Copied" : "Copy brief"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
