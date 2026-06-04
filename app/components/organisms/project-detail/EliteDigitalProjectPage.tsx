import FooterSection from "@/app/components/organisms/footer-home/FooterSection";
import { ELITE_DIGITAL_PROJECT } from "@/app/data/elite-digital-project.data";
import EliteDigitalHeroSection from "./elite-digital/EliteDigitalHeroSection";
import CaseStudyContextSection from "./case-study/CaseStudyContextSection";
import CaseStudyShowcaseSection from "./case-study/CaseStudyShowcaseSection";
import OtherWorkSection from "./OtherWorkSection";
import { getOtherProjects } from "./project-detail.helpers";

/**
 * Dedicated, fully bespoke Elite Digital project page.
 *
 * Composes the Elite Digital-specific hero (full-width banner) with
 * the shared case-study sections (Context → Showcase) and reuses the
 * shared OtherWorkSection + FooterSection for the page tail. The Context
 * section absorbs all of Elite Digital's editorial content — what
 * previously lived in the dark + light sections of the shared
 * template — using insideRows with single inline images (same pattern
 * Croatel uses). No image-pair sections render here: Elite Digital's
 * imagery is single-mockup-per-row (workflow, design-system,
 * client-delivery), not the 2-up captioned pair pattern Neogov uses
 * for AI integration / Reflection.
 *
 * Maps `ELITE_DIGITAL_PROJECT` into the shared case-study props. The
 * Context section has no stats, no outsideRows, and no callout — those
 * four props are wired through for prop-shape parity with the other
 * bespoke pages but resolve to `undefined`. Showcase is conditional
 * on `showcaseImage` (mirrors Neogov's optional-field pattern).
 *
 * `.page-rail-group` (shared) draws the dotted vertical side rails;
 * `.elite-digital-project-page` carries the desktop footer/toolbar
 * bottom clearance the global `.site-main` only reserves on mobile.
 *
 * Other Work cards still come from `PROJECT_DETAILS` (where the
 * minimal Elite Digital entry is retained) — `getOtherProjects` picks
 * the two projects after Elite Digital deterministically, same as the
 * other bespoke routes.
 */
export default function EliteDigitalProjectPage() {
  const otherProjects = getOtherProjects(ELITE_DIGITAL_PROJECT.slug, 2);

  return (
    <div className="elite-digital-project-page page-rail-group">
      <EliteDigitalHeroSection project={ELITE_DIGITAL_PROJECT} />
      {/* Map Elite Digital's existing data shape into the shared
          case-study props. Order matches NeogovProjectPage / Spona:
          lead → stats → context row + images → inside rows → outside
          rows → callout. Elite Digital has no stats / outsideRows /
          callout, so those resolve to undefined and the section
          skips those blocks. */}
      <CaseStudyContextSection
        leadQuote={ELITE_DIGITAL_PROJECT.leadQuote}
        stats={ELITE_DIGITAL_PROJECT.stats}
        contextRow={ELITE_DIGITAL_PROJECT.contextRow}
        insideRows={ELITE_DIGITAL_PROJECT.insideRows}
        outsideRows={ELITE_DIGITAL_PROJECT.outsideRows}
        callout={ELITE_DIGITAL_PROJECT.callout}
      />
      {ELITE_DIGITAL_PROJECT.showcaseImage && (
        <CaseStudyShowcaseSection image={ELITE_DIGITAL_PROJECT.showcaseImage} />
      )}
      <OtherWorkSection projects={otherProjects} />
      <FooterSection />
    </div>
  );
}
