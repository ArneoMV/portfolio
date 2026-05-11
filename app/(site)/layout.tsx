import Header from "@/app/components/organisms/header/Header";
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
      <Header />
      <main className="site-main">{children}</main>
      <FooterToolbar />
    </>
  );
}
