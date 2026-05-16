"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProjectDetail } from "./project-detail.types";

interface ProjectDarkSectionProps {
  project: ProjectDetail;
}

/**
 * Section 2 — Dark content section.
 *
 * Two-column editorial layout on Medium + Large (≥900px), single
 * column on small. The left column uses CSS `position: sticky` at
 * ≥900px so the lead text stays visible while the right column
 * scrolls past in normal document flow. Stickiness releases when
 * the parent grid's bottom edge scrolls past the sticky `top`
 * offset.
 *
 * Sticky is JS-gated by `.is-sticky-active` — the scoped CSS rule
 * only takes effect once the section's top edge has scrolled up to
 * the fixed header's bottom line. Without the gate, browsers
 * treat the sticky element as eligible from the moment its
 * containing block enters the viewport; for this layout that read
 * as "the right column appears to scroll past the left while the
 * user is still entering the section." With the gate, the two
 * columns scroll together until the section truly reaches the
 * viewport top, then the left column locks.
 *
 * Implementation: scroll listener with rAF throttle. The handler
 * compares `getBoundingClientRect()` against the header-height
 * token and uses a functional setState bail-out so identical-state
 * transitions don't fire React renders (otherwise every scroll
 * frame would call setState and rely on React's Object.is bail to
 * skip the render — cleaner to skip the call itself).
 *
 * Mobile (<900px): SCSS gates `position: sticky` to the same
 * 900px breakpoint, so the JS class toggle is a no-op visually
 * below that width. Left column flows naturally above the right
 * column in the single-column stack.
 *
 * `prefers-reduced-motion`: sticky positioning isn't an animation,
 * so no special handling is needed — the rest state and sticky
 * state are both static positions, and the transition between
 * them happens at scroll-event speed (no transitions / animations).
 */
export default function ProjectDarkSection({ project }: ProjectDarkSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isStickyActive, setIsStickyActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headerHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
      ) || 124;

    let ticking = false;

    const updateStickyState = () => {
      const rect = section.getBoundingClientRect();
      // Active when the section's top has reached the header's
      // bottom line AND the section is still visible (bottom hasn't
      // scrolled past the header yet). Once the section is fully
      // scrolled off the top, the class is removed and the left
      // column reverts to normal flow — though by then it's
      // already above the viewport so there's no visible difference.
      const shouldActivate =
        rect.top <= headerHeight && rect.bottom > headerHeight;
      setIsStickyActive((prev) =>
        prev === shouldActivate ? prev : shouldActivate,
      );
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateStickyState);
        ticking = true;
      }
    };

    // Initial check covers the case where the user lands on the
    // page already scrolled into (or past) the dark section — e.g.
    // hash navigation, back-button restoration.
    updateStickyState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const { leftText, rightBlocks } = project.darkSection;

  return (
    <section
      ref={sectionRef}
      className={`project-detail-dark${
        isStickyActive ? " is-sticky-active" : ""
      }`}
    >
      <div className="project-detail-dark-inner">
        <div className="project-detail-dark-grid">
          <div className="project-detail-dark-left">
            <p className="project-detail-dark-text">{leftText}</p>
          </div>

          <div className="project-detail-dark-right">
            {rightBlocks.map((block, i) => {
              if (block.type === "text") {
                return (
                  <p
                    key={`text-${i}`}
                    className="project-detail-dark-text"
                  >
                    {block.content}
                  </p>
                );
              }
              return (
                <div
                  key={`image-${i}`}
                  className="project-detail-dark-image"
                  role={block.alt ? "img" : undefined}
                  aria-label={block.alt}
                >
                  {block.src && (
                    <Image
                      src={block.src}
                      alt={block.alt ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
