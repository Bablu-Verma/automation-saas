"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiSearch, FiChevronDown } from "react-icons/fi"

type FAQItem = {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What is Loop Axis ?",
    answer: "Loop Axis  is an automation platform that helps businesses streamline workflows, integrate tools, and save time.",
  },
  {
    question: "How does Loop Axis  save time?",
    answer: "It automates repetitive tasks such as data entry, reporting, and notifications so teams can focus on strategic work.",
  },
  {
    question: "Can Loop Axis  integrate with my CRM?",
    answer: "Yes, Loop Axis  integrates with popular CRMs like HubSpot, Salesforce, and Zoho.",
  },
  {
    question: "Do I need coding knowledge to use Loop Axis ?",
    answer: "No, Loop Axis  is designed for non-technical users with an easy drag-and-drop interface.",
  },
  {
    question: "Is Loop Axis  secure?",
    answer: "Yes, Loop Axis  uses enterprise-grade encryption and complies with GDPR standards to keep your data safe.",
  },
  {
    question: "Can I try Loop Axis  for free?",
    answer: "Yes, we offer a free trial with limited features so you can test the platform before subscribing.",
  },
  {
    question: "What industries use Loop Axis ?",
    answer: "Our clients include e-commerce, finance, healthcare, IT, real estate, and more.",
  },
  {
    question: "How many integrations does Loop Axis  support?",
    answer: "Loop Axis  integrates with over 200+ apps, including Google Workspace, Slack, and Shopify.",
  },
  {
    question: "Can Loop Axis  automate email campaigns?",
    answer: "Yes, Loop Axis  can automate email campaigns, drip sequences, and personalized communications.",
  },
  {
    question: "Does Loop Axis  provide analytics?",
    answer: "Yes, Loop Axis  includes detailed analytics dashboards to monitor performance and ROI.",
  },
  {
    question: "What support options are available?",
    answer: "We provide 24/7 email support, live chat, and dedicated account managers for enterprise clients.",
  },
  {
    question: "Can Loop Axis  handle bulk data processing?",
    answer: "Yes, Loop Axis  is designed to process bulk data efficiently without performance drops.",
  },
  {
    question: "Is Loop Axis  mobile-friendly?",
    answer: "Yes, you can access and manage workflows from any mobile device.",
  },
  {
    question: "Does Loop Axis  replace employees?",
    answer: "No, Loop Axis  enhances productivity by handling repetitive tasks, allowing employees to focus on strategy and growth.",
  },
  {
    question: "What pricing plans are available?",
    answer: "We offer Basic, Pro, and Enterprise plans tailored to different business needs.",
  },
  {
    question: "Can multiple team members collaborate on workflows?",
    answer: "Yes, Loop Axis  allows real-time collaboration with role-based access control.",
  },
  {
    question: "Does Loop Axis  support AI?",
    answer: "Yes, Loop Axis  uses AI to optimize workflows and suggest automation improvements.",
  },
  {
    question: "Is training provided for new users?",
    answer: "Yes, we provide onboarding sessions, video tutorials, and documentation.",
  },
  {
    question: "Can Loop Axis  scale as my business grows?",
    answer: "Absolutely. Loop Axis  is built to scale with your needs, from startups to large enterprises.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach us via email at support@Loop Axis .com or through the Contact Us page.",
  },
]

export default function FAQClient() {
  const [query, setQuery] = useState("")
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase())
  )

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-28 px-6 max-w-5xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
          Find answers to common questions about Loop Axis . Use the search below to quickly find what you’re looking for.
        </p>
      </motion.div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto mb-12">
        <FiSearch className="absolute left-4 top-3.5 text-white/60 text-xl" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search FAQs..."
          className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-white font-semibold focus:outline-none"
              >
               {i+1}. {" "} {faq.question}
                <FiChevronDown
                  className={`transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4 text-white/80"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-white/70">No results found for “{query}”</p>
        )}
      </div>
    </section>
  )
}
