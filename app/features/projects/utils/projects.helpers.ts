import { WORK_PROJECTS } from "../data/projects.data";
import type { Project } from "../project.types";

export function getProjectBySlug(slug: string): Project | null {
  return WORK_PROJECTS.find((p) => p.slug === slug) ?? null;
}
