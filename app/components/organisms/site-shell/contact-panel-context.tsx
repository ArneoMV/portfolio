"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Bridge for non-Header components (the 3D contact scene, future
 * surface CTAs, etc.) that need to open the contact TaskSidePanel
 * without prop-drilling through unrelated layers. SiteShell owns the
 * panel state and provides this context once near the (site) layout
 * root; any descendant reads it via `useContactPanel()`.
 *
 * Header still uses the direct `onOpenContact` prop because it's a
 * sibling SiteShell renders itself — not a descendant — and the prop
 * is already wired and stable. The context complements that path; it
 * doesn't replace it.
 */
type ContactPanelContextValue = {
  openContactPanel: () => void;
};

const ContactPanelContext = createContext<ContactPanelContextValue | null>(
  null,
);

export function ContactPanelProvider({
  value,
  children,
}: {
  value: ContactPanelContextValue;
  children: ReactNode;
}) {
  return (
    <ContactPanelContext.Provider value={value}>
      {children}
    </ContactPanelContext.Provider>
  );
}

/**
 * Throws when called outside the provider — surfaces missing wiring
 * during dev rather than silently no-op'ing a contact click.
 */
export function useContactPanel() {
  const ctx = useContext(ContactPanelContext);
  if (!ctx) {
    throw new Error(
      "useContactPanel must be used within ContactPanelProvider (SiteShell)",
    );
  }
  return ctx;
}
