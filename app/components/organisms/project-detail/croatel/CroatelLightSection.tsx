import ZoomableImage from "@/app/components/molecules/zoomable-image/ZoomableImage";
import type { CroatelProjectData } from "@/app/data/croatel-project.data";

interface CroatelLightSectionProps {
  lightSection: CroatelProjectData["lightSection"];
}

/**
 * Bespoke Croatel light section — alternates label/text rows with
 * different image treatments (not the shared image-pair pattern):
 *
 *   • Brand fluency   → text row + single full-width image
 *   • Volume and pace → text row + vertical stack of 6 banner images
 *   • What it set up   → text row + two TV mockups side by side
 *   • Reflection       → text row + image(s) + a final paragraph
 *
 * Reuses the shared `.case-study-context-row` for the label/text rows
 * (background-neutral, so they read as dark text on the light section).
 * Server component.
 */
export default function CroatelLightSection({
  lightSection,
}: CroatelLightSectionProps) {
  const { brandFluency, volumeAndPace, whatItSetUp, reflection } = lightSection;

  return (
    <section className="croatel-light">
      <div className="case-study-rail-container">
        {/* Brand fluency — text row + single image */}
        <dl className="case-study-context-row">
          <dt>{brandFluency.label}</dt>
          <dd>{brandFluency.text}</dd>
        </dl>
        <div className="croatel-light-image">
          <ZoomableImage
            src={brandFluency.image.src}
            alt={brandFluency.image.alt}
            width={1600}
            height={900}
            sizes="(max-width: 1099px) 100vw, 1100px"
          />
        </div>

        {/* Volume and pace — text row + 6-image vertical stack */}
        <dl className="case-study-context-row">
          <dt>{volumeAndPace.label}</dt>
          <dd>{volumeAndPace.text}</dd>
        </dl>
        <div className="croatel-light-stack">
          {volumeAndPace.imageStack.map((img, i) => (
            <ZoomableImage
              key={i}
              src={img.src}
              alt={img.alt}
              width={1600}
              height={200}
              sizes="(max-width: 1099px) 100vw, 1100px"
            />
          ))}
        </div>

        {/* What it set up — text row + 2 side-by-side TV mockups */}
        <dl className="case-study-context-row">
          <dt>{whatItSetUp.label}</dt>
          <dd>{whatItSetUp.text}</dd>
        </dl>
        <div className="croatel-light-pair">
          {whatItSetUp.images.map((img, i) => (
            <figure key={i} className="croatel-light-pair-item">
              <ZoomableImage
                src={img.src}
                alt={img.alt}
                width={1000}
                height={750}
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </figure>
          ))}
        </div>

        {/* Reflection — text row + optional images + final paragraph */}
        <dl className="case-study-context-row">
          <dt>{reflection.label}</dt>
          <dd>{reflection.text}</dd>
        </dl>
        {reflection.images.length > 0 && (
          <div className="croatel-light-stack">
            {reflection.images.map((img, i) => (
              <ZoomableImage
                key={i}
                src={img.src}
                alt={img.alt}
                width={1600}
                height={400}
                sizes="(max-width: 1099px) 100vw, 1100px"
              />
            ))}
          </div>
        )}
        <p className="croatel-light-final-paragraph">
          {reflection.finalParagraph}
        </p>
      </div>
    </section>
  );
}
