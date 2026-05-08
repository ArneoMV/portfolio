import type {
  ProjectDetail,
  ProjectDetailDarkBlock,
} from "@/app/components/organisms/project-detail/project-detail.types";

const SHARED_INTRO =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const SHARED_DARK_LEFT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const SHARED_DARK_BLOCK_TEXT_1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const SHARED_DARK_BLOCK_TEXT_2 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

const SHARED_DARK_BLOCK_TEXT_3 =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.";

const SHARED_DARK_BLOCK_TEXT_4 =
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.";

/**
 * Build the dark-section right-column block list for a project.
 * 4 text + 3 image blocks (alternating text/image/text/...) gives
 * the desktop pin behaviour enough vertical content to demonstrate
 * the scroll-driven track translation across multiple paragraphs
 * and visuals — track height ends up roughly 2× the section's
 * available height at 1080p, so `maxY` is meaningfully positive
 * and the pin reads as a clear scrub instead of a tiny nudge.
 * Alt text is parameterised per project so SR users hear the right
 * project name; copy itself is shared placeholder until each
 * project's real case-study content lands.
 */
function makeDarkRightBlocks(altPrefix: string): ProjectDetailDarkBlock[] {
  return [
    { type: "text", content: SHARED_DARK_BLOCK_TEXT_1 },
    { type: "image", alt: `${altPrefix} interface detail` },
    { type: "text", content: SHARED_DARK_BLOCK_TEXT_2 },
    { type: "image", alt: `${altPrefix} visual detail` },
    { type: "text", content: SHARED_DARK_BLOCK_TEXT_3 },
    { type: "image", alt: `${altPrefix} process detail` },
    { type: "text", content: SHARED_DARK_BLOCK_TEXT_4 },
  ];
}

// Manual project-detail entries. Slugs match WORK_PROJECTS so the
// listing page's <WorkCard> links resolve, generateStaticParams
// builds every detail route, and getOtherProjects can wrap around
// the same ordered list. Copy is placeholder for Task 1; replace
// per-project as real content arrives.
export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    slug: "neogov",
    title: "Neogov",
    typeLabel: "Type of work",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    heroImage: "/images/home/work-project-01.png",
    heroImageAlt: "Neogov project preview",
    meta: {
      responsibility: "UI/UX Design",
      projectType: "Website design",
      industry: "Sports & Activity",
      timeline: "3 weeks",
    },
    introduction: SHARED_INTRO,
    darkSection: {
      leftText: SHARED_DARK_LEFT,
      rightBlocks: makeDarkRightBlocks("Neogov"),
    },
    tags: ["UI Design"],
  },
  {
    slug: "elite-digital",
    title: "Elite Digital",
    typeLabel: "Type of work",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    heroImage: "/images/home/work-project-02.png",
    heroImageAlt: "Elite Digital project preview",
    meta: {
      responsibility: "Web Design",
      projectType: "Marketing site",
      industry: "Digital Agency",
      timeline: "4 weeks",
    },
    introduction: SHARED_INTRO,
    darkSection: {
      leftText: SHARED_DARK_LEFT,
      rightBlocks: makeDarkRightBlocks("Elite Digital"),
    },
    tags: ["Web Design"],
  },
  {
    slug: "spona",
    title: "Spona",
    typeLabel: "Type of work",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    heroImage: "/images/home/work-project-03.png",
    heroImageAlt: "Spona project preview",
    meta: {
      responsibility: "End-to-End Design",
      projectType: "Platform Design",
      industry: "B2B SaaS",
      timeline: "8 weeks",
    },
    introduction: SHARED_INTRO,
    darkSection: {
      leftText: SHARED_DARK_LEFT,
      rightBlocks: makeDarkRightBlocks("Spona"),
    },
    tags: ["Platform"],
  },
  {
    slug: "croatel",
    title: "Croatel",
    typeLabel: "Type of work",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    heroImage: "/images/home/work-project-04.png",
    heroImageAlt: "Croatel project preview",
    meta: {
      responsibility: "UI Design",
      projectType: "Broadcast",
      industry: "Television",
      timeline: "2 weeks",
    },
    introduction: SHARED_INTRO,
    darkSection: {
      leftText: SHARED_DARK_LEFT,
      rightBlocks: makeDarkRightBlocks("Croatel"),
    },
    tags: ["UI Design"],
  },
  {
    slug: "metro-ui-library",
    title: "Metro UI Library",
    typeLabel: "Type of work",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    heroImage: "/images/home/work-project-01.png",
    heroImageAlt: "Metro UI Library preview",
    meta: {
      responsibility: "Design Systems",
      projectType: "Component Library",
      industry: "Internal Tooling",
      timeline: "6 weeks",
    },
    introduction: SHARED_INTRO,
    darkSection: {
      leftText: SHARED_DARK_LEFT,
      rightBlocks: makeDarkRightBlocks("Metro UI"),
    },
    tags: ["Design System"],
  },
  {
    slug: "glasacki-list",
    title: "Glasački list",
    typeLabel: "Type of work",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    heroImage: "/images/home/work-project-02.png",
    heroImageAlt: "Glasački list preview",
    meta: {
      responsibility: "Information Design",
      projectType: "Civic Tech",
      industry: "Public Sector",
      timeline: "5 weeks",
    },
    introduction: SHARED_INTRO,
    darkSection: {
      leftText: SHARED_DARK_LEFT,
      rightBlocks: makeDarkRightBlocks("Glasački list"),
    },
    tags: ["Information Design"],
  },
];
