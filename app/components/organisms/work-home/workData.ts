// Data for the WorkSection — project list + screen-position config.
//
// SCREEN_POS values inside the AUTO-GENERATED block are populated by
// `scripts/detect-red-area.ts` (run with `npx tsx scripts/detect-red-area.ts`).
// Do not hand-edit between the markers — re-running the script will
// overwrite anything inside.

export type WorkItem = {
  id: string;
  label: string;
  /** Render the label in the display serif (Young Serif). */
  serif?: boolean;
  subtitle: string;
  images: string[];
};

export type ScreenPosition = {
  top: string;
  left: string;
  width: string;
  height: string;
};

export type ScreenPositions = {
  large: ScreenPosition;
  medium: ScreenPosition;
  small: ScreenPosition;
};

export const WORKS: WorkItem[] = [
  {
    id: "elite-digital",
    label: "Elite Digital",
    serif: true,
    subtitle: "Web Design, UX Structure, Dev Handoff",
    images: [
      "/images/home/work/slideshow/image-1.webp",
      "/images/home/work/slideshow/image-2.webp",
      "/images/home/work/slideshow/image-3.webp",
    ],
  },
  {
    id: "neogov",
    label: "Neogov",
    subtitle: "Product Design, Design Systems, Collaboration",
    images: [
      "/images/home/work/slideshow/image-4.webp",
      "/images/home/work/slideshow/image-5.webp",
      "/images/home/work/slideshow/image-6.webp",
    ],
  },
  {
    id: "spona",
    label: "Spona",
    subtitle: "End-to-End, UX Architecture, Platform Design",
    images: [
      "/images/home/work/slideshow/image-7.webp",
      "/images/home/work/slideshow/image-8.webp",
    ],
  },
  {
    id: "croatel",
    label: "Croatel",
    subtitle: "Broadcast, Motion, TV",
    images: [
      "/images/home/work/slideshow/image-9.webp",
      "/images/home/work/slideshow/image-10.webp",
    ],
  },
];

// >>> AUTO-GENERATED:SCREEN_POS:START — do not edit manually
export const SCREEN_POS: ScreenPositions = {
  large: { top: "18.43%", left: "37.40%", width: "26.04%", height: "36.67%" },
  medium: { top: "17.96%", left: "28.18%", width: "45.45%", height: "36.67%" },
  small: { top: "51.50%", left: "12.50%", width: "74.50%", height: "29.63%" },
};
// >>> AUTO-GENERATED:SCREEN_POS:END
