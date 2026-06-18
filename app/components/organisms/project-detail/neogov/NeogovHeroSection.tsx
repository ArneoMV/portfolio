import ZoomableImage from "@/app/components/molecules/zoomable-image/ZoomableImage";
import ProjectLogo from "@/app/components/molecules/project-logo/ProjectLogo";
import ProjectMetaGrid from "../ProjectMetaGrid";
import type { NeogovProjectData } from "@/app/data/neogov-project.data";

interface NeogovHeroSectionProps {
  project: NeogovProjectData;
}

/**
 * Bespoke Neogov hero.
 *
 * Top row: eyebrow + serif display heading on the left, hero
 * composition image on the right (single source; CSS handles
 * responsive sizing across breakpoints).
 *
 * Below: project title (serif H2), a "What I built" label/desc row,
 * the shared 4-up meta grid, an "INTRODUCTION" label/text row, and a
 * wide Employee-Profile screenshot.
 *
 * Server component — no interactivity.
 */
export default function NeogovHeroSection({ project }: NeogovHeroSectionProps) {
  const hero = project.heroCompositionImage;
  const userProfile = project.userProfileImage;

  return (
    <section className="neogov-hero">
      <div className="case-study-rail-container">
        <div className="neogov-hero-top">
          <div className="neogov-hero-top-text">
            {project.displayHeading && (
              <h1 className="neogov-hero-display">{project.displayHeading}</h1>
            )}
          </div>

          {hero && (
            <div className="neogov-hero-top-image">
              <ZoomableImage
                src={hero.src}
                alt={hero.alt}
                width={565}
                height={308}
                priority
                sizes="(max-width: 767px) 100vw, 573px"
              />
            </div>
          )}
        </div>

        {project.logo ? (
          <div className="neogov-hero-title">
            <ProjectLogo
              src={project.logo.src}
              alt={project.logo.alt}
              href={project.logo.href}
              width={project.logo.width}
              height={project.logo.height}
            />
          </div>
        ) : (
          <h2 className="neogov-hero-title">{project.title}</h2>
        )}

        {/* "What I built" is the bespoke label per the design — not
            the shared template's `typeOfWorkLabel` ("Challenge"),
            which stays in the data only for shared-component
            compatibility. */}
        <dl className="case-study-hero-row">
          <dt>What I built</dt>
          <dd>{project.description}</dd>
        </dl>

        {/* Neogov-scoped wrapper paints dotted top + bottom rules
            (matching the side rails' colour + rhythm) around the
            shared meta grid without touching ProjectMetaGrid. */}
        <div className="case-study-hero-meta">
          <ProjectMetaGrid meta={project.meta} />
        </div>

        <dl className="case-study-hero-row">
          <dt>INTRODUCTION</dt>
          <dd>{project.introduction}</dd>
        </dl>

        {userProfile && (
          <figure className="neogov-hero-user-profile">
            <ZoomableImage
              src={userProfile.src}
              alt={userProfile.alt}
              width={1600}
              height={800}
              sizes="(max-width: 1099px) 100vw, 1100px"
            />
          </figure>
        )}
      </div>
    </section>
  );
}
