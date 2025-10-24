import type { Metadata } from "next";
import ContactClient from "./ContactUsClient";

export const metadata: Metadata = {
  title: "Contact Us | Loop Axis – Intelligent Automation Solutions",
  description:
    "Get in touch with the Loop Axis team. We're here to help you with intelligent automation solutions that streamline workflows, enhance productivity, and transform your business operations.",
  keywords:
    "Loop Axis contact, contact Loop Axis, automation support, AI automation inquiry, workflow automation company, automation software support, business automation solutions, contact automation experts",
  openGraph: {
    title: "Contact Loop Axis – Get in Touch with Our Automation Experts",
    description:
      "Reach out to Loop Axis for personalized automation solutions and expert support. Discover how our intelligent automation platform can accelerate your business growth.",
    url: "https://loopaxis.babluverma.site/contact",
    siteName: "Loop Axis",
    images: [
      {
        url: "https://loopaxis.babluverma.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "Loop Axis – Intelligent Automation Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Loop Axis – Intelligent Automation Solutions",
    description:
      "Have questions or need automation support? Contact Loop Axis today and discover how AI-powered automation can transform your business.",
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
    canonical: "https://loopaxis.babluverma.site/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
