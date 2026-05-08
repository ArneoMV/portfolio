/**
 * Detects the red marker rectangle in each Work-section background PNG
 * and writes the resulting bounding-box percentages into the
 * AUTO-GENERATED block of `app/components/organisms/work-home/workData.ts`.
 *
 * Run once after dropping new background assets:
 *   npx tsx scripts/detect-red-area.ts
 *
 * Strategy:
 *   1. Threshold the image to a binary red mask (R>230, G<60, B<60).
 *   2. Find every connected red region via 4-connected BFS flood-fill.
 *   3. Pick the region with the largest pixel count. On tie, prefer
 *      the one closest to the image center.
 *   4. Apply sanity checks (size %, aspect ratio, min area %) and
 *      surface mismatches as warnings — values are still written so
 *      the user can inspect the debug overlay and decide.
 *
 * The debug overlay (scripts/debug/<bp>-detected.png) shows the
 * winning region in solid green and every rejected region in a thin
 * dashed red — handy for quickly seeing what got filtered out.
 *
 * Missing source files are skipped (their existing values in
 * workData.ts are preserved).
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

type Breakpoint = "large" | "medium" | "small";

type Rect = {
  top: string;
  left: string;
  width: string;
  height: string;
};

type BBoxPx = { x: number; y: number; w: number; h: number };

const REPO_ROOT = path.resolve(__dirname, "..");

const SOURCES: Record<Breakpoint, string> = {
  large: path.join(REPO_ROOT, "public/images/home/work/Large_-_Work.webp"),
  medium: path.join(REPO_ROOT, "public/images/home/work/Medium_-_Work.webp"),
  small: path.join(REPO_ROOT, "public/images/home/work/Small_-_Work.png"),
};

const WORK_DATA_PATH = path.join(
  REPO_ROOT,
  "app/components/organisms/work-home/workData.ts",
);

const DEBUG_DIR = path.join(REPO_ROOT, "scripts/debug");

// Tight threshold — only saturated pure-red ish pixels qualify. Orange
// or red-orange cables / hardware accents don't pass.
const RED_THRESHOLD = { rMin: 230, gMax: 60, bMax: 60 };

// Sanity-check bounds. width % and height % depend on the canvas
// aspect — same physical screen takes more width % on a tall/narrow
// crop and more height % on a wide/short crop — so they're per-bp.
// Aspect ratio and minimum area are universal because they describe
// the screen itself, not the canvas.
type SanityBounds = {
  widthPct: { min: number; max: number };
  heightPct: { min: number; max: number };
};

const SANITY_PER_BP: Record<Breakpoint, SanityBounds> = {
  // Large (16:9). Observed: w 22.66%, h 31.94%.
  large: {
    widthPct: { min: 0.15, max: 0.3 },
    heightPct: { min: 0.2, max: 0.4 },
  },
  // Medium (~11:10). Observed: w 32.18%, h 25.83%. Lower-bound on
  // height widened from 25 → 20 so the observed 25.83 has comfortable
  // margin instead of clipping the floor.
  medium: {
    widthPct: { min: 0.25, max: 0.45 },
    heightPct: { min: 0.2, max: 0.4 },
  },
  // Small (5:13). Observed: w 57.50%, h 16.76%. Height range widened
  // 15-30 → 12-32 for the same reason.
  small: {
    widthPct: { min: 0.4, max: 0.65 },
    heightPct: { min: 0.12, max: 0.32 },
  },
};

const SANITY_GLOBAL = {
  aspectRatio: { min: 1.0, max: 1.5 },
  // Winning region under this much of image area → loud warning,
  // because the real screen marker is likely missing and the picked
  // winner is just the largest stray.
  minAreaPct: 0.05,
};

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

type Region = {
  pixelCount: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

/**
 * 4-connected BFS flood-fill across a binary mask. Returns one Region
 * per contiguous group of `1`s, with both pixel count and bounding
 * box ready to use.
 */
