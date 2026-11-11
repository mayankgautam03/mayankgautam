"use client";

/**
 * One fixed WebGL canvas for the whole page:
 *  • AI drone robot — flies between sections on scroll.
 *      <section data-bee='{"x":..,"y":..,"s":..}' data-robot="graph">  (on phones it parks bottom-right)
 *      x / y = -1..1 screen position, s = size, data-robot = face expression.
 *  • 3D laptop / phone with live screens — pinned to placeholder elements:
 *      <div data-device="laptop:ads+phone:insta" />
 */
import { useEffect, useRef, useState } from "react";
import type { Expression } from "@/lib/robot";
import type { ScreenKind } from "@/lib/screens";

type K = { x: number; y: number; s: number };
const DEFAULT: K = { x: 0.5, y: 0, s: 0.8 };
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const ICONS: Partial<Record<Expression, string>> = {
  wave: "👋",
  graph: "📈",
  think: "💬",
  code: "</>",
  happy: "✉️",
};

export function Scene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let raf = 0;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const { createRobot } = await import("@/lib/robot");
      const { createLaptop, createPhone } = await import("@/lib/devices");
      if (disposed || !canvasRef.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 760 ? 1.5 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.add(new THREE.HemisphereLight(0xf2f6ff, 0x8a7ccf, 1.1));
      const d1 = new THREE.DirectionalLight(0xfff4e6, 2.4);
      d1.position.set(3, 5, 6);
      const d2 = new THREE.DirectionalLight(0xbfd4ff, 1.8);
      d2.position.set(-5, 2, -4);
      scene.add(d1, d2);

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 10);
      const halfH = () => Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      /* ---------------- robot ---------------- */
      const robot = createRobot(THREE);
      const flight = new THREE.Group();
      flight.add(robot.group);
      scene.add(flight);

      // floating "held" icon
      const iconCanvas = document.createElement("canvas");
      iconCanvas.width = iconCanvas.height = 128;
      const iconTex = new THREE.CanvasTexture(iconCanvas);
      iconTex.colorSpace = THREE.SRGBColorSpace;
      const icon = new THREE.Sprite(new THREE.SpriteMaterial({ map: iconTex, transparent: true, depthTest: false }));
      icon.scale.setScalar(0.26);
      icon.renderOrder = 10;
      robot.holdPoint.add(icon);
      let iconFor = "";
      const drawIcon = (e: Expression) => {
        const ch = ICONS[e];
        icon.visible = !!ch;
        if (!ch || iconFor === e) return;
        iconFor = e;
        const c = iconCanvas.getContext("2d")!;
        c.clearRect(0, 0, 128, 128);
        const g = c.createLinearGradient(0, 0, 128, 128);
        g.addColorStop(0, "rgba(182,0,168,0.95)");
        g.addColorStop(1, "rgba(118,33,176,0.95)");
        c.fillStyle = g;
        c.beginPath();
        c.arc(64, 64, 58, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = "rgba(255,255,255,0.9)";
        c.lineWidth = 5;
        c.stroke();
        c.fillStyle = "#fff";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = ch === "</>" ? "700 44px monospace" : "60px sans-serif";
        c.fillText(ch, 64, 68);
        iconTex.needsUpdate = true;
      };

      /* ---------------- devices ---------------- */
      type Pinned = {
        el: HTMLElement;
        laptop?: ReturnType<typeof createLaptop>;
        phone?: ReturnType<typeof createPhone>;
        root: InstanceType<typeof THREE.Group>;
        seen: number; // time since first visible (-1 = never)
      };
      const pinned: Pinned[] = Array.from(document.querySelectorAll<HTMLElement>("[data-device]")).map((el) => {
        const root = new THREE.Group();
        const p: Pinned = { el, root, seen: -1 };
        for (const part of (el.dataset.device ?? "").split("+")) {
          const [type, kind] = part.split(":") as [string, ScreenKind];
          if (type === "laptop") {
            p.laptop = createLaptop(THREE, kind);
            root.add(p.laptop.group);
          } else if (type === "phone") {
            p.phone = createPhone(THREE, kind);
            root.add(p.phone.group);
          }
        }
        root.visible = false;
        scene.add(root);
        return p;
      });

      /* ---------------- robot keyframes ---------------- */
      type Key = { el: HTMLElement; k: K; expr: Expression };
      const readKeys = (): Key[] => {
        const mobile = window.innerWidth < 760;
        return Array.from(document.querySelectorAll<HTMLElement>("[data-bee]")).map((el, i) => {
          let k = DEFAULT;
          try {
            k = { ...DEFAULT, ...JSON.parse(el.dataset.bee || "{}") };
          } catch {}
          // phones: no free space beside text → small companion parked in the bottom-right corner
          if (mobile) k = { x: i % 2 ? 0.62 : 0.5, y: -0.5, s: 0.42 };
          return { el, k, expr: (el.dataset.robot as Expression) || "normal" };
        });
      };
      let keys = readKeys();
      const onResize = () => (keys = readKeys());
      window.addEventListener("resize", onResize);

      const targetAt = () => {
        if (!keys.length) return { ...DEFAULT, moving: 0, expr: "normal" as Expression };
        const anchor = window.scrollY + window.innerHeight * 0.45;
        const tops = keys.map(({ el }) => el.getBoundingClientRect().top + window.scrollY);
        let i = 0;
        for (let n = 0; n < tops.length; n++) if (tops[n] <= anchor) i = n;
        const j = Math.min(i + 1, keys.length - 1);
        const f = j === i ? 0 : clamp((anchor - tops[i]) / (tops[j] - tops[i]), 0, 1);
        const t = ease(clamp((f - 0.55) / 0.45, 0, 1));
        const a = keys[i].k, b = keys[j].k;
        const m = Math.sin(t * Math.PI);
        return {
          x: lerp(a.x, b.x, t),
          y: lerp(a.y, b.y, t) + m * -0.18,
          s: lerp(a.s, b.s, t) * (1 + m * 0.1),
          moving: m,
          expr: (t > 0.5 ? keys[j].expr : keys[i].expr) as Expression,
        };
      };

      const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
      const onMouse = (e: PointerEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("pointermove", onMouse, { passive: true });

      const clock = new THREE.Clock();
      const cur = { ...targetAt() };
      let px = cur.x, py = cur.y;
      let shown = false;

      const loop = () => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;
        const H = halfH();
        const W = H * camera.aspect;
        const wpp = (2 * H) / window.innerHeight; // world units per CSS px

        const km = 1 - Math.exp(-dt * 2);
        mouse.sx += (mouse.x - mouse.sx) * km;
        mouse.sy += (mouse.y - mouse.sy) * km;

        /* robot */
        const tg = targetAt();
        const k = 1 - Math.exp(-dt * 3.2);
        cur.x += (tg.x - cur.x) * k;
        cur.y += (tg.y - cur.y) * k;
        cur.s += (tg.s - cur.s) * k;
        const vx = dt ? (cur.x - px) / dt : 0;
        const vy = dt ? (cur.y - py) / dt : 0;
        px = cur.x;
        py = cur.y;
        robot.setExpression(tg.expr);
        drawIcon(tg.expr);
        const hover = Math.sin(t * 2.1) * 0.045 + Math.sin(t * 3.7) * 0.015;
        flight.position.set(
          cur.x * W + Math.sin(t * 1.3) * 0.05 + mouse.sx * 0.15,
          cur.y * H + hover * H * 0.5 + mouse.sy * 0.1,
          0.5,
        );
        flight.scale.setScalar((H * 2 * 0.2 * cur.s) / 1.55);
        robot.group.rotation.set(
          clamp(-vy * 0.15, -0.35, 0.35) + mouse.sy * -0.08,
          mouse.sx * 0.35 + clamp(vx * 0.25, -0.5, 0.5),
          clamp(-vx * 0.35, -0.45, 0.45) + Math.sin(t * 1.7) * 0.04,
        );
        robot.update(dt, t, { moving: Math.max(tg.moving, Math.min(1, Math.hypot(vx, vy) * 1.5)), vx, vy, lookX: mouse.sx, lookY: mouse.sy });

        /* pinned devices */
        for (const p of pinned) {
          const r = p.el.getBoundingClientRect();
          const vis = r.width > 0 && r.bottom > -100 && r.top < window.innerHeight + 100;
          p.root.visible = vis;
          if (!vis) continue;
          if (p.seen < 0 && r.top < window.innerHeight * 0.85) p.seen = 0;
          if (p.seen >= 0) p.seen += dt;
          const life = Math.max(0, p.seen);
          const cx = ((r.left + r.width / 2) / window.innerWidth) * 2 - 1;
          const cy = -(((r.top + r.height / 2) / window.innerHeight) * 2 - 1);
          p.root.position.set(cx * W, cy * H, 0);
          const appear = 1 - Math.pow(1 - Math.min(1, life / 0.9), 3);
          const bob = Math.sin(t * 1.2 + r.left * 0.01) * 0.03;

          if (p.laptop) {
            const lw = (p.phone ? r.width * 0.78 : r.width * 0.92) * wpp;
            // fit by width AND height (open laptop is ~1.15 units tall on screen)
            const s = Math.min(lw / 1.6, (r.height * wpp) / 1.2) * (0.85 + 0.15 * appear);
            const g = p.laptop.group;
            g.scale.setScalar(s);
            g.position.set(p.phone ? -r.width * 0.1 * wpp : 0, -0.42 * s + bob * s - (1 - appear) * 0.4, 0);
            g.rotation.set(0.32 + mouse.sy * -0.06, -0.28 + mouse.sx * 0.18, 0);
            p.laptop.update(dt, life);
          }
          if (p.phone) {
            const ph = Math.min(r.height * 0.82, r.width * 0.9) * wpp;
            const s = (ph / 1.02) * (0.85 + 0.15 * appear);
            const g = p.phone.group;
            g.scale.setScalar(s);
            g.position.set(p.laptop ? r.width * 0.33 * wpp : 0, (p.laptop ? -r.height * 0.06 : 0) * wpp + Math.sin(t * 1.6) * 0.04 * s - (1 - appear) * 0.5, 0.9);
            g.rotation.set(0.08 + mouse.sy * -0.05, -0.32 + mouse.sx * 0.2, 0.06 + Math.sin(t * 1.1) * 0.02);
            p.phone.update(dt, Math.max(0, life - 0.6));
          }
        }

        renderer.render(scene, camera);
        if (!shown) {
          shown = true;
          setReady(true);
        }
      };

      if (reduced) {
        // render a single still frame
        loop();
        cancelAnimationFrame(raf);
        const still = () => {
          clock.getDelta();
          loop();
          cancelAnimationFrame(raf);
        };
        window.addEventListener("scroll", still, { passive: true });
      } else loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onMouse);
        renderer.dispose();
        pmrem.dispose();
      };
    };

    const id = window.setTimeout(start, 300);
    return () => {
      disposed = true;
      clearTimeout(id);
      cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-20 size-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
