import { MongoClient, Db, Collection } from "mongodb";
import dns from "dns";
import type {
  SiteSettingsDoc,
  ServiceDoc,
  PortfolioDoc,
  CaseStudyDoc,
  TestimonialDoc,
  FaqDoc,
  StudioCategoryDoc,
  StudioEquipmentDoc,
  VacancyDoc,
  SubmissionDoc,
  AdminUserDoc,
  WorkProjectDoc,
  WorkPageSettingsDoc,
} from "./types";

// Ensure DNS resolution succeeds across Windows Node SRV lookups
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in environments where setServers is restricted
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let indexesCreated = false;

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    throw new Error(
      "MONGODB_URI environment variable is missing. Please configure it in your server environment or .env.local.",
    );
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db("brandit");

  if (!indexesCreated) {
    indexesCreated = true;
    createIndexes(cachedDb).catch((err) => {
      console.error("Non-fatal: Failed to ensure database indexes:", err);
    });
  }

  return cachedDb;
}

export async function getCollections() {
  const db = await getDb();
  return {
    siteSettings: db.collection<SiteSettingsDoc>("site_settings"),
    services: db.collection<ServiceDoc>("services"),
    portfolio: db.collection<PortfolioDoc>("portfolio"),
    caseStudies: db.collection<CaseStudyDoc>("case_studies"),
    testimonials: db.collection<TestimonialDoc>("testimonials"),
    faqs: db.collection<FaqDoc>("faqs"),
    studioCategories: db.collection<StudioCategoryDoc>("studio_categories"),
    studioEquipment: db.collection<StudioEquipmentDoc>("studio_equipment"),
    vacancies: db.collection<VacancyDoc>("vacancies"),
    submissions: db.collection<SubmissionDoc>("submissions"),
    adminUsers: db.collection<AdminUserDoc>("admin_users"),
    workProjects: db.collection<WorkProjectDoc>("work_projects"),
    workPageSettings: db.collection<WorkPageSettingsDoc>("work_page_settings"),
  };
}

async function createIndexes(db: Db) {
  try {
    await Promise.all([
      db.collection("services").createIndex({ slug: 1 }, { unique: true }),
      db.collection("services").createIndex({ order: 1, isPublished: 1 }),
      db.collection("portfolio").createIndex({ order: 1, isPublished: 1 }),
      db.collection("case_studies").createIndex({ slug: 1 }, { unique: true }),
      db.collection("case_studies").createIndex({ isPublished: 1 }),
      db.collection("work_projects").createIndex({ slug: 1 }, { unique: true }),
      db.collection("work_projects").createIndex({ order: 1, isPublished: 1 }),
      db.collection("work_projects").createIndex({ isFeatured: 1, featuredOrder: 1 }),
      db.collection("studio_categories").createIndex({ slug: 1 }, { unique: true }),
      db.collection("studio_categories").createIndex({ order: 1 }),
      db.collection("studio_equipment").createIndex({ categoryId: 1, order: 1 }),
      db.collection("vacancies").createIndex({ slug: 1 }, { unique: true }),
      db.collection("vacancies").createIndex({ isOpen: 1, isArchived: 1 }),
      db.collection("submissions").createIndex({ submittedAt: -1, type: 1 }),
      db.collection("admin_users").createIndex({ email: 1 }, { unique: true }),
    ]);
  } catch (err) {
    console.warn("Index creation notice:", err);
  }
}
