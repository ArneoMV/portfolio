import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-config";

/**
 * Allow-all crawl policy + a pointer to the sitemap. The sitemap
 * URL is built from the same SITE_URL constant the sitemap route
 * uses, so they always agree on the host.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
