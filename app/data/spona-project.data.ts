import type { ProjectDetailMeta } from "@/app/components/organisms/project-detail/project-detail.types";
import type {
  CaseStudyStat,
  CaseStudyTextRow,
  CaseStudyImage,
  CaseStudyShowcaseImage,
} from "@/app/components/organisms/project-detail/case-study/case-study.types";

/**
 * Standalone data shape for the Spona case study.
 *
 * Like Neogov, Spona renders through a dedicated bespoke page
 * (`SponaProjectPage`) rather than the shared `ProjectDetailTemplate`.
 * The hero is Spona-specific (gradient tagline panel + in-column
 * composition image — NO absolute overflow, unlike Neogov); the
 * Context / Showcase / Image-pair sections are the shared
 * `case-study/*` components, so this type composes the case-study
 * sub-types directly.
 *
 * The minimal Spona entry in `PROJECT_DETAILS` is retained as the
 * source for `generateStaticParams`, `generateMetadata`, and the
 * "Other Work" cards; THIS constant is the source of truth for the
 * /work/spona detail page.
 */
export interface SponaProjectData {
  slug: string;
  title: string;
  meta: ProjectDetailMeta;
  /** "What I built" row body. */
  description: string;
  introduction: string;

  /* ── Hero ─────────────────────────────────────────────────── */
  /** Large serif tagline inside the gradient panel. */
  tagline: string;
  /** Secondary sans paragraph under the tagline. */
  taglineDescription: string;
  /** In-column composition image (right side of the panel). */
  heroCompositionImage: { src: string; alt: string };
  /** Optional brand logo used as the title below the panel. When
   *  absent the hero falls back to an H2 with `title`. SVG dimensions
   *  match the file's viewBox so next/image keeps the aspect ratio. */
  logo?: { src: string; alt: string; width: number; height: number };

  /* ── Context section (CaseStudyContextSection) ────────────── */
  leadQuote: string;
  stats: CaseStudyStat[];
  contextRow: CaseStudyTextRow & { images: CaseStudyImage[] };
  /** Additional label/text rows inside the navy panel (Work scope,
   *  Scale challenge, Design decisions). */
  insideRows: CaseStudyTextRow[];
  /** Optional label/text rows rendered OUTSIDE the navy panel.
   *  Currently unused on Spona — kept here so the shape parities with
   *  the shared `CaseStudyContextSection` prop surface (and Neogov's
   *  data), letting future content drop in without a type change. */
  outsideRows?: CaseStudyTextRow[];
  /** Optional brand-coloured callout aligned to the right column.
   *  Currently unused on Spona — kept for parity with the shared
   *  Context section, same rationale as `outsideRows` above. */
  callout?: string;

  /* ── Showcase (CaseStudyShowcaseSection) ──────────────────── */
  /** Single wide illustration (no small picture-switch variant). */
  showcaseImage: CaseStudyShowcaseImage;

  /* ── Image-pair sections (CaseStudyImagePairSection) ──────── */
  crossBorder: { label: string; text: string; images: CaseStudyImage[] };
  reflection: { label: string; text: string; images: CaseStudyImage[] };
}

