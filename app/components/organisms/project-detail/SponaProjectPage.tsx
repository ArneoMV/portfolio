import FooterSection from "@/app/components/organisms/footer-home/FooterSection";
import { SPONA_PROJECT } from "@/app/data/spona-project.data";
import SponaHeroSection from "./spona/SponaHeroSection";
import CaseStudyContextSection from "./case-study/CaseStudyContextSection";
import CaseStudyShowcaseSection from "./case-study/CaseStudyShowcaseSection";
import CaseStudyImagePairSection from "./case-study/CaseStudyImagePairSection";
import OtherWorkSection from "./OtherWorkSection";
import { getOtherProjects } from "./project-detail.helpers";

/**
 * Dedicated, fully bespoke Spona project page.
 *
 * Composes the Spona-specific hero with the shared case-study sections
 * (Context → Showcase → two Image-pair sections) and reuses the shared
 * OtherWorkSection + FooterSection for the page tail. Mirrors
 * `NeogovProjectPage`'s structure, including the `.page-rail-group`
 * wrapper that draws the dotted vertical side rails and the desktop
 * footer/toolbar bottom clearance carried by `.spona-project-page`.
 *
 * Maps `SPONA_PROJECT` into the shared case-study props. Spona's
 * Context section has only inside-panel rows (Work scope / Scale
 * challenge / Design decisions) and no callout — `outsideRows` and
 * `callout` are wired through for prop-shape parity with
 * `NeogovProjectPage` but resolve to `undefined` until Spona has
 * matching content. Showcase + both image-pair sections are
 * unconditional because their data fields are required on Spona
 * (unlike Neogov, where they're optional and rendered conditionally).
 */
export default function SponaProjectPage() {
  const otherProjects = getOtherProjects(SPONA_PROJECT.slug, 2);

  return (
    <div className="spona-project-page page-rail-group">
      <SponaHeroSection project={SPONA_PROJECT} />
      {/* Map Spona's existing data shape into the shared case-study
          props. Order matches NeogovProjectPage: lead → stats → context
          row + images → inside rows → outside rows → callout. Spona has
          no outsideRows / callout content yet, so those two resolve to
          undefined and the section gracefully skips those blocks. */}
      <CaseStudyContextSection
        leadQuote={SPONA_PROJECT.leadQuote}
        stats={SPONA_PROJECT.stats}
        contextRow={SPONA_PROJECT.contextRow}
        insideRows={SPONA_PROJECT.insideRows}
        outsideRows={SPONA_PROJECT.outsideRows}
        callout={SPONA_PROJECT.callout}
      />
      <CaseStudyShowcaseSection image={SPONA_PROJECT.showcaseImage} />
      <CaseStudyImagePairSection {...SPONA_PROJECT.crossBorder} />
      <CaseStudyImagePairSection {...SPONA_PROJECT.reflection} />
      <OtherWorkSection projects={otherProjects} />
      <FooterSection />
    </div>
  );
}
