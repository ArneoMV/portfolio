"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap/gsap-init";
import InstagramStory from "@/app/components/molecules/instagram-story/InstagramStory";
import AboutText from "./AboutText";

const STORY_IMAGES = [
  "/images/home/insta-me-1.jpeg",
  "/images/home/insta-me-2.jpeg",
  "/images/home/insta-me-3.jpeg",
  "/images/home/insta-me-4.jpeg",
];

/**
 * About section — homepage. Sits inside the same dotted-guide
 * container system as Services and FAQ. Two-column layout on
 * desktop: text on the left (cols 1–7), Instagram-style slideshow
 * on the right (cols 9–12). The slideshow translates vertically
 * as the user scrolls through the section so its top aligns with
 * the title at the start and its bottom aligns with the text's
 * bottom at the end.
 *
 * Mobile: stacks text + slideshow, no scroll animation.
 */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const story = storyRef.current;
    const text = textRef.current;
    if (!section || !story || !text) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // matchMedia gates the effect to ≥768px so the ScrollTrigger
    // never runs on phones — mobile layout already stacks text and
    // slideshow vertically, no follow-scroll needed there.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      // maxY = how far the slideshow can travel before its bottom
      // edge reaches the text bottom. Recomputed on every refresh so
      // breakpoint changes / image loads / font swaps re-anchor the
      // animation correctly.
      let maxY = 0;
      const measure = () =>
        Math.max(0, text.offsetHeight - story.offsetHeight);

      // Pin the section once it fully fills the viewport (start: top
      // top, paired with min-height: 100vh in CSS). The pinned scroll
      // budget is split into two phases:
      //   • HOLD_DISTANCE (100px) — breathing-room "luft" where the
      //     slideshow stays at y:0 and the user gets one quiet
      //     micro-scroll before anything moves.
      //   • SCROLL_DISTANCE - HOLD_DISTANCE (700px) — actual scrub
      //     budget, which spreads the y:0 → y:maxY travel across
      //     ~8 trackpad micro-scrolls (≈80px each) so the slideshow
      //     reaches the bottom of the text gradually rather than
      //     racing to it. Final y is still exactly maxY at progress 1.
      // pinSpacing reserves the SCROLL_DISTANCE budget after the pin
      // so the next section never appears under the pinned About.
      const SCROLL_DISTANCE = 800;
      const HOLD_DISTANCE = 100;
      const HOLD_RATIO = HOLD_DISTANCE / SCROLL_DISTANCE;
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${SCROLL_DISTANCE}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onRefresh: () => {
          maxY = measure();
        },
        onUpdate: (self) => {
          // Clamp the first HOLD_RATIO of scroll to 0 movement, then
          // re-map the remaining range linearly to 0 → 1 so the post-
          // hold travel reaches maxY exactly at progress 1.
          const p = self.progress;
          const adjusted =
            p <= HOLD_RATIO ? 0 : (p - HOLD_RATIO) / (1 - HOLD_RATIO);
          gsap.set(story, { y: adjusted * maxY });
        },
      });

      // Initial measurement — onRefresh fires during create() in most
      // cases, but pin this here for safety.
      maxY = measure();

      return () => {
        st.kill();
        gsap.set(story, { y: 0 });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-container">
        <div className="grid-layout items-start">
          <AboutText textRef={textRef} />

          <div
            ref={storyRef}
            className="about-story-col"
            style={{ willChange: "transform" }}
          >
            <InstagramStory
              images={STORY_IMAGES}
              username="arneomv"
              avatarSrc="/images/avatar_image.png"
              profileUrl="https://www.instagram.com/arneomv"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
