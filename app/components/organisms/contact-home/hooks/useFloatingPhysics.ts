"use client";

import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";

// Continuous micro-noise (per frame, normalized to 60fps).
const NOISE_X = 0.004;
const NOISE_Y = 0.004;
const NOISE_TORQUE = 0.0005;

// Soft spring pulling each body toward its home X (inactive when
// homePositionX is not provided).
const SPRING_K = 0.15;
const SPRING_SOFT_MAX = 3;
const SPRING_SETTLE_SPEED = 3;

// Min-speed safety boost — every few seconds, if a body has fallen
// below the threshold, inject a random-direction impulse so motion
// stays lively instead of trending toward stillness.
const MIN_SPEED_THRESHOLD = 1.0;
const MIN_SPEED_BOOST = 1.1;
export const BOOST_MIN_INTERVAL = 1.2;
export const BOOST_MAX_INTERVAL = 2.5;

// Hard velocity cap — prevents accumulated impulses/bounces from
// compounding into chaotic motion while letting steady-state feel lively.
const MAX_SPEED = 5.0;
const MAX_ANG_SPEED = 4.0;

// Stuck-prevention (mobile only). EJECT_BUFFER lifts a relocated body
// far enough above the safe line that it doesn't immediately re-trip.
// SOFT_GUARD_BAND is the slim region just above the safe line where a
// near-stationary body gets a gentle upward nudge instead of being
// teleported.
const STUCK_EJECT_BUFFER = 0.4;
const STUCK_SOFT_GUARD_BAND = 0.6;
const STUCK_LOW_SPEED = 0.35;
const STUCK_NUDGE_IMPULSE_Y = 1.4;
const STUCK_EJECT_VEL_Y = 2.0;

export interface UseFloatingPhysicsParams {
  bodyRef: RefObject<RapierRigidBody | null>;
  /** Decremented every frame; reset to HOVER_COOLDOWN by the hover handler. */
  hoverCooldownRef: RefObject<number>;
  /** Countdown to the next min-speed boost check; reseeded after each fire. */
  boostTimerRef: RefObject<number>;
  homePositionX?: number;
  mass: number;
  /** Toolbar's top edge in world Y; below this is "trapped under the toolbar". */
  safeBottomYRef?: { current: number };
}

/**
 * Per-frame physics for a floating Contact-section body: micro-drift,
 * optional soft spring, randomized min-speed boost, hard velocity caps,
 * and stuck-prevention against the toolbar collider (now active on
 * both breakpoints — see comment on the safeBottomYRef branch below).
 */
export function useFloatingPhysics({
  bodyRef,
  hoverCooldownRef,
  boostTimerRef,
  homePositionX,
  mass,
  safeBottomYRef,
}: UseFloatingPhysicsParams) {
  useFrame((_, delta) => {
    const body = bodyRef.current;
    if (!body) return;

    hoverCooldownRef.current = Math.max(0, hoverCooldownRef.current - delta);

    // Normalize per-frame impulses so the effect is consistent across
    // variable frame rates.
    const dt60 = Math.min(delta * 60, 2);

    // Continuous micro-drift — very small random walk, bounded by damping.
    body.applyImpulse(
      {
        x: (Math.random() - 0.5) * NOISE_X * dt60,
        y: (Math.random() - 0.5) * NOISE_Y * dt60,
        z: 0,
      },
      true,
    );
    body.applyTorqueImpulse(
      { x: 0, y: (Math.random() - 0.5) * NOISE_TORQUE * dt60, z: 0 },
      true,
    );

    const v = body.linvel();
    const speed = Math.hypot(v.x, v.y, v.z);

    // Soft spring toward home X — only active if homePositionX is provided
    // (bouncing-playground mode leaves this off).
    if (speed < SPRING_SETTLE_SPEED && homePositionX !== undefined) {
      const pos = body.translation();
      const dx = pos.x - homePositionX;
      const absDx = Math.abs(dx);
      let k = SPRING_K;
      if (absDx > SPRING_SOFT_MAX) {
        k *= 1 + (absDx - SPRING_SOFT_MAX) * 0.6;
      }
      body.applyImpulse({ x: -dx * k * delta * mass, y: 0, z: 0 }, true);
    }

    // Min-speed safety boost — checked on a randomized interval so boosts
    // don't sync across bodies. Guarantees perpetual low-energy motion
    // even after many lossy collisions.
    boostTimerRef.current -= delta;
    if (boostTimerRef.current <= 0) {
      if (speed < MIN_SPEED_THRESHOLD) {
        const angle = Math.random() * Math.PI * 2;
        body.applyImpulse(
          {
            x: Math.cos(angle) * MIN_SPEED_BOOST,
            y: Math.sin(angle) * MIN_SPEED_BOOST,
            z: 0,
          },
          true,
        );
      }
      boostTimerRef.current =
        BOOST_MIN_INTERVAL +
        Math.random() * (BOOST_MAX_INTERVAL - BOOST_MIN_INTERVAL);
    }

    // Hard clamp linear + angular speed. Applied after all forces so
    // collisions, boosts, and hover impulses can't compound into chaotic
    // motion. Caps also prevent a single stacked collision from flinging
    // an object out of the perceived "lively but controlled" band.
    const v2 = body.linvel();
    const s2 = Math.hypot(v2.x, v2.y, v2.z);
    if (s2 > MAX_SPEED) {
      const k = MAX_SPEED / s2;
      body.setLinvel({ x: v2.x * k, y: v2.y * k, z: v2.z * k }, true);
    }
    const a = body.angvel();
    const as = Math.hypot(a.x, a.y, a.z);
    if (as > MAX_ANG_SPEED) {
      const k = MAX_ANG_SPEED / as;
      body.setAngvel({ x: a.x * k, y: a.y * k, z: a.z * k }, true);
    }

    // Stuck-prevention: keep bodies clear of the toolbar area.
    // safeBottomY is the toolbar collider's top edge in world Y, which
    // is also where SceneContents pins the dynamic floor wall. Runs on
    // both desktop and mobile now (previously gated to mobile only) so
    // any body that somehow ends up below the safe line — fast tunnel
    // through the wall, spawn misfire, etc. — gets ejected back above
    // it. With the wall in place this should fire rarely; it's a
    // safety net rather than the primary mechanism. Two paths:
    //   - hard eject: body sank below the safe line — relocate above
    //     it and replace velocity upward.
    //   - soft nudge: body is just above the safe line with very low
    //     speed — risk of pinning against the collider. Gentle upward
    //     impulse without teleporting.
    if (safeBottomYRef) {
      const safeY = safeBottomYRef.current;
      if (Number.isFinite(safeY)) {
        const pos = body.translation();
        if (pos.y < safeY) {
          body.setTranslation(
            { x: pos.x, y: safeY + STUCK_EJECT_BUFFER, z: pos.z },
            true,
          );
          body.setLinvel(
            {
              x: (Math.random() - 0.5) * 1.5,
              y: STUCK_EJECT_VEL_Y,
              z: 0,
            },
            true,
          );
        } else if (pos.y < safeY + STUCK_SOFT_GUARD_BAND) {
          const v3 = body.linvel();
          const s3 = Math.hypot(v3.x, v3.y, 0);
          if (s3 < STUCK_LOW_SPEED) {
            body.applyImpulse(
              {
                x: (Math.random() - 0.5) * 1.0,
                y: STUCK_NUDGE_IMPULSE_Y,
                z: 0,
              },
              true,
            );
          }
        }
      }
    }
  });
}
