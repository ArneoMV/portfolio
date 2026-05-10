"use client";

import { useState } from "react";
import SectionHeader from "@/app/components/molecules/section-header/SectionHeader";
import WorkList from "./WorkList";
import CrtScreen from "./CrtScreen";
import { WORKS } from "./workData";
import styles from "./WorkSection.module.scss";

/**
 * WorkSection — full-bleed hero composition.
 *
 * Layout: the background photograph fills the section (object-fit:
 * cover), CrtScreen overlays the whole section but is mask-clipped to
 * the monitor screen, and the WORK heading + project list render as
 * text overlays on top.
 *
 * State: hover on a project row switches the active work, which cycles
 * the slideshow (CrtScreen) and reveals the subtitle inside the row.
 *
 * Header + FooterToolbar are NOT rendered here — they live globally
 * in app/(site)/layout.tsx and would otherwise duplicate.
 */
export default function WorkSection() {
  const [activeWorkId, setActiveWorkId] = useState<string>(WORKS[0].id);
  const activeWork = WORKS.find((w) => w.id === activeWorkId) ?? WORKS[0];

  return (
    <section className={styles.section}>
      <picture className={styles.bg}>
        <source
          srcSet="/images/home/work/Large_-_Work.webp"
          media="(min-width: 1024px)"
        />
        <source
          srcSet="/images/home/work/Medium_-_Work.webp"
          media="(min-width: 640px)"
        />
        <img
          src="/images/home/work/Small_-_Work.png"
          alt=""
          className={styles.bgImg}
        />
      </picture>

      {/* Tint — sits between bg and CrtScreen so the slideshow stays
          fully opaque over it (CrtScreen at higher z-index paints on
          top). Darkens only the bg photograph behind the text/list. */}
      <div className={styles.bgTint} aria-hidden="true" />

      <CrtScreen activeWork={activeWork} />

      <div className={styles.overlay}>
        <SectionHeader title="Work" />
        <div className={styles.listRegion}>
          <WorkList activeWorkId={activeWorkId} onActivate={setActiveWorkId} />
        </div>
      </div>

      {/* SVG colour-channel filters — referenced by descendants via
          filter: url(#redChannel) / url(#blueChannel). Defined once
          at the section root for the GSAP glitch effect that arrives
          in a follow-up step. */}
      <svg width="0" height="0" className={styles.svgDefs} aria-hidden="true">
        <defs>
          <filter id="redChannel">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="blueChannel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </section>
  );
}
