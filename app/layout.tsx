import "./globals.css";
import "./styles/main.scss";

import type { Metadata, Viewport } from "next";
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
 * `title`, `description`, `openGraph.url`, etc. as needed. The root
 * `title` is a plain string with no template/suffix: per-page string
 * titles ("Work", "Lab", a project label) are used verbatim as the tab
 * label, and any page without its own title falls back to "Arneo MV".
 *
 * No site-wide OG/Twitter image is referenced because no
 * dedicated social-card asset exists yet. Project detail pages
 * still wire their own heroImage as the OG image where present.
 * TODO: add a 1200×630 social card at /public/og-default.png
 * (or similar) and reference it here once one exists.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Arneo MV",
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
  // Favicon set lives in /public/favicon/ (favicon-generator.org
  // output). Paths are absolute from the public root. No
  // safari-pinned-tab.svg or browserconfig.xml were generated, so the
  // mask-icon link and msapplication-config are omitted; the Windows
  // tile is wired via the `other` meta tags below instead.
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [
      { url: "/favicon/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/favicon/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/favicon/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/favicon/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/favicon/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/favicon/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/favicon/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/favicon/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/favicon/apple-icon-180x180.png", sizes: "180x180" },
    ],
  },
  manifest: "/favicon/manifest.json",
  other: {
    "msapplication-TileColor": "#3f77c7",
    "msapplication-TileImage": "/favicon/ms-icon-144x144.png",
  },
};

// themeColor lives on the `viewport` export in Next 16 (it's no longer
// supported in `metadata`). Brand blue matches --color-primary-70 and
// the manifest's theme_color, tinting mobile browser chrome.
export const viewport: Viewport = {
  themeColor: "#3f77c7",
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
