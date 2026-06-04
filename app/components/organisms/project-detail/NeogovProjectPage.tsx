import FooterSection from "@/app/components/organisms/footer-home/FooterSection";
import { NEOGOV_PROJECT } from "@/app/data/neogov-project.data";
import NeogovHeroSection from "./neogov/NeogovHeroSection";
import CaseStudyContextSection from "./case-study/CaseStudyContextSection";
import CaseStudyShowcaseSection from "./case-study/CaseStudyShowcaseSection";
import CaseStudyImagePairSection from "./case-study/CaseStudyImagePairSection";
import OtherWorkSection from "./OtherWorkSection";
import { getOtherProjects } from "./project-detail.helpers";

/**
 * Dedicated, fully bespoke Neogov project page.
 *
 * Composes the custom Neogov sections (hero → dark Context → NOVI
 * design-system band → AI integration → Reflection) and reuses the
 * shared OtherWorkSection + FooterSection for the page tail. None of the
 * shared `ProjectDetailTemplate` sections are used anymore.
 *
 * The `.neogov-project-page` wrapper carries the desktop
 * footer/toolbar bottom clearance that the shared `.project-detail`
 * article used to provide (the global `.site-main` only reserves
 * toolbar space on mobile). We intentionally do NOT reuse
 * `.project-detail` here because its descendant
 * `:is(h1,h2,…){font-family: sans}` rule would override the Young
 * Serif display heading.
 *
 * `.page-rail-group` (shared, from `_container.scss`) draws the
 * dotted vertical side rails — the same continuous-gradient
 * pseudo-element pair every other project page uses, at the same
 * `calc(50% - 550px)` (1100px box edge) positions, so the rails line
 * up with Elite Digital exactly. They paint at z-index 1 over all
 * descendants, so they run continuously through the full-bleed
 * Context (navy) and NOVI (light-blue) sections in the same grey —
 * identical to how Elite Digital's rails cross its full-bleed dark
 * band. Per-section recolouring isn't possible with this ancestor-
 * pseudo-element technique without breaking the dash continuity, so
 * the uniform grey stays (it reads as a faint line on both coloured
 * backgrounds).
 *
 * Other Work cards still come from PROJECT_DETAILS (where the minimal
 * Neogov entry is retained) — `getOtherProjects` picks the two
 * projects after Neogov deterministically, same as the template route.
 */
export default function NeogovProjectPage() {
  const otherProjects = getOtherProjects(NEOGOV_PROJECT.slug, 2);

  return (
    <div className="neogov-project-page page-rail-group">
      <NeogovHeroSection project={NEOGOV_PROJECT} />
      {/* Map Neogov's existing data shape into the shared case-study
          props. Order reproduces the original Context DOM exactly:
          lead → stats → context row + images → Product work (inside the
          panel) → System impact (outside) → callout. */}
      <CaseStudyContextSection
        leadQuote={NEOGOV_PROJECT.leadQuote}
        stats={NEOGOV_PROJECT.stats}
        contextRow={NEOGOV_PROJECT.contextRow}
        insideRows={
          NEOGOV_PROJECT.productWorkRow
            ? [NEOGOV_PROJECT.productWorkRow]
            : undefined
        }
        outsideRows={
          NEOGOV_PROJECT.systemImpactRow
            ? [NEOGOV_PROJECT.systemImpactRow]
            : undefined
        }
        callout={NEOGOV_PROJECT.callout}
      />
      {NEOGOV_PROJECT.designSystemImage && (
        <CaseStudyShowcaseSection image={NEOGOV_PROJECT.designSystemImage} />
      )}
      {NEOGOV_PROJECT.aiIntegration && (
        <CaseStudyImagePairSection {...NEOGOV_PROJECT.aiIntegration} />
      )}
      {NEOGOV_PROJECT.reflection && (
        <CaseStudyImagePairSection {...NEOGOV_PROJECT.reflection} />
      )}
      <OtherWorkSection projects={otherProjects} />
      <FooterSection />
    </div>
  );
}
