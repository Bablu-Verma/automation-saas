"use client"

// Removed: import { motion } from "framer-motion"
import { FiMail, FiPhone, FiMessageSquare, FiHelpCircle } from "react-icons/fi"
import Link from "next/link"

export default function HelpSupport() {
  const supportOptions = [
    {
      icon: <FiMail size={28} />,
      title: "Email Us",
      desc: '"support@taskzeno .com" par hamesha available.',
      href: "mailto:support@taskzeno .com",
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

  // --- Theme Variables ---
  const textPrimary = `text-textLight dark:text-textDark`;
  const textSecondary = `text-textLight/70 dark:text-textDark/70`

  const cardClasses = `
    bg-lightBg/80 backdrop-blur-md border border-textLight/10
    dark:bg-darkBg/80 dark:border-textDark/10
    shadow-md transition-all duration-300
    hover:shadow-xl hover:scale-[1.01]
  `;


  return (
    <div className={`max-w-6xl mx-auto pt-16 ${textPrimary}`}>
      <h1
        // Removed motion.h1
        className={`text-4xl md:text-5xl font-extrabold text-center mb-12 ${textPrimary}`}
      >
        Help & Support
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {supportOptions.map((item, i) => (
          <div
            key={i}
            // Applied Themed Card Class (retaining border, shadow, hover effects)
            className={`${cardClasses} p-8 rounded-2xl`}
          >
            <Link href={item.href} className="flex flex-col gap-4 h-full">
              <div className="flex items-center gap-4">
                {/* Icon Color */}
                <span className="text-secondary">{item.icon}</span>
                {/* Title Theming */}
                <h3 className={`text-2xl font-bold ${textPrimary}`}>{item.title}</h3>
              </div>
              {/* Description Theming */}
              <p className={textSecondary}>{item.desc}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}