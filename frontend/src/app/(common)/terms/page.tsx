import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Loop Axis – Intelligent Automation Solutions",
  description:
    "Read the Loop Axis Terms & Conditions to understand the rules and guidelines for using our AI-driven automation platform and services.",
  keywords:
    "Loop Axis terms and conditions, automation platform rules, AI automation terms, service agreement, business automation, workflow automation guidelines",
  openGraph: {
    title: "Terms & Conditions | Loop Axis – Intelligent Automation Solutions",
    description:
      "Learn about Loop Axis Terms & Conditions including eligibility, service usage, payments, subscriptions, intellectual property, and liability.",
    url: "https://loopaxis.babluverma.site/terms",
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
    title: "Terms & Conditions | Loop Axis – Intelligent Automation Solutions",
    description:
      "Understand the rules, guidelines, and obligations for using Loop Axis AI automation platform and services.",
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
    canonical: "https://loopaxis.babluverma.site/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen text-white py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary text-center mb-5">
          Terms & Conditions
        </h1>

        <p className="text-center text-gray-300 mb-12">
          Last updated: January 1, 2025
        </p>

        <div className="space-y-10 text-gray-200 leading-relaxed">
          {/* Sections remain as in your original code */}
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
            <p>
              Welcome to Loop Axis! These Terms and Conditions outline the rules and regulations for using our website and services. By accessing or using Loop Axis, you agree to be bound by these terms. If you do not agree, please stop using our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use our services. By using Loop Axis, you represent that you meet this requirement.
            </p>
          </section>

          {/* ... remaining sections ... */}

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at 
              <a href="mailto:support@loopaxis.com" className="text-secondary underline ml-1">
                support@loopaxis.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
