import { HowWeWork } from "./HowWeWork";
import { OurCommitments } from "./OurCommitments";
import { Leadership } from "./Leadership";

export function AboutCEO() {
  return (
    <div id="method-and-team" className="w-full">
      {/* 1. How We Work — Scaling Goes Deeper Than Just Winning Ads (6 Cards with Live Mockups) */}
      <HowWeWork />

      {/* 2. Our Commitments — What You Can Count On (5 Obsidian SLA Guarantee Cards) */}
      <OurCommitments />

      {/* 3. Leadership — The Minds Behind The Machine (Mamoon & Jidran Executive Cards) */}
      <Leadership />
    </div>
  );
}

export { HowWeWork, OurCommitments, Leadership };
