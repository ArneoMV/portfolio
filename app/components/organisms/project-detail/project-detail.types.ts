export interface ProjectDetailMeta {
  responsibility: string;
  projectType: string;
  industry: string;
  timeline: string;
}

export type ProjectDetailDarkBlock =
  | { type: "text"; content: string }
  | { type: "image"; src?: string; alt?: string };

export interface ProjectDetailDarkSection {
  leftText: string;
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
  tags?: string[];
}
