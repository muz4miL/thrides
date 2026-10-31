import type { ObjectId } from "mongodb";

export interface SiteSettingsDoc {
  _id?: ObjectId | string;
  agencyName: string;
  tagline: string;
  contactEmail: string;
  phoneWhatsApp: string;
  whatsappLink: string;
  discoveryCallUrl?: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  globalSeo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
  updatedAt: Date;
}

export interface ServiceDoc {
  _id?: ObjectId | string;
  slug: string; // e.g. "strategy-growth-systems"
  title: string;
  body: string;
  visibleTags: string[];
  coverImage?: string;
  imageAlt?: string;
  detailedContent?: {
    summary: string;
    deliverables: string[];
    howItWorks?: string;
    faqs?: { question: string; answer: string }[];
  };
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioDoc {
  _id?: ObjectId | string;
  title: string;
  outcomeLine: string;
  categories: string[];
  mediaType: "image" | "video";
  mediaUrl: string;
  posterUrl?: string;
  altText: string;
  projectDetailSlug?: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface CaseStudyDoc {
  _id?: ObjectId | string;
  slug: string;
  clientName: string;
  industry: string;
  challenge: string;
  objectives: string[];
  strategy: string;
  execution: string[];
  results: { metric: string; label: string }[];
  mediaGallery: { url: string; caption?: string; altText: string }[];
  testimonialRef?: string;
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
  isPublished: boolean;
  publishedAt?: Date;
  updatedAt: Date;
}

export interface TestimonialDoc {
  _id?: ObjectId | string;
  quote: string;
  clientName: string;
  clientTitle: string;
  companyName: string;
  companyLogoUrl?: string;
  order: number;
  isPublished: boolean;
}

export interface FaqDoc {
  _id?: ObjectId | string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
}

export interface StudioCategoryDoc {
  _id?: ObjectId | string;
  name: string;
  slug: string;
  order: number;
  isPublished: boolean;
}

export interface StudioEquipmentDoc {
  _id?: ObjectId | string;
  categoryId: string; // references StudioCategoryDoc._id string or slug
  name: string;
  brandModel?: string;
  specifications: string;
  imageUrl?: string;
  availability: "available_at_studio" | "available_upon_request";
  order: number;
  isPublished: boolean;
}

export interface VacancyDoc {
  _id?: ObjectId | string;
  slug: string;
  jobTitle: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract";
  description: string;
  responsibilities: string[];
  requirements: string[];
  isOpen: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubmissionDoc {
  _id?: ObjectId | string;
  type: "contact" | "studio" | "career";
  data: {
    fullName: string;
    email: string;
    phoneWhatsApp?: string;
    company?: string;
    packageInterest?: string;
    serviceOfInterest?: string;
    services?: string[];
    budgetRange?: string;
    timeline?: string;
    websiteUrl?: string;
    sourcePage?: string;
    message?: string;
    // Studio
    shootType?: string;
    preferredDate?: string;
    duration?: string;
    equipmentRequirements?: string;
    // Career
    vacancyId?: string;
    vacancyTitle?: string;
    candidateLocation?: string;
    portfolioUrl?: string;
    cvStorageKey?: string;
    cvOriginalFilename?: string;
  };
  status: "new" | "in_review" | "contacted" | "qualified" | "closed" | "archived";
  internalNotes?: string;
  idempotencyKey?: string;
  emailNotificationSent: boolean;
  emailNotificationError?: string | null;
  submittedAt: Date;
  ipHash?: string;
}

export interface AdminUserDoc {
  _id?: ObjectId | string;
  email: string;
  passwordHash: string;
  role: "admin" | "editor";
  failedLoginAttempts: number;
  lockoutUntil?: Date | null;
  lastLoginAt?: Date;
  createdAt: Date;
}

// ──────────────────────────────────────────────────────────
// MODULAR CASE STUDY BLOCKS & WORK PORTFOLIO MODELS
// ──────────────────────────────────────────────────────────

export type CaseStudyBlockType =
  | "full_width_image"
  | "two_image_split"
  | "portrait_gallery"
  | "video"
  | "text_image_split"
  | "editorial_text"
  | "verified_results"
  | "quote_testimonial";

export interface FullWidthImageBlock {
  type: "full_width_image";
  id: string;
  url: string;
  altText: string;
  caption?: string;
  theme?: "dark" | "light";
  aspectRatio?: "16/9" | "21/9" | "auto";
}

export interface TwoImageSplitBlock {
  type: "two_image_split";
  id: string;
  imageLeft: { url: string; altText: string; caption?: string };
  imageRight: { url: string; altText: string; caption?: string };
  caption?: string;
}

export interface PortraitGalleryBlock {
  type: "portrait_gallery";
  id: string;
  heading?: string;
  items: { url: string; altText: string; caption?: string }[];
}

export interface VideoBlock {
  type: "video";
  id: string;
  url: string;
  posterUrl?: string;
  caption?: string;
  autoplay?: boolean;
}

export interface TextImageSplitBlock {
  type: "text_image_split";
  id: string;
  eyebrow?: string;
  heading: string;
  body: string;
  imageUrl: string;
  altText: string;
  imagePosition: "left" | "right";
}

export interface EditorialTextBlock {
  type: "editorial_text";
  id: string;
  eyebrow?: string;
  heading: string;
  body: string;
  highlight?: string;
}

export interface VerifiedResultsBlock {
  type: "verified_results";
  id: string;
  title?: string;
  subtitle?: string;
  metrics: { metric: string; label: string; context?: string }[];
}

export interface QuoteTestimonialBlock {
  type: "quote_testimonial";
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatarUrl?: string;
}

export type CaseStudyBlock =
  | FullWidthImageBlock
  | TwoImageSplitBlock
  | PortraitGalleryBlock
  | VideoBlock
  | TextImageSplitBlock
  | EditorialTextBlock
  | VerifiedResultsBlock
  | QuoteTestimonialBlock;

export interface WorkProjectDoc {
  _id?: ObjectId | string;
  slug: string;
  title: string;
  clientName: string;
  summary: string;
  industry: string;
  services: string[];
  categories: string[];
  year: string;
  externalUrl?: string;
  isPublished: boolean;
  isDraft?: boolean;
  isFeatured: boolean;
  featuredOrder: number;
  order: number;
  mediaType: "image" | "video";
  thumbnailUrl: string;
  heroMediaUrl: string;
  mobileMediaUrl?: string;
  posterUrl?: string;
  altText: string;
  focalPoint?: { x: number; y: number };
  accentColor?: string;
  isConceptWork?: boolean;
  challenge: string;
  approach: string;
  results: { metric: string; label: string; context?: string }[];
  testimonial?: {
    quote: string;
    clientName: string;
    clientTitle: string;
    companyName: string;
  };
  blocks: CaseStudyBlock[];
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// ── SERVICES PAGE CONTENT ─────────────────────────────────────────────────

export interface SpSettingsDoc {
  _id?: ObjectId | string;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  updatedAt: Date;
}

export interface SpHeroDoc {
  _id?: ObjectId | string;
  eyebrow: string;
  headingLine1: string;
  headingLineItalic: string;
  subCopy: string;
  ctaLeftText: string;
  ctaRightText: string;
  ctaHref: string;
  exploreLabel: string;
  heroImageUrl: string;
  updatedAt: Date;
}

export interface SpPackageDoc {
  _id?: ObjectId | string;
  slug: string;
  name: string;
  tagline: string;
  heading: string;
  theProblem: string;
  deliverables: string[];
  timeline: string;
  payment: string;
  promise: string;
  investment: string;
  ctaText: string;
  badge?: string;
  isPopular?: boolean;
  sortOrder: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpComparisonRowDoc {
  _id?: ObjectId | string;
  feature: string;
  kickstart: string;
  accelerate: string;
  authority: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpProcessStepDoc {
  _id?: ObjectId | string;
  stepNumber: string;
  timeLabel: string;
  title: string;
  desc: string;
  sortOrder: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpChecklistItemDoc {
  _id?: ObjectId | string;
  title: string;
  desc: string;
  sortOrder: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpTimelineStepDoc {
  _id?: ObjectId | string;
  dayLabel: string;
  title: string;
  desc: string;
  sortOrder: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpCoreServiceDoc {
  _id?: ObjectId | string;
  slug: string;
  title: string;
  includedIn: string;
  summary: string;
  bullets: string[];
  imageUrl: string;
  imageAlt: string;
  sortOrder: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpFaqDoc {
  _id?: ObjectId | string;
  question: string;
  answer: string;
  sortOrder: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Serialised (plain objects) versions for client consumption
export type SpSettingsSer = Omit<SpSettingsDoc, "_id"> & { _id: string };
export type SpHeroSer = Omit<SpHeroDoc, "_id"> & { _id: string };
export type SpPackageSer = Omit<SpPackageDoc, "_id" | "createdAt" | "updatedAt"> & { _id: string; createdAt: string; updatedAt: string };
export type SpComparisonRowSer = Omit<SpComparisonRowDoc, "_id" | "createdAt" | "updatedAt"> & { _id: string; createdAt: string; updatedAt: string };
export type SpProcessStepSer = Omit<SpProcessStepDoc, "_id" | "createdAt" | "updatedAt"> & { _id: string; createdAt: string; updatedAt: string };
export type SpChecklistItemSer = Omit<SpChecklistItemDoc, "_id" | "createdAt" | "updatedAt"> & { _id: string; createdAt: string; updatedAt: string };
export type SpTimelineStepSer = Omit<SpTimelineStepDoc, "_id" | "createdAt" | "updatedAt"> & { _id: string; createdAt: string; updatedAt: string };
export type SpCoreServiceSer = Omit<SpCoreServiceDoc, "_id" | "createdAt" | "updatedAt"> & { _id: string; createdAt: string; updatedAt: string };
export type SpFaqSer = Omit<SpFaqDoc, "_id" | "createdAt" | "updatedAt"> & { _id: string; createdAt: string; updatedAt: string };

export interface ServicesPageContent {
  settings: SpSettingsSer | null;
  hero: SpHeroSer | null;
  packages: SpPackageSer[];
  comparisonRows: SpComparisonRowSer[];
  processSteps: SpProcessStepSer[];
  checklistItems: SpChecklistItemSer[];
  timelineSteps: SpTimelineStepSer[];
  coreServices: SpCoreServiceSer[];
  faqs: SpFaqSer[];
}

export interface WorkPageSettingsDoc {
  _id?: ObjectId | string;
  heroEyebrow: string;
  heroHeadingLine1: string;
  heroHeadingLine2: string;
  heroSupportingCopy: string;
  heroMediaUrl: string;
  heroProjectAnnotation: string;
  heroProjectSlug?: string;
  galleryIntro: string;
  closingCtaHeadingLine1: string;
  closingCtaHeadingLine2: string;
  closingCtaCopy: string;
  closingCtaButtonText: string;
  closingCtaDestination: string;
  motionPreset: "subtle" | "standard" | "reduced";
  categoryOrder: string[];
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
  updatedAt: Date;
}

