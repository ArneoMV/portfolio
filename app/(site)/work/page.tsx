import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import FooterSection from "@/app/components/organisms/footer-home/FooterSection";
import { WORK_PROJECTS } from "@/app/features/projects/data/projects.data";

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
 * The image is rendered at its hover-state dimensions (360×320) so the
 * source variant Next.js fetches doesn't change when the row expands;
 * CSS scales the `.work-listing-image` box down to 260×260 in the rest
 * state. Source files are 634×821 portrait, so both states are sharp
 * on 2× DPR displays with no upscale.
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
            {WORK_PROJECTS.map((project) => {
              const previewImage = project.images[0];
              return (
                <li key={project.slug} className="work-listing-item">
                  <Link
                    href={`/work/${project.slug}`}
                    className="work-listing-link"
                  >
                    <div className="work-listing-image">
                      {previewImage && (
                        <Image
                          src={previewImage}
                          alt={project.title}
                          width={360}
                          height={320}
                          sizes="(max-width: 767px) 100vw, 360px"
                          className="work-listing-image-img"
                        />
                      )}
                    </div>
                    <div className="work-listing-text">
                      <h2 className="work-listing-title">{project.title}</h2>
                      <p className="work-listing-description">
                        {project.description}
                      </p>
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
