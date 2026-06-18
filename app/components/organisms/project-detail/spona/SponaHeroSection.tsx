import ZoomableImage from "@/app/components/molecules/zoomable-image/ZoomableImage";
import ProjectLogo from "@/app/components/molecules/project-logo/ProjectLogo";
import ProjectMetaGrid from "../ProjectMetaGrid";
import type { SponaProjectData } from "@/app/data/spona-project.data";

interface SponaHeroSectionProps {
  project: SponaProjectData;
}

/**
 * Bespoke Spona hero.
 *
 * Top: a light-purple gradient panel — serif tagline + secondary
 * description on the left (white text), composition image on the right.
 * Unlike Neogov's absolute-positioned hero, the composition image stays
 * in normal flow and overflows the panel's BOTTOM edge via a negative
 * margin (see `.spona-hero-top-image` in `_spona-project.scss`).
 *
 * Below the panel: the Spona logo (or an H2 fallback), the "What I
 * built" row, the shared 4-up meta grid, and the "INTRODUCTION" row.
 * No user-profile screenshot (Neogov has one; Spona doesn't).
 *
 * Reuses the shared case-study primitives — `.case-study-rail-container`,
 * `.case-study-hero-row`, `.case-study-hero-meta` — so the rows and meta
 * grid share Neogov's rhythm. Server component.
 */
export default function SponaHeroSection({ project }: SponaHeroSectionProps) {
  const hero = project.heroCompositionImage;
  const logo = project.logo;

  return (
    <section className="spona-hero">
      <div className="case-study-rail-container">
        <div className="spona-hero-top">
          <div className="spona-hero-top-text">
            <h1 className="spona-hero-tagline">{project.tagline}</h1>
            <p className="spona-hero-tagline-desc">
              {project.taglineDescription}
            </p>
          </div>

          <div className="spona-hero-top-image">
            <ZoomableImage
              src={hero.src}
              alt={hero.alt}
              width={900}
              height={620}
              priority
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
        </div>

        {logo ? (
          <h2 className="spona-hero-title spona-hero-title--logo">
            <ProjectLogo
              src={logo.src}
              alt={logo.alt}
              href={logo.href}
              width={logo.width}
              height={logo.height}
            />
          </h2>
        ) : (
          <h2 className="spona-hero-title">{project.title}</h2>
        )}

        <dl className="case-study-hero-row">
          <dt>What I built</dt>
          <dd>{project.description}</dd>
        </dl>

        <div className="case-study-hero-meta">
          <ProjectMetaGrid meta={project.meta} />
        </div>

        <dl className="case-study-hero-row">
          <dt>INTRODUCTION</dt>
          <dd>{project.introduction}</dd>
        </dl>
      </div>
    </section>
  );
}
