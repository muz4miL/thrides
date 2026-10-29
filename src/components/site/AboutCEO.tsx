import { HowWeWork } from "./HowWeWork";
import { OurCommitments } from "./OurCommitments";
import { Leadership } from "./Leadership";

export function AboutCEO() {
  return (
    <div id="method-and-team" className="w-full">
      {/* Leadership — The Minds Behind The Machine (Mamoon & Jidran Executive Cards) */}
      <Leadership />
    </div>
  );
}

export { HowWeWork, OurCommitments, Leadership };
