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
 * It renders as TWO sibling fixed layers, not one. The links live in
 * their own layer so `mix-blend-mode: difference` can be declared on
 * a fixed element rather than inside one — see the comment above the
 * blend layer below for why that distinction decides whether the
 * blend works at all. Both layers share the same `.site-nav-inner`
 * box, so the row reads as a single bar.
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
    <>
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

          {/* Invisible stand-in for the links, which now render in the
              blend layer below. It has to stay in this row: on mobile
              `.site-nav-identity` is `flex: 0 1 auto` over a very wide
              max-content (the nowrap marquee), so it only shrinks as
              far as the row forces it to. With nothing competing for
              the space it stops shrinking and the white card stretches
              across the whole bar — measured 260px -> 367px at 414px
              wide. Reserving the links' footprint keeps the card at
              exactly the width it had.

              `visibility: hidden` keeps the box in flow while painting
              nothing, and drops it from the accessibility tree, so the
              real <nav> in the blend layer stays the only announced
              copy. Spans, not links, so there is no duplicate tab
              stop. */}
          <div
            className="site-nav-links site-nav-links--spacer"
            aria-hidden="true"
          >
            <span className="site-nav-link">Work</span>
            <span className="site-nav-link">Contact</span>
          </div>
        </div>
      </header>

      {/* Blend layer — Work / Contact only.
          `mix-blend-mode: difference` has to sit on a FIXED element,
          not inside one: `.site-nav` above is `position: fixed`, which
          creates a stacking context, and a stacking context is an
          isolated blending group. A blend declared on a descendant of
          it can only see backdrop painted inside that group — i.e. the
          transparent bar — so it would be a silent no-op. Declared
          here, on the fixed element itself, the layer blends against
          the root stacking context: the page scrolling behind it.

          The layer spans the full bar and therefore overlaps the
          identity card, but every pixel outside the two links is fully
          transparent, and `difference` against a zero-alpha source
          returns the backdrop untouched — so the card, avatar, name
          and marquee are never blended. They stay in `.site-nav`.

          Geometry is the same `.site-nav-inner` box the header uses,
          so the links land exactly where they did; `--blend` only
          flips the justification and restores the row height. See
          `layout/_site-nav.scss`. */}
      <div className="site-nav-blend">
        <div className="site-nav-inner site-nav-inner--blend">
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
      </div>
    </>
  );
}
