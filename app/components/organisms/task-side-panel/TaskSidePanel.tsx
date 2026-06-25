"use client";

import { useEffect, useRef } from "react";
import Button from "@/app/components/atoms/button/Button";

export interface TaskPreview {
  description: string;
}

interface TaskSidePanelProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  preview: TaskPreview;
  onPreviewChange: (preview: TaskPreview) => void;
  /** Submission lifecycle — swaps the form for a success message,
   *  disables the submit button while sending, and shows an inline
   *  error. Defaults to "idle" so existing callers are unaffected. */
  status?: "idle" | "submitting" | "success" | "error";
}

export default function TaskSidePanel({
  open,
  onClose,
  onSubmit,
  preview,
  onPreviewChange,
  status = "idle",
}: TaskSidePanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Click outside to close — attach on next tick so the click that
  // opened the panel doesn't immediately close it.
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) onClose();
    };
    const timer = window.setTimeout(() => {
      document.addEventListener("mousedown", onMouseDown);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [open, onClose]);

  const patchPreview = (patch: Partial<TaskPreview>) => {
    onPreviewChange({ ...preview, ...patch });
  };

  return (
    <>
      {/* Dim overlay — sits above page content (z-50 toolbar etc.) and
          below the panel (z-60). Outside-click handler in this same
          component already closes the panel when the click isn't
          inside `panelRef`, so the overlay needs no handler of its own. */}
      <div
        className={`task-side-panel-overlay ${
          open ? "task-side-panel-overlay--open" : ""
        }`}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        className={`task-side-panel ${open ? "task-side-panel--open" : ""}`}
        aria-hidden={!open}
        aria-label="Start a project request"
      >
        {/* Floating close X — sibling of the scroll surface, so it
            stays put in the panel's top-right corner while content
            beneath it scrolls. Lives outside the success/form
            branches so a single button serves both states.
            position: absolute against the non-scrolling .task-side-panel;
            see `.task-side-panel-close` in _modals.scss for safe-area
            inset, opaque background, and z-index above scroll content. */}
        <button
          type="button"
          className="task-side-panel-close"
          onClick={onClose}
          aria-label="Close project request panel"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="task-side-panel-success">
            <h3 className="task-side-panel-title">Message sent!</h3>
            <p className="task-side-panel-subtitle">
              Thanks for reaching out. I&rsquo;ll get back to you soon.
            </p>
            <Button variant="dark" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <div className="task-side-panel-scroll">
            <div className="task-side-panel-header">
              <h3 className="task-side-panel-title">Start a Project Request</h3>
              <p className="task-side-panel-subtitle">
                Tell me what you need help with. Add your details and a short
                description, and I&rsquo;ll review the request and get back to
                you.
              </p>
            </div>

            <form className="task-side-panel-body" onSubmit={onSubmit}>
              <div className="task-field">
                <label htmlFor="task-name" className="task-field-label">
                  YOUR NAME*
                </label>
                <input
                  id="task-name"
                  name="name"
                  type="text"
                  placeholder="Add name"
                  required
                  className="task-field-control task-field-input"
                />
              </div>

              <div className="task-field">
                <label htmlFor="task-email" className="task-field-label">
                  CONTACT INFORMATION*
                </label>
                <input
                  id="task-email"
                  name="email"
                  type="email"
                  placeholder="Add email"
                  required
                  className="task-field-control task-field-input"
                />
              </div>

              <div className="task-field">
                <label htmlFor="task-description" className="task-field-label">
                  ADD DESCRIPTION*
                </label>
                <textarea
                  id="task-description"
                  name="description"
                  placeholder="Add details"
                  rows={3}
                  value={preview.description}
                  onChange={(e) =>
                    patchPreview({ description: e.target.value })
                  }
                  required
                  className="task-field-control task-field-input"
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                className="task-side-panel-submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending…" : "SEND"}
              </Button>

              {status === "error" && (
                <p className="task-side-panel-error">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        )}
      </aside>
    </>
  );
}
