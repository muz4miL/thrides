// Central authoritative content for Thrides.
// All copy, services, packages, case studies, and team profiles live here.
import halo from "@/assets/work-identity-halo.jpg";
import pulse from "@/assets/work-identity-pulse.jpg";
import zest from "@/assets/work-social-juice.jpg";
import voltex from "@/assets/work-ad-sneaker.jpg";
import skin from "@/assets/work-package-skin.jpg";
import rise from "@/assets/work-package-rise.jpg";
import voyara from "@/assets/work-ads-travel.jpg";
import home from "@/assets/work-campaign-home.jpg";
import serviceIdentity from "@/assets/service-identity.jpg";
import serviceSocial from "@/assets/service-social.jpg";
import serviceAds from "@/assets/service-ads.jpg";
import servicePackages from "@/assets/service-packages.jpg";

export type ServiceCategory =
  | "consultancy"
  | "web-dev"
  | "content"
  | "social-media"
  | "seo"
  | "email-marketing";

export const serviceCategoryLabels: Record<ServiceCategory, string> = {
  consultancy: "Marketing Consultancy",
  "web-dev": "Website Design & Development",
  content: "Content Creation",
  "social-media": "Social Media Marketing",
  seo: "SEO",
  "email-marketing": "Email Marketing",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services & Packages", href: "/services" },
  { label: "Our Work", href: "/our-work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const siteMeta = {
  agencyName: "Thrides",
  tagline: "Your Brand, Everywhere. On Purpose.",
  subHeadline:
    "We put your business in front of the right customers: on your website, in their feeds, in search results, and in their inbox, with a clear reason behind every appearance.",
  primaryCTA: "Request a Free Strategy Call",
  primaryCTALink: "/contact",
  microcopy:
    "Free 30-minute consultation. We review your marketing and share recommendations, whether or not you hire us.",
  trustNumbers: [
    { value: "3 Years", label: "Agency Experience" },
    { value: "14+ Businesses", label: "Supported Globally" },
    { value: "8 Countries", label: "Client Reach" },
  ],
  trustBarSummary: "3 years · 14+ businesses · 8 countries",
  contact: {
    email: "info@thrides.com",
    phone: "+92 337 3252840",
    phoneDisplay: "+92 337 3252840",
    office:
      "Arbab Plaza, Taroon Wedding Hall Rd, Canal Town, Peshawar, 25000",
    responseTime: "We reply within 24 hours.",
    closingLine:
      "Attention should never be accidental. Let’s make yours on purpose.",
  },
};

export interface PackageData {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  heading: string;
  theProblem: string;
  deliverables: string[];
  timeline: string;
  payment: string;
  promise: string;
  investment: string;
  ctaText: string;
  isPopular?: boolean;
}

export const packages: PackageData[] = [
  {
    id: "kickstart",
    name: "Kickstart",
    tagline: "“I’m just getting started.”",
    heading: "Set up your online presence the right way in 3 weeks.",
    theProblem:
      "You don’t know where to begin, or what you have online doesn’t represent you well.",
    deliverables: [
      "Market and competitor snapshot",
      "Marketing audit and 30-day action roadmap",
      "1-page website, or fixes to your current site",
      "Profile setup, bio, and brand look across key social platforms",
      "8 social posts tailored to your audience",
    ],
    timeline: "2 to 3 weeks",
    payment: "One-time",
    promise:
      "Delivered on the agreed date, with revisions until you approve.",
    investment: "Enquire for pricing",
    ctaText: "Get Started",
  },
  {
    id: "accelerate",
    name: "Accelerate",
    badge: "Most Popular",
    isPopular: true,
    tagline: "“I’m growing, but my marketing is inconsistent.”",
    heading:
      "A website that converts and content that brings customers, every month.",
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
  },
  {
    id: "authority",
    name: "Authority",
    badge: "Custom-Built",
    tagline: "“I want to lead my market.”",
    heading:
      "A growth plan built around your business, your market, and your competitors.",
    theProblem:
      "Competitors outrank you, out-post you, and stay in front of your customers.",
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
  },
];

export const packageComparisonRows = [
  {
    feature: "Best For",
    kickstart: "Just starting",
    accelerate: "Growing, but inconsistent",
    authority: "Leading the market",
  },
  {
    feature: "Research",
    kickstart: "Market and competitor snapshot",
    accelerate: "Full market and competitor research",
    authority: "Deep market, competitor, and audience research",
  },
  {
    feature: "Strategy",
    kickstart: "Audit + 30-day action roadmap",
    accelerate: "Monthly call + content plan",
    authority: "Weekly sessions + quarterly growth plan",
  },
  {
    feature: "Website",
    kickstart: "1-page site or fixes",
    accelerate: "5-page conversion-focused site",
    authority: "Full site + landing pages + conversion improvements",
  },
  {
    feature: "Social & Content",
    kickstart: "Profile setup + 8 posts",
    accelerate: "12 posts + 8 reels per month",
    authority: "20 posts + 15 reels per month + content calendar",
  },
  {
    feature: "Paid Campaigns",
    kickstart: "Not included",
    accelerate: "Not included",
    authority: "Included",
  },
  {
    feature: "SEO",
    kickstart: "Not included",
    accelerate: "Basic on-page SEO",
    authority: "Full SEO + monthly blog content",
  },
  {
    feature: "Email Marketing",
    kickstart: "Not included",
    accelerate: "Welcome sequence",
    authority: "Full campaigns, segmentation, tracking",
  },
  {
    feature: "Reporting",
    kickstart: "Roadmap review",
    accelerate: "Monthly plain-language report",
    authority: "Detailed monthly report + quarterly review",
  },
  {
    feature: "Timeline",
    kickstart: "2 to 3 weeks",
    accelerate: "Website 3 to 4 weeks, then monthly",
    authority: "Website 4 to 6 weeks, then monthly",
  },
  {
    feature: "Payment",
    kickstart: "One-time",
    accelerate: "Website + monthly retainer",
    authority: "Website + monthly retainer",
  },
  {
    feature: "Investment",
    kickstart: "Enquire for pricing",
    accelerate: "Enquire for pricing",
    authority: "Custom",
  },
];

export interface ServiceDetail {
  id: string;
  slug: string;
  category: ServiceCategory;
  title: string;
  includedIn: string;
  summary: string;
  bullets: string[];
  image: any;
  proofCaseStudyId?: string;
}

export const services: ServiceDetail[] = [
  {
    id: "marketing-consultancy",
    slug: "marketing-consultancy",
    category: "consultancy",
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
    image: serviceIdentity,
  },
  {
    id: "website-design-dev",
    slug: "website-design-development",
    category: "web-dev",
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
    image: rise,
  },
  {
    id: "content-creation",
    slug: "content-creation",
    category: "content",
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
    image: serviceSocial,
  },
  {
    id: "social-media-marketing",
    slug: "social-media-marketing",
    category: "social-media",
    title: "Social Media Marketing",
    includedIn: "Kickstart (setup + posts) · Accelerate · Authority",
    summary:
      "Posting isn’t a strategy. We plan, publish, and manage your social media so every post has a purpose and reaches the audience you want. You get steady growth in followers who engage, enquire, and buy.",
    bullets: [
      "Platform strategy matched to where your customers spend their time",
      "Scheduled posting and community management",
      "Paid campaigns to reach new audiences (Authority)",
      "Monthly reports in plain language",
    ],
    image: zest,
  },
  {
    id: "seo",
    slug: "seo",
    category: "seo",
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
    image: serviceAds,
  },
  {
    id: "email-marketing",
    slug: "email-marketing",
    category: "email-marketing",
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
    image: servicePackages,
  },
];

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  categories: ServiceCategory[];
  cover: any;
  gallery: any[];
  summary: string;
  challenge: string;
  delivered: string[];
  results?: { metric: string; label: string; context?: string }[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  featured?: boolean;
  isPublished?: boolean;
  isDemoPlaceholder?: boolean;
}

// Internal development / demo records kept unpublished until client provides verified case studies
export const caseStudies: CaseStudy[] = [
  {
    id: "apex-advisory",
    slug: "apex-advisory",
    title: "[Development Prototype] Strategic Market Entry & Positioning Roadmap",
    client: "Apex Strategic Advisory",
    industry: "Management Consultancy",
    categories: ["consultancy", "web-dev"],
    cover: halo,
    gallery: [halo, serviceIdentity],
    summary:
      "Prototype case study demonstrating positioning layout and architecture for prospective corporate advisory clients.",
    challenge:
      "Development placeholder detailing consultancy positioning and lead-funnel integration.",
    delivered: [
      "Competitor & market positioning analysis",
      "Value proposition and executive messaging guide",
      "Conversion-focused 5-page digital experience",
      "Client enquiry funnel and onboarding workflow",
    ],
    results: [
      { metric: "14 Days", label: "Delivery Cadence", context: "Accelerate package scope" },
    ],
    isPublished: false,
    isDemoPlaceholder: true,
    featured: false,
  },
  {
    id: "lumina-retail",
    slug: "lumina-retail",
    title: "[Development Prototype] Omnichannel Digital Redesign & Retention Funnel",
    client: "Lumina Home & Living",
    industry: "Modern Retail",
    categories: ["web-dev", "email-marketing", "content"],
    cover: home,
    gallery: [home, servicePackages],
    summary:
      "Prototype case study demonstrating responsive storefront architecture and automated lead nurture flows.",
    challenge:
      "Development placeholder detailing eCommerce funnel optimization and lead-retention sequences.",
    delivered: [
      "Mobile-first responsive storefront architecture",
      "Automated email flows (Welcome, Browse Abandon, Post-Purchase)",
      "Product visual guidelines & asset library",
      "Conversion tracking setup",
    ],
    isPublished: false,
    isDemoPlaceholder: true,
    featured: false,
  },
  {
    id: "pulse-wellness",
    slug: "pulse-wellness",
    title: "[Development Prototype] Social Media Content Engine",
    client: "Pulse Performance",
    industry: "Health & Fitness",
    categories: ["content", "social-media"],
    cover: pulse,
    gallery: [pulse, zest],
    summary:
      "Prototype case study demonstrating structured content calendar workflows and monthly social publishing.",
    challenge:
      "Development placeholder for fitness and wellness publishing cadence.",
    delivered: [
      "Monthly content calendar with weekly themes and hooks",
      "12 monthly carousel posts and 8 short-form vertical reels",
      "Community management guidelines",
      "Monthly performance review format",
    ],
    isPublished: false,
    isDemoPlaceholder: true,
    featured: false,
  },
  {
    id: "strata-logistics",
    slug: "strata-logistics",
    title: "[Development Prototype] B2B SEO & Search Visibility Architecture",
    client: "Strata Global Freight",
    industry: "B2B Logistics",
    categories: ["seo", "consultancy"],
    cover: voyara,
    gallery: [voyara, voltex],
    summary:
      "Prototype case study demonstrating organic search intent mapping and on-page optimization.",
    challenge:
      "Development placeholder detailing industrial search visibility and technical indexing.",
    delivered: [
      "Keyword intent mapping across commercial routes",
      "On-page technical SEO and structured data",
      "Monthly commercial content plan",
      "Search visibility tracking reports",
    ],
    isPublished: false,
    isDemoPlaceholder: true,
    featured: false,
  },
  {
    id: "zest-beverage",
    slug: "zest-beverage",
    title: "[Development Prototype] Brand Visuals & Digital Launch Presence",
    client: "Zest Botanical Refreshers",
    industry: "Consumer Goods",
    categories: ["content", "social-media", "web-dev"],
    cover: zest,
    gallery: [zest, skin],
    summary:
      "Prototype case study demonstrating fast-turnaround visual identity rollout under the Kickstart package.",
    challenge:
      "Development placeholder detailing 3-week product launch timeline.",
    delivered: [
      "Launch visual identity guidelines and social asset kit",
      "Fast product showcase microsite",
      "Batch-produced social creative assets",
      "Delivery milestone commitments met on time",
    ],
    isPublished: false,
    isDemoPlaceholder: true,
    featured: false,
  },
];

// Publicly visible case studies — strictly published records only
export const publishedCaseStudies: CaseStudy[] = caseStudies.filter(
  (cs) => cs.isPublished === true,
);

export const onPurposeMethod = [
  {
    step: "01",
    title: "Research",
    desc: "We study your market, competitors, and customers before we create anything, so you start with an edge.",
  },
  {
    step: "02",
    title: "Plan",
    desc: "A clear roadmap with priorities, timelines, and goals you can track.",
  },
  {
    step: "03",
    title: "Build",
    desc: "Website, content, and campaigns made to carry out the plan.",
  },
  {
    step: "04",
    title: "Measure",
    desc: "Plain-language reports on what’s working and what we’re changing.",
  },
];

export const whatYouCanCountOn = [
  {
    title: "Delivery dates in writing",
    desc: "Every project starts with a timeline we commit to. You always know when deliverables arrive.",
  },
  {
    title: "Revisions until you approve",
    desc: "You’re never stuck with work you don’t like. We iterate until you are completely satisfied.",
  },
  {
    title: "A 3-month plan review on monthly packages",
    desc: "If results are behind, we proactively adjust the plan with you. We share accountability.",
  },
  {
    title: "Plain-language reporting",
    desc: "No confusing technical jargon or vanity metrics. Clear numbers showing real business progress.",
  },
  {
    title: "A proper welcome",
    desc: "A kickoff call, a named point of contact, and agreed response times. You’re treated like a guest, not a ticket number.",
  },
];

export const whatHappensWhenYouJoin = [
  {
    title: "Welcome",
    desc: "A welcome message and a named point of contact from day one.",
  },
  {
    title: "Kickoff Call",
    desc: "We confirm your goals, timeline, deliverables, and what we need from you.",
  },
  {
    title: "Agreed Response Times",
    desc: "You know how quickly we reply, with agreed SLAs from the start.",
  },
  {
    title: "Progress You Can See",
    desc: "You always know what’s in progress, what’s next, and what has been delivered.",
  },
];

export const whatItsLikeToWork = [
  {
    title: "A plan behind every move",
    desc: "Everything we do ties back to your business goals.",
  },
  {
    title: "Strategy backed by business intelligence",
    desc: "We research your market, competitors, and customers before we create anything.",
  },
  {
    title: "Plain-language reporting",
    desc: "You always know what’s working and what we’re changing.",
  },
];

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
  bio: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Mamoon",
    role: "Chief Strategist",
    initials: "M",
    bio: "A full-stack digital marketer who leads strategy across every Thrides project. He researches the market, defines the direction, and checks every deliverable against the plan before it reaches you.",
  },
  {
    name: "Jidran",
    role: "Operations Head",
    initials: "J",
    bio: "Runs the day-to-day operations at Thrides. He keeps every project on schedule, manages timelines and communication, and makes sure every deadline we commit to is met.",
  },
];