function findRegions(
  mask: Uint8Array,
  width: number,
  height: number,
): Region[] {
  const visited = new Uint8Array(mask.length);
  const regions: Region[] = [];
  // Single Int32Array reused as the BFS frontier — no per-step alloc.
  // Each slot holds y*width + x (idx into the flat mask).
  const queue = new Int32Array(mask.length);

  for (let startY = 0; startY < height; startY++) {
    for (let startX = 0; startX < width; startX++) {
      const startIdx = startY * width + startX;
      if (mask[startIdx] === 0 || visited[startIdx]) continue;

      visited[startIdx] = 1;
      let head = 0;
      let tail = 0;
      queue[tail++] = startIdx;

      let pixelCount = 0;
      let rMinX = startX;
      let rMaxX = startX;
      let rMinY = startY;
      let rMaxY = startY;

      while (head < tail) {
        const idx = queue[head++];
        const x = idx % width;
        const y = (idx - x) / width;
        pixelCount++;
        if (x < rMinX) rMinX = x;
        if (x > rMaxX) rMaxX = x;
        if (y < rMinY) rMinY = y;
        if (y > rMaxY) rMaxY = y;

        // 4-connected neighbours, inlined to avoid array allocation
        // inside this hot loop.
        if (x + 1 < width) {
          const n = idx + 1;
          if (mask[n] && !visited[n]) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (x > 0) {
          const n = idx - 1;
          if (mask[n] && !visited[n]) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (y + 1 < height) {
          const n = idx + width;
          if (mask[n] && !visited[n]) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (y > 0) {
          const n = idx - width;
          if (mask[n] && !visited[n]) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
      }

      regions.push({
        pixelCount,
        minX: rMinX,
        minY: rMinY,
        maxX: rMaxX,
        maxY: rMaxY,
      });
    }
  }

  return regions;
}

/**
 * Largest region wins. Ties (rare for natural images) are broken by
 * proximity of the region's centre to the image's centre.
 */
function pickWinner(
  regions: Region[],
  width: number,
  height: number,
): Region | null {
  if (regions.length === 0) return null;
  let maxCount = 0;
  for (const r of regions) {
    if (r.pixelCount > maxCount) maxCount = r.pixelCount;
  }
  const tied = regions.filter((r) => r.pixelCount === maxCount);
  if (tied.length === 1) return tied[0];

  const cx = width / 2;
  const cy = height / 2;
  return tied
    .map((r) => {
      const rcx = (r.minX + r.maxX) / 2;
      const rcy = (r.minY + r.maxY) / 2;
      return {
        r,
        dist: (rcx - cx) ** 2 + (rcy - cy) ** 2,
      };
    })
    .sort((a, b) => a.dist - b.dist)[0].r;
}

function regionToBBox(r: Region): BBoxPx {
  return {
    x: r.minX,
    y: r.minY,
    w: r.maxX - r.minX + 1,
    h: r.maxY - r.minY + 1,
  };
}

type Detection = {
  rect: Rect;
  warnings: string[];
  bboxPx: BBoxPx;
  rejectedBboxesPx: BBoxPx[];
  dims: { width: number; height: number };
  regionCount: number;
  winnerPixelCount: number;
};

async function detect(
  file: string,
  bp: Breakpoint,
): Promise<Detection | null> {
  const image = sharp(file);
  const meta = await image.metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`Could not read dimensions for ${file}`);
  }

  const { data, info } = await image
    .raw()
    .toColourspace("srgb")
    .removeAlpha()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Build the binary red mask first; flood-fill works off the mask
  // alone so the per-pixel threshold cost is paid exactly once.
  const mask = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (
        r > RED_THRESHOLD.rMin &&
        g < RED_THRESHOLD.gMax &&
        b < RED_THRESHOLD.bMax
      ) {
        mask[y * width + x] = 1;
      }
    }
  }

  const regions = findRegions(mask, width, height);
  if (regions.length === 0) return null;

  const winner = pickWinner(regions, width, height)!;
  const rejects = regions.filter((r) => r !== winner).map(regionToBBox);

  const winnerBox = regionToBBox(winner);
  const widthPct = winnerBox.w / width;
  const heightPct = winnerBox.h / height;
  const ratio = winnerBox.w / winnerBox.h;
  const winnerAreaPct = winner.pixelCount / (width * height);

  const bounds = SANITY_PER_BP[bp];
  const warnings: string[] = [];
  if (widthPct < bounds.widthPct.min || widthPct > bounds.widthPct.max) {
    warnings.push(
      `width ${(widthPct * 100).toFixed(1)}% outside ${(bounds.widthPct.min * 100).toFixed(0)}–${(bounds.widthPct.max * 100).toFixed(0)}% (${bp} canvas)`,
    );
  }
  if (
    heightPct < bounds.heightPct.min ||
    heightPct > bounds.heightPct.max
  ) {
    warnings.push(
      `height ${(heightPct * 100).toFixed(1)}% outside ${(bounds.heightPct.min * 100).toFixed(0)}–${(bounds.heightPct.max * 100).toFixed(0)}% (${bp} canvas)`,
    );
  }
  if (
    ratio < SANITY_GLOBAL.aspectRatio.min ||
    ratio > SANITY_GLOBAL.aspectRatio.max
  ) {
    warnings.push(
      `aspect ${ratio.toFixed(2)} outside ${SANITY_GLOBAL.aspectRatio.min.toFixed(1)}–${SANITY_GLOBAL.aspectRatio.max.toFixed(1)}`,
    );
  }
  if (winnerAreaPct < SANITY_GLOBAL.minAreaPct) {
    warnings.push(
      `winning region only ${(winnerAreaPct * 100).toFixed(2)}% of image (< ${(SANITY_GLOBAL.minAreaPct * 100).toFixed(0)}%) — real screen marker may be missing, this might be a stray`,
    );
  }

  const pct = (n: number, total: number) =>
    `${((n / total) * 100).toFixed(2)}%`;

  return {
    rect: {
      top: pct(winnerBox.y, height),
      left: pct(winnerBox.x, width),
      width: pct(winnerBox.w, width),
      height: pct(winnerBox.h, height),
    },
    warnings,
    bboxPx: winnerBox,
    rejectedBboxesPx: rejects,
    dims: { width, height },
    regionCount: regions.length,
    winnerPixelCount: winner.pixelCount,
  };
}

