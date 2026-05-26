import SiteShell from "@/app/components/organisms/site-shell/SiteShell";
import FooterToolbar from "@/app/components/organisms/footer-toolbar/FooterToolbar";
import ScrollTriggerCleanup from "@/app/components/atoms/ScrollTriggerCleanup";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollTriggerCleanup />
      {/* SiteShell (client) renders Header + the contact TaskSidePanel
          and owns the open/submit state. FooterToolbar stays outside —
          it only reads the `--panel-offset` CSS var set by
          `body.task-panel-open`, no panel state needed. */}
      <SiteShell>
        <main className="site-main">{children}</main>
      </SiteShell>
      <FooterToolbar />
    </>
  );
}
