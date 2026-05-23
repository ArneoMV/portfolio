import ZoomableImage from "@/app/components/molecules/zoomable-image/ZoomableImage";
import type { CaseStudyShowcaseProps } from "./case-study.types";

/**
 * Reusable full-bleed showcase image section (the Neogov NOVI band is
 * its first consumer). Sits inside `.case-study-rail-container`, so the
 * image spans rail-to-rail (1100px max), flush with the dotted side
 * rails. No section background — any backdrop is expected to be baked
 * into the image.
 *
 * Two image shapes are supported:
 *   • single `{ src, alt }` — one source across all breakpoints;
 *   • `{ srcLarge, srcSmall, alt }` — a wide-large / tall-small
 *     picture-switch toggled by CSS visibility at the mobile
 *     breakpoint.
 *
 * Server component.
 */
export default function CaseStudyShowcaseSection({
  image,
}: CaseStudyShowcaseProps) {
  if ("srcLarge" in image) {
    return (
      <section className="case-study-showcase">
        <div className="case-study-rail-container">
          <ZoomableImage
            className="case-study-showcase-image case-study-showcase-image--large"
            src={image.srcLarge}
            alt={image.alt}
            width={1600}
            height={1200}
            sizes="(max-width: 1099px) 100vw, 1100px"
          />
          <ZoomableImage
            className="case-study-showcase-image case-study-showcase-image--small"
            src={image.srcSmall}
            alt={image.alt}
            width={600}
            height={1600}
            sizes="100vw"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="case-study-showcase">
      <div className="case-study-rail-container">
        <ZoomableImage
          className="case-study-showcase-image"
          src={image.src}
          alt={image.alt}
          width={1600}
          height={1200}
          sizes="(max-width: 1099px) 100vw, 1100px"
        />
      </div>
    </section>
  );
}
