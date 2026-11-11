"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Bot, Cpu, FlaskConical, Workflow, Sparkles, Layers, Server, Database, ShoppingBag, Rocket } from "lucide-react";
import { useRef } from "react";
import { projects, type Project } from "@/data/projects";
import { FadeIn, LiveProjectButton, ShotImage, spotlightMove } from "./ui";
import { AppMock } from "./AppMock";
import { ChatBubble, GlassCard, GridLines, ParticleMesh } from "./Decor";

const isAI = (p: Project) => p.category === "AI App";

/* ================================================================== */
/*  02 — AI DEVELOPMENT                                                */
/* ================================================================== */
const aiCaps = [
  { icon: Workflow, title: "Marketing automation", text: "AI-driven lead routing, CRM workflows & reporting at Keymantra." },
  { icon: Bot, title: "Chatbots & assistants", text: "Lead-qualifying chat, persona bots, travel & strategy assistants." },
  { icon: Cpu, title: "LLM & model APIs", text: "OpenAI-style APIs, HuggingFace models, prompt pipelines." },
  { icon: Sparkles, title: "Image AI", text: "Before/after visualisers that turn curious visitors into leads." },
];

function AICard({ p, i }: { p: Project; i: number }) {
  const Wrapper = p.url ? motion.a : motion.div;
  return (
    <FadeIn delay={(i % 2) * 0.1}>
      <Wrapper
        {...(p.url ? { href: p.url, target: "_blank", rel: "noreferrer" } : {})}
        whileHover={{ y: -8 }}
        className="group block h-full overflow-hidden rounded-[32px] border border-white/15 bg-white/[0.06] p-3 text-white backdrop-blur-md"
      >
        {p.mock && !p.image ? (
          <div className="aspect-[16/10]">
            <AppMock kind={p.mock} />
          </div>
        ) : (
          <ShotImage url={p.url} image={p.image} alt={p.title} accent={p.accent} className="aspect-[16/10] rounded-[24px]" />
        )}
        <div className="p-3 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/60">
                {p.year} · {p.role}
              </span>
              <h3 className="mt-1 font-display text-2xl font-bold uppercase">{p.title}</h3>
            </div>
            {p.url ? (
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/30 transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-black">
                <ArrowUpRight className="size-5" />
              </span>
            ) : (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs">
                <FlaskConical className="size-3.5" /> In the lab
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/75">{p.description}</p>
          {p.tags && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </Wrapper>
    </FadeIn>
  );
}

export function AISection() {
  const list = projects.filter(isAI);
  return (
    <section
      id="ai"
      data-bee='{"x":-0.22,"y":0.62,"s":0.75}'
      data-robot="think"
      className="relative overflow-hidden bg-gradient-to-br from-[#120a35] via-[#1e1b4b] to-[#2a0f45] px-5 py-28 text-white sm:px-8 md:px-10 md:py-36 dark:from-[#07050f] dark:via-[#120a2a] dark:to-[#1d0a2e]"
    >
      <ParticleMesh light className="opacity-70" />
      <div aria-hidden className="absolute -left-40 top-20 size-[520px] rounded-full bg-[#7621b0]/40 blur-[140px]" />
      <div aria-hidden className="absolute -right-40 bottom-0 size-[520px] rounded-full bg-[#0ea5e9]/25 blur-[140px]" />

      <div className="relative z-[2] mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
        <div className="max-w-2xl">
          <FadeIn y={40}>
            <div className="num" style={{ color: "rgba(214,203,255,.55)", WebkitTextStroke: "0" }}>
              02
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-6 font-display text-5xl font-black uppercase leading-[0.95] sm:text-7xl">AI Development</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 text-base leading-relaxed text-[rgba(240,234,255,.82)] sm:text-lg">
              I pair marketing with AI — building automations that save my team hours and products that turn attention into leads. Shipped with React, Firebase,
              HuggingFace and LLM APIs.
            </p>
          </FadeIn>
        </div>
          <div className="relative">
            <div data-device="laptop:chat" className="pointer-events-none mx-auto h-[56vw] max-h-[360px] w-full max-w-[520px] lg:h-[24vw]" />
            <ChatBubble onDark className="left-2 top-full mt-2" />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {aiCaps.map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.07}>
              <div className="h-full rounded-[24px] border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md">
                <c.icon className="size-6 text-[#d9ccff]" />
                <h3 className="mt-4 font-display text-lg font-medium uppercase">{c.title}</h3>
                <p className="mt-1 text-sm text-white/70">{c.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {list.map((p, i) => (
            <AICard key={p.title} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  03 — FULL-STACK WEB DEVELOPMENT                                    */
/* ================================================================== */
const stack = [
  { icon: Layers, title: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"] },
  { icon: Server, title: "Backend & APIs", items: ["Node.js", "Express.js", "REST APIs", "Stripe", "Auth"] },
  { icon: Database, title: "Data & Cloud", items: ["MongoDB", "Firebase", "Vercel", "Analytics", "Pixels & CAPI"] },
  { icon: ShoppingBag, title: "CMS & Commerce", items: ["Shopify", "WordPress", "WooCommerce", "SEO", "Landing pages"] },
];

function StackCard({ p, index, total, progress }: { p: Project; index: number; total: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      <motion.article
        style={{ scale, top: `${index * 28}px` }}
        className="relative w-full origin-top rounded-[40px] border-2 border-fg/80 bg-bg p-4 shadow-2xl sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hero-heading font-display font-black leading-none" style={{ fontSize: "clamp(2.6rem, 7vw, 100px)" }}>
              0{index + 1}
            </span>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {p.category} · {p.year} · {p.role}
              </span>
              <h3 className="font-display text-2xl font-bold uppercase leading-tight sm:text-4xl">{p.title}</h3>
            </div>
          </div>
          {p.url && <LiveProjectButton href={p.url} />}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[40%_1fr] sm:gap-4">
          <div className="order-2 flex flex-col gap-3 sm:order-1 sm:gap-4">
            <ShotImage
              url={p.url}
              image={p.mobileImage}
              alt={`${p.title} mobile`}
              mobile
              accent={p.accent}
              className="hidden h-[clamp(140px,18vw,260px)] rounded-[28px] sm:block sm:rounded-[40px] md:rounded-[50px]"
              label={p.title.slice(0, 2)}
            />
            <div
              className="flex flex-col justify-between rounded-[28px] p-4 text-white sm:rounded-[40px] sm:p-6 md:rounded-[50px]"
              style={{ minHeight: "clamp(130px, 20vw, 300px)", background: `linear-gradient(140deg, ${p.accent ?? "#7621b0"}, #18011f)` }}
            >
              <p className="mb-3 line-clamp-4 text-xs leading-relaxed text-white/85 sm:text-sm md:text-base">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags?.map((t) => (
                  <span key={t} className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] sm:text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <ShotImage
            url={p.url}
            image={p.image}
            alt={p.title}
            accent={p.accent}
            className="order-1 aspect-[16/10] rounded-[28px] sm:order-2 sm:aspect-auto sm:h-full sm:min-h-[260px] sm:rounded-[40px] md:rounded-[50px]"
          />
        </div>
      </motion.article>
    </div>
  );
}

export function WebSection() {
  const list = projects.filter((p) => !isAI(p));
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section
      id="web"
      data-bee='{"x":-0.1,"y":0.3,"s":0.62}'
      data-robot="code"
      className="relative z-10 -mt-10 overflow-x-clip rounded-t-[40px] bg-bg px-5 pb-20 pt-24 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <GridLines />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_1fr]">
          <div className="relative order-2 lg:order-1">
            <div data-device="laptop:deploy" className="pointer-events-none mx-auto h-[56vw] max-h-[360px] w-full max-w-[520px] lg:h-[24vw]" />
            <GlassCard className="right-2 top-full mt-2" delay={0.3} item={{ icon: "⌘", value: "git push ✓", label: "main → production", tone: "code" }} />
          </div>
        <div className="order-1 max-w-2xl lg:order-2">
          <FadeIn y={40}>
            <div className="num">03</div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-6 font-display text-5xl font-black uppercase leading-[0.95] sm:text-7xl">
              Full-Stack <span className="hero-heading">Web Dev</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              Meta-certified front-end developer who also ships the back end. I design, code, deploy and then run ads to these sites — so every build is made to
              convert, load fast and track properly.
            </p>
          </FadeIn>
        </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stack.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.07}>
              <div onMouseMove={spotlightMove} className="spotlight h-full rounded-[28px] border border-line bg-card/80 p-5 backdrop-blur">
                <s.icon className="size-6 text-accent" />
                <h3 className="mt-3 font-display text-lg font-medium uppercase">{s.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.items.map((t) => (
                    <span key={t} className="rounded-full border border-line px-2.5 py-1 text-[11px] sm:text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mb-4 mt-20 flex items-end justify-between gap-4">
          <h3 className="hero-heading font-display font-black uppercase leading-none" style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>
            Projects
          </h3>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
            <Rocket className="size-4" /> {list.length} live sites
          </span>
        </FadeIn>

        <div ref={ref} className="relative">
          {list.map((p, i) => (
            <StackCard key={p.title} p={p} index={i} total={list.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
