"use client"

import { Workflow__ } from "@/app/admin/service/list/page"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export type ServiceCardProps = {
  workflows: Workflow__
}

export function ServiceCard({ workflows }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl flex flex-col group"
    >
      {/* Service Image */}
      <div className="relative w-full h-48">
        <Image
          src={workflows.serviceImage || "/placeholder.png"}
          alt={workflows.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl capitalize font-bold text-gray-900 mb-3">
          {workflows.name}
        </h3>
        <p className="text-gray-600 flex-1">
        <span className="text-lg font-semibold">₹{workflows.pricePerMonth}</span>/Months |  Trial: {workflows.trialDays} days 
        </p>

        {/* CTA */}
        <Link
          href={`/services/view?id=${workflows.slug}`}
          className="mt-6 inline-block w-fit px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-white shadow hover:shadow-lg transition"
        >
          Learn More →
        </Link>
      </div>
    </motion.div>
  )
}
