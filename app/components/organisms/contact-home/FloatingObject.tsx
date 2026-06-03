"use client";

import { useMemo, useRef } from "react";
import { useLoader, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  CuboidCollider,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

import { convertMeshesToBasic } from "./utils/materials";
import { normalizeModelToTargetSize } from "./utils/geometry";
import {
  BOOST_MIN_INTERVAL,
  BOOST_MAX_INTERVAL,
  useFloatingPhysics,
} from "./hooks/useFloatingPhysics";

export interface FloatingObjectProps {
  assetUrl: string;
  /** Use OBJLoader instead of GLTFLoader. */
  isObj?: boolean;
  /** Spawn position above the frustum. */
  spawnPosition: [number, number, number];
  /** Initial linear velocity at spawn — adds downward push + lateral drift
   *  so objects enter decisively with slight scatter instead of falling
   *  straight down from rest. */
  initialLinearVelocity?: [number, number, number];
  /** Initial angular velocity at spawn — applied on the Y axis only since
   *  X/Z rotation is locked. Produces subtle spin during the entrance. */
  initialAngularVelocity?: [number, number, number];
  /** Initial body rotation (radians). Only the Y component has any
   *  visible effect — X/Z are locked by enabledRotations — but it lets
   *  each object face a slightly different direction on entry. */
  initialRotation?: [number, number, number];
  /** Longest-axis world-space size to normalize the model to. */
  targetSize?: number;
  /** Tint applied via MeshStandardMaterial. Null keeps native materials. */
  tint?: string | null;
  /** Soft spring target X — each body gently drifts toward this column after settling. */
  homePositionX?: number;
  /** Per-body physics variation so objects don't behave identically. */
  mass?: number;
  linearDamping?: number;
  onSelect: () => void;
  /** Parent-managed cursor state — ref-counted so fast hover flicker doesn't reset cursor. */
  onHoverStart: () => void;
  onHoverEnd: () => void;
  label: string;
  /** Shared ref carrying the toolbar's top edge in world Y. Below this
   *  line is "trapped under the toolbar"; the body is ejected upward
   *  on the next frame. -Infinity disables the path. */
  safeBottomYRef?: { current: number };
}

interface FloatingBodyProps extends Omit<FloatingObjectProps, "assetUrl"> {
  sourceScene: THREE.Object3D;
}

function FloatingBody({
  sourceScene,
  spawnPosition,
  initialLinearVelocity,
  initialAngularVelocity,
  initialRotation,
  targetSize = 1.6,
  tint = null,
  homePositionX,
  mass = 0.5,
  linearDamping = 1.0,
  onSelect,
  onHoverStart,
  onHoverEnd,
  label,
  isObj = false,
  safeBottomYRef,
}: FloatingBodyProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  // Retained because `useFloatingPhysics` decrements it every frame
  // (its param interface requires the ref). Nothing sets it >0 anymore
  // — the cursor-flee impulse that used to reset it has been removed —
  // so the decrement is effectively a no-op (Math.max(0, 0 - delta) = 0).
  const hoverCooldownRef = useRef(0);
  const boostTimerRef = useRef(
    BOOST_MIN_INTERVAL +
      // useRef only reads its argument on the first render, so the
      // per-body random seed is computed exactly once and contained.
      // eslint-disable-next-line react-hooks/purity
      Math.random() * (BOOST_MAX_INTERVAL - BOOST_MIN_INTERVAL),
  );

  const { modelScene, halfExtents } = useMemo(
    () => normalizeModelToTargetSize(sourceScene, targetSize),
    [sourceScene, targetSize],
  );

  // Convert every cloned mesh to MeshBasicMaterial so it renders as a
  // stable UI illustration: no Lambert N·L term, no env reflections, no
  // tone-mapped highlight roll-off. Authored base colors and maps pass
  // through; white-ish neutrals are remapped to soft grey. OBJ models
  // (no authored material) are tinted via forceColor so each asset gets
  // its per-asset color.
  useMemo(() => {
    convertMeshesToBasic(
      modelScene,
      isObj && tint ? { forceColor: tint } : undefined,
    );

    modelScene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [modelScene, isObj, tint]);

  useFloatingPhysics({
    bodyRef,
    hoverCooldownRef,
    boostTimerRef,
    homePositionX,
    mass,
    safeBottomYRef,
  });

  // Hover handlers now only drive the canvas cursor style (via
  // onHoverStart / onHoverEnd ref-counts in ContactScene). The previous
  // radial cursor-flee impulse + Y-axis torque were removed so objects
  // stay clickable instead of darting away.
  const handlePointerEnter = () => {
    onHoverStart();
  };

  const handlePointerLeave = () => {
    onHoverEnd();
  };

  // Fire on pointerDown instead of click: bodies drift constantly in the
  // idle physics simulation, and any frame-scale movement between
  // pointerdown and pointerup can break R3F's onClick pairing.
  // pointerDown fires synchronously before the next physics tick moves
  // the hit target out of the cursor's path.
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <RigidBody
      ref={bodyRef}
      position={spawnPosition}
      rotation={initialRotation}
      linearVelocity={initialLinearVelocity}
      angularVelocity={initialAngularVelocity}
      colliders={false}
      mass={mass}
      linearDamping={linearDamping}
      angularDamping={0.8}
      restitution={0.6}
      friction={0.15}
      canSleep={false}
      ccd
      enabledRotations={[false, true, false]}
      enabledTranslations={[true, true, false]}
    >
      <CuboidCollider args={halfExtents} />
      <group
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <primitive object={modelScene} aria-label={label} />
      </group>
    </RigidBody>
  );
}

function GlbFloating({ assetUrl, ...rest }: Omit<FloatingObjectProps, "isObj">) {
  const { scene } = useGLTF(assetUrl);
  return <FloatingBody sourceScene={scene} isObj={false} {...rest} />;
}

function ObjFloating({ assetUrl, ...rest }: Omit<FloatingObjectProps, "isObj">) {
  const obj = useLoader(OBJLoader, assetUrl);
  return <FloatingBody sourceScene={obj} isObj {...rest} />;
}

export default function FloatingObject({ isObj, ...rest }: FloatingObjectProps) {
  return isObj ? <ObjFloating {...rest} /> : <GlbFloating {...rest} />;
}
