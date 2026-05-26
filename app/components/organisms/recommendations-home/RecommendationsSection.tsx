"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
// `gsap` from the local init module pulls in plugin registration
// (ScrollTrigger is registered there) as an import side-effect.
import { gsap } from "@/lib/gsap/gsap-init";
import SectionHeader from "@/app/components/molecules/section-header/SectionHeader";
import { RECOMMENDATIONS } from "@/app/features/homepage/data/recommendations.data";

/**
 * Homepage "Trusted by colleagues" section.
 *
 * Desktop/tablet: the section pins at the top of the viewport via
 * ScrollTrigger. Over the pinned scroll distance the six cards animate
 * one-by-one (scrubbed) from a scattered "polaroid pile" into a 2-col
 * staggered grid; scrolling back up reverses it. Cards are absolutely
 * positioned and moved purely by transform, so the layout never reflows
 * mid-animation (this avoids the previous hover-driven flicker bug).
 *
 * Mobile (<768px): the effect early-exits — no pin, no GSAP. The cards
 * render in CSS flow as a horizontal swipe carousel (see the mobile
 * block in `_recommendations.scss`).
 */

// Deterministic scatter starting positions per card index — applied as
// inline transforms only after mount, so SSR/CSR markup stays identical.
// Each card sits within ~±30px of its final grid slot (grid is roughly
// ±344 x / ±137 y) with a gentle ±3–6° tilt: a "loose grid already in
// formation" rather than a chaotic pile, so the snap to the grid is short.
const SCATTER_TRANSFORMS = [
  { x: -320, y: -120, rotate: -6 }, // 0 Danijel — near row 1 left
  { x: 20, y: -150, rotate: 4 }, // 1 Julio — near row 1 mid, higher
  { x: 30, y: 160, rotate: -3 }, // 2 Tihor — near row 2 mid, right
  { x: 320, y: -110, rotate: 6 }, // 3 Petar — near row 1 right, lower
  { x: -310, y: 150, rotate: -5 }, // 4 Sandra — near row 2 left
  { x: 330, y: 120, rotate: 4 }, // 5 Ella — near row 2 right, higher
];

// Grid layout — a compact, fixed-size 3-col × 2-row grid (not
// viewport-relative): cards are 320px wide with a 24px gap, so the
// 1008px grid (3×320 + 2×24) sits centred in the wider wrap.
const CARD_WIDTH = 320;
const GAP = 24;

// Grid target positions (offsets from the wrap centre), mapped per
// card index in DATA ORDER so the data file stays semantically ordered
// while cards land in the requested visual arrangement:
//   Row 1: Danijel (0) · Julio (1) · Petar (3)
//   Row 2: Sandra  (4) · Tihor (2) · Ella  (5)
// `cardHeight` is the measured tallest card; since every card is forced
// to that height (min-height), the row pitch yields an exact 24px gap.
function computeGridPositions(cardHeight: number) {
  const colStep = CARD_WIDTH + GAP; // 344px between column centres
  const rowOffsetY = (cardHeight + GAP) / 2; // half the row pitch

  return [
    { x: -colStep, y: -rowOffsetY }, // 0 Danijel: row 1 left
    { x: 0, y: -rowOffsetY }, // 1 Julio:   row 1 mid
    { x: 0, y: rowOffsetY }, // 2 Tihor:   row 2 mid
    { x: colStep, y: -rowOffsetY }, // 3 Petar:   row 1 right
    { x: -colStep, y: rowOffsetY }, // 4 Sandra:  row 2 left
    { x: colStep, y: rowOffsetY }, // 5 Ella:    row 2 right
  ];
}

const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767px)").matches;

export default function RecommendationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (isMobile()) return;
    if (!sectionRef.current) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (cards.length !== RECOMMENDATIONS.length) return;

    // Measure natural card heights BEFORE applying absolute positioning
    // (the cards are still in normal flow, sized by their content). The
    // tallest card sets the row pitch, so even the shortest cards keep a
    // 24px gap below them — using anything less than the max would let
    // longer-quote cards overlap the next row.
    const maxCardHeight = Math.max(...cards.map((card) => card.offsetHeight));

    // Force every card to the tallest height so all six are uniform —
    // this is what makes the grid gaps an exact, even 24px (shorter
    // cards gain interior space, absorbed at the bottom by the author
    // block's `margin-top: auto`).
    cards.forEach((card) => gsap.set(card, { minHeight: maxCardHeight }));

    // Apply the initial scatter state.
    cards.forEach((card, i) => {
      const t = SCATTER_TRANSFORMS[i];
      gsap.set(card, {
        x: t.x,
        y: t.y,
        rotation: t.rotate,
        position: "absolute",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        zIndex: i,
      });
    });

    const gridPositions = computeGridPositions(maxCardHeight);

    // Pin the section and scrub the card animation across a short
    // scroll distance (~2 micro-scrolls). The cards start near their
    // grid slots, so the snap is quick: they move in parallel with a
    // tight per-card offset (i * 0.04), mapped onto the ~240px pin
    // distance.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=240",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    cards.forEach((card, i) => {
      const grid = gridPositions[i];
      tl.to(
        card,
        {
          x: grid.x,
          y: grid.y,
          rotation: 0,
          duration: 1,
          ease: "power2.out",
        },
        i * 0.04,
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="recommendations-section"
      aria-label="Recommendations from colleagues"
    >
      <div className="recommendations-container">
        <SectionHeader title="Trusted by colleagues" />

        <div className="recommendations-cards-wrap">
          {RECOMMENDATIONS.map((rec, i) => (
            <article
              key={rec.id}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`recommendation-card recommendation-card--${rec.color}`}
            >
              <Image
                className="recommendation-card-quote-icon"
                src="/images/home/testemonials/icon_quote.svg"
                alt=""
                width={32}
                height={28}
                aria-hidden="true"
              />
              <p className="recommendation-card-quote">{rec.quote}</p>
              <div className="recommendation-card-author">
                <Image
                  className="recommendation-card-avatar"
                  src={rec.avatar}
                  alt={rec.name}
                  width={40}
                  height={40}
                />
                <div className="recommendation-card-author-text">
                  <div className="recommendation-card-name">{rec.name}</div>
                  <div className="recommendation-card-role">{rec.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
