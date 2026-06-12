import type { Metadata } from "next";

import FooterSection from "@/app/components/organisms/footer-home/FooterSection";

const PRIVACY_DESCRIPTION =
  "What limited data this site handles, in plain language. No tracking cookies, no ads, no data sales.";

export const metadata: Metadata = {
  title: "Privacy",
  description: PRIVACY_DESCRIPTION,
  openGraph: {
    title: "Privacy — Arneo",
    description: PRIVACY_DESCRIPTION,
    url: "/privacy",
    type: "website",
  },
  twitter: {
    title: "Privacy — Arneo",
    description: PRIVACY_DESCRIPTION,
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <article className="privacy-page page-rail-group">
      <div className="container">
        <div className="privacy-content">
          <h1 className="privacy-title">Privacy</h1>

          <p className="privacy-lead">
            This is the personal portfolio of Arneo Marin-Vincetić. This page
            explains the limited data the site handles and how it is used. It is
            written in plain language, not legalese.
          </p>

          <h2 className="privacy-heading">Analytics</h2>
          <p>
            The site uses Vercel Web Analytics, a privacy-friendly analytics
            tool. It does <strong>not</strong> use cookies and does{" "}
            <strong>not</strong> track individuals across sites. It collects
            only aggregated, anonymous metrics, page views, referrer, an
            approximate country, and a device/browser type, so I can see which
            pages are visited. No personal profile is built.
          </p>

          <h2 className="privacy-heading">Contact form</h2>
          <p>
            If you choose to use the contact form, the name, email, and message
            you enter are sent to my inbox at{" "}
            <a href="mailto:info@arneomv.com" className="privacy-link">
              info@arneomv.com
            </a>{" "}
            solely so I can reply. This data is not used for marketing and is
            not shared or sold to anyone.
          </p>

          <h2 className="privacy-heading">Hosting</h2>
          <p>
            The site is hosted on Vercel. As part of normal operation and
            security, Vercel may process standard server request data - such as
            your IP address - when your browser loads a page.
          </p>

          <h2 className="privacy-heading">What this site does not do</h2>
          <ul className="privacy-list">
            <li>No advertising trackers.</li>
            <li>No cookies for tracking or profiling.</li>
            <li>No selling of data.</li>
            <li>No third-party marketing.</li>
          </ul>

          <h2 className="privacy-heading">Your choices</h2>
          <p>
            If you sent a message through the contact form and would like it
            deleted, email{" "}
            <a href="mailto:info@arneomv.com" className="privacy-link">
              info@arneomv.com
            </a>{" "}
            and I will remove it.
          </p>

          <p className="privacy-updated">Last updated: June 2026.</p>
        </div>
      </div>

      <FooterSection />
    </article>
  );
}
