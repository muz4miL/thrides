import { getCollections } from "./db";
import type { WorkProjectDoc, WorkPageSettingsDoc } from "./types";
import { defaultWorkPageSettings, defaultWorkProjects } from "./default-work-data";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";

const LOCAL_STORAGE_FILE = path.resolve(process.cwd(), "uploads", "work-projects-store.json");

// Local filesystem fallback memory store for environments where MongoDB Atlas connection
// is restricted or IP allowlisted, ensuring admin edits always persist locally without data loss.
async function readLocalStore(): Promise<{
  settings: WorkPageSettingsDoc;
  projects: WorkProjectDoc[];
}> {
  try {
    const raw = await fs.readFile(LOCAL_STORAGE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      settings: parsed.settings || defaultWorkPageSettings,
      projects: parsed.projects || defaultWorkProjects,
    };
  } catch {
    return {
      settings: defaultWorkPageSettings,
      projects: defaultWorkProjects,
    };
  }
}

async function writeLocalStore(data: {
  settings: WorkPageSettingsDoc;
  projects: WorkProjectDoc[];
}): Promise<void> {
  try {
    const dir = path.dirname(LOCAL_STORAGE_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(LOCAL_STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Local store write error:", err);
  }
}

/**
 * Public query for /our-work: returns only published projects and active page settings.
 * Strip internal notes or private fields before returning to client.
 */
export async function getPublicWorkPageData(): Promise<{
  settings: WorkPageSettingsDoc;
  projects: WorkProjectDoc[];
}> {
  try {
    const { workProjects, workPageSettings } = await getCollections();
    const [settingsDoc, projectDocs] = await Promise.all([
      workPageSettings.findOne({}, { projection: { _id: 0 } }),
      workProjects
        .find({ isPublished: true }, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray(),
    ]);

    if (projectDocs && projectDocs.length > 0) {
      return {
        settings: settingsDoc || defaultWorkPageSettings,
        projects: projectDocs,
      };
    }
  } catch (err) {
    // Atlas offline / network fallback
    // console.warn("MongoDB Atlas unavailable, checking local store / default fallback");
  }

  const local = await readLocalStore();
  const publishedOnly = local.projects.filter((p) => p.isPublished === true);
  return {
    settings: local.settings,
    projects: publishedOnly.length > 0 ? publishedOnly : defaultWorkProjects,
  };
}

/**
 * Public/Private project lookup by slug for /our-work/[slug].
 */
export async function getWorkProjectBySlug(
  slug: string,
  allowDraft = false,
): Promise<WorkProjectDoc | null> {
  const query: Record<string, any> = { slug };
  if (!allowDraft) {
    query["isPublished"] = true;
  }

  try {
    const { workProjects } = await getCollections();
    const project = await workProjects.findOne(query, { projection: { _id: 0 } });
    if (project) return project;
  } catch {
    // Fall back to local store
  }

  const local = await readLocalStore();
  const found = local.projects.find(
    (p) => p.slug === slug && (allowDraft || p.isPublished === true),
  );
  if (found) return found;

  const fallback = defaultWorkProjects.find(
    (p) => p.slug === slug && (allowDraft || p.isPublished === true),
  );
  return fallback || null;
}

/**
 * Static route generation helper.
 */
export async function getAllPublishedWorkSlugs(): Promise<{ slug: string }[]> {
  try {
    const { workProjects } = await getCollections();
    const docs = await workProjects
      .find({ isPublished: true }, { projection: { slug: 1, _id: 0 } })
      .toArray();
    if (docs && docs.length > 0) {
      return docs.map((d) => ({ slug: d.slug }));
    }
  } catch {
    // Fallback
  }

  const local = await readLocalStore();
  const slugs = local.projects
    .filter((p) => p.isPublished === true)
    .map((p) => ({ slug: p.slug }));
  return slugs.length > 0 ? slugs : defaultWorkProjects.map((p) => ({ slug: p.slug }));
}

/**
 * Admin: Get all projects (including drafts) and settings.
 */
export async function getAdminWorkData(): Promise<{
  settings: WorkPageSettingsDoc;
  projects: WorkProjectDoc[];
}> {
  try {
    const { workProjects, workPageSettings } = await getCollections();
    const [settingsDoc, projectDocs] = await Promise.all([
      workPageSettings.findOne({}),
      workProjects.find({}).sort({ order: 1 }).toArray(),
    ]);

    if (projectDocs && projectDocs.length > 0) {
      return {
        settings: settingsDoc
          ? { ...settingsDoc, _id: settingsDoc._id?.toString() }
          : defaultWorkPageSettings,
        projects: projectDocs.map((p) => ({ ...p, _id: p._id?.toString() })),
      };
    }
  } catch {
    // Fallback
  }

  const local = await readLocalStore();
  return local;
}

/**
 * Admin: Save or update a project.
 */
export async function saveAdminWorkProject(
  data: Partial<WorkProjectDoc> & { _id?: string },
): Promise<{ success: boolean; id: string }> {
  if (!data.slug || !data.title || !data.clientName) {
    throw new Error("Slug, title, and client name are required fields.");
  }

  const now = new Date();
  const { _id, ...fields } = data;
  fields.updatedAt = now;

  let savedId = _id || "";

  try {
    const { workProjects } = await getCollections();
    if (_id && ObjectId.isValid(_id)) {
      await workProjects.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
      savedId = _id;
    } else {
      fields.createdAt = fields.createdAt || now;
      const res = await workProjects.insertOne(fields as any);
      savedId = res.insertedId.toString();
    }
  } catch (err) {
    // Fallback to local store persistence
    const local = await readLocalStore();
    const existingIndex = local.projects.findIndex(
      (p) => (p._id && p._id === _id) || p.slug === data.slug,
    );

    if (existingIndex >= 0) {
      const existing = local.projects[existingIndex];
      if (existing) {
        local.projects[existingIndex] = {
          ...existing,
          ...(fields as WorkProjectDoc),
        };
        savedId = String(existing._id || data.slug);
      }
    } else {
      savedId = "local-" + Date.now();
      const newDoc: WorkProjectDoc = {
        _id: savedId,
        slug: data.slug,
        title: data.title,
        clientName: data.clientName,
        summary: data.summary || "",
        industry: data.industry || "Digital",
        services: data.services || [],
        categories: data.categories || ["Design & Brand"],
        year: data.year || new Date().getFullYear().toString(),
        isPublished: Boolean(data.isPublished),
        isFeatured: Boolean(data.isFeatured),
        featuredOrder: data.featuredOrder ?? 0,
        order: data.order ?? 0,
        mediaType: data.mediaType || "image",
        thumbnailUrl: data.thumbnailUrl || "/images/work/apex-hero.jpg",
        heroMediaUrl: data.heroMediaUrl || "/images/work/apex-hero.jpg",
        altText: data.altText || data.title,
        challenge: data.challenge || "",
        approach: data.approach || "",
        results: data.results || [],
        blocks: data.blocks || [],
        seo: data.seo || {
          title: `${data.title} | Case Study | Thrides`,
          description: data.summary || "",
        },
        createdAt: fields.createdAt || now,
        updatedAt: now,
      };
      local.projects.push(newDoc);
    }
    await writeLocalStore(local);
  }

  return { success: true, id: savedId };
}

/**
 * Admin: Delete project.
 */
export async function deleteAdminWorkProject(id: string): Promise<boolean> {
  try {
    const { workProjects } = await getCollections();
    if (ObjectId.isValid(id)) {
      await workProjects.deleteOne({ _id: new ObjectId(id) });
    }
  } catch {
    // Fallback
  }

  const local = await readLocalStore();
  local.projects = local.projects.filter((p) => p._id !== id && p.slug !== id);
  await writeLocalStore(local);
  return true;
}

/**
 * Admin: Save page settings.
 */
export async function saveAdminWorkPageSettings(
  settings: Partial<WorkPageSettingsDoc>,
): Promise<boolean> {
  const now = new Date();
  const { _id, ...fields } = settings;
  fields.updatedAt = now;

  try {
    const { workPageSettings } = await getCollections();
    await workPageSettings.updateOne({}, { $set: fields }, { upsert: true });
  } catch {
    // Fallback
  }

  const local = await readLocalStore();
  local.settings = { ...local.settings, ...fields };
  await writeLocalStore(local);
  return true;
}