export const SPONA_PROJECT: SponaProjectData = {
  slug: "spona",
  title: "Spona",
  meta: {
    responsibility: "Product Design",
    projectType: "B2B SaaS Platform",
    industry: "B2B Marketplace",
    year: "2022-2024",
  },
  description:
    "Global B2B platform for hiring agencies and managing digital projects. Worked on the product structure that scaled it to a network of 10K+ agencies.",
  introduction:
    "Spona is a global B2B platform connecting businesses with vetted digital agencies for marketing, web development, and branding. I joined as product designer, shaping a structure that holds up as the network scales from hundreds to thousands.",

  // ── Hero ──────────────────────────────────────────────────
  tagline: "Two sides, one system.",
  taglineDescription:
    "Spona connects businesses with the digital agencies that build their products, and handles everything in between.",
  heroCompositionImage: {
    src: "/images/projects/spona/spona_hero_image.png",
    alt: "Spona platform dashboards showing project briefs, agency profiles, and reporting",
  },
  // Brand-purple recolour of the full Spona lockup (icon + wordmark).
  // Source `Spona_Logo.svg` ships greyscale (#9AA3AF wordmark, #56606D
  // icon); `spona-logo-purple.svg` swaps both to brand purple #6D50F6
  // to match the design + panel gradient. Swap `src`/dimensions here if
  // a different lockup is provided.
  logo: {
    src: "/images/projects/spona/spona-logo-purple.svg",
    alt: "Spona",
    width: 140,
    height: 32,
  },

  // ── Context ───────────────────────────────────────────────
  leadQuote:
    "Designing a marketplace that has to work for two sides at once means every decision serves two audiences. What feels intuitive for one side often complicates things for the other.",
  stats: [
    { value: "10,000+", label: "agencies", variant: "stat" },
    { value: "50+", label: "design components", variant: "stat" },
    { value: "4 layers", label: "Atomic design", variant: "stat" },
  ],
  contextRow: {
    label: "Context",
    text: "Spona is a two-sided marketplace where businesses hire agencies for digital projects. The platform handles discovery, contracts, milestone tracking, payments, and delivery. I worked across both sides, defining how each user type moved through the system and where their workflows intersected.",
    images: [
      {
        src: "/images/projects/spona/spona_mockup_03.png",
        alt: "Spona project dashboard on a laptop",
      },
    ],
  },
  insideRows: [
    {
      label: "Work scope",
      text: "User flows, information architecture, and interface structure across the platform's core modules: project briefs, agency profiles, proposals, contracts, milestone management, payments, and reporting. Each module had to stand on its own but connect cleanly to the others, since most users moved between them daily.",
    },
    {
      label: "Scale challenge",
      text: "The platform grew quickly, from a small set of agencies to a network of more than 10,000. That kind of growth surfaces structural questions early. How do you organize agency profiles when there are thousands? How does search work when supply scales faster than demand? How do you keep workflows predictable across wildly different project types?",
    },
    {
      label: "Design decisions",
      text: "The work was about creating a structure flexible enough to handle different project sizes and shapes, but consistent enough that users always knew where they were. Project briefs were templated but customizable. Contracts and milestones followed a shared pattern. Communication threads were tied to specific deliverables, not free-form chats.",
    },
  ],

  // ── Showcase ──────────────────────────────────────────────
  showcaseImage: {
    src: "/images/projects/spona/spona_components_ilustration.png",
    alt: "Spona components showcase including project cards, dashboards, expense tracking, and project status UI",
  },

  // ── Image-pair sections ───────────────────────────────────
  crossBorder: {
    label: "Cross-border complexity",
    text: "Spona operated across borders, contract types, compliance requirements, and communication norms. Design choices that work for a local platform start to break down at international scale, and we kept finding new edges.",
    images: [
      {
        src: "/images/projects/spona/spona_mockup_04.png",
        alt: "End-to-end project management interface on laptop",
        caption: "End-To-End Project Management",
      },
      {
        src: "/images/projects/spona/spona_mockup_02.png",
        alt: "Spona company profile page on monitor",
        caption: " End-to-End (E2E)",
      },
    ],
  },
  reflection: {
    label: "Reflection",
    text: "Spona taught me what it takes to design for two audiences at once. The platform keeps growing into new edges of the marketplace, and what stays valuable through that growth is the underlying structure: how information is organized, and the patterns users learn to rely on.",
    images: [
      {
        src: "/images/projects/spona/spona_mockup_05.png",
        alt: "Spona Projects view on iMac with red background",
        caption: "Projects",
      },
      {
        src: "/images/projects/spona/spona_mockup_06.png",
        alt: "Spona login screen with welcome message on laptop",
        caption: "Login",
      },
    ],
  },
};
