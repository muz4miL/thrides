import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import dns from "dns";
import path from "path";
import crypto from "crypto";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

async function seed() {
  try {
    await client.connect();
    const db = client.db("brandit");

    const now = new Date().toISOString();

    const initialLogos = [
      {
        id: "meta-partner",
        name: "Meta Business Partner",
        altText: "Meta Business Partner Certification",
        imageUrl: "/uploads/logos/meta-partner.webp",
        storageKey: "meta-partner.webp",
        width: 126,
        height: 51,
        contentHash: crypto.createHash("sha256").update("meta-partner").digest("hex"),
        linkUrl: null,
        sortOrder: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "google-partner",
        name: "Google Partner",
        altText: "Google Premier & Certified Partner",
        imageUrl: "/uploads/logos/google-partner.webp",
        storageKey: "google-partner.webp",
        width: 119,
        height: 51,
        contentHash: crypto.createHash("sha256").update("google-partner").digest("hex"),
        linkUrl: null,
        sortOrder: 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "shopify-plus",
        name: "Shopify Plus",
        altText: "Shopify Plus Certified Partner",
        imageUrl: "/uploads/logos/shopify-plus.webp",
        storageKey: "shopify-plus.webp",
        width: 193,
        height: 56,
        contentHash: crypto.createHash("sha256").update("shopify-plus").digest("hex"),
        linkUrl: null,
        sortOrder: 2,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "klaviyo-partner",
        name: "Klaviyo Advisor Platinum",
        altText: "Klaviyo Elite Platinum Partner",
        imageUrl: "/uploads/logos/klaviyo-partner.webp",
        storageKey: "klaviyo-partner.webp",
        width: 172,
        height: 73,
        contentHash: crypto.createHash("sha256").update("klaviyo-partner").digest("hex"),
        linkUrl: null,
        sortOrder: 3,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Upsert each logo by id
    for (const logo of initialLogos) {
      await db.collection("partner_logos").updateOne(
        { id: logo.id },
        { $set: logo },
        { upsert: true }
      );
    }
    console.log("Partner logos seeded successfully (4 initial logos).");

    // Upsert default settings
    await db.collection("partner_logo_settings").updateOne(
      { id: "default" },
      {
        $setOnInsert: {
          id: "default",
          displayMode: "static",
          marqueeSpeed: "normal",
          logoHeight: 32,
          tone: "original",
          floatEffect: false,
          sectionEnabled: true,
          updatedAt: now,
        },
      },
      { upsert: true }
    );
    console.log("Partner logo settings initialized.");

    const count = await db.collection("partner_logos").countDocuments();
    const settings = await db.collection("partner_logo_settings").findOne({ id: "default" });
    console.log(`\nVerified DB: ${count} partner logos stored, displayMode=${settings.displayMode}, sectionEnabled=${settings.sectionEnabled}`);
  } catch (err) {
    console.error("Migration/seed error:", err);
  } finally {
    await client.close();
  }
}

seed();
