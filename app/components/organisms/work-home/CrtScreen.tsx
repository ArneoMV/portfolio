"use client";

import { useEffect, useState } from "react";
import type { WorkItem } from "./workData";
import styles from "./CrtScreen.module.scss";

type Props = {
  activeWork: WorkItem;
};

const SLIDESHOW_INTERVAL_MS = 2800;

/**
 * CrtScreen — mask-clipped slideshow.
 *
 * Container fills the entire section (inset: 0) and is mask-clipped
 * to the monitor screen shape. Inner <img>s are positioned at the
 * SCREEN_POS rect via CSS variables that the section root provides;
 * each is faded in/out as `imageIndex` advances.
 *
 * Autoplay: setInterval cycles imageIndex every SLIDESHOW_INTERVAL_MS.
 * Resets to 0 when activeWork changes so a new project always starts
 * on its first slide. Cleared on unmount and on dependency change.
 */
export default function CrtScreen({ activeWork }: Props) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);

    if (activeWork.images.length <= 1) return;

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
      {activeWork.images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className={`${styles.image} ${
            i === imageIndex ? styles.imageActive : ""
          }`}
        />
      ))}
    </div>
  );
}
