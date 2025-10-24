import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Loop Axis – Intelligent Automation Solutions",
  description:
    "Read the Loop Axis Privacy Policy to understand how we collect, use, and protect your personal information while providing AI-driven automation solutions.",
  keywords:
    "Loop Axis privacy policy, personal data protection, AI automation privacy, data security, business automation, workflow automation privacy",
  openGraph: {
    title: "Privacy Policy | Loop Axis – Intelligent Automation Solutions",
    description:
      "Learn how Loop Axis handles personal data and safeguards your privacy while delivering intelligent automation solutions.",
    url: "https://loopaxis.babluverma.site/privacy-policy",
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
    title: "Privacy Policy | Loop Axis – Intelligent Automation Solutions",
    description:
      "Discover how Loop Axis protects your personal information and ensures data security across its AI automation platform.",
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
    canonical: "https://loopaxis.babluverma.site/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-primary mb-5">
          Privacy Policy
        </h1>

        <p className="text-center text-gray-300 mb-12">
          Last updated: January 1, 2025
        </p>

        <div className="space-y-10 text-gray-200 leading-relaxed">
          {/* Sections as in your original code */}
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
            <p>
              At Loop Axis, we respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, and safeguard your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal details (name, email, phone number).</li>
              <li>Payment and billing information for subscriptions.</li>
              <li>Usage data such as IP address, browser type, and device info.</li>
            </ul>
          </section>

          {/* … other sections remain the same … */}

          <section>
            <h2 className="text-2xl font-bold mb-3">9. Contact Us</h2>
            <p>
              For questions or concerns about this Privacy Policy, please contact us at
              <a
                href="mailto:support@loopaxis.com"
                className="text-secondary underline ml-1"
              >
                support@loopaxis.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
