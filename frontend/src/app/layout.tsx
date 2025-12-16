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
  title: "taskzeno – Intelligent Automation Solutions",
  description:
    "taskzeno delivers intelligent automation solutions to streamline workflows, enhance productivity, and accelerate business growth. Empower your organization with AI-driven process automation.",
  keywords:
    "taskzeno, intelligent automation, workflow automation, AI automation, robotic process automation, business automation, process optimization, SaaS platform, digital transformation, productivity tools",
  openGraph: {
    title: "taskzeno – Intelligent Automation Solutions",
    description:
      "Discover taskzeno: the AI-powered automation platform that helps businesses optimize processes, boost efficiency, and achieve digital transformation.",
    url: "https://taskzeno.babluverma.site",
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
    title: "taskzeno – AI-Driven Automation Platform for Modern Businesses",
    description:
      "Simplify workflows and enhance efficiency with taskzeno Automation solutions. Experience next-gen AI automation built for business success.",
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
    google: "", 
  },
  alternates: {
    canonical: "https://taskzeno.babluverma.site",
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
