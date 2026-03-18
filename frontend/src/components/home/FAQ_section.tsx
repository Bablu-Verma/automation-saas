"use client"

import { useState } from "react"
import {
  FiChevronDown
} from "react-icons/fi"
import Link from "next/link"
import Image from "next/image"

const faqs = [
  {
    question: "What is taskzeno?",
    answer:
      "taskzeno is an automation platform that helps businesses streamline workflows and save time.",
  },
  {
    question: "Is it secure?",
    answer:
      "Yes! taskzeno uses enterprise-grade security to protect your data.",
  },
  {
    question: "Does it require coding?",
    answer:
      "No coding required. taskzeno is user-friendly and intuitive for all users.",
  },
  {
    question: "Which apps can I integrate?",
    answer:
      "Integrate with 100+ apps including CRMs, email, e-commerce, and project tools.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="pt-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 ">

         {/* -------- RIGHT SIDE (IMAGE) -------- */}
        <div className="relative ">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-textLight dark:text-textDark">
            Frequently Asked Questions
          </h2>

          <p className="text-textLight/70 dark:text-textDark/70 mb-8">
            Everything you need to know about taskzeno and how it helps automate
            your business workflows efficiently.
          </p>

          <Image
            src="/faq.webp"
            alt="FAQ Illustration"
            width={500}
            height={500}
            className="relative w-full h-auto max-w-[450px] "
          />
          
        </div>


        {/* -------- LEFT SIDE -------- */}
        <div>
         
          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i
              return (
                <div
                  key={i}
                  onClick={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                  className={`
                    rounded-xl border p-5 cursor-pointer
                    transition-all duration-300
                    bg-white dark:bg-neutral-900
                    border-gray-200 dark:border-neutral-800
                    ${isOpen ? "border-primary shadow-lg" : ""}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">
                      {faq.question}
                    </h3>
                    <FiChevronDown
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      size={20}
                    />
                  </div>

                  <div
                    className={`
                      overflow-hidden transition-all duration-500
                      ${
                        isOpen
                          ? "max-h-40 opacity-100 mt-3"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ✨ Better Designed CTA */}
          <div className="mt-8">
            <Link
              href="/faq"
              className="
                inline-flex items-center justify-center
                px-6 py-3 rounded-full
                text-sm font-semibold text-white
                bg-gradient-to-r from-primary to-secondary
                shadow-md transition-all duration-300
                hover:shadow-xl hover:scale-105
              "
            >
              View All FAQs →
            </Link>
          </div>
        </div>

       
      </div>
    </section>
  )
}