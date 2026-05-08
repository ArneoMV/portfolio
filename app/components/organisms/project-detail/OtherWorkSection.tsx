import Button from "@/app/components/atoms/button/Button";
import OtherWorkCard from "./OtherWorkCard";
import type { ProjectDetail } from "./project-detail.types";

interface OtherWorkSectionProps {
  projects: ProjectDetail[];
}

/**
 * Section 3 — Other Work.
 *
 * Header row: "Other Work" h2 on the left, "See All" CTA (arrow)
 * linking to /work on the right. Body row: two `<OtherWorkCard>`s
 * laid out side-by-side on large/medium, stacked on mobile.
 *
 * Source projects are picked deterministically by
 * `getOtherProjects(currentSlug)` (next two projects in
 * PROJECT_DETAILS, wrapping past the end). The current project is
 * always excluded.
 */
export default function OtherWorkSection({ projects }: OtherWorkSectionProps) {
  return (
    <section className="project-detail-other">
      <div className="project-detail-other-container">
        <div className="project-detail-other-header">
          <h2 className="project-detail-other-title">Other Work</h2>
          <Button
            variant="dark"
            size="sm"
            href="/work"
            ariaLabel="See all work"
          >
            See All <span aria-hidden="true">→</span>
          </Button>
        </div>

        <div className="project-detail-other-grid">
          {projects.map((project, i) => (
            <OtherWorkCard
              key={project.slug}
              project={project}
              variant={i === 0 ? "tall" : "short"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
