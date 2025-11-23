"use client"

import { useState } from "react"
// Framer Motion removed from imports
import {
  FiZap,
  FiShield,
  FiUsers,
  FiSettings,
  FiCloud,
  FiBarChart2,
  FiMail,
  FiTrendingUp,
  FiChevronDown
} from "react-icons/fi"
import Link from "next/link"

const faqs = [
  { icon: <FiZap size={28} />, question: "What is Go Automat Work?", answer: "Go Automat Work is an automation platform that helps businesses streamline workflows and save time." },
  { icon: <FiShield size={28} />, question: "Is it secure?", answer: "Yes! Go Automat Work uses enterprise-grade security to protect your data." },
  { icon: <FiUsers size={28} />, question: "Who can use Go Automat Work?", answer: "Small to large businesses and freelancers can automate their workflows easily." },
  { icon: <FiSettings size={28} />, question: "Does it require coding?", answer: "No coding required. Go Automat Work is user-friendly and intuitive for all users." },
  { icon: <FiCloud size={28} />, question: "Which apps can I integrate?", answer: "Integrate with 100+ apps including CRMs, email, e-commerce, and project tools." },
  { icon: <FiBarChart2 size={28} />, question: "Can I track analytics?", answer: "Yes! Real-time dashboards help you monitor performance with ease." },
  { icon: <FiMail size={28} />, question: "Can I automate emails?", answer: "Yes! Automate marketing campaigns, reminders, and transactional messages." },
  { icon: <FiTrendingUp size={28} />, question: "Is it scalable?", answer: "Absolutely! Go Automat Work grows with your business and workflow complexity." },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section className="pt-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* ---------- Left Side (Title + Subtitle) ---------- */}
        <div className="space-y-6">
          {/* H2 Theming */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight
            text-textLight dark:text-textDark transition-colors duration-500">
            Frequently <br className="hidden sm:block" /> Asked Questions
          </h2>
          {/* Paragraph Theming */}
          <p className="text-lg leading-relaxed max-w-md
            text-textLight/70 dark:text-textDark/70 transition-colors duration-500">
            Everything you need to know about <span className="text-primary font-semibold">Go Automat Work</span>.  
            Learn how it helps automate workflows, integrate apps, and scale with your business. 
          </p>

          <div className="hidden md:block border-t border-textLight/10 dark:border-textDark/10 pt-6">
            {/* Footer Text Theming */}
            <p className="text-textLight/50 dark:text-textDark/50 text-sm transition-colors duration-500">
              Need more help? Contact our support team anytime. 
              <Link className="text-primary hover:text-secondary ml-1" href='/faq'>
                All FAQ
              </Link>
            </p>
          </div>
        </div>

        {/* ---------- Right Side (FAQ Accordion) ---------- */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              // Framer Motion removed, standard div used
              <div
                key={i}
                className={`
                  rounded-2xl p-5 cursor-pointer transition-all duration-300 transform 
                  
                  /* Glassmorphism Theming */
                  bg-lightBg/60 border border-textLight/10 dark:bg-darkBg/60 dark:border-textDark/10 
                  hover:shadow-lg
                  ${isOpen ? 'shadow-xl' : ''}
                `}
                onClick={() => toggleFAQ(i)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-primary">{faq.icon}</div>
                    {/* Question Theming */}
                    <h3 className="text-lg sm:text-xl font-semibold text-textLight dark:text-textDark">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`text-textLight/70 dark:text-textDark/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                  >
                    <FiChevronDown size={22} />
                  </div>
                </div>

                {/* Answer Content (Using CSS max-height for accordion effect) */}
                <div
                  className={`
                    mt-3 text-base leading-relaxed pl-12 pr-2 overflow-hidden transition-all duration-500 ease-in-out
                    ${isOpen ? 'max-h-96 opacity-100 pt-2' : 'max-h-0 opacity-0'}
                    /* Answer Text Theming */
                    text-textLight/80 dark:text-textDark/80
                  `}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}