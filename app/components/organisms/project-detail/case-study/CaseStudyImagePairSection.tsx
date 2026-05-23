import ZoomableImage from "@/app/components/molecules/zoomable-image/ZoomableImage";
import type { CaseStudyImagePairProps } from "./case-study.types";

/**
 * Reusable label/paragraph row over a two-up captioned image grid.
 * Neogov uses it for both its AI-integration and Reflection sections —
 * they share identical layout, only the content differs. Server
 * component.
 */
export default function CaseStudyImagePairSection({
  label,
  text,
  images,
}: CaseStudyImagePairProps) {
  return (
    <section className="case-study-image-pair">
      <div className="case-study-rail-container">
        <dl className="case-study-image-pair-row">
          <dt>{label}</dt>
          <dd>{text}</dd>
        </dl>
        <div className="case-study-image-pair-grid">
          {images.map((img, i) => (
            <figure key={i} className="case-study-image-pair-item">
              <ZoomableImage
                src={img.src}
                alt={img.alt}
                width={1000}
                height={1250}
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
