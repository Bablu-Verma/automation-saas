import type { Metadata } from "next";
import ContactClient from "./ContactUsClient";

export const metadata: Metadata = {
  title: "Contact Us | taskzeno – Intelligent Automation Solutions",
  description:
    "Get in touch with the taskzeno team. We're here to help you with intelligent automation solutions that streamline workflows, enhance productivity, and transform your business operations.",
  keywords:
    "taskzeno contact, contact taskzeno, automation support, AI automation inquiry, workflow automation company, automation software support, business automation solutions, contact automation experts",
  openGraph: {
    title: "Contact taskzeno – Get in Touch with Our Automation Experts",
    description:
      "Reach out to taskzeno for personalized automation solutions and expert support. Discover how our intelligent automation platform can accelerate your business growth.",
    url: "https://taskzeno.babluverma.site/contact",
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
    title: "Contact taskzeno – Intelligent Automation Solutions",
    description:
      "Have questions or need automation support? Contact taskzeno today and discover how AI-powered automation can transform your business.",
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
    canonical: "https://taskzeno.babluverma.site/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
