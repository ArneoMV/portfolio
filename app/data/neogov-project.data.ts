import type {
  ProjectDetailMeta,
  ProjectDetailDarkSection,
  ProjectDetailLightSection,
} from "@/app/components/organisms/project-detail/project-detail.types";

/**
 * Standalone data shape for the Neogov case study.
 *
 * Neogov is the signature project and gets its own custom page
 * (`NeogovProjectPage`) instead of the shared `ProjectDetailTemplate`.
 * This type currently MIRRORS `ProjectDetail` field-for-field (reusing
 * its sub-types) so `NEOGOV_PROJECT` stays structurally assignable to
 * the shared section components (`ProjectHeroSection`,
 * `ProjectDarkSection`, …) during this infrastructure phase — the
 * page renders identically to before, just through a dedicated
 * component.
 *
 * Because it's a separate, Neogov-only type, future tasks can add
 * custom fields here (e.g. stat rows, callouts, two-column text
 * blocks) WITHOUT widening the shared `ProjectDetail` type or
 * affecting the other three projects. When those custom fields land,
 * the page will read them directly rather than passing the whole
 * object to a shared `ProjectDetail`-typed component.
 */
export interface NeogovProjectData {
  slug: string;
  title: string;
  typeOfWorkLabel?: string;
  description: string;
  heroImage?: string;
  heroImageAlt?: string;
  meta: ProjectDetailMeta;
  introduction: string;
  darkSection: ProjectDetailDarkSection;
  lightSection?: ProjectDetailLightSection;
  tags?: string[];

  /* ─── Bespoke Neogov page fields ───────────────────────────
     All optional so the type stays structurally compatible with
     the shared `ProjectDetail`-typed components (the existing
     fields above remain a valid superset). The custom
     `NeogovProjectPage` reads these directly; the shared template
     never sees them. */

  /** Small uppercase label above the display heading ("NEOGOV"). */
  eyebrow?: string;
  /** Large serif hero heading. */
  displayHeading?: string;
  /** Hero composition image — single source (the design uses one
      image across breakpoints; CSS handles responsive sizing). */
  heroCompositionImage?: { src: string; alt: string };
  /** Wide Employee-Profile screenshot below the introduction row. */
  userProfileImage?: { src: string; alt: string };
  /** Dark-section stat row. `variant` controls value/label order:
      "stat" = big number on top, "meta" = small label on top. */
  stats?: Array<{ value: string; label: string; variant?: "stat" | "meta" }>;
  /** Large lead quote opening the dark Context section. */
  leadQuote?: string;
  /** Context row — label + paragraph + an image pair below it. */
  contextRow?: {
    label: string;
    text: string;
    images: Array<{ src: string; alt: string }>;
  };
  /** "Product work" label/paragraph row (dark section). */
  productWorkRow?: { label: string; text: string };
  /** "System impact" label/paragraph row (dark section). */
  systemImpactRow?: { label: string; text: string };
  /** Brand-coloured callout box aligned to the right column. */
  callout?: string;
  /** NOVI design-system composite — wide large + tall small source. */
  designSystemImage?: { srcLarge: string; srcSmall: string; alt: string };
  /** AI integration section — label/paragraph + captioned image pair. */
  aiIntegration?: {
    label: string;
    text: string;
    images: Array<{ src: string; alt: string; caption: string }>;
  };
  /** Reflection section — label/paragraph + captioned image pair. */
  reflection?: {
    label: string;
    text: string;
    images: Array<{ src: string; alt: string; caption: string }>;
  };
}

/**
 * Neogov case-study content. Copied verbatim from the Neogov entry
 * that still lives in `PROJECT_DETAILS` so the dedicated page renders
 * identically to the pre-split output (no visual regression). The
 * `PROJECT_DETAILS` Neogov entry is intentionally retained as the
 * source for the /work listing's "Other Work" cards + static params;
 * THIS constant is the source of truth for the /work/neogov detail
 * page from now on. Edit case-study content here, not there.
 *
 * `darkSection` is still first-pass placeholder lorem (same as the
 * other un-authored projects) — real Neogov copy + imagery land in a
 * later task. No `lightSection` yet, matching current output.
 */
