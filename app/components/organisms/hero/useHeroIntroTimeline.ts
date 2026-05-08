"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap/gsap-init";

interface UseHeroIntroTimelineArgs {
  /** Gates the timeline — runs once after the preloader has cleared. */
  heroReady: boolean;
  /**
   * Hero <section> root — receives the temporary `is-intro-animating`
   * class while the timeline is active. SCSS scopes will-change for
   * `.hero-title-line` / `.hero-subtitle` to that class so the
   * compositor layer is only allocated for the duration of the intro,
   * not permanently for the page lifetime.
   */
  sectionRef: RefObject<HTMLElement | null>;
  /** Title line 1 — fades in (no transform). */
  line1Ref: RefObject<HTMLSpanElement | null>;
  /**
   * Title line 2 — receives the reveal animation. scaleY 0.85 → 1
   * (lands at natural proportions, no overshoot, no font-axis tween).
   */
  line2Ref: RefObject<HTMLSpanElement | null>;
  /** Subtitle below the title — fades in alongside the slideshow. */
  subtitleRef: RefObject<HTMLParagraphElement | null>;
  /** Cursor-follow slideshow frame — fades in within this same timeline. */
  frameRef: RefObject<HTMLDivElement | null>;
}

/**
 * Hero typography + slideshow-reveal intro timeline.
 *
 * The slideshow reveal lives in this same hook (not a separate one)
 * because its trigger point is "70% of the *text timeline's actual
 * duration*" — that reference is only meaningful while the text and
 * frame tweens share a single timeline. Splitting them would either
 * require recomputing the text duration externally (timing drift) or
 * driving two timelines in sync (added plumbing for no readability
 * win), so they stay co-located.
 *
 * Sequence:
 *   1. Line 1 fades in (1.6s, expo.out). Opacity-only — typography is
 *      static; no slide / blur / letter-spacing tween. The duration is
 *      preserved so the slideshow reveal still lands at the same
 *      absolute time as before.
 *   2. 0.1s breathing pause.
 *   3. Line 2 reveals: scaleY 0.85 → 1 + opacity 0 → 1 (1.4s,
 *      power3.out). transform-origin is center bottom so the line
 *      feels grounded as it settles to its natural height. Lands at
 *      scaleY 1 — no overshoot, no permanent vertical stretch.
 *   4. Frame fade-in 0 → 1 (3s, power2.out) starting at 70% of the
 *      text timeline's actual duration. Subtitle fades in at the same
 *      point so it lands with the slideshow rather than the title.
 *
 * Reduced-motion: skips the timeline; sets all elements to their
 * final on-screen state instantly so the page is usable.
 */
export function useHeroIntroTimeline({
  heroReady,
  sectionRef,
  line1Ref,
  line2Ref,
  subtitleRef,
  frameRef,
}: UseHeroIntroTimelineArgs) {
  useEffect(() => {
    if (!heroReady) return;
    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const subtitle = subtitleRef.current;
    const frame = frameRef.current;
    if (!section || !line1 || !line2 || !subtitle || !frame) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      gsap.set(line1, { opacity: 1 });
      gsap.set(line2, { opacity: 1, scaleY: 1 });
      gsap.set(subtitle, { opacity: 1 });
      // Cursor-follow slideshow visible immediately under reduced
      // motion — no timed reveal.
      gsap.set(frame, { opacity: 1 });
      // Reduced-motion path never adds is-intro-animating, so the
      // intro-scoped will-change rules in _hero.scss never activate
      // and no compositor layer is allocated.
      return;
    }

    // Add the temporary class BEFORE creating the timeline so SCSS's
    // intro-scoped will-change is in place by the time the first
    // tween paint runs. onComplete drops the class once the timeline
    // settles; the cleanup return removes it as a safety net for
    // mid-intro unmount (kill() does not invoke onComplete).
    section.classList.add("is-intro-animating");

    const tl = gsap.timeline({
      onComplete: () => {
        section.classList.remove("is-intro-animating");
      },
    });

    // Phase 1 — Line 1 fades in. Typography is static (the class is
    // .hero-title-line--static); no transform tween. Duration matches
    // the previous slide-in so total timeline length, and therefore
    // the slideshow's textDuration * 0.7 reveal point, are preserved.
    tl.fromTo(
      line1,
      { opacity: 0 },
      { opacity: 1, duration: 1.6, ease: "expo.out" },
    );

    // Short breathing pause before line 2 reveals.
    tl.to({}, { duration: 0.1 });

    // Phase 2 — Line 2 reveal: scaleY 0.85 → 1 + opacity 0 → 1.
    // Lands at natural scaleY 1 (no overshoot, no font-axis change),
    // so glyph proportions match line 1 exactly when the tween ends.
    tl.fromTo(
      line2,
      { opacity: 0, scaleY: 0.85 },
      {
        opacity: 1,
        scaleY: 1,
        duration: 1.4,
        ease: "power3.out",
      },
    );

    // Cursor-follow slideshow + subtitle reveal — fade in at 70% of
    // the text timeline's total duration. Position is computed from
    // the timeline's actual length at this point (authoritative), so
    // any future tween-duration change keeps the 70% rule correct.
    // The cursor-follow rAF loop writes transform/borderRadius on the
    // frame; GSAP only writes opacity, so they don't conflict.
    const textDuration = tl.duration();
    tl.fromTo(
      frame,
      { opacity: 0 },
      { opacity: 1, duration: 3, ease: "power2.out" },
      textDuration * 0.7,
    ).fromTo(
      subtitle,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power2.out" },
      textDuration * 0.7,
    );

    return () => {
      tl.kill();
      section.classList.remove("is-intro-animating");
    };
  }, [heroReady, sectionRef, line1Ref, line2Ref, subtitleRef, frameRef]);
}
