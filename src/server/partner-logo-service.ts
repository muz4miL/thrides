import { getDb } from "./db";
import { revalidatePath, revalidateTag } from "next/cache";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { put, del } from "@vercel/blob";
import type { PartnerLogoDoc, PartnerLogoSettingsDoc } from "./types";

const COLLECTION_LOGOS = "partner_logos";
const COLLECTION_SETTINGS = "partner_logo_settings";

export const DEFAULT_PARTNER_SETTINGS: PartnerLogoSettingsDoc = {
  id: "default",
  displayMode: "static",
  marqueeSpeed: "normal",
  logoHeight: 32,
  tone: "original",
  floatEffect: false,
  sectionEnabled: true,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_PARTNER_LOGOS: Omit<PartnerLogoDoc, "_id">[] = [
  {
    id: "meta-partner",
    name: "Meta Business Partner",
    altText: "Meta Business Partner Certification",
    imageUrl: "/uploads/logos/meta-partner.webp",
    storageKey: "meta-partner.webp",
    width: 126,
    height: 51,
    contentHash: "seed-meta-partner-hash",
    linkUrl: null,
    sortOrder: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "google-partner",
    name: "Google Partner",
    altText: "Google Premier & Certified Partner",
    imageUrl: "/uploads/logos/google-partner.webp",
    storageKey: "google-partner.webp",
    width: 119,
    height: 51,
    contentHash: "seed-google-partner-hash",
    linkUrl: null,
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "shopify-plus",
    name: "Shopify Plus",
    altText: "Shopify Plus Certified Partner",
    imageUrl: "/uploads/logos/shopify-plus.webp",
    storageKey: "shopify-plus.webp",
    width: 193,
    height: 56,
    contentHash: "seed-shopify-plus-hash",
    linkUrl: null,
    sortOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "klaviyo-partner",
    name: "Klaviyo Advisor Platinum",
    altText: "Klaviyo Elite Platinum Partner",
    imageUrl: "/uploads/logos/klaviyo-partner.webp",
    storageKey: "klaviyo-partner.webp",
    width: 172,
    height: 73,
    contentHash: "seed-klaviyo-partner-hash",
    linkUrl: null,
    sortOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function ensurePartnerLogosSeeded() {
  const db = await getDb();
  const count = await db.collection(COLLECTION_LOGOS).countDocuments();
  if (count === 0) {
    await db.collection(COLLECTION_LOGOS).insertMany(INITIAL_PARTNER_LOGOS as any);
  }

  const settingsDoc = await db.collection(COLLECTION_SETTINGS).findOne({ id: "default" });
  if (!settingsDoc) {
    await db.collection(COLLECTION_SETTINGS).insertOne(DEFAULT_PARTNER_SETTINGS as any);
  }
}

export async function getPartnerLogoSettings(): Promise<PartnerLogoSettingsDoc> {
  try {
    const db = await getDb();
    const doc = await db.collection<PartnerLogoSettingsDoc>(COLLECTION_SETTINGS).findOne({ id: "default" });
    if (!doc) {
      return DEFAULT_PARTNER_SETTINGS;
    }
    return {
      id: doc.id || "default",
      displayMode: doc.displayMode || "static",
      marqueeSpeed: doc.marqueeSpeed || "normal",
      logoHeight: doc.logoHeight || 32,
      tone: doc.tone || "original",
      floatEffect: Boolean(doc.floatEffect),
      sectionEnabled: doc.sectionEnabled !== false,
      updatedAt: doc.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error fetching partner logo settings:", err);
    return DEFAULT_PARTNER_SETTINGS;
  }
}

export async function getAllPartnerLogos(): Promise<{ logos: PartnerLogoDoc[]; settings: PartnerLogoSettingsDoc }> {
  try {
    await ensurePartnerLogosSeeded();
    const db = await getDb();
    const logos = await db
      .collection<PartnerLogoDoc>(COLLECTION_LOGOS)
      .find({})
      .sort({ sortOrder: 1, createdAt: 1 })
      .toArray();

    const settings = await getPartnerLogoSettings();
    return {
      logos: logos.map((l) => ({
        id: l.id || String(l._id),
        name: l.name,
        altText: l.altText,
        imageUrl: l.imageUrl,
        storageKey: l.storageKey,
        width: l.width,
        height: l.height,
        contentHash: l.contentHash,
        linkUrl: l.linkUrl || null,
        sortOrder: l.sortOrder ?? 0,
        isActive: l.isActive !== false,
        createdAt: l.createdAt || new Date().toISOString(),
        updatedAt: l.updatedAt || new Date().toISOString(),
      })),
      settings,
    };
  } catch (err) {
    console.error("Error fetching all partner logos:", err);
    return {
      logos: INITIAL_PARTNER_LOGOS as PartnerLogoDoc[],
      settings: DEFAULT_PARTNER_SETTINGS,
    };
  }
}

export async function getPublicPartnerLogos(): Promise<{ logos: PartnerLogoDoc[]; settings: PartnerLogoSettingsDoc }> {
  try {
    const { logos, settings } = await getAllPartnerLogos();
    const activeLogos = logos.filter((l) => l.isActive);
    return {
      logos: activeLogos,
      settings,
    };
  } catch (err) {
    console.error("Error getting public partner logos:", err);
    return {
      logos: INITIAL_PARTNER_LOGOS as PartnerLogoDoc[],
      settings: DEFAULT_PARTNER_SETTINGS,
    };
  }
}

// Magic bytes validation
export function validateMagicBytes(buffer: Buffer): { isValid: boolean; format: string | null; isSolidWarning: boolean } {
  if (buffer.length < 4) return { isValid: false, format: null, isSolidWarning: false };

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, format: "png", isSolidWarning: false };
  }

  // WebP: RIFF ... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { isValid: true, format: "webp", isSolidWarning: false };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, format: "jpeg", isSolidWarning: true };
  }

  // AVIF: ....ftypavif
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 12).includes("ftypavif")) {
    return { isValid: true, format: "avif", isSolidWarning: false };
  }

  return { isValid: false, format: null, isSolidWarning: false };
}

