import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/app/components/molecules/section-header/SectionHeader";
import {
  PHASES,
  SKILLS,
  type Phase,
  type PhaseCta as PhaseCtaData,
  type Skill,
} from "./services-data";

const TOOLS = [
  { name: "Slack for messaging", src: "/images/home/logo/slack_logo.svg" },
  { name: "Figma for design", src: "/images/home/logo/figma_logo.svg" },
  { name: "NextJS for development", src: "/images/home/logo/nextJS_logo.svg" },
  {
    name: "Trello for task management",
    src: "/images/home/logo/trello_logo.svg",
  },
  {
    name: "Google Meet for quick calls",
    src: "/images/home/logo/googleMeet_logo.svg",
  },
];

/**
 * Homepage Services section — process illustration / kanban diagram.
 *
 * Three phase cards (Discovery / Building / Ship & iterate) are
 * rendered from the data array in `services-data.ts`. Each card
 * carries its own colour theme via the `card-theme` mixin in
 * `_services.scss` (Discovery blue / Building green / Ship amber).
 * Per-task category tags (Strategy / Direction / UI / System /
 * Frontend / Polish) get independent pastel pairs styled by the
 * `.svc-tag--{id}` rules in the same stylesheet.
 *
 * CTAs link to real destinations:
 *   - Discovery: external Calendly URL (`<a target="_blank">`).
 *   - Building: internal `/work` route (Next.js `<Link>`).
 *   - Ship: external Behance URL (`<a target="_blank">`).
 *
 * No interactive state lives on the section anymore — the prior
 * TaskSidePanel + `+ Add task` Set-based active-state logic was
 * removed when the CTAs were repointed at real destinations. The
 * scroll-pinned mobile stacked-card animation was removed alongside
 * it; on mobile the three phase cards now stack vertically in
 * normal document flow with 32px dotted connectors between them.
 *
 * The Client cursor badge (anchored to Discovery's bottom-right
 * corner) is rendered as a direct child of the Discovery `<div>`
 * via `.svc-column-client`. The previous Search-anchored "Client"
 * cursor is gone.
 */
