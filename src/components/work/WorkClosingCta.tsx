"use client";

import { CtaBanner } from "@/components/site/CtaBanner";
import type { WorkPageSettingsDoc } from "@/server/types";

interface WorkClosingCtaProps {
  settings?: WorkPageSettingsDoc;
}

export function WorkClosingCta({ settings }: WorkClosingCtaProps) {
  return (
    <section
      aria-label="Work Closing Invitation"
      className="relative overflow-hidden bg-[#070709] py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
        <CtaBanner
          eyebrow="YOUR NEXT CHAPTER"
          headingPrefix="Your brand."
          accentText="Our next masterpiece."
          buttonLeftText="Ready?"
          buttonRightText="Start Now"
          buttonHref="/contact"
          imageSrc="/images/cta/work-banner.png"
          mobileObjectPosition="85% center"
        />
      </div>
    </section>
  );
}
