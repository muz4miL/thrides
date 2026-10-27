import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronDown, ArrowUpRight } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { cn } from "@/lib/utils";
import { services as siteServices, siteMeta } from "@/content/site";
import featuredPhone from "@/assets/services-mega-featured.jpg";

export interface MegaServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  visibleTags: string[];
  image: string;
}

export const sixServices: MegaServiceItem[] = siteServices.map((s) => ({
  id: s.id,
  slug: s.slug,
  title: s.title,
  description: s.summary,
  visibleTags: s.bullets.slice(0, 3),
  image: s.image,
}));

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [activePath, setActivePath] = useState("/");

  const headerRef = useRef<HTMLElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  // Scroll detection for translucent blurred header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu on outside click or Escape
  useEffect(() => {
    if (!isServicesOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(target) &&
        servicesTriggerRef.current &&
        !servicesTriggerRef.current.contains(target)
      ) {
        setIsServicesOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsServicesOpen(false);
        servicesTriggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isServicesOpen]);

  // Close mobile navigation on Escape
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        "h-[76px] min-[920px]:h-[100px]",
        isScrolled
          ? "border-b border-black/[0.08] bg-white/85 backdrop-blur-[18px] is-scrolled shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          : "border-b border-transparent bg-[#FAFAFA]",
      )}
    >
      {/* Mobile Top Bar (< 920px): Logo pinned LEFT, Hamburger pinned FAR RIGHT */}
      <div className="flex h-full w-full items-center justify-between px-5 min-[920px]:hidden">
        <a
          href="/"
          aria-label="Thrides home"
          className="group inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
        >
          <Wordmark className="text-[26px]" />
        </a>

        <button
          ref={mobileToggleRef}
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] text-black transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-primary"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMobileOpen((o) => !o)}
        >
          {isMobileOpen ? (
            <X size={24} className="stroke-[2.2] text-black" />
          ) : (
            <div className="flex flex-col gap-[5px] w-[22px]">
              <span className="block h-[2px] w-full bg-black rounded-full" />
              <span className="block h-[2px] w-full bg-black rounded-full" />
              <span className="block h-[2px] w-full bg-black rounded-full" />
            </div>
          )}
        </button>
      </div>

      {/* Desktop Top Bar (>= 920px) */}
      <div className="hidden h-full w-full max-w-[1440px] mx-auto min-[920px]:grid grid-cols-[1fr_auto_1fr] items-center px-[clamp(24px,3vw,56px)]">
        {/* Left: Thrides Logo */}
        <div className="flex items-center justify-self-start">
          <a
            href="/"
            aria-label="Thrides home"
            className="group inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
          >
            <Wordmark className="text-[32px]" />
          </a>
        </div>

        {/* Centre: Navigation Capsule */}
        <div className="flex items-center justify-self-center">
          <nav
            aria-label="Main navigation"
            className="relative inline-flex h-[60px] items-center gap-[4px] sm:gap-[6px] rounded-full bg-[#EAEAEA] border border-black/[0.06] p-[6px] shadow-sm"
          >
            {/* 1. Home */}
            <a
              href="/"
              className={cn(
                "flex h-[44px] items-center justify-center rounded-full px-4 text-[15px] transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2",
                activePath === "/"
                  ? "bg-black font-semibold text-white shadow-sm"
                  : "bg-transparent font-medium text-[#222226] hover:bg-black hover:font-semibold hover:text-white",
              )}
            >
              Home
            </a>

            {/* 2. Services & Packages with dropdown */}
            <div className="relative">
              <div className="flex items-center">
                <a
                  href="/services"
                  className={cn(
                    "flex h-[44px] items-center justify-center pl-4 pr-1.5 text-[15px] transition-colors duration-150 rounded-l-full",
                    activePath.startsWith("/services")
                      ? "bg-black font-semibold text-white shadow-sm"
                      : "bg-transparent font-medium text-[#222226] hover:bg-black hover:font-semibold hover:text-white",
                  )}
                >
                  Services & Packages
                </a>
                <button
                  ref={servicesTriggerRef}
                  type="button"
                  id="services-disclosure-button"
                  aria-haspopup="true"
                  aria-expanded={isServicesOpen}
                  aria-controls="services-mega-menu"
                  onClick={() => setIsServicesOpen((prev) => !prev)}
                  className={cn(
                    "flex h-[44px] items-center justify-center pr-3 pl-1 text-[15px] transition-colors duration-150 rounded-r-full",
                    activePath.startsWith("/services") || isServicesOpen
                      ? "bg-black text-white"
                      : "bg-transparent text-[#222226] hover:bg-black hover:text-white",
                  )}
                  aria-label="Toggle services menu"
                >
                  <ChevronDown
                    size={15}
                    className={cn(
                      "stroke-[2.5] transition-transform duration-200",
                      isServicesOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            {/* 3. Our Work */}
            <a
              href="/our-work"
              className={cn(
                "flex h-[44px] items-center justify-center rounded-full px-4 text-[15px] transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2",
                activePath.startsWith("/our-work") || activePath.startsWith("/case-studies")
                  ? "bg-black font-semibold text-white shadow-sm"
                  : "bg-transparent font-medium text-[#222226] hover:bg-black hover:font-semibold hover:text-white",
              )}
            >
              Our Work
            </a>

            {/* 4. About */}
            <a
              href="/about"
              className={cn(
                "flex h-[44px] items-center justify-center rounded-full px-4 text-[15px] transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2",
                activePath.startsWith("/about")
                  ? "bg-black font-semibold text-white shadow-sm"
                  : "bg-transparent font-medium text-[#222226] hover:bg-black hover:font-semibold hover:text-white",
              )}
            >
              About
            </a>

            {/* 5. Contact */}
            <a
              href="/contact"
              className={cn(
                "flex h-[44px] items-center justify-center rounded-full px-4 text-[15px] transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2",
                activePath.startsWith("/contact")
                  ? "bg-black font-semibold text-white shadow-sm"
                  : "bg-transparent font-medium text-[#222226] hover:bg-black hover:font-semibold hover:text-white",
              )}
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Right: Primary CTA Button "Book a Free Strategy Call" */}
        <div className="flex items-center gap-3 justify-self-end">
          <a
            href="/contact"
            className="inline-flex h-[56px] min-w-[210px] items-center justify-center gap-2 rounded-full border-2 border-black bg-black px-6 text-[14px] font-semibold text-white select-none transition-all duration-150 hover:bg-neutral-800 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-3"
          >
            <span>Book a Free Strategy Call</span>
            <ArrowUpRight size={17} className="stroke-[2.5]" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* FULL-WIDTH SERVICES MEGA MENU PANEL */}
      {isServicesOpen && (
        <div
          ref={megaMenuRef}
          id="services-mega-menu"
          role="region"
          aria-label="Services Overview"
          className="absolute left-0 right-0 top-full pt-2 px-[clamp(24px,3vw,56px)] z-50 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="mx-auto max-w-[1440px] rounded-[28px] border border-black/10 bg-white p-5 lg:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.12)]">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">
              {/* Left: 6 Service Cards Grid (3 cols x 2 rows) matching the 6 brief services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {sixServices.map((item) => (
                  <a
                    key={item.id}
                    href={`/services#${item.slug}`}
                    onClick={() => setIsServicesOpen(false)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.08] bg-[#F7F7F8] p-4 text-left transition-all duration-200 hover:border-black/30 hover:bg-[#EFEFF2] focus-visible:outline-2 focus-visible:outline-primary min-h-[145px]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-[16px] font-bold tracking-tight text-[#09090B]">
                          {item.title}
                        </span>
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-black/5 text-[#09090B] transition-all group-hover:bg-black group-hover:text-white">
                          <ArrowUpRight size={14} className="stroke-[2.5]" />
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#52525B] line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Visible Tag Row */}
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-black/[0.06]">
                      {item.visibleTags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-white border border-black/[0.08] px-2 py-0.5 text-[10.5px] font-medium text-[#3F3F46]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>

              {/* Right: The 3 Packages Preview Column */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#09090B] p-6 text-white shadow-xl">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                    <span>Packages for Every Stage</span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight text-white xl:text-[26px]">
                    Kickstart · Accelerate · Authority
                  </h3>

                  <p className="mt-3 text-[14px] leading-relaxed text-neutral-300">
                    From setting up your online presence in 3 weeks to complete custom market dominance.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col gap-3 mt-6">
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[12px] text-neutral-400">
                    <span>{siteMeta.trustBarSummary}</span>
                  </div>

                  <a
                    href="/services#packages"
                    onClick={() => setIsServicesOpen(false)}
                    className="flex h-[46px] w-full items-center justify-center gap-2 rounded-full border border-white bg-white font-semibold text-[#09090B] transition-transform hover:bg-neutral-200"
                  >
                    <span>Compare All Packages</span>
                    <ArrowUpRight size={16} className="stroke-[2.5]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isMobileOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Mobile navigation"
          className="mx-3 mt-2 flex flex-col gap-2 rounded-3xl border border-black/10 bg-white p-3.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 min-[920px]:hidden"
        >
          {/* Home */}
          <a
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex min-h-[46px] items-center rounded-2xl bg-[#F4F4F6] px-4 text-[15px] font-medium text-[#09090B] transition-colors hover:bg-black hover:font-semibold hover:text-white"
          >
            Home
          </a>

          {/* Services & Packages Accordion */}
          <div className="flex flex-col rounded-2xl bg-[#F4F4F6] overflow-hidden">
            <div className="flex items-center justify-between pr-2">
              <a
                href="/services"
                onClick={() => setIsMobileOpen(false)}
                className="flex min-h-[46px] flex-1 items-center px-4 text-[15px] font-medium text-[#09090B] hover:text-black"
              >
                Services & Packages
              </a>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center text-[#09090B]"
                aria-expanded={isMobileServicesOpen}
                onClick={() => setIsMobileServicesOpen((prev) => !prev)}
                aria-label="Toggle services list"
              >
                <ChevronDown
                  size={16}
                  className={cn(
                    "stroke-[2.5] transition-transform duration-200",
                    isMobileServicesOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>
            {isMobileServicesOpen && (
              <div className="grid grid-cols-1 gap-1.5 border-t border-black/[0.08] bg-[#EEEEF0] p-2.5">
                {sixServices.map((item) => (
                  <a
                    key={item.id}
                    href={`/services#${item.slug}`}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-white p-3 text-left border border-black/[0.06] hover:bg-neutral-50 transition-colors"
                  >
                    <div>
                      <div className="text-[14px] font-bold text-[#09090B]">{item.title}</div>
                      <div className="text-[12px] text-[#52525B] line-clamp-1">{item.description}</div>
                    </div>
                    <ArrowUpRight size={15} className="text-[#09090B] shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Our Work */}
          <a
            href="/our-work"
            onClick={() => setIsMobileOpen(false)}
            className="flex min-h-[46px] items-center rounded-2xl bg-[#F4F4F6] px-4 text-[15px] font-medium text-[#09090B] transition-colors hover:bg-black hover:font-semibold hover:text-white"
          >
            Our Work
          </a>

          {/* About */}
          <a
            href="/about"
            onClick={() => setIsMobileOpen(false)}
            className="flex min-h-[46px] items-center rounded-2xl bg-[#F4F4F6] px-4 text-[15px] font-medium text-[#09090B] transition-colors hover:bg-black hover:font-semibold hover:text-white"
          >
            About
          </a>

          {/* Contact */}
          <a
            href="/contact"
            onClick={() => setIsMobileOpen(false)}
            className="flex min-h-[46px] items-center rounded-2xl bg-[#F4F4F6] px-4 text-[15px] font-medium text-[#09090B] transition-colors hover:bg-black hover:font-semibold hover:text-white"
          >
            Contact
          </a>

          {/* Mobile CTA */}
          <a
            href="/contact"
            onClick={() => setIsMobileOpen(false)}
            className="mt-1 flex min-h-[50px] items-center justify-center gap-2 rounded-full border-2 border-black bg-black px-5 text-[14px] font-semibold text-white transition-transform hover:bg-neutral-800"
          >
            <span>Book a Free Strategy Call</span>
            <ArrowUpRight size={17} className="stroke-[2.5]" aria-hidden="true" />
          </a>
        </nav>
      )}
    </header>
  );
}
