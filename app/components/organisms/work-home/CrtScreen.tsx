"use client";

import { useEffect, useState } from "react";
import type { WorkItem } from "./workData";
import styles from "./CrtScreen.module.scss";

type Props = {
  activeWork: WorkItem;
};

const SLIDESHOW_INTERVAL_MS = 2800;

/**
 * CrtScreen — mask-clipped slideshow OR video.
 *
 * Container fills the entire section (inset: 0) and is mask-clipped
 * to the monitor screen shape. When `activeWork.video` is set, a single
 * autoplaying `<video>` is rendered in the mask; otherwise the inner
 * `<img>`s fade-cycle via `imageIndex` every SLIDESHOW_INTERVAL_MS.
 *
 * The slideshow interval is skipped for video projects so it doesn't
 * race the video loop. `setImageIndex(0)` still runs on every project
 * switch so returning to an image project always starts on slide 0.
 */
export default function CrtScreen({ activeWork }: Props) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);

    if (activeWork.video || activeWork.images.length <= 1) return;

    // Diagnostic — confirms the interval is wired during browser
    // smoke-tests. Safe to remove once the slideshow is verified.
    // eslint-disable-next-line no-console
    console.log(
      `[CrtScreen] autoplay started for "${activeWork.id}" (${activeWork.images.length} images, ${SLIDESHOW_INTERVAL_MS}ms)`,
    );

    const interval = setInterval(() => {
      setImageIndex((i) => (i + 1) % activeWork.images.length);
    }, SLIDESHOW_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [activeWork]);

  return (
    <div className={styles.screen} aria-hidden="true">
      {activeWork.video ? (
        // Two videos, toggled by CSS at 768px (see `.videoDesktop` /
        // `.videoMobile`). Both reuse `.image .imageActive` (positioning,
        // object-fit, opacity) and inherit the SCREEN_POS rectangle via
        // the `.screen video` rule. `preload="metadata"` keeps the
        // hidden-on-this-device video from downloading in full.
        //
        // Autoplay requires the video to be muted. The `muted` JSX prop
        // alone is unreliable: React applies `muted` as a DOM property,
        // not a serialised HTML attribute, and SSR/hydration can leave it
        // unset — the browser then sees an unmuted `<video autoplay>` and
        // blocks playback. The `ref` forces `muted = true` on the live
        // element and calls `play()` to recover any autoplay the browser
        // refused on the server-rendered markup (it re-runs per remount,
        // e.g. the desktop video's `key` change on project switch).
        <>
          {/* Desktop (≥768px) — the active project's video. `key` forces
              a remount (restart from frame 0) on project switch. */}
          <video
            key={activeWork.id}
            src={activeWork.video}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            ref={(el) => {
              if (!el) return;
              el.muted = true;
              void el.play().catch(() => {});
            }}
            className={`${styles.image} ${styles.imageActive} ${styles.videoDesktop}`}
          />
          {/* Mobile (≤767px) — a single shared placeholder; no per-row
              preview switching on touch, so it never remounts. Swap this
              src for the composite mobile video in a later task. */}
          <video
            src="/images/home/work/neogov-scene.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            ref={(el) => {
              if (!el) return;
              el.muted = true;
              void el.play().catch(() => {});
            }}
            className={`${styles.image} ${styles.imageActive} ${styles.videoMobile}`}
          />
        </>
      ) : (
        activeWork.images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className={`${styles.image} ${
              i === imageIndex ? styles.imageActive : ""
            }`}
          />
        ))
      )}
    </div>
  );
}
