"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { googleCases, marketingKpis, marketingToolkit, metaCases, type MetaCase } from "@/data/marketing";
import { Counter } from "./Jack";
import { FadeIn, spotlightMove } from "./ui";
import { GlassCard, GridLines } from "./Decor";

/* ---------- lightbox ---------- */
function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button aria-label="Close" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white text-black">
            <X className="size-5" />
          </button>
          { }
          <motion.img
            src={src}
            alt="Campaign dashboard"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="max-h-[88vh] max-w-full rounded-2xl bg-white object-contain shadow-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Shot({ src, onOpen, className = "", fit = "cover" }: { src: string; onOpen: (s: string) => void; className?: string; fit?: "cover" | "contain" }) {
  return (
    <button
      onClick={() => onOpen(src)}
      className={`group relative block w-full overflow-hidden rounded-[22px] border border-line bg-white ${className}`}
      aria-label="Open dashboard screenshot"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" className={`size-full transition-transform duration-700 group-hover:scale-[1.04] ${fit === "contain" ? "object-contain p-3" : "object-cover object-top"}`} />
      <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100">
        <Maximize2 className="size-4" />
      </span>
    </button>
  );
}

/* ---------- logos ---------- */
function GoogleAdsMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-9" aria-hidden>
      <path fill="#fbbc04" d="M4.2 34.6 17.6 11.4l10.4 6-13.4 23.2z" />
      <path fill="#4285f4" d="M43.8 34.6 30.4 11.4a6 6 0 0 0-10.4 6l13.4 23.2a6 6 0 0 0 10.4-6z" />
      <circle cx="9.4" cy="37.6" r="6" fill="#34a853" />
    </svg>
  );
}
function MetaMark() {
  return (
    <svg viewBox="0 0 48 32" className="h-7 w-10" aria-hidden>
      <defs>
        <linearGradient id="mg" x1="0" x2="1">
          <stop offset="0" stopColor="#0064e1" />
          <stop offset="1" stopColor="#0082fb" />
        </linearGradient>
      </defs>
      <path
        fill="none"
        stroke="url(#mg)"
        strokeWidth="5"
        strokeLinecap="round"
        d="M5 22c0-9 4-16 9-16 6 0 9 8 10 10s4 10 10 10c4 0 9-3 9-10S39 6 34 6c-6 0-9 8-10 10s-4 10-10 10c-5 0-9-1-9-4z"
      />
    </svg>
  );
}

