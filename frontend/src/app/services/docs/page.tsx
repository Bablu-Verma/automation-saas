import type { Metadata } from "next";
import { get_docs_by_service_api } from "@/api";
import axios from "axios";
import DocsDetailsClient from "./DocsDetailsClient";

interface ServiceDetailsPageProps {
  searchParams: { id: string };
}

export default async function ServiceDetailsPage({ searchParams }: ServiceDetailsPageProps) {
  const docsId = searchParams?.id;
  let docs: any = null;

  try {
    const { data } = await axios.post(get_docs_by_service_api, { service_id: docsId });

    docs = data.data || null;
  } catch (err) {
    console.error("Failed to fetch docs server-side:", err);
  }

  console.log(docs)

  return <DocsDetailsClient initialDoc={docs} />;
}

// Dynamic Metadata
export async function generateMetadata({ searchParams }: ServiceDetailsPageProps): Promise<Metadata> {
  const docsId = searchParams?.id;
  let docs: any = null;

  try {
    const { data } = await axios.post(get_docs_by_service_api, { id: docsId });
    docs = data.workflow || null;
  } catch (err) {
    console.error("Failed to fetch docs for metadata:", err);
  }

  const title = docs ? `${docs.name} – Loop Axis` : "Docs Details – Loop Axis";
  const description = docs
    ? docs.shortDescription || docs.description?.slice(0, 150) || "Loop Axis automation docs."
    : "Loop Axis docs details.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://loopaxis.babluverma.site/service?id=${docsId}`,
      siteName: "Loop Axis",
      images: [
        {
          url: docs?.serviceImage || "https://loopaxis.babluverma.site/og-image.png",
          width: 1200,
          height: 630,
          alt: docs?.name || "Loop Axis Docs",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [docs?.serviceImage || "https://loopaxis.babluverma.site/twitter-image.png"],
      creator: "@loopaxis",
      site: "@loopaxis",
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://loopaxis.babluverma.site/service?id=${docsId}` },
  };
}
