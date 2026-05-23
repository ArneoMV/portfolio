"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image, { type ImageProps } from "next/image";

/**
 * All next/image props are accepted and forwarded to the inline
 * (trigger) image; `onClick` is reserved by this component. The
 * full-screen modal renders a second <Image> at doubled intrinsic
 * size so next/image generates higher-resolution srcset variants —
 * CSS (`.zoomable-image-full`) governs the actual displayed size.
 */
type ZoomableImageProps = Omit<ImageProps, "onClick">;

/**
 * Click-to-zoom image. Renders the image inline inside a <button>
 * (native keyboard activation + focus management); clicking opens a
 * portalled full-screen lightbox with a dark backdrop. Closes on
 * backdrop click, ESC, or the × button. Body scroll is locked while
 * open, focus moves into the dialog on open and returns to the
 * trigger on close.
 *
 * Client component — reusable across project pages (currently wired
 * on /work/neogov only).
 */
export default function ZoomableImage({ alt, ...rest }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  // The modal image is sized to its own aspect ratio so the wrapper
  // box hugs the visible image and every surrounding pixel is true
  // backdrop. Seed from the passed width/height when present (most
  // consumers), then refine to the file's natural ratio once it loads
  // (covers the `fill` hero, which passes no intrinsic dimensions).
  const initialAspect =
    typeof rest.width === "number" &&
    typeof rest.height === "number" &&
    rest.height > 0
      ? rest.width / rest.height
      : undefined;
  const [aspect, setAspect] = useState<number | undefined>(initialAspect);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Tracks whether the modal has been opened, so the focus-return
  // effect below only fires on a genuine open→close transition —
  // NOT on initial mount (which, across many instances on a page,
  // would have the last-mounted one steal focus and scroll to it).
  const wasOpenRef = useRef(false);

  // While open: ESC closes, Tab is trapped on the close button (the
  // dialog's only focusable control), body scroll is locked, and
  // focus moves into the dialog.
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Return focus to the trigger only when closing after having been
  // open (guarded by wasOpenRef so mount doesn't steal focus).
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
      wasOpenRef.current = false;
    }
  }, [isOpen]);

  const altText = String(alt ?? "");

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="zoomable-image-trigger"
        onClick={() => setIsOpen(true)}
        aria-label={`Open image full screen: ${altText}`}
      >
        <Image {...rest} alt={altText} />
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="zoomable-image-modal"
            role="dialog"
            aria-modal="true"
            aria-label={altText || "Image preview"}
            onClick={(e) => {
              // Single close gate: fire only when the click lands on
              // the modal element itself — i.e. the dark backdrop.
              // The image wrapper is sized tightly to the image's
              // aspect ratio (below), so every dark pixel around the
              // image IS the modal, while clicks on the image bubble
              // up with a different target and are ignored.
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          >
            <button
              ref={closeRef}
              type="button"
              className="zoomable-image-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close preview"
            >
              ×
            </button>
            {/* Wrapper hugs the image: its aspect-ratio is driven by
                `--zoomable-ar` so there are no letterbox bars inside
                the box — the only non-backdrop region is the image
                itself. `fill` + sizes="100vw" + quality 90 pull a
                large, high-quality srcset variant for the full view. */}
            <div
              className="zoomable-image-image-wrap"
              style={
                aspect
                  ? ({ "--zoomable-ar": String(aspect) } as CSSProperties)
                  : undefined
              }
            >
              <Image
                src={rest.src}
                alt={altText}
                fill
                sizes="100vw"
                quality={90}
                priority
                className="zoomable-image-full"
                onLoad={(e) => {
                  // Refine to the file's true ratio (authoritative for
                  // the hero, which seeds no intrinsic aspect).
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    setAspect(img.naturalWidth / img.naturalHeight);
                  }
                }}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
