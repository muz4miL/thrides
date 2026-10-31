import { ObjectId } from "mongodb";
import { getCollections } from "./db";
import type {
  ServicesPageContent,
} from "./types";
import {
  SEED_SETTINGS,
  SEED_HERO,
  SEED_PACKAGES,
  SEED_COMPARISON_ROWS,
  SEED_PROCESS_STEPS,
  SEED_CHECKLIST_ITEMS,
  SEED_TIMELINE_STEPS,
  SEED_CORE_SERVICES,
  SEED_FAQS,
} from "./services-page-seed";
import { revalidatePath, revalidateTag } from "next/cache";

function formatDoc<T extends { _id?: ObjectId | string; createdAt?: Date; updatedAt?: Date }>(
  doc: T,
  fallbackId: string,
): any {
  return {
    ...doc,
    _id: doc._id ? doc._id.toString() : fallbackId,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export function getFallbackServicesPageContent(): ServicesPageContent {
  return {
    settings: {
      ...SEED_SETTINGS,
      _id: "seed-settings",
      updatedAt: new Date(0),
    },
    hero: {
      ...SEED_HERO,
      _id: "seed-hero",
      updatedAt: new Date(0),
    },
    packages: SEED_PACKAGES.map((p, idx) => ({
      ...p,
      _id: `seed-pkg-${idx}`,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    })),
    comparisonRows: SEED_COMPARISON_ROWS.map((c, idx) => ({
      ...c,
      _id: `seed-comp-${idx}`,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    })),
    processSteps: SEED_PROCESS_STEPS.map((ps, idx) => ({
      ...ps,
      _id: `seed-ps-${idx}`,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    })),
    checklistItems: SEED_CHECKLIST_ITEMS.map((ci, idx) => ({
      ...ci,
      _id: `seed-ci-${idx}`,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    })),
    timelineSteps: SEED_TIMELINE_STEPS.map((ts, idx) => ({
      ...ts,
      _id: `seed-ts-${idx}`,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    })),
    coreServices: SEED_CORE_SERVICES.map((cs, idx) => ({
      ...cs,
      _id: `seed-cs-${idx}`,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    })),
    faqs: SEED_FAQS.map((f, idx) => ({
      ...f,
      _id: `seed-faq-${idx}`,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    })),
  };
}

let seedPromise: Promise<void> | null = null;

export async function ensureServicesPageSeeded(): Promise<void> {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    try {
      const cols = await getCollections();
      const pkgCount = await cols.spPackages.countDocuments({});
      if (pkgCount === 0) {
        const now = new Date();
        await cols.spSettings.updateOne(
          {},
          { $setOnInsert: { ...SEED_SETTINGS, updatedAt: now } },
          { upsert: true }
        );
        await cols.spHero.updateOne(
          {},
          { $setOnInsert: { ...SEED_HERO, updatedAt: now } },
          { upsert: true }
        );

        for (const p of SEED_PACKAGES) {
          await cols.spPackages.updateOne(
            { slug: p.slug },
            { $setOnInsert: { ...p, createdAt: now, updatedAt: now } },
            { upsert: true }
          );
        }

        for (const c of SEED_COMPARISON_ROWS) {
          await cols.spComparisonRows.updateOne(
            { feature: c.feature },
            { $setOnInsert: { ...c, createdAt: now, updatedAt: now } },
            { upsert: true }
          );
        }

        for (const s of SEED_PROCESS_STEPS) {
          await cols.spProcessSteps.updateOne(
            { stepNumber: s.stepNumber },
            { $setOnInsert: { ...s, createdAt: now, updatedAt: now } },
            { upsert: true }
          );
        }

        for (const ci of SEED_CHECKLIST_ITEMS) {
          await cols.spChecklistItems.updateOne(
            { title: ci.title },
            { $setOnInsert: { ...ci, createdAt: now, updatedAt: now } },
            { upsert: true }
          );
        }

        for (const t of SEED_TIMELINE_STEPS) {
          await cols.spTimelineSteps.updateOne(
            { dayLabel: t.dayLabel },
            { $setOnInsert: { ...t, createdAt: now, updatedAt: now } },
            { upsert: true }
          );
        }

        for (const cs of SEED_CORE_SERVICES) {
          await cols.spCoreServices.updateOne(
            { slug: cs.slug },
            { $setOnInsert: { ...cs, createdAt: now, updatedAt: now } },
            { upsert: true }
          );
        }

        for (const f of SEED_FAQS) {
          await cols.spFaqs.updateOne(
            { question: f.question },
            { $setOnInsert: { ...f, createdAt: now, updatedAt: now } },
            { upsert: true }
          );
        }
      }
    } catch (err) {
      console.warn("Non-fatal: ensureServicesPageSeeded notice:", err);
    }
  })();

  return seedPromise;
}

/**
 * Returns public services page content (only visible items, sorted by sortOrder).
 * Falls back to seed defaults if DB fails or is empty.
 */
