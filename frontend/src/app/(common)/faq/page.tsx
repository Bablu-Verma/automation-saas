import type { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ | taskzeno – Intelligent Automation Solutions",
  description:
    "Find answers to frequently asked questions about taskzeno Automation solutions. Learn how our AI-driven platform can streamline workflows and boost business efficiency.",
  keywords:
    "taskzeno FAQ, automation questions, workflow automation FAQ, AI automation help, business automation support, taskzeno support, process automation FAQs",
  openGraph: {
    title: "FAQ | taskzeno – Intelligent Automation Solutions",
    description:
      "Explore our FAQ section to get answers about taskzeno intelligent automation solutions, AI workflow optimization, and business process automation.",
    url: "https://taskzeno.babluverma.site/faq",
    siteName: "taskzeno",
    images: [
      {
        url: "https://taskzeno.babluverma.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "taskzeno – Intelligent Automation Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | taskzeno – Intelligent Automation Solutions",
    description:
      "Have questions about taskzeno Automation solutions? Check our FAQ to learn how AI-driven automation can optimize your business workflows.",
    images: ["https://taskzeno.babluverma.site/twitter-image.png"],
    creator: "@taskzeno",
    site: "@taskzeno",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://taskzeno.babluverma.site/faq",
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
