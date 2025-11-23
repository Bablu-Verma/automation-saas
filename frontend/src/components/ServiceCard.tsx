"use client"

import { Workflow__ } from "@/app/admin/service/list/page"
import Image from "next/image"
import Link from "next/link"

export type ServiceCardProps = {
  workflows: Workflow__
}

export function ServiceCard({ workflows }: ServiceCardProps) {
  return (
    // Framer Motion (motion.div) removed. Using standard div.
    <div
      // ✨ सुधार: थीम-अवेयर बैकग्राउंड, बॉर्डर, शैडो, और ट्रांज़िशन
      className="
        rounded-2xl overflow-hidden flex flex-col group 
        transition-all duration-300 transform 
        shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01] 
        
        /* Light Mode */
        bg-lightBg border-textLight/10 border
        
        /* Dark Mode */
        dark:bg-darkBg dark:border-textDark/10
      "
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
        {/* Title (Text color updated) */}
        <h3 className="text-xl capitalize font-bold mb-3 
          text-textLight dark:text-textDark"
        >
          {workflows.name}
        </h3>
        
        {/* Pricing Info (Text color updated) */}
        <p className="flex-1 text-textLight/80 dark:text-textDark/80">
          <span className="text-lg font-semibold text-primary">₹{workflows.pricePerMonth}</span>/Months |  Trial: {workflows.trialDays} days 
        </p>

        {/* CTA */}
        <Link
          href={`/services/view?id=${workflows.slug}`}
          className="mt-6 inline-block w-fit px-5 py-2 rounded-full text-sm font-semibold 
            bg-gradient-to-r from-primary to-secondary text-white 
            shadow hover:shadow-lg transition transform hover:scale-[1.03]"
        >
          Learn More 
        </Link>
      </div>
    </div>
  )
}