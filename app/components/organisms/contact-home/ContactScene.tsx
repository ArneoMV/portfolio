"use client";

/* eslint-disable react-hooks/immutability */
// R3F/Three idioms write directly into objects produced by useThree
// (scene.environment, gl.domElement.style.cursor). The hooks-immutability
// rule does not apply to imperative scene/renderer mutation.

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import FloatingObject from "./FloatingObject";
import ToolbarCollider from "./ToolbarCollider";
import { useContactPanel } from "@/app/components/organisms/site-shell/contact-panel-context";

// Half-height of the dynamic floor's CuboidCollider (matches the
// other playground walls). Centre Y = (target top edge) - this value,
// so the wall's top face lands exactly at the requested Y.
const FLOOR_HALF_HEIGHT = 0.3;

interface DynamicFloorProps {
  /** Toolbar's top edge in world Y (or -Infinity before measurement). */
  safeBottomYRef: { current: number };
  /** Used until `safeBottomYRef` becomes finite — keeps the playground
   *  sealed even before ToolbarCollider's first useFrame. */
  fallbackY: number;
}

/**
 * Floor wall whose Y position follows the toolbar's top edge every
 * frame. Replaces the static canvas-bottom floor — that one left a
 * gap between the canvas bottom and the toolbar where objects could
 * sit "under" the toolbar. With this dynamic wall, objects collide
 * with the floor at the toolbar's top edge instead and never enter
 * that dead zone.
 */
function DynamicFloor({ safeBottomYRef, fallbackY }: DynamicFloorProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(() => {
    if (!ref.current) return;
    const safe = safeBottomYRef.current;
    const top = Number.isFinite(safe) ? safe : fallbackY;
    // Body centre = (desired top face Y) - half-height, so the
    // collider's TOP face sits exactly at `top`.
    ref.current.setTranslation({ x: 0, y: top - FLOOR_HALF_HEIGHT, z: 0 }, true);
  });

  return (
    <RigidBody
      ref={ref}
      type="fixed"
      colliders={false}
      friction={0.1}
      restitution={0.7}
    >
      <CuboidCollider args={[40, FLOOR_HALF_HEIGHT, 10]} />
    </RigidBody>
  );
}

// Target visual height of each 3D object on mobile, in CSS pixels.
// Converted to world units at runtime via the canvas pixel/world ratio
// so the on-screen size stays close to this value across mobile sizes.
const MOBILE_TARGET_PX = 200;

// Single multiplier applied to every asset's `targetSize` (and to the
// mobile target) so the whole set can be scaled down together. The
// Contact section now sits inside the 1100px rail container, so every
// object renders at 50% of its previous world-unit size — both the
// visible mesh and the matching CuboidCollider come from
// normalizeModelToTargetSize, which means halving targetSize halves
// the collider too. Visual ↔ collider stay in sync automatically.
const CONTACT_OBJECT_SCALE = 0.5;

// Flip to true to render Rapier's collider wireframes (floor/ceiling/
// walls, toolbar, and per-object boxes). Useful for verifying that the
// MenuToolbar collider is aligned with its DOM rect.
const DEBUG_PHYSICS = false;

