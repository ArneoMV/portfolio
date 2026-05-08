import SiteFooter from "@/app/components/organisms/site-footer/SiteFooter";
import ProjectHeroSection from "./ProjectHeroSection";
import ProjectDarkSection from "./ProjectDarkSection";
import OtherWorkSection from "./OtherWorkSection";
import type { ProjectDetail } from "./project-detail.types";

interface ProjectDetailTemplateProps {
  project: ProjectDetail;
  otherProjects: ProjectDetail[];
}

// Project-page footer content (Task 1 spec). Different from the
// homepage footer's link/meta content, so we declare it inline
// here rather than touching the homepage's hard-coded version.
const PROJECT_FOOTER_LINKS: [
  { href: string; label: string }[],
  { href: string; label: string }[],
  { href: string; label: string }[],
] = [
  [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/lab", label: "Lab" },
  ],
  [
    { href: "#", label: "Store" },
    { href: "/#contact", label: "Contact" },
  ],
  [
    { href: "#", label: "Linkedin" },
    { href: "#", label: "Dribbble" },
  ],
];

/**
 * Project Detail page template — orchestrates the four sections:
 *   1. <ProjectHeroSection> — title, type+desc, hero image, meta,
 *      introduction.
 *   2. <ProjectDarkSection> — full-bleed dark band. Its background
 *      escapes the 1100px content width because the section is a
 *      block that spans 100% of its parent (which is full-width);
 *      the inner `.project-detail-dark-inner` recentres content at
 *      1100px so it lines up with every other section.
 *   3. <OtherWorkSection> — "Other Work" heading + two cards.
 *   4. <SiteFooter> — shared footer organism with project-page
 *      link/meta content (different from homepage's hard-coded
 *      content; homepage's FooterSection is intentionally untouched).
 *
 * All four sections share a single `.page-rail-group` wrapper so
 * the dotted vertical rails read continuously from the top of the
 * hero to the bottom of the footer (including through the dark
 * band — the rail group's `::before`/`::after` paint at z:1 over
 * positioned descendants, same pattern as the homepage's
 * Services → Contact rail group). No internal z-index changes
 * here, so rails paint symmetrically above every section.
 *
 * Static for Task 1 — no pin/parallax behaviour on the dark band
 * yet; that lands in Task 2.
 */
export default function ProjectDetailTemplate({
  project,
  otherProjects,
}: ProjectDetailTemplateProps) {
  return (
    <article className="project-detail">
      <div className="page-rail-group">
        <ProjectHeroSection project={project} />
        <ProjectDarkSection project={project} />
        <OtherWorkSection projects={otherProjects} />
        <SiteFooter
          linkGroups={PROJECT_FOOTER_LINKS}
          meta={{
            left: "©Arneo2026",
            right: (
              <span className="project-detail-footer-meta-links">
                <a href="#" className="project-detail-footer-meta-link">
                  Terms
                </a>{" "}
                <a href="#" className="project-detail-footer-meta-link">
                  Privacy
                </a>
              </span>
            ),
          }}
        />
      </div>
    </article>
  );
}
