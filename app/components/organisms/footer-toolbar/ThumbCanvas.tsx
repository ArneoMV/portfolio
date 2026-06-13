"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { normalizeModelToTargetSize } from "@/app/components/organisms/contact-home/utils/geometry";
import { convertMeshesToBasic } from "@/app/components/organisms/contact-home/utils/materials";

/* =====================================================================
   ThumbCanvas

   ONE plain <Canvas> per .footer-menu-thumb (48x48). Renders a single
   GLB model with a two-stage micro-interaction:

     - IDLE: a subtle vertical bob while the menu is open. Each thumb
       carries a per-asset phase offset (hashed from modelUrl) so the
       four icons drift out of sync rather than bobbing together.
     - HOVER (`active` prop true): a smoothly-eased intensity ramp
       boosts the float amplitude and ADDS a gentle Y/Z wobble. When
       hover leaves, intensity eases back to 0 and the wobble fades
       to nothing — the bob never fully stops, the wobble does.

   Motion is animated entirely inside the scene with `useFrame` (NOT
   via CSS transform on the canvas element — CSS transforms on a
   WebGL canvas can corrupt the drawing buffer). The base rest pose
   is `rotation={[0, 0, 0]}` (front-facing); the useFrame writes
   on top of that every frame and returns to rest when motion is
   disabled.

   ── Reduced motion ──
   `prefers-reduced-motion: reduce` fully disables the animation and
   pins the model to rest. The matchMedia listener is wired in an
   effect (SSR-safe) and listens for live changes via `addEventListener`.

   ── Render loop ──
   Canvas `frameloop` is left at the default (`"always"`) so useFrame
   ticks every frame while mounted. Canvases are gated by `isOpen` in
   the parent, so the render loop only runs while the menu is open
   anyway.

   ── Material pipeline ──
   `convertMeshesToBasic(modelScene)` runs without `forceColor` so the
   GLB's authored colours/textures pass through — same as how
   ContactScene handles its GLBs. Lights are kept for rig consistency
   but have no visual effect on MeshBasicMaterial.
===================================================================== */

// Target longest-axis world size for the cloned model. Camera at z=1.5
// with FOV 45° gives a visible height of ~1.24 at z=0, so 1.0 fills
// ~80% of the rendered square.
const TARGET_SIZE = 1.0;

// ── Motion tuning ──
// Amplitudes are in world units / radians; speeds are in radians/sec
// driving Math.sin against state.clock.elapsedTime.
const IDLE_AMP = 0.04; // base vertical bob — barely there
const IDLE_SPEED = 1.5; // ≈ 4.2 s period
const HOVER_AMP_BOOST = 0.6; // float amp scales to 1 + 0.6 = 1.6× at full hover
const WOBBLE_AMP_Y = 0.15; // ≈ 8.6° peak sway on Y at full hover
const WOBBLE_AMP_Z = 0.08; // ≈ 4.6° peak sway on Z at full hover
const WOBBLE_SPEED = 3.0; // faster than the idle bob for variety
// Ease constant for the hover intensity ramp: higher = snappier.
// Intensity per frame: lerp toward target by min(1, delta * EASE).
const HOVER_EASE = 8;

// Module-level preload — all four GLBs the toolbar can render. Runs
// only on the client (useGLTF.preload kicks off fetch + GLTF parse,
// no-op on the server). picture.glb and test_tube.glb are also
// preloaded by ContactScene; the GLTF cache is keyed by URL so the
// duplicate calls are harmless.
const ALL_THUMB_MODELS = [
  "/images/home/house.glb",
  "/images/home/test_tube.glb",
  "/images/home/picture.glb",
  "/images/home/calendar.glb",
];

if (typeof window !== "undefined") {
  ALL_THUMB_MODELS.forEach((u) => {
    useGLTF.preload(u);
  });
}

/**
 * Deterministic per-URL phase offset in [0, 2π). Lets each thumb
 * start its sine wave from a different point so the 4 icons never
 * land on the same bob phase.
 */
