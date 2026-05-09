"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import SectionHeader from "@/app/components/molecules/section-header/SectionHeader";
import TaskSidePanel, {
  type TaskPreview,
} from "@/app/components/organisms/task-side-panel/TaskSidePanel";
// ScrollTrigger is registered as a side-effect of importing gsap-init,
// so referencing it implicitly through gsap.timeline({ scrollTrigger })
// works without a named import here.
import { gsap } from "@/lib/gsap/gsap-init";

type Priority = "Low" | "Medium" | "High";
type ChipTone = "neutral" | "primary" | "green";
type ColumnId = "discovery" | "building" | "ship";

interface CardData {
  title: string;
  priority: Priority;
}

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
 * All three "+ Add task" tiles (Discovery / Building / Ship) are real
 * `<button>` elements that open the same TaskSidePanel. Building
 * starts in the active blue state by default; clicking Discovery or
 * Ship opens the panel and flips that column's tile to the active
 * state too. Once active, a tile stays active for the rest of the
 * session — a `Set<ColumnId>` keeps the activated ids.
 */
export default function ServicesSection() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [preview, setPreview] = useState<TaskPreview>({
    category: "",
    title: "",
    description: "",
  });

  // Building is active out of the box (matches the existing reference
  // illustration); Discovery and Ship are neutral until clicked.
  const [activeAddTaskColumns, setActiveAddTaskColumns] = useState<
    Set<ColumnId>
  >(() => new Set<ColumnId>(["building"]));

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setPreview({ category: "", title: "", description: "" });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // The diagram is illustrative — there's no live kanban to push
      // the new task into. Submit just closes the panel; in production
      // this would post to an API endpoint.
      closePanel();
    },
    [closePanel],
  );

  const openTaskPanel = useCallback((columnId: ColumnId) => {
    setActiveAddTaskColumns((prev) => {
      if (prev.has(columnId)) return prev;
      const next = new Set(prev);
      next.add(columnId);
      return next;
    });
    // Pre-fill the panel's category so the same panel can read which
    // column the user clicked from. Existing TaskSidePanel reads the
    // `category` field — no panel redesign needed.
    setPreview({ category: columnId, title: "", description: "" });
    setPanelOpen(true);
  }, []);

  // Memoise the per-column add-task descriptors so each Column gets a
  // stable click handler reference across renders.
  const addTaskFor = useMemo(
    () => ({
      discovery: {
        active: activeAddTaskColumns.has("discovery"),
        onClick: () => openTaskPanel("discovery"),
      },
      building: {
        active: activeAddTaskColumns.has("building"),
        onClick: () => openTaskPanel("building"),
      },
      ship: {
        active: activeAddTaskColumns.has("ship"),
        onClick: () => openTaskPanel("ship"),
      },
    }),
    [activeAddTaskColumns, openTaskPanel],
  );

  // Mirror the old behavior — body class drives the page-shift CSS
  // when the panel opens.
  useEffect(() => {
    if (panelOpen) {
      document.body.classList.add("task-panel-open");
    } else {
      document.body.classList.remove("task-panel-open");
    }
    return () => document.body.classList.remove("task-panel-open");
  }, [panelOpen]);

  // Mobile-only stacked-card scroll animation (≤ 767px, no reduced-
  // motion). The pinned trigger is `.svc-section` — the WHOLE
  // section, not the scene/stack. With the section pinned, title +
  // subtitle + search + cursor + cards stack all stay together as
  // one fixed unit while the page scroll drives the inner card
  // timeline.
  //
  // Discovery / Building / Ship are absolutely positioned inside
  // `.svc-cards-stack` at staggered tops (0 / 60 / 120 — see
  // _services.scss) so each card's title peek sits above the one
  // in front. How-I-work and Info live as later siblings of
  // `.svc-cards-stack` inside `.svc-diagram`; on mobile they sit
  // below the stack in flex flow and become visible via NORMAL
  // page scroll AFTER the pin releases. The stacked-card animation
  // is intentionally a two-stage rise — no final lift, no reveal
  // hold. Ship comes to rest at top:120 (Building's title peek
  // visible behind it) and stays there.
  //
  //   Stage 1 — Building y: stackHeight → 0, Discovery width:
  //             front → mid
  //   Stage 2 — Ship y: stackHeight → 0, Building width:
  //             front → mid, Discovery width: mid → back
  //
  // Pin start `top top` engages the moment `.svc-section`'s top
  // hits the viewport top. Pin distance `+=140%` covers the two
  // stages comfortably without holding the user past the moment
  // the stack settles.
  //
  // Reduced-motion users skip this entirely — the matchMedia query
  // requires `prefers-reduced-motion: no-preference`. They render
  // the mobile fallback (cards as `position: relative` in normal
  // flow), defined in the matching SCSS query.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      () => {
        const stack = section.querySelector<HTMLElement>(".svc-cards-stack");
        const discovery = section.querySelector<HTMLElement>(
          ".svc-column--discovery",
        );
        const building = section.querySelector<HTMLElement>(
          ".svc-column--building",
        );
        const ship = section.querySelector<HTMLElement>(".svc-column--ship");
        if (!stack || !discovery || !building || !ship) return;

        // Card widths resolved to pixel values so GSAP can tween
        // them. Caps at the design's `min(360px, calc(100vw - 32px))`
        // rule; mid/back tiers are 20/40px narrower, clamped at 0
        // so very narrow viewports don't tween to negative widths.
        const front = Math.min(360, window.innerWidth - 32);
        const mid = Math.max(0, front - 20);
        const back = Math.max(0, front - 40);

        // Off-screen translate distance = stack's rendered height.
        // With `overflow: hidden` on the stack, this guarantees
        // Building / Ship are clipped inside the stack box before
        // the rise animation starts — they never leak below the
        // section to overlap surrounding content.
        const stackHeight = stack.offsetHeight;

        gsap.set(discovery, { width: front });
        gsap.set(building, { width: front, y: stackHeight });
        gsap.set(ship, { width: front, y: stackHeight });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
          },
          defaults: { ease: "none" },
        });

        // Stage 1 — Building rises, Discovery narrows to mid.
        tl.to(building, { y: 0, duration: 1 }, 0)
          .to(discovery, { width: mid, duration: 1 }, 0);

        // Stage 2 — Ship rises, Building narrows to mid, Discovery
        // narrows to back. Ship comes to rest at its abs top:120 and
        // stays there — no further lift after this stage.
        tl.to(ship, { y: 0, duration: 1 }, 1)
          .to(building, { width: mid, duration: 1 }, 1)
          .to(discovery, { width: back, duration: 1 }, 1);

        return () => {
          // matchMedia.revert() handles ScrollTrigger.kill() and
          // timeline cleanup; we only need to clear inline styles
          // GSAP set so the static reduced-motion / desktop CSS
          // isn't fighting leftover transforms after a resize
          // crosses the breakpoint.
          gsap.set([discovery, building, ship], {
            clearProps: "transform,width",
          });
        };
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="svc-section">
      <div className="svc-container">
        {/* Shared SectionHeader — same molecule used by FAQ. Renders
            as a plain <div> (not <header>) for the same reason:
            the global `header { position: absolute }` rule in
            _header.scss matches every <header> on the page and would
            pull this block out of flow. */}
        <SectionHeader
          title="From idea to live website"
          subtitle="I handle both design and development, so the process stays simple and everything moves faster."
        />

        <div className="svc-diagram">
          {/* Three primary connectors only — Search→Discovery,
              Discovery→Building, Building→Ship. Behind every card
              via z-index 0 and pointer-events: none so they never
              block hits on the active "+ Add task" buttons. */}
          <div className="svc-connectors" aria-hidden="true">
            <span className="svc-connector svc-connector--search-discovery" />
            <span className="svc-connector svc-connector--discovery-building" />
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
          <CursorTag
            tone="client"
            label="Client"
            className="svc-cursor svc-cursor--client"
          />

          <div className="svc-cards-stack">
            <Column
              position="discovery"
              title="Discovery"
              chip={{ tone: "neutral", label: "Planning", count: 2 }}
              cards={[
                { title: "Define pages & user flows", priority: "Medium" },
                { title: "Set visual direction & references", priority: "Low" },
              ]}
              addTask={addTaskFor.discovery}
            />

            <Column
              position="building"
              emphasized
              title="Building"
              chip={{ tone: "primary", label: "Designing", count: 1 }}
              cards={[{ title: "Design landing page", priority: "Medium" }]}
              addTask={addTaskFor.building}
            />
            <CursorTag
              tone="designer"
              label="Designer"
              className="svc-cursor svc-cursor--designer"
            />

            <Column
              position="ship"
              title="Ship & iterate"
              chip={{ tone: "green", label: "Developing", count: 2 }}
              cards={[
                { title: "Build responsive website", priority: "High" },
                { title: "Connect to database", priority: "Medium" },
              ]}
              addTask={addTaskFor.ship}
            />
          </div>

          {/* How-I-work and Info live as siblings of `.svc-cards-stack`
              inside `.svc-diagram`. On desktop they continue to
              resolve `position: absolute` against `.svc-diagram` at
              their original desktop coords (zero desktop change).
              On mobile they sit below the cards stack in flex flow
              and become visible via NORMAL page scroll after the
              pinned card animation releases — they never animate in
              with Ship and never need Ship to "lift over" the stack
              to appear. */}
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

      <TaskSidePanel
        open={panelOpen}
        onClose={closePanel}
        onSubmit={handleSubmit}
        preview={preview}
        onPreviewChange={setPreview}
      />
    </section>
  );
}