export default function ServicesSection() {
  return (
    <section className="svc-section">
      <div className="svc-container">
        {/* Shared SectionHeader — same molecule used by FAQ, Work,
            About. The `.svc-header-wrap` provides the standard
            64 / 48 / 16 px responsive horizontal padding without
            shifting `.svc-diagram` (whose absolute-positioned cards
            depend on a flush container). */}
        <div className="svc-header-wrap">
          <SectionHeader
            title="What I bring"
            subtitle="Skills, tools, and how I work"
          />
        </div>

        {/* Skills cluster — three "What I bring" cards rendered as a
            sibling ABOVE `.svc-diagram` so the diagram's absolute
            coords and mobile connector cadence stay untouched. Each
            card reuses the Discovery (blue) phase palette for the
            outer surface + title, and the existing `.svc-card`
            inner-task-card recipe for the two stacked white inner
            boxes (description / tools). Mapped from `SKILLS` in
            `services-data.ts`. */}
        <ul className="svc-skills">
          {SKILLS.map((skill) => (
            <SkillCard key={skill.title} skill={skill} />
          ))}
        </ul>

        <div className="svc-diagram">
          {/* Desktop / tablet dotted connector lines for the
              two-column layout. Four vertical segments (Search →
              Discovery, Discovery → How I work, How I work → Info,
              Building → Ship) plus one horizontal segment
              (Discovery → Building at the Strategy task level).
              Sit behind the cards via `z-index: 0` vs cards'
              `z-index: 2`; `display: none` on mobile (≤767px). */}
          <div className="svc-connectors" aria-hidden="true">
            <span className="svc-connector svc-connector--search-discovery" />
            <span className="svc-connector svc-connector--discovery-building" />
            <span className="svc-connector svc-connector--discovery-howiwork" />
            <span className="svc-connector svc-connector--howiwork-info" />
            <span className="svc-connector svc-connector--building-ship" />
          </div>

          <div className="svc-search">
            <span className="svc-search-text">I need a new website</span>
            <Image
              src="/images/home/search_icon.svg"
              alt=""
              width={20}
              height={20}
              className="svc-search-icon"
            />
          </div>

          {/* Mobile-only dotted connectors interleaved between every
              vertical element in the kanban flow. `display: none` on
              desktop / tablet. */}
          <span className="svc-mobile-connector" aria-hidden="true" />

          <PhaseCard phase={PHASES[0]} />

          <span className="svc-mobile-connector" aria-hidden="true" />

          <PhaseCard phase={PHASES[1]} />

          <span className="svc-mobile-connector" aria-hidden="true" />

          <PhaseCard phase={PHASES[2]} />

          <span className="svc-mobile-connector" aria-hidden="true" />

          <div className="svc-howiwork">
            <button
              type="button"
              className="svc-howiwork-trigger"
              disabled
              aria-disabled="true"
              tabIndex={-1}
            >
              <span>How I work</span>
              <ChevronDown />
            </button>
            <ul className="svc-howiwork-menu">
              {TOOLS.map((tool) => (
                <li key={tool.name} className="svc-howiwork-item">
                  <Image
                    src={tool.src}
                    alt=""
                    width={16}
                    height={16}
                    className="svc-howiwork-icon"
                  />
                  <span>{tool.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <span className="svc-mobile-connector" aria-hidden="true" />

          <div className="svc-info">
            <Image
              src="/images/home/info_icon.svg"
              alt=""
              width={20}
              height={20}
              className="svc-info-icon"
            />
            <p className="svc-info-text">
              I design and build the project myself, so decisions move faster
              and there is no gap between idea and final result.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Local subcomponent for one "What I bring" card. Kept local (not a
   molecule) because the only render site is the cluster above. The
   markup is a list item so the cluster's outer `<ul>` keeps semantic
   list semantics; the inner stacked boxes are plain `<p>` elements
   so screen readers announce the description and tools as ordinary
   text below the card's `<h3>` title. */
function SkillCard({ skill }: { skill: Skill }) {
  return (
    <li className="svc-skill-card">
      <h3 className="svc-skill-card-title">{skill.title}</h3>
      <p className="svc-skill-card-box svc-skill-card-box--description">
        {skill.description}
      </p>
      {/* Tools box — each tool renders as a blue chip via the reused
          `.svc-tag .svc-tag--polish` rule (the only blue variant in
          the existing `.svc-tag--*` palette). The wrapping flex row
          is owned by `.svc-skill-card-box--tools` so the chips wrap
          to multiple lines as the card narrows. */}
      <div className="svc-skill-card-box svc-skill-card-box--tools">
        {skill.tools.map((tool) => (
          <span key={tool} className="svc-tag svc-tag--polish">
            {tool}
          </span>
        ))}
      </div>
    </li>
  );
}

function PhaseCard({ phase }: { phase: Phase }) {
  return (
    <div className={`svc-column svc-column--${phase.id}`}>
      <div className="svc-column-header">
        <h3 className="svc-column-title">{phase.title}</h3>
        <span className="svc-column-status">
          <span className="svc-column-status-dot" aria-hidden="true" />
          <span className="svc-column-status-label">{phase.status}</span>
        </span>
      </div>

      <ul className="svc-column-cards">
        {phase.tasks.map((task) => (
          <li key={task.title} className="svc-card">
            <p className="svc-card-title">{task.title}</p>
            <span className={`svc-tag svc-tag--${task.category.id}`}>
              {task.category.label}
            </span>
          </li>
        ))}
      </ul>

      <PhaseCta cta={phase.cta} />

      {phase.id === "discovery" && (
        <div className="svc-column-client" aria-hidden="true">
          <Image
            src="/images/home/Cursor_icon.svg"
            alt=""
            width={20}
            height={20}
            className="svc-column-client-icon"
          />
          <span className="svc-column-client-pill">Client</span>
        </div>
      )}
    </div>
  );
}

function PhaseCta({ cta }: { cta: PhaseCtaData }) {
  const className = "svc-cta";
  const content = (
    <>
      <span className="svc-cta-label">{cta.label}</span>
      <span className="svc-cta-icon" aria-hidden="true">
        +
      </span>
    </>
  );
  if (cta.external) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className}>
      {content}
    </Link>
  );
}

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
