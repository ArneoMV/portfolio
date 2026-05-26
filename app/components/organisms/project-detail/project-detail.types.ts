export interface ProjectDetailMeta {
  responsibility: string;
  projectType: string;
  industry: string;
  /**
   * Calendar year (or year range) the project ran — replaces the
   * previous `timeline` field which expressed duration. Render as
   * a single string so ranges (e.g. "2022 – 2024") work alongside
   * single years ("2025").
   */
  year: string;
}

/**
 * Four rendering variants for image blocks in the dark / light
 * sections. (Naming kept as `…DarkImageVariant` for backward
 * compatibility with prior data and components; the variants are
 * shared across both sections.)
 *
 *   "illustration" — transparent PNG illustration / diagram. Fixed
 *     height per block via `height` field; width auto, centred. No
 *     coloured frame. Used for design-system / workflow visuals
 *     that blend into the section background.
 *
 *   "responsive" — photo-style mockup with its own natural
 *     background (e.g. device on a real-world surface). Renders
 *     at the width of the parent slot (the right column in the
 *     dark/light grid), height auto. Used when the image should
 *     sit inside the offset right column.
 *
 *   "mockup-on-frame" — clean device cut-out floating above a
 *     brand-coloured frame. Image capped at ~400px wide on
 *     desktop; frame at 60% of image height. Colour from
 *     `backgroundColor`.
 *
 *   "full-width" — composite image that escapes the right column
 *     and spans the entire container (1100px max). The light
 *     section template renders this variant as a sibling of the
 *     5fr/7fr grid row rather than a child of it, so the image
 *     reaches both rails. Used for the Elite Digital mockups
 *     composite. Dark section currently has no full-width slot,
 *     so this variant is light-section-only in practice.
 *
 * Defaults: when `variant` is omitted on a block that has a `src`,
 * the renderer falls back to "responsive" — kept optional so the
 * other three projects (Neogov / Spona / Croatel) still type-check
 * with their current image-placeholder blocks.
 */
export type ProjectDetailDarkImageVariant =
  | "illustration"
  | "responsive"
  | "mockup-on-frame"
  | "full-width";

export type ProjectDetailDarkBlock =
  | { type: "text"; content: string }
  | {
      type: "image";
      /** Rendering variant — see `ProjectDetailDarkImageVariant`. */
      variant?: ProjectDetailDarkImageVariant;
      src?: string;
      alt?: string;
      /**
       * Fixed pixel height for the "illustration" variant. The image
       * scales to this height with width auto, centred horizontally.
       * Ignored by other variants.
       */
      height?: number;
      /**
       * Brand-coloured frame colour for the "mockup-on-frame" variant.
       * Rendered at 60% of the image's rendered height, centred
       * vertically — the mockup visually floats above the strip.
       * Ignored by other variants.
       */
      backgroundColor?: string;
    };

export interface ProjectDetailDarkSection {
  leftText: string;
  rightBlocks: ProjectDetailDarkBlock[];
}

/**
 * Light editorial section that follows the dark band. Same right-
 * column block model as `darkSection`, but with no `leftText` — the
 * left column is intentionally empty so the right column reads as a
 * deliberate offset-from-the-rail composition. Optional; projects
 * that haven't been authored into the new layout (Neogov / Spona /
 * Croatel as of writing) simply omit it.
 */
export interface ProjectDetailLightSection {
  rightBlocks: ProjectDetailDarkBlock[];
}

export interface ProjectDetail {
  slug: string;
  title: string;
  /**
   * Label that prefixes the project description in the hero row
   * (e.g. "Challenge", "Brief", "Project context"). Optional —
   * `ProjectHeroSection` falls back to `"Type of work"` if absent so
   * legacy data without this field still renders cleanly.
   */
  typeOfWorkLabel?: string;
  description: string;
  heroImage?: string;
  heroImageAlt?: string;
  meta: ProjectDetailMeta;
  introduction: string;
  darkSection: ProjectDetailDarkSection;
  /**
   * Optional follow-on light section (see `ProjectDetailLightSection`).
   * Template skips the section entirely when undefined.
   */
  lightSection?: ProjectDetailLightSection;
  tags?: string[];
  /**
   * Copy + image for this project's "Other Work" card — the cross-link
   * cards at the bottom of every detail page. Card-specific so it can
   * read differently from the hero `description` / `heroImage`.
   * `OtherWorkCard` consumes this (via PROJECT_DETAILS) for all four
   * projects, including the bespoke pages (Neogov / Spona / Croatel)
   * whose detail content lives elsewhere but whose Other-Work card
   * still comes from here. Optional so legacy entries fall back to the
   * hero fields.
   */
  otherWorkCard?: {
    image: { src: string; alt: string };
    label: string;
    description: string;
    tag: string;
  };
}
