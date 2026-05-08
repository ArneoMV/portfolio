import "./globals.css";
import "./styles/main.scss";

import type { Metadata } from "next";
import {
  Source_Sans_3,
  Young_Serif,
  VT323,
  UnifrakturCook,
  Vampiro_One,
} from "next/font/google";

import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-config";

/**
 * Site-wide metadata defaults. Per-route page.tsx files override
 * `title`, `description`, `openGraph.url`, etc. as needed. The
 * `title.template` here applies the " — Arneo" suffix to any page
 * that sets a plain string title (e.g. "Work" → "Work — Arneo").
 *
 * No site-wide OG/Twitter image is referenced because no
 * dedicated social-card asset exists yet. Project detail pages
 * still wire their own heroImage as the OG image where present.
 * TODO: add a 1200×630 social card at /public/og-default.png
 * (or similar) and reference it here once one exists.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: "%s — Arneo",
  },
  description: SITE_DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
  },
};

// Loaded as a variable font (no explicit weight array) so POWERED in
// the hero can animate `font-variation-settings: "wght" …` smoothly
// across the full 200–900 axis. All existing usages continue to work —
// any numeric font-weight resolves against the loaded variable axis.
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

const youngSerif = Young_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
});

const vt323 = VT323({
  subsets: ["latin"],
  variable: "--font-tech",
  weight: ["400"],
});

const unifrakturCook = UnifrakturCook({
  subsets: ["latin"],
  variable: "--font-fraktur",
  weight: ["700"],
});

const vampiroOne = Vampiro_One({
  subsets: ["latin"],
  variable: "--font-vampiro",
  weight: ["400"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} ${youngSerif.variable} ${vt323.variable} ${unifrakturCook.variable} ${vampiroOne.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
