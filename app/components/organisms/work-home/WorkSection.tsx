"use client";

import { useState } from "react";
import SectionHeader from "@/app/components/molecules/section-header/SectionHeader";
import WorkList from "./WorkList";
import CrtScreen from "./CrtScreen";
import { WORKS } from "./workData";
import styles from "./WorkSection.module.scss";

/**
 * WorkSection — container-constrained kanban composition.
 *
 * Layout: the section root carries the dotted page rails (z:1) at
 * `calc(50% ± 550px)`. Inside, a `.container` (max-width 1100, no
 * horizontal padding) is the masked canvas — its aspect-ratio per
 * breakpoint matches the source bg image so SCREEN_POS percentages
 * line up. The bg photograph fills the container, CrtScreen is
 * mask-clipped to the monitor shape within that same canvas, and a
 * content overlay (SectionHeader + WorkList) layers above with its
 * own padding inset. Mobile (≤639px) keeps the historical full-
 * bleed behaviour — the container drops its max-width on Small.
 *
 * State: hover on a project row switches the active work, which
 * cycles the slideshow (CrtScreen). The WorkList is now a two-
 * column grid on ≥640px (labels left, tag subtitles right) so the
 * tag rows align vertically across all four projects.
 *
 * Header + FooterToolbar are NOT rendered here — they live globally
 * in app/(site)/layout.tsx and would otherwise duplicate.
 */
export default function WorkSection() {
  const [activeWorkId, setActiveWorkId] = useState<string>(WORKS[0].id);
  const activeWork = WORKS.find((w) => w.id === activeWorkId) ?? WORKS[0];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
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
          {/* `.headerSlot` scopes a Work-only color override that makes
              the shared `SectionHeader` title render white over the
              dark photograph (default colour is `--color-neutral-70`,
              which would disappear against the bg tint). */}
          <div className={styles.headerSlot}>
            <SectionHeader title="Work" />
          </div>
          <div className={styles.listRegion}>
            <WorkList activeWorkId={activeWorkId} onActivate={setActiveWorkId} />
          </div>
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
