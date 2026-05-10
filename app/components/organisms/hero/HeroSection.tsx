"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap/gsap-init";
import { useHeroCursor } from "@/app/features/homepage/hooks/useHeroCursor";
import { HERO_IMAGES } from "@/app/features/homepage/data/home.data";
import { useHeroPreloader } from "./useHeroPreloader";
import { useHeroIntroTimeline } from "./useHeroIntroTimeline";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const scrollProgress = useRef(0);
  const cursor = useHeroCursor(sectionRef);
  const [activeImage, setActiveImage] = useState(0);

  const { loadingProgress, isPreloading, heroReady } = useHeroPreloader();

  useHeroIntroTimeline({
    heroReady,
    sectionRef,
    line1Ref,
    line2Ref,
    frameRef,
  });

  // Image slideshow — 2s cycle.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 2300);
    return () => clearInterval(interval);
  }, []);

  // ScrollTrigger + frame animation loop. Three perf gates layered
  // on the same effect — visual behaviour identical to the original:
  //
  //   1. Cached width/height. A ResizeObserver refreshes a closure-
  //      local `dimensions` object instead of the rAF reading
  //      `section.offsetWidth/Height` after writing transforms on
  //      the previous frame (read-after-write forces sync layout
  //      every frame — the audit's main jank source).
  //   2. Visibility gate. An IntersectionObserver with a 300px
  //      rootMargin flips a closure-local `isVisible`. The rAF
  //      self-terminates when it becomes false; the IO callback
  //      restarts the loop when it flips back to true.
  //   3. prefers-reduced-motion. Skips both the ScrollTrigger pin
  //      and the rAF entirely, freezing the frame in its starting
  //      "cursor home" composition via a single style write. The
  //      intro timeline keeps its own reduced-motion path for the
  //      title/subtitle fade.
  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const frame = frameRef.current;
    if (!section || !text || !frame) return;

    const dimensions = { width: 0, height: 0 };
    const refreshDimensions = () => {
      dimensions.width = section.clientWidth;
      dimensions.height = section.clientHeight;
    };
    refreshDimensions();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // The "frame at p=0 with cursor at home" composition — equivalent
    // to the rAF's first paint on initial load. Used by the
    // reduced-motion path and re-applied on resize so the static
    // frame stays correctly placed if the viewport changes.
    //
    // Derivation: in the rAF at p=0 with c.currentX = w*0.7,
    // c.currentY = h*0.55, scale = 0.22, scrollBlend = 0:
    //   tx = c.currentX + (w*0.22)/2 - (w*scale)/2 = w*0.7
    //   ty = c.currentY - (h*0.22)/2 - (h*scale)/2 = h*0.55 - h*scale
    const applyStaticFrame = () => {
      const w = dimensions.width;
      const h = dimensions.height;
      const scale = 0.22;
      const tx = w * 0.7;
      const ty = h * 0.55 - h * scale;
      frame.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      frame.style.borderRadius = `16px`;
    };

    const ro = new ResizeObserver(() => {
      refreshDimensions();
      if (reducedMotion) applyStaticFrame();
    });
    ro.observe(section);

    if (reducedMotion) {
      applyStaticFrame();
      return () => {
        ro.disconnect();
      };
    }

    // Mobile (< 768px) skips the ScrollTrigger pin + cursor-follow rAF
    // entirely. The Tailwind absolute positioning on the slideshow
    // frame is overridden by the `@media (max-width: 767px)` block in
    // _hero.scss to render the frame as a normal block above the
    // title — no transform writes happen here, so CSS owns layout.
    // gsap.matchMedia handles enter/exit cleanly when the viewport
    // crosses 768px (resize-out kills ScrollTrigger + rAF + IO; resize
    // back in re-creates them).
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      let rafId: number | null = null;
      let isVisible = true;

      const animate = () => {
        const p = scrollProgress.current;
        const c = cursor.current;
        const w = dimensions.width;
        const h = dimensions.height;

        if (!c.initialized) {
          c.currentX = w * 0.7;
          c.currentY = h * 0.55;
          c.targetX = c.currentX;
          c.targetY = c.currentY;
          c.initialized = true;
        }

        if (!c.isActive) {
          c.targetX = lerp(c.targetX, w * 0.7, 0.02);
          c.targetY = lerp(c.targetY, h * 0.55, 0.02);
        }

        c.currentX = lerp(c.currentX, c.targetX, 0.1);
        c.currentY = lerp(c.currentY, c.targetY, 0.1);

        // Desktop final size keeps the 96px breathing gap so the
        // title/decoration around the frame still has room to read.
        // (Mobile branch removed — < 768px never enters this callback.)
        const maxScale = (w - 96) / w;
        const scale = lerp(0.22, maxScale, p);
        const scrollBlend = Math.min(1, p * 3);

        const cursorCenterX = c.currentX + (w * 0.22) / 2;
        const cursorCenterY = c.currentY - (h * 0.22) / 2;

        const finalCenterX = w / 2;
        const finalCenterY = h / 2;

        const cx = lerp(cursorCenterX, finalCenterX, scrollBlend);
        const cy = lerp(cursorCenterY, finalCenterY, scrollBlend);

        const tx = cx - (w * scale) / 2;
        const ty = cy - (h * scale) / 2;

        frame.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        frame.style.borderRadius = `${lerp(16, 8, p)}px`;

        const textOpacity = Math.max(0, 1 - p * 2.5);
        text.style.opacity = `${textOpacity}`;
        text.style.transform = `translateY(${-p * 200}px)`;

        rafId = isVisible ? requestAnimationFrame(animate) : null;
      };

      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries[0]?.isIntersecting ?? false;
          isVisible = visible;
          if (visible && rafId === null) {
            rafId = requestAnimationFrame(animate);
          }
        },
        { rootMargin: "300px 0px", threshold: 0 },
      );
      io.observe(section);

      rafId = requestAnimationFrame(animate);

      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        io.disconnect();
        st.kill();
        // Frame may carry an inline transform from the last rAF write
        // when the viewport crosses 768→767. Clear it so the mobile
        // CSS layout (relative block) isn't fighting an absolute-mode
        // translate left over from desktop. text.style is similarly
        // reset so the title/subtitle render at full opacity in flow.
        frame.style.transform = "";
        frame.style.borderRadius = "";
        text.style.transform = "";
        text.style.opacity = "";
      };
    });

    return () => {
      mm.revert();
      ro.disconnect();
    };
  }, [cursor]);

  return (
    // z-[2] lifts the whole Hero stacking context above the rail-group's
    // dotted rails (z:1 on .page-rail-group::before/::after). Without
    // this, GSAP's pin sets position:fixed on the section — that creates
    // a z:auto stacking context which the rails paint over, hiding the
    // slideshow frame and title behind the dashed lines. The internal
    // hero z-stack (slideshow z-20 over title z-10) is unaffected.
    <section ref={sectionRef} className="hero-section relative h-screen z-[2]">
      {/* Preloader backdrop — full white overlay that fades out once
          the counter hits 100. The ring itself is the cursor element
          and persists after the backdrop has faded. */}
      <div
        className={`hero-preloader-backdrop${
          !isPreloading ? " hero-preloader-backdrop--hidden" : ""
        }`}
        aria-hidden="true"
      />

      {/* Centered preloader ring — visible only while counting up.
          The site cursor itself is now a global CSS .cur file (see
          utils/_cursor.scss) that survives past the Hero pin. */}
      {isPreloading && (
        <div
          className="hero-cursor hero-cursor--preloading"
          aria-hidden="true"
        >
          <div className="hero-cursor-ring">
            <span className="hero-cursor-count">{loadingProgress}%</span>
          </div>
        </div>
      )}

      {/* Narrow centered container with dotted vertical guide lines at
          its left/right edges. The title wrapper inside is still
          absolute-centered, just relative to this container instead of
          the full section. The slideshow frame stays a sibling of this
          container so its full-bleed cursor-follow + scroll-zoom can
          still cover the whole viewport. */}
      <div className="hero-container">
        <div className="hero-title-wrapper">
          <div ref={textRef} className="hero-title-scroll">
            <h1 className="hero-title">
              <span
                ref={line1Ref}
                className="hero-title-line hero-title-line--static"
              >
                Designing product experiences
              </span>
              <span
                ref={line2Ref}
                className="hero-title-line hero-title-line--animated"
              >
                that help ideas grow and scale.
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Floating image frame — cursor follow + scroll zoom on
          desktop. Initial opacity 0 is owned by `.hero-frame` in
          `_hero.scss` (base rule) so it stays invisible through the
          preloader and the first ~70% of the desktop text timeline;
          `useHeroIntroTimeline` fades it to 1 via the shared
          timeline. On mobile the SCSS mobile override sets opacity 1
          so the frame is visible immediately (no entrance animation
          on small breakpoints — title and frame appear statically).
          Cursor-follow transform writes still happen in the rAF loop
          on desktop the whole time — just behind zero opacity during
          the preloader. */}
      <div
        ref={frameRef}
        className="hero-frame pointer-events-none absolute left-0 top-0 z-20 h-full w-full origin-top-left overflow-hidden"
        style={{ willChange: "transform, opacity" }}
      >
        {HERO_IMAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`Project preview ${i + 1}`}
            fill
            className="object-cover transition-opacity duration-500 ease-in-out"
            style={{ opacity: i === activeImage ? 1 : 0 }}
            sizes="100vw"
            priority={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
