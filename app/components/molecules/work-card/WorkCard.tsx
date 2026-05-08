import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/app/features/projects/project.types";

interface WorkCardProps {
  project: Project;
  /**
   * Layout-specific class (`work-card--neogov`, `work-card--elite`, …).
   * Used by the listing page grid to size each card's image rectangle.
   */
  className?: string;
}

/**
 * Listing-page card. Image + title only, matching the current Work
 * page redesign. The image rectangle is sized by per-slug classes
 * applied via `className` so the editorial grid can give Neogov a
 * tall portrait while the right-column / bottom-row cards take their
 * own dimensions.
 */
export default function WorkCard({ project, className }: WorkCardProps) {
  const previewImage = project.images[0];
  const cls = className ? `work-card ${className}` : "work-card";

  return (
    <Link href={`/work/${project.slug}`} className={cls}>
      <div className="work-card-image">
        {previewImage && (
          <Image
            src={previewImage}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 540px"
          />
        )}
      </div>

      <h3 className="work-card-title">{project.title}</h3>
    </Link>
  );
}
