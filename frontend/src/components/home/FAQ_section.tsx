"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiZap, FiShield, FiUsers, FiSettings, FiCloud, FiBarChart2, FiMail, FiTrendingUp } from "react-icons/fi"
import Link from "next/link"

const faqs = [
  { icon: <FiZap size={36} />, question: "What is Loop Axis ?", answer: "Loop Axis  is an automation platform that helps businesses streamline workflows and save time." },
  { icon: <FiShield size={36} />, question: "Is it secure?", answer: "Yes! Loop Axis  uses enterprise-grade security to protect your data." },
  { icon: <FiUsers size={36} />, question: "Who can use Loop Axis ?", answer: "Small to large businesses and freelancers can automate their workflows." },
  { icon: <FiSettings size={36} />, question: "Does it require coding?", answer: "No coding required. Loop Axis  is user-friendly and intuitive." },
  { icon: <FiCloud size={36} />, question: "Which apps can I integrate?", answer: "Integrate with 100+ apps including CRM, email, e-commerce, and project management tools." },
  { icon: <FiBarChart2 size={36} />, question: "Can I track analytics?", answer: "Yes! Real-time dashboards help you monitor performance easily." },
  { icon: <FiMail size={36} />, question: "Can I automate emails?", answer: "Yes! Automate marketing campaigns, reminders, and notifications." },
  { icon: <FiTrendingUp size={36} />, question: "Is it scalable?", answer: "Absolutely! Loop Axis  grows with your business and workflow complexity." },
]

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="pt-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white">
        Frequently Asked Questions
      </h2>
      <p className="mt-4 text-center text-white/70 max-w-2xl mx-auto text-lg">
        Everything you need to know about Loop Axis  in one place.
      </p>

      <div className="mt-16 flex flex-col md:flex-row gap-10">
        {/* Left Side: FAQ List */}
        <div className="md:w-1/2 space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              onClick={() => setActiveIndex(i)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border ${activeIndex === i ? "border-white/40 bg-white/10" : "border-white/10"} hover:bg-white/10`}
            >
              <div className="text-primary">{faq.icon}</div>
              <h3 className={`text-white font-semibold text-lg ${activeIndex === i ? "text-white" : "text-white/80"}`}>
                {faq.question}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Right Side: FAQ Detail */}
        <div className="md:w-1/2 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-lg flex flex-col justify-between">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="text-primary">{faqs[activeIndex].icon}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">{faqs[activeIndex].question}</h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">{faqs[activeIndex].answer}</p>
          </motion.div>

          <div className="mt-8 text-right">
            <Link
              href="/faq"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition duration-300"
            >
              View All FAQs
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
