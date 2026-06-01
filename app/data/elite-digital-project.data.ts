import type { ProjectDetailMeta } from "@/app/components/organisms/project-detail/project-detail.types";
import type {
  CaseStudyImage,
  CaseStudyShowcaseImage,
  CaseStudyStat,
  CaseStudyTextRow,
} from "@/app/components/organisms/project-detail/case-study/case-study.types";

/**
 * Standalone data shape for the Elite Digital case study.
 *
 * Like Neogov and Spona, Elite Digital renders through a dedicated
 * bespoke page (`EliteDigitalProjectPage`) rather than the shared
 * `ProjectDetailTemplate`. The hero is the THIRD hero variant — a
 * full-width banner image in normal flow, contrasting with Neogov's
 * absolute float and Spona's bottom-overflow.
 *
 * The Context + Showcase sections are the shared `case-study/*`
 * components, so this type composes the case-study sub-types directly.
 * Elite Digital's existing dark + light section content maps to
 * Context (lead quote → context row → three inside rows interleaving
 * text with single inline images, same pattern Croatel uses) plus a
 * full-bleed Showcase (the composite client-mockups image). No
 * image-pair sections render — Elite Digital's imagery is single-
 * mockup-per-row, not the 2-up captioned pair pattern Neogov uses for
 * AI integration / Reflection.
 *
 * The minimal Elite Digital entry in `PROJECT_DETAILS` is retained as
 * the source for `generateStaticParams`, `generateMetadata`, and the
 * "Other Work" cards; THIS constant is the source of truth for the
 * /work/elite-digital detail page.
 */
export interface EliteDigitalProjectData {
  slug: string;
  title: string;
  meta: ProjectDetailMeta;
  /** "What I built" row body. */
  description: string;
  introduction: string;

  /* ── Hero ─────────────────────────────────────────────────── */
  /** Full-width banner image sitting in normal flow (NOT floating
   *  like Neogov, NOT bottom-overflowing like Spona — third hero
   *  variant). */
  heroImage: { src: string; alt: string };

  /* ── Context section (CaseStudyContextSection) ────────────── */
  leadQuote?: string;
  /** Currently unused on Elite Digital (no numeric metrics) — kept
   *  for parity with the shared Context section's prop surface. */
  stats?: CaseStudyStat[];
  contextRow?: CaseStudyTextRow & { images?: CaseStudyImage[] };
  /** Additional rows inside the navy panel, each interleaving a
   *  text row with a single inline image (the `CaseStudyTextRow.images`
   *  field, same pattern Croatel uses). Lets Elite Digital's dark +
   *  light section imagery live INSIDE the Context panel rather than
   *  as standalone image-pair sections. */
  insideRows?: CaseStudyTextRow[];
  /** Optional outside rows / callout — currently unused on Elite
   *  Digital, kept for shape parity with the shared Context section
   *  and Neogov/Spona's data shape. */
  outsideRows?: CaseStudyTextRow[];
  callout?: string;

  /* ── Showcase (CaseStudyShowcaseSection) ──────────────────── */
  /** Composite client-mockups image. Optional so Showcase skips when
   *  absent (mirrors Neogov's pattern). */
  showcaseImage?: CaseStudyShowcaseImage;
}

export const ELITE_DIGITAL_PROJECT: EliteDigitalProjectData = {
  slug: "elite-digital",
  title: "Elite Digital",
  meta: {
    responsibility: "UI/UX Design",
    projectType: "Web / Marketing",
    industry: "Digital Agency",
    year: "2025",
  },
  description:
    "Digital agency delivering web products across multiple industries. Built the design system and component library that lets them ship fast without losing consistency.",
  introduction:
    "Elite Digital is an agency that designs and builds websites at agency pace, which usually means fast. I worked on structure and layout systems, shared components, and the documentation around them, so the team could keep extending things after handoff without a designer in the loop for every change. The brief was as much about flexibility as polish.",

  // ── Hero ──────────────────────────────────────────────────
  heroImage: {
    src: "/images/projects/elite-digital/elite-digital-hero-image.png",
    alt: "Elite Digital project hero showing the design for fast delivery case study",
  },

  // ── Context ───────────────────────────────────────────────
  // Lead quote = the previous dark section's leftText: a short,
  // summary-style line about the collaboration shape. Fits leadQuote
  // perfectly (already terse, already standalone).
  leadQuote:
    "A design collaboration set up to help the team move faster, where I set the direction and foundation, then handed it off for implementation.",
  // Context row text = the dark section's first text block (agency
  // intro). Pairing it with the design-handoff workflow illustration
  // preserves the original block-1 ↔ block-2 adjacency.
  contextRow: {
    label: "Context",
    text: "Elite Digital is a full service digital agency in Zagreb that delivers across web, branding, marketing, and IT support. Over roughly ten months I worked with the team as a freelance design collaborator, focused on the web side of their work.",
    images: [
      {
        src: "/images/projects/elite-digital/elite-digital-clean-work-flow.png",
        alt: "Early stage design setup and handoff workflow with sticky notes",
      },
    ],
  },
  // insideRows reorganise the rest of the dark + light section text +
  // image blocks into the Context-panel pattern. Each row keeps its
  // original text↔illustration adjacency, interleaved through
  // CaseStudyTextRow.images (same pattern Croatel uses).
  insideRows: [
    {
      label: "Design system",
      text: "Most of the work happened in Figma, where I built shared layout systems, typography scales, component patterns, and page templates the team could reuse. My focus was on the early stages of each project, then handing the design over to the developer who built the sites in Framer.",
      images: [
        {
          src: "/images/projects/elite-digital/elite-digital-black-white-mode.png",
          alt: "Design system foundations in Figma with light and dark mode variables",
        },
      ],
    },
    {
      label: "Client delivery",
      text: "These projects were shipped by the wider team after the design foundation was in place, so the final live sites reflect both the design setup and decisions made during build. Setting up shared systems and design direction at the start of a project, knowing the build would carry on without me, is its own kind of design challenge.",
      images: [
        {
          src: "/images/projects/elite-digital/mockup-continental-dynamics-01.png",
          alt: "Continental Dynamics website mockup, a European gas and energy trading group",
        },
      ],
    },
    {
      label: "Elite Media",
      text: "Part of the work also included Elite Media, the agency's internal subbrand focused on marketing and social media. Designing for a brand that itself sells design and strategy comes with its own kind of pressure, since the site has to reflect the quality of work the team delivers to clients.",
    },
  ],

  // ── Showcase ──────────────────────────────────────────────
  // The previous lightSection's full-width composite mockup runs as
  // the section's full-bleed Showcase image — same role the NOVI
  // design-system composite plays on Neogov.
  showcaseImage: {
    src: "/images/projects/elite-digital/mockups-all.png",
    alt: "Client website mockups for Azimut International, Union Rail, and Elite Digital agency",
  },
};
