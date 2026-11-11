"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Star } from "./ui";
import { WHATSAPP, WhatsAppIcon } from "./Contact";

/** Thin progress bar at the very top */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <motion.div
      style={{ scaleX, background: "linear-gradient(90deg,#b600a8,#7621b0,#be4c00)" }}
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left"
    />
  );
}

/** Melli loader — spinning star + counter. Once per session. */
export function Preloader() {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("seen-intro");
    } catch {}
    if (seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(false);
      return;
    }
    let n = 0;
    const id = setInterval(() => {
      n = Math.min(100, n + Math.ceil(Math.random() * 9));
      setCount(n);
      if (n >= 100) {
        clearInterval(id);
        setTimeout(() => {
          setShow(false);
          try {
            sessionStorage.setItem("seen-intro", "1");
          } catch {}
        }, 300);
      }
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center gap-6">
            <Star className="animate-spin-slow size-12 text-fg" />
            <span className="font-display text-sm font-medium uppercase tracking-[0.4em] text-muted">
              Mayank_Gautam · {count}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Floating WhatsApp button (bottom-right) + "open to work" badge (bottom-left) */
export function Badge() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => {
      const c = document.getElementById("contact");
      const nearFooter = c ? c.getBoundingClientRect().top < window.innerHeight * 0.7 : false;
      setOn(window.scrollY > window.innerHeight * 0.8 && !nearFooter);
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const show = { opacity: on ? 1 : 0, transform: on ? "none" : "translateY(12px)", pointerEvents: on ? "auto" : "none" } as const;
  return (
    <>
      <a
        href="#contact"
        style={show}
        className="fixed bottom-5 left-4 z-30 hidden items-center gap-2 rounded-full border border-line bg-bg/75 px-4 py-2 text-[12.5px] font-medium backdrop-blur-md transition-[opacity,transform] duration-500 hover:border-accent sm:left-6 sm:flex"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-green-500" />
        </span>
        Open to work · <b className="font-bold text-accent">Performance Marketing</b>
      </a>
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        style={show}
        className="fixed bottom-5 right-4 z-30 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)] transition-[opacity,transform] duration-500 hover:scale-110 sm:right-6"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-30" />
        <WhatsAppIcon className="relative size-7" />
      </a>
    </>
  );
}
