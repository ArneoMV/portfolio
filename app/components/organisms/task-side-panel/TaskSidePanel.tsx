"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/app/components/atoms/button/Button";

export interface TaskPreview {
  category: string;
  title: string;
  description: string;
}

/** Single source of truth for the category combobox options. The
 *  `value` strings are what the form submits (and what reaches EmailJS
 *  as `category`) — keep them stable so existing inboxes/filters
 *  recognise the values. */
const CATEGORY_OPTIONS = [
  { value: "graphic", label: "Graphic" },
  { value: "product", label: "Product" },
  { value: "development", label: "Development" },
] as const;

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
          <CategoryField
            value={preview.category}
            onChange={(category) => patchPreview({ category })}
          />

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

/* =====================================================================
   CategoryField — custom listbox replacing the native <select>.

   Built as a button + listbox combobox per WAI-ARIA Authoring
   Practices. The reason it's custom (not native <select>) is that
   native <option> styling — specifically `padding-left` — is not
   reliably honoured in Chrome/Safari/Edge, so we couldn't enforce
   the design's 8px inset. A custom DOM-based listbox lets the SCSS
   actually apply.

   Behavior:
     - Trigger button shows the selected option (or "Select category"
       placeholder). Click toggles open/close.
     - List opens absolutely-positioned below the trigger; selecting
       an option, clicking outside, pressing Escape, or pressing
       Tab from the list all close it.
     - Hidden <input name="category"> carries the value through
       FormData → submit payload → EmailJS, identical to the previous
       native <select>. The `category` key in the EmailJS template
       params is unchanged.

   Keyboard:
     - On trigger: Enter / Space / ArrowDown opens (focuses the list);
       ArrowUp opens and starts at the last option.
     - On list: Arrow Up/Down moves the active option (wraps), Home /
       End jumps to first/last, Enter / Space selects + closes +
       returns focus to trigger, Escape closes (focus to trigger),
       Tab closes and lets the browser move focus to the next field
       (or, with Shift, back to the trigger).
     - Escape on the open list is intercepted in the capture phase so
       it does NOT also reach the panel-level Escape handler that
       would close the whole TaskSidePanel.

   ARIA:
     - Trigger: aria-haspopup="listbox", aria-expanded, aria-controls
       to the listbox id, aria-labelledby pointing at the visible
       "CATEGORY" label so screen readers announce the field name.
     - Listbox: role="listbox", aria-labelledby (same label),
       aria-activedescendant pointing at the visually-active option.
     - Each option: role="option", aria-selected reflecting the
       current `value`.
===================================================================== */

interface CategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function CategoryField({ value, onChange }: CategoryFieldProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedIndex = CATEGORY_OPTIONS.findIndex((o) => o.value === value);
  const selectedLabel =
    selectedIndex >= 0 ? CATEGORY_OPTIONS[selectedIndex].label : "Select category";
  const isPlaceholder = selectedIndex < 0;

  const openMenu = (startIndex?: number) => {
    setActiveIndex(
      typeof startIndex === "number"
        ? startIndex
        : Math.max(0, selectedIndex),
    );
    setOpen(true);
  };

  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) {
      // rAF so the listbox has time to unmount before focus moves —
      // otherwise the browser may try to keep focus on the (now-gone)
      // listbox node and land on <body> instead.
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  // Focus the listbox when it opens so the keyboard handler fires.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Outside click + capture-phase Escape (beats the panel's bubble-
  // phase Escape handler so the panel doesn't also close).
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (wrapRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const handleTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      openMenu();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(CATEGORY_OPTIONS.length - 1);
    }
  };

  const handleListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % CATEGORY_OPTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + CATEGORY_OPTIONS.length) % CATEGORY_OPTIONS.length,
      );
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(CATEGORY_OPTIONS.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(CATEGORY_OPTIONS[activeIndex].value);
      closeMenu();
    } else if (e.key === "Tab") {
      // Let the browser handle the actual focus movement; we just
      // close the list. The listbox itself is tabindex=-1 so the
      // browser advances to whatever's next/prev in the form.
      setOpen(false);
    }
  };

  return (
    <div className="task-field">
      <span id="task-category-label" className="task-field-label">
        CATEGORY
      </span>
      <div
        ref={wrapRef}
        className={`task-combobox ${open ? "task-combobox--open" : ""}`}
      >
        {/* Hidden input carries the selected value through FormData
            → SiteShell's onSubmit reads `category` from FormData →
            EmailJS gets it under the `category` template key. Same
            wire format as the old native <select>. */}
        <input type="hidden" name="category" value={value} />

        <button
          ref={triggerRef}
          type="button"
          className="task-combobox-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls="task-category-listbox"
          aria-labelledby="task-category-label"
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={handleTriggerKey}
        >
          <span
            className={
              isPlaceholder ? "task-combobox-placeholder" : "task-combobox-value"
            }
          >
            {selectedLabel}
          </span>
          <img
            src="/icons/keyboard_arrow_down.svg"
            alt=""
            aria-hidden="true"
            className="task-combobox-arrow"
            width={18}
            height={18}
          />
        </button>

        {open && (
          <ul
            ref={listRef}
            id="task-category-listbox"
            role="listbox"
            tabIndex={-1}
            aria-labelledby="task-category-label"
            aria-activedescendant={`task-category-option-${activeIndex}`}
            className="task-combobox-list"
            onKeyDown={handleListKey}
          >
            {CATEGORY_OPTIONS.map((option, i) => (
              <li
                key={option.value}
                id={`task-category-option-${i}`}
                role="option"
                aria-selected={value === option.value}
                className={`task-combobox-option ${
                  i === activeIndex ? "task-combobox-option--active" : ""
                }`}
                // Prevent the listbox from losing focus before the
                // click registers — without this, the browser blurs
                // the listbox on mousedown and the click never lands.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(option.value);
                  closeMenu();
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
