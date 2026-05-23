import ZoomableImage from "@/app/components/molecules/zoomable-image/ZoomableImage";
import type { CaseStudyContextProps } from "./case-study.types";

/**
 * Reusable dark "Context" section — split between a navy panel and the
 * section background.
 *
 * INSIDE `.case-study-context-panel` (navy, white text): lead quote →
 * stat row → primary label/text row + optional image row → any
 * additional `insideRows`. The panel spans rail-to-rail inside
 * `.case-study-rail-container`; inner elements carry asymmetric 24px
 * insets, and the image row is inset 24px from the panel edges.
 *
 * OUTSIDE the panel (section background, dark text inherited): the
 * `outsideRows` and the brand callout. A row's dt/dd set no explicit
 * colour, so they flip from white (in the panel) to dark (on the
 * background) automatically; the callout keeps its own brand
 * background + white text.
 *
 * The image row generalises the old Neogov 2-up assumption: it emits a
 * `case-study-context-images--{count}` modifier so the SCSS picks the
 * grid (1, 2, or 3 columns). Server component — each field is optional,
 * so blocks render only when present.
 */
export default function CaseStudyContextSection({
  leadQuote,
  stats,
  contextRow,
  insideRows,
  outsideRows,
  callout,
}: CaseStudyContextProps) {
  return (
    <section className="case-study-context">
      <div className="case-study-rail-container">
        <div className="case-study-context-panel">
          {leadQuote && <p className="case-study-context-lead">{leadQuote}</p>}

          {stats && stats.length > 0 && (
            <div className="case-study-context-stats">
              {stats.map((stat, i) => {
                const variant = stat.variant ?? "stat";
                return (
                  <div
                    key={i}
                    className={`case-study-context-stat case-study-context-stat--${variant}`}
                  >
                    {variant === "meta" ? (
                      <>
                        <div className="case-study-context-stat-top">
                          {stat.label}
                        </div>
                        <div className="case-study-context-stat-bottom">
                          {stat.value}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="case-study-context-stat-top">
                          {stat.value}
                        </div>
                        <div className="case-study-context-stat-bottom">
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
              <dl className="case-study-context-row">
                <dt>{contextRow.label}</dt>
                <dd>{contextRow.text}</dd>
              </dl>
              {contextRow.images && contextRow.images.length > 0 && (
                <div
                  className={`case-study-context-images case-study-context-images--${contextRow.images.length}`}
                >
                  {contextRow.images.map((img, i) => (
                    <ZoomableImage
                      key={i}
                      src={img.src}
                      alt={img.alt}
                      width={1000}
                      height={750}
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {insideRows?.map((row, i) => (
            <dl key={i} className="case-study-context-row">
              <dt>{row.label}</dt>
              <dd>{row.text}</dd>
            </dl>
          ))}
        </div>

        {/* Outside the navy panel — sit on the section background. */}
        {outsideRows?.map((row, i) => (
          <dl key={i} className="case-study-context-row">
            <dt>{row.label}</dt>
            <dd>{row.text}</dd>
          </dl>
        ))}

        {callout && (
          <div className="case-study-context-callout-wrap">
            <aside className="case-study-context-callout">
              <p>{callout}</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