// ── Asset manifest ──
// Each object enters from just below the ceiling collider with a
// gentle downward initial velocity, then drifts through the
// zero-gravity playground bouncing off the four walls + ToolbarCollider
// indefinitely. The previous up-from-floor entrance routinely placed
// bodies inside the MenuToolbar's safe-bottom zone on mobile, causing
// some objects to spawn already trapped under the toolbar. Top-spawn
// keeps every body well above that zone at mount time.
//
// spawnDelay is a per-asset stagger offset (ms) applied after the
// scene receives its top-level `spawned` signal. Choreographed — not
// random — so entrance order is reproducible and tuneable. yRot is
// the initial Y-axis rotation (radians); only Y is free since
// enabledRotations locks X/Z. The per-asset spread on spawnYBelowCeiling
// + ivy + ivx keeps the entrance feeling scattered rather than a
// synchronised line falling from the top.
const ASSETS = [
  {
    id: "work",
    label: "Work",
    assetUrl: "/images/home/picture.glb",
    tint: "#f0a896",
    targetSize: 2.4,
    /** World units below the ceiling collider where this body
     *  spawns. Smaller values = closer to the very top of the scene.
     *  Replaces the old `spawnYAboveFloor` (which placed bodies near
     *  the bottom and inside the mobile toolbar trap zone). */
    spawnYBelowCeiling: 0.8,
    xFrac: -0.78,
    z: 0,
    mass: 0.45,
    linearDamping: 0.025,
    ivx: 0.45,
    /** Negative ivy = downward initial push so objects "drop" into
     *  view from the top rather than rising from the floor. Magnitudes
     *  are slightly reduced from the previous upward burst (~17%) so
     *  the entrance reads as drifting rather than heavy falling. */
    ivy: -4.8,
    ivry: 0.25,
    yRot: 0.3,
    spawnDelay: 0,
  },
  // Lab 3D object hidden during job-search positioning. Restore by uncommenting.
  // {
  //   id: "lab",
  //   label: "Lab",
  //   assetUrl: "/images/home/test_tube.glb",
  //   tint: "#9ae0a8",
  //   targetSize: 2.4,
  //   spawnYBelowCeiling: 1.0,
  //   xFrac: -0.52,
  //   z: 0.04,
  //   mass: 0.52,
  //   linearDamping: 0.035,
  //   ivx: -0.9,
  //   ivy: -3.5,
  //   ivry: -0.32,
  //   yRot: -0.2,
  //   spawnDelay: 360,
  // },
  {
    id: "contact",
    label: "Contact",
    assetUrl: "/images/home/message.glb",
    tint: "#d8ec8a",
    targetSize: 2.4,
    spawnYBelowCeiling: 0.5,
    xFrac: -0.15,
    z: -0.03,
    mass: 0.48,
    linearDamping: 0.02,
    ivx: 0.38,
    ivy: -4.4,
    ivry: 0.18,
    yRot: 0.9,
    spawnDelay: 520,
  },
  {
    id: "instagram",
    label: "Instagram",
    assetUrl: "/images/home/Instagram-logo.glb",
    tint: "#c7a8e8",
    targetSize: 2.2,
    spawnYBelowCeiling: 1.5,
    xFrac: 0.25,
    z: 0.02,
    mass: 0.55,
    linearDamping: 0.03,
    ivx: -0.42,
    ivy: -2.6,
    ivry: -0.28,
    yRot: -1.1,
    spawnDelay: 180,
  },
  {
    id: "github",
    label: "GitHub",
    assetUrl: "/images/home/Github-logo.glb",
    tint: "#f0a8c0",
    targetSize: 2.2,
    spawnYBelowCeiling: 1.2,
    xFrac: 0.48,
    z: -0.05,
    mass: 0.5,
    linearDamping: 0.025,
    ivx: 0.8,
    ivy: -3.0,
    ivry: 0.3,
    yRot: 0.5,
    spawnDelay: 680,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    assetUrl: "/images/home/Linkedin-logo.glb",
    tint: "#a8c4ec",
    targetSize: 2.2,
    spawnYBelowCeiling: 0.7,
    xFrac: 0.78,
    z: 0.05,
    mass: 0.46,
    linearDamping: 0.02,
    ivx: -0.55,
    ivy: -4.0,
    ivry: -0.22,
    yRot: -0.7,
    spawnDelay: 90,
  },
] as const;

// Preload GLBs only on the client so SSR doesn't try to hit fetch/DOM APIs.
if (typeof window !== "undefined") {
  ASSETS.forEach((a) => {
    if (!("isObj" in a) || !a.isObj) useGLTF.preload(a.assetUrl);
  });
}

// ── Click routing ──

const EXTERNAL_LINKS = {
  instagram: "https://www.instagram.com/arneomv/",
  github: "https://github.com/ArneoMV/",
  linkedin: "https://www.linkedin.com/in/arneomv/",
} as const;

// ── Inner scene (has access to useThree for viewport-aware bounds) ──

interface SceneContentsProps {
  spawned: boolean;
  onSelect: (id: string) => void;
  isMobile: boolean;
}

