"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Bridge for every component that needs to open the contact
 * TaskSidePanel without prop-drilling through unrelated layers —
 * SiteNav's "Contact" button, the 3D contact scene, the 404 page.
 * SiteShell owns the panel state and provides this context once near
 * the (site) layout root; any descendant reads it via
 * `useContactPanel()`.
 *
 * This is now the only path in. The retired Header took a drilled
 * `onOpenContact` prop; SiteNav does not.
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
