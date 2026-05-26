import SectionHeader from "@/app/components/molecules/section-header/SectionHeader";

interface AboutTextProps {
  textRef: React.RefObject<HTMLDivElement | null>;
}

const ABOUT_PARAGRAPHS = [
  "I'm a designer from Zagreb with a slightly mixed background.",
  "Graphic design school first, then a computer science degree, then a few years across product companies, national television, and freelance projects.",
  "Building things that help people is what I enjoy most, with a few side projects of my own along the way.I also build my own projects, so I think about design beyond the screen. How it behaves, scales, and becomes a real product.",
];

/**
 * Text column for the About section. Title + three paragraphs.
 *
 * The heading renders through the shared `<SectionHeader>` molecule,
 * matching Services / FAQ / Work — typography and bottom margin are
 * defined once in `app/styles/components/_section-header.scss`.
 *
 * No word-slot infrastructure here anymore — the previous word-by-word
 * reveal scroll effect was replaced by a single translateY scrub on
 * the slideshow column (driven from AboutSection). The text now
 * renders as plain paragraphs with no per-word state.
 */
export default function AboutText({ textRef }: AboutTextProps) {
  return (
    <div ref={textRef} className="about-text-col">
      <SectionHeader title="Get to know me" />

      <div className="about-text-body body-lg text-[var(--color-text-primary)]">
        {ABOUT_PARAGRAPHS.map((paragraph, i) => (
          <p key={i} className="about-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
