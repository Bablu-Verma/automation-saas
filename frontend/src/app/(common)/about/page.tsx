import type { Metadata } from "next";
import AboutUsClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Go Automat Work – Intelligent Automation Solutions",
  description:
    "Learn more about Go Automat Work — a leader in intelligent automation solutions. Discover how our AI-driven technology empowers organizations to streamline workflows, enhance productivity, and achieve digital transformation.",
  keywords:
    "Go Automat Work, about Go Automat Work, intelligent automation company, workflow automation, AI automation, business automation, automation solutions, process optimization, digital transformation, SaaS automation tools",
  openGraph: {
    title: "About Go Automat Work – Intelligent Automation Solutions",
    description:
      "Discover Go Automat Work, an AI-powered automation platform helping businesses optimize processes, boost efficiency, and accelerate digital transformation.",
    url: "https://loopaxis.babluverma.site/about",
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
    title: "About Go Automat Work – AI Automation for Smarter Business",
    description:
      "Get to know Go Automat Work, the automation platform that simplifies workflows and enhances efficiency with AI-driven solutions.",
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
  verification: {
    google: "", // 👈 Add your Google Search Console verification token here
  },
  alternates: {
    canonical: "https://loopaxis.babluverma.site/about",
  },
};

export default function AboutUs() {
  return <AboutUsClient />;
}
