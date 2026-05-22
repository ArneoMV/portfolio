import Image from "next/image";

interface NeogovImagePairSectionProps {
  label: string;
  text: string;
  images: Array<{ src: string; alt: string; caption?: string }>;
}

/**
 * Reusable label/paragraph row over a two-up captioned image grid.
 * Used by both the AI integration and Reflection sections — they
 * share identical layout, only the content differs. Server component.
 */
export default function NeogovImagePairSection({
  label,
  text,
  images,
}: NeogovImagePairSectionProps) {
  return (
    <section className="neogov-image-pair">
      <div className="neogov-rail-container">
        <dl className="neogov-image-pair-row">
          <dt>{label}</dt>
          <dd>{text}</dd>
        </dl>
        <div className="neogov-image-pair-grid">
          {images.map((img, i) => (
            <figure key={i} className="neogov-image-pair-item">
              <Image
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
