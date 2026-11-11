"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { googleCases, metaCases } from "@/data/marketing";
import { services, site, stats } from "@/data/site";
import { AnimatedText, ContactButton, FadeIn, ShotImage } from "./ui";
import { ChatBubble, GlassCard, GoogleAdsIcon, MetaIcon, ParticleMesh } from "./Decor";

/* ------------------------------------------------------------------ */
/*  SCROLL MARQUEE — live site heroes + ad dashboards                   */
/* ------------------------------------------------------------------ */
type Tile = { key: string; label: string; url?: string; image?: string; accent?: string };

function buildTiles(): [Tile[], Tile[]] {
  const sites: Tile[] = projects.filter((p) => p.url).map((p) => ({ key: p.title, label: p.title, url: p.url, image: p.image, accent: p.accent }));
  const ads: Tile[] = [
    ...googleCases.map((c) => ({ key: "g-" + c.client, label: `Google Ads · ${c.client}`, image: c.image })),
    ...metaCases.filter((c, i, a) => a.findIndex((x) => x.image === c.image) === i).map((c) => ({ key: "m-" + c.client, label: `Meta Ads · ${c.client.split(" — ")[0]}`, image: c.image })),
  ];
  // interleave sites & ads
  const all: Tile[] = [];
  const n = Math.max(sites.length, ads.length);
  for (let i = 0; i < n; i++) {
    if (sites[i]) all.push(sites[i]);
    if (ads[i]) all.push(ads[i]);
  }
  const half = Math.ceil(all.length / 2);
  return [all.slice(0, half), all.slice(half)];
}

function TileView({ t }: { t: Tile }) {
  return (
    <div className="group relative h-[180px] w-[280px] shrink-0 overflow-hidden rounded-2xl border border-line bg-card sm:h-[270px] sm:w-[420px]">
      {t.url && !t.image ? (
        <ShotImage url={t.url} alt={t.label} accent={t.accent} className="size-full" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.image} alt={t.label} loading="lazy" className="size-full bg-white object-cover object-top" />
      )}
      <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 font-display text-xs uppercase tracking-wider text-white backdrop-blur">
        {t.label}
      </span>
    </div>
  );
}

export function ScrollMarquee() {
  const ref = useRef<HTMLElement>(null);
  const row1 = useRef<HTMLDivElement>(null);
  const row2 = useRef<HTMLDivElement>(null);
  const [rows] = useState(buildTiles);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - top + window.innerHeight) * 0.3;
      if (row1.current) row1.current.style.transform = `translateX(${offset - 200}px)`;
      if (row2.current) row2.current.style.transform = `translateX(${-(offset - 200)}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} aria-label="Work preview" className="relative overflow-hidden pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        <div ref={row1} className="flex w-max gap-3" style={{ willChange: "transform", marginLeft: "-60%" }}>
          {[...rows[0], ...rows[0], ...rows[0]].map((t, i) => (
            <TileView key={t.key + i} t={t} />
          ))}
        </div>
        <div ref={row2} className="flex w-max gap-3" style={{ willChange: "transform", marginLeft: "-40%" }}>
          {[...rows[1], ...rows[1], ...rows[1]].map((t, i) => (
            <TileView key={t.key + i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ABOUT                                                              */
/* ------------------------------------------------------------------ */
export function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 2, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section
      id="about"
      data-bee='{"x":-0.62,"y":-0.05,"s":0.85}'
      data-robot="normal"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
    >
      <ParticleMesh className="opacity-60" density={0.7} />
      <div className="absolute inset-0 hidden md:block">
        <GlassCard className="left-[4%] top-[10%]" delay={0.1} item={{ icon: <GoogleAdsIcon className="size-6" />, value: "₹1.04 / install", label: "Google App campaign" }} />
        <GlassCard className="right-[4%] top-[12%]" delay={0.2} speed={0.35} item={{ icon: <MetaIcon className="h-5 w-7" />, value: "ROAS ↑", label: "Meta lead-gen", tone: "up" }} />
        <GlassCard className="bottom-[12%] left-[7%]" delay={0.3} item={{ icon: "⌘", value: "git push ✓", label: "deployed to prod", tone: "code" }} />
        <ChatBubble className="bottom-[14%] right-[6%]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn y={40}>
            <h2 className="hero-heading text-center font-display font-black uppercase leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
              About me
            </h2>
          </FadeIn>
          <AnimatedText
            text={site.aboutLong}
            className="max-w-[600px] text-center font-medium leading-relaxed text-[clamp(1.05rem,2vw,1.45rem)]"
          />
          <FadeIn className="max-w-[600px]">
            <p className="text-center text-sm leading-relaxed text-muted sm:text-base">{site.about[0]}</p>
          </FadeIn>
        </div>

        <div className="grid w-full max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div className="h-full rounded-[28px] border border-line bg-card/70 p-5 text-center backdrop-blur">
                <div className="hero-heading font-display text-4xl font-black sm:text-5xl">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <p className="mt-2 text-xs leading-snug text-muted sm:text-sm">{s.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SERVICES — inverted panel with rounded top                         */
/* ------------------------------------------------------------------ */
export function Services() {
  return (
    <section
      id="services"
      data-bee='{"x":0.8,"y":0.3,"s":0.75}'
      data-robot="normal"
      className="relative z-[1] rounded-t-[40px] bg-inv-bg px-5 py-20 text-inv-fg sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn>
        <h2 className="mb-16 text-center font-display font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
          Services
        </h2>
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        {services.map((s, i) => (
          <FadeIn key={s.title} delay={i * 0.1}>
            <div className="group flex items-start gap-5 border-b border-inv-line py-8 first:border-t sm:gap-10 sm:py-10 md:py-12">
              <span
                className="font-display font-black leading-none transition-colors duration-500 group-hover:text-[#b600a8]"
                style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
              >
                0{i + 1}
              </span>
              <div className="pt-1 sm:pt-3">
                <h3 className="font-display font-medium uppercase" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>
                  {s.title}
                </h3>
                <p className="mt-2 max-w-2xl font-light leading-relaxed opacity-60" style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}>
                  {s.text}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
