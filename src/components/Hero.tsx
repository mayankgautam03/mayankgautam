"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { ContactButton, FadeIn, Magnet } from "./ui";
import { GlassCard, GoogleAdsIcon, GridLines, MetaIcon, ParticleMesh } from "./Decor";

function RoleRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % site.roles.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-[1.35em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={site.roles[i]}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-nowrap font-semibold text-[#a21caf] dark:text-[#e879f9]"
        >
          {site.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const headY = useTransform(scrollYProgress, [0, 1], ["0vh", "30vh"]);

  return (
    <section
      id="top"
      ref={ref}
      data-bee='{"x":-0.76,"y":0.02,"s":0.9}'
      data-robot="wave"
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-x-clip"
    >
      {/* tech background */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-bg via-bg to-bg-2" />
      <GridLines className="-z-10" />
      <ParticleMesh className="-z-10 opacity-80" />
      <div aria-hidden className="absolute bottom-0 left-1/2 -z-10 size-[70vw] max-w-[900px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/20 blur-[140px]" />

      <div className="h-20 shrink-0 sm:h-24" />

      <motion.div style={{ y: headY }} className="relative z-0 w-full overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading w-full whitespace-nowrap px-2 text-center font-display text-[12.6vw] font-black uppercase leading-none tracking-tight sm:text-[13vw] md:text-[13.2vw] lg:text-[13.4vw]">
            Hi, i&apos;m mayank
          </h1>
        </FadeIn>
      </motion.div>

      {/* role — bigger, on a glass pill so it never mixes with the photo */}
      <FadeIn delay={0.25} y={20} className="relative z-30 mt-2 flex justify-center px-4">
        <span className="inline-flex items-center gap-3 rounded-full border border-line bg-bg/75 px-5 py-2 font-display text-xl uppercase tracking-[0.12em] shadow-lg backdrop-blur-xl sm:px-7 sm:py-2.5 sm:text-2xl md:text-3xl">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <RoleRotator />
        </span>
      </FadeIn>

      {/* laptop + phone pinned (desktop) */}
      <div data-device="laptop:code" className="pointer-events-none absolute right-[3%] top-[36%] hidden h-[19vw] w-[26vw] max-w-[420px] lg:block" />

      {/* floating glass stats */}
      <div className="absolute inset-0 hidden lg:block">
        <GlassCard className="left-[20%] top-[47%]" delay={0.9} item={{ icon: <MetaIcon className="h-5 w-7" />, value: "+4,912 leads", label: "Meta Ads · ₹30.55 / lead" }} />
        <GlassCard className="left-[5%] top-[66%]" delay={1.1} speed={0.35} item={{ icon: <GoogleAdsIcon className="size-6" />, value: "CTR 24.6%", label: "Google Search" }} />
      </div>

      {/* Portrait */}
      <div className="absolute left-1/2 top-1/2 z-10 w-[220px] -translate-x-1/2 -translate-y-[30%] sm:top-auto sm:bottom-0 sm:w-[300px] sm:translate-y-0 md:w-[340px] lg:w-[380px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] border border-line bg-gradient-to-b from-[#b600a8]/40 via-[#7621b0]/20 to-transparent p-1.5 shadow-2xl sm:rounded-b-none sm:border-b-0">
              <div className="relative size-full overflow-hidden rounded-t-[999px] rounded-b-[2.2rem] sm:rounded-b-none">
                <Image src={site.photo} alt={site.name} fill priority sizes="(max-width: 640px) 220px, 380px" className="object-cover object-[50%_18%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
              </div>
            </div>
          </Magnet>
        </FadeIn>
      </div>

      {/* bottom bar — tagline on glass so it stays readable */}
      <div className="relative z-20 mt-auto flex items-end justify-between gap-3 px-4 pb-6 sm:px-6 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[170px] rounded-2xl border border-line bg-bg/75 p-3 font-display font-normal uppercase leading-snug tracking-wide shadow-lg backdrop-blur-xl sm:max-w-[250px] sm:p-4 md:max-w-[320px]"
            style={{ fontSize: "clamp(0.8rem, 1.35vw, 1.3rem)" }}
          >
            A performance marketer &amp; developer driven by <span className="text-accent">ads that pay back</span> and products that convert
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
