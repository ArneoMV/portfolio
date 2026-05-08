import * as THREE from "three";

// Pad half-extents so settled colliders touching leave a ~10px visual
// gap between meshes (0.05 pad per side → 0.1 world units gap ≈ 10px
// at the current camera setup). The minimum half-extent guards against
// degenerate axes producing zero-thickness colliders.
const COLLIDER_PAD = 0.05;
const COLLIDER_MIN_HALF_EXTENT = 0.1;

export interface NormalizedModel {
  modelScene: THREE.Object3D;
  halfExtents: [number, number, number];
}

/**
 * Clone the source scene, scale its longest axis to `targetSize`, recenter
 * the scaled AABB on the origin, and return matching cuboid collider
 * half-extents (with a small visual-gap pad). The returned `modelScene`
 * is a fresh clone safe to mount under a single `<primitive>`.
 */
export function normalizeModelToTargetSize(
  sourceScene: THREE.Object3D,
  targetSize: number,
): NormalizedModel {
  const cloned = sourceScene.clone(true);
  cloned.updateMatrixWorld(true);

  const rawBox = new THREE.Box3().setFromObject(cloned);
  const rawSize = rawBox.getSize(new THREE.Vector3());
  const rawMax = Math.max(rawSize.x, rawSize.y, rawSize.z);
  const scale = rawMax > 0 ? targetSize / rawMax : 1;

  cloned.scale.setScalar(scale);
  cloned.updateMatrixWorld(true);

  const scaledBox = new THREE.Box3().setFromObject(cloned);
  const center = scaledBox.getCenter(new THREE.Vector3());
  const size = scaledBox.getSize(new THREE.Vector3());
  cloned.position.set(-center.x, -center.y, -center.z);

  return {
    modelScene: cloned,
    halfExtents: [
      Math.max(size.x / 2 + COLLIDER_PAD, COLLIDER_MIN_HALF_EXTENT),
      Math.max(size.y / 2 + COLLIDER_PAD, COLLIDER_MIN_HALF_EXTENT),
      Math.max(size.z / 2 + COLLIDER_PAD, COLLIDER_MIN_HALF_EXTENT),
    ],
  };
}
