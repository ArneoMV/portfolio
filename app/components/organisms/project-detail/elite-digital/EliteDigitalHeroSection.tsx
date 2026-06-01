import ZoomableImage from "@/app/components/molecules/zoomable-image/ZoomableImage";
import ProjectMetaGrid from "../ProjectMetaGrid";
import type { EliteDigitalProjectData } from "@/app/data/elite-digital-project.data";

interface EliteDigitalHeroSectionProps {
  project: EliteDigitalProjectData;
}

/**
 * Bespoke Elite Digital hero — the THIRD hero variant.
 *
 * Top: a single full-width banner image sitting in normal flow,
 * touching both rails. NO absolute float (Neogov) and NO bottom-
 * overflow (Spona) — the image is the visual subject and the
 * surrounding rows follow Neogov / Spona's shared rhythm.
 *
 * Below: project title (serif H1 — Elite Digital has no eyebrow /
 * display heading above it, so the title carries the page's primary
 * heading), the "What I built" label/desc row, the shared 4-up meta
 * grid, and the "INTRODUCTION" row. Reuses the case-study primitives
 * — `.case-study-rail-container`, `.case-study-hero-row`,
 * `.case-study-hero-meta` — so all three bespoke project pages share
 * row rhythm and meta-grid framing. Server component.
 */
export default function EliteDigitalHeroSection({
  project,
}: EliteDigitalHeroSectionProps) {
  const hero = project.heroImage;

  return (
    <section className="elite-digital-hero">
      <div className="case-study-rail-container">
        <div className="elite-digital-hero-top">
          <ZoomableImage
            src={hero.src}
            alt={hero.alt}
            width={1108}
            height={320}
            priority
            sizes="(max-width: 1099px) 100vw, 1100px"
          />
        </div>

        <h1 className="elite-digital-hero-title">{project.title}</h1>

        {/* "What I built" — same bespoke label Neogov + Spona render,
            kept hardcoded so the data shape doesn't need a duplicate
            `typeOfWorkLabel` field. */}
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
