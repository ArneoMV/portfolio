"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/app/components/organisms/header/Header";
import TaskSidePanel from "@/app/components/organisms/task-side-panel/TaskSidePanel";
import type { TaskPreview } from "@/app/components/organisms/task-side-panel/TaskSidePanel";

const INITIAL_PREVIEW: TaskPreview = {
  category: "",
  title: "",
  description: "",
};

export type SubmissionStatus = "idle" | "submitting" | "success" | "error";

type SiteShellProps = {
  children: React.ReactNode;
};

/**
 * Client boundary for the (site) layout. Holds the contact side-panel
 * open/submit state and renders Header + children + TaskSidePanel
 * together, so the root/route layouts can stay server components.
 *
 * The "Get in touch" Header button opens the panel; the panel's own
 * Escape / outside-click / close-button handlers call `onClose`. While
 * open, `body.task-panel-open` is toggled to drive the scroll-lock and
 * the FooterToolbar's `--panel-offset` shift (see utils/_state.scss).
 */
export default function SiteShell({ children }: SiteShellProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [preview, setPreview] = useState<TaskPreview>(INITIAL_PREVIEW);
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  const handleOpenContact = useCallback(() => {
    setIsPanelOpen(true);
    setStatus("idle");
  }, []);

  const handleClose = useCallback(() => {
    setIsPanelOpen(false);
    // Reset the form only after the 250ms close transition (state.scss /
    // _modals.scss) so the user never sees fields clear mid-slide-out.
    setTimeout(() => {
      setPreview(INITIAL_PREVIEW);
      setStatus("idle");
    }, 300);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Capture the form before any await — React nulls `currentTarget`
      // once the handler's synchronous phase completes.
      const form = e.currentTarget;
      setStatus("submitting");

      const formData = new FormData(form);
      const payload = {
        category: formData.get("category"),
        title: formData.get("title"),
        description: formData.get("description"),
        name: formData.get("name"),
        email: formData.get("email"),
      };

      try {
        // NOTE: /api/contact does not exist yet — see follow-up. Until
        // the route handler is added this POST 404s and the panel shows
        // the error state; the wiring is intentionally complete so the
        // backend can plug in without touching the UI.
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        setStatus("success");
      } catch (error) {
        console.error("Contact form submission error:", error);
        setStatus("error");
      }
    },
    [],
  );

  // Sync the global body class that drives scroll-lock + FooterToolbar
  // offset. Cleanup guards against the class sticking if SiteShell
  // unmounts while the panel is open.
  useEffect(() => {
    document.body.classList.toggle("task-panel-open", isPanelOpen);
    return () => {
      document.body.classList.remove("task-panel-open");
    };
  }, [isPanelOpen]);

  return (
    <>
      <Header onOpenContact={handleOpenContact} />
      {children}
      <TaskSidePanel
        open={isPanelOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        preview={preview}
        onPreviewChange={setPreview}
        status={status}
      />
    </>
  );
}
