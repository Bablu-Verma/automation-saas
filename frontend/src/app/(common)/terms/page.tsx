import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Go Automat Work – Intelligent Automation Solutions",
  description:
    "Read the Go Automat Work Terms & Conditions to understand the rules and guidelines for using our AI-driven automation platform and services.",
  keywords:
    "Go Automat Work terms and conditions, automation platform rules, AI automation terms, service agreement, business automation, workflow automation guidelines",
  openGraph: {
    title: "Terms & Conditions | Go Automat Work – Intelligent Automation Solutions",
    description:
      "Learn about Go Automat Work Terms & Conditions including eligibility, service usage, payments, subscriptions, intellectual property, and liability.",
    url: "https://loopaxis.babluverma.site/terms",
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
    title: "Terms & Conditions | Go Automat Work – Intelligent Automation Solutions",
    description:
      "Understand the rules, guidelines, and obligations for using Go Automat Work AI automation platform and services.",
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
    <div className="min-h-screen py-28 px-6">
      <div className="max-w-4xl mx-auto">

        {/* H1 (Primary color is universal) */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary text-center mb-5">
          Terms & Conditions
        </h1>

        {/* Last Updated Date (Themed) */}
        <p className="text-center mb-12 text-textLight/70 dark:text-textDark/70">
          Last updated: January 1, 2025
        </p>

        {/* Main Content Container (Themed Text) */}
        <div className="space-y-10 leading-relaxed text-textLight/85 dark:text-textDark/85">

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">1. Introduction</h2>
            <p>
              Welcome to Go Automat Work! These Terms and Conditions outline the rules and regulations for using our website and services. By accessing or using Go Automat Work, you agree to be bound by these terms. If you do not agree, please stop using our platform.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use our services. By using Go Automat Work, you represent that you meet this requirement.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">3. Service Usage and Account</h2>
            <p>
              You agree to use the Service only for lawful purposes. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">4. Payments and Subscriptions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions are billed on a recurring basis (e.g., monthly or annually).</li>
              <li>You can cancel your subscription renewal at any time.</li>
              <li>Refunds are granted solely at our discretion, typically within 7 days of the initial subscription, subject to usage limits.</li>
            </ul>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Go Automat Work. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Go Automat Work.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">6. Limitation of Liability</h2>
            <p>
              In no event shall Go Automat Work, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at
              <a href="mailto:support@loopaxis.com" className="text-primary underline ml-1 hover:text-secondary">
                support@loopaxis.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}