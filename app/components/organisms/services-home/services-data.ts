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
