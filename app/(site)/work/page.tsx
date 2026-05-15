import type { Metadata } from "next";
import Link from "next/link";

import FooterSection from "@/app/components/organisms/footer-home/FooterSection";
import { WORK_PROJECTS } from "@/app/features/projects/data/projects.data";

/**
 * Map a regular preview path to its mobile variant by inserting
 * `_small` before the extension. The naming convention (underscore
 * separators on the project images) is enforced on disk:
 *   /images/work/elite_digital_work.webp
 *     → /images/work/elite_digital_work_small.webp
 * The regex matches the final dot+extension and inserts `_small`
 * just before it, preserving any extension (webp / png / jpg).
 */
const toSmallVariant = (src: string) => src.replace(/(\.[^./]+)$/, "_small$1");

const WORK_PAGE_TITLE = "Work — Arneo";
const WORK_PAGE_DESCRIPTION =
  "Selected product design, web design, and digital product projects by Arneo. Case studies on building tools and platforms teams actually use.";

export const metadata: Metadata = {
  title: "Work",
  description: WORK_PAGE_DESCRIPTION,
  openGraph: {
    title: WORK_PAGE_TITLE,
    description: WORK_PAGE_DESCRIPTION,
    url: "/work",
    type: "website",
  },
  twitter: {
    title: WORK_PAGE_TITLE,
    description: WORK_PAGE_DESCRIPTION,
  },
  alternates: {
    canonical: "/work",
  },
};

/**
 * /work — listing page.
 *
 * Vertical hover-expand list. Each `<li>` is one project row with the
 * preview image left-flush and the title/description top-right. Default
 * row height = image height (260px). On hover the image grows to
 * 360×320 via a CSS-only width/height transition and the text colour
 * deepens from neutral-80 to neutral-100; the row's height grows with
 * the image, pushing later rows down in normal flow — no overlap or
 * absolute positioning, native page scroll only.
 *
 * Images use `<picture>` + `<source media>` for per-breakpoint source
 * swap: desktop (≥768px) loads the regular `.webp`, mobile (<768px)
 * loads the `_small.webp` variant via `toSmallVariant`. The mobile
 * variant has a wider 1.8 aspect (intentionally different composition
 * for the stacked mobile layout); width/height on the `<img>` fallback
 * is set to 360×200 to match — CSS still controls actual rendered size.
 * The first row's image preloads (`loading="eager"`) because it's above
 * the fold on both desktop and mobile; the rest stay lazy.
 */
export default function WorkPage() {
  return (
    <div className="page-rail-group">
      <div className="work-page-shell">
        {/* `.container` adds the canonical 64/48/16 horizontal padding
            per breakpoint (defined in `_container.scss`) so the
            project rows sit inset from the dotted page rails by the
            same amount as every homepage section. Scoped to the
            listing only — `.work-page-shell` itself stays
            padding-free because it's shared with `/work/[slug]`,
            whose `ProjectDetailTemplate` handles its own internal
            section padding. Padding it here too would double-pad the
            detail page. */}
        <div className="container">
          <ul className="work-listing">
            {WORK_PROJECTS.map((project, i) => {
              const previewImage = project.images[0];
              return (
                <li key={project.slug} className="work-listing-item">
                  <Link
                    href={`/work/${project.slug}`}
                    className="work-listing-link"
                  >
                    {/* Text first in DOM order on every breakpoint. On
                        desktop the flex `row` direction parks it on the
                        left (with the image on the right via natural
                        order). On mobile the flex flips to `column` and
                        the image is moved to the top via CSS
                        `order: -1` — see `_work-page.scss`. Keeping the
                        title/description first in DOM order is also
                        better for screen readers (heading + summary
                        precede the decorative preview). */}
                    <div className="work-listing-text">
                      <h2 className="work-listing-title">{project.title}</h2>
                      <p className="work-listing-description">
                        {project.description}
                      </p>
                    </div>
                    <div className="work-listing-image">
                      {previewImage && (
                        <picture>
                          <source
                            media="(min-width: 768px)"
                            srcSet={previewImage}
                          />
                          <img
                            src={toSmallVariant(previewImage)}
                            alt={project.title}
                            width={360}
                            height={200}
                            loading={i === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="work-listing-image-img"
                          />
                        </picture>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Footer rendered as a sibling of `.work-page-shell` (not nested
          inside it) so it gets the same full-width rail-group treatment
          it has on the homepage — its own `.footer-container` handles
          1100 max-width centering and horizontal padding internally.
          The `.work-page-footer-slot` wrapper carries the breakpoint
          spacing above the Footer and reserves the FooterToolbar
          clearance below it on desktop (mobile clearance comes from
          `.site-main`'s mobile padding-bottom). */}
      <div className="work-page-footer-slot">
        <FooterSection />
      </div>
    </div>
  );
}
