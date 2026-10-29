"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown, Plus, Minus, Target, BrainCircuit, MessageSquare, Users } from "lucide-react";
import rawStyles from "./about.module.css";

const styles: any = rawStyles;

type Props = {
  stats: readonly { value: string | number; label: string }[];
  members: readonly { name: string; initials: string; role: string; bio: string }[];
};

const principles = [
  {
    title: "One plan. Every move connected.", label: "Direction", icon: Target,
    description: "Everything we do ties back to your business goals. No random disjointed tasks.",
    words: ["Your goals", "Our strategy", "Every execution"]
  },
  {
    title: "Insight before instinct.", label: "Intelligence", icon: BrainCircuit,
    description: "We research your market, competitors, and customers before we create anything, so your marketing starts with an edge.",
    words: ["Your market", "Your audience", "Your advantage"]
  },
  {
    title: "Clarity at every step.", label: "Communication", icon: MessageSquare,
    description: "You’ll always know what’s working and what we’re changing, without buzzwords.",
    words: ["What we see", "What it means", "What comes next"]
  },
  {
    title: "A partner. Not a ticket number.", label: "Partnership", icon: Users,
    description: "A proper welcome, a clear point of contact, agreed response times, and updates without chasing.",
    words: ["A real welcome", "A clear contact", "A shared ambition"]
  },
];

