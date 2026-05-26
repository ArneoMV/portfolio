"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollTrigger } from "@/lib/gsap/gsap-init";

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
};

const MENU_ITEMS: MenuItem[] = [
  { label: "HOME", href: "/" },
  { label: "LAB", href: "/lab" },
  { label: "WORK", href: "/work" },
  {
    label: "Book a call",
    href: "https://calendly.com/arneo-marinvincetic/quick-intro-session",
    external: true,
  },
];

export default function FooterToolbar() {
  const [isOpen, setIsOpen] = useState(false);
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
      className="pointer-events-none fixed bottom-[var(--space-lg)] left-0 z-50"
      style={{
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
                  const content = (
                    <>
                      <div className="footer-menu-thumb" />
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
