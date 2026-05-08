"use client";

import { useEffect, useState } from "react";

// Preloader timing. The ring counts 1 → 100 over PRELOAD_COUNT_MS,
// then the backdrop fades out over PRELOAD_FADE_MS before the rest
// of the hero is allowed to animate.
const PRELOAD_COUNT_MS = 1500;
const PRELOAD_FADE_MS = 500;

export interface HeroPreloaderState {
  loadingProgress: number;
  isPreloading: boolean;
  heroReady: boolean;
}

/**
 * Hero preloader state machine.
 *
 * Counts 1 → 100 over PRELOAD_COUNT_MS, flips `isPreloading` to false
 * (which fades the backdrop out via CSS), then waits PRELOAD_FADE_MS
 * for the fade to land before flipping `heroReady` true. Consumers
 * gate the hero intro timeline on `heroReady` so it can't start
 * until the preloader has fully cleared.
 *
 * Owns the `is-preloading` body class so the rest of the page can
 * suppress side effects while the preloader is active. Reduced-motion
 * skips the count + fade entirely and reports both flags as their
 * post-preload values immediately.
 */
export function useHeroPreloader(): HeroPreloaderState {
  const [loadingProgress, setLoadingProgress] = useState(1);
  const [isPreloading, setIsPreloading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      // Reduced motion: skip preloader entirely.
      setIsPreloading(false);
      setHeroReady(true);
      return;
    }

    document.body.classList.add("is-preloading");

    const start = performance.now();
    let rafId = 0;
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / PRELOAD_COUNT_MS);
      setLoadingProgress(Math.max(1, Math.round(p * 100)));
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setIsPreloading(false);
        window.setTimeout(() => {
          document.body.classList.remove("is-preloading");
          setHeroReady(true);
        }, PRELOAD_FADE_MS);
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.classList.remove("is-preloading");
    };
  }, []);

  return { loadingProgress, isPreloading, heroReady };
}
