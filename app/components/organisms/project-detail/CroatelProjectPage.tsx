import FooterSection from "@/app/components/organisms/footer-home/FooterSection";
import { CROATEL_PROJECT } from "@/app/data/croatel-project.data";
import CroatelHeroSection from "./croatel/CroatelHeroSection";
import CaseStudyContextSection from "./case-study/CaseStudyContextSection";
import CroatelLightSection from "./croatel/CroatelLightSection";
import OtherWorkSection from "./OtherWorkSection";
import { getOtherProjects } from "./project-detail.helpers";

/**
 * Dedicated, fully bespoke Croatel / HRT project page.
 *
 * Composes the banner-only Croatel hero with the shared dark Context
 * section (whose `insideRows` interleave a row + image) and the bespoke
 * `CroatelLightSection`, then reuses the shared OtherWorkSection +
 * FooterSection for the page tail. Mirrors `NeogovProjectPage` /
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
      <FooterSection />
    </div>
  );
}
