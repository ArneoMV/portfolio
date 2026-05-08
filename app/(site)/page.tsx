import HeroSection from "@/app/components/organisms/hero/HeroSection";
import ProjectsSection from "@/app/components/organisms/projects-home/ProjectsSection";
import AboutSection from "@/app/components/organisms/about-home/AboutSection";
import WorkSection from "@/app/components/organisms/work-home/WorkSection";
import ServicesSection from "@/app/components/organisms/services-home/ServicesSection";
import FAQSection from "@/app/components/organisms/faq-home/FAQSection";
import FooterSection from "@/app/components/organisms/footer-home/FooterSection";
import ContactSection from "@/app/components/organisms/contact-home/ContactSection";

export default function HomePage() {
  return (
    <>
      {/* Hero gets its own rail-group; Hero's z:2 covers the rails in
          its area, so the rails are only visually present where they
          render through Projects (now via .projects-section's own
          ::before/::after — see _projects.scss). */}
      <div className="page-rail-group">
        <HeroSection />
      </div>

      {/* Projects + Work form a reveal pair: Projects sticks at top:0
          while Work (z:2) scrolls up over it, painting above the
          sticky Projects (z:1) for a smooth from-bottom reveal. The
          wrapper exists only to give Projects' sticky a containing
          block tall enough to span Work's scroll height. */}
      <div className="projects-work-reveal">
        <ProjectsSection />
        <WorkSection />
      </div>

      {/* Lower content (Services + FAQ + About + Footer) and Contact
          form a reveal pair. The lower-content-layer wraps the rail
          group as the "background" layer (z:1); Contact is the
          "foreground" layer (z:2). Footer is just a normal child of
          the rail group — it does not stick. As the user scrolls
          past the rail group, Contact rises into the viewport from
          below and paints above the rail group at the z-index level.
          Contact carries its own dotted ::before/::after rails (in
          _contact.scss) so the visual rail line still reads
          continuously through the dark band, matching the original
          rails-through-Contact look even though Contact is now a
          sibling of the rail group rather than a child. */}
      <div className="lower-contact-reveal">
        <div className="lower-content-layer">
          <div className="page-rail-group">
            <ServicesSection />
            <FAQSection />
            <AboutSection />
            <FooterSection />
          </div>
        </div>
        <ContactSection />
      </div>
    </>
  );
}
