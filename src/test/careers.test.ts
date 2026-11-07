import { describe, it, expect } from "vitest";
import { z } from "zod";

const careerApplicationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  vacancySlug: z.string().min(1),
  candidateLocation: z.string().min(1),
  workplacePreference: z.string().default("100% Remote"),
  portfolioUrl: z.string().url().or(z.string().min(3)),
  message: z.string().optional(),
});

describe("Careers & Remote Vacancy System", () => {
  it("validates remote application payload with portfolio and location", () => {
    const payload = {
      fullName: "Alex Miller",
      email: "alex@remote-creator.com",
      vacancySlug: "senior-performance-marketer",
      candidateLocation: "Berlin, Germany (CET)",
      workplacePreference: "100% Remote",
      portfolioUrl: "https://portfolio.alexmiller.dev",
      message: "Scaled 3 DTC accounts from 50k to 300k/mo with Meta and Google.",
    };

    const parsed = careerApplicationSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.workplacePreference).toBe("100% Remote");
      expect(parsed.data.candidateLocation).toBe("Berlin, Germany (CET)");
    }
  });

  it("accepts speculative applications for general remote talent pool", () => {
    const payload = {
      fullName: "Sarah Chen",
      email: "sarah@chencreatives.com",
      vacancySlug: "general-talent-pool",
      candidateLocation: "Toronto, Canada (EST)",
      portfolioUrl: "https://vimeo.com/sarahchen",
    };

    const parsed = careerApplicationSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.vacancySlug).toBe("general-talent-pool");
      expect(parsed.data.workplacePreference).toBe("100% Remote");
    }
  });

  it("rejects invalid emails for candidate applications", () => {
    const payload = {
      fullName: "Test Candidate",
      email: "not-an-email",
      vacancySlug: "senior-performance-marketer",
      candidateLocation: "Remote",
      portfolioUrl: "https://portfolio.com",
    };

    const parsed = careerApplicationSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });
});