async function writeDebugImage(
  source: string,
  outFile: string,
  winner: BBoxPx,
  rejects: BBoxPx[],
  dims: { width: number; height: number },
) {
  await fs.mkdir(DEBUG_DIR, { recursive: true });
  // Stroke width scales with image size so the box stays visible on
  // both 415-wide Small and 1920-wide Large assets.
  const stroke = Math.max(
    4,
    Math.round(Math.min(dims.width, dims.height) / 200),
  );
  const thin = Math.max(2, Math.floor(stroke / 2));

  const rejectsSvg = rejects
    .map(
      (r) =>
        `  <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="none" stroke="#ff3030" stroke-width="${thin}" stroke-dasharray="${thin * 4} ${thin * 2}" />`,
    )
    .join("\n");

  const winnerSvg = `  <rect x="${winner.x}" y="${winner.y}" width="${winner.w}" height="${winner.h}" fill="none" stroke="#00ff00" stroke-width="${stroke}" />`;

  // Rejects drawn first so the winner outline is the topmost shape.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dims.width}" height="${dims.height}">
${rejectsSvg ? rejectsSvg + "\n" : ""}${winnerSvg}
</svg>`;

  await sharp(source)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toFile(outFile);
}

function formatRectLine(bp: Breakpoint, rect: Rect): string {
  return `  ${bp}: { top: "${rect.top}", left: "${rect.left}", width: "${rect.width}", height: "${rect.height}" },`;
}

async function updateWorkData(rects: Partial<Record<Breakpoint, Rect>>) {
  const original = await fs.readFile(WORK_DATA_PATH, "utf8");

  const startMarker = "// >>> AUTO-GENERATED:SCREEN_POS:START";
  const endMarker = "// >>> AUTO-GENERATED:SCREEN_POS:END";
  const startIdx = original.indexOf(startMarker);
  const endIdx = original.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    throw new Error(
      `Could not find AUTO-GENERATED:SCREEN_POS markers in ${WORK_DATA_PATH}`,
    );
  }

  // Parse existing SCREEN_POS so breakpoints whose source file is
  // missing in this run keep whatever value is currently on disk.
  const existing: Record<Breakpoint, Rect> = {
    large: { top: "0%", left: "0%", width: "0%", height: "0%" },
    medium: { top: "0%", left: "0%", width: "0%", height: "0%" },
    small: { top: "0%", left: "0%", width: "0%", height: "0%" },
  };
  const reLine =
    /(large|medium|small):\s*\{\s*top:\s*"([^"]+)",\s*left:\s*"([^"]+)",\s*width:\s*"([^"]+)",\s*height:\s*"([^"]+)"\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = reLine.exec(original)) !== null) {
    const bp = m[1] as Breakpoint;
    existing[bp] = {
      top: m[2],
      left: m[3],
      width: m[4],
      height: m[5],
    };
  }

  const merged: Record<Breakpoint, Rect> = {
    large: rects.large ?? existing.large,
    medium: rects.medium ?? existing.medium,
    small: rects.small ?? existing.small,
  };

  const newBlock = [
    startMarker + " — do not edit manually",
    `export const SCREEN_POS: ScreenPositions = {`,
    formatRectLine("large", merged.large),
    formatRectLine("medium", merged.medium),
    formatRectLine("small", merged.small),
    `};`,
    endMarker,
  ].join("\n");

  const before = original.slice(0, startIdx);
  const after = original.slice(
    original.indexOf("\n", endIdx) + 1 || original.length,
  );

  const updated = before + newBlock + "\n" + after;

  await fs.writeFile(WORK_DATA_PATH, updated, "utf8");
}

async function main() {
  const detected: Partial<Record<Breakpoint, Rect>> = {};
  let anyWarnings = false;
  let anyError = false;

  for (const bp of ["large", "medium", "small"] as const) {
    const file = SOURCES[bp];
    if (!(await fileExists(file))) {
      console.log(`[skip] ${bp.padEnd(6)} — file not found: ${file}`);
      continue;
    }
    const result = await detect(file, bp);
    if (!result) {
      console.error(
        `[ERR]  ${bp.padEnd(6)} — no red regions found in ${path.basename(
          file,
        )} (threshold R>${RED_THRESHOLD.rMin}, G<${RED_THRESHOLD.gMax}, B<${RED_THRESHOLD.bMax})`,
      );
      anyError = true;
      continue;
    }

    detected[bp] = result.rect;
    console.log(
      `[ok]   ${bp.padEnd(6)} top=${result.rect.top.padStart(7)} left=${result.rect.left.padStart(7)} width=${result.rect.width.padStart(7)} height=${result.rect.height.padStart(7)} (${result.regionCount} region${result.regionCount === 1 ? "" : "s"} found, picked largest @ ${result.winnerPixelCount}px)`,
    );

    for (const w of result.warnings) {
      console.warn(`[warn] ${bp.padEnd(6)} — ${w}`);
      anyWarnings = true;
    }

    const debugFile = path.join(DEBUG_DIR, `${bp}-detected.png`);
    await writeDebugImage(
      file,
      debugFile,
      result.bboxPx,
      result.rejectedBboxesPx,
      result.dims,
    );
    console.log(
      `[dbg]  ${bp.padEnd(6)} → ${path.relative(REPO_ROOT, debugFile)}`,
    );
  }

  if (Object.keys(detected).length === 0) {
    console.log("\nNo files processed. workData.ts unchanged.");
    if (anyError) process.exit(1);
    return;
  }

  await updateWorkData(detected);
  console.log(`\nUpdated ${path.relative(REPO_ROOT, WORK_DATA_PATH)}`);
  if (anyWarnings) {
    console.warn(
      "\nOne or more sanity checks failed. Inspect scripts/debug/*-detected.png — green box = winner, dashed red = rejected regions.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
