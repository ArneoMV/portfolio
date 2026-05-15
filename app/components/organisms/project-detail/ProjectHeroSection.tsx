import Image from "next/image";
import ProjectMetaGrid from "./ProjectMetaGrid";
import type { ProjectDetail } from "./project-detail.types";

interface ProjectHeroSectionProps {
  project: ProjectDetail;
}

/**
 * Section 1 — Project Hero / Introduction.
 *
 * Five rows inside the 1100px rail container:
 *   1. h1 project title.
 *   2. "Type of work" label + project description (2-col on
 *      large/medium, stacks on mobile).
 *   3. Hero image — full-container-width rectangle. When no
 *      `heroImage` is provided, the empty .project-detail-image
 *      box renders a neutral grey placeholder via background.
 *   4. Meta grid — 4 items (Responsibility / Project Type /
 *      Industry / Timeline). Reflows to 2-up on small.
 *   5. Introduction — section label + paragraph (same 2-col
 *      pattern as row 2).
 *
 * Dotted horizontal separators between rows match the reference
 * (above hero image, above meta, above introduction). Separators
 * span container content width via padded ::before lines, not
 * full viewport width.
 */
export default function ProjectHeroSection({ project }: ProjectHeroSectionProps) {
  return (
    <section className="project-detail-hero">
      <div className="project-detail-hero-container">
        <h1 className="project-detail-title">{project.title}</h1>

        <div className="project-detail-row project-detail-row--type-desc">
          <p className="project-detail-row-label">
            {project.typeOfWorkLabel ?? "Type of work"}
          </p>
          <p className="project-detail-row-body">{project.description}</p>
        </div>

        <div className="project-detail-image">
          {project.heroImage && (
            <Image
              src={project.heroImage}
              alt={project.heroImageAlt ?? project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1099px) 100vw, 1100px"
              priority
            />
          )}
        </div>

        <ProjectMetaGrid meta={project.meta} />

        <div className="project-detail-row project-detail-row--intro">
          <p className="project-detail-row-label project-detail-row-label--strong">
            INTRODUCTION
          </p>
          <p className="project-detail-row-body">{project.introduction}</p>
        </div>
      </div>
    </section>
  );
}
