interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional class on the outer wrapper — used by the section that
   *  hosts the header for per-section spacing tweaks (e.g. an
   *  override on `margin-bottom`). The inner title + subtitle
   *  classes are fixed. */
  className?: string;
}

/**
 * Shared centred title + optional subtitle block used by the
 * homepage Services and FAQ sections. Plain `<div>` (not `<header>`)
 * because the global `header { position: absolute }` rule in
 * `_header.scss` matches every `<header>` element on the page and
 * pulled this block out of normal flow when it was tagged that way.
 *
 * Styles live in `app/styles/components/_section-header.scss` —
 * extracted from the previously duplicated `.svc-title-*` and
 * `.faq-title-*` rules, which were byte-identical.
 */
export default function SectionHeader({
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  const cls = className ? `section-header ${className}` : "section-header";
  return (
    <div className={cls}>
      <h2 className="section-header__title">{title}</h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </div>
  );
}
