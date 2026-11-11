"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, BadgeCheck, GraduationCap, HeartHandshake } from "lucide-react";
import { useRef } from "react";
import {
  certifications,
  education,
  experience,
  skills,
  volunteering,
} from "@/data/site";
import { Eyebrow, FadeIn, RevealHeading, spotlightMove } from "./ui";

/* ------------------------------------------------------------------ */
/*  EXPERIENCE TIMELINE                                                */
/* ------------------------------------------------------------------ */
export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="journey" data-bee='{"x":0.85,"y":0.35,"s":0.7}' data-robot="normal" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <Eyebrow index="04">Journey</Eyebrow>
      <RevealHeading text="Where I've made an impact." className="mb-16 max-w-3xl text-5xl sm:text-7xl" />

      <div ref={ref} className="relative">
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-line md:left-1/2" />
        <motion.div
          style={{ scaleY }}
          className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b from-accent to-accent-2 md:left-1/2"
        />

        <div className="space-y-12 md:space-y-20">
          {experience.map((e, i) => {
            const left = i % 2 === 0;
            return (
              <div key={e.company + e.role} className="relative grid grid-cols-1 md:grid-cols-2 md:gap-16">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="absolute left-0 top-2 z-10 grid size-6 place-items-center rounded-full border-2 border-accent bg-bg md:left-1/2 md:-translate-x-1/2"
                >
                  <span className="size-2 rounded-full bg-accent" />
                </motion.span>

                <motion.div
                  initial={{ opacity: 0, x: left ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`pl-10 md:pl-0 ${left ? "md:pr-4 md:text-right" : "md:col-start-2 md:pl-4"}`}
                >
                  <span className="inline-block rounded-full bg-accent/10 px-3 py-1 font-mono text-xs text-accent">{e.period}</span>
                  <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{e.role}</h3>
                  <p className="mt-1 font-medium">
                    {e.company} <span className="text-muted">· {e.place}</span>
                  </p>
                  <ul className={`mt-4 space-y-2 text-sm leading-relaxed text-muted ${left ? "md:ml-auto" : ""} max-w-lg`}>
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SKILLS + CERTIFICATIONS + EDUCATION                                */
/* ------------------------------------------------------------------ */
export function Skills() {
  return (
    <section id="skills" data-bee='{"x":-0.88,"y":0.55,"s":0.65}' data-robot="normal" className="relative bg-bg-2 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow index="05">Credentials</Eyebrow>
        <RevealHeading text="Skills & certifications." className="mb-14 max-w-3xl text-5xl sm:text-7xl" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {skills.map((g, gi) => (
            <FadeIn key={g.group} delay={gi * 0.08}>
              <div onMouseMove={spotlightMove} className="spotlight h-full rounded-[2rem] border border-line bg-card p-7">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold">{g.group}</h3>
                  <span className="font-mono text-xs text-muted">{g.items.length} skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ scale: 1.08, rotate: i % 2 ? 2 : -2 }}
                      className="cursor-default rounded-full border border-line bg-bg px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:bg-accent hover:text-white"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Certifications */}
        <h3 className="mb-6 mt-20 flex items-center gap-3 font-display text-3xl font-bold">
          <BadgeCheck className="size-7 text-accent" /> Certifications
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((c, i) => {
            const Tag = c.url ? motion.a : motion.div;
            return (
              <Tag
                key={c.title}
                {...(c.url ? { href: c.url, target: "_blank", rel: "noreferrer" } : {})}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.07 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col rounded-3xl border border-line bg-card p-5"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{c.date}</span>
                <span className="mt-2 font-display text-lg font-bold leading-tight">{c.title}</span>
                <span className="mt-1 text-sm text-muted">{c.issuer}</span>
                <span className="mt-4 flex items-center justify-between text-xs">
                  {c.id ? <span className="truncate font-mono text-muted">ID {c.id}</span> : <span />}
                  {c.url && (
                    <span className="flex shrink-0 items-center gap-1 font-semibold text-accent">
                      Verify <ArrowUpRight className="size-3.5 transition-transform group-hover:rotate-45" />
                    </span>
                  )}
                </span>
              </Tag>
            );
          })}
        </div>

        {/* Education + Volunteering */}
        <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-3">
          {education.map((e) => (
            <FadeIn key={e.title}>
              <div className="flex h-full gap-4 rounded-3xl border border-line bg-card p-6">
                <GraduationCap className="size-6 shrink-0 text-accent" />
                <div>
                  <p className="font-display text-lg font-bold leading-tight">{e.title}</p>
                  <p className="mt-1 text-sm text-muted">{e.place}</p>
                  <p className="mt-2 font-mono text-xs text-muted">{e.period}</p>
                </div>
              </div>
            </FadeIn>
          ))}
          <FadeIn>
            <div className="flex h-full gap-4 rounded-3xl border border-line bg-card p-6">
              <HeartHandshake className="size-6 shrink-0 text-accent" />
              <div>
                <p className="font-display text-lg font-bold leading-tight">{volunteering.title}</p>
                <p className="mt-1 text-sm text-muted">{volunteering.text}</p>
                <p className="mt-2 font-mono text-xs text-muted">{volunteering.period}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
