/**
 * Site-wide constants for SEO/social metadata. Shared across the
 * root layout, per-route metadata exports, sitemap, and robots so
 * the production URL has a single source of truth.
 *
 * Set NEXT_PUBLIC_SITE_URL in deployment environments (Vercel etc.)
 * to override the placeholder fallback below. The fallback is a
 * best-guess production domain so local dev and preview builds
 * still emit well-formed absolute URLs in OG tags / sitemap.xml —
 * replace the literal once the real production domain is final.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://arneo.hr";

export const SITE_NAME = "Arneo";

export const SITE_DEFAULT_TITLE = "Arneo — Product Designer";

export const SITE_DEFAULT_DESCRIPTION =
  "Product designer from Zagreb helping teams shape clear, scalable digital products, websites, and product experiences.";
