import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy |taskzeno – Intelligent Automation Solutions",
  description:
    "Read the taskzeno Privacy Policy to understand how we collect, use, and protect your personal information while providing AI-driven automation solutions.",
  keywords:
    "taskzeno privacy policy, personal data protection, AI automation privacy, data security, business automation, workflow automation privacy",
  openGraph: {
    title: "Privacy Policy |taskzeno – Intelligent Automation Solutions",
    description:
      "Learn how taskzeno handles personal data and safeguards your privacy while delivering intelligent automation solutions.",
    url: "https://taskzeno.babluverma.site/privacy-policy",
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
    title: "Privacy Policy |taskzeno – Intelligent Automation Solutions",
    description:
      "Discover how taskzeno protects your personal information and ensures data security across its AI automation platform.",
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
    canonical: "https://taskzeno.babluverma.site/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-28 px-6">
      <div className="max-w-4xl mx-auto">
        {/* H1 (Primary color is universal) */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-primary mb-5">
          Privacy Policy
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
              At taskzeno, we respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, and safeguard your information.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal details (name, email, phone number).</li>
              <li>Payment and billing information for subscriptions.</li>
              <li>Usage data such as IP address, browser type, and device info.</li>
            </ul>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our Service, including monitoring the usage of our Service.</li>
              <li>To manage your account and subscription.</li>
              <li>To contact you with updates, security alerts, and service communications.</li>
              <li>To provide you with news, special offers, and general information about other goods, services, and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</li>
            </ul>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">4. Data Security</h2>
            <p>
              The security of your Personal Data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect Your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">5. Links to Other Websites</h2>
            <p>
              Our Service may contain links to other websites that are not operated by Us. If You click on a third-party link, You will be directed to that third partys site. We strongly advise You to review the Privacy Policy of every site You visit.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">6. Childrens Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that your child has provided Us with Personal Data, please contact Us.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">7. Changes to this Privacy Policy</h2>
            <p>
              We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">8. Legal Compliance</h2>
            <p>
              We are dedicated to ensuring compliance with applicable data protection laws, including GDPR and CCPA, where required.
            </p>
          </section>

          <section>
            {/* H2 Theming */}
            <h2 className="text-2xl font-bold mb-3 text-textLight dark:text-textDark">9. Contact Us</h2>
            <p>
              For questions or concerns about this Privacy Policy, please contact us at
              <a
                href="mailto:taskzenoautomat@gmail.com"
                className="text-primary underline ml-1 hover:text-secondary"
              >
                taskzenoautomat@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}