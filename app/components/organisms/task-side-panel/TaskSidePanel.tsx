"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/app/components/atoms/button/Button";

export interface TaskPreview {
  category: string;
  title: string;
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
          <>
        <div className="task-side-panel-header">
          <div className="task-side-panel-title-row">
            <h3 className="task-side-panel-title">Start a Project Request</h3>
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
          </div>
          <p className="task-side-panel-subtitle">
            Tell me what you need help with. Choose a category, add a few
            details, and I&rsquo;ll review the request and get back to you.
          </p>
        </div>

        <form className="task-side-panel-body" onSubmit={onSubmit}>
          <div className="task-field">
            <label htmlFor="task-category" className="task-field-label">
              CATEGORY
            </label>
            <div className="task-select-wrap">
              <select
                id="task-category"
                name="category"
                value={preview.category}
                onChange={(e) => patchPreview({ category: e.target.value })}
                className="task-field-control"
              >
                <option value="">Select category</option>
                <option value="graphic">Graphic</option>
                <option value="product">Product</option>
                <option value="development">Development</option>
              </select>
              <img
                src="/icons/keyboard_arrow_down.svg"
                alt=""
                aria-hidden="true"
                className="task-select-arrow"
                width={18}
                height={18}
              />
            </div>
          </div>

          <div className="task-field">
            <span className="task-field-label">ASSIGNED TO</span>
            <div className="task-assigned-chip">
              <div className="task-assigned-avatar" aria-hidden="true">
                <Image
                  src="/images/avatar_image.png"
                  alt=""
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
              <span>Arneo MV</span>
            </div>
          </div>

          <div className="task-field">
            <label htmlFor="task-title" className="task-field-label">
              ADD TITLE*
            </label>
            <input
              id="task-title"
              name="title"
              type="text"
              placeholder="Untitled"
              value={preview.title}
              onChange={(e) => patchPreview({ title: e.target.value })}
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
              onChange={(e) => patchPreview({ description: e.target.value })}
              required
              className="task-field-control task-field-input"
            />
          </div>

          <hr className="task-side-panel-divider" />

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
          </>
        )}
      </aside>
    </>
  );
}
