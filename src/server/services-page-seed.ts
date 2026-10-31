/**
 * Seed defaults for the Services Page.
 * These are the exact words currently hardcoded in the UI — extracted verbatim.
 * Used as the fallback when MongoDB is empty or unreachable.
 */

import type {
  SpSettingsDoc,
  SpHeroDoc,
  SpPackageDoc,
  SpComparisonRowDoc,
  SpProcessStepDoc,
  SpChecklistItemDoc,
  SpTimelineStepDoc,
  SpCoreServiceDoc,
  SpFaqDoc,
} from "./types";

const NOW = new Date(0); // sentinel — real docs get real dates

export const SEED_SETTINGS: Omit<SpSettingsDoc, "_id"> = {
  seoTitle: "Services & Packages | Thrides Growth Engine",
  seoDescription:
    "Start where you are. Grow from there. Dedicated marketing packages for every stage: Kickstart, Accelerate, and Authority.",
  ogImage: "",
  updatedAt: NOW,
};

export const SEED_HERO: Omit<SpHeroDoc, "_id"> = {
  eyebrow: "SERVICES & PACKAGES",
  headingLine1: "Start where you are.",
  headingLineItalic: "Grow from there.",
  subCopy: "Strategy, websites, and content — packaged around your stage of growth.",
  ctaLeftText: "Book a",
  ctaRightText: "Free Strategy Call",
  ctaHref: "/contact",
  exploreLabel: "Explore packages",
  heroImageUrl: "/servicehero.png",
  updatedAt: NOW,
};

