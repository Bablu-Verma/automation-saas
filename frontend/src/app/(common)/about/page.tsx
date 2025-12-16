import type { Metadata } from "next";
import AboutUsClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | taskzeno – Intelligent Automation Solutions",
  description:
    "Learn more about taskzeno — a leader in intelligent automation solutions. Discover how our AI-driven technology empowers organizations to streamline workflows, enhance productivity, and achieve digital transformation.",
  keywords:
    "taskzeno, abouttaskzeno, intelligent automation company, workflow automation, AI automation, business automation, automation solutions, process optimization, digital transformation, SaaS automation tools",
  openGraph: {
    title: "About taskzeno – Intelligent Automation Solutions",
    description:
      "Discover taskzeno, an AI-powered automation platform helping businesses optimize processes, boost efficiency, and accelerate digital transformation.",
    url: "https://taskzeno.babluverma.site/about",
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
    title: "About taskzeno – AI Automation for Smarter Business",
    description:
      "Get to know taskzeno, the automation platform that simplifies workflows and enhances efficiency with AI-driven solutions.",
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
  verification: {
    google: "", // 👈 Add your Google Search Console verification token here
  },
  alternates: {
    canonical: "https://taskzeno.babluverma.site/about",
  },
};

export default function AboutUs() {
  return <AboutUsClient />;
}
