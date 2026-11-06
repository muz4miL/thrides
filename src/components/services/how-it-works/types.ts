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
    desc: "30 minutes. We audit your marketing. Zero obligation.",
  },
  {
    stepNumber: "02",
    timeLabel: "DAY 3",
    title: "Your plan",
    desc: "One clear plan. Only the moves that matter.",
  },
  {
    stepNumber: "03",
    timeLabel: "WEEK 2",
    title: "We build",
    desc: "Dates locked. Kickoff done. We ship.",
  },
];

