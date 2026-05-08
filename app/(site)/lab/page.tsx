import type { Metadata } from "next";

import LabScene from "@/app/components/organisms/lab/LabScene";

const LAB_PAGE_TITLE = "Lab — Arneo";
const LAB_PAGE_DESCRIPTION =
  "Experiments, prototypes, and visual explorations from Arneo — small builds and design studies between client work.";

export const metadata: Metadata = {
  title: "Lab",
  description: LAB_PAGE_DESCRIPTION,
  openGraph: {
    title: LAB_PAGE_TITLE,
    description: LAB_PAGE_DESCRIPTION,
    url: "/lab",
    type: "website",
  },
  twitter: {
    title: LAB_PAGE_TITLE,
    description: LAB_PAGE_DESCRIPTION,
  },
  alternates: {
    canonical: "/lab",
  },
};

export default function LabPage() {
  return <LabScene />;
}
