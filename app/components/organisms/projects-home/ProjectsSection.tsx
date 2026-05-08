import Image from "next/image";
import Button from "@/app/components/atoms/button/Button";

interface ProjectItem {
  label: string;
  image: string;
  alt: string;
}

/**
 * Client logo entry. `width`/`height` mirror the SVG's intrinsic
 * viewBox so Next/Image renders at the correct aspect ratio; CSS
 * scales each logo down to a shared track height.
 */
interface ClientLogo {
  name: string;
  src: string;
  width: number;
  height: number;
}

// Real project previews drawn from /public/images/home/projects-marquee-image.
// Display order matches the design brief: Neogov first, then the remaining
// active projects, then the recent additions. Labels are stored in their
// natural casing here; the SCSS rule on .projects-marquee-label still
// applies `text-transform: uppercase`, so on-screen casing is unchanged.
// Alt text uses the same natural casing for screen-reader friendliness.
const PROJECT_ITEMS: ProjectItem[] = [
  {
    label: "Neogov",
    image: "/images/home/projects-marquee-image/neogov-04.png",
    alt: "Neogov project preview",
  },
  {
    label: "Elite Digital",
    image: "/images/home/projects-marquee-image/elite-digital-01.png",
    alt: "Elite Digital project preview",
  },
  {
    label: "Spona",
    image: "/images/home/projects-marquee-image/spona-04.png",
    alt: "Spona project preview",
  },
  {
    label: "Azimut International",
    image:
      "/images/home/projects-marquee-image/azimut-international-01.png",
    alt: "Azimut International project preview",
  },
  {
    label: "Union Rail",
    image: "/images/home/projects-marquee-image/union-rail-01.png",
    alt: "Union Rail project preview",
  },
  {
    label: "HRT",
    image: "/images/home/projects-marquee-image/hrt-1.png",
    alt: "HRT project preview",
  },
  {
    label: "Elite Media",
    image: "/images/home/projects-marquee-image/elite-media-04.png",
    alt: "Elite Media project preview",
  },
  {
    label: "Continental Dynamics",
    image:
      "/images/home/projects-marquee-image/continental-dynamics-01.png",
    alt: "Continental Dynamics project preview",
  },
  {
    label: "Dr. Hertzeg",
    image: "/images/home/projects-marquee-image/dr-hertzeg-01.png",
    alt: "Dr. Hertzeg project preview",
  },
];

// Two-row split per design: row 1 = NEOGOV / HRT / Spona, row 2 =
// Croatel / Elite Digital. Width/height match each SVG's viewBox.
const LOGO_ROW_1: ClientLogo[] = [
  {
    name: "NEOGOV",
    src: "/images/home/Neogov_Logo.svg",
    width: 193,
    height: 28,
  },
  { name: "HRT", src: "/images/home/HRT_Logo.svg", width: 66, height: 32 },
  {
    name: "Spona",
    src: "/images/home/Spona_Logo.svg",
    width: 140,
    height: 32,
  },
];

const LOGO_ROW_2: ClientLogo[] = [
  {
    name: "Croatel",
    // Filename typo is intentional — the file ships as Coatel_Logo.svg.
    src: "/images/home/Coatel_Logo.svg",
    width: 185,
    height: 32,
  },
  {
    name: "Elite Digital",
    src: "/images/home/EliteDigital_Logo.svg",
    width: 376,
    height: 30,
  },
];

/**
 * Homepage Projects section — three rows inside the dotted-guide
 * narrow container:
 *   1. Description copy (left) + "Explore work" CTA (right).
 *   2. Infinite left-moving project marquee. Pure CSS keyframes; the
 *      track contains the items duplicated once and translates by
 *      exactly -50% so set 2 lands at set 1's original position
 *      (seamless loop). `overflow: hidden` clips off-screen items at
 *      the container edge so nothing leaks past the page width.
 *   3. Static client logos row.
 *
 * Server component — no client interactivity needed (animation is
 * CSS-only, button uses Next Link via the design-system Button).
 */
export default function ProjectsSection() {
  return (
    <section className="projects-section">
      <div className="projects-container">
        <div className="projects-row projects-row--intro">
          <p className="projects-description">
            Map users, flows, and constraints to understand how everything
            connects. Break down complex problems into clear, structured
            solutions. Break down complex problems into clear, structured
            solutions.
          </p>
          <div className="projects-cta">
            <Button variant="dark" size="sm" href="/work">
              Explore work
            </Button>
          </div>
        </div>

        <div className="projects-row projects-row--marquee">
          <div className="projects-marquee">
            <div className="projects-marquee-track" aria-hidden="false">
              {[...PROJECT_ITEMS, ...PROJECT_ITEMS].map((item, i) => (
                <div
                  key={`${item.label}-${i}`}
                  className="projects-marquee-item"
                  // Duplicates are decorative — only the first set is
                  // exposed to assistive tech.
                  aria-hidden={i >= PROJECT_ITEMS.length || undefined}
                >
                  <div className="projects-marquee-image">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 767px) 70vw, (max-width: 1439px) 40vw, 320px"
                    />
                  </div>
                  <p className="projects-marquee-label">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="projects-row projects-row--logos">
          <div className="projects-logos">
            {[LOGO_ROW_1, LOGO_ROW_2].map((row, rowIndex) => (
              <ul
                key={`logo-row-${rowIndex}`}
                className="projects-logos-row"
              >
                {row.map((logo) => (
                  <li key={logo.name} className="projects-logos-item">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={logo.width}
                      height={logo.height}
                      className="projects-logos-image"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
