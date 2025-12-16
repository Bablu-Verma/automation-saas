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

  const title = workflow ? `${workflow.name} –taskzeno` : "Service Details –taskzeno";
  const description = workflow
    ? workflow.shortDescription || workflow.description?.slice(0, 150) || "taskzeno Automation service."
    : "taskzeno Automation service details.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://taskzeno.babluverma.site/service?id=${workflowId}`,
      siteName: "taskzeno",
      images: [
        {
          url: workflow?.serviceImage || "https://taskzeno.babluverma.site/og-image.png",
          width: 1200,
          height: 630,
          alt: workflow?.name || "taskzeno Service",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [workflow?.serviceImage || "https://taskzeno.babluverma.site/twitter-image.png"],
      creator: "@taskzeno",
      site: "@taskzeno",
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://taskzeno.babluverma.site/service?id=${workflowId}` },
  };
}
