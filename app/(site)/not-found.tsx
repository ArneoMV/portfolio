"use client";

import Button from "@/app/components/atoms/button/Button";
import { useContactPanel } from "@/app/components/organisms/site-shell/contact-panel-context";

/**
 * Branded 404 — caught by the (site) routing group, so it inherits
 * SiteShell (SiteNav + ContactPanelProvider) from the layout above.
 * Triggered by:
 *   - any unmatched URL within the (site) group
 *   - explicit `notFound()` calls (currently the disabled /lab route)
 *
 * Visual language matches the privacy/work pages: Young Serif display
 * type, Source Sans 3 body, neutral palette, no illustrations. The
 * three CTAs use the existing Button atom so they pick up the
 * site-wide pill style, hover ramp, focus outline, and mobile size
 * carve-out automatically.
 */
export default function NotFound() {
  const { openContactPanel } = useContactPanel();

  return (
    <section className="not-found-page" aria-labelledby="not-found-heading">
      <div className="not-found-page-inner">
        <p className="not-found-page-code" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-heading" className="not-found-page-heading">
          Page not found
        </h1>
        <p className="not-found-page-body">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="not-found-page-actions">
          <Button variant="dark" href="/">
            Back to home
          </Button>
          <Button variant="outline" href="/work">
            View work
          </Button>
          <Button variant="outline" onClick={openContactPanel}>
            Get in touch
          </Button>
        </div>
      </div>
    </section>
  );
}
