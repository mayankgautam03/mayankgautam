"use client";

import { motion } from "framer-motion";

/** Designed previews for AI apps that have no public link yet. */
export type MockKind = "hair" | "travel" | "adwiser";

function Frame({ title, children, accent }: { title: string; children: React.ReactNode; accent: string }) {
  return (
    <div className="flex size-full flex-col overflow-hidden rounded-[24px] bg-[#0d0b16] text-white">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-display text-xs uppercase tracking-widest text-white/60">{title}</span>
        <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: accent }}>
          AI
        </span>
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}

function Head({ hair }: { hair: "thin" | "full" }) {
  return (
    <svg viewBox="0 0 120 140" className="h-full w-auto">
      <ellipse cx="60" cy="78" rx="36" ry="44" fill="#e9b892" />
      <ellipse cx="24" cy="82" rx="6" ry="10" fill="#dca57f" />
      <ellipse cx="96" cy="82" rx="6" ry="10" fill="#dca57f" />
      {hair === "full" ? (
        <path d="M22 70 C 18 30, 50 18, 64 22 C 92 24, 104 46, 98 72 C 92 56, 80 46, 60 44 C 42 44, 30 54, 22 70 Z" fill="#2b1a12" />
      ) : (
        <path d="M30 60 C 34 40, 50 34, 60 36 C 72 36, 86 42, 90 60 C 82 54, 74 52, 70 54 C 62 50, 50 50, 30 60 Z" fill="#2b1a12" opacity="0.55" />
      )}
      <circle cx="47" cy="80" r="3" fill="#2b1a12" />
      <circle cx="73" cy="80" r="3" fill="#2b1a12" />
      <path d="M50 102 Q60 108 70 102" stroke="#a0644a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Hair() {
  return (
    <Frame title="HairVision AI" accent="#ec4899">
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="relative grid place-items-center bg-gradient-to-b from-[#1f1630] to-[#120d1c] p-6">
          <Head hair="thin" />
          <span className="absolute bottom-3 left-3 rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider">Before</span>
        </div>
        <div className="relative grid place-items-center bg-gradient-to-b from-[#3b1036] to-[#1a0b1f] p-6">
          <Head hair="full" />
          <span className="absolute bottom-3 right-3 rounded-full bg-pink-500 px-2.5 py-1 text-[10px] uppercase tracking-wider">After · 8 months</span>
        </div>
      </div>
      <motion.div
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_20px_white]"
        animate={{ left: ["35%", "65%", "35%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-xs font-bold text-black">⇆</span>
      </motion.div>
      <div className="absolute left-3 top-3 rounded-xl bg-black/60 px-3 py-2 text-[11px] backdrop-blur">
        Density <b className="text-pink-400">+62%</b> · 2,400 grafts
      </div>
    </Frame>
  );
}

function Travel() {
  const days = [
    { d: "Day 1", t: "Baga beach sunset · Thalassa dinner", i: "🏖️" },
    { d: "Day 2", t: "Old Goa churches · Fontainhas walk", i: "⛪" },
    { d: "Day 3", t: "Dudhsagar falls · spice farm lunch", i: "🌿" },
  ];
  return (
    <Frame title="Trip Genie" accent="#06b6d4">
      <div className="absolute inset-0 flex flex-col gap-2 bg-gradient-to-br from-[#062a33] to-[#0d0b16] p-4">
        <div className="self-end rounded-2xl rounded-br-sm bg-cyan-600 px-3 py-2 text-xs">Plan 3 days in Goa under ₹15k ✈️</div>
        {days.map((x, i) => (
          <motion.div
            key={x.d}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.25 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2"
          >
            <span className="text-xl">{x.i}</span>
            <span className="text-xs">
              <b className="block text-cyan-300">{x.d}</b>
              {x.t}
            </span>
          </motion.div>
        ))}
        <div className="mt-auto flex gap-2 text-[10px]">
          <span className="rounded-full bg-white/10 px-2 py-1">🚕 Cabs ₹2.4k</span>
          <span className="rounded-full bg-white/10 px-2 py-1">🏨 Stay ₹7.8k</span>
          <span className="rounded-full bg-emerald-500/80 px-2 py-1">Total ₹14.6k ✓</span>
        </div>
      </div>
    </Frame>
  );
}

function AdWiser() {
  const recs = [
    { c: "Instagram Reels", v: 42, col: "#e1306c" },
    { c: "Google Local Search", v: 33, col: "#4285f4" },
    { c: "WhatsApp broadcasts", v: 25, col: "#25d366" },
  ];
  return (
    <Frame title="AdWiser AI" accent="#eab308">
      <div className="absolute inset-0 flex flex-col gap-3 bg-gradient-to-br from-[#2a2205] to-[#0d0b16] p-4">
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          {["Business: Café", "Budget: ₹50k / mo", "Goal: Footfall"].map((x) => (
            <span key={x} className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-2.5 py-1 text-yellow-200">
              {x}
            </span>
          ))}
        </div>
        <p className="text-[11px] uppercase tracking-widest text-white/50">Recommended budget split</p>
        {recs.map((r, i) => (
          <div key={r.c} className="text-xs">
            <div className="mb-1 flex justify-between">
              <span>{r.c}</span>
              <b>{r.v}%</b>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: r.col }}
                initial={{ width: 0 }}
                whileInView={{ width: `${r.v}%` }}
                transition={{ delay: 0.3 + i * 0.2, duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
        <div className="mt-auto rounded-xl bg-white/[0.06] p-2.5 text-[11px] text-white/80">
          💡 Run Reels 6–9 PM near office zones · expected CPL ₹18–25
        </div>
      </div>
    </Frame>
  );
}

export function AppMock({ kind }: { kind: MockKind }) {
  if (kind === "hair") return <Hair />;
  if (kind === "travel") return <Travel />;
  return <AdWiser />;
}
