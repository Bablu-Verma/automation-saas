import type { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ | Go Automat Work – Intelligent Automation Solutions",
  description:
    "Find answers to frequently asked questions about Go Automat Work automation solutions. Learn how our AI-driven platform can streamline workflows and boost business efficiency.",
  keywords:
    "Go Automat Work FAQ, automation questions, workflow automation FAQ, AI automation help, business automation support, Go Automat Work support, process automation FAQs",
  openGraph: {
    title: "FAQ | Go Automat Work – Intelligent Automation Solutions",
    description:
      "Explore our FAQ section to get answers about Go Automat Work intelligent automation solutions, AI workflow optimization, and business process automation.",
    url: "https://loopaxis.babluverma.site/faq",
    siteName: "Go Automat Work",
    images: [
      {
        url: "https://loopaxis.babluverma.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "Go Automat Work – Intelligent Automation Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Go Automat Work – Intelligent Automation Solutions",
    description:
      "Have questions about Go Automat Work automation solutions? Check our FAQ to learn how AI-driven automation can optimize your business workflows.",
    images: ["https://loopaxis.babluverma.site/twitter-image.png"],
    creator: "@loopaxis",
    site: "@loopaxis",
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
    canonical: "https://loopaxis.babluverma.site/faq",
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
