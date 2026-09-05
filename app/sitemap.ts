import type { MetadataRoute } from "next";

import { PROJECT_DETAILS } from "@/app/data/project-details.data";
import { SITE_URL } from "@/lib/site-config";

/**
 * Sitemap generated from the same PROJECT_DETAILS data the route
 * /work/[slug] uses, so adding/removing a project automatically
 * updates the sitemap on the next build with no separate edit.
 *
 * Routes intentionally excluded:
 *   - /contact, /about — routes deleted with the nav rework; both
 *     were empty stubs and the real contact + about content lives
 *     inside the homepage. They now fall through to the branded 404.
 *     Contact is reached via SiteNav's "Contact" button, which opens
 *     the TaskSidePanel rather than navigating.
 *   - /coaching — placeholder page with no real content yet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/work`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Lab route hidden during job-search positioning. Restore by uncommenting.
    // {
    //   url: `${SITE_URL}/lab`,
    //   lastModified,
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECT_DETAILS.map(
    (project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...projectRoutes];
}
