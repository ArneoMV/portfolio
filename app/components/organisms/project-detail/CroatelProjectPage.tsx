import SiteFooter from "@/app/components/organisms/site-footer/SiteFooter";
import { CROATEL_PROJECT } from "@/app/data/croatel-project.data";
import CroatelHeroSection from "./croatel/CroatelHeroSection";
import CaseStudyContextSection from "./case-study/CaseStudyContextSection";
import CroatelLightSection from "./croatel/CroatelLightSection";
import OtherWorkSection from "./OtherWorkSection";
import { getOtherProjects } from "./project-detail.helpers";

/**
 * Footer link/meta content for the Croatel page. Local copy (same shape
 * as Neogov/Spona) so the page owns its own footer config.
 */
const CROATEL_FOOTER_LINKS: [
  { href: string; label: string }[],
  { href: string; label: string }[],
  { href: string; label: string }[],
] = [
  [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/lab", label: "Lab" },
  ],
  [
    { href: "#", label: "Store" },
    { href: "/#contact", label: "Contact" },
  ],
  [
    { href: "#", label: "Linkedin" },
    { href: "#", label: "Dribbble" },
  ],
];

/**
 * Dedicated, fully bespoke Croatel / HRT project page.
 *
 * Composes the banner-only Croatel hero with the shared dark Context
 * section (whose `insideRows` interleave a row + image) and the bespoke
 * `CroatelLightSection`, then reuses the shared OtherWorkSection +
 * SiteFooter for the page tail. Mirrors `NeogovProjectPage` /
 * `SponaProjectPage`, including the `.page-rail-group` wrapper (dotted
 * side rails) and the desktop footer/toolbar bottom clearance carried
 * by `.croatel-project-page`.
 *
 * The Context section uses only `leadQuote` / `stats` / `contextRow` /
 * `insideRows` — no outside rows, no callout — so those props are
 * omitted.
 */
export default function CroatelProjectPage() {
  const otherProjects = getOtherProjects(CROATEL_PROJECT.slug, 2);

  return (
    <div className="croatel-project-page page-rail-group">
      <CroatelHeroSection project={CROATEL_PROJECT} />
      <CaseStudyContextSection
        leadQuote={CROATEL_PROJECT.leadQuote}
        stats={CROATEL_PROJECT.stats}
        contextRow={CROATEL_PROJECT.contextRow}
        insideRows={CROATEL_PROJECT.insideRows}
      />
      <CroatelLightSection lightSection={CROATEL_PROJECT.lightSection} />
      <OtherWorkSection projects={otherProjects} />
      <SiteFooter
        linkGroups={CROATEL_FOOTER_LINKS}
        meta={{
          left: "©Arneo2026",
          right: (
            <span className="project-detail-footer-meta-links">
              <a href="#" className="project-detail-footer-meta-link">
                Terms
              </a>{" "}
              <a href="#" className="project-detail-footer-meta-link">
                Privacy
              </a>
            </span>
          ),
        }}
      />
    </div>
  );
}
