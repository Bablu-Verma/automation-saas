"use client"

import Link from "next/link"
import { ServiceCard } from "./ServiceCard"
import { useHomeServices } from "@/hooks/useHomeServices"

export default function Services() {
  const { services, loading } = useHomeServices()

  if (loading) return null

  return (
    <section className="relative pt-28 px-4 sm:px-6">

      {/* Subtle Background Accent */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent dark:via-primary/10" />

      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary">
            Services
          </p>

          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Automation Solutions Built for Growth
          </h2>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            End-to-end automation workflows designed to eliminate manual tasks,
            reduce operational friction, and help your business scale faster.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, i) => (
            <div
              key={i}
              className="transition-transform duration-300 hover:-translate-y-1"
            >
              <ServiceCard workflows={service} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/services"
            className="
              inline-flex items-center gap-2
              px-10 py-4 rounded-full
              font-semibold text-sm tracking-wide
              transition-all duration-300

              /* Light */
              bg-primary text-white shadow-md hover:shadow-xl hover:scale-105

              /* Dark */
              dark:bg-primary dark:text-white
            "
          >
            Explore All Services
          </Link>
        </div>

      </div>
    </section>
  )
}