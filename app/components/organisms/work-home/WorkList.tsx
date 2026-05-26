"use client";

import Link from "next/link";
import { WORKS } from "./workData";
import styles from "./WorkList.module.scss";

type Props = {
  activeWorkId: string;
  onActivate: (id: string) => void;
};

/**
 * WorkList — four full-width project rows. Each row is a Next.js
 * `<Link>` to `/work/{id}`: clicking (or Enter on a focused row)
 * navigates, and Next prefetches the target on hover. Hovering also
 * sets the active work so the desktop CRT preview switches
 * (`onMouseEnter` only — focus and tap now navigate rather than drive
 * the preview).
 *
 * Rows are direct grid children of `.list` so the ≥640px subgrid
 * (label column / subtitle column) still aligns across all four rows;
 * a wrapping `<li>` would break the subgrid chain.
 *
 * Hover/active state is CSS-only — a short opacity + translateX
 * transition on `.label` / `.labelHovered`.
 */
export default function WorkList({ activeWorkId, onActivate }: Props) {
  const activate = (id: string) => {
    if (id === activeWorkId) return;
    onActivate(id);
  };

  return (
    <div className={styles.list}>
      {WORKS.map((work) => {
        const isActive = work.id === activeWorkId;
        const itemClass = [styles.item, isActive ? styles.itemActive : ""]
          .filter(Boolean)
          .join(" ");
        const labelClass = [styles.label, isActive ? styles.labelHovered : ""]
          .filter(Boolean)
          .join(" ");

        return (
          <Link
            key={work.id}
            href={`/work/${work.id}`}
            className={itemClass}
            onMouseEnter={() => activate(work.id)}
            prefetch
          >
            <span className={labelClass}>{work.label}</span>
            <span className={styles.subtitle}>{work.subtitle}</span>
          </Link>
        );
      })}
    </div>
  );
}
