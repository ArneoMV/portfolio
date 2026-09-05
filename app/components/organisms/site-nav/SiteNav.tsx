"use client";

import Image from "next/image";
import Link from "next/link";

import { ScrollTrigger } from "@/lib/gsap/gsap-init";
import { useContactPanel } from "@/app/components/organisms/site-shell/contact-panel-context";

/** Role words scrolled by the marquee, in the order the old
 *  FooterToolbar shipped them. Joined with a comma + two NBSPs so the
 *  gap survives the `whitespace-nowrap` on the track. */
const ROLES = [
  "BUILDER",
  "NEXT.JS",
  "ENTHUSIAST",
  "ENGINEER",
  "CREATIVE DESIGN",
  "PRODUCT BUILDER",
];

const MARQUEE_TEXT = ROLES.join(",\u00A0\u00A0");

/**
 * The site's single navigation: identity lockup (avatar + name +
 * role marquee) on the left, Work / Contact on the right. Fixed to
 * the top on every breakpoint — no scroll-hide, no bottom bar, no
 * separate mobile pattern; the mobile layout is this same row at
 * reduced sizes (see `_site-nav.scss`).
 *
 * Mounted by SiteShell *inside* ContactPanelProvider, so "Contact"
 * reaches the TaskSidePanel through `useContactPanel()` rather than a
 * drilled prop. It is a <button>, not a link — it opens a panel, it
 * does not navigate.
 */
export default function SiteNav() {
  const { openContactPanel } = useContactPanel();

  /**
   * Restore GSAP-pinned sections to their original DOM parents before
   * React tears them down. Hero / About / Recommendations all pin on
   * the homepage, and a pin re-parents its element into a generated
   * `pin-spacer`; unmounting without killing the trigger first makes
   * React's `removeChild` target a node it no longer owns.
   *
   * The layout's <ScrollTriggerCleanup> also kills triggers on
   * pathname change, but it does so from a passive effect cleanup —
   * which React flushes *after* the mutation phase has already
   * removed the old page's DOM. This handler is the synchronous
   * pre-navigation counterpart, matching what FooterToolbar did.
   *
   * `onNavigate` (Next 16) fires only for real client-side
   * navigations, so modified clicks and cancelled navigations don't
   * needlessly tear down the current page's triggers.
   */
  const handleNavigate = () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        {/* Logo-style home link. The accessible name is set here so
            screen readers announce "Arneo MV, home" instead of
            reading the whole role list (twice, with the duplicate
            marquee copy). */}
        <Link
          href="/"
          className="site-nav-identity"
          aria-label="Arneo MV — home"
          onNavigate={handleNavigate}
        >
          <span className="site-nav-avatar">
            <Image
              src="/images/avatar_image.png"
              alt=""
              fill
              sizes="40px"
              loading="eager"
              className="object-cover"
            />
          </span>

          <span className="site-nav-identity-text">
            <span className="site-nav-name">Arneo MV</span>

            {/* Marquee: one visible copy + one aria-hidden duplicate,
                with the track translated -50% so the seam lands
                exactly where the second copy starts. Pure CSS —
                `@keyframes marquee-scroll` in core/_animations.scss. */}
            <span className="site-nav-marquee-clip">
              <span className="site-nav-marquee">
                <span className="site-nav-marquee-copy label-tech">
                  {MARQUEE_TEXT}
                </span>
                <span
                  className="site-nav-marquee-copy label-tech"
                  aria-hidden="true"
                >
                  {MARQUEE_TEXT}
                </span>
              </span>
            </span>
          </span>
        </Link>

        <nav className="site-nav-links" aria-label="Primary">
          <Link
            href="/work"
            className="site-nav-link"
            onNavigate={handleNavigate}
          >
            Work
          </Link>
          <button
            type="button"
            className="site-nav-link"
            onClick={openContactPanel}
          >
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
}
