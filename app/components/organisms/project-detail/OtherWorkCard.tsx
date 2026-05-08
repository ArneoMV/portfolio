import Image from "next/image";
import Link from "next/link";
import type { ProjectDetail } from "./project-detail.types";

interface OtherWorkCardProps {
  project: ProjectDetail;
  /**
   * Visual variant — the first card in the row uses "tall"
   * (~400px image height on large), the second uses "short"
   * (~300px) per the reference. Mobile collapses both to the
   * same shorter aspect.
   */
  variant: "tall" | "short";
}

/**
 * Card used in Section 3 (Other Work). Each card is a real
 * `<Link>` to `/work/[slug]`, and image / title / description /
 * tag come straight from the project's ProjectDetail entry. The
 * neutral grey image area doubles as a placeholder when no
 * `heroImage` is provided.
 */
export default function OtherWorkCard({
  project,
  variant,
}: OtherWorkCardProps) {
  const tag = project.tags?.[0];

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`project-detail-other-card project-detail-other-card--${variant}`}
    >
      <div className="project-detail-other-card-image">
        {project.heroImage && (
          <Image
            src={project.heroImage}
            alt={project.heroImageAlt ?? project.title}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        )}
      </div>
      <h3 className="project-detail-other-card-title">{project.title}</h3>
      <p className="project-detail-other-card-desc">{project.description}</p>
      {tag && <span className="project-detail-other-card-tag">{tag}</span>}
    </Link>
  );
}