export default function AboutExperience({ stats, members }: Props) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(0);
  const selected = (principles[active ?? 0] ?? principles[0])!;
  const Icon = selected.icon;

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    // Load motion as enhancement; server-rendered content is always visible.
    async function initialize() {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"), import("gsap/ScrollTrigger"),
        ]);
        if (disposed || !root.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const ctx = gsap.context(() => {
            gsap.from("[data-hero-copy]", {
              y: 26, opacity: 0, duration: 0.85, stagger: 0.12,
              ease: "power3.out", clearProps: "all",
            });
            gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
              gsap.from(element, {
                y: 28, opacity: 0, duration: 0.75, ease: "power3.out",
                clearProps: "all", scrollTrigger: { trigger: element, start: "top 92%", once: true },
              });
            });
            if (window.matchMedia("(min-width: 900px)").matches) {
              gsap.to("[data-hero-art]", {
                yPercent: 7, ease: "none",
                scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: 0.7 },
              });
            }
            gsap.fromTo("[data-manifesto]", { xPercent: 3 }, {
              xPercent: -8, ease: "none",
              scrollTrigger: { trigger: "[data-manifesto-wrap]", start: "top bottom", end: "bottom top", scrub: 0.8 },
            });
          }, root);
          return () => ctx.revert();
        });
        const refresh = () => { if (!disposed) ScrollTrigger.refresh(); };
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
    return () => { disposed = true; cleanup?.(); };
  }, []);

  return (
    <main ref={root} className={styles.page}>
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

      <section className={styles.stats} aria-label="Thrides in numbers">
        {stats.map((stat, index) => (
          <div key={stat.label} data-reveal><span className={styles.index}>0{index + 1}</span><strong className="font-display">{stat.value}</strong><span>{stat.label}</span></div>
        ))}
      </section>

      <section id="our-story" className={styles.story}>
        <div data-reveal><p className={styles.eyebrow}>01 / OUR STORY</p><h2 className="font-display">Everywhere.<br /><em className="font-serif">With intention.</em></h2><span className={styles.blueLine} /></div>
        <div className={styles.storyCopy} data-reveal>
          <p className={styles.lead}>Good businesses deserve<br />to be <span>impossible to overlook.</span></p>
          <p>Most businesses we meet aren’t bad at marketing. They have a good product and real customers waiting, but their brand isn’t where those customers are looking, or it shows up without a reason to be remembered.</p>
          <p><strong>Thrides exists to fix that.</strong> We put your brand in front of the right people: on your website, on social media, in search, and in their inbox.</p>
          <p>Being everywhere is the easy part to promise. Doing it on purpose is the work: researching your market, choosing the right places, and making every appearance count.</p>
        </div>
      </section>

      <div className={styles.manifesto} data-manifesto-wrap aria-label="Every move, on purpose">
        <p data-manifesto aria-hidden="true">EVERY MOVE. <em className="font-serif">On purpose.</em> EVERY MOVE.</p>
      </div>

      <section className={styles.experience}>
        <div className={styles.sectionHead} data-reveal><div><p className={styles.eyebrow}>02 / THE EXPERIENCE</p><h2 className="font-display">Good work starts with<br /><em className="font-serif">a better partnership.</em></h2></div><p>Clear thinking. Connected execution.<br />People you can actually talk to.</p></div>
        <div className={styles.experienceGrid}>
          <div className={styles.principles}>
            {principles.map((item, index) => {
              const open = active === index;
              return <article key={item.label} className={styles.principle} data-open={open} data-reveal>
                <h3><button type="button" id={"principle-button-" + index} aria-expanded={open} aria-controls={"principle-panel-" + index} onClick={() => setActive(open ? null : index)}>
                  <span className={styles.index}>0{index + 1}</span><span>{item.title}</span>{open ? <Minus size={18} /> : <Plus size={18} />}
                </button></h3>
                <div id={"principle-panel-" + index} role="region" aria-labelledby={"principle-button-" + index} hidden={!open} className={styles.principleBody}><p>{item.description}</p></div>
              </article>;
            })}
          </div>
          <div className={styles.strategyVisual} aria-hidden="true">
            <span className={styles.visualLabel}>THE THRIDES APPROACH</span>
            <div className={styles.orbit}><div className={styles.orbitInner} /><div className={styles.core}><Icon size={42} strokeWidth={1.2} /></div><span className={styles.orbitDot} /></div>
            <div key={selected.label} className={styles.visualCopy}><span>{selected.label}</span><p className="font-serif">{selected.words[2]}</p><div>{selected.words.map((word) => <span key={word}>{word}</span>)}</div></div>
          </div>
        </div>
      </section>

      <section className={styles.team}>
        <div className={styles.sectionHead} data-reveal><div><p className={styles.eyebrow}>03 / OUR PEOPLE</p><h2 className="font-display">Real people.<br /><em className="font-serif">Shared ambition.</em></h2></div><p>Senior strategists directing every plan<br />with dedicated execution.</p></div>
        <div className={styles.teamGrid}>
          {members.map((member, index) => (
            <article className={styles.person} key={member.name} data-reveal>
              <div className={styles.monogram} aria-hidden="true"><span className={styles.personIndex}>THRIDES / 0{index + 1}</span><div className={styles.personRing} /><strong className="font-display">{member.initials}</strong><span className={styles.personCaption}>THE PEOPLE BEHIND THE PURPOSE</span></div>
              <div className={styles.personInfo}><h3 className="font-display">{member.name}</h3><p className={styles.role}>{member.role}</p><p>{member.bio}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.standard} data-reveal><p className={styles.eyebrow}>OUR STANDARD</p><blockquote className="font-display">Attention should never<br />be accidental.<br /><em className="font-serif">Let’s make yours on purpose.</em></blockquote><p>Every website, post, campaign, and email we produce is backed by research and built to deliver measurable commercial clarity.</p></section>

      <section className={styles.cta} data-reveal>
        <div><p className={styles.eyebrow}>YOUR NEXT CHAPTER</p><h2 className="font-display">Let’s make<br /><em className="font-serif">your mark.</em></h2></div>
        <div><p>Book a free 30-minute strategy call. We’ll review your current marketing and show you where the biggest opportunities are.</p><Link href="/contact" className={styles.primary}>Book a free strategy call <ArrowUpRight size={20} /></Link><span className={styles.ctaNote}>A conversation. A clearer direction.</span></div>
      </section>
    </main>
  );
}