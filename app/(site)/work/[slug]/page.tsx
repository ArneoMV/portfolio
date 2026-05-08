import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetailTemplate from "@/app/components/organisms/project-detail/ProjectDetailTemplate";
import {
  getOtherProjects,
  getProjectDetail,
} from "@/app/components/organisms/project-detail/project-detail.helpers";
import { PROJECT_DETAILS } from "@/app/data/project-details.data";

export function generateStaticParams() {
  return PROJECT_DETAILS.map((project) => ({ slug: project.slug }));
}

/**
 * Per-project metadata sourced from the same PROJECT_DETAILS entry
 * the page itself renders — no duplication. Falls back to a generic
 * "Project not found" title for unknown slugs so crawlers that hit
 * dead URLs (the page itself calls notFound()) still see a sane head.
 *
 * project.heroImage is wired as the OG/Twitter image when present.
 * The current data points each entry at a real /public/images file,
 * so no broken paths are emitted; if a project ever ships without a
 * heroImage the `images` field is simply omitted.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectDetail(slug);

  if (!project) {
    return {
      title: "Project not found",
      description: "The requested project could not be found.",
    };
  }

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
 * /work/[slug] — individual project detail page.
 *
 * Renders the redesigned project-detail template (hero +
 * introduction → static dark band → other work → footer). All
 * four sections live inside <ProjectDetailTemplate>; this route
 * just resolves the project by slug, picks two "other work"
 * projects deterministically, and hands them off.
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectDetail(slug);
  if (!project) notFound();

  const otherProjects = getOtherProjects(slug, 2);

  return (
    <ProjectDetailTemplate project={project} otherProjects={otherProjects} />
  );
}
