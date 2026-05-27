"use client";

/* eslint-disable react-hooks/immutability -- r3f relies on direct mutation of
   hook-returned objects (camera.position, gl.domElement.style, group.position). */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import * as THREE from "three";

// Soft neutral matching --color-neutral-30 — used for panel placeholders
// while their image texture is still loading. Lives outside the
// component so it isn't reallocated per render.
const PLACEHOLDER_COLOR = "#dee4ea";

function makeRoundedRectShape(w: number, h: number, r: number) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function makeRoundedRectGeometry(w: number, h: number, r: number) {
  const shape = makeRoundedRectShape(w, h, r);
  const geometry = new THREE.ShapeGeometry(shape, 16);
  const pos = geometry.attributes.position;
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uvs[i * 2] = (x + w / 2) / w;
    uvs[i * 2 + 1] = (y + h / 2) / h;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return geometry;
}

const LAB_IMAGES = [
  "/images/lab/lab-01.png",
  "/images/lab/lab-02.png",
  "/images/lab/lab-03.png",
  "/images/lab/lab-04.png",
  "/images/lab/lab-05.png",
  "/images/lab/lab-06.png",
  "/images/lab/lab-07.png",
  "/images/lab/lab-08.png",
  "/images/lab/lab-09.png",
  "/images/lab/lab-10.png",
  "/images/lab/lab-11.png",
  "/images/lab/lab-12.png",
  "/images/lab/lab-13.png",
  "/images/lab/lab-14.png",
  "/images/lab/lab-15.png",
  "/images/lab/lab-16.png",
  "/images/lab/lab-17.png",
  "/images/lab/lab-18.png",
  "/images/lab/lab-19.png",
  "/images/lab/lab-20.png",
  "/images/lab/lab-21.png",
  "/images/lab/lab-22.png",
  "/images/lab/lab-23.png",
  "/images/lab/lab-24.png",
  "/images/lab/lab-25.png",
];

// Visual-style category per image (index = LAB_IMAGES index). Drives the
// round-robin shuffle below so similar styles are spread across the grid
// rather than clustered. Counts: A=7, B=4, C=3, D=2, E=9 → 25.
const IMAGE_CATEGORIES = [
  "A", // 0  lab-01
  "A", // 1  lab-02
  "C", // 2  lab-03
  "A", // 3  lab-04
  "B", // 4  lab-05
  "A", // 5  lab-06
  "A", // 6  lab-07
  "C", // 7  lab-08
  "A", // 8  lab-09
  "B", // 9  lab-10
  "B", // 10 lab-11
  "B", // 11 lab-12
  "E", // 12 lab-13
  "C", // 13 lab-14
  "A", // 14 lab-15
  "D", // 15 lab-16
  "D", // 16 lab-17
  "E", // 17 lab-18
  "E", // 18 lab-19
  "E", // 19 lab-20
  "E", // 20 lab-21
  "E", // 21 lab-22
  "E", // 22 lab-23
  "E", // 23 lab-24
  "E", // 24 lab-25
] as const;

// Natural panel size per image (index = LAB_IMAGES index): height capped
// at 5 wu, width = 5 × (imgW / imgH). Most images are square → [5, 5];
// lab-16 is an extreme 2.93:1 panorama (430×147 → 14.63 wu wide).
const IMAGE_SIZES: [number, number][] = [
  [5, 5], // 0  lab-01 1:1
  [5, 5], // 1  lab-02 1:1
  [5, 5], // 2  lab-03 1:1
  [5, 5], // 3  lab-04 1:1
  [5, 5], // 4  lab-05 1:1
  [5, 5], // 5  lab-06 1:1
  [5, 5], // 6  lab-07 1:1
  [5, 5], // 7  lab-08 1:1
  [4, 5], // 8  lab-09 420×525 portrait
  [5, 5], // 9  lab-10 1:1
  [5, 5], // 10 lab-11 1:1
  [5, 5], // 11 lab-12 1:1
  [5.37, 5], // 12 lab-13 420×391
  [5, 5], // 13 lab-14 1:1
  [5, 5], // 14 lab-15 1:1
  [14.63, 5], // 15 lab-16 panorama 2.93:1
  [4.7, 5], // 16 lab-17 395×420
  [5, 5], // 17 lab-18 1:1
  [5, 5], // 18 lab-19 1:1
  [5, 5], // 19 lab-20 1:1
  [7.57, 5], // 20 lab-21 436×288
  [9.4, 5], // 21 lab-22 436×232
  [5, 5], // 22 lab-23 1:1
  [5, 5], // 23 lab-24 1:1
  [5, 5], // 24 lab-25 1:1
];