function phaseFromUrl(url: string): number {
  let h = 0;
  for (let i = 0; i < url.length; i++) {
    // Standard string hash — overflow is fine, we mod down below.
    h = (h * 31 + url.charCodeAt(i)) | 0;
  }
  // Map signed 32-bit int → [0, 2π).
  return ((Math.abs(h) % 1000) / 1000) * Math.PI * 2;
}

interface ThumbCanvasProps {
  modelUrl: string;
  /** True while the parent .footer-menu-item is hovered. Drives the
   *  hover boost ramp. Tap-only environments (touch) just keep this
   *  false; the idle bob still plays. */
  active: boolean;
}

/**
 * Inner model component. Lives inside <Suspense> so useGLTF can
 * suspend during the GLB fetch on the very first menu-open, and
 * inside the <Canvas> so `useFrame` is available.
 */
function ThumbModel({ modelUrl, active }: ThumbCanvasProps) {
  const { scene } = useGLTF(modelUrl);

  // normalizeModelToTargetSize returns { modelScene, halfExtents };
  // modelScene is a fresh clone safe to mutate downstream.
  // convertMeshesToBasic MUTATES the passed root in place. No
  // forceColor — authored materials pass through.
  const modelScene = useMemo(() => {
    const { modelScene } = normalizeModelToTargetSize(scene, TARGET_SIZE);
    convertMeshesToBasic(modelScene);
    return modelScene;
  }, [scene]);

  const groupRef = useRef<THREE.Group>(null);
  // Smoothly-eased "how active is hover" value. Lives in a ref so
  // we don't drive React renders from useFrame.
  const intensityRef = useRef(0);
  const phase = useMemo(() => phaseFromUrl(modelUrl), [modelUrl]);

  // ── prefers-reduced-motion ─────────────────────────────────────
  // Read once on mount + subscribe for changes. SSR-safe: the
  // initial render returns false (no motion suppression) and the
  // effect runs only on the client.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    if (reducedMotion) {
      // Snap to rest and skip the animation entirely.
      g.position.y = 0;
      g.rotation.y = 0;
      g.rotation.z = 0;
      return;
    }

    // Ease intensity toward (active ? 1 : 0). delta-scaled so the
    // ramp feels the same at 60fps and 120fps.
    const target = active ? 1 : 0;
    intensityRef.current +=
      (target - intensityRef.current) * Math.min(1, delta * HOVER_EASE);
    const i = intensityRef.current;

    const t = state.clock.elapsedTime;

    // Idle bob — always present; amplitude grows with hover.
    const floatAmp = IDLE_AMP * (1 + HOVER_AMP_BOOST * i);
    g.position.y = Math.sin(t * IDLE_SPEED + phase) * floatAmp;

    // Wobble — only contributes when intensity > 0. Z is slower
    // and smaller for a "sway, not spin" feel.
    g.rotation.y = Math.sin(t * WOBBLE_SPEED + phase) * WOBBLE_AMP_Y * i;
    g.rotation.z =
      Math.sin(t * WOBBLE_SPEED * 0.7 + phase) * WOBBLE_AMP_Z * i;
  });

  // Base rest pose is rotation [0,0,0] / position [0,0,0]; useFrame
  // writes the animated values on top each frame.
  return (
    <group ref={groupRef}>
      <primitive object={modelScene} />
    </group>
  );
}

export default function ThumbCanvas({ modelUrl, active }: ThumbCanvasProps) {
  return (
    <Canvas
      // Width/height 100% fills the 48x48 .footer-menu-thumb parent.
      // pointer-events: none keeps the underlying <Link>/<a> clickable
      // — hover is detected on the DOM row in FooterToolbar, not on
      // the canvas itself.
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 1.5], fov: 45, near: 0.1, far: 100 }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
        toneMapping: THREE.NeutralToneMapping,
        toneMappingExposure: 1.0,
      }}
    >
      {/* Same flat-lit rig as ContactScene. MeshBasicMaterial ignores
          lights so this is consistency-of-rig only; safe to keep
          even though it has no visual effect. */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[6, 8, 6]} intensity={0.4} />

      <Suspense fallback={null}>
        <ThumbModel modelUrl={modelUrl} active={active} />
      </Suspense>
    </Canvas>
  );
}
