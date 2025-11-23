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
    ? `Services – Go Automat Work | ${workflows[0].name}${workflows.length > 1 ? " & more" : ""}`
    : "Services – Go Automat Work – Intelligent Automation Solutions";

  const description = workflows.length
    ? `Explore Go Automat Work services such as ${workflows.slice(0, 3).map(w => w.name).join(", ")} and more to optimize your business.`
    : "Explore Go Automat Work automation services to streamline workflows, enhance productivity, and scale your business.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://loopaxis.babluverma.site/services",
      siteName: "Go Automat Work",
      images: [
        {
          url: "https://loopaxis.babluverma.site/og-image.png",
          width: 1200,
          height: 630,
          alt: "Go Automat Work Services",
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
