import Image from "next/image";
import Button from "@/app/components/atoms/button/Button";

interface ProjectItem {
  label: string;
  image: string;
  alt: string;
  // HRT screenshots ship at 500×240 instead of the 320×240 standard.
  // `wide: true` adds the `.projects-marquee-item--wide` modifier, which
  // bumps the card width clamp and overrides the image's 4/3 aspect to
  // 25/12 so the native HRT framing is preserved without cropping.
  wide?: boolean;
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
// Order interleaves the three HRT entries with the eight single-client
// entries so no two adjacent cards share a client and the wider HRT cards
// (positions 1 / 5 / 9, spacing of four) read as evenly distributed across
// the loop. The marquee duplicates the array once for a seamless wrap; the
// loop boundary (position 11 → position 1 = Dr. Hertzeg → HRT) is also a
// different-client transition, so the duplicated set doesn't violate the
// no-adjacent rule either. Labels are stored in natural casing here; the
// SCSS rule on `.projects-marquee-label` still applies `text-transform:
// uppercase`, so on-screen casing is unchanged. Alt text uses the same
// natural casing for screen-reader friendliness.
const PROJECT_ITEMS: ProjectItem[] = [
  {
    label: "HRT",
    image: "/images/home/projects-marquee-image/hrt-1.png",
    alt: "HRT project preview",
    wide: true,
  },
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
    label: "HRT",
    image: "/images/home/projects-marquee-image/hrt-2.png",
    alt: "HRT project preview",
    wide: true,
  },
  {
    label: "Azimut International",
    image: "/images/home/projects-marquee-image/azimut-international-01.png",
    alt: "Azimut International project preview",
  },
  {
    label: "Union Rail",
    image: "/images/home/projects-marquee-image/union-rail-01.png",
    alt: "Union Rail project preview",
  },
  {
    label: "Continental Dynamics",
    image: "/images/home/projects-marquee-image/continental-dynamics-01.png",
    alt: "Continental Dynamics project preview",
  },
  {
    label: "HRT",
    image: "/images/home/projects-marquee-image/hrt-3.png",
    alt: "HRT project preview",
    wide: true,
  },
  {
    label: "Elite Media",
    image: "/images/home/projects-marquee-image/elite-media-04.png",
    alt: "Elite Media project preview",
  },
  {
    label: "Dr. Hertzeg",
    image: "/images/home/projects-marquee-image/dr-hertzeg-01.png",
    alt: "Dr. Hertzeg project preview",
  },
];

// Individual logo entries — width/height match each SVG's viewBox.
// Desktop and mobile arrange these into different row groupings (see
// LOGO_ROWS_DESKTOP / LOGO_ROWS_MOBILE below) without duplicating data.
const LOGO_NEOGOV: ClientLogo = {
  name: "NEOGOV",
  src: "/images/home/Neogov_Logo.svg",
  width: 193,
  height: 28,
};
const LOGO_HRT: ClientLogo = {
  name: "HRT",
  src: "/images/home/HRT_Logo.svg",
  width: 66,
  height: 32,
};
const LOGO_SPONA: ClientLogo = {
  name: "Spona",
  src: "/images/home/Spona_Logo.svg",
  width: 140,
  height: 32,
};
const LOGO_CROATEL: ClientLogo = {
  name: "Croatel",
  // Filename typo is intentional — the file ships as Coatel_Logo.svg.
  src: "/images/home/Coatel_Logo.svg",
  width: 185,
  height: 32,
};
const LOGO_ELITE_DIGITAL: ClientLogo = {
  name: "Elite Digital",
  src: "/images/home/EliteDigital_Logo.svg",
  width: 376,
  height: 30,
};

// Desktop layout: row 1 = NEOGOV / HRT / Spona, row 2 = Croatel / Elite Digital.
const LOGO_ROWS_DESKTOP: ClientLogo[][] = [
  [LOGO_NEOGOV, LOGO_HRT, LOGO_SPONA],
  [LOGO_CROATEL, LOGO_ELITE_DIGITAL],
];

// Mobile layout (per design): row 1 = Neogov / Spona, row 2 = Elite Digital
// (full width — too wide to share a row with another logo at 21px height),
// row 3 = HRT / Croatel. Two trees rendered; CSS toggles display so only
// the layout matching the current breakpoint is in the accessibility tree.
const LOGO_ROWS_MOBILE: ClientLogo[][] = [
  [LOGO_NEOGOV, LOGO_SPONA],
  [LOGO_ELITE_DIGITAL],
  [LOGO_HRT, LOGO_CROATEL],
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
            I design digital products, build websites, and create AI workflows
            that help businesses simplify work, move faster, and deliver better
            experiences.
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
                  className={`projects-marquee-item${
                    item.wide ? " projects-marquee-item--wide" : ""
                  }`}
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
          {/* Two trees — one for ≥768px, one for ≤767px — toggled via
              `display: none` on the inactive variant in _projects.scss.
              `display: none` removes the inactive tree from the
              accessibility tree as well, so screen readers see exactly
              one logo grid (no duplicates, no aria-hidden bookkeeping). */}
          <div className="projects-logos projects-logos--desktop">
            {LOGO_ROWS_DESKTOP.map((row, rowIndex) => (
              <ul
                key={`logo-row-desktop-${rowIndex}`}
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
          <div className="projects-logos projects-logos--mobile">
            {LOGO_ROWS_MOBILE.map((row, rowIndex) => (
              <ul
                key={`logo-row-mobile-${rowIndex}`}
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