function SceneContents({ spawned, onSelect, isMobile }: SceneContentsProps) {
  const { viewport, size, gl } = useThree();
  const halfW = viewport.width / 2;
  const halfH = viewport.height / 2;

  // Four walls positioned just outside the viewport edges. Body colliders
  // touching them land with their visible edge exactly at the viewport
  // edge — objects never clip or escape the visible Contact area.
  const ceilingY = halfH + 0.3;
  const floorY = -halfH - 0.3;
  const wallX = halfW + 0.3;

  const safeHalfW = Math.max(halfW - 1.5, 0.5);

  // World-units-per-pixel along the vertical axis — used to translate
  // pixel-based sizing intents (200px target, etc.) into world units
  // for the camera's frustum at z=0.
  const wuPerPx = size.height > 0 ? viewport.height / size.height : 0;

  // Mobile target = 200 CSS px in world units, capped so it can never
  // exceed the desktop target on tiny viewports. Falls back to 2.4
  // (the existing desktop default) if the ratio hasn't resolved yet.
  const mobileTargetSize = useMemo(() => {
    if (!isMobile || wuPerPx <= 0) return null;
    return Math.min(MOBILE_TARGET_PX * wuPerPx, 2.4);
  }, [isMobile, wuPerPx]);

  // Shared write-once-per-frame channel for the toolbar's safe-top Y.
  // ToolbarCollider writes; FloatingObject reads. Default -Infinity =
  // no ejection (desktop default).
  const safeBottomYRef = useRef<number>(-Infinity);

  // Spawn positions:
  //   Anchored to the ceiling collider (same on desktop + mobile) so
  //   every body starts in the top portion of the canvas and drifts
  //   downward into view. The Y is also clamped to a minimum of
  //   `halfH * 0.1` above center so very short canvases can't push
  //   spawn too low. Negative ivy on every asset (see ASSETS) drives
  //   the downward entrance.
  //
  //   The dynamic floor (see <DynamicFloor>) is anchored to the
  //   toolbar's top edge, so the live playground is bounded between
  //   the ceiling and that floor — top-spawn keeps every body well
  //   inside the safe area at mount time.
  const spawnPositions = useMemo<[number, number, number][]>(() => {
    const minY = halfH * 0.1;
    return ASSETS.map((a) => {
      const y = Math.max(ceilingY - a.spawnYBelowCeiling, minY);
      return [a.xFrac * safeHalfW, y, a.z];
    });
  }, [safeHalfW, ceilingY, halfH]);

  // Ref-counted hover state drives the canvas cursor directly. Uses
  // the same custom-cursor URLs as the rest of the site so 3D-object
  // hover feels consistent with HTML hover.
  const [hoverCount, setHoverCount] = useState(0);
  useEffect(() => {
    gl.domElement.style.cursor =
      hoverCount > 0
        ? 'url("/icons/SmoothHand.cur"), pointer'
        : 'url("/icons/SmoothArrow.cur"), auto';
  }, [hoverCount, gl]);
  const onHoverStart = useCallback(() => setHoverCount((c) => c + 1), []);
  const onHoverEnd = useCallback(
    () => setHoverCount((c) => Math.max(0, c - 1)),
    [],
  );

  // Staggered entrance — once `spawned` flips true, schedule each asset
  // to mount at its own offset. Per-index live state lets physics start
  // the moment each body appears, so staggering is baked into the
  // entrance feel rather than post-mount animation.
  const [liveSet, setLiveSet] = useState<Set<number>>(() => new Set());
  useEffect(() => {
    if (!spawned) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    ASSETS.forEach((a, i) => {
      const t = setTimeout(() => {
        setLiveSet((prev) => {
          if (prev.has(i)) return prev;
          const next = new Set(prev);
          next.add(i);
          return next;
        });
      }, a.spawnDelay);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [spawned]);

  return (
    <>
      {/* Static walls — ceiling + left + right. Restitution 0.7 keeps
          bounces lively without feeling rubbery; friction is low so
          glancing collisions don't kill motion. The floor was removed
          from this fixed body and replaced by <DynamicFloor> below,
          which pins itself to the toolbar's top edge so objects can't
          slip into the gap behind / under the MenuToolbar. */}
      <RigidBody
        type="fixed"
        colliders={false}
        friction={0.1}
        restitution={0.7}
      >
        <CuboidCollider position={[0, ceilingY, 0]} args={[40, 0.3, 10]} />
        <CuboidCollider position={[-wallX, 0, 0]} args={[0.3, 40, 10]} />
        <CuboidCollider position={[wallX, 0, 0]} args={[0.3, 40, 10]} />
      </RigidBody>

      {/* Dynamic floor — every frame the body's translation tracks
          `safeBottomYRef` (top edge of the toolbar collider in world Y)
          minus the floor's half-height, so the floor's TOP face lands
          exactly at the toolbar's top edge. Before ToolbarCollider has
          measured (safeBottomYRef = -Infinity), the floor falls back
          to the canvas-bottom Y so the playground is always sealed. */}
      <DynamicFloor safeBottomYRef={safeBottomYRef} fallbackY={floorY} />

      {/* Invisible collider matching the MenuToolbar DOM rect, so floating
          objects bounce off it rather than passing through. */}
      <ToolbarCollider isMobile={isMobile} safeBottomYRef={safeBottomYRef} />

      {ASSETS.map((a, i) =>
        liveSet.has(i) ? (
          <FloatingObject
            key={a.id}
            assetUrl={a.assetUrl}
            isObj={(a as { isObj?: boolean }).isObj ?? false}
            spawnPosition={spawnPositions[i]}
            initialLinearVelocity={[a.ivx, a.ivy, 0]}
            initialAngularVelocity={[0, a.ivry, 0]}
            initialRotation={[0, a.yRot, 0]}
            targetSize={
              (mobileTargetSize ?? a.targetSize) * CONTACT_OBJECT_SCALE
            }
            tint={a.tint}
            label={a.label}
            mass={a.mass}
            linearDamping={a.linearDamping}
            safeBottomYRef={safeBottomYRef}
            onSelect={() => onSelect(a.id)}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
          />
        ) : null,
      )}
    </>
  );
}

// ── Outer Canvas wrapper ──

interface ContactSceneProps {
  /** Flips true once Contact enters the viewport (set by an
   *  IntersectionObserver in ContactSection). Bodies mount only after
   *  this flag is set. */
  spawned: boolean;
}

export default function ContactScene({ spawned }: ContactSceneProps) {
  const router = useRouter();
  // Bridge into SiteShell's TaskSidePanel without prop-drilling through
  // ContactSection / page.tsx — see contact-panel-context.tsx.
  const { openContactPanel } = useContactPanel();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const handleSelect = (id: string) => {
    if (id === "contact") {
      openContactPanel();
      return;
    }
    if (id === "work") {
      router.push("/work");
      return;
    }
    // Lab routing hidden during job-search positioning. Restore by uncommenting.
    // if (id === "lab") {
    //   router.push("/lab");
    //   return;
    // }
    const externalUrl = EXTERNAL_LINKS[id as keyof typeof EXTERNAL_LINKS];
    if (externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    // Unknown id — log for debug but don't crash the scene.
    console.warn(`Unknown contact scene id: ${id}`);
  };

  return (
    <Canvas
      className="contact-scene-canvas"
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.5, 10], fov: 45, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: true,
        // NeutralToneMapping with exposure 1.0 gives a flat, UI-style
        // response: no photographic shoulder, no highlight bloom. With
        // env reflections off and matte materials downstream, this is
        // the simplest curve that still keeps colors faithful.
        toneMapping: THREE.NeutralToneMapping,
        toneMappingExposure: 1.0,
      }}
    >
      {/* Flat-lit rig — no IBL, no fill. Ambient gives the unlit faces
          a base brightness; one soft key directional defines shape and
          casts shadows. Material-level matte settings (envMapIntensity
          0, roughness 0.9, metalness 0) prevent env-specular bloom. */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[6, 8, 6]}
        intensity={0.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />

      <Suspense fallback={null}>
        {/* Zero gravity — it's a bouncing playground, not a falling scene. */}
        <Physics gravity={[0, 0, 0]} debug={DEBUG_PHYSICS}>
          <SceneContents
            spawned={spawned}
            onSelect={handleSelect}
            isMobile={isMobile}
          />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
