"use client"

import { useState } from "react"
// Framer Motion removed from imports
import { FiSearch, FiChevronDown } from "react-icons/fi"

type FAQItem = {
  question: string
  answer: string
}

// Data array remains the same
const faqs: FAQItem[] = [
  {
    question: "What is Loop Axis ?",
    answer: "Loop Axis is an automation platform that helps businesses streamline workflows, integrate tools, and save time.",
  },
  {
    question: "How does Loop Axis save time?",
    answer: "It automates repetitive tasks such as data entry, reporting, and notifications so teams can focus on strategic work.",
  },
  {
    question: "Can Loop Axis integrate with my CRM?",
    answer: "Yes, Loop Axis integrates with popular CRMs like HubSpot, Salesforce, and Zoho.",
  },
  {
    question: "Do I need coding knowledge to use Loop Axis ?",
    answer: "No, Loop Axis is designed for non-technical users with an easy drag-and-drop interface.",
  },
  {
    question: "Is Loop Axis secure?",
    answer: "Yes, Loop Axis uses enterprise-grade encryption and complies with GDPR standards to keep your data safe.",
  },
  {
    question: "Can I try Loop Axis for free?",
    answer: "Yes, we offer a free trial with limited features so you can test the platform before subscribing.",
  },
  {
    question: "What industries use Loop Axis ?",
    answer: "Our clients include e-commerce, finance, healthcare, IT, real estate, and more.",
  },
  {
    question: "How many integrations does Loop Axis support?",
    answer: "Loop Axis integrates with over 200+ apps, including Google Workspace, Slack, and Shopify.",
  },
  {
    question: "Can Loop Axis automate email campaigns?",
    answer: "Yes, Loop Axis can automate email campaigns, drip sequences, and personalized communications.",
  },
  {
    question: "Does Loop Axis provide analytics?",
    answer: "Yes, Loop Axis includes detailed analytics dashboards to monitor performance and ROI.",
  },
  {
    question: "What support options are available?",
    answer: "We provide 24/7 email support, live chat, and dedicated account managers for enterprise clients.",
  },
  {
    question: "Can Loop Axis handle bulk data processing?",
    answer: "Yes, Loop Axis is designed to process bulk data efficiently without performance drops.",
  },
  {
    question: "Is Loop Axis mobile-friendly?",
    answer: "Yes, you can access and manage workflows from any mobile device.",
  },
  {
    question: "Does Loop Axis replace employees?",
    answer: "No, Loop Axis enhances productivity by handling repetitive tasks, allowing employees to focus on strategy and growth.",
  },
  {
    question: "What pricing plans are available?",
    answer: "We offer Basic, Pro, and Enterprise plans tailored to different business needs.",
  },
  {
    question: "Can multiple team members collaborate on workflows?",
    answer: "Yes, Loop Axis allows real-time collaboration with role-based access control.",
  },
  {
    question: "Does Loop Axis support AI?",
    answer: "Yes, Loop Axis uses AI to optimize workflows and suggest automation improvements.",
  },
  {
    question: "Is training provided for new users?",
    answer: "Yes, we provide onboarding sessions, video tutorials, and documentation.",
  },
  {
    question: "Can Loop Axis scale as my business grows?",
    answer: "Absolutely. Loop Axis is built to scale with your needs, from startups to large enterprises.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach us via email at support@Loop Axis.com or through the Contact Us page.",
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
      {/* Hero (Framer Motion removed) */}
      <div
        className="text-center mb-12"
      >
        {/* H1 Theming */}
        <h1 className="text-4xl md:text-5xl font-extrabold 
          text-textLight dark:text-textDark transition-colors duration-500">
          Frequently Asked Questions
        </h1>
        {/* Paragraph Theming */}
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto
          text-textLight/80 dark:text-textDark/80 transition-colors duration-500">
          Find answers to common questions about Loop Axis. Use the search below to quickly find what you’re looking for.
        </p>
      </div>

      {/* Search Input (Theming) */}
      <div className="relative max-w-xl mx-auto mb-12">
        {/* Icon Theming */}
        <FiSearch className="absolute left-4 top-3.5 text-textLight/60 dark:text-textDark/60 text-xl" />
      <input
  type="text"
  value={query}
  onChange={e => setQuery(e.target.value)}
  placeholder="Search FAQs..."
  className="w-full pl-12 pr-4 py-3 rounded-full 
    border-2 focus:ring-2 focus:ring-primary focus:outline-none transition
    
    /* Light Mode Input */
    bg-lightBg/80 text-textLight border-textLight/20 placeholder-textLight/60
    
    /* Dark Mode Input: Full opacity text, softer placeholder */
    dark:bg-darkBg/80 dark:border-textDark/20 dark:placeholder-textDark/50"
/>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, i) => (
            // Framer Motion removed, standard div used with CSS hover effects
            <div
              key={i}
              className={`
                rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform 
                
                /* Glassmorphism Theming */
                bg-lightBg/60 backdrop-blur-md border border-textLight/10
                dark:bg-darkBg/60 dark:border-textDark/10
              `}
            >
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold focus:outline-none
                  text-textLight dark:text-textDark"
              >
               {i+1}. {" "} {faq.question}
                <FiChevronDown
                  className={`transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              
              {/* Answer Content (Using CSS max-height for accordion effect) */}
              <div
                className={`
                  px-6 pb-4 text-base leading-relaxed pl-12 pr-2 overflow-hidden transition-all duration-500 ease-in-out
                  ${openIndex === i ? 'max-h-96 opacity-100 pt-2' : 'max-h-0 opacity-0'}
                  /* Answer Text Theming */
                  text-textLight/80 dark:text-textDark/80
                `}
              >
                {faq.answer}
              </div>
            </div>
          ))
        ) : (
          // No Results Theming
          <p className="text-center text-textLight/70 dark:text-textDark/70">No results found for “{query}”</p>
        )}
      </div>
    </section>
  )
}