import { describe, it, expect, vi } from "vitest";
import {
  settingsSchema,
  heroSchema,
  packageSchema,
  comparisonRowSchema,
  processStepSchema,
  coreServiceSchema,
  faqSchema,
} from "@/server/services-page-schema";
import { getFallbackServicesPageContent } from "@/server/services-page-service";

// Mock next/headers for server action testing
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => undefined,
  }),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

describe("Services Page Schema Validation", () => {
  it("validates correct settings input", () => {
    const valid = {
      seoTitle: "Services & Packages | Thrides",
      seoDescription: "Start where you are. Grow from there.",
      ogImage: "https://example.com/og.jpg",
    };
    const res = settingsSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects empty SEO title", () => {
    const invalid = {
      seoTitle: "",
      seoDescription: "Desc",
    };
    const res = settingsSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("sanitizes HTML tags from inputs", () => {
    const input = {
      slug: "kickstart",
      name: "<script>alert('hack')</script>Kickstart",
      tagline: "<b>Tagline</b>",
      heading: "Heading",
      theProblem: "Problem",
      deliverables: ["Deliverable 1"],
      timeline: "3 weeks",
      payment: "One-time",
      promise: "Promise",
      investment: "Pricing",
      ctaText: "Get Started",
      visible: true,
      sortOrder: 0,
    };
    const res = packageSchema.safeParse(input);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.name).not.toContain("<script>");
      expect(res.data.tagline).not.toContain("<b>");
    }
  });

  it("validates comparison row", () => {
    const row = {
      feature: "SEO",
      kickstart: "Not included",
      accelerate: "Basic",
      authority: "Full",
      sortOrder: 0,
    };
    expect(comparisonRowSchema.safeParse(row).success).toBe(true);
  });

  it("rejects invalid core service without bullets", () => {
    const invalid = {
      slug: "web-dev",
      title: "Web Dev",
      includedIn: "Kickstart",
      summary: "Summary",
      bullets: [],
    };
    expect(coreServiceSchema.safeParse(invalid).success).toBe(false);
  });

  it("validates FAQ schema", () => {
    const faq = {
      question: "How do we get started?",
      answer: "Book a free strategy call.",
      sortOrder: 0,
      visible: true,
    };
    expect(faqSchema.safeParse(faq).success).toBe(true);
  });
});

describe("Fallback Content Integrity", () => {
  it("provides complete verbatim fallback data when DB is empty", () => {
    const content = getFallbackServicesPageContent();
    expect(content.hero).toBeDefined();
    expect(content.hero?.eyebrow).toBe("SERVICES & PACKAGES");
    expect(content.hero?.headingLine1).toBe("Start where you are.");
    expect(content.hero?.headingLineItalic).toBe("Grow from there.");

    expect(content.packages.length).toBe(3);
    expect(content.packages[0].name).toBe("Kickstart");
    expect(content.packages[1].name).toBe("Accelerate");
    expect(content.packages[2].name).toBe("Authority");

    expect(content.comparisonRows.length).toBeGreaterThan(0);
    expect(content.processSteps.length).toBe(3);
    expect(content.checklistItems.length).toBe(3);
    expect(content.timelineSteps.length).toBe(4);
    expect(content.coreServices.length).toBe(6);
    expect(content.faqs.length).toBe(10);
  });
});

describe("Server Actions Security & Auth", () => {
  it("rejects unauthenticated writes with Unauthorized", async () => {
    const { saveSpPackageAction, deleteSpPackageAction } = await import(
      "@/server/services-page-actions"
    );

    const saveRes = await saveSpPackageAction({
      slug: "test-pkg",
      name: "Test",
      tagline: "Tag",
      heading: "Head",
      theProblem: "Prob",
      deliverables: ["Deliv 1"],
      timeline: "1 week",
      payment: "One-time",
      promise: "Prom",
      investment: "Free",
      ctaText: "CTA",
      visible: true,
      sortOrder: 0,
    });
    expect(saveRes.ok).toBe(false);
    expect(saveRes.error).toBe("Unauthorized");

    const deleteRes = await deleteSpPackageAction("507f1f77bcf86cd799439011");
    expect(deleteRes.ok).toBe(false);
    expect(deleteRes.error).toBe("Unauthorized");
  });
});
