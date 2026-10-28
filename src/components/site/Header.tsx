"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronDown, ArrowUpRight } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { cn } from "@/lib/utils";
import { services as siteServices, siteMeta } from "@/content/site";

export interface MegaServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  visibleTags: string[];
  image: any;
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
        "sticky top-0 z-50 w-full transition-all duration-200 select-none",
        "h-[76px] min-[920px]:h-[100px]",
        isScrolled
          ? "border-b border-white/[0.08] bg-[#08080B]/90 backdrop-blur-[18px] is-scrolled shadow-2xl shadow-black/80"
          : "border-b border-transparent bg-[#08080B]",
      )}
    >
      {/* Mobile Top Bar (< 920px): Logo pinned LEFT, Hamburger pinned FAR RIGHT */}
      <div className="flex h-full w-full items-center justify-between px-5 min-[920px]:hidden">
        <a
          href="/"
          aria-label="Thrides home"
          className="group inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
        >
          <Wordmark className="h-8 w-auto" />
        </a>

        <button
          ref={mobileToggleRef}
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-white"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMobileOpen((o) => !o)}
        >
          {isMobileOpen ? (
            <X size={24} className="stroke-[2.2] text-white" />
          ) : (
            <div className="flex flex-col gap-[5px] w-[22px]">
              <span className="block h-[2px] w-full bg-white rounded-full" />
              <span className="block h-[2px] w-full bg-white rounded-full" />
              <span className="block h-[2px] w-full bg-white rounded-full" />
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
            className="group inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
          >
            <Wordmark className="h-9 w-auto" />
          </a>
        </div>

        {/* Centre: Navigation Capsule */}
        <div className="flex items-center justify-self-center">
          <nav
            aria-label="Main navigation"
            className="relative inline-flex h-[58px] sm:h-[62px] items-center gap-[4px] sm:gap-[6px] rounded-full bg-[#121216] border border-white/10 p-[5px] sm:p-[6px] shadow-lg shadow-black/50"
          >
            {/* 1. Home */}
            <a
              href="/"
              className={cn(
                "flex h-[44px] items-center justify-center rounded-full px-4 text-[15px] transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
                activePath === "/"
                  ? "bg-[#0052FF] font-bold text-white shadow-md shadow-blue-950/40"
                  : "bg-transparent font-medium text-[#E4E4E7] hover:bg-white/10 hover:text-white",
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
                      ? "bg-[#0052FF] font-bold text-white shadow-md shadow-blue-950/40"
                      : "bg-transparent font-medium text-[#E4E4E7] hover:bg-white/10 hover:text-white",
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
                      ? "bg-[#0052FF] text-white"
                      : "bg-transparent text-[#E4E4E7] hover:bg-white/10 hover:text-white",
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
                "focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
                activePath.startsWith("/our-work") || activePath.startsWith("/case-studies")
                  ? "bg-[#0052FF] font-bold text-white shadow-md shadow-blue-950/40"
                  : "bg-transparent font-medium text-[#E4E4E7] hover:bg-white/10 hover:text-white",
              )}
            >
              Our Work
            </a>

            {/* 4. About */}
            <a
              href="/about"
              className={cn(
                "flex h-[44px] items-center justify-center rounded-full px-4 text-[15px] transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
                activePath.startsWith("/about")
                  ? "bg-[#0052FF] font-bold text-white shadow-md shadow-blue-950/40"
                  : "bg-transparent font-medium text-[#E4E4E7] hover:bg-white/10 hover:text-white",
              )}
            >
              About
            </a>

            {/* 5. Contact */}
            <a
              href="/contact"
              className={cn(
                "flex h-[44px] items-center justify-center rounded-full px-4 text-[15px] transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
                activePath.startsWith("/contact")
                  ? "bg-[#0052FF] font-bold text-white shadow-md shadow-blue-950/40"
                  : "bg-transparent font-medium text-[#E4E4E7] hover:bg-white/10 hover:text-white",
              )}
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Right: Standout CTA Button "t. Get Started" in Thrides Blue */}
        <div className="flex items-center gap-3 justify-self-end">
          <a
            href="/contact"
            className="inline-flex h-[52px] items-center gap-2.5 rounded-full bg-[#0052FF] px-6 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#0043DB] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_24px_rgba(0,82,255,0.45)] select-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-3"
          >
            <span className="font-display font-black text-[17px] leading-none">t.</span>
            <span>Get Started</span>
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
          <div className="mx-auto max-w-[1440px] rounded-[28px] border border-white/10 bg-[#0E0E12]/95 backdrop-blur-2xl p-5 lg:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.8)] text-white">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">
              {/* Left: 6 Service Cards Grid (3 cols x 2 rows) matching the 6 brief services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {sixServices.map((item) => (
                  <a
                    key={item.id}
                    href={`/services#${item.slug}`}
                    onClick={() => setIsServicesOpen(false)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#15151C] p-4 text-left transition-all duration-200 hover:border-[#0052FF]/60 hover:bg-[#1C1C26] focus-visible:outline-2 focus-visible:outline-white min-h-[145px]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-[16px] font-bold tracking-tight text-white group-hover:text-[#60A5FA] transition-colors">
                          {item.title}
                        </span>
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white transition-all group-hover:bg-[#0052FF] group-hover:text-white">
                          <ArrowUpRight size={14} className="stroke-[2.5]" />
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#A1A1AA] line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Visible Tag Row */}
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      {item.visibleTags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10.5px] font-medium text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>

              {/* Right: The 3 Packages Preview Column */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#000000] border border-white/10 p-6 text-white shadow-xl">
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
                    className="flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#0052FF] font-bold text-white transition-transform hover:scale-[1.02] shadow-[0_0_18px_rgba(0,82,255,0.45)]"
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
          className="mx-3 mt-2 flex flex-col gap-2 rounded-3xl border border-white/10 bg-[#0E0E12] p-3.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 min-[920px]:hidden text-white"
        >
          {/* Home */}
          <a
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex min-h-[46px] items-center rounded-2xl bg-[#17171E] px-4 text-[15px] font-medium text-white transition-colors hover:bg-[#0052FF] hover:font-bold hover:text-white"
          >
            Home
          </a>

          {/* Services & Packages Accordion */}
          <div className="flex flex-col rounded-2xl bg-[#17171E] overflow-hidden">
            <div className="flex items-center justify-between pr-2">
              <a
                href="/services"
                onClick={() => setIsMobileOpen(false)}
                className="flex min-h-[46px] flex-1 items-center px-4 text-[15px] font-medium text-white hover:text-[#60A5FA]"
              >
                Services & Packages
              </a>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center text-white"
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
              <div className="grid grid-cols-1 gap-1.5 border-t border-white/10 bg-[#121217] p-2.5">
                {sixServices.map((item) => (
                  <a
                    key={item.id}
                    href={`/services#${item.slug}`}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-[#1C1C24] p-3 text-left border border-white/5 hover:border-[#0052FF]/50 transition-colors"
                  >
                    <div>
                      <div className="text-[14px] font-bold text-white">{item.title}</div>
                      <div className="text-[12px] text-[#A1A1AA] line-clamp-1">{item.description}</div>
                    </div>
                    <ArrowUpRight size={15} className="text-[#60A5FA] shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Our Work */}
          <a
            href="/our-work"
            onClick={() => setIsMobileOpen(false)}
            className="flex min-h-[46px] items-center rounded-2xl bg-[#17171E] px-4 text-[15px] font-medium text-white transition-colors hover:bg-[#0052FF] hover:font-bold hover:text-white"
          >
            Our Work
          </a>

          {/* About */}
          <a
            href="/about"
            onClick={() => setIsMobileOpen(false)}
            className="flex min-h-[46px] items-center rounded-2xl bg-[#17171E] px-4 text-[15px] font-medium text-white transition-colors hover:bg-[#0052FF] hover:font-bold hover:text-white"
          >
            About
          </a>

          {/* Contact */}
          <a
            href="/contact"
            onClick={() => setIsMobileOpen(false)}
            className="flex min-h-[46px] items-center rounded-2xl bg-[#17171E] px-4 text-[15px] font-medium text-white transition-colors hover:bg-[#0052FF] hover:font-bold hover:text-white"
          >
            Contact
          </a>

          {/* Mobile CTA */}
          <a
            href="/contact"
            onClick={() => setIsMobileOpen(false)}
            className="mt-1 flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#0052FF] px-5 text-[15px] font-bold text-white transition-transform active:scale-[0.98] shadow-[0_0_20px_rgba(0,82,255,0.45)]"
          >
            <span className="font-display font-black text-[16px]">t.</span>
            <span>Get Started</span>
            <ArrowUpRight size={17} className="stroke-[2.5]" aria-hidden="true" />
          </a>
        </nav>
      )}
    </header>
  );
}
