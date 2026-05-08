import Link from "next/link";
import type { ReactNode } from "react";

export interface SiteFooterLink {
  href: string;
  label: string;
}

export interface SiteFooterMeta {
  left: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

interface SiteFooterProps {
  /**
   * Three columns of footer links (left / center / right).
   * Pass an empty array for any column you want to skip.
   */
  linkGroups: [SiteFooterLink[], SiteFooterLink[], SiteFooterLink[]];
  meta: SiteFooterMeta;
  /**
   * Optional aria-label for the footer landmark. Defaults to
   * "Site footer" so the semantics match the homepage footer.
   */
  ariaLabel?: string;
}

/**
 * Shared site-footer organism — uses the same `.footer-section` /
 * `.footer-container` SCSS as the homepage Footer, parameterised on
 * link groups and copyright/meta content. Project detail pages call
 * it directly with their own link/meta content; the homepage's
 * existing `FooterSection.tsx` is intentionally untouched in Task 1
 * (stays in `footer-home/`) so its rendering is byte-identical.
 */
export default function SiteFooter({
  linkGroups,
  meta,
  ariaLabel = "Site footer",
}: SiteFooterProps) {
  return (
    <footer className="footer-section" aria-label={ariaLabel}>
      <div className="footer-container">
        <div className="footer-links">
          {linkGroups.map((group, i) => (
            <ul
              key={i}
              className={`footer-links-col footer-links-col--${
                i === 0 ? "left" : i === 1 ? "center" : "right"
              }`}
            >
              {group.map((link) => (
                <li key={link.label} className="footer-links-item">
                  <Link href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="footer-meta">
          <p className="footer-meta-item footer-meta-item--left">
            {meta.left}
          </p>
          {meta.center !== undefined && (
            <p className="footer-meta-item footer-meta-item--center">
              {meta.center}
            </p>
          )}
          {meta.right !== undefined && (
            <p className="footer-meta-item footer-meta-item--right">
              {meta.right}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