export async function getServicesPageContent(): Promise<ServicesPageContent> {
  try {
    const cols = await getCollections();
    await ensureServicesPageSeeded();

    const [
      settingsDoc,
      heroDoc,
      packagesDocs,
      comparisonRowsDocs,
      processStepsDocs,
      checklistItemsDocs,
      timelineStepsDocs,
      coreServicesDocs,
      faqsDocs,
    ] = await Promise.all([
      cols.spSettings.findOne({}),
      cols.spHero.findOne({}),
      cols.spPackages.find({ visible: true }).sort({ sortOrder: 1 }).toArray(),
      cols.spComparisonRows.find({}).sort({ sortOrder: 1 }).toArray(),
      cols.spProcessSteps.find({ visible: true }).sort({ sortOrder: 1 }).toArray(),
      cols.spChecklistItems.find({ visible: true }).sort({ sortOrder: 1 }).toArray(),
      cols.spTimelineSteps.find({ visible: true }).sort({ sortOrder: 1 }).toArray(),
      cols.spCoreServices.find({ visible: true }).sort({ sortOrder: 1 }).toArray(),
      cols.spFaqs.find({ visible: true }).sort({ sortOrder: 1 }).toArray(),
    ]);

    const fallback = getFallbackServicesPageContent();

    return {
      settings: settingsDoc
        ? { ...settingsDoc, _id: settingsDoc._id.toString() }
        : fallback.settings,
      hero: heroDoc ? { ...heroDoc, _id: heroDoc._id.toString() } : fallback.hero,
      packages: packagesDocs.length
        ? packagesDocs.map((p, idx) => formatDoc(p, `pkg-${idx}`))
        : fallback.packages,
      comparisonRows: comparisonRowsDocs.length
        ? comparisonRowsDocs.map((c, idx) => formatDoc(c, `comp-${idx}`))
        : fallback.comparisonRows,
      processSteps: processStepsDocs.length
        ? processStepsDocs.map((ps, idx) => formatDoc(ps, `ps-${idx}`))
        : fallback.processSteps,
      checklistItems: checklistItemsDocs.length
        ? checklistItemsDocs.map((ci, idx) => formatDoc(ci, `ci-${idx}`))
        : fallback.checklistItems,
      timelineSteps: timelineStepsDocs.length
        ? timelineStepsDocs.map((ts, idx) => formatDoc(ts, `ts-${idx}`))
        : fallback.timelineSteps,
      coreServices: coreServicesDocs.length
        ? coreServicesDocs.map((cs, idx) => formatDoc(cs, `cs-${idx}`))
        : fallback.coreServices,
      faqs: faqsDocs.length
        ? faqsDocs.map((f, idx) => formatDoc(f, `faq-${idx}`))
        : fallback.faqs,
    };
  } catch (err) {
    console.warn("Could not retrieve services page data from DB, using fallback seed:", err);
    return getFallbackServicesPageContent();
  }
}

/**
 * Returns all content for the admin dashboard (including draft/hidden items).
 */
export async function getAdminServicesPageContent(): Promise<ServicesPageContent> {
  try {
    const cols = await getCollections();
    await ensureServicesPageSeeded();

    const [
      settingsDoc,
      heroDoc,
      packagesDocs,
      comparisonRowsDocs,
      processStepsDocs,
      checklistItemsDocs,
      timelineStepsDocs,
      coreServicesDocs,
      faqsDocs,
    ] = await Promise.all([
      cols.spSettings.findOne({}),
      cols.spHero.findOne({}),
      cols.spPackages.find({}).sort({ sortOrder: 1 }).toArray(),
      cols.spComparisonRows.find({}).sort({ sortOrder: 1 }).toArray(),
      cols.spProcessSteps.find({}).sort({ sortOrder: 1 }).toArray(),
      cols.spChecklistItems.find({}).sort({ sortOrder: 1 }).toArray(),
      cols.spTimelineSteps.find({}).sort({ sortOrder: 1 }).toArray(),
      cols.spCoreServices.find({}).sort({ sortOrder: 1 }).toArray(),
      cols.spFaqs.find({}).sort({ sortOrder: 1 }).toArray(),
    ]);

    const fallback = getFallbackServicesPageContent();

    return {
      settings: settingsDoc
        ? { ...settingsDoc, _id: settingsDoc._id.toString() }
        : fallback.settings,
      hero: heroDoc ? { ...heroDoc, _id: heroDoc._id.toString() } : fallback.hero,
      packages: packagesDocs.length
        ? packagesDocs.map((p, idx) => formatDoc(p, `pkg-${idx}`))
        : fallback.packages,
      comparisonRows: comparisonRowsDocs.length
        ? comparisonRowsDocs.map((c, idx) => formatDoc(c, `comp-${idx}`))
        : fallback.comparisonRows,
      processSteps: processStepsDocs.length
        ? processStepsDocs.map((ps, idx) => formatDoc(ps, `ps-${idx}`))
        : fallback.processSteps,
      checklistItems: checklistItemsDocs.length
        ? checklistItemsDocs.map((ci, idx) => formatDoc(ci, `ci-${idx}`))
        : fallback.checklistItems,
      timelineSteps: timelineStepsDocs.length
        ? timelineStepsDocs.map((ts, idx) => formatDoc(ts, `ts-${idx}`))
        : fallback.timelineSteps,
      coreServices: coreServicesDocs.length
        ? coreServicesDocs.map((cs, idx) => formatDoc(cs, `cs-${idx}`))
        : fallback.coreServices,
      faqs: faqsDocs.length
        ? faqsDocs.map((f, idx) => formatDoc(f, `faq-${idx}`))
        : fallback.faqs,
    };
  } catch (err) {
    console.error("Admin data fetch error, returning fallback:", err);
    return getFallbackServicesPageContent();
  }
}

export function triggerServicesRevalidation() {
  try {
    revalidatePath("/services");
    revalidatePath("/");
    revalidateTag("services-page");
  } catch (e) {
    // Non-fatal if invoked outside request scope
  }
}
