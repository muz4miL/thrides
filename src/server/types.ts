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
    budgetRange?: string;
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
  status: "new" | "in_review" | "contacted" | "archived";
  emailNotificationSent: boolean;
  emailNotificationError?: string;
  submittedAt: Date;
  ipHash?: string;
}

export interface AdminUserDoc {
  _id?: ObjectId | string;
  email: string;
  passwordHash: string;
  role: "admin" | "editor";
  failedLoginAttempts: number;
  lockoutUntil?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
}
