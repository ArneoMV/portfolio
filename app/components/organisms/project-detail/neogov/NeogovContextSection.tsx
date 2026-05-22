import Image from "next/image";
import type { NeogovProjectData } from "@/app/data/neogov-project.data";

interface NeogovContextSectionProps {
  project: NeogovProjectData;
}

/**
 * "Context" section — split between a navy panel and the white
 * section background.
 *
 * INSIDE `.neogov-context-panel` (navy, white text): lead quote →
 * 3-up stat row → Context label/text + mockup image pair → Product
 * work label/text. The panel spans rail-to-rail inside
 * `.neogov-rail-container`; inner elements carry asymmetric 24px
 * insets, and the image pair is inset 24px from the panel edges.
 *
 * OUTSIDE the panel (white background, dark text inherited): the
 * System impact label/text row and the brand-coloured callout. The
 * row's dt/dd set no explicit colour, so they flip from white (in
 * the panel) to dark (on white) automatically; the callout keeps its
 * own brand background + white text.
 *
 * Server component. Each data field is optional on
 * `NeogovProjectData`, so blocks render only when present.
 */
export default function NeogovContextSection({
  project,
}: NeogovContextSectionProps) {
  const { leadQuote, stats, contextRow, productWorkRow, systemImpactRow, callout } =
    project;

  return (
    <section className="neogov-context">
      <div className="neogov-rail-container">
        <div className="neogov-context-panel">
          {leadQuote && <p className="neogov-context-lead">{leadQuote}</p>}

          {stats && stats.length > 0 && (
            <div className="neogov-context-stats">
              {stats.map((stat, i) => {
                const variant = stat.variant ?? "stat";
                return (
                  <div
                    key={i}
                    className={`neogov-context-stat neogov-context-stat--${variant}`}
                  >
                    {variant === "meta" ? (
                      <>
                        <div className="neogov-context-stat-top">
                          {stat.label}
                        </div>
                        <div className="neogov-context-stat-bottom">
                          {stat.value}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="neogov-context-stat-top">
                          {stat.value}
                        </div>
                        <div className="neogov-context-stat-bottom">
                          {stat.label}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {contextRow && (
            <>
              <dl className="neogov-context-row neogov-context-row-text">
                <dt>{contextRow.label}</dt>
                <dd>{contextRow.text}</dd>
              </dl>
              <div className="neogov-context-images">
                {contextRow.images.map((img, i) => (
                  <Image
                    key={i}
                    src={img.src}
                    alt={img.alt}
                    width={1000}
                    height={750}
                    sizes="(max-width: 767px) 100vw, 50vw"
                  />
                ))}
              </div>
            </>
          )}

          {productWorkRow && (
            <dl className="neogov-context-row">
              <dt>{productWorkRow.label}</dt>
              <dd>{productWorkRow.text}</dd>
            </dl>
          )}
        </div>

        {/* Outside the navy panel — sit on the white section
            background. System impact row + brand callout. */}
        {systemImpactRow && (
          <dl className="neogov-context-row">
            <dt>{systemImpactRow.label}</dt>
            <dd>{systemImpactRow.text}</dd>
          </dl>
        )}

        {callout && (
          <div className="neogov-context-callout-wrap">
            <aside className="neogov-context-callout">
              <p>{callout}</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
