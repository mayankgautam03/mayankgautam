"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

/* ---------- icons ---------- */
export function LinkedInIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/** Melli 4-point star */
export function Star({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" className={className} aria-hidden>
      <path d="M20 0c1.2 11.5 8.5 18.8 20 20-11.5 1.2-18.8 8.5-20 20-1.2-11.5-8.5-18.8-20-20C11.5 18.8 18.8 11.5 20 0z" />
    </svg>
  );
}

/* ---------- motion helpers ---------- */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Jack: magnetic hover — follows the mouse when within `padding` px of the element */
export function Magnet({
  children,
  padding = 150,
  strength = 3,
  className = "",
}: {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const inside =
        e.clientX > r.left - padding && e.clientX < r.right + padding && e.clientY > r.top - padding && e.clientY < r.bottom + padding;
      if (inside) setPos({ x: (e.clientX - cx) / strength, y: (e.clientY - cy) / strength, active: true });
      else setPos((p) => (p.active ? { x: 0, y: 0, active: false } : p));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: pos.active ? "transform 0.3s ease-out" : "transform 0.6s ease-in-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

/** Small spring magnet for buttons */
export function Magnetic({ children, className = "", strength = 0.35 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Jack: character-by-character scroll reveal */
export function AnimatedText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const chars = text.split("");
  return (
    <p ref={ref} className={className}>
      {chars.map((c, i) => (
        <Char key={i} char={c} progress={scrollYProgress} range={[i / chars.length, (i + 1) / chars.length]} />
      ))}
    </p>
  );
}
function Char({ char, progress, range }: { char: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="invisible">{char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {char}
      </motion.span>
    </span>
  );
}

/* ---------- buttons ---------- */
export function ContactButton({ href = "#contact", label = "Contact Me", className = "" }: { href?: string; label?: string; className?: string }) {
  return (
    <a
      href={href}
      className={`btn-glow inline-flex items-center gap-2 rounded-full px-8 py-3 font-display text-xs font-medium uppercase tracking-widest text-white transition-transform hover:scale-[1.04] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
    >
      {label}
    </a>
  );
}

export function LiveProjectButton({ href, label = "Live Project" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border-2 border-fg px-6 py-2.5 font-display text-sm font-medium uppercase tracking-widest text-fg transition-colors hover:bg-fg/10 sm:px-8 sm:py-3 sm:text-base"
    >
      {label} <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
    </a>
  );
}

/* ---------- headings ---------- */
export function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
      <span className="text-accent">( {index} )</span>
      <span className="h-px w-10 bg-line" />
      <span>{children}</span>
    </div>
  );
}

export function RevealHeading({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.h2
      className={`font-display font-bold uppercase leading-[0.95] tracking-tight ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.06 }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}

export function spotlightMove(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/* ---------- live website screenshot with fallbacks ---------- */
export function shotSources(url: string, mobile = false) {
  const w = mobile ? 390 : 1280;
  return [
    `https://image.thum.io/get/width/${mobile ? 600 : 1200}/crop/${mobile ? 1100 : 800}/viewportWidth/${w}/noanimate/${url}`,
    `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url${mobile ? "&viewport.width=390&viewport.height=844&viewport.isMobile=true" : ""}`,
    `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${mobile ? 600 : 1200}&h=${mobile ? 1100 : 800}${mobile ? "&vpw=390&vph=844" : ""}`,
  ];
}

export function ShotImage({
  url,
  image,
  alt,
  mobile = false,
  accent = "var(--accent)",
  label,
  className = "",
}: {
  url?: string;
  image?: string;
  alt: string;
  mobile?: boolean;
  accent?: string;
  label?: string;
  className?: string;
}) {
  const sources = [...(image ? [image] : []), ...(url ? shotSources(url, mobile) : [])];
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const src = sources[i];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 grid place-items-center"
        style={{
          background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${accent} 45%, transparent), transparent 60%), radial-gradient(circle at 80% 90%, color-mix(in srgb, ${accent} 30%, transparent), transparent 55%)`,
        }}
      >
        <span className="font-display text-6xl font-black uppercase opacity-25 md:text-8xl" style={{ color: accent }}>
          {label ?? alt.slice(0, 2)}
        </span>
      </div>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={(e) => {
            // mshots returns a tiny "generating" placeholder first — treat as failure
            if ((e.currentTarget.naturalWidth || 0) < 200) setI((n) => n + 1);
            else setLoaded(true);
          }}
          onError={() => setI((n) => n + 1)}
          className={`absolute inset-0 size-full object-cover object-top transition-[opacity,transform] duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
