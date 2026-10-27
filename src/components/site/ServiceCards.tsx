import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

import creativeImg from "@/assets/service-creative.jpg";
import metaImg from "@/assets/service-meta.jpg";
import googleImg from "@/assets/service-google.jpg";
import tiktokImg from "@/assets/service-tiktok.jpg";
import croImg from "@/assets/service-cro.jpg";
import emailImg from "@/assets/service-email.jpg";
import webImg from "@/assets/service-web.jpg";
import identityImg from "@/assets/service-identity.jpg";

import { SectionBadge } from "./SectionBadge";

interface ServiceCardItem {
  id: string;
  titleSans: string;
  titleSerif: string;
  image: string;
  alt: string;
  link: string;
}

const serviceItems: ServiceCardItem[] = [
  {
    id: "creative",
    titleSans: "Performance",
    titleSerif: "Creative",
    image: creativeImg,
    alt: "Performance creative and content production on set",
    link: "/services",
  },
  {
    id: "meta-ads",
    titleSans: "Meta",
    titleSerif: "Ads",
    image: metaImg,
    alt: "Meta and paid social acquisition campaigns on smartphone",
    link: "/services",
  },
  {
    id: "google-ads",
    titleSans: "Google",
    titleSerif: "Ads",
    image: googleImg,
    alt: "High-intent Google Ads and search engine marketing showcase",
    link: "/services",
  },
  {
    id: "tiktok-ads",
    titleSans: "Tik Tok",
    titleSerif: "Ads",
    image: tiktokImg,
    alt: "TikTok viral video advertising and UGC campaigns",
    link: "/services",
  },
  {
    id: "cro-landing",
    titleSans: "CRO &",
    titleSerif: "Landing Pages",
    image: croImg,
    alt: "Conversion rate optimization and landing page design",
    link: "/services",
  },
  {
    id: "email-sms",
    titleSans: "Email &",
    titleSerif: "SMS",
    image: emailImg,
    alt: "Automated retention, email newsletters and SMS workflows",
    link: "/services",
  },
  {
    id: "web-dev",
    titleSans: "Web",
    titleSerif: "Design & Dev",
    image: webImg,
    alt: "Bespoke high-performance websites and digital experiences",
    link: "/services",
  },
  {
    id: "brand-identity",
    titleSans: "Brand",
    titleSerif: "Identity",
    image: identityImg,
    alt: "Complete brand identity, packaging and luxury positioning",
    link: "/services",
  },
];

export function ServiceCards() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasMoved = useRef(false);

  // Update active dot index based on scroll position
  const updateActiveIndex = () => {
    if (!trackRef.current) return;
    const { scrollLeft } = trackRef.current;
    const cards = trackRef.current.children;
    if (cards.length === 0) return;

    let closest = 0;
    let minDistance = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardLeft = card.offsetLeft - trackRef.current.offsetLeft;
      const diff = Math.abs(cardLeft - scrollLeft);
      if (diff < minDistance) {
        minDistance = diff;
        closest = i;
      }
    }
    setActiveIndex(closest);
  };

  const scrollToIndex = (index: number) => {
    if (!trackRef.current) return;
    const cards = trackRef.current.children;
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      const targetLeft = card.offsetLeft - trackRef.current.offsetLeft;
      trackRef.current.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  };

  // Mouse dragging support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftStart.current = trackRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 6) {
      hasMoved.current = true;
    }
    trackRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <section
      id="services"
      aria-label="Our Services"
      className="relative w-full overflow-hidden bg-[#000000] pt-16 sm:pt-22 lg:pt-28 pb-16 sm:pt-20 pb-16 sm:pb-22 lg:pb-28 select-none scroll-mt-24"
    >
      {/* 1. Centred Section Introduction */}
      <div className="mx-auto flex max-w-[1040px] flex-col items-center px-4 sm:px-6 text-center">
        {/* Capsule Badge Label */}
        <SectionBadge>OUR SERVICES</SectionBadge>

        {/* Section Headline */}
        <h2 className="mt-5 sm:mt-7 lg:mt-9 select-none text-center">
          <span className="block font-display text-[34px] sm:text-[48px] lg:text-[clamp(48px,5.4vw,88px)] font-extrabold leading-[0.98] lg:leading-[0.96] tracking-[-0.04em] text-white">
            We Mastered
          </span>
          <span className="block font-serif text-[36px] sm:text-[50px] lg:text-[clamp(50px,5.6vw,94px)] font-normal italic leading-[0.98] lg:leading-[0.96] tracking-[-0.02em] text-white mt-1">
            The Art & Science of Scale
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 max-w-[560px] text-center text-[15px] sm:text-[17px] lg:text-[19px] font-normal leading-[1.45] text-[#A1A1AA]">
          Performance marketers, strategists and top-tier creatives under one roof.
        </p>
      </div>

      {/* 2. Smooth Horizontal Carousel Slider */}
      <div className="relative mt-10 sm:mt-16 lg:mt-20 w-full overflow-hidden">
        <div
          ref={trackRef}
          onScroll={updateActiveIndex}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex snap-x snap-mandatory gap-4 sm:gap-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pl-5 pr-8 sm:pl-[6vw] sm:pr-[10vw] cursor-grab active:cursor-grabbing pb-3"
        >
          {serviceItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              onClick={(e) => {
                if (hasMoved.current) {
                  e.preventDefault();
                }
              }}
              className="group relative shrink-0 snap-start overflow-hidden rounded-[26px] sm:rounded-[34px] bg-[#141418] text-left transition-all duration-300 hover:scale-[1.015] aspect-[4/5] w-[78vw] max-w-[320px] sm:w-[320px] md:w-[360px] lg:w-[390px] xl:w-[410px] shadow-2xl block border border-white/5 hover:border-white/20"
            >
              {/* Full-bleed high-end photographic imagery */}
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />

              {/* Gradient Vignettes for supreme readability */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/75 via-black/30 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Card Typography at TOP LEFT */}
              <div className="relative z-10 p-5 sm:p-7 lg:p-8 flex flex-col items-start text-left">
                <span className="font-display text-[24px] sm:text-[30px] lg:text-[36px] font-extrabold leading-[0.94] tracking-tight text-white drop-shadow-md">
                  {item.titleSans}
                </span>
                <span className="font-serif text-[26px] sm:text-[32px] lg:text-[38px] font-normal italic leading-[0.94] tracking-normal text-white drop-shadow-md mt-0.5">
                  {item.titleSerif}
                </span>
              </div>

              {/* Circular dark action button at BOTTOM RIGHT */}
              <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 z-10">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-[#0052FF] group-hover:border-[#0052FF] group-hover:scale-110 shadow-lg">
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 3. Centred Pagination Indicators */}
      <div className="mt-8 sm:mt-11 lg:mt-12 flex items-center justify-center gap-2">
        {serviceItems.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to service slide ${i + 1}`}
            className="p-1.5 -m-1.5 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#0052FF] rounded-full"
          >
            <span
              className={`block transition-all duration-300 ${
                activeIndex === i
                  ? "h-1.5 w-6 sm:h-2 sm:w-7 rounded-full bg-white"
                  : "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white/30 hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
