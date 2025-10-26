"use client"

import { motion } from "framer-motion"
import { FiMail, FiPhone, FiMessageSquare, FiHelpCircle } from "react-icons/fi"
import Link from "next/link"

export default function HelpSupport() {
  const supportOptions = [
    {
      icon: <FiMail size={28} />,
      title: "Email Us",
      desc: '"support@Loop Axis .com" par hamesha available.',
      href: "mailto:support@Loop Axis .com",
    },
    {
      icon: <FiPhone size={28} />,
      title: "Call Us",
      desc: "+91 98765 43210 (Mon–Fri, 9 AM – 6 PM IST)",
      href: "tel:+919876543210",
    },
    {
      icon: <FiMessageSquare size={28} />,
      title: "Contact Form",
      desc: "Directly reach out through our contact form.",
      href: "/contact",
    },
    {
      icon: <FiHelpCircle size={28} />,
      title: "FAQs",
      desc: "Most asked questions ka detailed jawab.",
      href: "/faq",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto pt-16  text-white">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12"
      >
        Help & Support
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        {supportOptions.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-md hover:shadow-2xl border border-white/10  transition"
          >
            <Link href={item.href} className="flex flex-col gap-4 h-full">
              <div className="flex items-center gap-4">
                <span className="text-secondary">{item.icon}</span>
                <h3 className="text-2xl font-bold">{item.title}</h3>
              </div>
              <p className="text-gray-300">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
