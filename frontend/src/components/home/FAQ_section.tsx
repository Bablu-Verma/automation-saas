"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  { icon: <FiZap size={28} />, question: "What is Loop Axis ?", answer: "Loop Axis is an automation platform that helps businesses streamline workflows and save time." },
  { icon: <FiShield size={28} />, question: "Is it secure?", answer: "Yes! Loop Axis uses enterprise-grade security to protect your data." },
  { icon: <FiUsers size={28} />, question: "Who can use Loop Axis ?", answer: "Small to large businesses and freelancers can automate their workflows easily." },
  { icon: <FiSettings size={28} />, question: "Does it require coding?", answer: "No coding required. Loop Axis is user-friendly and intuitive for all users." },
  { icon: <FiCloud size={28} />, question: "Which apps can I integrate?", answer: "Integrate with 100+ apps including CRMs, email, e-commerce, and project tools." },
  { icon: <FiBarChart2 size={28} />, question: "Can I track analytics?", answer: "Yes! Real-time dashboards help you monitor performance with ease." },
  { icon: <FiMail size={28} />, question: "Can I automate emails?", answer: "Yes! Automate marketing campaigns, reminders, and transactional messages." },
  { icon: <FiTrendingUp size={28} />, question: "Is it scalable?", answer: "Absolutely! Loop Axis grows with your business and workflow complexity." },
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold  text-white leading-tight">
            Frequently <br className="hidden sm:block" /> Asked Questions
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            Everything you need to know about <span className="text-primary font-semibold">Loop Axis</span>.  
            Learn how it helps automate workflows, integrate apps, and scale with your business. 
          </p>

          <div className="hidden md:block border-t border-white/10 pt-6">
            <p className="text-white/50 text-sm">
              Need more help? Contact our support team anytime. <Link className="text-red-400" href='/faq'>All FAQ</Link>
            </p>
          </div>
        </div>

        {/* ---------- Right Side (FAQ Accordion) ---------- */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-5 cursor-pointer hover:bg-white/15 transition"
              onClick={() => toggleFAQ(i)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="text-primary">{faq.icon}</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">{faq.question}</h3>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/70"
                >
                  <FiChevronDown size={22} />
                </motion.div>
              </div>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 text-white/70 text-base leading-relaxed pl-12 pr-2"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
