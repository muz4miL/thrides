export interface WorkProject {
  id: string;
  number: string;
  slug: string;
  client: string;
  category: string;
  year: string;
  title: string;
  titlePrefix: string;
  titleAccent: string; // rendered in Instrument Serif italic blue
  outcome: string;
  metric: string;
  metricLabel: string;
  secondaryMetric?: string;
  secondaryMetricLabel?: string;
  image: string;
  alt: string;
  isFeatured?: boolean;
}

export const WORK_PROJECTS: WorkProject[] = [
  {
    id: "apex",
    number: "01",
    slug: "apex-advisory",
    client: "Apex Strategic Advisory",
    category: "Management Consultancy",
    year: "2025",
    title: "Global positioning, and a high-value client funnel",
    titlePrefix: "Global positioning, and a high-value client ",
    titleAccent: "funnel",
    outcome: "$4.2M qualified pipeline in 90 days.",
    metric: "+184%",
    metricLabel: "QUALIFIED PIPELINE",
    secondaryMetric: "14 days",
    secondaryMetricLabel: "DELIVERY CADENCE",
    image: "/images/work/work-identity-halo.jpg",
    alt: "Apex Strategic Advisory brand identity and client funnel showcase",
    isFeatured: true,
  },
  {
    id: "voltex",
    number: "02",
    slug: "voltex-active",
    client: "Voltex Activewear",
    category: "Performance Athletic Apparel",
    year: "2025",
    title: "A high-velocity apparel drop engine",
    titlePrefix: "A high-velocity apparel ",
    titleAccent: "drop engine",
    outcome: "Performance-led creative for apparel launches",
    metric: "4.6x ROAS",
    metricLabel: "Return on ad spend",
    image: "/images/work/work-ad-sneaker.jpg",
    alt: "Voltex Activewear high-velocity sneaker and apparel drop engine",
    isFeatured: false,
  },
  {
    id: "pulse",
    number: "03",
    slug: "pulse-performance",
    client: "Pulse Performance",
    category: "Health, Wellness & Fitness",
    year: "2024",
    title: "A social content engine built for community growth",
    titlePrefix: "A social content engine built for ",
    titleAccent: "community growth",
    outcome: "Consistent creative across every channel",
    metric: "12 carousels + 8 reels",
    metricLabel: "Monthly creative cadence",
    image: "/images/work/work-identity-pulse.jpg",
    alt: "Pulse Performance brand board and organic content system",
    isFeatured: false,
  },
  {
    id: "zest",
    number: "04",
    slug: "zest-botanicals",
    client: "Zest Botanicals",
    category: "Consumer Goods / Beverage",
    year: "2024",
    title: "Retail launch visuals and a 3-week go-to-market",
    titlePrefix: "Retail launch visuals and a 3-week ",
    titleAccent: "go-to-market",
    outcome: "A cohesive launch across retail touchpoints",
    metric: "100+ stockists",
    metricLabel: "Secured for launch",
    image: "/images/work/work-social-juice.jpg",
    alt: "Zest Botanicals retail packaging visuals and launch microsite",
    isFeatured: false,
  },
  {
    id: "lumina",
    number: "05",
    slug: "lumina-living",
    client: "Lumina Home & Living",
    category: "Modern Retail / Home",
    year: "2024",
    title: "An omnichannel redesign with retention flows",
    titlePrefix: "An omnichannel redesign with ",
    titleAccent: "retention flows",
    outcome: "A connected shopping experience across devices",
    metric: "+92% order value",
    metricLabel: "Average order value",
    image: "/images/work/work-campaign-home.jpg",
    alt: "Lumina Home & Living architectural omnichannel storefront and retention flows",
    isFeatured: false,
  },
];
