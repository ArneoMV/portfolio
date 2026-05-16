import Image from "next/image";
import type { ProjectDetail } from "./project-detail.types";

interface ProjectDarkSectionProps {
  project: ProjectDetail;
}

/**
 * Section 2 — Dark content section.
 *
 * Two-column editorial layout on Medium + Large (≥900px), single
 * column on small. The left column uses CSS `position: sticky` at
 * ≥900px so the lead text stays visible while the right column
 * (text + image blocks) scrolls past in normal document flow.
 * Stickiness releases when the parent grid's bottom edge scrolls
 * past the sticky `top` offset.
 *
 * Replaces the previous GSAP ScrollTrigger pin which (a) needed
 * `maxY > 0` to activate (so it silently no-op'd whenever the
 * right column wasn't tall enough to overflow viewport height),
 * (b) required `matchMedia` + `.is-pinned` class machinery, and
 * (c) was sensitive to Fast Refresh / hydration timing. Pure CSS
 * sticky has none of these failure modes — it's content-agnostic
 * and works at every content length.
 *
 * 900px chosen for the two-column split: at 768px each column is
 * ~310px which is too tight for the 4/3 image + paragraph pairing
 * — 900px gives ~386px which reads cleanly. Match this in
 * `_project-detail.scss`'s `@media (min-width: 900px)` block.
 *
 * Server component: no scroll-driven JS, no refs, no `"use client"`
 * directive. `next/image` renders fine in a server component.
 */
export default function ProjectDarkSection({ project }: ProjectDarkSectionProps) {
  const { leftText, rightBlocks } = project.darkSection;

  return (
    <section className="project-detail-dark">
      <div className="project-detail-dark-inner">
        <div className="project-detail-dark-grid">
          <div className="project-detail-dark-left">
            <p className="project-detail-dark-text">{leftText}</p>
          </div>

          <div className="project-detail-dark-right">
            {rightBlocks.map((block, i) => {
              if (block.type === "text") {
                return (
                  <p
                    key={`text-${i}`}
                    className="project-detail-dark-text"
                  >
                    {block.content}
                  </p>
                );
              }
              return (
                <div
                  key={`image-${i}`}
                  className="project-detail-dark-image"
                  role={block.alt ? "img" : undefined}
                  aria-label={block.alt}
                >
                  {block.src && (
                    <Image
                      src={block.src}
                      alt={block.alt ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
