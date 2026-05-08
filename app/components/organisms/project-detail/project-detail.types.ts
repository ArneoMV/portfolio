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
  typeLabel: string;
  description: string;
  heroImage?: string;
  heroImageAlt?: string;
  meta: ProjectDetailMeta;
  introduction: string;
  darkSection: ProjectDetailDarkSection;
  tags?: string[];
}