interface ColumnProps {
  position: ColumnId;
  title: string;
  chip: { tone: ChipTone; label: string; count: number };
  cards: CardData[];
  emphasized?: boolean;
  addTask: { active: boolean; onClick: () => void };
  children?: ReactNode;
}

function Column({
  position,
  title,
  chip,
  cards,
  emphasized,
  addTask,
}: ColumnProps) {
  const className = [
    "svc-column",
    `svc-column--${position}`,
    emphasized ? "svc-column--emphasized" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Real <button> in both states — keyboard-focusable and clickable
  // even when neutral. The active/neutral classes drive only visual
  // styling; click behaviour is identical.
  const addTaskClass = addTask.active
    ? "svc-add-task svc-add-task--active"
    : "svc-add-task svc-add-task--neutral";

  return (
    <div className={className}>
      <h3 className="svc-column-title">{title}</h3>
      <div className={`svc-column-chip svc-column-chip--${chip.tone}`}>
        <span className="svc-column-chip-dot" aria-hidden="true" />
        <span className="svc-column-chip-label">{chip.label}</span>
        <span className="svc-column-chip-count">{chip.count}</span>
      </div>

      <ul className="svc-column-cards">
        {cards.map((card) => (
          <li key={card.title} className="svc-card">
            <div className="svc-card-row">
              <p className="svc-card-title">{card.title}</p>
              <span className="svc-card-more" aria-hidden="true">
                ⋯
              </span>
            </div>
            <span
              className={`svc-priority svc-priority--${card.priority.toLowerCase()}`}
            >
              {card.priority}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={addTaskClass}
        onClick={addTask.onClick}
        aria-label={`Add task in ${title}`}
      >
        <span aria-hidden="true">+</span> Add task
      </button>
    </div>
  );
}

interface CursorTagProps {
  tone: "client" | "designer";
  label: string;
  className?: string;
}

function CursorTag({ tone, label, className }: CursorTagProps) {
  return (
    <div className={className} aria-hidden="true">
      <Image
        src="/images/home/Cursor_icon.svg"
        alt=""
        width={20}
        height={20}
        className="svc-cursor-icon"
      />
      <span className={`svc-cursor-pill svc-cursor-pill--${tone}`}>
        {label}
      </span>
    </div>
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
