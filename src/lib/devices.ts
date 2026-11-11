/**
 * Procedural 3D laptop & phone with live canvas screens.
 * Laptop: ~1.6 units wide, base on y=0, screen faces +Z when open.
 */
import type * as T from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { drawScreen, type ScreenKind } from "./screens";

function screenTexture(THREE: typeof T, w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { canvas, tex, ctx: canvas.getContext("2d")! };
}

export type Device = {
  group: T.Group;
  /** t = seconds since this device became visible */
  update: (dt: number, t: number) => void;
};

export function createLaptop(THREE: typeof T, kind: ScreenKind): Device {
  const group = new THREE.Group();
  const alu = new THREE.MeshPhysicalMaterial({ color: 0xc9ced8, metalness: 0.85, roughness: 0.32, clearcoat: 0.4 });
  const darkAlu = new THREE.MeshStandardMaterial({ color: 0x2a2e36, metalness: 0.6, roughness: 0.45 });
  const bezel = new THREE.MeshPhysicalMaterial({ color: 0x07080a, roughness: 0.15, clearcoat: 1 });

  // base
  const base = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.06, 1.08, 4, 0.03), alu);
  base.position.y = 0.03;
  group.add(base);
  // keyboard well
  const kb = new THREE.Mesh(new RoundedBoxGeometry(1.36, 0.01, 0.5, 2, 0.004), darkAlu);
  kb.position.set(0, 0.062, -0.13);
  group.add(kb);
  // keys (instanced)
  const keyGeo = new RoundedBoxGeometry(0.075, 0.012, 0.075, 2, 0.01);
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x14161b, roughness: 0.6 });
  const keys = new THREE.InstancedMesh(keyGeo, keyMat, 15 * 5);
  const m = new THREE.Matrix4();
  let idx = 0;
  for (let r = 0; r < 5; r++)
    for (let k = 0; k < 15; k++) {
      m.makeTranslation(-0.63 + k * 0.09, 0.07, -0.33 + r * 0.088);
      keys.setMatrixAt(idx++, m);
    }
  group.add(keys);
  // trackpad
  const pad = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.004, 0.3, 2, 0.02), new THREE.MeshPhysicalMaterial({ color: 0xb9bfca, metalness: 0.7, roughness: 0.25 }));
  pad.position.set(0, 0.062, 0.3);
  group.add(pad);

  // lid (hinged at back edge)
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.06, -0.53);
  group.add(hinge);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(1.6, 1.02, 0.035, 4, 0.02), alu);
  lid.position.set(0, 0.51, -0.018);
  hinge.add(lid);
  const bez = new THREE.Mesh(new RoundedBoxGeometry(1.56, 0.98, 0.01, 2, 0.02), bezel);
  bez.position.set(0, 0.51, 0.002);
  hinge.add(bez);

  const S = screenTexture(THREE, 1280, 800);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.48, 0.925),
    new THREE.MeshBasicMaterial({ map: S.tex, toneMapped: false }),
  );
  screen.position.set(0, 0.515, 0.0085);
  hinge.add(screen);
  // glass reflection sheen
  const sheen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.48, 0.925),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.06, roughness: 0.05, metalness: 0, clearcoat: 1 }),
  );
  sheen.position.set(0, 0.515, 0.009);
  hinge.add(sheen);
  // camera dot
  const cam = new THREE.Mesh(new THREE.CircleGeometry(0.008, 12), new THREE.MeshBasicMaterial({ color: 0x1f2937 }));
  cam.position.set(0, 0.995, 0.0086);
  hinge.add(cam);

  // screen glow plane behind laptop
  let frame = 0;
  const update = (dt: number, t: number) => {
    // lid opens on appear
    const open = Math.min(1, t / 1.1);
    const e = 1 - Math.pow(1 - open, 3);
    hinge.rotation.x = Math.PI / 2 - e * (Math.PI / 2 + 0.24);
    // redraw screen at ~30fps
    frame++;
    if (frame % 2 === 0) {
      drawScreen(kind, S.ctx, S.canvas.width, S.canvas.height, Math.max(0, t - 0.8), 1.6);
      S.tex.needsUpdate = true;
    }
  };
  return { group, update };
}

export function createPhone(THREE: typeof T, kind: ScreenKind): Device {
  const group = new THREE.Group();
  const frameMat = new THREE.MeshPhysicalMaterial({ color: 0x1b1d22, metalness: 0.9, roughness: 0.25, clearcoat: 1 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.5, 1.02, 0.05, 6, 0.07), frameMat);
  group.add(body);
  const glass = new THREE.Mesh(new RoundedBoxGeometry(0.47, 0.99, 0.005, 6, 0.06), new THREE.MeshPhysicalMaterial({ color: 0x000000, roughness: 0.05, clearcoat: 1 }));
  glass.position.z = 0.025;
  group.add(glass);
  const S = screenTexture(THREE, 540, 1080);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.94), new THREE.MeshBasicMaterial({ map: S.tex, toneMapped: false }));
  screen.position.z = 0.0285;
  group.add(screen);
  const island = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.03, 0.002, 2, 0.014), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  island.position.set(0, 0.44, 0.0295);
  group.add(island);
  let frame = 0;
  const update = (_dt: number, t: number) => {
    frame++;
    if (frame % 2 === 0) {
      drawScreen(kind, S.ctx, S.canvas.width, S.canvas.height, t);
      S.tex.needsUpdate = true;
    }
  };
  return { group, update };
}
