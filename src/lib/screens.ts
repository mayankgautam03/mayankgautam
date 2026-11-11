/**
 * Live screen animations drawn on <canvas> — used as textures on the 3D laptop / phone.
 * Every draw function gets the elapsed time (seconds since the screen became visible)
 * and loops on its own.
 */
export type ScreenKind = "code" | "ads" | "chat" | "deploy" | "email" | "insta" | "notify";

const MONO = '"JetBrains Mono Variable", ui-monospace, monospace';
const SANS = 'Poppins, ui-sans-serif, system-ui, sans-serif';

const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
};
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const inr = (n: number) => Math.round(n).toLocaleString("en-IN");

/* ------------------------------------------------------------------ */
/* window chrome                                                       */
/* ------------------------------------------------------------------ */
function chrome(c: CanvasRenderingContext2D, W: number, H: number, title: string, bg = "#0f1117") {
  c.fillStyle = bg;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#1a1d26";
  c.fillRect(0, 0, W, 44);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
    c.fillStyle = col;
    c.beginPath();
    c.arc(26 + i * 22, 22, 7, 0, Math.PI * 2);
    c.fill();
  });
  c.fillStyle = "#8b93a7";
  c.font = `500 17px ${SANS}`;
  c.textAlign = "center";
  c.fillText(title, W / 2, 28);
  c.textAlign = "left";
}

/* ------------------------------------------------------------------ */
/* HERO — code editor typing                                           */
/* ------------------------------------------------------------------ */
type Tok = [string, string];
const CODE: Tok[][] = [
  [["// mayank.config.ts", "#6a7389"]],
  [["const ", "#c678dd"], ["ads", "#e5c07b"], [" = { ", "#abb2bf"], ["leads", "#e06c75"], [": ", "#abb2bf"], ["4912", "#d19a66"], [" };", "#abb2bf"]],
  [["const ", "#c678dd"], ["ai", "#e5c07b"], ["  = [", "#abb2bf"], ['"chatbots"', "#98c379"], [", ", "#abb2bf"], ['"agents"', "#98c379"], ["];", "#abb2bf"]],
  [["const ", "#c678dd"], ["code", "#e5c07b"], [" = [", "#abb2bf"], ['"Next.js"', "#98c379"], [", ", "#abb2bf"], ['"Node"', "#98c379"], ["];", "#abb2bf"]],
  [],
  [["const ", "#c678dd"], ["growth", "#61afef"], [" = ", "#abb2bf"], ["ads", "#e5c07b"], [" + ", "#56b6c2"], ["ai", "#e5c07b"], [" + ", "#56b6c2"], ["code", "#e5c07b"], [";", "#abb2bf"]],
  [],
  [["export default ", "#c678dd"], ["ship", "#61afef"], ["(growth);", "#abb2bf"], [" // 🚀", "#6a7389"]],
];
const CODE_LEN = CODE.reduce((a, l) => a + l.reduce((b, t) => b + t[0].length, 0) + 1, 0);

function drawCode(c: CanvasRenderingContext2D, W: number, H: number, t: number) {
  chrome(c, W, H, "growth.ts — Mayank's workspace", "#11131a");
  // sidebar
  c.fillStyle = "#0c0e14";
  c.fillRect(0, 44, 140, H - 44);
  c.font = `500 15px ${SANS}`;
  ["📁 portfolio", "  ads.ts", "  ai.ts", "  growth.ts", "  deploy.ts"].forEach((f, i) => {
    c.fillStyle = i === 3 ? "#e5e9f0" : "#6a7389";
    if (i === 3) {
      c.fillStyle = "#1e2230";
      c.fillRect(0, 62 + i * 30, 140, 28);
      c.fillStyle = "#e5e9f0";
    }
    c.fillText(f, 16, 82 + i * 30);
  });
  const cycle = 11;
  const lt = t % cycle;
  let chars = Math.floor(Math.min(CODE_LEN, lt * 28));
  c.font = `500 21px ${MONO}`;
  let y = 96;
  let cx = 0, cy = 0;
  CODE.forEach((line, li) => {
    c.fillStyle = "#3d4456";
    c.fillText(String(li + 1).padStart(2, " "), 150, y);
    let x = 186;
    for (const [txt, col] of line) {
      if (chars <= 0) break;
      const part = txt.slice(0, chars);
      chars -= part.length;
      c.fillStyle = col;
      c.fillText(part, x, y);
      x += c.measureText(part).width;
    }
    if (chars > 0 || (chars === 0 && cx === 0)) {
      cx = x;
      cy = y;
    }
    chars -= 1;
    y += 40;
  });
  if (Math.sin(t * 8) > 0) {
    c.fillStyle = "#c94bff";
    c.fillRect(cx + 2, cy - 20, 3, 26);
  }
  // status bar
  c.fillStyle = "#7621b0";
  c.fillRect(0, H - 30, W, 30);
  c.fillStyle = "#fff";
  c.font = `500 14px ${SANS}`;
  c.fillText(lt > 9 ? "✓ Build passed · ready to ship" : "● TypeScript · main · Mayank Gautam", 16, H - 10);
}

