import type { Metadata } from "next";

import WorkCard from "@/app/components/molecules/work-card/WorkCard";
import { getProjectBySlug } from "@/app/features/projects/utils/projects.helpers";

const WORK_PAGE_TITLE = "Work — Arneo";
const WORK_PAGE_DESCRIPTION =
  "Selected product design, web design, and digital product projects by Arneo. Case studies on building tools and platforms teams actually use.";

export const metadata: Metadata = {
  // `title: "Work"` resolves to "Work — Arneo" via the root layout's
  // title.template. OG/Twitter titles don't inherit that template,
  // so they're set explicitly with the full string.
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
 * Editorial 6-card grid:
 *   ┌───────────┬───────────┐
 *   │           │  Elite    │
 *   │  Neogov   ├───────────┤
 *   │           │  Spona    │
 *   ├───────────┴───────────┤
 *   │ Croatel │ Metro │ Gl. │
 *   └───────────────────────┘
 *
 * Wrapped in `.page-rail-group` and `.work-page-shell` so the grid
 * sits inside the same dotted rails the homepage and detail page
 * use, with Source Sans 3 already inherited from the shell.
 */
export default function WorkPage() {
  // Slug-keyed fetch keeps the layout positions independent of the
  // order of WORK_PROJECTS in projects.data.ts.
  const neogov = getProjectBySlug("neogov");
  const eliteDigital = getProjectBySlug("elite-digital");
  const spona = getProjectBySlug("spona");
  const croatel = getProjectBySlug("croatel");
  const metroUiLibrary = getProjectBySlug("metro-ui-library");
  const glasackiList = getProjectBySlug("glasacki-list");

  return (
    <div className="page-rail-group">
      <div className="work-page-shell pb-[var(--space-5xl)]">
        <section className="container">
          <div className="work-listing">
            <div className="work-listing-top">
              {neogov && (
                <WorkCard project={neogov} className="work-card--neogov" />
              )}

              <div className="work-listing-top-right">
                {eliteDigital && (
                  <WorkCard
                    project={eliteDigital}
                    className="work-card--elite"
                  />
                )}
                {spona && (
                  <WorkCard project={spona} className="work-card--spona" />
                )}
              </div>
            </div>

            <div className="work-listing-bottom">
              {croatel && (
                <WorkCard project={croatel} className="work-card--croatel" />
              )}
              {metroUiLibrary && (
                <WorkCard
                  project={metroUiLibrary}
                  className="work-card--metro"
                />
              )}
              {glasackiList && (
                <WorkCard
                  project={glasackiList}
                  className="work-card--glasacki"
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
