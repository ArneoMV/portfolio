"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import emailjs from "@emailjs/browser";
import Header from "@/app/components/organisms/header/Header";
import TaskSidePanel from "@/app/components/organisms/task-side-panel/TaskSidePanel";
import type { TaskPreview } from "@/app/components/organisms/task-side-panel/TaskSidePanel";
import { ContactPanelProvider } from "./contact-panel-context";

const INITIAL_PREVIEW: TaskPreview = {
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
      // Keys MUST match the EmailJS template variable names:
      // {{user_email}}, {{user_name}}, {{message}}.
      // The old {{category}} and {{title}} keys are no longer sent (form
      // fields removed). If the dashboard template still references
      // either token it will render blank — prune those tokens from the
      // template to keep the email clean.
      const templateParams = {
        user_email: formData.get("email")?.toString() ?? "",
        user_name: formData.get("name")?.toString() ?? "",
        message: formData.get("description")?.toString() ?? "",
      };

      try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey) {
          throw new Error(
            "EmailJS credentials not configured. Check .env.local (and restart the dev server).",
          );
        }

        const response = await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          { publicKey },
        );

        if (response.status !== 200) {
          throw new Error(`EmailJS responded with status ${response.status}`);
        }

        setStatus("success");
      } catch (error) {
        console.error("EmailJS submission error:", error);
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

  // Stable context value so consumers (e.g. the 3D contact scene) don't
  // re-render every time the panel's own state churns (open/preview/status).
  // `handleOpenContact` is itself useCallback'd with [] deps, so this
  // identity stays stable across the SiteShell's lifetime.
  const contactPanelValue = useMemo(
    () => ({ openContactPanel: handleOpenContact }),
    [handleOpenContact],
  );

  return (
    <ContactPanelProvider value={contactPanelValue}>
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
    </ContactPanelProvider>
  );
}