/* ------------------------------------------------------------------ */
/* MARKETING — ads dashboard                                           */
/* ------------------------------------------------------------------ */
function drawAds(c: CanvasRenderingContext2D, W: number, H: number, t: number) {
  chrome(c, W, H, "Ads Manager · Real estate · Last 30 days", "#f4f6fb");
  const p = ease((t % 12) / 6);
  // KPI tiles
  const kpis = [
    { label: "Leads", value: inr(4912 * p), col: "#1877f2" },
    { label: "Amount spent", value: "₹" + inr(150053 * p), col: "#7c3aed" },
    { label: "Cost / lead", value: "₹" + (30.55 + (1 - p) * 40).toFixed(2), col: "#16a34a" },
    { label: "CTR", value: (24.6 * p).toFixed(1) + "%", col: "#ea580c" },
  ];
  const tw = (W - 60 - 3 * 14) / 4;
  kpis.forEach((k, i) => {
    const x = 30 + i * (tw + 14);
    c.fillStyle = "#fff";
    rr(c, x, 64, tw, 104, 14);
    c.fill();
    c.fillStyle = k.col;
    c.fillRect(x, 64, 5, 104);
    c.fillStyle = "#6b7280";
    c.font = `500 15px ${SANS}`;
    c.fillText(k.label, x + 18, 96);
    c.fillStyle = "#111827";
    c.font = `700 26px ${SANS}`;
    c.fillText(k.value, x + 18, 142);
  });
  // chart
  const cx = 30, cy = 190, cw = W - 60, ch = H - 220;
  c.fillStyle = "#fff";
  rr(c, cx, cy, cw, ch, 16);
  c.fill();
  c.fillStyle = "#111827";
  c.font = `600 18px ${SANS}`;
  c.fillText("Conversions over time", cx + 22, cy + 34);
  c.fillStyle = "#16a34a";
  c.font = `700 16px ${SANS}`;
  c.fillText("▲ trending up", cx + cw - 140, cy + 34);
  c.strokeStyle = "#eef0f5";
  c.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const gy = cy + 60 + i * ((ch - 90) / 3);
    c.beginPath();
    c.moveTo(cx + 22, gy);
    c.lineTo(cx + cw - 22, gy);
    c.stroke();
  }
  const pts = [0.12, 0.2, 0.18, 0.32, 0.3, 0.45, 0.42, 0.58, 0.55, 0.7, 0.78, 0.92];
  const n = pts.length;
  const shown = p * (n - 1);
  const px = (i: number) => cx + 30 + (i / (n - 1)) * (cw - 60);
  const py = (v: number) => cy + ch - 26 - v * (ch - 100);
  const grad = c.createLinearGradient(0, cy, 0, cy + ch);
  grad.addColorStop(0, "rgba(124,58,237,0.35)");
  grad.addColorStop(1, "rgba(124,58,237,0)");
  c.beginPath();
  c.moveTo(px(0), py(pts[0]));
  let lx = px(0), ly = py(pts[0]);
  for (let i = 1; i <= Math.ceil(shown); i++) {
    const f = Math.min(1, shown - (i - 1));
    lx = px(i - 1) + (px(i) - px(i - 1)) * f;
    ly = py(pts[i - 1]) + (py(pts[i]) - py(pts[i - 1])) * f;
    c.lineTo(lx, ly);
  }
  c.lineTo(lx, cy + ch - 26);
  c.lineTo(px(0), cy + ch - 26);
  c.closePath();
  c.fillStyle = grad;
  c.fill();
  c.beginPath();
  c.moveTo(px(0), py(pts[0]));
  for (let i = 1; i <= Math.ceil(shown); i++) {
    const f = Math.min(1, shown - (i - 1));
    c.lineTo(px(i - 1) + (px(i) - px(i - 1)) * f, py(pts[i - 1]) + (py(pts[i]) - py(pts[i - 1])) * f);
  }
  c.strokeStyle = "#7c3aed";
  c.lineWidth = 4;
  c.lineJoin = "round";
  c.stroke();
  c.fillStyle = "#7c3aed";
  c.beginPath();
  c.arc(lx, ly, 8, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "rgba(124,58,237,0.25)";
  c.beginPath();
  c.arc(lx, ly, 14 + Math.sin(t * 6) * 3, 0, Math.PI * 2);
  c.fill();
}