export const SEED_PACKAGES: Omit<SpPackageDoc, "_id">[] = [
  {
    slug: "kickstart",
    name: "Kickstart",
    tagline: "Just getting started",
    heading: "Set up your online presence the right way in 3 weeks.",
    theProblem:
      "You don't know where to begin, or what you have online doesn't represent you well.",
    deliverables: [
      "Market and competitor snapshot",
      "Marketing audit and 30-day action roadmap",
      "1-page website, or fixes to your current site",
      "Profile setup, bio, and brand look across key social platforms",
      "8 social posts tailored to your audience",
    ],
    timeline: "2 to 3 weeks",
    payment: "One-time",
    promise: "Delivered on the agreed date, with revisions until you approve.",
    investment: "Enquire for pricing",
    ctaText: "Get Started",
    badge: "",
    isPopular: false,
    sortOrder: 0,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    slug: "accelerate",
    name: "Accelerate",
    tagline: "I'm growing, but my marketing is inconsistent",
    heading: "A website that converts and content that brings customers, every month.",
    theProblem:
      "Your online presence is weak or patchy, and enquiries come in waves instead of steadily.",
    deliverables: [
      "Full market and competitor research",
      "5-page conversion-focused website",
      "Monthly strategy call and content plan",
      "12 posts and 8 short videos / reels every month",
      "Basic on-page SEO setup",
      "Welcome email sequence to nurture new leads",
      "Monthly plain-language progress report",
    ],
    timeline: "Website in 3 to 4 weeks, then monthly",
    payment: "One-time website fee + monthly retainer",
    promise:
      "Website in 4 weeks, content on a fixed schedule, and a 3-month plan review. If results are behind, we adjust the plan.",
    investment: "Enquire for pricing",
    ctaText: "Request Consultation",
    badge: "Most Popular",
    isPopular: true,
    sortOrder: 1,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    slug: "authority",
    name: "Authority",
    tagline: "I want to lead my market",
    heading: "A growth plan built around your business, your market, and your competitors.",
    theProblem: "Competitors outrank you, out-post you, and stay in front of your customers.",
    deliverables: [
      "Everything in Accelerate plus tailored expansions",
      "Deep market, competitor, and audience intelligence",
      "Weekly strategy sessions and a quarterly growth plan",
      "Full website, landing pages, and ongoing conversion improvements",
      "20 posts and 15 reels every month, with an active content calendar",
      "Paid campaigns to reach new targeted audiences",
      "Full SEO: keyword research, on-page optimization, monthly blog content",
      "Full email campaigns, segmentation, and automated tracking",
      "Detailed monthly report with verified numbers",
    ],
    timeline: "Website in 4 to 6 weeks, then monthly",
    payment: "One-time website fee + monthly retainer",
    promise:
      "The same delivery guarantees, plus a monthly report with clear numbers and a quarterly plan review.",
    investment: "Custom, confirmed on your call",
    ctaText: "Request Strategy Call",
    badge: "Custom-Built",
    isPopular: false,
    sortOrder: 2,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const SEED_COMPARISON_ROWS: Omit<SpComparisonRowDoc, "_id">[] = [
  { feature: "Best For", kickstart: "Just starting", accelerate: "Growing, but inconsistent", authority: "Leading the market", sortOrder: 0, createdAt: NOW, updatedAt: NOW },
  { feature: "Research", kickstart: "Market and competitor snapshot", accelerate: "Full market and competitor research", authority: "Deep market, competitor, and audience research", sortOrder: 1, createdAt: NOW, updatedAt: NOW },
  { feature: "Strategy", kickstart: "Audit + 30-day action roadmap", accelerate: "Monthly call + content plan", authority: "Weekly sessions + quarterly growth plan", sortOrder: 2, createdAt: NOW, updatedAt: NOW },
  { feature: "Website", kickstart: "1-page site or fixes", accelerate: "5-page conversion-focused site", authority: "Full site + landing pages + conversion improvements", sortOrder: 3, createdAt: NOW, updatedAt: NOW },
  { feature: "Social & Content", kickstart: "Profile setup + 8 posts", accelerate: "12 posts + 8 reels per month", authority: "20 posts + 15 reels per month + content calendar", sortOrder: 4, createdAt: NOW, updatedAt: NOW },
  { feature: "Paid Campaigns", kickstart: "Not included", accelerate: "Not included", authority: "Included", sortOrder: 5, createdAt: NOW, updatedAt: NOW },
  { feature: "SEO", kickstart: "Not included", accelerate: "Basic on-page SEO", authority: "Full SEO + monthly blog content", sortOrder: 6, createdAt: NOW, updatedAt: NOW },
  { feature: "Email Marketing", kickstart: "Not included", accelerate: "Welcome sequence", authority: "Full campaigns, segmentation, tracking", sortOrder: 7, createdAt: NOW, updatedAt: NOW },
  { feature: "Reporting", kickstart: "Roadmap review", accelerate: "Monthly plain-language report", authority: "Detailed monthly report + quarterly review", sortOrder: 8, createdAt: NOW, updatedAt: NOW },
  { feature: "Timeline", kickstart: "2 to 3 weeks", accelerate: "Website 3 to 4 weeks, then monthly", authority: "Website 4 to 6 weeks, then monthly", sortOrder: 9, createdAt: NOW, updatedAt: NOW },
  { feature: "Payment", kickstart: "One-time", accelerate: "Website + monthly retainer", authority: "Website + monthly retainer", sortOrder: 10, createdAt: NOW, updatedAt: NOW },
  { feature: "Investment", kickstart: "Enquire for pricing", accelerate: "Enquire for pricing", authority: "Custom", sortOrder: 11, createdAt: NOW, updatedAt: NOW },
];

export const SEED_PROCESS_STEPS: Omit<SpProcessStepDoc, "_id">[] = [
  {
    stepNumber: "01",
    timeLabel: "DAY 1",
    title: "Free strategy call",
    desc: "30 minutes. We review your current marketing, positioning, and goals. No obligation.",
    sortOrder: 0,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    stepNumber: "02",
    timeLabel: "DAY 3",
    title: "Your plan",
    desc: "We recommend the package and priorities that will make the biggest difference for your business.",
    sortOrder: 1,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    stepNumber: "03",
    timeLabel: "WEEK 2",
    title: "We build",
    desc: "You get a clear timeline, delivery dates, and a structured kickoff. Then we get to work.",
    sortOrder: 2,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const SEED_CHECKLIST_ITEMS: Omit<SpChecklistItemDoc, "_id">[] = [
  {
    title: "A plan behind every move",
    desc: "Everything we do ties back to your business goals.",
    sortOrder: 0,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    title: "Strategy backed by business intelligence",
    desc: "We research your market, competitors, and customers before we create anything.",
    sortOrder: 1,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    title: "Plain-language reporting",
    desc: "You always know what's working and what we're changing.",
    sortOrder: 2,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const SEED_TIMELINE_STEPS: Omit<SpTimelineStepDoc, "_id">[] = [
  {
    dayLabel: "Day 1",
    title: "Welcome",
    desc: "A welcome message and a named point of contact from day one.",
    sortOrder: 0,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    dayLabel: "Day 2",
    title: "Kickoff Call",
    desc: "We confirm your goals, timeline, deliverables, and what we need from you.",
    sortOrder: 1,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    dayLabel: "Day 5",
    title: "Agreed Response Times",
    desc: "You know how quickly we reply, with agreed SLAs from the start.",
    sortOrder: 2,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    dayLabel: "Day 14",
    title: "Progress You Can See",
    desc: "You always know what's in progress, what's next, and what has been delivered.",
    sortOrder: 3,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const SEED_CORE_SERVICES: Omit<SpCoreServiceDoc, "_id">[] = [
  {
    slug: "marketing-consultancy",
    title: "Marketing Consultancy",
    includedIn: "Kickstart · Accelerate · Authority",
    summary:
      "Spending on marketing without a plan is expensive guesswork. We research your market, competitors, and customers, then build a strategy that shows what to do, in what order, and why. You get clarity and an edge before you spend another dollar.",
    bullets: [
      "Market and competitor research that reveals where your advantage is",
      "A clear marketing roadmap with priorities and timelines",
      "Audience insights so you speak to the right people",
      "Goals and KPIs you can actually track",
    ],
    imageUrl: "",
    imageAlt: "Marketing Consultancy",
    sortOrder: 0,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    slug: "website-design-development",
    title: "Website Design & Development",
    includedIn: "Kickstart · Accelerate · Authority",
    summary:
      "Your website either works for you around the clock or quietly turns customers away. We design and build fast, mobile-friendly websites that explain what you offer and make it easy to get in touch. The result is a professional site that turns visitors into enquiries.",
    bullets: [
      "Clean, modern design that reflects your brand",
      "Fast loading and mobile-first on every device",
      "SEO-ready structure so customers can find you on Google",
      "Clear calls to action that guide visitors to contact you",
    ],
    imageUrl: "",
    imageAlt: "Website Design & Development",
    sortOrder: 1,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    slug: "content-creation",
    title: "Content Creation",
    includedIn: "Kickstart · Accelerate · Authority",
    summary:
      "Content nobody stops for is content nobody remembers. We create copy, graphics, and visuals that tell your story and speak to what your audience cares about. Consistent, on-brand content builds trust before the first conversation.",
    bullets: [
      "Website, ad, and social media copywriting",
      "Graphic design that makes your brand instantly recognizable",
      "Photo and video content made for the platforms you use",
      "A content calendar so you never run out of ideas",
    ],
    imageUrl: "",
    imageAlt: "Content Creation",
    sortOrder: 2,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    includedIn: "Kickstart (setup + posts) · Accelerate · Authority",
    summary:
      "Posting isn't a strategy. We plan, publish, and manage your social media so every post has a purpose and reaches the audience you want. You get steady growth in followers who engage, enquire, and buy.",
    bullets: [
      "Platform strategy matched to where your customers spend their time",
      "Scheduled posting and community management",
      "Paid campaigns to reach new audiences (Authority)",
      "Monthly reports in plain language",
    ],
    imageUrl: "",
    imageAlt: "Social Media Marketing",
    sortOrder: 3,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    slug: "seo",
    title: "SEO",
    includedIn: "Accelerate (basic) · Authority (full)",
    summary:
      "When someone searches for what you sell, you should be the one they find. We build steady, long-term traffic from people who are already looking for you.",
    bullets: [
      "Keyword research matched to what your customers actually search",
      "On-page optimization for every key page",
      "Monthly blog content that builds authority (Authority)",
      "Clear progress reporting",
    ],
    imageUrl: "",
    imageAlt: "SEO",
    sortOrder: 4,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    slug: "email-marketing",
    title: "Email Marketing",
    includedIn: "Accelerate (welcome sequence) · Authority (full campaigns)",
    summary:
      "Your customer list is your most valuable and most ignored asset. We build email campaigns and automated sequences that keep you in front of past customers and warm leads. That means more repeat business without paying for new attention every time.",
    bullets: [
      "Welcome and follow-up emails that work while you sleep",
      "Newsletters and promotions designed and written for you",
      "List segmentation so each person gets relevant messages",
      "Open, click, and conversion tracking to improve every send",
    ],
    imageUrl: "",
    imageAlt: "Email Marketing",
    sortOrder: 5,
    visible: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const SEED_FAQS: Omit<SpFaqDoc, "_id">[] = [
  { question: "What type of brands do you work best with?", answer: "We work best with ambitious founders and established businesses who want a unified strategic partner across branding, high-converting web architecture, and organic/paid campaigns—eliminating fragmented freelancers.", sortOrder: 0, visible: true, createdAt: NOW, updatedAt: NOW },
  { question: "What does having a dedicated partner mean?", answer: "It means no junior account managers passing notes. Senior strategists personally architect your roadmap, manage delivery milestones, and attend your reviews with agreed SLA commitments.", sortOrder: 1, visible: true, createdAt: NOW, updatedAt: NOW },
  { question: "Do I have to choose a package right now?", answer: "No. The discovery call is for exactly that. We review your current presence, market opportunity, and unit economics to recommend the right starting stage.", sortOrder: 2, visible: true, createdAt: NOW, updatedAt: NOW },
  { question: "Can I start small and expand as results compound?", answer: "Yes. Most clients start with a targeted Kickstart sprint or Accelerate tier, scaling their engagement as qualified inbound opportunities and revenue grow.", sortOrder: 3, visible: true, createdAt: NOW, updatedAt: NOW },
  { question: "What if my requirements don't fit a fixed package?", answer: "That is what the Authority engagement is engineered for. We build a fully bespoke scope around your business objectives, custom integrations, and market competitors.", sortOrder: 4, visible: true, createdAt: NOW, updatedAt: NOW },
  { question: "What if we already have an internal marketing team?", answer: "We frequently co-pilot with internal marketing leads and founders—handling specialized design, technical SEO, and web engineering while your team stays focused on daily operations.", sortOrder: 5, visible: true, createdAt: NOW, updatedAt: NOW },
  { question: "Do you guarantee rankings or follower counts?", answer: "No, algorithms fluctuate and anyone promising instant rankings is guessing. What we guarantee in writing is what we control: strict delivery dates, unlimited revisions until sign-off, and proactive plan reviews.", sortOrder: 6, visible: true, createdAt: NOW, updatedAt: NOW },
  { question: "What exactly happens on the free strategy call?", answer: "A practical 30-minute review of your digital presence with actionable takeaways and architectural recommendations, whether you decide to work with us or not.", sortOrder: 7, visible: true, createdAt: NOW, updatedAt: NOW },
  { question: "How does onboarding work once we begin?", answer: "Within 24 hours of confirmation, you receive a kickoff schedule, dedicated communication channels, and milestone commitments in writing so production begins immediately.", sortOrder: 8, visible: true, createdAt: NOW, updatedAt: NOW },
  { question: "How soon do we hear back after submitting an enquiry?", answer: "Our strategy team reviews incoming submissions and responds within 24 hours (or same-day during standard business hours).", sortOrder: 9, visible: true, createdAt: NOW, updatedAt: NOW },
];

