import FooterSection from "@/app/components/organisms/footer-home/FooterSection";
import ProjectHeroSection from "./ProjectHeroSection";
import ProjectDarkSection from "./ProjectDarkSection";
import ProjectLightSection from "./ProjectLightSection";
import OtherWorkSection from "./OtherWorkSection";
import type { ProjectDetail } from "./project-detail.types";

interface ProjectDetailTemplateProps {
  project: ProjectDetail;
  otherProjects: ProjectDetail[];
}

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
 *   4. <FooterSection> — canonical homepage footer organism, used
 *      site-wide after the footer unification pass (the project-page-
 *      specific `SiteFooter` it used to render has been retired).
 *
 * All four sections share a single `.page-rail-group` wrapper so
 * the dotted vertical rails read continuously from the top of the
 * hero to the bottom of the footer (including through the dark
 * band — the rail group's `::before`/`::after` paint at z:1 over
 * positioned descendants, same pattern as the homepage's
 * Services → Contact rail group). No internal z-index changes
 * here, so rails paint symmetrically above every section.
 *
 * The dark band has scroll-driven pin + scrub on its right column
 * via GSAP ScrollTrigger (see `ProjectDarkSection`). The pin only
 * activates when the right-track's content overflows the viewport
 * (`maxY > 0`) — with the current placeholder copy the overflow is
 * small enough that the scrub is imperceptible; the effect will
 * read as intended once each project's real case-study copy and
 * imagery land in `PROJECT_DETAILS`.
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
        {project.lightSection && (
          <ProjectLightSection lightSection={project.lightSection} />
        )}
        <OtherWorkSection projects={otherProjects} />
        <FooterSection />
      </div>
    </article>
  );
}