export async function processAndUploadLogo({
  buffer,
  originalFilename,
  name,
  altText,
  linkUrl,
}: {
  buffer: Buffer;
  originalFilename: string;
  name?: string;
  altText?: string;
  linkUrl?: string | null;
}): Promise<{ logo: PartnerLogoDoc; warning?: string }> {
  const db = await getDb();

  // 1. Max total check
  const totalCount = await db.collection(COLLECTION_LOGOS).countDocuments();
  if (totalCount >= 12) {
    throw new Error("Maximum of 12 partner logos reached. Please remove an existing logo first.");
  }

  // 2. Validate Magic Bytes
  const magic = validateMagicBytes(buffer);
  if (!magic.isValid) {
    throw new Error("Invalid file format. Only transparent PNG, WebP, or AVIF images are allowed.");
  }

  // 3. Inspect metadata with Sharp
  const initialMeta = await sharp(buffer).metadata();
  const maxDimension = Math.max(initialMeta.width || 0, initialMeta.height || 0);
  if (maxDimension < 64) {
    throw new Error("Image is too small. Logo must be at least 64px on its longest side.");
  }

  // 4. Sharp transformation: auto-trim padding, cap height at 160px, convert to WebP
  let pipeline = sharp(buffer).trim();
  if ((initialMeta.height || 0) > 160) {
    pipeline = pipeline.resize({ height: 160, withoutEnlargement: true });
  }

  const processedBuffer = await pipeline
    .webp({ quality: 85, effort: 6 })
    .toBuffer();

  const finalMeta = await sharp(processedBuffer).metadata();
  const hasAlpha = Boolean(finalMeta.hasAlpha);

  let warning: string | undefined = undefined;
  if (!hasAlpha || magic.isSolidWarning) {
    warning = "This image has a solid background and won't float cleanly. Use a transparent PNG/WebP.";
  }

  // 5. Deduplication check by SHA-256 contentHash
  const contentHash = crypto.createHash("sha256").update(processedBuffer).digest("hex");
  const existingWithHash = await db.collection<PartnerLogoDoc>(COLLECTION_LOGOS).findOne({ contentHash });
  if (existingWithHash) {
    throw new Error(`A logo with this exact image is already uploaded (${existingWithHash.name}).`);
  }

  // 6. Filename & Storage
  const uniqueId = crypto.randomUUID();
  const filename = `${uniqueId}.webp`;
  let publicUrl = `/uploads/logos/${filename}`;
  let storageKey = filename;

  // Use Vercel Blob if available, else local disk
  if (process.env["BLOB_READ_WRITE_TOKEN"]) {
    try {
      const blob = await put(`logos/${filename}`, processedBuffer, {
        access: "public",
        contentType: "image/webp",
      });
      publicUrl = blob.url;
      storageKey = blob.url;
    } catch (blobErr) {
      console.warn("Vercel Blob failed, falling back to local disk:", blobErr);
      const localDir = path.resolve(process.cwd(), "public", "uploads", "logos");
      await fs.mkdir(localDir, { recursive: true });
      await fs.writeFile(path.join(localDir, filename), processedBuffer);
    }
  } else {
    const localDir = path.resolve(process.cwd(), "public", "uploads", "logos");
    await fs.mkdir(localDir, { recursive: true });
    await fs.writeFile(path.join(localDir, filename), processedBuffer);
  }

  // 7. Sanitize name & altText
  const cleanBaseName = path
    .basename(originalFilename, path.extname(originalFilename))
    .replace(/[-_]+/g, " ")
    .trim();
  const finalName = name?.trim() || cleanBaseName || "Partner Logo";
  const finalAltText = altText?.trim() || `${finalName} partner certification`;

  // 8. DB Insertion with atomicity rollback
  const highestOrderDoc = await db
    .collection<PartnerLogoDoc>(COLLECTION_LOGOS)
    .find({})
    .sort({ sortOrder: -1 })
    .limit(1)
    .toArray();
  const nextSortOrder = (highestOrderDoc[0]?.sortOrder ?? -1) + 1;

  const now = new Date().toISOString();
  const newLogo: Omit<PartnerLogoDoc, "_id"> = {
    id: uniqueId,
    name: finalName,
    altText: finalAltText,
    imageUrl: publicUrl,
    storageKey,
    width: finalMeta.width || 120,
    height: finalMeta.height || 40,
    contentHash,
    linkUrl: linkUrl || null,
    sortOrder: nextSortOrder,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.collection(COLLECTION_LOGOS).insertOne(newLogo as any);
  } catch (dbErr) {
    // Rollback storage upload
    if (process.env["BLOB_READ_WRITE_TOKEN"] && storageKey.startsWith("http")) {
      try {
        await del(storageKey);
      } catch {}
    } else {
      try {
        await fs.unlink(path.resolve(process.cwd(), "public", "uploads", "logos", filename));
      } catch {}
    }
    throw new Error("Failed to persist logo to database. Upload rolled back.");
  }

  // Revalidate public caches
  revalidatePath("/");
  revalidatePath("/admin");
  revalidateTag("partner-logos");

  return warning
    ? { logo: newLogo as PartnerLogoDoc, warning }
    : { logo: newLogo as PartnerLogoDoc };
}

