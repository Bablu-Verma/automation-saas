import type { Metadata } from "next";

import { service_detail_api } from "@/api";
import axios from "axios";
import ServiceDetailsClient from "./ServicesDetailsClient";

interface ServiceDetailsPageProps {
  searchParams: { id: string };
}

export default async function ServiceDetailsPage({ searchParams }: ServiceDetailsPageProps) {
  const workflowId = searchParams?.id;
  let workflow: any = null;

  try {
    const { data } = await axios.post(service_detail_api, { id: workflowId });
    workflow = data.workflow || null;
  } catch (err) {
    console.error("Failed to fetch workflow server-side:", err);
  }

  return <ServiceDetailsClient initialWorkflow={workflow} />;
}

// Dynamic metadata
export async function generateMetadata({ searchParams }: ServiceDetailsPageProps): Promise<Metadata> {
  const workflowId = searchParams?.id;
  let workflow: any = null;

  try {
    const { data } = await axios.post(service_detail_api, { id: workflowId });
    workflow = data.workflow || null;
  } catch (err) {
    console.error("Failed to fetch workflow for metadata:", err);
  }

  const title = workflow ? `${workflow.name} – Loop Axis` : "Service Details – Loop Axis";
  const description = workflow
    ? workflow.shortDescription || workflow.description?.slice(0, 150) || "Loop Axis automation service."
    : "Loop Axis automation service details.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://loopaxis.babluverma.site/service?id=${workflowId}`,
      siteName: "Loop Axis",
      images: [
        {
          url: workflow?.serviceImage || "https://loopaxis.babluverma.site/og-image.png",
          width: 1200,
          height: 630,
          alt: workflow?.name || "Loop Axis Service",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [workflow?.serviceImage || "https://loopaxis.babluverma.site/twitter-image.png"],
      creator: "@loopaxis",
      site: "@loopaxis",
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://loopaxis.babluverma.site/service?id=${workflowId}` },
  };
}