/* ---------- Google Ads case viewer ---------- */
function GoogleAds({ onOpen }: { onOpen: (s: string) => void }) {
  const [active, setActive] = useState(0);
  const [period, setPeriod] = useState(0);
  const c = googleCases[active];
  const p = c.periods[Math.min(period, c.periods.length - 1)];

  return (
    <div className="mt-24" data-bee='{"x":-0.9,"y":0.8,"s":0.55}' data-robot="graph">
      <FadeIn className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <GoogleAdsMark />
          <div>
            <h3 className="font-display text-3xl font-bold uppercase sm:text-5xl">Google Ads</h3>
            <p className="text-sm text-muted">Search · App · Lead campaigns — real dashboards</p>
          </div>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-muted">{googleCases.length} case studies</span>
      </FadeIn>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        {/* client list */}
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {googleCases.map((g, i) => (
            <button
              key={g.client}
              onClick={() => {
                setActive(i);
                setPeriod(0);
              }}
              className={`relative min-w-[220px] shrink-0 rounded-[22px] border p-4 text-left transition-colors lg:min-w-0 ${
                i === active ? "border-transparent text-white" : "border-line bg-card hover:border-accent"
              }`}
            >
              {i === active && (
                <motion.span
                  layoutId="g-active"
                  className="btn-glow absolute inset-0 -z-0 rounded-[22px]"
                  style={{ outline: "none" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-between gap-3">
                <span>
                  <span className="block font-display text-lg font-medium uppercase leading-tight">{g.client}</span>
                  <span className={`text-xs ${i === active ? "text-white/75" : "text-muted"}`}>{g.type}</span>
                </span>
                <span className="text-right">
                  <span className="block font-display text-xl font-black">{g.highlight.value}</span>
                  <span className={`text-[10px] uppercase tracking-wider ${i === active ? "text-white/75" : "text-muted"}`}>{g.highlight.label}</span>
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* detail panel */}
        <div className="spotlight overflow-hidden rounded-[32px] border border-line bg-card p-4 sm:p-6" onMouseMove={spotlightMove}>
          <AnimatePresence mode="wait">
            <motion.div
              key={c.client}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <h4 className="font-display text-2xl font-bold uppercase sm:text-4xl">{c.client}</h4>
                  <p className="mt-1 text-sm text-muted">{c.about}</p>
                </div>
                {c.periods.length > 1 && (
                  <div className="flex rounded-full border border-line p-1 text-xs font-semibold">
                    {c.periods.map((pp, i) => (
                      <button
                        key={pp.label}
                        onClick={() => setPeriod(i)}
                        className={`rounded-full px-3 py-1.5 transition-colors ${period === i ? "bg-fg text-bg" : "text-muted"}`}
                      >
                        {pp.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {p.metrics.map((m, i) => (
                  <motion.div
                    key={p.label + m.label}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl border border-line bg-bg/60 p-3 sm:p-4"
                  >
                    <div className="font-display text-xl font-bold sm:text-2xl">{m.value}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted">{m.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.setup.map((s) => (
                  <span key={s.label} className="rounded-full border border-line px-3 py-1 text-xs">
                    <span className="text-muted">{s.label}:</span> {s.value}
                  </span>
                ))}
              </div>

              <Shot src={c.image} onOpen={onOpen} className="mt-5 aspect-[2/1]" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------- Meta Ads cards ---------- */
function MetaCard({ m, onOpen }: { m: MetaCase; onOpen: (s: string) => void }) {
  const rows = [
    ["Spent", m.spent],
    ["Leads", m.leads],
    ["Reach", m.reach],
    ["Impressions", m.impressions],
  ];
  return (
    <div
      onMouseMove={spotlightMove}
      className={`spotlight flex h-full flex-col gap-5 rounded-[32px] border border-line bg-card p-4 sm:p-5 ${m.featured ? "lg:flex-row" : ""}`}
    >
      <Shot src={m.image} fit={m.fit} onOpen={onOpen} className={m.featured ? "aspect-[2/1] lg:aspect-auto lg:w-[55%]" : "aspect-[2/1]"} />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-display text-xl font-bold uppercase leading-tight sm:text-2xl">{m.client}</h4>
            <p className="mt-1 text-sm text-muted">{m.about}</p>
          </div>
          {m.logos && (
            <div className="flex shrink-0 -space-x-3">
              {m.logos.map((l) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={l} src={l} alt="" className="size-14 rounded-full bg-white p-1.5 shadow-md ring-2 ring-card sm:size-16" />
              ))}
            </div>
          )}
        </div>
        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="hero-heading font-display text-4xl font-black">{m.cpr}</span>
            <span className="text-xs uppercase tracking-wider text-muted">{m.cprLabel ?? "avg. cost per result"}</span>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 text-sm">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] uppercase tracking-wider text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

function MetaAds({ onOpen }: { onOpen: (s: string) => void }) {
  return (
    <div className="mt-28" data-bee='{"x":0.9,"y":0.8,"s":0.55}' data-robot="happy">
      <FadeIn className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <MetaMark />
          <div>
            <h3 className="font-display text-3xl font-bold uppercase sm:text-5xl">Meta Ads</h3>
            <p className="text-sm text-muted">Facebook · Instagram lead-gen & awareness</p>
          </div>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-muted">6,000+ leads generated</span>
      </FadeIn>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metaCases.map((m, i) => (
          <FadeIn key={m.client} delay={(i % 3) * 0.08} className={m.featured ? "md:col-span-2 lg:col-span-3" : ""}>
            <MetaCard m={m} onOpen={onOpen} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

/* ---------- Section ---------- */
export function Marketing() {
  const [zoom, setZoom] = useState<string | null>(null);

  return (
    <section
      id="marketing"
      data-bee='{"x":-0.8,"y":0.6,"s":0.8}'
      data-robot="graph"
      className="relative z-[2] -mt-10 overflow-hidden rounded-t-[40px] bg-gradient-to-b from-bg to-bg-2 px-5 pb-28 pt-24 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <GridLines />
      <div className="relative mx-auto max-w-7xl">
        {/* Melli-style intro */}
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[auto_1fr] md:gap-12 xl:grid-cols-[auto_1fr_minmax(0,0.95fr)]">
          <FadeIn y={40}>
            <div className="num">01</div>
          </FadeIn>
          <div className="max-w-2xl">
            <FadeIn delay={0.1}>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">Primary focus · Open to roles</p>
              <h2 className="font-display text-5xl font-black uppercase leading-[0.95] sm:text-7xl">
                Performance <span className="hero-heading">Marketing</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.22}>
              <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                I run paid media like an engineer — tight targeting, clean tracking, ruthless testing. From German-language loan leads at a 33% conversion rate to
                ₹1.04 app installs and 4,900+ real-estate leads at ₹30 each, here are the dashboards behind the numbers.
              </p>
            </FadeIn>
          </div>
          {/* live ads dashboard on 3D laptop + Instagram ad on phone */}
          <div className="relative md:col-span-2 xl:col-span-1">
            <div data-device="laptop:ads+phone:insta" className="pointer-events-none mx-auto h-[62vw] max-h-[380px] w-full max-w-[560px] xl:h-[26vw]" />
            <GlassCard className="-top-14 left-0 sm:left-4" delay={0.4} item={{ icon: "🔔", value: "New lead", label: "Real estate · just now", tone: "up" }} />
          </div>
        </div>

        {/* KPI strip */}
        <div className="mt-16 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {marketingKpis.map((k, i) => (
            <FadeIn key={k.label} delay={i * 0.08}>
              <div className={`h-full rounded-[28px] p-5 sm:p-6 ${i === 0 ? "btn-glow text-white" : "border border-line bg-card"}`} style={i === 0 ? { outline: "none" } : undefined}>
                <div className={`font-display text-4xl font-black sm:text-5xl ${i === 0 ? "" : "hero-heading"}`}>
                  <Counter value={k.value} prefix={k.prefix} suffix={k.suffix} />
                </div>
                <p className={`mt-2 text-xs sm:text-sm ${i === 0 ? "text-white/80" : "text-muted"}`}>{k.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* toolkit */}
        <FadeIn className="mt-6 flex flex-wrap gap-2">
          {marketingToolkit.map((t) => (
            <span key={t} className="rounded-full border border-line bg-card/60 px-4 py-2 text-xs font-medium backdrop-blur sm:text-sm">
              {t}
            </span>
          ))}
        </FadeIn>

        <GoogleAds onOpen={setZoom} />
        <MetaAds onOpen={setZoom} />

        <FadeIn className="mt-14 flex justify-center">
          <a href="#contact" className="group inline-flex items-center gap-2 font-display text-lg font-medium uppercase tracking-wider">
            <span className="u-link">Need these numbers for your brand?</span>
            <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" />
          </a>
        </FadeIn>
      </div>

      <Lightbox src={zoom} onClose={() => setZoom(null)} />
    </section>
  );
}
