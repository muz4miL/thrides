import { describe, it, expect } from "vitest";
import { z } from "zod";

const showcaseItemSchema = z.object({
  category: z.enum(["ads", "emails", "landing", "ugc"]),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  mediaUrl: z.string().min(1),
  posterUrl: z.string().optional(),
  tag: z.string().optional(),
  highlight: z.string().optional(),
  client: z.string().optional(),
  stats: z.string().optional(),
  ctaText: z.string().optional(),
  accentColor: z.string().optional(),
  theme: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

const showcaseSettingsSchema = z.object({
  heading: z.string().default("Creative that Converts"),
  eyebrow: z.string().default("OUR WORK"),
  autoplaySpeed: z.number().min(500).max(10000).default(3500),
  pauseOnHover: z.boolean().default(true),
  enabledCategories: z.array(z.enum(["ads", "emails", "landing", "ugc"])).default(["ads", "emails", "landing", "ugc"]),
  sectionEnabled: z.boolean().default(true),
});

describe("Showcase Management - Schema & Validation", () => {
  it("validates valid ad item payload", () => {
    const payload = {
      category: "ads",
      title: "Hero Campaign 01",
      mediaUrl: "https://assets.mixkit.co/videos/sample.mp4",
      posterUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
      tag: "Top Performer",
      sortOrder: 0,
      isActive: true,
    };
    const parsed = showcaseItemSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
  });

  it("validates valid email item payload", () => {
    const payload = {
      category: "emails",
      title: "Private VIP Vault Drop",
      subtitle: "Exclusive early access invite",
      mediaUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900",
      tag: "VIP Drop",
      client: "AURA STUDIO",
      ctaText: "Claim Your Invite",
      accentColor: "#F59E0B",
      theme: "dark",
    };
    const parsed = showcaseItemSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.sortOrder).toBe(0);
      expect(parsed.data.isActive).toBe(true);
    }
  });

  it("rejects invalid category", () => {
    const payload = {
      category: "unsupported",
      title: "Test",
      mediaUrl: "https://example.com/test.mp4",
    };
    const parsed = showcaseItemSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });

  it("validates settings payload defaults and limits", () => {
    const emptySettings = {};
    const parsed = showcaseSettingsSchema.parse(emptySettings);
    expect(parsed.heading).toBe("Creative that Converts");
    expect(parsed.eyebrow).toBe("OUR WORK");
    expect(parsed.autoplaySpeed).toBe(3500);
    expect(parsed.enabledCategories).toHaveLength(4);
    expect(parsed.sectionEnabled).toBe(true);
  });
});