export async function deletePartnerLogo(id: string): Promise<boolean> {
  const db = await getDb();
  const doc = await db.collection<PartnerLogoDoc>(COLLECTION_LOGOS).findOne({ id });
  if (!doc) {
    return false;
  }

  // Delete from DB first
  await db.collection(COLLECTION_LOGOS).deleteOne({ id });

  // Delete from storage
  if (doc.storageKey) {
    if (doc.storageKey.startsWith("http")) {
      try {
        await del(doc.storageKey);
      } catch (err) {
        console.warn("Failed to delete blob from Vercel Blob storage:", err);
      }
    } else {
      try {
        const filePath = path.resolve(process.cwd(), "public", "uploads", "logos", doc.storageKey);
        await fs.unlink(filePath);
      } catch (err) {
        console.warn("Failed to delete local file:", err);
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidateTag("partner-logos");
  return true;
}

export async function updatePartnerLogo(
  id: string,
  updates: {
    name?: string;
    altText?: string;
    linkUrl?: string | null;
    isActive?: boolean;
  }
): Promise<PartnerLogoDoc | null> {
  const db = await getDb();
  const updatePayload: Record<string, any> = { updatedAt: new Date().toISOString() };

  if (updates.name !== undefined) updatePayload["name"] = updates.name.trim();
  if (updates.altText !== undefined) updatePayload["altText"] = updates.altText.trim();
  if (updates.linkUrl !== undefined) updatePayload["linkUrl"] = updates.linkUrl ? updates.linkUrl.trim() : null;
  if (updates.isActive !== undefined) updatePayload["isActive"] = Boolean(updates.isActive);

  const res = await db
    .collection<PartnerLogoDoc>(COLLECTION_LOGOS)
    .findOneAndUpdate({ id }, { $set: updatePayload }, { returnDocument: "after" });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidateTag("partner-logos");
  return (res as any) || null;
}

export async function reorderPartnerLogos(orderIds: string[]): Promise<boolean> {
  const db = await getDb();
  const operations = orderIds.map((id, index) => ({
    updateOne: {
      filter: { id },
      update: { $set: { sortOrder: index, updatedAt: new Date().toISOString() } },
    },
  }));

  if (operations.length > 0) {
    await db.collection(COLLECTION_LOGOS).bulkWrite(operations);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidateTag("partner-logos");
  return true;
}

export async function updatePartnerLogoSettings(
  updates: {
    displayMode?: "static" | "marquee";
    marqueeSpeed?: "slow" | "normal" | "fast";
    logoHeight?: number;
    tone?: "original" | "muted" | "mono-white";
    floatEffect?: boolean;
    sectionEnabled?: boolean;
  }
): Promise<PartnerLogoSettingsDoc> {
  const db = await getDb();
  const payload: Record<string, any> = { updatedAt: new Date().toISOString() };

  if (updates.displayMode !== undefined) payload["displayMode"] = updates.displayMode;
  if (updates.marqueeSpeed !== undefined) payload["marqueeSpeed"] = updates.marqueeSpeed;
  if (updates.logoHeight !== undefined) payload["logoHeight"] = Math.max(24, Math.min(48, Number(updates.logoHeight)));
  if (updates.tone !== undefined) payload["tone"] = updates.tone;
  if (updates.floatEffect !== undefined) payload["floatEffect"] = Boolean(updates.floatEffect);
  if (updates.sectionEnabled !== undefined) payload["sectionEnabled"] = Boolean(updates.sectionEnabled);

  await db
    .collection(COLLECTION_SETTINGS)
    .updateOne({ id: "default" }, { $set: payload }, { upsert: true });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidateTag("partner-logos");

  return getPartnerLogoSettings();
}
