"use client"

import { FiMail, FiPhone, FiMessageSquare, FiHelpCircle } from "react-icons/fi"
import Link from "next/link"

export default function HelpSupport() {

  const supportOptions = [
    {
      icon: <FiMail size={20} />,
      title: "Email Us",
      desc: "support@taskzeno.com — We're always available.",
      href: "mailto:support@taskzeno.com",
    },
    {
      icon: <FiPhone size={20} />,
      title: "Call Us",
      desc: "+91 98765 43210 (Mon–Fri, 9 AM – 6 PM IST)",
      href: "tel:+919876543210",
    },
    {
      icon: <FiMessageSquare size={20} />,
      title: "Contact Form",
      desc: "Reach out directly using our contact form.",
      href: "/contact",
    },
    {
      icon: <FiHelpCircle size={20} />,
      title: "FAQs",
      desc: "Find answers to the most common questions.",
      href: "/faq",
    },
  ]

  const textPrimary = "text-textLight dark:text-textDark"
  const textSecondary = "text-textLight/70 dark:text-textDark/70"

  const cardClasses = `
    border border-black/5 dark:border-white/10
    rounded-lg
    p-6
    transition
    hover:bg-black/5 dark:hover:bg-white/5
  `

  return (
    <div className="max-w-5xl mx-auto pt-16 pb-20 px-6">

      {/* Heading */}
      <h1 className={`text-3xl md:text-4xl font-semibold text-center mb-12 ${textPrimary}`}>
        Help & Support
      </h1>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {supportOptions.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={cardClasses}
          >
            <div className="flex items-start gap-4">
              <span className="text-primary mt-1">
                {item.icon}
              </span>

              <div>
                <h3 className={`text-lg font-medium mb-1 ${textPrimary}`}>
                  {item.title}
                </h3>

                <p className={`text-sm ${textSecondary}`}>
                  {item.desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}