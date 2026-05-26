import Link from "next/link";

// Three-column link grid + copyright row, sitting inside the same
// 1100px page-rail-group as Services / FAQ / About. The links
// subsection is bracketed top and bottom by dotted horizontal
// dividers that match the vertical rail style (4px dash, 8px gap,
// neutral-80). The copyright row below has no dividers — its top
// edge is the bottom edge of the links block.
//
// On mobile (≤767px) the three columns collapse to three centered
// stacked sections (Work/Lab/Contact, Store/Dribbble/Linkedin,
// Privacy policy) where each link is a 48px-tall full-width tap
// target. The copyright row becomes a single horizontal flex row
// with copyright left and "Zagreb, Croatia" right. See _footer.scss
// for the mobile carve-out.

const LINK_GROUPS: { href: string; label: string }[][] = [
  [
    { href: "/work", label: "Work" },
    { href: "/lab", label: "Lab" },
    { href: "#contact", label: "Contact" },
  ],
  [
    { href: "#", label: "Store" },
    { href: "https://www.behance.net/arneo", label: "Behance" },
    { href: "", label: "Linkedin" },
  ],
  [{ href: "#", label: "Privacy policy" }],
];

export default function FooterSection() {
  return (
    <footer className="footer-section" aria-label="Site footer">
      <div className="footer-container">
        <div className="footer-links">
          {LINK_GROUPS.map((group, i) => (
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
            © 2026 Arneo All rights reserved.
          </p>
          <p className="footer-meta-item footer-meta-item--right">
            Zagreb, Croatia
          </p>
        </div>
      </div>
    </footer>
  );
}
