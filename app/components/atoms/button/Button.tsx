import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

export type ButtonVariant = "dark" | "light" | "outline";
export type ButtonSize = "lg" | "sm";

interface ButtonProps {
  /** "dark" = primary CTA (dark surface). "light" = secondary CTA on
   *  light surface. "outline" = transparent surface with dark border. */
  variant?: ButtonVariant;
  /** "lg" = 56px target. "sm" = 44px. Default scales down on mobile. */
  size?: ButtonSize;
  children: ReactNode;
  /** Extra utility classes appended after the button-system classes. */
  className?: string;
  /** When set, renders an anchor (Next Link for internal hrefs, plain
   *  <a> for external/mailto/tel so target+rel work). */
  href?: string;
  /** Anchor-only — applies when `href` is set and external. */
  target?: string;
  /** Anchor-only — defaulted to `noopener noreferrer` when target="_blank". */
  rel?: string;
  /** Button-only — defaults to "button" so submit-by-default never fires
   *  unintentionally inside forms. */
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  disabled?: boolean;
  ariaLabel?: string;
}

const EXTERNAL_HREF = /^(https?:|mailto:|tel:|#)/;

export default function Button({
  variant = "dark",
  size = "lg",
  children,
  className,
  href,
  target,
  rel,
  type = "button",
  onClick,
  disabled,
  ariaLabel,
}: ButtonProps) {
  const cls = `button button--${variant} button--${size}${
    className ? ` ${className}` : ""
  }`;

  if (href) {
    // External, mail/tel, and same-page anchors render as plain <a> so
    // target/rel/scroll-into-view behavior is left to the browser. Next
    // Link handles internal route navigation.
    const useAnchor = EXTERNAL_HREF.test(href);
    const computedRel =
      rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

    if (useAnchor) {
      return (
        <a
          className={cls}
          href={href}
          target={target}
          rel={computedRel}
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
          onClick={
            disabled
              ? (e) => e.preventDefault()
              : (onClick as MouseEventHandler<HTMLAnchorElement> | undefined)
          }
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        className={cls}
        href={href}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        onClick={
          disabled
            ? (e) => e.preventDefault()
            : (onClick as MouseEventHandler<HTMLAnchorElement> | undefined)
        }
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={cls}
      type={type}
      onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
