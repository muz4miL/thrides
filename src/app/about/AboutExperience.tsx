"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown, Plus, Minus } from "lucide-react";
import { CtaBanner } from "@/components/site/CtaBanner";
import type { TeamMember } from "@/content/site";
import rawStyles from "./about.module.css";

const styles: any = rawStyles;

type Props = {
  stats: readonly { value: string | number; label: string }[];
  members: readonly TeamMember[];
};

const principles = [
  {
    title: "One plan. Every move connected.",
    label: "Direction",
    image: "/images/about/1.png",
    description: "Everything we do ties back to your business goals. No random disjointed tasks.",
    words: ["Your goals", "Our strategy", "Every execution"],
  },
  {
    title: "Insight before instinct.",
    label: "Intelligence",
    image: "/images/about/2.png",
    description: "We research your market, competitors, and customers before we create anything, so your marketing starts with an edge.",
    words: ["Your market", "Your audience", "Your advantage"],
  },
  {
    title: "Clarity at every step.",
    label: "Communication",
    image: "/images/about/3.png",
    description: "You’ll always know what’s working and what we’re changing, without buzzwords.",
    words: ["What we see", "What it means", "What comes next"],
  },
  {
    title: "A partner. Not a ticket number.",
    label: "Partnership",
    image: "/images/about/4.png",
    description: "A proper welcome, a clear point of contact, agreed response times, and updates without chasing.",
    words: ["A real welcome", "A clear contact", "A shared ambition"],
  },
];

