"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";

// ToolbarCollider mirrors the MenuToolbar (.footer-toolbar-shell) DOM
// element as an invisible physics body inside the R3F scene so floating
// objects actually bounce off it instead of clipping through.
//
// Sync strategy — re-measures every frame via useFrame (cheap: two
// getBoundingClientRect calls + a few multiplies). A prior observer-based
// approach missed ScrollTrigger pin activation: pinning changes canvas
// POSITION without changing its SIZE, so ResizeObserver never fires.
// Per-frame sampling sidesteps the entire class of "when does the
// canvas/toolbar move?" problems.
//
// Updates split for performance:
//   - position   → imperative body.setTranslation (no React churn).
//   - dimensions → React state, only when half-extents change meaningfully
//     (Rapier CuboidCollider args aren't hot-updatable — remount via key).

interface Dims {
  hw: number;
  hh: number;
}

// Extra clearance added above the toolbar collider on mobile, in CSS pixels.
// Pads the top edge upward so floating bodies can't wedge into the
// 1–2px sliver between the visible toolbar and the collider.
const TOOLBAR_TOP_PAD_PX_MOBILE = 24;

interface ToolbarColliderProps {
  isMobile: boolean;
  /** Shared ref — receives the toolbar collider's top edge in world Y
   *  every frame. FloatingObject reads it for stuck-prevention. */
  safeBottomYRef: { current: number };
}

export default function ToolbarCollider({
  isMobile,
  safeBottomYRef,
}: ToolbarColliderProps) {
  const { viewport, size, gl } = useThree();
  const bodyRef = useRef<RapierRigidBody>(null);
  const lastDimsRef = useRef<Dims | null>(null);
  const [dims, setDims] = useState<Dims | null>(null);

  useFrame(() => {
    const toolbar = document.querySelector<HTMLElement>(
      ".footer-toolbar-shell",
    );
    if (!toolbar) {
      // No toolbar visible — disable ejection by parking the safe line
      // far below where any body could plausibly land.
      safeBottomYRef.current = -Infinity;
      return;
    }

    const t = toolbar.getBoundingClientRect();
    const c = gl.domElement.getBoundingClientRect();
    if (!t.width || !c.width) {
      safeBottomYRef.current = -Infinity;
      return;
    }

    const sx = viewport.width / size.width;
    const sy = viewport.height / size.height;

    const cxPx = t.left + t.width / 2 - (c.left + c.width / 2);
    const cyPx = t.top + t.height / 2 - (c.top + c.height / 2);

    // Mobile-only safety pad — extends the collider's top edge upward
    // by TOOLBAR_TOP_PAD_PX_MOBILE while keeping the bottom anchored
    // to the actual toolbar bottom. Achieved by shifting the center up
    // by half the pad and growing the half-height by the same amount.
    const padPx = isMobile ? TOOLBAR_TOP_PAD_PX_MOBILE : 0;
    const halfPadW = (padPx / 2) * sy;

    const x = cxPx * sx;
    const y = -cyPx * sy + halfPadW;
    const hw = (t.width / 2) * sx;
    const hh = (t.height / 2) * sy + halfPadW;

    if (bodyRef.current) {
      bodyRef.current.setTranslation({ x, y, z: 0 }, true);
    }

    // Publish the collider's TOP edge in world Y. Used as the world Y
    // of the dynamic floor wall in SceneContents AND as the
    // stuck-prevention threshold inside useFloatingPhysics. Published
    // on both desktop and mobile now so the dynamic floor can pin
    // itself to the toolbar top regardless of breakpoint.
    safeBottomYRef.current = y + hh;

    const last = lastDimsRef.current;
    if (
      !last ||
      Math.abs(last.hw - hw) > 0.01 ||
      Math.abs(last.hh - hh) > 0.01
    ) {
      lastDimsRef.current = { hw, hh };
      setDims({ hw, hh });
    }
  });

  if (!dims) return null;

  // Remount the collider only when dimensions meaningfully change.
  const sizeKey = `${Math.round(dims.hw * 100)}-${Math.round(dims.hh * 100)}`;

  return (
    <RigidBody
      ref={bodyRef}
      type="fixed"
      colliders={false}
      friction={0.3}
      restitution={0.3}
    >
      <CuboidCollider key={sizeKey} args={[dims.hw, dims.hh, 10]} />
    </RigidBody>
  );
}
