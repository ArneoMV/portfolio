/* Services kanban phase data.
 *
 * The three phase cards (Discovery / Building / Ship & iterate) are
 * driven from this array so the JSX in `ServicesSection.tsx` is a
 * thin renderer. Theming per phase lives in `_services.scss` (the
 * `card-theme` mixin); per-category tag colors live there too.
 *
 * CTAs target real destinations:
 *   - Discovery → external Calendly link (new tab).
 *   - Building  → internal /work route (Next.js <Link>, same tab).
 *   - Ship      → external Behance link (new tab).
 *
 * `external: true` swaps the renderer from `<Link>` to a plain
 * `<a target="_blank" rel="noopener noreferrer">` in
 * `ServicesSection.tsx`.
 */

export type PhaseId = "discovery" | "building" | "ship";

export type CategoryId =
  | "strategy"
  | "direction"
  | "ui"
  | "system"
  | "frontend"
  | "polish";

export interface Task {
  title: string;
  category: { id: CategoryId; label: string };
}

export interface PhaseCta {
  label: string;
  href: string;
  external: boolean;
}

export interface Phase {
  id: PhaseId;
  title: string;
  status: string;
  tasks: Task[];
  cta: PhaseCta;
}

export const PHASES: Phase[] = [
  {
    id: "discovery",
    title: "Discovery",
    status: "Planning",
    tasks: [
      {
        title: "Map user goals and content structure",
        category: { id: "strategy", label: "Strategy" },
      },
      {
        title: "Define visual direction and references",
        category: { id: "direction", label: "Direction" },
      },
    ],
    cta: {
      label: "Book a discovery call",
      href: "https://calendly.com/arneo-marinvincetic/quick-intro-session",
      external: true,
    },
  },
  {
    id: "building",
    title: "Building",
    status: "Designing",
    tasks: [
      {
        title: "Design key screens and components",
        category: { id: "ui", label: "UI" },
      },
      {
        title: "Build a flexible design system",
        category: { id: "system", label: "System" },
      },
    ],
    cta: {
      label: "See design samples",
      href: "/work",
      external: false,
    },
  },
  {
    id: "ship",
    title: "Ship & iterate",
    status: "Developing",
    tasks: [
      {
        title: "Build responsive frontend in NextJS",
        category: { id: "frontend", label: "Frontend" },
      },
      {
        title: "Test, refine, and ship to production",
        category: { id: "polish", label: "Polish" },
      },
    ],
    cta: {
      label: "See case studies",
      href: "https://www.behance.net/arneo",
      external: true,
    },
  },
];

/* ── Skills cluster ─────────────────────────────────────────
 *
 * Three "What I bring" skill cards rendered as a sibling cluster
 * ABOVE `.svc-diagram` in `ServicesSection.tsx`. The cluster gives
 * the section a brief skills/tools summary before the process
 * diagram below it; the diagram itself is untouched.
 *
 * Each skill renders as an outer pastel card with two stacked
 * white inner boxes (description, tools) — see `.svc-skills` and
 * `.svc-skill-card` rules in `_services.scss`. */

export interface Skill {
  title: string;
  description: string;
  /** Tool names rendered as individual chips in the second inner
   *  box of each skill card (reuses the existing `.svc-tag --polish`
   *  blue chip variant — see `_services.scss`). */
  tools: string[];
}

export const SKILLS: Skill[] = [
  {
    title: "Design",
    description:
      "Design across the full range, from visuals and motion to research and systems.",
    tools: ["Figma", "Adobe Suite", "Motion", "Figma make", "Nano Banana"],
  },
  {
    title: "Development",
    description:
      "Frontend development from design to production. Modern React apps and marketing sites.",
    tools: ["React", "Next.js", "CSS/SCSS", "Claude Code"],
  },
  {
    title: "AI Automation",
    description:
      "Custom Make.com automations and AI workflows that save hours of manual work.",
    tools: ["Claude API", "Claude Code", "Make.com"],
  },
];
