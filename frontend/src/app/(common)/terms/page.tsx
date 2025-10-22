"use client"

import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <div className="min-h-screen  text-white py-28 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-primary text-center mb-5"
        >
          Terms & Conditions
        </motion.h1>

        {/* Last Updated */}
        <p className="text-center text-gray-300 mb-12">
          Last updated: January 1, 2025
        </p>

        {/* Content */}
        <div className="space-y-10 text-gray-200 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
            <p>
              Welcome to Mate Mind ! These Terms and Conditions outline the rules and
              regulations for using our website and services. By accessing or using Mate Mind ,
              you agree to be bound by these terms. If you do not agree, please stop using our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use our services. By using Mate Mind , 
              you represent that you meet this requirement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">3. Use of Services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may not use Mate Mind  for any illegal or unauthorized purposes.</li>
              <li>You agree not to attempt to hack, disrupt, or misuse the platform.</li>
              <li>We may suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">4. Payments & Subscriptions</h2>
            <p>
              Certain services require payment. By subscribing, you agree to pay all fees 
              associated with your chosen plan. Refunds are subject to our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">5. Intellectual Property</h2>
            <p>
              All content, branding, and intellectual property on Mate Mind  belong to us. 
              You may not copy, reproduce, or distribute our content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">6. Limitation of Liability</h2>
            <p>
              Mate Mind  is provided as is. We are not responsible for any damages or losses 
              that may result from using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold  mb-3">7. Changes to Terms</h2>
            <p>
              We may update these Terms & Conditions from time to time. Updates will be 
              effective immediately upon posting on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at 
              <a href="mailto:support@Mate Mind .com" className="text-secondary underline ml-1">support@Mate Mind .com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