interface PanelDef {
  basePos: [number, number, number];
  size: [number, number];
  imageIndex: number;
  geometry: THREE.ShapeGeometry;
}

function definePanel(
  basePos: [number, number, number],
  size: [number, number],
  imageIndex: number,
): PanelDef {
  return {
    basePos,
    size,
    imageIndex,
    geometry: makeRoundedRectGeometry(size[0], size[1], 0.28),
  };
}

const PERIOD_X = 52;
// 5 full rows (5×5 grid). 45 = 5 bands × ~9-unit row pitch, so the
// vertical wrap seam keeps the same even rhythm and no row collides with
// the wrapped top row when the field tiles. (Was 36 with 4 rows.)
// PERIOD_X=52 still clears the widest column span; the lone 14.63-wide
// panorama stays < PERIOD_X so it never meets its own horizontal wrap.
const PERIOD_Y = 45;

// 5×5 grid positions (row-major). Reuses the prior layout's gentle
// per-row X/Y jitter. Two row-1 X's are spread slightly (col3 0 → -0.4,
// col5 19.2 → 19.6) to make room for the wide panorama the shuffle drops
// into row-1 col4 — see the overlap note on PANELS below.
const POSITIONS: [number, number, number][] = [
  // row 1
  [-19.2, 13.2, 0],
  [-9.6, 14.4, 0],
  [-0.4, 13.2, 0],
  [9.6, 13.8, 0],
  [19.6, 13.2, 0],
  // row 2
  [-16.8, 4.8, 0],
  [-7.2, 6.0, 0],
  [2.4, 4.8, 0],
  [12.0, 6.0, 0],
  [21.6, 4.8, 0],
  // row 3
  [-21.6, -3.6, 0],
  [-12.0, -4.8, 0],
  [-2.4, -3.6, 0],
  [7.2, -4.8, 0],
  [16.8, -3.6, 0],
  // row 4
  [-19.2, -12.0, 0],
  [-9.6, -13.2, 0],
  [0, -12.0, 0],
  [9.6, -13.2, 0],
  [19.2, -12.0, 0],
  // row 5
  [-21.6, -21.0, 0],
  [-12.0, -22.2, 0],
  [-2.4, -21.0, 0],
  [7.2, -22.2, 0],
  [16.8, -21.0, 0],
];

// ── Deterministic, category-aware shuffle ──
// Mulberry32 PRNG with a fixed seed: identical layout on every load, but
// scattered-looking. No Math.random(), so SSR and client agree.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(arr: readonly number[], rng: () => number): number[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CATEGORY_ORDER = ["A", "B", "C", "D", "E"] as const;

// Round-robin across categories (A→B→C→D→E), each drawing from its own
// seeded-shuffled queue, so adjacent positions rarely share a style. The
// dominant category E (9 imgs) outlasts the rest, so the final positions
// are unavoidably E. Seed 42 yields (image indices, 0-based):
//   [5,4,13,15,24,1,10,2,16,20,0,11,7,12,8,9,23,14,21,3,19,6,17,18,22]
function buildShuffledIndices(): number[] {
  const rng = mulberry32(42);
  const queues = new Map<string, number[]>();
  IMAGE_CATEGORIES.forEach((cat, idx) => {
    const q = queues.get(cat) ?? [];
    q.push(idx);
    queues.set(cat, q);
  });
  for (const cat of CATEGORY_ORDER) {
    queues.set(cat, seededShuffle(queues.get(cat) ?? [], rng));
  }
  const result: number[] = [];
  while (result.length < IMAGE_CATEGORIES.length) {
    for (const cat of CATEGORY_ORDER) {
      const q = queues.get(cat);
      if (!q || q.length === 0) continue;
      const next = q.shift();
      if (next !== undefined) result.push(next);
    }
  }
  return result;
}

