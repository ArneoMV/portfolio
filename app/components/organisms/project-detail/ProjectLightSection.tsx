import ZoomableImage from "@/app/components/molecules/zoomable-image/ZoomableImage";
import type { ProjectDetail, ProjectDetailDarkBlock } from "./project-detail.types";

interface ProjectLightSectionProps {
  lightSection: NonNullable<ProjectDetail["lightSection"]>;
}

/**
 * Section 3 — Light editorial section that follows the dark band.
 *
 * Layout: an outer flex-column `.project-detail-light-inner` holds
 * blocks in their declared order. Each block decides its own
 * sub-layout:
 *
 *   • Most blocks (text + most image variants) render inside a
 *     `.project-detail-light-row` — a 5fr/7fr grid at ≥900px with
 *     the LEFT column empty. The right column carries the content.
 *
 *   • Image blocks with `variant: "full-width"` (e.g. the Elite
 *     Digital mockups composite) skip the grid entirely and
 *     render directly inside `.project-detail-light-inner`,
 *     spanning the full 1100px container width.
 *
 * Order is preserved across both block types — the outer flex
 * container interleaves rows and full-width images however the
 * data declares them.
 *
 * Image rendering reuses the same `.project-detail-dark-image*`
 * modifier classes used by ProjectDarkSection so the variant CSS
 * lives in one place. Those classes are background-neutral so
 * they render identically on dark and light surfaces.
 *
 * `lightSection` is optional on `ProjectDetail`; the template
 * conditionally renders this component, so the prop is non-null
 * inside.
 */

function renderImageBlock(
  block: Extract<ProjectDetailDarkBlock, { type: "image" }>,
) {
  const variant = block.variant ?? "responsive";

  if (variant === "illustration") {
    const h = block.height ?? 240;
    return (
      <div
        className="project-detail-dark-image project-detail-dark-image--illustration"
        style={{ height: `${h}px` }}
        role={block.alt ? "img" : undefined}
        aria-label={block.alt}
      >
        {block.src && (
          <ZoomableImage
            src={block.src}
            alt={block.alt ?? ""}
            width={h * 2}
            height={h}
            className="project-detail-dark-image-content"
          />
        )}
      </div>
    );
  }

  if (variant === "mockup-on-frame") {
    return (
      <div
        className="project-detail-dark-image project-detail-dark-image--mockup-on-frame"
        role={block.alt ? "img" : undefined}
        aria-label={block.alt}
      >
        {block.backgroundColor && (
          <div
            className="project-detail-dark-image-frame"
            style={{ backgroundColor: block.backgroundColor }}
            aria-hidden="true"
          />
        )}
        {block.src && (
          <ZoomableImage
            src={block.src}
            alt={block.alt ?? ""}
            width={400}
            height={300}
            className="project-detail-dark-image-content"
          />
        )}
      </div>
    );
  }

  // "responsive" — full-width-of-slot photo mockup, height auto.
  // Inside the 7fr right column this lands at roughly 50vw on
  // desktop; at full-width (when caller swaps the wrapper) the
  // image scales to the full 1100px container.
  return (
    <div
      className="project-detail-dark-image project-detail-dark-image--responsive"
      role={block.alt ? "img" : undefined}
      aria-label={block.alt}
    >
      {block.src && (
        <ZoomableImage
          src={block.src}
          alt={block.alt ?? ""}
          width={1200}
          height={800}
          className="project-detail-dark-image-content"
          sizes="(max-width: 767px) 100vw, 50vw"
        />
      )}
    </div>
  );
}

export default function ProjectLightSection({
  lightSection,
}: ProjectLightSectionProps) {
  const { rightBlocks } = lightSection;

  return (
    <section className="project-detail-light">
      <div className="project-detail-light-inner">
        {rightBlocks.map((block, i) => {
          // Full-width image — escape the 5fr/7fr grid, render
          // directly inside the inner container so the image
          // reaches both rails.
          if (
            block.type === "image" &&
            (block.variant ?? "responsive") === "full-width"
          ) {
            return (
              <div
                key={`fullwidth-${i}`}
                className="project-detail-light-fullwidth"
              >
                {block.src && (
                  // For full-width we want the composite to fill the
                  // 1100px container — bump the `sizes` hint so Next
                  // serves a larger srcset variant on desktop than
                  // the right-column-scoped "50vw" used by the
                  // in-column responsive variant.
                  <ZoomableImage
                    src={block.src}
                    alt={block.alt ?? ""}
                    width={1200}
                    height={800}
                    className="project-detail-dark-image-content"
                    sizes="(max-width: 1099px) 100vw, 1100px"
                  />
                )}
              </div>
            );
          }

          // Regular block — wrap in a 5fr/7fr row with the left
          // column intentionally empty.
          return (
            <div key={`row-${i}`} className="project-detail-light-row">
              <div
                className="project-detail-light-left"
                aria-hidden="true"
              />
              <div className="project-detail-light-right">
                {block.type === "text" ? (
                  <p className="project-detail-light-text">
                    {block.content}
                  </p>
                ) : (
                  renderImageBlock(block)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
