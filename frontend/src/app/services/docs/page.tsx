import type { Metadata } from "next";
import { get_docs_by_service_api } from "@/api";
import axios from "axios";
import DocsDetailsClient from "./DocsDetailsClient";
import { FaBook } from "react-icons/fa";

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

  if(!docs){
    return(
       <div className="flex flex-col justify-center items-center text-textLight dark:text-textDark h-[65vh]">
            <FaBook className="w-14 h-14 text-red-500 dark:text-red-400 mb-3 opacity-90" />
            <p className="text-lg font-medium">Docs not found.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Please check the link or try again.
            </p>
          </div>
    )
  }

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

  const title = docs ? `${docs.name} –taskzeno` : "Docs Details –taskzeno";
  const description = docs
    ? docs.shortDescription || docs.description?.slice(0, 150) || "taskzeno Automation docs."
    : "taskzeno docs details.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://taskzeno.babluverma.site/service?id=${docsId}`,
      siteName: "taskzeno",
      images: [
        {
          url: docs?.serviceImage || "https://taskzeno.babluverma.site/og-image.png",
          width: 1200,
          height: 630,
          alt: docs?.name || "taskzeno Docs",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [docs?.serviceImage || "https://taskzeno.babluverma.site/twitter-image.png"],
      creator: "@taskzeno",
      site: "@taskzeno",
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://taskzeno.babluverma.site/service?id=${docsId}` },
  };
}
