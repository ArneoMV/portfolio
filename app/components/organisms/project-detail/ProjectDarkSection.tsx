"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap/gsap-init";
import type { ProjectDetail } from "./project-detail.types";

interface ProjectDarkSectionProps {
  project: ProjectDetail;
}

// Extra scroll past the point where the right track has fully
// translated. Buys a small "settle" zone before the section
// unpins, so the last block doesn't snap out the moment it
// reaches the bottom of the viewport.
const SCROLL_BUFFER = 120;

/**
 * Section 2 — Dark content section.
 *
 * Medium + Large (≥900px): GSAP ScrollTrigger pins the section at
 * top:0 of the viewport while the right column scrolls vertically
 * via a `transform: translateY` on the track. Left column stays
 * statically composed inside the pinned section. When the right
 * track has fully translated (progress = 1), the trigger ends and
 * page scroll continues normally to <OtherWorkSection>.
 *
 * Below 900px and when prefers-reduced-motion is set, no
 * ScrollTrigger is created and the section flows in normal
 * document order (single-column stacked layout). 900px chosen
 * over 768px because at 768 each column is ~310px which is too
 * tight for the 4/3 image + paragraph pairing — 900px gives ~386px
 * per column which reads cleanly.
 *
 * Breakpoint coupling: this 900px floor MUST match the SCSS
 * `@media (min-width: 900px)` block in _project-detail.scss. If
 * they drift you get layout-without-pin (left text scrolls away)
 * or pin-without-layout (no 100dvh sizing, no overflow clip).
 *
 * Cleanup: gsap.matchMedia handles breakpoint enter/exit; on
 * unmount or when the viewport drops below 900px the inner
 * cleanup kills the ScrollTrigger and resets the track's
 * transform so leaving the breakpoint can't trap a translated
 * track in static layout.
 */
export default function ProjectDarkSection({ project }: ProjectDarkSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rightViewportRef = useRef<HTMLDivElement | null>(null);
  const rightTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = rightViewportRef.current;
    const track = rightTrackRef.current;
    if (!section || !viewport || !track) return;

    // Honour reduced-motion across the whole effect (matches the
    // pattern used elsewhere in this codebase). Skipping the
    // matchMedia setup entirely keeps the section in normal flow.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 900px)", () => {
      const measureMaxY = () =>
        Math.max(0, track.scrollHeight - viewport.clientHeight);

      // Cached so onUpdate avoids a layout-trashing DOM read on
      // every scroll frame; refreshed via onRefresh whenever the
      // viewport / content reflows. invalidateOnRefresh tells ST
      // to re-run `end` (which depends on maxY) on the same beat.
      let maxY = measureMaxY();
      if (maxY <= 0) return;

      // Add the pin-state class BEFORE creating ScrollTrigger so
      // the SCSS overrides (100dvh, overflow:hidden, etc.) are in
      // place by the time ScrollTrigger measures the section. The
      // class lifetime mirrors the pin's: added when matchMedia
      // matches AND content actually overflows, removed by the
      // cleanup below on resize-out / unmount / Fast Refresh.
      section.classList.add("is-pinned");

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${maxY + SCROLL_BUFFER}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          maxY = measureMaxY();
        },
        onUpdate: (self) => {
          gsap.set(track, { y: -maxY * self.progress });
        },
      });

      return () => {
        st.kill();
        section.classList.remove("is-pinned");
        // Reset transform so a viewport resize from desktop into
        // mobile doesn't leave the track stuck mid-translation.
        gsap.set(track, { y: 0, clearProps: "transform,will-change" });
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  const { leftText, rightBlocks } = project.darkSection;

  return (
    <section ref={sectionRef} className="project-detail-dark">
      <div className="project-detail-dark-inner">
        <div className="project-detail-dark-grid">
          <div className="project-detail-dark-left">
            <p className="project-detail-dark-text">{leftText}</p>
          </div>

          <div
            ref={rightViewportRef}
            className="project-detail-dark-right-viewport"
          >
            <div
              ref={rightTrackRef}
              className="project-detail-dark-right-track"
            >
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
      </div>
    </section>
  );
}
