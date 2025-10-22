"use client"

import { motion } from "framer-motion"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen  py-28 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-center text-primary mb-5"
        >
          Privacy Policy
        </motion.h1>

        {/* Last Updated */}
        <p className="text-center text-gray-300 mb-12">
          Last updated: January 1, 2025
        </p>

        {/* Content */}
        <div className="space-y-10 text-gray-200 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold  mb-3">1. Introduction</h2>
            <p>
              At Mate Mind , we respect your privacy and are committed to protecting your personal
              data. This Privacy Policy explains how we collect, use, and safeguard your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal details (name, email, phone number).</li>
              <li>Payment and billing information for subscriptions.</li>
              <li>Usage data such as IP address, browser type, and device info.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">3. How We Use Your Information</h2>
            <p>We use collected data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our services.</li>
              <li>Process payments and manage subscriptions.</li>
              <li>Send important updates, offers, and notifications.</li>
              <li>Ensure security and prevent fraud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">4. Data Sharing</h2>
            <p>
              We do not sell your personal data. However, we may share information with trusted 
              third-party providers (e.g., payment processors, analytics tools) to operate our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">5. Data Retention</h2>
            <p>
              We retain your information only for as long as necessary to provide our services 
              and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">6. Security</h2>
            <p>
              We use encryption, firewalls, and secure servers to protect your data. 
              However, no system is 100% secure, so we cannot guarantee complete protection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access, update, or delete your personal data.</li>
              <li>Opt-out of marketing communications.</li>
              <li>Request a copy of the data we store about you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">8. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Updates will be effective 
              immediately upon posting on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">9. Contact Us</h2>
            <p>
              For questions or concerns about this Privacy Policy, please contact us at 
               <a href="mailto:support@Mate Mind .com" className="text-secondary underline ml-1">
                support@Mate Mind .com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
