"use client";

import { ArrowUp, Check, Copy, Phone } from "lucide-react";
import { useState } from "react";
import { site } from "@/data/site";
import { ContactButton, FadeIn, LinkedInIcon, Star } from "./ui";
import { GridLines, ParticleMesh } from "./Decor";

export const WHATSAPP = `https://wa.me/${site.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Mayank, I saw your portfolio and would like to talk.")}`;

export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.98 1-3.63-.24-.37a9.82 9.82 0 0 1 15.27-12.1 9.76 9.76 0 0 1 2.87 6.95c0 5.42-4.41 9.83-9.81 9.83zM20.4 3.6A11.8 11.8 0 0 0 12.05.13C5.5.13.17 5.46.16 12.01c0 2.1.55 4.14 1.6 5.94L.06 24l6.2-1.63a11.8 11.8 0 0 0 5.78 1.47h.01c6.55 0 11.89-5.33 11.89-11.88 0-3.17-1.24-6.16-3.48-8.4z" />
    </svg>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  const tel = `tel:${site.phone.replace(/\s/g, "")}`;

  const cols = [
    [
      { label: "LinkedIn", href: site.linkedin, ext: true },
      { label: "Email", href: `mailto:${site.email}` },
      { label: "Resume", href: site.resume, ext: true },
    ],
    [
      { label: "Call", href: tel },
      { label: "WhatsApp", href: WHATSAPP, ext: true },
      { label: "Back to top ↑", href: "#top" },
    ],
  ];

  return (
    <footer
      id="contact"
      data-bee='{"x":0.55,"y":0.76,"s":0.7}'
      data-robot="happy"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-bg-2 px-5 pb-8 pt-24 sm:px-8 md:px-10"
    >
      <GridLines />
      <ParticleMesh className="opacity-60" density={0.8} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <FadeIn>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent">( 06 ) — Let&apos;s work together</p>
            <h2 className="font-display font-black uppercase leading-[0.95]" style={{ fontSize: "clamp(2.6rem, 6.4vw, 104px)" }}>
              Ready to <span className="hero-heading">scale</span>
              <br />
              what you sell?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="mt-5 max-w-xl text-muted">
            Hiring a performance marketer, need ads that pay back, or a site that converts? Call, WhatsApp or email — I usually reply the same day.
          </FadeIn>

          {/* big, clear phone number */}
          <FadeIn delay={0.15} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a href={tel} className="group flex items-center gap-4 rounded-[24px] border border-line bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:border-accent sm:p-5">
              <span className="btn-glow grid size-12 shrink-0 place-items-center rounded-2xl text-white" style={{ outline: "none" }}>
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-muted">Call</span>
                <span className="block whitespace-nowrap font-display text-xl font-bold sm:text-2xl">+91 74178 34950</span>
              </span>
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-[24px] border border-line bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#25d366] sm:p-5"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#25d366] text-white">
                <WhatsAppIcon className="size-6" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-muted">WhatsApp</span>
                <span className="block font-display text-xl font-bold sm:text-2xl">Chat now →</span>
              </span>
            </a>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-4 flex flex-wrap items-center gap-3">
            <ContactButton href={`mailto:${site.email}`} label="Email me" />
            <button onClick={copy} className="inline-flex items-center gap-2 rounded-full border-2 border-fg/60 px-5 py-3 font-mono text-sm transition hover:border-fg">
              {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
              {copied ? "Copied!" : site.email}
            </button>
          </FadeIn>
        </div>

        {/* laptop composing "Hire Mayank" */}
        <div data-device="laptop:email" className="pointer-events-none mx-auto mt-6 h-[60vw] lg:mt-0 max-h-[400px] w-full max-w-[560px] lg:h-[28vw]" />
      </div>

      <div className="relative z-10 mx-auto mt-auto grid w-full max-w-7xl grid-cols-1 items-end gap-10 pt-20 md:grid-cols-[1fr_auto]">
        <FadeIn>
          <a href="#top" className="group flex items-center gap-3">
            <Star className="size-10 text-accent transition-transform duration-700 group-hover:rotate-90" />
            <span>
              <strong className="block font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl">Mayank_Gautam</strong>
              <span className="text-sm text-muted">Performance marketer · AI &amp; full-stack developer · {site.location}</span>
            </span>
          </a>
        </FadeIn>
        <FadeIn delay={0.1} className="flex gap-12 text-[14.5px] font-medium sm:gap-16">
          {cols.map((col, i) => (
            <div key={i}>
              {col.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  {...("ext" in l && l.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="block leading-[1.9] transition-colors hover:text-accent"
                >
                  {l.label === "LinkedIn" ? (
                    <span className="inline-flex items-center gap-1.5">
                      <LinkedInIcon className="size-3.5" /> LinkedIn
                    </span>
                  ) : (
                    l.label
                  )}
                </a>
              ))}
            </div>
          ))}
        </FadeIn>
      </div>

      <div className="relative z-10 mx-auto mt-10 flex w-full max-w-7xl items-center justify-between border-t border-line pt-5 text-xs text-muted">
        <span>© {site.fullName}</span>
        <a href="#top" aria-label="Back to top" className="grid size-10 place-items-center rounded-full bg-fg text-bg transition hover:-translate-y-1">
          <ArrowUp className="size-4" />
        </a>
      </div>
    </footer>
  );
}
