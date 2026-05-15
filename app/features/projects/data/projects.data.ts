import type { Project } from "../project.types";

export const WORK_PROJECTS: Project[] = [
  {
    slug: "neogov",
    title: "Neogov",
    description: "Product Design, Design Systems, Collaboration",
    logo: "/images/projects/logo-neogov.svg",
    images: [
      "/images/work/neogov_work.webp",
      "/images/home/work-project-02.png",
      "/images/home/work-project-03.png",
      "/images/home/work-project-04.png",
    ],
  },
  {
    slug: "elite-digital",
    title: "Elite Digital",
    description: "Web Design, UX Structure, Dev Handoff",
    logo: "/images/projects/logo-eliteDigital.svg",
    images: [
      "/images/work/elite_digital_work.webp",
      "/images/home/work-project-01.png",
      "/images/home/work-project-03.png",
      "/images/home/work-project-04.png",
    ],
  },
  {
    slug: "spona",
    title: "Spona",
    description: "End-to-End, UX Architecture, Platform Design",
    logo: "/images/projects/logo-spona.svg",
    images: [
      "/images/work/spona_work.webp",
      "/images/home/work-project-02.png",
      "/images/home/work-project-01.png",
      "/images/home/work-project-04.png",
    ],
  },
  {
    slug: "croatel",
    title: "Croatel",
    // Listing preview uses `hrt_work.webp` — Croatel was outsourced from
    // HRT, so the asset filename reflects the original project owner
    // even though the project is filed under the Croatel slug. Mobile
    // variant is `hrt_work_small.webp` (derived by `toSmallVariant` in
    // the listing page).
    description: "Broadcast, Motion, TV",
    logo: "/images/projects/logo-croatel.svg",
    images: [
      "/images/work/hrt_work.webp",
      "/images/home/work-project-01.png",
      "/images/home/work-project-02.png",
      "/images/home/work-project-03.png",
    ],
  },
];
