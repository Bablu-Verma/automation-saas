"use client"

import Link from "next/link"
import Image from "next/image"
import { FiArrowRight, FiMessageSquare } from "react-icons/fi"

export default function CustomAutomationCTA() {
  return (
    <section className="relative py-24 px-4">

      {/* Soft Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-3xl opacity-40" />

      <div
        className="
          relative max-w-7xl mx-auto
          px-6 md:px-12 py-16 rounded-3xl
          border transition-all duration-500
          "
      >

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div>

            {/* Icon */}
            <div className="flex mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl 
                bg-gradient-to-tr from-primary to-secondary 
                text-white shadow-lg">
                <FiMessageSquare size={26} />
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Need a Custom Automation?
            </h2>

            {/* Description */}
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              Can’t find the exact workflow you’re looking for?
              Our team can build a bespoke automation tailored specifically
              to your business needs.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">

              <Link
                href="/contact"
                className="
                  inline-flex items-center gap-2
                  px-8 py-3 rounded-full
                  text-white font-semibold
                  bg-gradient-to-r from-primary to-secondary
                  shadow-lg transition-all duration-300
                  hover:scale-[1.05] hover:shadow-2xl
                  active:scale-[0.98]
                "
              >
                Request a Custom Build
                <FiArrowRight />
              </Link>

              <Link
                href="/services"
                className="
                  inline-flex items-center gap-2
                  px-8 py-3 rounded-full
                  text-primary font-semibold
                  border border-primary
                  hover:bg-primary/10
                  transition-all duration-300
                "
              >
                Explore Services
              </Link>

            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="relative w-full h-[300px] md:h-[380px] rounded-2xl overflow-hidden">
              <Image
                src="/custom-automation.webp"
                alt="Custom Automation"
                fill
                className="object-cover"
              />
            </div>

            {/* Subtle Floating Glow */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-40" />
          </div>

        </div>
      </div>
    </section>
  )
}