import * as THREE from "three";

// Detection thresholds for "white-ish neutral" base colors. Loose
// enough to catch light off-whites and pale greys (which still read as
// blown-out on a dark background), tight enough to leave saturated
// pinks, greens, blues, etc. alone — those have chroma well above 0.18.
const LUMA_THRESHOLD = 0.6;
const CHROMA_THRESHOLD = 0.18;

// Soft neutral grey replacing detected white-neutral base colors. Chosen
// to read as a stable mid-tone on the dark Contact background without
// turning whites into dingy greys.
const NORMALIZED_GREY_HEX = 0xbfc3c7;

function isWhiteishNeutral(color: THREE.Color): boolean {
  const luma = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  if (luma < LUMA_THRESHOLD) return false;
  const chroma =
    Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b);
  return chroma < CHROMA_THRESHOLD;
}

// View over the cross-section of MeshStandardMaterial / MeshPhysicalMaterial
// / MeshPhongMaterial / MeshLambertMaterial that this conversion needs.
// All four expose `color` and `map` with the same semantics.
interface SourceMaterialView {
  color?: THREE.Color;
  map?: THREE.Texture | null;
}

function buildBasicReplacement(
  old: THREE.Material,
  forceColor?: string | number,
): THREE.MeshBasicMaterial {
  const view = old as unknown as SourceMaterialView;

  const color = new THREE.Color();
  if (forceColor !== undefined) {
    color.set(forceColor as THREE.ColorRepresentation);
  } else if (view.color && isWhiteishNeutral(view.color)) {
    color.setHex(NORMALIZED_GREY_HEX);
  } else if (view.color) {
    color.copy(view.color);
  } else {
    color.setHex(0xffffff);
  }

  const map = view.map ?? null;
  // GLTFLoader already sets baseColorTexture to SRGBColorSpace, but set
  // it defensively so OBJ-loaded meshes or oddly authored GLBs render
  // their map at the right gamma.
  if (map) map.colorSpace = THREE.SRGBColorSpace;

  return new THREE.MeshBasicMaterial({
    color,
    map,
    // Skip the tone-mapping curve so the rendered color is exactly the
    // authored color (post outputColorSpace encoding only). Combined
    // with MeshBasicMaterial's lack of N·L shading, this keeps the
    // surface visually constant under any rotation or position.
    toneMapped: false,
  });
}

export interface ConvertToBasicOptions {
  /** Force every mesh's base color to this value, ignoring authored color
   *  detection. Used for OBJ models that ship without authored materials,
   *  so each asset can be tinted to its own per-asset color. */
  forceColor?: string | number;
}

/**
 * Walk `root` and replace every Mesh's material with a stable
 * MeshBasicMaterial. Authored colors and base color maps are preserved;
 * near-white neutrals are remapped to a soft grey so they don't read as
 * blown-out on a dark background. MeshBasicMaterial ignores all lights
 * and reflections, so each fragment renders a constant color × map and
 * the surface stays visually stable as the body rotates.
 *
 * `root` should be a per-instance clone — replacement writes a new
 * material reference on each cloned mesh so each floating body owns its
 * own MeshBasicMaterial instances.
 */
export function convertMeshesToBasic(
  root: THREE.Object3D,
  options?: ConvertToBasicOptions,
): void {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((m) =>
        buildBasicReplacement(m, options?.forceColor),
      );
    } else if (mesh.material) {
      mesh.material = buildBasicReplacement(mesh.material, options?.forceColor);
    }
  });
}
