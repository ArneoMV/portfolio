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
 * `<Link>` to `/work/[slug]`. Copy + image come from the project's
 * card-specific `otherWorkCard` block (image / label / description /
 * tag); when that's absent the card falls back to the hero fields so
 * legacy entries still render. The neutral grey image area doubles as
 * a placeholder when no image source resolves.
 */
export default function OtherWorkCard({
  project,
  variant,
}: OtherWorkCardProps) {
  const card = project.otherWorkCard;
  const image =
    card?.image ??
    (project.heroImage
      ? { src: project.heroImage, alt: project.heroImageAlt ?? project.title }
      : null);
  const label = card?.label ?? project.title;
  const description = card?.description ?? project.description;
  const tag = card?.tag ?? project.tags?.[0];

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`project-detail-other-card project-detail-other-card--${variant}`}
    >
      <div className="project-detail-other-card-image">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        )}
      </div>
      <h3 className="project-detail-other-card-title">{label}</h3>
      <p className="project-detail-other-card-desc">{description}</p>
      {tag && <span className="project-detail-other-card-tag">{tag}</span>}
    </Link>
  );
}
