"use server";

import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifySessionToken } from "./auth";
import { getCollections } from "./db";
import { triggerServicesRevalidation } from "./services-page-service";
import {
  settingsSchema,
  heroSchema,
  packageSchema,
  comparisonRowSchema,
  processStepSchema,
  checklistItemSchema,
  timelineStepSchema,
  coreServiceSchema,
  faqSchema,
  reorderSchema,
} from "./services-page-schema";

const COOKIE_NAME = "brandit_admin_session";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export type ActionResponse<T = any> = {
  ok: boolean;
  error?: string;
  data?: T;
};

// 1. Settings
export async function saveSpSettingsAction(input: any): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid settings input" };
  }

  try {
    const cols = await getCollections();
    const { _id, ...fields } = parsed.data;
    await cols.spSettings.updateOne(
      {},
      { $set: { ...fields, updatedAt: new Date() } },
      { upsert: true }
    );
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to save settings" };
  }
}

// 2. Hero
export async function saveSpHeroAction(input: any): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = heroSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid hero input" };
  }

  try {
    const cols = await getCollections();
    const { _id, ...fields } = parsed.data;
    await cols.spHero.updateOne(
      {},
      { $set: { ...fields, updatedAt: new Date() } },
      { upsert: true }
    );
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to save hero content" };
  }
}

// 3. Packages
export async function saveSpPackageAction(input: any): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid package input" };
  }

  try {
    const cols = await getCollections();
    const { _id, ...fields } = parsed.data;
    const now = new Date();

    if (_id && ObjectId.isValid(_id)) {
      await cols.spPackages.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...fields, updatedAt: now } }
      );
      triggerServicesRevalidation();
      return { ok: true, data: { id: _id } };
    } else {
      const res = await cols.spPackages.insertOne({
        ...fields,
        createdAt: now,
        updatedAt: now,
      } as any);
      triggerServicesRevalidation();
      return { ok: true, data: { id: res.insertedId.toString() } };
    }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to save package" };
  }
}

export async function deleteSpPackageAction(id: string): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid package ID" };

  try {
    const cols = await getCollections();
    await cols.spPackages.deleteOne({ _id: new ObjectId(id) });
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to delete package" };
  }
}

export async function duplicateSpPackageAction(id: string): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid package ID" };

  try {
    const cols = await getCollections();
    const existing = await cols.spPackages.findOne({ _id: new ObjectId(id) });
    if (!existing) return { ok: false, error: "Package not found" };

    const { _id, ...rest } = existing;
    const count = await cols.spPackages.countDocuments({});
    const now = new Date();
    const copySlug = `${rest.slug}-copy-${Date.now().toString().slice(-4)}`;

    const res = await cols.spPackages.insertOne({
      ...rest,
      slug: copySlug,
      name: `${rest.name} (Copy)`,
      sortOrder: count,
      visible: false,
      createdAt: now,
      updatedAt: now,
    } as any);

    triggerServicesRevalidation();
    return { ok: true, data: { id: res.insertedId.toString() } };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to duplicate package" };
  }
}

export async function toggleSpPackageVisibilityAction(id: string, visible: boolean): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid package ID" };

  try {
    const cols = await getCollections();
    await cols.spPackages.updateOne({ _id: new ObjectId(id) }, { $set: { visible, updatedAt: new Date() } });
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to update package visibility" };
  }
}

// 4. Comparison Rows
export async function saveSpComparisonRowAction(input: any): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = comparisonRowSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid row input" };
  }

  try {
    const cols = await getCollections();
    const { _id, ...fields } = parsed.data;
    const now = new Date();

    if (_id && ObjectId.isValid(_id)) {
      await cols.spComparisonRows.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...fields, updatedAt: now } }
      );
      triggerServicesRevalidation();
      return { ok: true, data: { id: _id } };
    } else {
      const res = await cols.spComparisonRows.insertOne({
        ...fields,
        createdAt: now,
        updatedAt: now,
      } as any);
      triggerServicesRevalidation();
      return { ok: true, data: { id: res.insertedId.toString() } };
    }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to save comparison row" };
  }
}

export async function deleteSpComparisonRowAction(id: string): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid ID" };

  try {
    const cols = await getCollections();
    await cols.spComparisonRows.deleteOne({ _id: new ObjectId(id) });
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to delete comparison row" };
  }
}

// 5. Process Steps (How it works)
export async function saveSpProcessStepAction(input: any): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = processStepSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid step input" };
  }

  try {
    const cols = await getCollections();
    const { _id, ...fields } = parsed.data;
    const now = new Date();

    if (_id && ObjectId.isValid(_id)) {
      await cols.spProcessSteps.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...fields, updatedAt: now } }
      );
      triggerServicesRevalidation();
      return { ok: true, data: { id: _id } };
    } else {
      const res = await cols.spProcessSteps.insertOne({
        ...fields,
        createdAt: now,
        updatedAt: now,
      } as any);
      triggerServicesRevalidation();
      return { ok: true, data: { id: res.insertedId.toString() } };
    }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to save process step" };
  }
}

export async function deleteSpProcessStepAction(id: string): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid step ID" };

  try {
    const cols = await getCollections();
    await cols.spProcessSteps.deleteOne({ _id: new ObjectId(id) });
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to delete process step" };
  }
}