export default function AboutExperience({ stats, members }: Props) {
  const root = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(0);
  const lastActiveRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  if (active !== null) {
    lastActiveRef.current = active;
  }
  const selectedIndex = active ?? lastActiveRef.current;
  const selected = (principles[selectedIndex] ?? principles[0])!;

  // Preload all 4 sculpture images on mount
  useEffect(() => {
    principles.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, []);

  // Pause floating motion when section is offscreen or tab is hidden
  useEffect(() => {
    const section = experienceRef.current;
    if (!section) return;

    let isIntersecting = true;
    let isTabHidden = document.hidden;

    const updatePaused = () => {
      setIsPaused(!isIntersecting || isTabHidden);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          isIntersecting = entry.isIntersecting;
          updatePaused();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    const handleVisibility = () => {
      isTabHidden = document.hidden;
      updatePaused();
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    async function initialize() {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (disposed || !root.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const ctx = gsap.context(() => {
            gsap.from("[data-hero-copy]", {
              y: 26,
              opacity: 0,
              duration: 0.85,
              stagger: 0.12,
              ease: "power3.out",
              clearProps: "all",
            });
            gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
              gsap.from(element, {
                y: 28,
                opacity: 0,
                duration: 0.75,
                ease: "power3.out",
                clearProps: "all",
                scrollTrigger: { trigger: element, start: "top 92%", once: true },
              });
            });
            if (window.matchMedia("(min-width: 900px)").matches) {
              gsap.to("[data-hero-art]", {
                yPercent: 7,
                ease: "none",
                scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: 0.7 },
              });
              gsap.fromTo(
                "[data-manifesto]",
                { xPercent: 3 },
                {
                  xPercent: -8,
                  ease: "none",
                  scrollTrigger: { trigger: "[data-manifesto-wrap]", start: "top bottom", end: "bottom top", scrub: 0.8 },
                }
              );
            }
          }, root);
          return () => ctx.revert();
        });
        const refresh = () => {
          if (!disposed) ScrollTrigger.refresh();
        };
        document.fonts.ready.then(refresh);
        const images = Array.from(root.current.querySelectorAll("img"));
        images.forEach((image) => image.addEventListener("load", refresh, { once: true }));
        cleanup = () => {
          mm.revert();
          images.forEach((image) => image.removeEventListener("load", refresh));
        };
      } catch (error) {
        console.warn("About-page motion could not initialize; static layout retained.", error);
      }
    }
    void initialize();
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <main ref={root} className={styles.page}>
      {/* ─── HERO ─── */}
      <section className={styles.hero} data-hero aria-labelledby="about-title">
        <picture className={styles.heroArt} data-hero-art>
          <source media="(max-width: 700px)" srcSet="/images/about/thrides-about-mobile.webp" />
          <img src="/images/about/thrides-about-desktop.webp" alt="" width={1536} height={1024} fetchPriority="high" />
        </picture>
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <p className={styles.eyebrow} data-hero-copy><span /> THE THINKING BEHIND THRIDES</p>
          <h1 id="about-title" className="font-display" data-hero-copy>
            Attention.<br />Never<br /><em className="font-serif">accidental.</em>
          </h1>
          <p className={styles.heroDescription} data-hero-copy>A digital creative agency connecting strategy, design, and marketing. Every appearance. On purpose.</p>
          <div className={styles.heroActions} data-hero-copy>
            <Link href="/our-work" className={styles.primary}>Explore our work <ArrowUpRight size={19} /></Link>
            <a href="#our-story" className={styles.textLink}>Meet Thrides <ArrowDown size={17} /></a>
          </div>
        </div>
        <div className={styles.heroFoot}><span>STRATEGY × CREATIVE × DIGITAL</span><a href="#our-story">SCROLL TO DISCOVER <ArrowDown size={13} /></a></div>
      </section>

      {/* ─── STATS ─── */}
      <section className={styles.stats} aria-label="Thrides in numbers">
        {stats.map((stat, index) => {
          const valStr = String(stat.value);
          const match = valStr.match(/^([0-9+]+)\s*(.*)$/);
          const num = match ? match[1] : valStr;
          const unit = match ? match[2] : "";

          return (
            <div key={stat.label} className={styles.statCol} data-reveal>
              <span className={styles.index}>0{index + 1}</span>
              <div className={styles.statContent}>
                <strong className={`font-display ${styles.statNumber}`}>{num}</strong>
                {unit && <span className={styles.statUnit}>{unit}</span>}
              </div>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          );
        })}
      </section>

      {/* ─── STORY ─── */}
      <section id="our-story" className={styles.story}>
        <div data-reveal><p className={styles.eyebrow}>01 / OUR STORY</p><h2 className="font-display">Everywhere.<br /><em className="font-serif">With intention.</em></h2><span className={styles.blueLine} /></div>
        <div className={styles.storyCopy} data-reveal>
          <p className={styles.lead}>Good businesses deserve<br />to be <span>impossible to overlook.</span></p>
          <p>Most businesses we meet aren’t bad at marketing. They have a good product and real customers waiting, but their brand isn’t where those customers are looking, or it shows up without a reason to be remembered.</p>
          <p><strong>Thrides exists to fix that.</strong> We put your brand in front of the right people: on your website, on social media, in search, and in their inbox.</p>
          <p>Being everywhere is the easy part to promise. Doing it on purpose is the work: researching your market, choosing the right places, and making every appearance count.</p>
        </div>
      </section>

      {/* ─── MANIFESTO / STRAP TEXT ─── */}
      <div className={styles.manifesto} data-manifesto-wrap aria-label="Every move, on purpose">
        {/* Desktop version: preserved exact layout and parallax */}
        <div className={styles.manifestoDesktop}>
          <p data-manifesto aria-hidden="true">
            EVERY MOVE. <em className="font-serif">On purpose.</em> EVERY MOVE.
          </p>
        </div>

        {/* Mobile version: smooth, unclipped infinite marquee ticker */}
        <div className={styles.manifestoMobile} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            <span className={styles.marqueeItem}>
              EVERY MOVE. <em className="font-serif">On purpose.</em> EVERY MOVE. <span className={styles.marqueeSep}>·</span>
            </span>
            <span className={styles.marqueeItem}>
              EVERY MOVE. <em className="font-serif">On purpose.</em> EVERY MOVE. <span className={styles.marqueeSep}>·</span>
            </span>
            <span className={styles.marqueeItem}>
              EVERY MOVE. <em className="font-serif">On purpose.</em> EVERY MOVE. <span className={styles.marqueeSep}>·</span>
            </span>
            <span className={styles.marqueeItem}>
              EVERY MOVE. <em className="font-serif">On purpose.</em> EVERY MOVE. <span className={styles.marqueeSep}>·</span>
            </span>
          </div>
        </div>
      </div>

      {/* ─── THE EXPERIENCE / THE THRIDES APPROACH ─── */}
      <section ref={experienceRef} className={styles.experience}>
        <div className={styles.sectionHead} data-reveal>
          <div>
            <p className={styles.eyebrow}>02 / THE EXPERIENCE</p>
            <h2 className="font-display">
              Good work starts with<br /><em className="font-serif">a better partnership.</em>
            </h2>
          </div>
          <p>Clear thinking. Connected execution.<br />People you can actually talk to.</p>
        </div>

        <div className={styles.experienceGrid}>
          {/* Accordion Principles */}
          <div className={styles.principles}>
            {principles.map((item, index) => {
              const open = active === index;
              return (
                <article key={item.label} className={styles.principle} data-open={open} data-reveal>
                  <h3>
                    <button
                      type="button"
                      id={"principle-button-" + index}
                      aria-expanded={open}
                      aria-controls={"principle-panel-" + index}
                      onClick={() => setActive(open ? null : index)}
                    >
                      <span className={styles.index}>0{index + 1}</span>
                      <span>{item.title}</span>
                      {open ? <Minus size={18} /> : <Plus size={18} />}
                    </button>
                  </h3>
                  <div
                    id={"principle-panel-" + index}
                    role="region"
                    aria-labelledby={"principle-button-" + index}
                    hidden={!open}
                    className={styles.principleBody}
                  >
                    <p className={styles.principleDescription}>{item.description}</p>

                    {/* Mobile Visual: Displayed directly beneath open description on narrow viewports */}
                    {open && (
                      <div className={styles.mobileVisualWrap}>
                        <div className={styles.mobileStage}>
                          <div key={item.image} className={styles.transitionWrapper}>
                            <div className={`${styles.floatWrapper} ${isPaused ? styles.paused : ""}`}>
                              <img
                                src={item.image}
                                alt=""
                                width={240}
                                height={240}
                                className={styles.sculptureImg}
                                loading="eager"
                              />
                            </div>
                          </div>
                        </div>

                        <div className={styles.visualCopy}>
                          <span className={styles.categoryBadge}>{item.label}</span>
                          <p className={`font-serif ${styles.captionText}`}>{item.words[2]}</p>
                          <div className={styles.chipsRow}>
                            {item.words.map((word) => (
                              <span key={word} className={styles.chip}>{word}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Desktop Preview Panel: Dedicated Sculpture Stage */}
          <div className={styles.strategyVisual} aria-hidden="true">
            <span className={styles.visualLabel}>THE THRIDES APPROACH</span>

            <div className={styles.stage}>
              {/* Separate wrapper for crossfade / enter transition */}
              <div key={selected.image} className={styles.transitionWrapper}>
                {/* Separate wrapper for continuous gentle floating motion */}
                <div className={`${styles.floatWrapper} ${isPaused ? styles.paused : ""}`}>
                  <img
                    src={selected.image}
                    alt=""
                    width={300}
                    height={300}
                    className={styles.sculptureImg}
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            <div key={selected.label} className={styles.visualCopy}>
              <span className={styles.categoryBadge}>{selected.label}</span>
              <p className={`font-serif ${styles.captionText}`}>{selected.words[2]}</p>
              <div className={styles.chipsRow}>
                {selected.words.map((word) => (
                  <span key={word} className={styles.chip}>{word}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className={styles.team}>
        <div className={styles.sectionHead} data-reveal><div><p className={styles.eyebrow}>03 / OUR PEOPLE</p><h2 className="font-display">Real people.<br /><em className="font-serif">Shared ambition.</em></h2></div><p>Senior strategists directing every plan<br />with dedicated execution.</p></div>
        <div className={styles.teamGrid}>
          {members.map((member, index) => (
            <article className={styles.person} key={member.name} data-reveal>
              <div className={`${styles.monogram} relative aspect-[4/5] max-h-[500px] overflow-hidden rounded-2xl`} style={{ aspectRatio: "4/5" }} aria-hidden="true">
                {member.image ? (
                  <>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                      loading="lazy"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-transparent to-transparent opacity-60"
                    />
                  </>
                ) : (
                  <>
                    <div className={styles.personRing} />
                    <strong className="font-display">{member.initials}</strong>
                  </>
                )}
                <span className="absolute right-4 top-4 font-mono text-[9.5px] font-bold tracking-[0.18em] text-[#C3D4FF] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 z-10">
                  THRIDES / 0{index + 1}
                </span>
                <span className="absolute left-4 bottom-4 font-mono text-[9px] font-bold tracking-[0.18em] text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 z-10">
                  PARTNER
                </span>
              </div>
              <div className={styles.personInfo}><h3 className="font-display">{member.name}</h3><p className={styles.role}>{member.role}</p><p>{member.bio}</p></div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── OUR STANDARD ─── */}
      <section className={styles.standard} data-reveal><p className={styles.eyebrow}>OUR STANDARD</p><blockquote className="font-display">Attention should never<br />be accidental.<br /><em className="font-serif">Let’s make yours on purpose.</em></blockquote><p>Every website, post, campaign, and email we produce is backed by research and built to deliver measurable commercial clarity.</p></section>

      {/* ─── REMOTE CAREERS BANNER ─── */}
      <section className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0E0F18] via-[#121526] to-[#0A0B10] p-8 sm:p-12 backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-24 right-0 h-[280px] w-[280px] rounded-full bg-[#0052FF]/15 blur-[90px]" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0052FF]/40 bg-[#0052FF]/10 px-3.5 py-1 text-xs font-semibold text-[#60A5FA]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                  We&apos;re Hiring • 100% Remote Friendly
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Want to build with us from anywhere?
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                We are actively looking for exceptional media buyers, motion designers, creative strategists, and engineers who thrive on high autonomy and commercial impact.
              </p>
            </div>
            <Link
              href="/careers"
              className="btn-shiny-blue inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shrink-0 self-start md:self-center cursor-pointer"
            >
              <span>Explore Remote Roles</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-8 py-16 sm:py-24">
        <CtaBanner
          eyebrow="LET’S BUILD SOMETHING MEANINGFUL"
          headingPrefix="Good people."
          accentText="Extraordinary possibilities."
          buttonLeftText="Ready?"
          buttonRightText="Start Now"
          buttonHref="/contact"
          imageSrc="/images/cta/about-banner.png"
          mobileObjectPosition="75% center"
        />
      </section>
    </main>
  );
}
