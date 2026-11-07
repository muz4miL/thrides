import { getCollections } from "./db";
import { randomUUID } from "crypto";
import type { ShowcaseItemDoc, ShowcaseSettingsDoc, ShowcaseCategory } from "./types";

export const DEFAULT_SHOWCASE_SETTINGS: ShowcaseSettingsDoc = {
  id: "default",
  sectionBadge: "OUR WORK",
  headingPrefix: "Creative that",
  headingItalic: "Converts",
  marqueeSpeedSeconds: 32,
  sectionEnabled: true,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_SHOWCASE_ITEMS: Omit<ShowcaseItemDoc, "_id">[] = [
  // ── Ads Creative Videos (Phone Mockups) ──
  {
    id: "ads-1",
    category: "ads",
    title: "Skincare Hydration Ad",
    videoUrl: "/videos/ads/optimized/13014537_2160_3840_24fps.mp4",
    posterUrl: "/videos/ads/optimized/13014537_2160_3840_24fps.webp",
    sortOrder: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ads-2",
    category: "ads",
    title: "Industrial Logistics Ad",
    videoUrl: "/videos/ads/optimized/17084724_1080_1920_29fps.mp4",
    posterUrl: "/videos/ads/optimized/17084724_1080_1920_29fps.webp",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ads-3",
    category: "ads",
    title: "Urban Fashion Campaign",
    videoUrl: "/videos/ads/optimized/5561960-uhd_2160_3840_25fps.mp4",
    posterUrl: "/videos/ads/optimized/5561960-uhd_2160_3840_25fps.webp",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ads-4",
    category: "ads",
    title: "Culinary & Dining Feature",
    videoUrl: "/videos/ads/optimized/6664406-uhd_2160_3744_30fps.mp4",
    posterUrl: "/videos/ads/optimized/6664406-uhd_2160_3744_30fps.webp",
    sortOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ads-5",
    category: "ads",
    title: "Digital App Showcase",
    videoUrl: "/videos/ads/optimized/7616839-hd_1080_1920_24fps.mp4",
    posterUrl: "/videos/ads/optimized/7616839-hd_1080_1920_24fps.webp",
    sortOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── UGC Videos (Phone Mockups) ──
  {
    id: "ugc-1",
    category: "ugc",
    title: "Creator Product Unboxing",
    videoUrl: "/videos/ads/optimized/17084724_1080_1920_29fps.mp4",
    posterUrl: "/videos/ads/optimized/17084724_1080_1920_29fps.webp",
    sortOrder: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ugc-2",
    category: "ugc",
    title: "Mobile App Walkthrough",
    videoUrl: "/videos/ads/optimized/7616839-hd_1080_1920_24fps.mp4",
    posterUrl: "/videos/ads/optimized/7616839-hd_1080_1920_24fps.webp",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ugc-3",
    category: "ugc",
    title: "Morning Routine Lifestyle",
    videoUrl: "/videos/ads/optimized/13014537_2160_3840_24fps.mp4",
    posterUrl: "/videos/ads/optimized/13014537_2160_3840_24fps.webp",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ugc-4",
    category: "ugc",
    title: "Chef Food Prep Reel",
    videoUrl: "/videos/ads/optimized/6664406-uhd_2160_3744_30fps.mp4",
    posterUrl: "/videos/ads/optimized/6664406-uhd_2160_3744_30fps.webp",
    sortOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ugc-5",
    category: "ugc",
    title: "Streetwear Fit Check",
    videoUrl: "/videos/ads/optimized/5561960-uhd_2160_3840_25fps.mp4",
    posterUrl: "/videos/ads/optimized/5561960-uhd_2160_3840_25fps.webp",
    sortOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Email Newsletter Cards ──
  {
    id: "email-1",
    category: "emails",
    title: "Voltex Recon Drop",
    sender: "VOLTEX ACTIVE",
    subject: "The Recon Drop Is Live ⚡",
    tag: "LIMITED EDITION",
    heroImg: "/images/case-studies/voltex-thumb.webp",
    heading: "NO RESTOCKS. THE RECON DROP.",
    subheading: "Engineered for speed, durability, and relentless focus. Only 250 units worldwide.",
    ctaText: "SECURE YOUR DROP >",
    accentColor: "#EF4444",
    theme: "dark",
    sortOrder: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "email-2",
    category: "emails",
    title: "Aura Coffee Reserve",
    sender: "AURA COFFEE",
    subject: "Your Private Reserve Roast ☕",
    tag: "SINGLE ORIGIN",
    heroImg: "/images/case-studies/apex-hero.webp",
    heading: "Welcome to Pure Craft Coffee",
    subheading: "Handcrafted Italian roast. Freshly packed within 24 hours of small-batch roasting.",
    ctaText: "EXPLORE THE ROAST >",
    accentColor: "#0056F5",
    theme: "light",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "email-3",
    category: "emails",
    title: "Luminate Clinic Special",
    sender: "LUMINATE CLINIC",
    subject: "Save $250 On Winter HydraGlow ✨",
    tag: "SPECIAL OFFER",
    heroImg: "/images/case-studies/pulse-hero.webp",
    heading: "Save $250 Before Our Offer Ends!",
    subheading: "Bespoke clinical dermatology and restorative medical aesthetics for lasting skin radiance.",
    ctaText: "CLAIM WINTER SPECIAL >",
    accentColor: "#0284C7",
    theme: "light",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "email-4",
    category: "emails",
    title: "Rise Bakery Drop",
    sender: "RISE BAKERY",
    subject: "Fresh Sourdough & Pastries At Your Door 🥐",
    tag: "MORNING DROP",
    heroImg: "/images/case-studies/apex-detail-1.webp",
    heading: "Baked At 4 AM. Delivered At 7 AM.",
    subheading: "Warm butter croissants, rustic sourdough, and artisan jams delivered straight to your home.",
    ctaText: "ORDER BREAKFAST BOX >",
    accentColor: "#D97706",
    theme: "light",
    sortOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "email-5",
    category: "emails",
    title: "Voyara Luxury Stays",
    sender: "VOYARA STAYS",
    subject: "Exclusive Villas Across 8 Countries 🌴",
    tag: "VIP RETREAT",
    heroImg: "/images/case-studies/voltex-detail-1.webp",
    heading: "Invest in Memories. Grow Your Escape.",
    subheading: "Private oceanfront sanctuaries with dedicated concierges and chef dining.",
    ctaText: "DISCOVER DESTINATIONS >",
    accentColor: "#0056F5",
    theme: "dark",
    sortOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Landing Pages / Conversion Funnels ──
  {
    id: "landing-1",
    category: "landing",
    title: "Commercial Asset Funnel",
    client: "HAVEN ASSETS",
    url: "havenassets.com/yields",
    highlight: "High-Yield Portfolio Acquisition",
    description: "Proven performance marketing and direct-response lead generation for prime commercial holdings.",
    stats: [
      { label: "Asset Volume", value: "$4.6M" },
      { label: "Avg Yield", value: "8.4%" },
      { label: "Close Rate", value: "94%" },
    ],
    tag: "COMMERCIAL B2B",
    bgGradient: "from-[#111116] via-[#161622] to-[#0d0d12]",
    sortOrder: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "landing-2",
    category: "landing",
    title: "Gamified Fintech App",
    client: "WINBACK APP",
    url: "winback.io/daily-drop",
    highlight: "Daily Rewards & Gamified Fintech",
    description: "All without changing the way you shop or carrying extra cards. Backed by top tier banks.",
    stats: [
      { label: "Users Active", value: "180k+" },
      { label: "Cash Rewarded", value: "$1.2M" },
      { label: "App Rating", value: "4.9 ★" },
    ],
    tag: "CONSUMER APP",
    bgGradient: "from-[#0a1e12] via-[#0f2d1b] to-[#09150e]",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "landing-3",
    category: "landing",
    title: "Luxury Fitness Studio",
    client: "PULSE FITNESS",
    url: "pulsefitness.com/join",
    highlight: "Premium Boutique Studio",
    description: "Personal training, recovery saunas, and science-backed conditioning under one luxury roof.",
    stats: [
      { label: "Members", value: "1,400+" },
      { label: "Retention", value: "92%" },
      { label: "Locations", value: "3" },
    ],
    tag: "HEALTH & FITNESS",
    bgGradient: "from-[#16102a] via-[#211640] to-[#120a22]",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "landing-4",
    category: "landing",
    title: "Utility Comparison Engine",
    client: "SAVER COMPARISON",
    url: "savesmart.com/compare",
    highlight: "Utility Comparison Engine",
    description: "Instant tariff matching for electricity, high-speed fiber broadband, and solar incentives.",
    stats: [
      { label: "Avg Saved", value: "$420/yr" },
      { label: "Comparison Time", value: "45s" },
      { label: "Happy Customers", value: "65k+" },
    ],
    tag: "LEAD GENERATION",
    bgGradient: "from-[#1b1c11] via-[#2d2e14] to-[#14150c]",
    sortOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "landing-5",
    category: "landing",
    title: "Nutrition Transformation Funnel",
    client: "EQU NUTRITION",
    url: "equhealth.com/programs",
    highlight: "Lifestyle Transformation",
    description: "Dietician-led flexible dieting, metabolic health plans, and community accountability.",
    stats: [
      { label: "Kg Lost", value: "12,000+" },
      { label: "Coaches", value: "24" },
      { label: "Client Success", value: "97%" },
    ],
    tag: "E-COMMERCE & COACHING",
    bgGradient: "from-[#1e1310] via-[#321c16] to-[#160c09]",
    sortOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/** Ensures the database has the initial showcase records */
export async function ensureShowcaseDefaults() {
  const { showcaseItems, showcaseSettings } = await getCollections();
  const [itemCount, settingsCount] = await Promise.all([
    showcaseItems.countDocuments(),
    showcaseSettings.countDocuments(),
  ]);

  if (itemCount === 0) {
    await showcaseItems.insertMany(INITIAL_SHOWCASE_ITEMS as any);
  }

  if (settingsCount === 0) {
    await showcaseSettings.insertOne(DEFAULT_SHOWCASE_SETTINGS as any);
  }
}

/** Public read: returns all active showcase items grouped by category */
export async function getPublicShowcaseData() {
  try {
    await ensureShowcaseDefaults();
    const { showcaseItems, showcaseSettings } = await getCollections();
    const [items, settingsDoc] = await Promise.all([
      showcaseItems.find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      showcaseSettings.findOne({ id: "default" }),
    ]);

    const plainItems = items.map((i) => ({ ...i, _id: String(i._id) }));
    return {
      items: plainItems,
      settings: settingsDoc
        ? { ...settingsDoc, _id: String(settingsDoc._id) }
        : DEFAULT_SHOWCASE_SETTINGS,
    };
  } catch (err) {
    console.warn("Public showcase fallback used:", err);
    return {
      items: INITIAL_SHOWCASE_ITEMS.map((i) => ({ ...i, _id: i.id })),
      settings: DEFAULT_SHOWCASE_SETTINGS,
    };
  }
}

/** Admin read: returns all showcase items (including inactive) */
export async function getAdminShowcaseData() {
  await ensureShowcaseDefaults();
  const { showcaseItems, showcaseSettings } = await getCollections();
  const [items, settingsDoc] = await Promise.all([
    showcaseItems.find({}).sort({ sortOrder: 1 }).toArray(),
    showcaseSettings.findOne({ id: "default" }),
  ]);

  return {
    items: items.map((i) => ({ ...i, _id: String(i._id) })),
    settings: settingsDoc
      ? { ...settingsDoc, _id: String(settingsDoc._id) }
      : DEFAULT_SHOWCASE_SETTINGS,
  };
}

