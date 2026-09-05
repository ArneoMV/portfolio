import SiteShell from "@/app/components/organisms/site-shell/SiteShell";
import ScrollTriggerCleanup from "@/app/components/atoms/ScrollTriggerCleanup";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollTriggerCleanup />
      {/* SiteShell (client) renders SiteNav + the contact
          TaskSidePanel and owns the open/submit state. SiteNav must
          stay inside it — "Contact" reaches the panel through
          ContactPanelProvider. */}
      <SiteShell>
        <main className="site-main">{children}</main>
      </SiteShell>
    </>
  );
}
