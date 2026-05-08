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
  "/images/lab/lab-image-01.webp",
  "/images/lab/lab-image-02.webp",
  "/images/lab/lab-image-03.webp",
  "/images/lab/lab-image-04.webp",
  "/images/lab/lab-image-05.webp",
  "/images/lab/lab-image-06.webp",
  "/images/lab/lab-image-07.webp",
  "/images/lab/lab-image-08.webp",
  "/images/lab/lab-image-09.webp",
  "/images/lab/lab-image-10.webp",
  "/images/lab/lab-image-11.webp",
  "/images/lab/lab-image-12.webp",
  "/images/lab/lab-image-13.webp",
  "/images/lab/lab-image-14.webp",
  "/images/lab/lab-image-15.webp",
  "/images/lab/lab-image-16.webp",
  "/images/lab/lab-image-17.webp",
  "/images/lab/lab-image-18.webp",
  "/images/lab/lab-image-19.webp",
  "/images/lab/lab-image-20.webp",
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
const PERIOD_Y = 36;

const PANELS: PanelDef[] = [
  definePanel([-19.2, 13.2, 0], [4.8, 4.0], 0),
  definePanel([-9.6, 14.4, 0], [4.2, 5.4], 1),
  definePanel([0, 13.2, 0], [5.4, 4.2], 2),
  definePanel([9.6, 13.8, 0], [4.0, 5.2], 3),
  definePanel([19.2, 13.2, 0], [4.8, 4.2], 4),

  definePanel([-16.8, 4.8, 0], [4.4, 5.2], 5),
  definePanel([-7.2, 6.0, 0], [5.2, 4.0], 6),
  definePanel([2.4, 4.8, 0], [4.0, 5.4], 7),
  definePanel([12.0, 6.0, 0], [5.4, 4.2], 8),
  definePanel([21.6, 4.8, 0], [4.2, 4.8], 9),

  definePanel([-21.6, -3.6, 0], [5.0, 4.0], 10),
  definePanel([-12.0, -4.8, 0], [4.2, 5.2], 11),
  definePanel([-2.4, -3.6, 0], [5.4, 4.4], 12),
  definePanel([7.2, -4.8, 0], [4.0, 5.4], 13),
  definePanel([16.8, -3.6, 0], [4.8, 4.0], 14),

  definePanel([-19.2, -12.0, 0], [4.4, 5.2], 15),
  definePanel([-9.6, -13.2, 0], [5.4, 4.2], 16),
  definePanel([0, -12.0, 0], [4.2, 5.4], 17),
  definePanel([9.6, -13.2, 0], [5.0, 4.2], 18),
  definePanel([19.2, -12.0, 0], [4.4, 5.0], 19),
];

const CAMERA_CONFIG = {
  position: [0, 0, 100] as [number, number, number],
  zoom: 50,
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
      <meshBasicMaterial map={texture} toneMapped={false} />
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
        camera={CAMERA_CONFIG}
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
        <LabSceneContents />
      </Canvas>
    </div>
  );
}
