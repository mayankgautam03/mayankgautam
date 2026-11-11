/**
 * Procedural flying AI robot (drone-arms) — built entirely in three.js, no model files.
 * createRobot(THREE) → { group, update(dt, t, state), setExpression(e) }
 * Robot is ~1 unit tall, facing +Z (towards camera).
 */
import type * as T from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Expression = "normal" | "wave" | "graph" | "think" | "code" | "happy";

export type RobotState = {
  /** 0..1 how fast it is flying between sections */
  moving: number;
  /** horizontal / vertical velocity (screen units / s) — for leg swing & tilt */
  vx: number;
  vy: number;
  /** where to look, -1..1 */
  lookX: number;
  lookY: number;
};

export function createRobot(THREE: typeof T) {
  const group = new THREE.Group();

  /* ---------------- materials ---------------- */
  const white = new THREE.MeshPhysicalMaterial({
    color: 0xf3f5f8,
    roughness: 0.28,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  });
  const grey = new THREE.MeshPhysicalMaterial({ color: 0xc9ced6, roughness: 0.35, metalness: 0.2, clearcoat: 0.6 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x15181d, roughness: 0.38, metalness: 0.55 });
  const visorMat = new THREE.MeshPhysicalMaterial({
    color: 0x040507,
    roughness: 0.08,
    metalness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
  });
  const glow = new THREE.MeshStandardMaterial({ color: 0x9fd6ff, emissive: 0x3da9ff, emissiveIntensity: 1.6, roughness: 0.3 });
  const chestGlow = new THREE.MeshStandardMaterial({ color: 0xe8f4ff, emissive: 0xb9e1ff, emissiveIntensity: 1.2, roughness: 0.2 });
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x2a1d1a, roughness: 0.5, metalness: 0.3 });

  const mesh = (g: T.BufferGeometry, m: T.Material) => {
    const o = new THREE.Mesh(g, m);
    o.castShadow = false;
    return o;
  };

  /* ---------------- torso ---------------- */
  const body = new THREE.Group();
  group.add(body);

  const torso = mesh(new THREE.SphereGeometry(0.25, 48, 32), white);
  torso.scale.set(1, 1.02, 0.9);
  torso.position.y = 0.02;
  body.add(torso);

  // dark collar ring under the neck
  const collar = mesh(new THREE.TorusGeometry(0.105, 0.03, 16, 40), dark);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.245;
  body.add(collar);
  const neck = mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.09, 24), dark);
  neck.position.y = 0.28;
  body.add(neck);

  // belly light
  const chest = mesh(new RoundedBoxGeometry(0.13, 0.06, 0.04, 4, 0.025), chestGlow);
  chest.position.set(0, -0.04, 0.215);
  chest.rotation.x = -0.12;
  body.add(chest);
  // panel seam
  const seam = mesh(new THREE.TorusGeometry(0.235, 0.004, 8, 64, Math.PI), grey);
  seam.rotation.set(0, 0, Math.PI);
  seam.position.set(0, 0.02, 0.0);
  seam.scale.set(1, 0.95, 1.05);
  body.add(seam);
  // small status leds on chest
  for (const x of [-0.06, 0.06]) {
    const led = mesh(new THREE.SphereGeometry(0.009, 12, 12), glow);
    led.position.set(x, 0.12, 0.2);
    body.add(led);
  }

  /* ---------------- head ---------------- */
  const headPivot = new THREE.Group();
  headPivot.position.y = 0.33;
  body.add(headPivot);

  const head = mesh(new RoundedBoxGeometry(0.56, 0.42, 0.42, 8, 0.15), white);
  head.position.y = 0.2;
  headPivot.add(head);

  const visor = mesh(new RoundedBoxGeometry(0.46, 0.29, 0.06, 8, 0.1), visorMat);
  visor.position.set(0, 0.2, 0.2);
  headPivot.add(visor);

  // face screen (canvas texture)
  const faceCanvas = document.createElement("canvas");
  faceCanvas.width = 512;
  faceCanvas.height = 320;
  const faceTex = new THREE.CanvasTexture(faceCanvas);
  faceTex.colorSpace = THREE.SRGBColorSpace;
  const face = mesh(
    new THREE.PlaneGeometry(0.4, 0.25),
    new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, toneMapped: false }),
  );
  face.position.set(0, 0.2, 0.232);
  headPivot.add(face);

  // ear pods
  for (const s of [-1, 1]) {
    const ear = mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.06, 32), grey);
    ear.rotation.z = Math.PI / 2;
    ear.position.set(s * 0.29, 0.2, -0.01);
    headPivot.add(ear);
    const ring = mesh(new THREE.TorusGeometry(0.055, 0.009, 10, 32), glow);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(s * 0.322, 0.2, -0.01);
    headPivot.add(ring);
  }

  // antennas
  const antennaTips: T.Mesh[] = [];
  for (const s of [-1, 1]) {
    const a = new THREE.Group();
    a.position.set(s * 0.17, 0.38, -0.02);
    a.rotation.z = -s * 0.12;
    const rod = mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.2, 10), grey);
    rod.position.y = 0.1;
    const tip = mesh(new THREE.SphereGeometry(0.018, 16, 16), glow.clone());
    tip.position.y = 0.205;
    a.add(rod, tip);
    headPivot.add(a);
    antennaTips.push(tip);
  }

  /* ---------------- arms with propellers ---------------- */
  /** attach point under the left hand — for a floating "held" icon */
  const holdPoint = new THREE.Object3D();
  type Arm = { shoulder: T.Group; elbow: T.Group; props: T.Group[]; blur: T.Mesh; side: number };
  const arms: Arm[] = [];
  const blurTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    grd.addColorStop(0, "rgba(40,30,28,0.0)");
    grd.addColorStop(0.25, "rgba(40,30,28,0.35)");
    grd.addColorStop(0.9, "rgba(40,30,28,0.22)");
    grd.addColorStop(1, "rgba(40,30,28,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();

  for (const s of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(s * 0.24, 0.12, 0);
    body.add(shoulder);
    const sj = mesh(new THREE.SphereGeometry(0.075, 24, 24), dark);
    shoulder.add(sj);
    // upper arm (along x)
    const upper = mesh(new THREE.CapsuleGeometry(0.075, 0.13, 8, 24), white);
    upper.rotation.z = Math.PI / 2;
    upper.position.x = s * 0.15;
    shoulder.add(upper);

    const elbow = new THREE.Group();
    elbow.position.x = s * 0.27;
    shoulder.add(elbow);
    const ej = mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.08, 24), dark);
    ej.rotation.z = Math.PI / 2;
    elbow.add(ej);
    const fore = mesh(new THREE.CapsuleGeometry(0.08, 0.16, 8, 24), white);
    fore.rotation.z = Math.PI / 2;
    fore.position.x = s * 0.15;
    elbow.add(fore);
    // motor pod at hand
    const pod = mesh(new THREE.CapsuleGeometry(0.06, 0.06, 8, 20), white);
    pod.position.set(s * 0.29, 0.06, 0);
    elbow.add(pod);
    const shaft = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 10), dark);
    shaft.position.set(s * 0.29, 0.15, 0);
    elbow.add(shaft);
    const hubBase = mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.03, 24), grey);
    hubBase.position.set(s * 0.29, 0.12, 0);
    elbow.add(hubBase);

    // two stacked 2-blade props (coaxial look)
    const props: T.Group[] = [];
    for (const [y, r] of [
      [0.19, 0.24],
      [0.215, 0.22],
    ]) {
      const p = new THREE.Group();
      p.position.set(s * 0.29, y, 0);
      const hub = mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.018, 16), dark);
      p.add(hub);
      for (const a of [0, Math.PI]) {
        const blade = mesh(new THREE.BoxGeometry(r, 0.004, 0.035), bladeMat);
        blade.position.x = Math.cos(a) * (r / 2);
        blade.position.z = Math.sin(a) * (r / 2);
        blade.rotation.y = -a;
        blade.rotation.x = 0.18;
        p.add(blade);
      }
      elbow.add(p);
      props.push(p);
    }
    const blur = mesh(
      new THREE.CircleGeometry(0.25, 40),
      new THREE.MeshBasicMaterial({ map: blurTex, transparent: true, depthWrite: false, opacity: 0.8 }),
    );
    blur.rotation.x = -Math.PI / 2;
    blur.position.set(s * 0.29, 0.2, 0);
    elbow.add(blur);

    arms.push({ shoulder, elbow, props, blur, side: s });
    if (s === -1) {
      holdPoint.position.set(s * 0.29, -0.12, 0.06);
      elbow.add(holdPoint);
    }
  }

  /* ---------------- wheel legs ---------------- */
  const legs: T.Group[] = [];
  const pelvis = mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.08, 24), dark);
  pelvis.position.y = -0.24;
  body.add(pelvis);
  for (const s of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(s * 0.11, -0.27, 0);
    body.add(hip);
    const hj = mesh(new THREE.SphereGeometry(0.045, 16, 16), dark);
    hip.add(hj);
    const leg = new THREE.Group();
    leg.position.y = -0.17;
    leg.rotation.y = -s * 0.4; // outer face turned towards the viewer, like the reference
    leg.scale.set(1, 1.18, 1.08);
    hip.add(leg);
    // rounded white pod (like a wheel cover) with dark inner hub
    const shell = mesh(new THREE.SphereGeometry(0.13, 48, 32), white);
    shell.scale.set(0.62, 1, 0.95);
    leg.add(shell);
    const inner = mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.03, 32), dark);
    inner.rotation.z = Math.PI / 2;
    inner.position.x = -s * 0.072;
    leg.add(inner);
    const hubCap = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.016, 32), grey);
    hubCap.rotation.z = Math.PI / 2;
    hubCap.position.x = s * 0.078;
    leg.add(hubCap);
    const seamL = mesh(new THREE.TorusGeometry(0.1, 0.004, 8, 48), dark);
    seamL.rotation.y = Math.PI / 2;
    seamL.position.x = s * 0.062;
    leg.add(seamL);
    const led = mesh(new THREE.SphereGeometry(0.014, 12, 12), glow);
    led.position.set(s * 0.07, 0.07, 0.05);
    leg.add(led);
    legs.push(hip);
  }

  /* ---------------- face drawing ---------------- */
  let expression: Expression = "normal";
  let exprT = 0;
  let blinkT = 2;
  let blink = 0;
  const ctx = faceCanvas.getContext("2d")!;

  const drawFace = (t: number, lookX: number, lookY: number) => {
    const W = 512, H = 320;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.shadowColor = "rgba(90,180,255,0.95)";
    ctx.shadowBlur = 26;
    ctx.strokeStyle = "#f2f8ff";
    ctx.fillStyle = "#5cb6ff";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const ex = [W * 0.3, W * 0.7];
    const ey = H * 0.5;
    const px = lookX * 14, py = -lookY * 10;
    const pop = Math.min(1, exprT * 4); // pop-in for new expression

    const ringEyes = (squash = 1) => {
      for (const x of ex) {
        ctx.save();
        ctx.translate(x + px, ey + py);
        ctx.scale(1, Math.max(0.08, squash));
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.arc(0, 0, 52, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath();
        ctx.arc(-11, -12, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#5cb6ff";
        ctx.restore();
      }
    };

    if (expression === "normal" || expression === "wave") {
      ringEyes(1 - blink);
    } else if (expression === "happy") {
      ctx.lineWidth = 16;
      for (const x of ex) {
        ctx.beginPath();
        ctx.arc(x + px, ey + 18 + py, 46 * pop, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      }
    } else if (expression === "graph") {
      // eyes become rising bar charts
      ctx.lineWidth = 0;
      for (const x of ex) {
        const bars = [0.35, 0.55, 0.8, 1];
        bars.forEach((h, i) => {
          const grow = Math.min(1, Math.max(0, exprT * 3 - i * 0.25));
          const bh = 92 * h * grow * (0.92 + 0.08 * Math.sin(t * 4 + i));
          ctx.fillStyle = i === 3 ? "#9dffb0" : "#5cb6ff";
          ctx.shadowColor = i === 3 ? "rgba(120,255,160,0.9)" : "rgba(90,180,255,0.95)";
          ctx.beginPath();
          ctx.roundRect(x - 54 + i * 28 + px, ey + 46 - bh + py, 20, bh, 6);
          ctx.fill();
        });
      }
      ctx.fillStyle = "#5cb6ff";
    } else if (expression === "think") {
      ctx.lineWidth = 11;
      ringEyes(0.55);
      for (let i = 0; i < 3; i++) {
        const a = 0.35 + 0.65 * Math.max(0, Math.sin(t * 5 - i * 0.7));
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(W / 2 - 34 + i * 34, H * 0.86, 9, 0, Math.PI * 2);
        ctx.fillStyle = "#f2f8ff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else if (expression === "code") {
      ctx.lineWidth = 15;
      const c = W / 2 + px;
      ctx.beginPath();
      ctx.moveTo(c - 110, ey - 60 + py);
      ctx.lineTo(c - 175, ey + py);
      ctx.lineTo(c - 110, ey + 60 + py);
      ctx.moveTo(c + 110, ey - 60 + py);
      ctx.lineTo(c + 175, ey + py);
      ctx.lineTo(c + 110, ey + 60 + py);
      ctx.moveTo(c + 30, ey - 72 + py);
      ctx.lineTo(c - 30, ey + 72 + py);
      ctx.stroke();
      // blinking cursor
      if (Math.sin(t * 6) > 0) {
        ctx.fillStyle = "#9dffb0";
        ctx.fillRect(c + 190, ey + 40 + py, 26, 10);
      }
    }
    ctx.restore();
    faceTex.needsUpdate = true;
  };

  /* ---------------- per-frame update ---------------- */
  let waveT = 0;
  const update = (dt: number, t: number, s: RobotState) => {
    exprT += dt;

    // blink
    blinkT -= dt;
    if (blinkT < 0) {
      blink = Math.min(1, blink + dt * 14);
      if (blink >= 1) blinkT = 2.5 + Math.random() * 3;
    } else blink = Math.max(0, blink - dt * 10);

    // propellers
    const spin = 38 + s.moving * 30;
    for (const a of arms) {
      a.props[0].rotation.y += dt * spin * a.side;
      a.props[1].rotation.y -= dt * spin * 0.92 * a.side;
      (a.blur.material as T.MeshBasicMaterial).opacity = 0.55 + s.moving * 0.35 + Math.sin(t * 60) * 0.05;
    }

    // arms: gentle flap + bank; right arm waves in "wave" mode
    waveT = expression === "wave" ? Math.min(1, waveT + dt * 2) : Math.max(0, waveT - dt * 2);
    for (const a of arms) {
      const bank = -s.vx * 0.25 * a.side;
      const idle = Math.sin(t * 2.2 + a.side) * 0.06;
      a.shoulder.rotation.z = a.side * (0.08 + idle) + bank;
      a.shoulder.rotation.x = Math.sin(t * 1.6 + a.side) * 0.05 + s.vy * 0.1;
      if (a.side === 1 && waveT > 0) {
        a.shoulder.rotation.z = 0.08 + waveT * 0.22;
        a.shoulder.rotation.y = -waveT * 0.55;
        a.elbow.rotation.z = waveT * (0.75 + Math.sin(t * 9) * 0.3);
      } else {
        if (a.side === 1) a.shoulder.rotation.y = 0;
        a.elbow.rotation.z = a.side * (0.12 + Math.sin(t * 2.2 + 1) * 0.05);
      }
    }

    // legs dangle with momentum
    legs.forEach((hip, i) => {
      hip.rotation.x = Math.max(-0.6, Math.min(0.6, -s.vy * 0.35)) + Math.sin(t * 2.4 + i * 1.3) * 0.12;
      hip.rotation.z = Math.max(-0.5, Math.min(0.5, s.vx * 0.3)) + Math.sin(t * 1.9 + i) * 0.05;
    });

    // head looks at mouse
    headPivot.rotation.y += (s.lookX * 0.45 - headPivot.rotation.y) * Math.min(1, dt * 5);
    headPivot.rotation.x += (-s.lookY * 0.25 - headPivot.rotation.x) * Math.min(1, dt * 5);

    // glows
    const pulse = 0.5 + 0.5 * Math.sin(t * 3);
    chestGlow.emissiveIntensity = 0.8 + pulse * 0.9;
    antennaTips.forEach((tip, i) => {
      (tip.material as T.MeshStandardMaterial).emissiveIntensity = 1 + Math.max(0, Math.sin(t * 4 + i * 1.6)) * 2.5;
    });

    drawFace(t, s.lookX, s.lookY);
  };

  const setExpression = (e: Expression) => {
    if (e !== expression) {
      expression = e;
      exprT = 0;
    }
  };

  drawFace(0, 0, 0);
  return { group, update, setExpression, holdPoint };
}
