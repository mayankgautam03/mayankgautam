"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Particle / neural-network mesh — reacts to the mouse              */
/* ------------------------------------------------------------------ */
export function ParticleMesh({ className = "", density = 1, light = false }: { className?: string; density?: number; light?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, visible = false;
    const dpr = Math.min(window.devicePixelRatio, 2);
    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];
    const mouse = { x: -9999, y: -9999 };

    const color = () => {
      if (light) return "255,255,255";
      const dark = document.documentElement.classList.contains("dark");
      return dark ? "201,75,255" : "79,70,229";
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(110, (W * H) / 14000) * density);
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const c = color();
      const LINK = 130;
      for (const p of pts) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          // gentle attraction to mouse
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 180 && d > 1) {
            p.x += (dx / d) * 0.6;
            p.y += (dy / d) * 0.6;
          }
        }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${c},${0.22 * (1 - d / LINK)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const md = Math.hypot(mouse.x - a.x, mouse.y - a.y);
        if (md < 180) {
          ctx.strokeStyle = `rgba(${c},${0.45 * (1 - md / 180)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${c},0.55)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible) draw();
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    if (!reduced) loop();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [density, light]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}

/** Subtle grid lines */
export function GridLines({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, #000 25%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, #000 25%, transparent 75%)",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Brand marks                                                       */
/* ------------------------------------------------------------------ */
export function GoogleAdsIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#fbbc04" d="M4.2 34.6 17.6 11.4l10.4 6-13.4 23.2z" />
      <path fill="#4285f4" d="M43.8 34.6 30.4 11.4a6 6 0 0 0-10.4 6l13.4 23.2a6 6 0 0 0 10.4-6z" />
      <circle cx="9.4" cy="37.6" r="6" fill="#34a853" />
    </svg>
  );
}
export function MetaIcon({ className = "h-6 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <path
        fill="none"
        stroke="#0a7cff"
        strokeWidth="5"
        strokeLinecap="round"
        d="M5 22c0-9 4-16 9-16 6 0 9 8 10 10s4 10 10 10c4 0 9-3 9-10S39 6 34 6c-6 0-9 8-10 10s-4 10-10 10c-5 0-9-1-9-4z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating glass card with parallax                                 */
/* ------------------------------------------------------------------ */
export type GlassItem = {
  icon?: React.ReactNode;
  value: string;
  label?: string;
  tone?: "up" | "plain" | "chat" | "code";
};

export function GlassCard({ item, className = "", speed = 0.25, delay = 0, onDark = false }: { item: GlassItem; className?: string; speed?: number; delay?: number; onDark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 120}px`, `${-speed * 120}px`]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4 * speed * 4, 4 * speed * 4]);

  const surface = onDark
    ? "border-white/20 bg-white/10 text-white"
    : "border-line bg-card/70 text-fg dark:border-white/12 dark:bg-white/[0.06]";

  return (
    <motion.div ref={ref} style={{ y, rotate }} className={`pointer-events-none absolute z-[3] ${className}`} aria-hidden>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, type: "spring", stiffness: 160, damping: 16 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4 + delay * 3, repeat: Infinity, ease: "easeInOut" }}
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_20px_50px_-20px_rgba(60,40,160,0.45)] backdrop-blur-xl ${surface}`}
        >
          {item.icon && <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/80 text-lg dark:bg-white/10">{item.icon}</span>}
          <span className="leading-tight">
            <span
              className={`block whitespace-nowrap font-display text-lg font-bold sm:text-xl ${
                item.tone === "up" ? "text-emerald-500" : item.tone === "code" ? "font-mono text-base" : ""
              }`}
            >
              {item.value}
            </span>
            {item.label && <span className={`block whitespace-nowrap text-[11px] uppercase tracking-wider ${onDark ? "text-white/70" : "text-muted"}`}>{item.label}</span>}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Little AI chat bubble card */
export function ChatBubble({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <GlassCard
      onDark={onDark}
      className={className}
      speed={0.3}
      delay={0.2}
      item={{ icon: "🤖", value: "“Lead qualified ✓”", label: "AI assistant · just now", tone: "chat" }}
    />
  );
}
