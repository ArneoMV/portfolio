interface AboutTextProps {
  textRef: React.RefObject<HTMLDivElement | null>;
}

const ABOUT_PARAGRAPHS = [
  "I’m a product designer from Zagreb who enjoys turning unclear ideas into structured digital products.",
  "I work best where design, systems, and implementation meet: mapping the problem, simplifying flows, and shaping interfaces that feel clear, usable, and realistic to build.",
  "I also build my own projects, so I think about design beyond the screen — how it behaves, scales, and becomes a real product.",
];

/**
 * Text column for the About section. Title + three paragraphs.
 *
 * No word-slot infrastructure here anymore — the previous word-by-word
 * reveal scroll effect was replaced by a single translateY scrub on
 * the slideshow column (driven from AboutSection). The text now
 * renders as plain paragraphs with no per-word state.
 */
export default function AboutText({ textRef }: AboutTextProps) {
  return (
    <div ref={textRef} className="about-text-col">
      {/* Plain h2 inside a regular div — NOT a <header>, since the
          global `header { position: absolute }` rule applies to every
          <header> element on the page and would pull the title out
          of flow. */}
      <h2 className="title-h2 text-[var(--color-neutral-40)] about-title">
        GET TO KNOW ME
      </h2>

      <div className="about-text-body body-lg mt-[var(--space-md)] text-[var(--color-text-primary)]">
        {ABOUT_PARAGRAPHS.map((paragraph, i) => (
          <p key={i} className="about-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