export const NEOGOV_PROJECT: NeogovProjectData = {
  slug: "neogov",
  title: "Neogov",
  typeOfWorkLabel: "Challenge",
  description:
    "Enterprise HR SaaS used by 13,000+ US public sector agencies. Worked across product flows and the design system that holds them together.",
  heroImage: "/images/home/work-project-01.png",
  heroImageAlt: "Neogov project preview",
  meta: {
    responsibility: "Product Design",
    projectType: "Enterprise SaaS",
    industry: "Government / HR Tech",
    year: "2024-2026",
  },
  introduction:
    "NEOGOV is the HR platform behind counties, school districts, and city halls across the United States. I started on product flows for eForms, Onboard, and Analytics, then joined the design system team to work on the patterns and components those products share. A lot of the work came down to one question: how do you change something in one place without breaking it in five others. Toward the end I helped coordinate AI feature integration across the platform, which mostly meant translating product decisions into design system patterns that could actually scale.",
  darkSection: {
    leftText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    rightBlocks: [
      {
        type: "text",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
      { type: "image", alt: "Neogov interface detail" },
      {
        type: "text",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      },
      { type: "image", alt: "Neogov visual detail" },
      {
        type: "text",
        content:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      },
      { type: "image", alt: "Neogov process detail" },
      {
        type: "text",
        content:
          "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
      },
    ],
  },
  tags: ["UI Design"],

  // ─── Bespoke Neogov page content ───────────────────────────
  eyebrow: "NEOGOV",
  displayHeading: "From Product Execution to Systems Thinking",
  heroCompositionImage: {
    src: "/images/projects/neogov/neogov_hero.png",
    alt: "Neogov UI composition with employee profile, dashboard, and design system cards",
  },
  userProfileImage: {
    src: "/images/projects/neogov/neogov_large_user_profile.png",
    alt: "Neogov Employee Profile dashboard screenshot",
  },
  stats: [
    { value: "13,000", label: "organizations", variant: "stat" },
    { value: "800,000", label: "public sector employees", variant: "stat" },
    { value: "Government / HR Tech", label: "INDUSTRY", variant: "meta" },
  ],
  leadQuote:
    "Working across a HR SaaS that serves 13,000 organizations means every design decision lands at scale, either holding up or cracking quietly across the system.",
  contextRow: {
    label: "Context",
    text: "NEOGOV is the largest HR SaaS platform in the US public sector, supporting 800,000+ employees across counties, school districts, and law enforcement agencies.",
    images: [
      {
        src: "/images/projects/neogov/neogov_mocup_01.png",
        alt: "Neogov product display heading on dark monitor",
      },
      {
        src: "/images/projects/neogov/neogov_mocup_02.png",
        alt: "Neogov product dashboard on monitor with peach background",
      },
    ],
  },
  productWorkRow: {
    label: "Product work",
    text: "The first half of my time at NEOGOV was spent on user flows and interfaces for products like eForms, Onboard, and Analytics. Each solved a specific HR challenge, from digitizing forms to streamlining onboarding to surfacing workforce insights. The recurring tension was building for users in vastly different agencies, where the same product had to feel right at both ends of that spectrum.",
  },
  systemImpactRow: {
    label: "System impact",
    text: "When I moved to the Design System team, the work changed shape. Instead of shipping features, I was shipping the things features were built from. Reusable UI components, interaction patterns, and the documentation that tells teams how to use them well. The challenge wasn't building components in isolation. It was making sure they worked across every product the platform offered.",
  },
  callout:
    "A design system at this scale isn't really a Figma file. It's a contract between dozens of designers, engineers, and product managers about how things should work.",
  designSystemImage: {
    srcLarge: "/images/projects/neogov/neogov_large_design_system.png",
    srcSmall: "/images/projects/neogov/neogov_small_design_system.png",
    alt: "NOVI design system showcase including components, color palette, typography, and mobile screens",
  },
  aiIntegration: {
    label: "AI integration",
    text: "AI started rolling out across NEOGOV's products, and I coordinated how those features were designed and built across product, design, engineering, and QA. The goal: AI as a system capability, not a series of standalone features.",
    images: [
      {
        src: "/images/projects/neogov/neogov_mocup_03.png",
        alt: "AI Writing Assistant interface on tablet",
        caption: "AI Writing Assistant",
      },
      {
        src: "/images/projects/neogov/neogov_mocup_04.png",
        alt: "AI Assistant interface on tablet with red mug",
        caption: "AI Assistant",
      },
    ],
  },
  reflection: {
    label: "Reflection",
    text: "What I take from NEOGOV is a way of working. The work doesn't show up loudly. It's in components people use without thinking, patterns that hold across products, and decisions that stop problems before they're noticed. That mindset shapes how I approach every project now, even the smaller ones.",
    images: [
      {
        src: "/images/projects/neogov/neogov_mocup_05.png",
        alt: "Performance dashboard for managers on laptop",
        caption: "Performance dashboard for managers",
      },
      {
        src: "/images/projects/neogov/neogov_mocup_06.png",
        alt: "Employee list on mobile phone",
        caption: "Employee list",
      },
    ],
  },
};
