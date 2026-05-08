"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/app/components/atoms/button/Button";

function GlobeIcon() {
  return (
    <div className="globe-icon">
      <svg
        className="mt-[2px] h-[32px] w-[32px] text-[var(--color-neutral-100)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Static outline + equator — these never change as a globe
            rotates around its Y axis, so they stay still. The meridian
            below scales horizontally between +1 and −1 to fake the
            rotation; passing through 0 reads as "edge-on" mid-spin. */}
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <ellipse
          className="globe-icon-meridian"
          cx="12"
          cy="12"
          rx="4"
          ry="9"
        />
      </svg>
    </div>
  );
}

// Pixel thresholds for the auto-hide behaviour. Kept tiny so the header
// never feels "sticky" — anything above SHOW_NEAR_TOP behaves like a
// proper hide-on-scroll-down / show-on-scroll-up control.
const SHOW_NEAR_TOP = 40; // always visible while scrollY < this
const HIDE_AFTER = 80; // don't start hiding until past this offset
const SCROLL_DELTA = 4; // ignore tiny jitter under this magnitude

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      // rAF-throttled — we coalesce multiple scroll events per frame
      // into a single state update.
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (y < SHOW_NEAR_TOP) {
          setHidden(false);
        } else if (delta > SCROLL_DELTA && y > HIDE_AFTER) {
          setHidden(true);
        } else if (delta < -SCROLL_DELTA) {
          setHidden(false);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="site-header" data-hidden={hidden ? "true" : "false"}>
      <div className="site-header-inner">
        <div className="grid-layout items-start">
          <div className="col-span-2 mobile-col-span-2">
            <div className="flex items-start gap-[var(--space-xs)]">
              <GlobeIcon />
              <div className="flex flex-col gap-[4px]">
                <p className="text-[21px] font-medium leading-[130%] text-[var(--color-neutral-100)]">
                  Croatia Based
                </p>
                <p className="text-nowrap text-[21px] font-medium leading-[130%] text-[var(--color-neutral-80)]">
                  Working globally
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-10 mobile-col-span-2 flex justify-end">
            <Button variant="dark" href="#contact">
              Get in touch
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
