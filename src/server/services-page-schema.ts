import { z } from "zod";

// Helper to strip HTML / dangerous tags from inputs
const sanitizeText = (val: string) => val.replace(/<[^>]*>?/gm, "").trim();

export const settingsSchema = z.object({
  _id: z.string().optional(),
  seoTitle: z.string().min(1, "SEO title is required").max(120),
  seoDescription: z.string().min(1, "SEO description is required").max(300),
  ogImage: z.string().optional().default(""),
});

export const heroSchema = z.object({
  _id: z.string().optional(),
  eyebrow: z.string().min(1).max(60).transform(sanitizeText),
  headingLine1: z.string().min(1).max(100).transform(sanitizeText),
  headingLineItalic: z.string().min(1).max(100).transform(sanitizeText),
  subCopy: z.string().min(1).max(300).transform(sanitizeText),
  ctaLeftText: z.string().min(1).max(30).transform(sanitizeText),
  ctaRightText: z.string().min(1).max(40).transform(sanitizeText),
  ctaHref: z.string().min(1).max(120),
  exploreLabel: z.string().min(1).max(50).transform(sanitizeText),
  heroImageUrl: z.string().min(1).max(300),
});

export const packageSchema = z.object({
  _id: z.string().optional(),
  slug: z.string().min(1).max(60),
  name: z.string().min(1).max(60).transform(sanitizeText),
  tagline: z.string().min(1).max(120).transform(sanitizeText),
  heading: z.string().min(1).max(200).transform(sanitizeText),
  theProblem: z.string().min(1).max(500).transform(sanitizeText),
  deliverables: z.array(z.string().min(1).max(200).transform(sanitizeText)).min(1, "At least one deliverable required"),
  timeline: z.string().min(1).max(80).transform(sanitizeText),
  payment: z.string().min(1).max(80).transform(sanitizeText),
  promise: z.string().min(1).max(300).transform(sanitizeText),
  investment: z.string().min(1).max(80).transform(sanitizeText),
  ctaText: z.string().min(1).max(60).transform(sanitizeText),
  badge: z.string().max(40).optional().default("").transform(sanitizeText),
  isPopular: z.boolean().optional().default(false),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const comparisonRowSchema = z.object({
  _id: z.string().optional(),
  feature: z.string().min(1).max(100).transform(sanitizeText),
  kickstart: z.string().min(1).max(200).transform(sanitizeText),
  accelerate: z.string().min(1).max(200).transform(sanitizeText),
  authority: z.string().min(1).max(200).transform(sanitizeText),
  sortOrder: z.number().int().default(0),
});

export const processStepSchema = z.object({
  _id: z.string().optional(),
  stepNumber: z.string().min(1).max(10).transform(sanitizeText),
  timeLabel: z.string().min(1).max(30).transform(sanitizeText),
  title: z.string().min(1).max(80).transform(sanitizeText),
  desc: z.string().min(1).max(300).transform(sanitizeText),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const checklistItemSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1).max(100).transform(sanitizeText),
  desc: z.string().min(1).max(300).transform(sanitizeText),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const timelineStepSchema = z.object({
  _id: z.string().optional(),
  dayLabel: z.string().min(1).max(30).transform(sanitizeText),
  title: z.string().min(1).max(80).transform(sanitizeText),
  desc: z.string().min(1).max(300).transform(sanitizeText),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const coreServiceSchema = z.object({
  _id: z.string().optional(),
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(100).transform(sanitizeText),
  includedIn: z.string().min(1).max(100).transform(sanitizeText),
  summary: z.string().min(1).max(500).transform(sanitizeText),
  bullets: z.array(z.string().min(1).max(200).transform(sanitizeText)).min(1, "At least one bullet point required"),
  imageUrl: z.string().max(300).default(""),
  imageAlt: z.string().max(100).default("").transform(sanitizeText),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const faqSchema = z.object({
  _id: z.string().optional(),
  question: z.string().min(1).max(200).transform(sanitizeText),
  answer: z.string().min(1).max(1000).transform(sanitizeText),
  sortOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const reorderSchema = z.object({
  collectionName: z.enum([
    "packages",
    "comparisonRows",
    "processSteps",
    "checklistItems",
    "timelineSteps",
    "coreServices",
    "faqs",
  ]),
  orderedIds: z.array(z.string().min(1)).min(1),
});

