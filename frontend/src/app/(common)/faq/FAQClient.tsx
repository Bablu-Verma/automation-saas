"use client"

import SubHero from "@/components/SubHero"
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
    question: "What is taskzeno ?",
    answer: "taskzeno is an automation platform that helps businesses streamline workflows, integrate tools, and save time.",
  },
  {
    question: "How does taskzeno save time?",
    answer: "It automates repetitive tasks such as data entry, reporting, and notifications so teams can focus on strategic work.",
  },
  {
    question: "Can taskzeno integrate with my CRM?",
    answer: "Yes,taskzeno integrates with popular CRMs like HubSpot, Salesforce, and Zoho.",
  },
  {
    question: "Do I need coding knowledge to use taskzeno ?",
    answer: "No,taskzeno is designed for non-technical users with an easy drag-and-drop interface.",
  },
  {
    question: "Is taskzeno secure?",
    answer: "Yes,taskzeno uses enterprise-grade encryption and complies with GDPR standards to keep your data safe.",
  },
  {
    question: "Can I try taskzeno for free?",
    answer: "Yes, we offer a free trial with limited features so you can test the platform before subscribing.",
  },
  {
    question: "What industries use taskzeno ?",
    answer: "Our clients include e-commerce, finance, healthcare, IT, real estate, and more.",
  },
  {
    question: "How many integrations does taskzeno support?",
    answer: "taskzeno integrates with over 200+ apps, including Google Workspace, Slack, and Shopify.",
  },
  {
    question: "Can taskzeno automate email campaigns?",
    answer: "Yes, taskzeno can automate email campaigns, drip sequences, and personalized communications.",
  },
  {
    question: "Does taskzeno provide analytics?",
    answer: "Yes, taskzeno includes detailed analytics dashboards to monitor performance and ROI.",
  },
  {
    question: "What support options are available?",
    answer: "We provide 24/7 email support, live chat, and dedicated account managers for enterprise clients.",
  },
  {
    question: "Can taskzeno handle bulk data processing?",
    answer: "Yes, taskzeno is designed to process bulk data efficiently without performance drops.",
  },
  {
    question: "Is taskzeno mobile-friendly?",
    answer: "Yes, you can access and manage workflows from any mobile device.",
  },
  {
    question: "Does taskzeno replace employees?",
    answer: "No,taskzeno enhances productivity by handling repetitive tasks, allowing employees to focus on strategy and growth.",
  },
  {
    question: "What pricing plans are available?",
    answer: "We offer Basic, Pro, and Enterprise plans tailored to different business needs.",
  },
  {
    question: "Can multiple team members collaborate on workflows?",
    answer: "Yes, taskzeno allows real-time collaboration with role-based access control.",
  },
  {
    question: "Does taskzeno support AI?",
    answer: "Yes, taskzeno uses AI to optimize workflows and suggest automation improvements.",
  },
  {
    question: "Is training provided for new users?",
    answer: "Yes, we provide onboarding sessions, video tutorials, and documentation.",
  },
  {
    question: "Can taskzeno scale as my business grows?",
    answer: "Absolutely. taskzeno is built to scale with your needs, from startups to large enterprises.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach us via email at taskzenoautomat@gmail.com or through the Contact Us page.",
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
   <section className="py-28 px-6 max-w-6xl mx-auto">

  <SubHero 
    title="Frequently Asked Questions" 
    description="Find answers to common questions about taskzeno. Use the search below to quickly find what you’re looking for." 
  />

  {/* Search Bar */}
  <div className="relative max-w-2xl mx-auto mt-12 mb-16">
    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

    <input
      type="text"
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search your question..."
      className="w-full pl-12 pr-6 py-4 rounded-full 
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        shadow-sm
        focus:ring-2 focus:ring-primary focus:border-primary
        outline-none transition-all duration-300"
    />
  </div>

  {/* FAQ List */}
  <div className="space-y-6">
    {filteredFaqs.length > 0 ? (
      filteredFaqs.map((faq, i) => (
        <div
          key={i}
          className="group rounded-2xl border border-gray-200 dark:border-gray-700 
          bg-white dark:bg-gray-900
          shadow-sm hover:shadow-xl transition-all duration-300"
        >

          {/* Question */}
          <button
            onClick={() => toggleFAQ(i)}
            className="w-full flex justify-between items-center px-6 py-5 text-left"
          >
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary transition">
              {i + 1}. {faq.question}
            </span>

            <FiChevronDown
              className={`text-xl text-gray-500 transition-transform duration-300 ${
                openIndex === i ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          {/* Answer */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              openIndex === i
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>

        </div>
      ))
    ) : (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No results found for “{query}”
      </p>
    )}
  </div>

</section>
  )
}