const SHUFFLED_INDICES = buildShuffledIndices();

// Each grid position shows the image at SHUFFLED_INDICES[position], sized
// to that image's natural aspect ratio (IMAGE_SIZES). Overlap note: seed
// 42 drops the 14.63-wide panorama (lab-16) into row-1 col4 (X=9.6). The
// row-1 col3/col5 X-spread in POSITIONS (±0.4) widens both neighbour gaps
// 9.6 → 10.0, clearing the panorama's 9.815-wu half-span requirement
// (~0.19 wu margin). Every other panel is ≤9.4 wu and clears its
// neighbours at the 9.6 column pitch; the full pairwise modular check
// (accounting for PERIOD_X/PERIOD_Y wrap) is overlap-free.
const PANELS: PanelDef[] = POSITIONS.map((basePos, i) => {
  const imageIndex = SHUFFLED_INDICES[i];
  return definePanel(basePos, IMAGE_SIZES[imageIndex], imageIndex);
});

// Orthographic zoom ≈ screen px per world unit. Mobile uses a smaller
// zoom so panels *and* the gaps between them shrink together, compacting
// the scene below 768px. 32 (~64% of the desktop 50) is the design
// starting point; nudge within the 30–36 band to fine-tune the gap.
const DESKTOP_ZOOM = 50;
const MOBILE_ZOOM = 32;
const MOBILE_MAX_WIDTH = 767; // ≤767px == mobile (i.e. <768px)

const CAMERA_CONFIG = {
  position: [0, 0, 100] as [number, number, number],
  zoom: DESKTOP_ZOOM,
  near: 0.1,
  far: 1000,
};
const DPR: [number, number] = [1, 1.5];
const GL_CONFIG = { alpha: true, antialias: true };

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function applyCoverUv(
  texture: THREE.Texture,
  panelSize: [number, number],
) {
  const img = texture.image as HTMLImageElement | undefined;
  if (!img || !img.width || !img.height) return;
  const imgAspect = img.width / img.height;
  const panelAspect = panelSize[0] / panelSize[1];
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.center.set(0.5, 0.5);
  if (imgAspect > panelAspect) {
    const scaleX = panelAspect / imgAspect;
    texture.repeat.set(scaleX, 1);
    texture.offset.set((1 - scaleX) / 2, 0);
  } else {
    const scaleY = imgAspect / panelAspect;
    texture.repeat.set(1, scaleY);
    texture.offset.set(0, (1 - scaleY) / 2);
  }
  texture.needsUpdate = true;
}

// ── Panel sub-components ──
//
// Three concerns split out so each one is small and obvious:
//   - ProjectPanelFrame       : owns the wrapping group + per-frame
//                               position math; pure presentational.
//   - ProjectPanelPlaceholder : flat-grey mesh, no async work.
//   - ProjectPanelTextured    : calls drei's useTexture() — this is
//                               the *only* thing that suspends.
//
// The combined ProjectPanel mounts the textured branch inside a
// per-panel <Suspense>, so a slow image only suspends its own panel,
// not the whole scene.

interface ProjectPanelFrameProps {
  basePos: [number, number, number];
  children: ReactNode;
}

