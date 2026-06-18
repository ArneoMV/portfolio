"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollTrigger } from "@/lib/gsap/gsap-init";

import ThumbCanvas from "./ThumbCanvas";

const ROLES = [
  "BUILDER",
  "NEXT.JS",
  "ENTHUSIAST",
  "ENGINEER",
  "CREATIVE DESIGN",
  "PRODUCT BUILDER",
];

type MenuItem = {
  label: string;
  href: string;
  external?: boolean;
  /** GLB model shown inside the 48x48 .footer-menu-thumb when the
   *  menu is open. The render is gated by `isOpen` so each per-thumb
   *  canvas only mounts (and only owns a WebGL context) while the
   *  user is looking at the menu. Authored materials pass through —
   *  see ThumbCanvas for the materials pipeline. */
  modelUrl: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    label: "HOME",
    href: "/",
    modelUrl: "/images/home/house.glb",
  },
  // Lab menu item hidden during job-search positioning. Restore by uncommenting.
  // {
  //   label: "LAB",
  //   href: "/lab",
  //   modelUrl: "/images/home/test_tube.glb",
  // },
  {
    label: "WORK",
    href: "/work",
    modelUrl: "/images/home/picture.glb",
  },
  {
    label: "Book a call",
    href: "https://calendly.com/arneo-marinvincetic/quick-intro-session",
    external: true,
    modelUrl: "/images/home/calendar.glb",
  },
];

export default function FooterToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  // Which menu row is hovered. Drives the `active` prop on the
  // matching <ThumbCanvas>, which in turn ramps the in-scene wobble.
  // Hover is tracked on the DOM row (not the canvas), so links stay
  // clickable and the canvas keeps `pointer-events: none`. Touch
  // devices fire onMouseEnter post-tap but the link has already
  // navigated by then, so the brief hover-state is harmless.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const marqueeText = ROLES.join(",\u00A0\u00A0");

  // Kill all ScrollTriggers synchronously before React unmounts pinned elements
  const handleNavClick = useCallback(() => {
    setIsOpen(false);
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <nav
      className="pointer-events-none fixed left-0 z-50"
      style={{
        // Bottom offset combines the design's 24px gap with the
        // iOS/Android safe-area-inset so the toolbar clears the home
        // indicator / gesture bar. `env()` resolves to 0 where there
        // is no inset, so non-affected devices keep the original 24px.
        bottom: "calc(var(--space-lg) + env(safe-area-inset-bottom))",
        right: "var(--panel-offset, 0px)",
        transition: "right 250ms ease-out",
      }}
      aria-label="Bottom navigation"
    >
      <div className="container">
        <div className="grid-layout">
          <div
            ref={menuRef}
            className="footer-toolbar-wrapper pointer-events-auto"
          >
            <div
              className={`footer-toolbar-shell ${isOpen ? "footer-toolbar-shell--open" : ""}`}
            >
              {/* Expandable menu — above the bar */}
              <div className="footer-menu">
                {MENU_ITEMS.map((item, i) => {
                  const style = { transitionDelay: `${i * 40}ms` };
                  // Hover detected on the row (not the canvas) so the
                  // whole link area triggers the wobble, not just the
                  // 48x48 icon. Pair with onMouseLeave that clears
                  // only if THIS row is still the current hover, so
                  // fast pointer moves between rows don't double-clear.
                  const handleEnter = () => setHoveredIndex(i);
                  const handleLeave = () =>
                    setHoveredIndex((prev) => (prev === i ? null : prev));

                  const content = (
                    <>
                      <div className="footer-menu-thumb">
                        {/* One small <Canvas> per thumb, rendered only
                            while the menu is open so the GL contexts
                            exist only when visible. The canvas fills
                            the 48x48 box and is pointer-events: none
                            so the parent <Link>/<a> stays clickable.
                            `active` ramps the in-scene hover wobble. */}
                        {isOpen && (
                          <ThumbCanvas
                            modelUrl={item.modelUrl}
                            active={hoveredIndex === i}
                          />
                        )}
                      </div>
                      <span className="footer-menu-label">{item.label}</span>
                    </>
                  );

                  if (item.external) {
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-menu-item"
                        style={style}
                        onClick={handleNavClick}
                        onMouseEnter={handleEnter}
                        onMouseLeave={handleLeave}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="footer-menu-item"
                      style={style}
                      onClick={handleNavClick}
                      onMouseEnter={handleEnter}
                      onMouseLeave={handleLeave}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom bar — always anchored at the bottom */}
              <div className="footer-bar">
                {/* Avatar */}
                <div className="relative h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full bg-[var(--color-neutral-20)]">
                  <Image
                    src="/images/avatar_image.png"
                    alt="Arneo MV"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                {/* Info + Marquee */}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                  <span className="text-[var(--text-xs)] font-semibold leading-[130%] text-[var(--color-text-primary)]">
                    Arneo MV
                  </span>
                  <div className="overflow-hidden">
                    <div className="footer-toolbar-marquee flex whitespace-nowrap">
                      <span className="label-tech inline-block pr-[var(--space-md)] text-[var(--color-neutral-60)]">
                        {marqueeText}
                      </span>
                      <span
                        className="label-tech inline-block pr-[var(--space-md)] text-[var(--color-neutral-60)]"
                        aria-hidden="true"
                      >
                        {marqueeText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu toggle button — text label that swaps MENU/CLOSE.
                    The `key` on the inner span forces a remount on each
                    toggle so the fade-in keyframe replays. */}
                <button
                  type="button"
                  className="footer-toolbar-toggle"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <span
                    key={isOpen ? "close" : "menu"}
                    className="footer-toolbar-toggle-text"
                  >
                    {isOpen ? "CLOSE" : "MENU"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
}
