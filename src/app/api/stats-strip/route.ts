import { NextResponse } from "next/server";
import { getCollections } from "@/server/db";

const DEFAULT_PILLS = [
  { id: "d1", value: "3 Years", sortOrder: 0, isActive: true },
  { id: "d2", value: "14+ Businesses", sortOrder: 1, isActive: true },
  { id: "d3", value: "8 Countries", sortOrder: 2, isActive: true },
];

const DEFAULT_MARQUEE = [
  { id: "m1", text: "3 Years Track Record", sortOrder: 0, isActive: true },
  { id: "m2", text: "14+ Businesses Supported", sortOrder: 1, isActive: true },
  { id: "m3", text: "8 Countries Reached", sortOrder: 2, isActive: true },
  { id: "m4", text: "On-Purpose Marketing", sortOrder: 3, isActive: true },
  { id: "m5", text: "Conversion Websites", sortOrder: 4, isActive: true },
  { id: "m6", text: "Measurable Results", sortOrder: 5, isActive: true },
];

const DEFAULT_SETTINGS = {
  marqueeSectionEnabled: true,
  marqueeSpeedPixelsPerSec: 40,
  logoCloudEnabled: true,
};

export async function GET() {
  try {
    const { statPills, marqueeItems, statsLogos, statsStripSettings } = await getCollections();
    const [pills, items, logos, settingsDoc] = await Promise.all([
      statPills.find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      marqueeItems.find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      statsLogos.find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      statsStripSettings.findOne({ id: "default" }),
    ]);

    return NextResponse.json(
      {
        pills: pills.length ? pills.map((p) => ({ ...p, _id: String(p._id) })) : DEFAULT_PILLS,
        marqueeItems: items.length ? items.map((i) => ({ ...i, _id: String(i._id) })) : DEFAULT_MARQUEE,
        logos: logos.map((l) => ({ ...l, _id: String(l._id) })),
        settings: settingsDoc
          ? { ...settingsDoc, _id: String(settingsDoc._id) }
          : DEFAULT_SETTINGS,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: unknown) {
    // Return safe defaults if DB is unavailable
    return NextResponse.json({
      pills: DEFAULT_PILLS,
      marqueeItems: DEFAULT_MARQUEE,
      logos: [],
      settings: DEFAULT_SETTINGS,
    });
  }
}

