"use client";

import { useLayoutEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap/gsap-init";

/**
 * Lock each `.about-word-slot` to the natural width+height of its inner
 * word at the base font, so cycling the inner font during the scroll-
 * driven reveal never reflows the paragraph. Re-measures on resize and
 * refreshes ScrollTrigger so pinned offsets stay correct after layout
 * shifts. Waits for `document.fonts.ready` on the initial pass so the
 * first measurement uses the final (loaded) font metrics, not the
 * fallback's.
 */
export function useAboutWordSlotSizing(
  wordRefs: React.RefObject<(HTMLSpanElement | null)[]>,
) {
  useLayoutEffect(() => {
    let cancelled = false;

    const measure = () => {
      wordRefs.current.forEach((word) => {
        if (!word) return;
        const slot = word.parentElement as HTMLElement | null;
        if (!slot) return;
        const savedFont = word.style.fontFamily;
        word.style.fontFamily = "";
        slot.style.width = "";
        slot.style.height = "";
        const rect = word.getBoundingClientRect();
        slot.style.width = `${Math.ceil(rect.width)}px`;
        slot.style.height = `${Math.ceil(rect.height)}px`;
        word.style.fontFamily = savedFont;
      });
      ScrollTrigger.refresh();
    };

    const run = async () => {
      if (typeof document !== "undefined" && document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore — fall through to measure anyway
        }
      }
      if (!cancelled) measure();
    };
    run();

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [wordRefs]);
}
