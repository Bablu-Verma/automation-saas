import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./editor.css";
import "./dangerouslyHTML.css";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/Footer";

import { Toaster } from 'react-hot-toast';
import ReduxProvider from "@/redux-store/provider_";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Loop Axis – Intelligent Automation Solutions",
  description:
    "Loop Axis delivers intelligent automation solutions to streamline workflows, enhance productivity, and accelerate business growth. Empower your organization with AI-driven process automation.",
  keywords:
    "Loop Axis, intelligent automation, workflow automation, AI automation, robotic process automation, business automation, process optimization, SaaS platform, digital transformation, productivity tools",
  openGraph: {
    title: "Loop Axis – Intelligent Automation Solutions",
    description:
      "Discover Loop Axis: the AI-powered automation platform that helps businesses optimize processes, boost efficiency, and achieve digital transformation.",
    url: "https://loopaxis.babluverma.site",
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
    title: "Loop Axis – AI-Driven Automation Platform for Modern Businesses",
    description:
      "Simplify workflows and enhance efficiency with Loop Axis automation solutions. Experience next-gen AI automation built for business success.",
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
    google: "", 
  },
  alternates: {
    canonical: "https://loopaxis.babluverma.site",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
 
        <Toaster position="top-right" />
        <ReduxProvider>
          <Navbar />
          {children}
          <Footer />
        </ReduxProvider>

      </body>
    </html>
  );
}
