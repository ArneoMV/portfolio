/**
 * Shared prop/data shapes for the reusable case-study sections
 * (Context, Showcase, Image-pair). These sections are project-agnostic
 * — Neogov composes them today; Spona, Croatel, and future projects
 * map their own data into these shapes. Heroes stay project-specific
 * and are NOT covered here.
 */

/** A single stat in the Context stat row. `variant` controls ordering:
 *  "stat" = big value on top / small label below (default);
 *  "meta" = small label on top / value below. */
export interface CaseStudyStat {
  value: string;
  label: string;
  variant?: "stat" | "meta";
}

/** An image used in a section grid. `caption` is honoured only by the
 *  image-pair grid; the Context image row ignores it. */
export interface CaseStudyImage {
  src: string;
  alt: string;
  caption?: string;
}

/** A label (dt, 5fr) + paragraph (dd, 7fr) row. */
export interface CaseStudyTextRow {
  label: string;
  text: string;
  /** Optional images rendered immediately after the row, stacked
   *  vertically — lets the Context section's `insideRows` interleave
   *  label/text rows with one or more images (Croatel uses this;
   *  Neogov/Spona omit it, unchanged). */
  images?: CaseStudyImage[];
}

/**
 * Dark "Context" section.
 *
 * Render order: lead quote → stat row → primary label/text row +
 * optional image row (count-aware grid) → optional additional rows
 * INSIDE the navy panel → optional rows OUTSIDE the panel (on the
 * section background) → optional brand callout.
 */
export interface CaseStudyContextProps {
  /** Large lead quote opening the navy panel. */
  leadQuote?: string;
  /** Stat row (3-up on desktop; stacks on mobile). */
  stats?: CaseStudyStat[];
  /** Primary label/text row inside the panel, with an optional image
   *  row rendered full-width below it. Accepts 1, 2, or more images —
   *  a `--{count}` modifier class drives the grid layout. */
  contextRow?: CaseStudyTextRow & { images?: CaseStudyImage[] };
  /** Additional label/text rows inside the navy panel, after the
   *  context row + images (e.g. "Product work"). */
  insideRows?: CaseStudyTextRow[];
  /** Label/text rows rendered OUTSIDE the panel, on the white section
   *  background (e.g. "System impact"). */
  outsideRows?: CaseStudyTextRow[];
  /** Brand-coloured callout aligned to the right column, outside the
   *  panel. */
  callout?: string;
}

/**
 * Showcase image — either a single source used across all breakpoints,
 * or a large/small picture-switch pair toggled by CSS at the mobile
 * breakpoint (same approach the Neogov NOVI band uses).
 */
export type CaseStudyShowcaseImage =
  | { src: string; alt: string }
  | { srcLarge: string; srcSmall: string; alt: string };

/** Full-bleed showcase section. */
export interface CaseStudyShowcaseProps {
  image: CaseStudyShowcaseImage;
}

/** Label/text row over a 2-up captioned image grid. */
export interface CaseStudyImagePairProps {
  label: string;
  text: string;
  images: CaseStudyImage[];
}
