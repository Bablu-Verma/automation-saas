"use client"

import { Workflow__ } from "@/app/admin/service/list/page"
import Image from "next/image"
import Link from "next/link"

export type ServiceCardProps = {
  workflows: Workflow__
}

export function ServiceCard({ workflows }: ServiceCardProps) {
  const basePlan = workflows.pricingPlans.find(p => p.planName === "BASE")
  const trialPlan = workflows.pricingPlans.find(p => p.planName === "TRIAL")

  const price = basePlan?.monthlyPrice || 0
  const discount = basePlan?.discountPercent || 0

  const finalPrice =
    discount > 0
      ? Math.round(price - (price * discount) / 100)
      : price

  return (
    <div
      className="
        group rounded-2xl overflow-hidden border transition-all duration-300
        bg-white border-gray-200 shadow-sm
        dark:bg-neutral-900 dark:border-neutral-800
        hover:shadow-lg hover:-translate-y-1
      "
    >
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={workflows.serviceImage || "/placeholder.png"}
          alt={workflows.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70" />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-4 left-4 text-xs font-semibold bg-white text-primary px-3 py-1 rounded-full shadow">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {workflows.name}
        </h3>

        {/* Pricing */}
        <div className="mt-4  flex items-end justify-between">

          <div>
            {discount > 0 && (
              <p className="text-base line-through text-gray-400">
                ₹{price}
              </p>
            )}

            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{finalPrice}
              <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                {" "} /month
              </span>
            </p>
          </div>

          <p className="text-base text-gray-500 dark:text-gray-400">
            {trialPlan?.validityDays || 7} days trial
          </p>
        </div>

       <div className="mt-6 flex items-center gap-3">

  {/* Primary Button */}
  <Link
    href={`/services/view?id=${workflows.slug}`}
    className="
      inline-flex items-center justify-center
      px-7 py-2.5 rounded-full
      text-sm font-semibold text-white
      bg-gradient-to-r from-primary to-secondary
      shadow-md transition-all duration-300
      hover:shadow-lg hover:scale-[1.03]
      active:scale-[0.98]
    "
  >
    Learn More
  </Link>

  {/* Secondary Button */}
  <a
   target="_blank"
    href={`/services/docs?id=${workflows._id}`}
    className="
      inline-flex items-center justify-center
      px-7 py-2.5 rounded-full
      text-sm font-semibold
      border border-primary text-primary
      transition-all duration-300
      hover:bg-primary/10
      dark:hover:bg-primary/20
    "
  >
    View Docs
  </a>

</div>
      </div>
    </div>
  )
}
