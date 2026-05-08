import { PROJECT_DETAILS } from "@/app/data/project-details.data";
import type { ProjectDetail } from "./project-detail.types";

export function getProjectDetail(slug: string): ProjectDetail | null {
  return PROJECT_DETAILS.find((p) => p.slug === slug) ?? null;
}

/**
 * Return `count` projects from PROJECT_DETAILS that aren't the current
 * project, walking the array starting at the index after `currentSlug`
 * and wrapping around if needed. Used by the "Other Work" section so
 * the two displayed cards are deterministic per source slug. Falls
 * back to the first `count` projects when the slug isn't found.
 */
export function getOtherProjects(
  currentSlug: string,
  count = 2,
): ProjectDetail[] {
  const idx = PROJECT_DETAILS.findIndex((p) => p.slug === currentSlug);
  if (idx < 0) return PROJECT_DETAILS.slice(0, count);
  const result: ProjectDetail[] = [];
  for (let i = 1; i <= count; i++) {
    result.push(PROJECT_DETAILS[(idx + i) % PROJECT_DETAILS.length]);
  }
  return result;
}
