import ServicesClientPage from "./ServicesClient";
import { service_list_api } from "@/api";
import axios from "axios";
import type { Metadata } from "next";

// Server-side page component
export default async function ServicesPage() {
  let workflows: any[] = [];

  try {
    const { data } = await axios.post(service_list_api, {}, {
      headers: { "Content-Type": "application/json" }
    });
    workflows = data.workflows || [];
  } catch (err) {
    console.error("Failed to fetch workflows server-side:", err);
  }

  return <ServicesClientPage initialWorkflows={workflows} />;
}

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  let workflows: any[] = [];

  try {
    const { data } = await axios.post(service_list_api, {}, {
      headers: { "Content-Type": "application/json" }
    });
    workflows = data.workflows || [];
  } catch (err) {
    console.error("Failed to fetch workflows for metadata:", err);
  }

  const title = workflows.length
    ? `Services – Loop Axis | ${workflows[0].name}${workflows.length > 1 ? " & more" : ""}`
    : "Services – Loop Axis – Intelligent Automation Solutions";

  const description = workflows.length
    ? `Explore Loop Axis services such as ${workflows.slice(0, 3).map(w => w.name).join(", ")} and more to optimize your business.`
    : "Explore Loop Axis automation services to streamline workflows, enhance productivity, and scale your business.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://loopaxis.babluverma.site/services",
      siteName: "Loop Axis",
      images: [
        {
          url: "https://loopaxis.babluverma.site/og-image.png",
          width: 1200,
          height: 630,
          alt: "Loop Axis Services",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://loopaxis.babluverma.site/twitter-image.png"],
      creator: "@loopaxis",
      site: "@loopaxis",
    },
    robots: { index: true, follow: true },
    alternates: { canonical: "https://loopaxis.babluverma.site/services" },
  };
}
