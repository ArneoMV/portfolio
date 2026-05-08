"use client";

import { WORKS } from "./workData";
import styles from "./WorkList.module.scss";

type Props = {
  activeWorkId: string;
  onActivate: (id: string) => void;
};

/**
 * WorkList — four full-width project rows that drive the active work.
 *
 * Activation paths:
 * - Mouse: hover (`onMouseEnter`) — desktop preview-on-hover.
 * - Touch: tap (`onClick`) — fires reliably on first tap on touch
 *   devices, where `onMouseEnter` would otherwise stick after one
 *   tap and need a second to switch back.
 * - Keyboard: focus (`onFocus`) + Enter / Space (`onKeyDown`) for
 *   parity with button semantics.
 *
 * Hover/active state is CSS-only — a short opacity + translateX
 * transition on `.label` / `.labelHovered`. The previous GSAP
 * rotateX + sans→serif-italic font swap looked clean on paper but
 * the font-family change altered glyph metrics mid-tween and forced
 * a reflow that read as stutter.
 */
export default function WorkList({ activeWorkId, onActivate }: Props) {
  const activate = (id: string) => {
    if (id === activeWorkId) return;
    onActivate(id);
  };

  return (
    <ul className={styles.list}>
      {WORKS.map((work) => {
        const isActive = work.id === activeWorkId;
        const itemClass = [styles.item, isActive ? styles.itemActive : ""]
          .filter(Boolean)
          .join(" ");
        const labelClass = [styles.label, isActive ? styles.labelHovered : ""]
          .filter(Boolean)
          .join(" ");

        return (
          <li
            key={work.id}
            className={itemClass}
            role="button"
            aria-pressed={isActive}
            tabIndex={0}
            onMouseEnter={() => activate(work.id)}
            onFocus={() => activate(work.id)}
            onClick={() => activate(work.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                activate(work.id);
              }
            }}
          >
            <div className={styles.row}>
              <span className={labelClass}>{work.label}</span>
              <span className={styles.subtitle}>{work.subtitle}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