/* ------------------------------------------------------------------ */
/* AI — chat typing                                                    */
/* ------------------------------------------------------------------ */
const Q = "Write a Meta ad hook for a 3BHK launch in Noida";
const A =
  "🏙️ Your 3BHK in Noida, minus the waiting. Ready-to-move homes near the Expressway — book a free site visit this weekend. Limited units at launch price →";

function wrap(c: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (c.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawChat(c: CanvasRenderingContext2D, W: number, H: number, t: number) {
  chrome(c, W, H, "Moon AI · assistant", "#0d0b14");
  const lt = t % 13;
  c.font = `500 20px ${SANS}`;
  // user bubble
  const qChars = Math.floor(Math.min(Q.length, lt * 30));
  const qText = Q.slice(0, qChars);
  const qLines = wrap(c, qText || " ", W * 0.62);
  const qW = Math.min(W * 0.7, Math.max(...qLines.map((l) => c.measureText(l).width)) + 40);
  const qH = qLines.length * 30 + 26;
  c.fillStyle = "#7621b0";
  rr(c, W - 40 - qW, 76, qW, qH, 20);
  c.fill();
  c.fillStyle = "#fff";
  qLines.forEach((l, i) => c.fillText(l, W - 40 - qW + 20, 108 + i * 30));
  // AI avatar
  const ay = 96 + qH + 20;
  c.fillStyle = "#1f1b2e";
  c.beginPath();
  c.arc(56, ay + 18, 22, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#5cb6ff";
  c.beginPath();
  c.arc(49, ay + 16, 4, 0, Math.PI * 2);
  c.arc(63, ay + 16, 4, 0, Math.PI * 2);
  c.fill();
  if (lt > 2) {
    const aT = lt - 3;
    if (aT < 0) {
      // typing dots
      c.fillStyle = "#1f1b2e";
      rr(c, 92, ay, 110, 44, 20);
      c.fill();
      for (let i = 0; i < 3; i++) {
        c.fillStyle = `rgba(220,210,255,${0.35 + 0.65 * Math.max(0, Math.sin(t * 6 - i * 0.8))})`;
        c.beginPath();
        c.arc(122 + i * 24, ay + 22, 6, 0, Math.PI * 2);
        c.fill();
      }
    } else {
      const aText = A.slice(0, Math.floor(Math.min(A.length, aT * 32)));
      const lines = wrap(c, aText || " ", W - 200);
      c.fillStyle = "#1f1b2e";
      rr(c, 92, ay, W - 150, lines.length * 32 + 30, 20);
      c.fill();
      c.fillStyle = "#ece8ff";
      lines.forEach((l, i) => c.fillText(l, 114, ay + 36 + i * 32));
    }
  }
  // input bar
  c.fillStyle = "#17141f";
  rr(c, 30, H - 74, W - 60, 50, 25);
  c.fill();
  c.fillStyle = "#6b6585";
  c.font = `400 18px ${SANS}`;
  c.fillText("Ask anything…", 56, H - 42);
  c.fillStyle = "#c94bff";
  c.beginPath();
  c.arc(W - 58, H - 49, 18, 0, Math.PI * 2);
  c.fill();
}

/* ------------------------------------------------------------------ */
/* WEB — build & deploy                                                */
/* ------------------------------------------------------------------ */
const DEPLOY_SITES = ["/projects/gabwise.webp", "/projects/advynce.webp", "/projects/sutra.webp", "/projects/ekakatha.webp"];
const DEPLOY_HOSTS = ["gabwisecommunications.com", "advynce.in", "sutrayogastudios.com", "ekakatha.in"];
const imgCache: Record<string, HTMLImageElement> = {};
const img = (src: string) => {
  if (!imgCache[src]) {
    const i = new Image();
    i.src = src;
    imgCache[src] = i;
  }
  return imgCache[src];
};

function drawDeploy(c: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const cycle = 9;
  const k = Math.floor(t / cycle) % DEPLOY_SITES.length;
  const lt = t % cycle;
  const host = DEPLOY_HOSTS[k];
  if (lt < 4.2) {
    chrome(c, W, H, "zsh — deploy", "#0b0d12");
    const lines: [number, string, string][] = [
      [0.0, "$ npm run build", "#e5e9f0"],
      [0.6, "▲ Next.js 16 · creating an optimized production build", "#8b93a7"],
      [1.3, "✓ Compiled successfully", "#28c840"],
      [1.8, "✓ Generating static pages (12/12)", "#28c840"],
      [2.4, "$ vercel --prod", "#e5e9f0"],
      [3.0, `✓ Deployed → https://${host}`, "#5cb6ff"],
    ];
    c.font = `500 21px ${MONO}`;
    lines.forEach(([at, txt, col], i) => {
      if (lt < at) return;
      const chars = Math.floor((lt - at) * 60);
      c.fillStyle = col;
      c.fillText(txt.slice(0, chars), 30, 90 + i * 40);
    });
    // progress
    const p = ease(lt / 3.4);
    c.fillStyle = "#1c2030";
    rr(c, 30, H - 70, W - 60, 14, 7);
    c.fill();
    const g = c.createLinearGradient(30, 0, W - 30, 0);
    g.addColorStop(0, "#b600a8");
    g.addColorStop(1, "#be4c00");
    c.fillStyle = g;
    rr(c, 30, H - 70, (W - 60) * p, 14, 7);
    c.fill();
  } else {
    // browser with the live site
    c.fillStyle = "#e9ecf2";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#fff";
    rr(c, 120, 10, W - 240, 26, 13);
    c.fill();
    c.fillStyle = "#4b5563";
    c.font = `500 15px ${SANS}`;
    c.textAlign = "center";
    c.fillText("🔒 " + host, W / 2, 28);
    c.textAlign = "left";
    const im = img(DEPLOY_SITES[k]);
    if (im.complete && im.naturalWidth) {
      const s = W / im.naturalWidth;
      c.drawImage(im, 0, 44, W, Math.min(H - 44, im.naturalHeight * s));
    }
    // deployed toast
    const a = ease((lt - 4.2) / 0.5);
    c.globalAlpha = a;
    c.fillStyle = "rgba(10,12,18,0.85)";
    rr(c, W - 300, H - 84 + (1 - a) * 30, 270, 58, 16);
    c.fill();
    c.fillStyle = "#28c840";
    c.font = `700 22px ${SANS}`;
    c.fillText("✓ Deployed", W - 278, H - 46 + (1 - a) * 30);
    c.fillStyle = "#9aa3b5";
    c.font = `500 14px ${SANS}`;
    c.fillText("Production · 38s", W - 140, H - 46 + (1 - a) * 30);
    c.globalAlpha = 1;
  }
}

/* ------------------------------------------------------------------ */
/* CONTACT — email compose                                             */
/* ------------------------------------------------------------------ */
const MAIL = [
  "Hi Mayank,",
  "",
  "We loved your Google & Meta Ads results —",
  "4,912 leads at ₹30 each is exactly what we need.",
  "",
  "Can we schedule a call this week to discuss",
  "a Performance Marketing role with our team?",
];
function drawEmail(c: CanvasRenderingContext2D, W: number, H: number, t: number) {
  chrome(c, W, H, "New message", "#ffffff");
  const lt = t % 14;
  c.font = `500 18px ${SANS}`;
  const rows: [string, string][] = [
    ["To", "mayank.guts30@gmail.com"],
    ["Subject", "Hire Mayank — Performance Marketer 🚀"],
  ];
  rows.forEach(([k, v], i) => {
    const y = 84 + i * 46;
    c.fillStyle = "#9ca3af";
    c.fillText(k, 30, y);
    c.fillStyle = "#111827";
    c.font = `600 18px ${SANS}`;
    c.fillText(v.slice(0, Math.floor(Math.min(v.length, (lt - i * 0.8) * 40))), 120, y);
    c.font = `500 18px ${SANS}`;
    c.fillStyle = "#eef0f4";
    c.fillRect(30, y + 16, W - 60, 2);
  });
  let budget = Math.max(0, (lt - 2) * 45);
  c.fillStyle = "#1f2937";
  c.font = `400 20px ${SANS}`;
  MAIL.forEach((line, i) => {
    if (budget <= 0) return;
    const part = line.slice(0, budget);
    budget -= line.length + 1;
    c.fillText(part, 30, 200 + i * 34);
  });
  // send button
  const sent = lt > 10.5;
  const pulse = 1 + (lt > 9.5 && !sent ? Math.sin(t * 10) * 0.04 : 0);
  c.save();
  c.translate(30 + 70, H - 50);
  c.scale(pulse, pulse);
  const g = c.createLinearGradient(-70, 0, 70, 0);
  g.addColorStop(0, "#b600a8");
  g.addColorStop(1, "#7621b0");
  c.fillStyle = sent ? "#16a34a" : g;
  rr(c, -70, -24, 140, 48, 24);
  c.fill();
  c.fillStyle = "#fff";
  c.font = `700 19px ${SANS}`;
  c.textAlign = "center";
  c.fillText(sent ? "✓ Sent" : "Send", 0, 7);
  c.textAlign = "left";
  c.restore();
}

/* ------------------------------------------------------------------ */
/* PHONE — Instagram ad + lead notifications                           */
/* ------------------------------------------------------------------ */
const LEADS = ["New lead · 3BHK Noida", "New lead · MBBS Russia", "New lead · Industrial plot", "New lead · Home tutor"];

function notif(c: CanvasRenderingContext2D, W: number, y: number, text: string, a: number) {
  c.globalAlpha = a;
  c.fillStyle = "rgba(255,255,255,0.96)";
  rr(c, 18, y, W - 36, 124, 28);
  c.fill();
  c.fillStyle = "#1877f2";
  rr(c, 36, y + 26, 72, 72, 18);
  c.fill();
  c.fillStyle = "#fff";
  c.font = `700 38px ${SANS}`;
  c.fillText("🔔", 45, y + 76);
  c.fillStyle = "#111827";
  c.font = `800 30px ${SANS}`;
  c.fillText("New lead!", 126, y + 56);
  c.fillStyle = "#374151";
  c.font = `600 25px ${SANS}`;
  c.fillText(text.replace("New lead · ", ""), 126, y + 94);
  c.globalAlpha = 1;
}

function drawInsta(c: CanvasRenderingContext2D, W: number, H: number, t: number) {
  c.fillStyle = "#ffffff";
  c.fillRect(0, 0, W, H);
  // status bar
  c.fillStyle = "#111";
  c.font = `600 22px ${SANS}`;
  c.fillText("9:41", 40, 52);
  c.fillText("▮▮▮ ◔", W - 130, 52);
  // header
  c.font = `700 30px ${SANS}`;
  c.fillText("Instagram", 34, 118);
  // post header
  const g = c.createLinearGradient(30, 150, 90, 210);
  g.addColorStop(0, "#f58529");
  g.addColorStop(0.5, "#dd2a7b");
  g.addColorStop(1, "#8134af");
  c.fillStyle = g;
  c.beginPath();
  c.arc(62, 182, 28, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#111";
  c.font = `700 22px ${SANS}`;
  c.fillText("dreamhomes.noida", 104, 176);
  c.fillStyle = "#6b7280";
  c.font = `500 18px ${SANS}`;
  c.fillText("Sponsored", 104, 202);
  // creative
  const iy = 226, ih = 520;
  const cg = c.createLinearGradient(0, iy, W, iy + ih);
  cg.addColorStop(0, "#1e1b4b");
  cg.addColorStop(0.55, "#7621b0");
  cg.addColorStop(1, "#be4c00");
  c.fillStyle = cg;
  c.fillRect(0, iy, W, ih);
  // skyline
  c.fillStyle = "rgba(255,255,255,0.18)";
  [[40, 200], [110, 300], [190, 240], [260, 360], [340, 280], [410, 220]].forEach(([x, h], i) => {
    const hh = h * (0.9 + 0.1 * Math.sin(t * 1.5 + i));
    c.fillRect(x, iy + ih - hh, 56, hh);
  });
  c.fillStyle = "#fff";
  c.font = `800 46px ${SANS}`;
  c.fillText("Your 3BHK", 40, iy + 90);
  c.fillText("in Noida.", 40, iy + 146);
  c.font = `500 22px ${SANS}`;
  c.fillText("Ready to move · Book a site visit", 40, iy + 190);
  // CTA
  c.fillStyle = "#0095f6";
  c.fillRect(0, iy + ih, W, 62);
  c.fillStyle = "#fff";
  c.font = `700 22px ${SANS}`;
  c.fillText("Get quote", 34, iy + ih + 40);
  c.fillText("›", W - 46, iy + ih + 40);
  // likes
  const likes = 1200 + Math.floor((t % 20) * 37);
  const beat = 1 + Math.max(0, Math.sin(t * 4)) * 0.15;
  c.save();
  c.translate(48, iy + ih + 110);
  c.scale(beat, beat);
  c.fillStyle = "#ed4956";
  c.font = `700 34px ${SANS}`;
  c.fillText("♥", -14, 12);
  c.restore();
  c.fillStyle = "#111";
  c.font = `700 22px ${SANS}`;
  c.fillText(`${likes.toLocaleString("en-IN")} likes`, 84, iy + ih + 120);
  c.fillStyle = "#374151";
  c.font = `500 20px ${SANS}`;
  c.fillText("dreamhomes.noida  Launch offer ends Sunday 🔑", 34, iy + ih + 160);
  // lead notifications
  const per = 3.2;
  const i = Math.floor(t / per);
  const lt = t % per;
  const a = lt < 0.4 ? lt / 0.4 : lt > 2.6 ? Math.max(0, 1 - (lt - 2.6) / 0.4) : 1;
  notif(c, W, 70 + (1 - ease(lt / 0.4)) * -110, LEADS[i % LEADS.length], a);
}

function drawNotify(c: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const g = c.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#1e1b4b");
  g.addColorStop(0.6, "#7621b0");
  g.addColorStop(1, "#be4c00");
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  c.fillStyle = "#fff";
  c.textAlign = "center";
  c.font = `300 120px ${SANS}`;
  c.fillText("9:41", W / 2, 230);
  c.font = `500 26px ${SANS}`;
  c.fillText("Wednesday, 11 November", W / 2, 278);
  c.textAlign = "left";
  const n = Math.floor(t / 1.6);
  const items = ["New lead · 3BHK Noida", "Conversion · Kredit24", "New lead · MBBS Russia", "Install · SIP Calculator", "New lead · Industrial plot"];
  for (let k = 0; k < 4; k++) {
    const idx = n - k;
    if (idx < 0) continue;
    const appear = k === 0 ? ease((t % 1.6) / 0.35) : 1;
    notif(c, W, 340 + k * 140 + (1 - appear) * -40, items[idx % items.length], (1 - k * 0.18) * appear);
  }
}

/** k = zoom: content is laid out for (W/k × H/k) and scaled up, so text stays readable on small 3D screens */
export function drawScreen(kind: ScreenKind, c: CanvasRenderingContext2D, W0: number, H0: number, t: number, k = 1) {
  c.save();
  c.setTransform(k, 0, 0, k, 0, 0);
  const W = W0 / k, H = H0 / k;
  switch (kind) {
    case "code":
      drawCode(c, W, H, t);
      break;
    case "ads":
      drawAds(c, W, H, t);
      break;
    case "chat":
      drawChat(c, W, H, t);
      break;
    case "deploy":
      drawDeploy(c, W, H, t);
      break;
    case "email":
      drawEmail(c, W, H, t);
      break;
    case "insta":
      drawInsta(c, W, H, t);
      break;
    case "notify":
      drawNotify(c, W, H, t);
      break;
  }
  c.restore();
}