export const faqs = [
  {
    q: "Do I have to choose a package now?",
    a: "No. The free call is for exactly that. We’ll review your business and recommend the right starting point based on where you are today.",
  },
  {
    q: "Can I start small and grow?",
    a: "Yes. Most clients start with Kickstart or Accelerate and move up as results come in.",
  },
  {
    q: "What if my needs don’t fit a package?",
    a: "That’s what Authority is for. We build it completely custom around your business, your market, and your competitors.",
  },
  {
    q: "Do you guarantee rankings or follower counts?",
    a: "No. Rankings and reach depend on algorithms and competition, and anyone promising them is guessing. We guarantee what we control: delivery dates, deliverables, revisions, and a plan review if results fall behind.",
  },
  {
    q: "What do I get on the free call?",
    a: "A review of your current marketing and clear, actionable recommendations, whether or not you hire us.",
  },
  {
    q: "How soon will you reply?",
    a: "Within 24 hours.",
  },
];

export const budgetOptions = [
  "Under $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet",
];

export const packageOptions = [
  "Kickstart (3 Weeks)",
  "Accelerate (Most Popular)",
  "Authority (Custom-Built)",
  "Not sure yet",
];

export const serviceInterestOptions = [
  "Marketing Consultancy",
  "Website Design & Development",
  "Content Creation",
  "Social Media Marketing",
  "SEO",
  "Email Marketing",
  "Not sure yet",
];

export const serviceOptions = serviceInterestOptions;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(
    (cs) => (cs.slug === slug || cs.id === slug) && cs.isPublished === true,
  );
}

export const aboutImages: string[] = [
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80",
];

export const heroTiles: string[] = [];

export type Category = "identity" | "social" | "ads" | "packages";
export type Contribution =
  | "Logo only"
  | "Full visual identity"
  | "Social content"
  | "Ad creative"
  | "Campaign management"
  | "Complete package";
export const categoryLabels: Record<Category, string> = {
  identity: "Logos & Identity",
  social: "Social Content",
  ads: "Ads & Campaigns",
  packages: "Full Packages",
};
export type Project = {
  id: string;
  title: string;
  categories: Category[];
  contribution: Contribution;
  summary: string;
  deliverables: string[];
  cover: string;
  gallery: string[];
  isConcept: boolean;
  featured: boolean;
};
export const projects: Project[] = [];
