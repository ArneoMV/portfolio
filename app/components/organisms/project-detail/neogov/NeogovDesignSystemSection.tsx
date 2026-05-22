import Image from "next/image";
import type { NeogovProjectData } from "@/app/data/neogov-project.data";

interface NeogovDesignSystemSectionProps {
  project: NeogovProjectData;
}

/**
 * NOVI design-system section.
 *
 * The NOVI heading, palette, components, and mobile screens — plus
 * the light-blue backdrop — are all baked into the composite image,
 * so JSX renders only the image (no section background). Sits inside
 * `.neogov-rail-container`, so the image spans rail-to-rail (1100px
 * max), flush with the dotted side rails. Two source files (wide
 * large / tall small) toggled by CSS visibility, same picture-switch
 * approach as the hero. Server component.
 */
export default function NeogovDesignSystemSection({
  project,
}: NeogovDesignSystemSectionProps) {
  const ds = project.designSystemImage;
  if (!ds) return null;

  return (
    <section className="neogov-design-system">
      <div className="neogov-rail-container">
        <Image
          className="neogov-design-system-image neogov-design-system-image--large"
          src={ds.srcLarge}
          alt={ds.alt}
          width={1600}
          height={1200}
          sizes="(max-width: 1099px) 100vw, 1100px"
        />
        <Image
          className="neogov-design-system-image neogov-design-system-image--small"
          src={ds.srcSmall}
          alt={ds.alt}
          width={600}
          height={1600}
          sizes="100vw"
        />
      </div>
    </section>
  );
}
