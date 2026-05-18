import type { ProjectDetailMeta } from "./project-detail.types";

interface ProjectMetaGridProps {
  meta: ProjectDetailMeta;
}

/**
 * Four-up meta grid (Responsibility / Project Type / Industry /
 * Year) shown between the hero image and the introduction row.
 * The fourth column was previously "Timeline" / a duration string
 * — replaced with calendar year so single years and ranges read
 * the same way. Labels are uppercase and small; values are
 * normal-weight body text. Stacks to 2 columns on medium and 2
 * columns on small per the reference.
 */
export default function ProjectMetaGrid({ meta }: ProjectMetaGridProps) {
  const items: { label: string; value: string }[] = [
    { label: "RESPONSIBILITY", value: meta.responsibility },
    { label: "PROJECT TYPE", value: meta.projectType },
    { label: "INDUSTRY", value: meta.industry },
    { label: "YEAR", value: meta.year },
  ];

  return (
    <dl className="project-detail-meta">
      {items.map((item) => (
        <div key={item.label} className="project-detail-meta-item">
          <dt className="project-detail-meta-label">{item.label}</dt>
          <dd className="project-detail-meta-value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
