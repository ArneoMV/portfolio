import ZoomableImage from "@/app/components/molecules/zoomable-image/ZoomableImage";
import ProjectLogo from "@/app/components/molecules/project-logo/ProjectLogo";
import ProjectMetaGrid from "../ProjectMetaGrid";
import type { CroatelProjectData } from "@/app/data/croatel-project.data";

interface CroatelHeroSectionProps {
  project: CroatelProjectData;
}

/**
 * Bespoke Croatel hero — banner-only, no gradient panel.
 *
 * A wide composition banner sits at the top (purely decorative, no
 * overlay text). The project identity (Croatel wordmark + HRT client
 * logo, side by side) renders BELOW the banner, then the shared
 * "What I built" row, meta grid, and "INTRODUCTION" row.
 *
 * Reuses the shared case-study primitives (`.case-study-rail-container`,
 * `.case-study-hero-row`, `.case-study-hero-meta`). Server component.
 */
export default function CroatelHeroSection({
  project,
}: CroatelHeroSectionProps) {
  return (
    <section className="croatel-hero">
      <div className="case-study-rail-container">
        <div className="croatel-hero-banner">
          <ZoomableImage
            src={project.heroBannerImage.src}
            alt={project.heroBannerImage.alt}
            width={1600}
            height={400}
            priority
            sizes="(max-width: 1099px) 100vw, 1100px"
          />
        </div>

        <div className="croatel-hero-logos">
          <ProjectLogo
            className="croatel-hero-logo-main"
            src={project.croatelLogo.src}
            alt={project.croatelLogo.alt}
            href={project.croatelLogo.href}
            width={project.croatelLogo.width}
            height={project.croatelLogo.height}
          />
          <ProjectLogo
            className="croatel-hero-logo-secondary"
            src={project.hrtLogo.src}
            alt={project.hrtLogo.alt}
            href={project.hrtLogo.href}
            width={project.hrtLogo.width}
            height={project.hrtLogo.height}
          />
        </div>

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
