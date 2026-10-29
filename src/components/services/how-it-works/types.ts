export interface HowItWorksStep {
  stepNumber: string; // "01", "02", "03"
  timeLabel: string;   // "DAY 1", "DAY 3", "WEEK 2"
  title: string;
  desc: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    stepNumber: "01",
    timeLabel: "DAY 1",
    title: "Free strategy call",
    desc: "30 minutes. We review your current marketing, positioning, and goals. No obligation.",
  },
  {
    stepNumber: "02",
    timeLabel: "DAY 3",
    title: "Your plan",
    desc: "We recommend the package and priorities that will make the biggest difference for your business.",
  },
  {
    stepNumber: "03",
    timeLabel: "WEEK 2",
    title: "We build",
    desc: "You get a clear timeline, delivery dates, and a structured kickoff. Then we get to work.",
  },
];

