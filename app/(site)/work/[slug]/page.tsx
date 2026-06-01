import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NeogovProjectPage from "@/app/components/organisms/project-detail/NeogovProjectPage";
import SponaProjectPage from "@/app/components/organisms/project-detail/SponaProjectPage";
import EliteDigitalProjectPage from "@/app/components/organisms/project-detail/EliteDigitalProjectPage";
import CroatelProjectPage from "@/app/components/organisms/project-detail/CroatelProjectPage";
import ProjectDetailTemplate from "@/app/components/organisms/project-detail/ProjectDetailTemplate";
import {
  getOtherProjects,
  getProjectDetail,
} from "@/app/components/organisms/project-detail/project-detail.helpers";
import { PROJECT_DETAILS } from "@/app/data/project-details.data";
import { NEOGOV_PROJECT } from "@/app/data/neogov-project.data";
import { SPONA_PROJECT } from "@/app/data/spona-project.data";
import { ELITE_DIGITAL_PROJECT } from "@/app/data/elite-digital-project.data";
import { CROATEL_PROJECT } from "@/app/data/croatel-project.data";

export function generateStaticParams() {
  // PROJECT_DETAILS still retains the Neogov entry (used for the
  // "Other Work" cards + this list), so the neogov path is emitted
  // here. The detail route below branches "neogov" to its dedicated
  // page; every other slug renders through the shared template.
  return PROJECT_DETAILS.map((project) => ({ slug: project.slug }));
}

/**
 * Build per-project page metadata from the common fields shared by
 * both `ProjectDetail` and `NeogovProjectData`. Accepting a narrow
 * structural shape lets the same builder serve the shared-template
 * projects and the dedicated Neogov page without duplicating the
 * OG/Twitter wiring.
 */
function buildProjectMetadata(project: {
  slug: string;
  title: string;
  description: string;
  heroImage?: string;
  heroImageAlt?: string;
}): Metadata {
  const ogTitle = `${project.title} — Arneo`;
  const url = `/work/${project.slug}`;
  const images = project.heroImage
    ? [
        {
          url: project.heroImage,
          alt: project.heroImageAlt ?? project.title,
        },
      ]
    : undefined;

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: ogTitle,
      description: project.description,
      url,
      type: "website",
      images,
    },
    twitter: {
      title: ogTitle,
      description: project.description,
      images: project.heroImage ? [project.heroImage] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Per-project metadata. Neogov is sourced from `NEOGOV_PROJECT`
 * (the dedicated page's data) so its head stays in sync with what
 * that page renders as the custom design diverges; every other slug
 * is sourced from its `PROJECT_DETAILS` entry. Falls back to a
 * generic "Project not found" title for unknown slugs so crawlers
 * that hit dead URLs (the page itself calls notFound()) still see a
 * sane head.
 *
 * heroImage is wired as the OG/Twitter image when present. The
 * current data points each entry at a real /public/images file, so
 * no broken paths are emitted; if a project ever ships without a
 * heroImage the `images` field is simply omitted.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug === NEOGOV_PROJECT.slug) {
    return buildProjectMetadata(NEOGOV_PROJECT);
  }

  const project = getProjectDetail(slug);
  if (!project) {
    return {
      title: "Project not found",
      description: "The requested project could not be found.",
    };
  }

  return buildProjectMetadata(project);
}

/**
 * /work/[slug] — individual project detail page.
 *
 * Routing branches on slug:
 *   • "neogov" → the dedicated <NeogovProjectPage> (its own data +
 *     custom design freedom). It resolves its own "Other Work"
 *     cards internally, so this route doesn't pass props.
 *   • "spona" → the dedicated <SponaProjectPage> (same bespoke
 *     pattern as Neogov: own data, resolves its own "Other Work").
 *   • "elite-digital" → the dedicated <EliteDigitalProjectPage>
 *     (same bespoke pattern: own data, third hero variant — a
 *     full-width banner in normal flow).
 *   • "croatel" → the dedicated <CroatelProjectPage> (same bespoke
 *     pattern: own data, banner-only hero + bespoke light section).
 *   • everything else → the shared <ProjectDetailTemplate> (hero +
 *     introduction → dark band → optional light section → other
 *     work → footer). This route resolves the project by slug,
 *     picks two "other work" projects deterministically, and hands
 *     them off.
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === NEOGOV_PROJECT.slug) {
    return <NeogovProjectPage />;
  }

  if (slug === SPONA_PROJECT.slug) {
    return <SponaProjectPage />;
  }

  if (slug === ELITE_DIGITAL_PROJECT.slug) {
    return <EliteDigitalProjectPage />;
  }

  if (slug === CROATEL_PROJECT.slug) {
    return <CroatelProjectPage />;
  }

  const project = getProjectDetail(slug);
  if (!project) notFound();

  const otherProjects = getOtherProjects(slug, 2);

  return (
    <ProjectDetailTemplate project={project} otherProjects={otherProjects} />
  );
}
