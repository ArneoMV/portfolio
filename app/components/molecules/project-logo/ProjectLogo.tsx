import Image from "next/image";

export type ProjectLogoProps = {
  /** Source path for the SVG/PNG logo asset. */
  src: string;
  /** Company/project name. Doubles as alt text and as part of the
   *  external-link aria-label so screen readers announce "Visit
   *  <name> website (opens in new tab)". */
  alt: string;
  /** External destination opened in a new tab. */
  href: string;
  /** Intrinsic width of the asset (the SVG's viewBox/`width` attribute).
   *  next/image uses it to compute aspect ratio; CSS forces final
   *  rendered height to 40px and lets width auto-scale. */
  width: number;
  /** Intrinsic height of the asset. */
  height: number;
  /** Optional class appended after `.project-logo-link` so per-hero
   *  layout (gap, inset, flex anchor) can target the link without
   *  affecting other heroes. */
  className?: string;
};

/**
 * Shared project-page header logo. Renders the company wordmark as an
 * external link opening in a new tab. Visual size is enforced by the
 * `.project-logo-image` rule (40px height, width auto) so every project
 * hero gets the same logo footprint regardless of the asset's
 * intrinsic dimensions.
 *
 * Server component — no client-side state needed. The hover and focus
 * styling lives in `_project-logo.scss`.
 */
export default function ProjectLogo({
  src,
  alt,
  href,
  width,
  height,
  className,
}: ProjectLogoProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`project-logo-link${className ? ` ${className}` : ""}`}
      aria-label={`Visit ${alt} website (opens in new tab)`}
    >
      <Image
        className="project-logo-image"
        src={src}
        alt={alt}
        width={width}
        height={height}
      />
    </a>
  );
}