// 6. Checklist Items
export async function saveSpChecklistItemAction(input: any): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = checklistItemSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid checklist item" };
  }

  try {
    const cols = await getCollections();
    const { _id, ...fields } = parsed.data;
    const now = new Date();

    if (_id && ObjectId.isValid(_id)) {
      await cols.spChecklistItems.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...fields, updatedAt: now } }
      );
      triggerServicesRevalidation();
      return { ok: true, data: { id: _id } };
    } else {
      const res = await cols.spChecklistItems.insertOne({
        ...fields,
        createdAt: now,
        updatedAt: now,
      } as any);
      triggerServicesRevalidation();
      return { ok: true, data: { id: res.insertedId.toString() } };
    }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to save checklist item" };
  }
}

export async function deleteSpChecklistItemAction(id: string): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid checklist item ID" };

  try {
    const cols = await getCollections();
    await cols.spChecklistItems.deleteOne({ _id: new ObjectId(id) });
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to delete checklist item" };
  }
}

// 7. Timeline Steps
export async function saveSpTimelineStepAction(input: any): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = timelineStepSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid timeline step" };
  }

  try {
    const cols = await getCollections();
    const { _id, ...fields } = parsed.data;
    const now = new Date();

    if (_id && ObjectId.isValid(_id)) {
      await cols.spTimelineSteps.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...fields, updatedAt: now } }
      );
      triggerServicesRevalidation();
      return { ok: true, data: { id: _id } };
    } else {
      const res = await cols.spTimelineSteps.insertOne({
        ...fields,
        createdAt: now,
        updatedAt: now,
      } as any);
      triggerServicesRevalidation();
      return { ok: true, data: { id: res.insertedId.toString() } };
    }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to save timeline step" };
  }
}

export async function deleteSpTimelineStepAction(id: string): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid timeline step ID" };

  try {
    const cols = await getCollections();
    await cols.spTimelineSteps.deleteOne({ _id: new ObjectId(id) });
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to delete timeline step" };
  }
}

// 8. Core Services
export async function saveSpCoreServiceAction(input: any): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = coreServiceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid core service input" };
  }

  try {
    const cols = await getCollections();
    const { _id, ...fields } = parsed.data;
    const now = new Date();

    if (_id && ObjectId.isValid(_id)) {
      await cols.spCoreServices.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...fields, updatedAt: now } }
      );
      triggerServicesRevalidation();
      return { ok: true, data: { id: _id } };
    } else {
      const res = await cols.spCoreServices.insertOne({
        ...fields,
        createdAt: now,
        updatedAt: now,
      } as any);
      triggerServicesRevalidation();
      return { ok: true, data: { id: res.insertedId.toString() } };
    }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to save core service" };
  }
}

export async function deleteSpCoreServiceAction(id: string): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid core service ID" };

  try {
    const cols = await getCollections();
    await cols.spCoreServices.deleteOne({ _id: new ObjectId(id) });
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to delete core service" };
  }
}

export async function toggleSpCoreServiceVisibilityAction(id: string, visible: boolean): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid ID" };

  try {
    const cols = await getCollections();
    await cols.spCoreServices.updateOne({ _id: new ObjectId(id) }, { $set: { visible, updatedAt: new Date() } });
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to update visibility" };
  }
}

// 9. FAQs
export async function saveSpFaqAction(input: any): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid FAQ input" };
  }

  try {
    const cols = await getCollections();
    const { _id, ...fields } = parsed.data;
    const now = new Date();

    if (_id && ObjectId.isValid(_id)) {
      await cols.spFaqs.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...fields, updatedAt: now } }
      );
      triggerServicesRevalidation();
      return { ok: true, data: { id: _id } };
    } else {
      const res = await cols.spFaqs.insertOne({
        ...fields,
        createdAt: now,
        updatedAt: now,
      } as any);
      triggerServicesRevalidation();
      return { ok: true, data: { id: res.insertedId.toString() } };
    }
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to save FAQ" };
  }
}

export async function deleteSpFaqAction(id: string): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid FAQ ID" };

  try {
    const cols = await getCollections();
    await cols.spFaqs.deleteOne({ _id: new ObjectId(id) });
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to delete FAQ" };
  }
}

export async function toggleSpFaqVisibilityAction(id: string, visible: boolean): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  if (!ObjectId.isValid(id)) return { ok: false, error: "Invalid ID" };

  try {
    const cols = await getCollections();
    await cols.spFaqs.updateOne({ _id: new ObjectId(id) }, { $set: { visible, updatedAt: new Date() } });
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to update visibility" };
  }
}

// 10. General Reorder
export async function reorderSpItemsAction(input: any): Promise<ActionResponse> {
  const session = await verifyAuth();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = reorderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid reorder payload" };
  }

  const { collectionName, orderedIds } = parsed.data;

  try {
    const cols = await getCollections();
    let col: any;

    switch (collectionName) {
      case "packages":
        col = cols.spPackages;
        break;
      case "comparisonRows":
        col = cols.spComparisonRows;
        break;
      case "processSteps":
        col = cols.spProcessSteps;
        break;
      case "checklistItems":
        col = cols.spChecklistItems;
        break;
      case "timelineSteps":
        col = cols.spTimelineSteps;
        break;
      case "coreServices":
        col = cols.spCoreServices;
        break;
      case "faqs":
        col = cols.spFaqs;
        break;
    }

    if (!col) return { ok: false, error: "Unknown collection" };

    const updates = orderedIds.map((id, index) => {
      if (ObjectId.isValid(id)) {
        return col.updateOne({ _id: new ObjectId(id) }, { $set: { sortOrder: index } });
      }
      return Promise.resolve();
    });

    await Promise.all(updates);
    triggerServicesRevalidation();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to reorder items" };
  }
}

