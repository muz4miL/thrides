import type { Metadata } from "next";
import { CareersContent } from "./CareersContent";
import { getCollections } from "@/server/db";

export const metadata: Metadata = {
  title: "Careers & Remote Opportunities — Thrides | Join Our Global Team",
  description:
    "Explore open remote and distributed roles in media buying, motion design, creative direction, and full-stack engineering at Thrides. High autonomy, top-tier compensation, work from anywhere.",
  openGraph: {
    title: "Careers & Remote Opportunities — Thrides",
    description:
      "Explore open remote and distributed roles in media buying, motion design, creative direction, and full-stack engineering at Thrides. High autonomy, work from anywhere.",
  },
};

const DEFAULT_VACANCIES = [
  {
    slug: "senior-performance-marketer",
    jobTitle: "Senior Performance Marketer (Meta & Google)",
    department: "Media Buying",
    location: "100% Remote (Worldwide)",
    isRemote: true,
    employmentType: "Full-Time (Remote)",
    salaryRange: "$4,500 – $7,500 / mo",
    description:
      "Lead performance media buying across Meta, Google, and TikTok for high-growth DTC, luxury, and technology brands. 100% remote with total ownership over campaign architecture.",
    responsibilities: [
      "Structure, manage and scale six-figure ad budgets across Meta, Google Ads, and TikTok",
      "Analyze CAC, ROAS and conversion metrics to continuously optimize profitability",
      "Collaborate directly with our video editing and design teams to brief high-converting creative hooks",
      "Present commercial clarity and growth milestones directly to brand founders",
    ],
    requirements: [
      "3+ years managing substantial paid media spend with verifiable case study metrics",
      "Deep mastery of Meta Ads Manager, GA4, CAPI, and server-side tracking",
      "Strong analytical instincts, commercial numeracy, and direct-response psychology",
      "High autonomy, reliable speed, and proactive remote communication",
    ],
    isOpen: true,
  },
  {
    slug: "video-editor-motion-designer",
    jobTitle: "Video Editor & Motion Designer",
    department: "Creative & Motion",
    location: "100% Remote (Worldwide)",
    isRemote: true,
    employmentType: "Full-Time (Remote)",
    salaryRange: "$3,500 – $5,500 / mo",
    description:
      "Transform raw footage, 3D renders, and brand assets into scroll-stopping social reels, cinematic brand films, and high-CTR performance ad creatives.",
    responsibilities: [
      "Edit fast-paced, high-retention short-form video ads (TikTok, Reels, YouTube Shorts)",
      "Develop custom motion graphics, kinetic typography, and sound design that holds attention",
      "Iterate rapidly on winning visual hooks based on live media buying retention data",
      "Maintain uncompromising visual polish and cinematic pacing across every deliverable",
    ],
    requirements: [
      "Exceptional showreel displaying short-form social hooks, dynamic typography, and commercial edits",
      "Mastery of Premiere Pro, After Effects, and DaVinci Resolve color grading",
      "Intuitive understanding of direct-response video psychology and rhythm",
      "Ability to work independently across distributed timezones with rapid turnarounds",
    ],
    isOpen: true,
  },
  {
    slug: "creative-strategist-copywriter",
    jobTitle: "Lead Creative Strategist & Direct Response Copywriter",
    department: "Copywriting",
    location: "100% Remote (Worldwide)",
    isRemote: true,
    employmentType: "Full-Time (Remote)",
    salaryRange: "$4,000 – $6,000 / mo",
    description:
      "Architect customer acquisition angles, high-converting advertorials, video scripts, and landing page wireframes that turn cold attention into loyal customers.",
    responsibilities: [
      "Conduct in-depth market research, customer avatar analysis, and competitor audits",
      "Write high-converting ad scripts, advertorials, and landing page messaging",
      "Synthesize media buying performance data into fresh creative concepts weekly",
    ],
    requirements: [
      "Proven direct-response portfolio with demonstrated scale in e-commerce or B2B",
      "Mastery of consumer psychology, objection handling, and attention architecture",
      "Flawless written English and ability to write in diverse brand voices",
    ],
    isOpen: true,
  },
];

export default async function CareersPage() {
  let vacancies: any[] = [];

  try {
    const { vacancies: vacCol } = await getCollections();
    vacancies = await vacCol
      .find({ isOpen: true, isArchived: false }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (err) {
    console.error("Careers DB load error (using fallback):", err);
  }

  // Fallback to default high-converting vacancies if DB is empty or unreachable
  if (!vacancies || vacancies.length === 0) {
    vacancies = DEFAULT_VACANCIES;
  }

  return <CareersContent vacancies={vacancies} />;
}