function ProjectPanelFrame({ basePos, children }: ProjectPanelFrameProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    const dx = camera.position.x - basePos[0];
    const dy = camera.position.y - basePos[1];
    const shiftX = Math.round(dx / PERIOD_X) * PERIOD_X;
    const shiftY = Math.round(dy / PERIOD_Y) * PERIOD_Y;
    groupRef.current.position.set(
      basePos[0] + shiftX,
      basePos[1] + shiftY,
      basePos[2],
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

function ProjectPanelPlaceholder({
  geometry,
}: {
  geometry: THREE.ShapeGeometry;
}) {
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={PLACEHOLDER_COLOR} toneMapped={false} />
    </mesh>
  );
}

interface ProjectPanelTexturedProps {
  geometry: THREE.ShapeGeometry;
  size: [number, number];
  imageUrl: string;
}

function ProjectPanelTextured({
  geometry,
  size,
  imageUrl,
}: ProjectPanelTexturedProps) {
  // drei's useTexture handles cache, lifecycle, and decode under the
  // hood. It throws a Promise while loading — caught by the parent
  // <Suspense> which renders the placeholder until it resolves.
  const texture = useTexture(imageUrl);
  const { invalidate } = useThree();

  // Configure the texture once per (texture, size) tuple. Setting
  // needsUpdate = true on every render would force re-upload every
  // frame; gating in useMemo keeps it to the first paint after load.
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    applyCoverUv(texture, size);
    texture.needsUpdate = true;
  }, [texture, size]);

  // Under frameloop="demand" a Suspense resolution and React mount do
  // NOT trigger a paint on their own. Without this nudge the placeholder
  // would stay on screen until the next pointer event accidentally
  // invalidated the scene. Fires exactly once per resolved texture.
  useEffect(() => {
    invalidate();
  }, [texture, invalidate]);

  return (
    <mesh geometry={geometry}>
      {/* transparent: honour the PNG alpha channel — without it, alpha=0
          pixels render as solid black instead of showing the canvas
          background through. No-op for fully-opaque images. */}
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

interface ProjectPanelProps {
  basePos: [number, number, number];
  size: [number, number];
  geometry: THREE.ShapeGeometry;
  imageUrl: string;
}

function ProjectPanel({
  basePos,
  size,
  geometry,
  imageUrl,
}: ProjectPanelProps) {
  return (
    <ProjectPanelFrame basePos={basePos}>
      <Suspense fallback={<ProjectPanelPlaceholder geometry={geometry} />}>
        <ProjectPanelTextured
          geometry={geometry}
          size={size}
          imageUrl={imageUrl}
        />
      </Suspense>
    </ProjectPanelFrame>
  );
}

function ProjectPanels() {
  return (
    <>
      {PANELS.map((panel, i) => (
        <ProjectPanel
          key={i}
          basePos={panel.basePos}
          size={panel.size}
          geometry={panel.geometry}
          imageUrl={LAB_IMAGES[panel.imageIndex]}
        />
      ))}
    </>
  );
}

function PanCamera() {
  const { camera, gl, invalidate } = useThree();
  const stateRef = useRef({
    tx: 0,
    ty: 0,
    vx: 0,
    vy: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    const el = gl.domElement;
    const s = stateRef.current;

    const onDown = (e: PointerEvent) => {
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.vx = 0;
      s.vy = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
      // Demand-mode: kick the per-frame loop alive so useFrame starts
      // running again. After this, useFrame self-invalidates while
      // dragging is true.
      invalidate();
    };

    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      const worldPerPixel =
        1 / (camera as THREE.OrthographicCamera).zoom;
      const worldDx = dx * worldPerPixel;
      const worldDy = dy * worldPerPixel;
      s.tx -= worldDx;
      s.ty += worldDy;
      s.vx = -worldDx;
      s.vy = worldDy;
      // Pointer events fire faster than the renderer in demand mode;
      // invalidate so the latest pointer delta paints on the next
      // frame even if useFrame had already gone idle.
      invalidate();
    };

    const onUp = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture already released
      }
      el.style.cursor = "grab";
      // Last move's vx/vy now drive inertia + the camera lerp still
      // has settling to do — both are checked inside useFrame, which
      // self-invalidates as long as either has work left.
      invalidate();
    };

    el.style.cursor = "grab";
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onUp);

    // Initial paint — R3F's demand mode does an automatic first render
    // on mount, but invalidating here is cheap insurance against any
    // ordering race with Suspense fallbacks resolving before us.
    invalidate();

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onUp);
    };
  }, [camera, gl, invalidate]);

  useFrame(() => {
    const s = stateRef.current;
    if (!s.dragging) {
      s.tx += s.vx;
      s.ty += s.vy;
      s.vx *= 0.92;
      s.vy *= 0.92;
      if (Math.abs(s.vx) < 0.0001) s.vx = 0;
      if (Math.abs(s.vy) < 0.0001) s.vy = 0;
    }
    camera.position.x += (s.tx - camera.position.x) * 0.2;
    camera.position.y += (s.ty - camera.position.y) * 0.2;

    // Demand-mode keep-alive — request the next frame only when work
    // is still happening:
    //   • dragging:        user might move pointer between frames
    //   • inertia alive:   vx/vy non-zero (existing snap-to-0 below
    //                      0.0001 kills the loop cleanly)
    //   • lerp residue:    camera has not yet caught up to the target
    // Once all three are quiet, we stop invalidating and the GPU goes
    // idle until the next pointerdown.
    const needsFrame =
      s.dragging ||
      s.vx !== 0 ||
      s.vy !== 0 ||
      Math.abs(s.tx - camera.position.x) > 0.001 ||
      Math.abs(s.ty - camera.position.y) > 0.001;
    if (needsFrame) invalidate();
  });

  return null;
}

// Tracks viewport width and returns the orthographic zoom for the
// current breakpoint. DOM-level (reads window), so it's called from
// <LabScene> outside the Canvas. The lazy initial read avoids a
// first-paint flash at the desktop zoom on mobile — safe because
// <LabScene> only renders the Canvas after `mounted` (client-only).
function useViewportZoom() {
  const [zoom, setZoom] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= MOBILE_MAX_WIDTH
      ? MOBILE_ZOOM
      : DESKTOP_ZOOM,
  );
  useEffect(() => {
    const update = () => {
      setZoom(
        window.innerWidth <= MOBILE_MAX_WIDTH ? MOBILE_ZOOM : DESKTOP_ZOOM,
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return zoom;
}

// Pushes a zoom change onto the live orthographic camera. The Canvas
// `camera` prop only seeds the initial camera, so breakpoint crossings
// are applied here imperatively: set zoom → recompute the projection →
// invalidate() to force one paint under frameloop="demand". (PanCamera's
// drag math reads camera.zoom directly, so pan sensitivity stays correct
// at the new zoom with no extra wiring.)
function CameraZoom({ zoom }: { zoom: number }) {
  const { camera, invalidate } = useThree();
  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom = zoom;
    cam.updateProjectionMatrix();
    invalidate();
  }, [zoom, camera, invalidate]);
  return null;
}

function LabSceneContents() {
  return (
    <>
      {/* No global Suspense — each ProjectPanel has its own boundary,
          so a slow image only suspends one panel and the camera +
          unaffected panels keep rendering. */}
      <ProjectPanels />
      <PanCamera />
    </>
  );
}

export default function LabScene() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const zoom = useViewportZoom();

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-0 bg-[var(--color-neutral-10)]" />
    );
  }

  return (
    <div className="lab-scene-root fixed inset-0 z-0 select-none bg-[var(--color-neutral-10)]">
      <div className="lab-bg-text-wrap" aria-hidden="true">
        <span className="lab-bg-text">LAB</span>
      </div>
      <Canvas
        orthographic
        // CAMERA_CONFIG seeds the camera; the breakpoint-aware `zoom` is
        // spread last so it wins on first paint. Runtime breakpoint
        // crossings are applied by <CameraZoom> (the prop is initial-only).
        camera={{ ...CAMERA_CONFIG, zoom }}
        dpr={DPR}
        gl={GL_CONFIG}
        // demand mode: only renders when invalidate() is called.
        // PanCamera self-invalidates while drag/inertia/lerp is alive,
        // and ProjectPanelTextured invalidates once when its texture
        // resolves. When everything settles the GPU goes idle —
        // dramatically lower power use on a static page.
        frameloop="demand"
        style={{ position: "absolute", inset: 0 }}
      >
        <CameraZoom zoom={zoom} />
        <LabSceneContents />
      </Canvas>
    </div>
  );
}
