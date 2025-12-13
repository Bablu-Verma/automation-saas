"use client"

import { Workflow__ } from "@/app/admin/service/list/page"
import Image from "next/image"
import Link from "next/link"

export type ServiceCardProps = {
  workflows: Workflow__
}

export function ServiceCard({ workflows }: ServiceCardProps) {

  const basePlan = workflows.pricingPlans.find(p => p.planName === "BASE");
  const trialPlan = workflows.pricingPlans.find(p => p.planName === "TRIAL");

  const price = basePlan?.monthlyPrice || 0;
  const discount = basePlan?.discountPercent || 0;

  const finalPrice = discount > 0 
    ? Math.round(price - (price * discount) / 100)
    : price;

  return (

    <div
      className="
        rounded-2xl overflow-hidden relative flex flex-col group 
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
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl text-left capitalize font-semibold mb-3 
          text-textLight dark:text-textDark"
        >
          {workflows.name}
        </h3>
        <div className="flex justify-between items-center pb-6">
          <div>
            {discount > 0 ? (
              <>
               <div className="flex justify-start items-center gap-2">
               
                <p className="text-xl md:text-2xl line-through text-gray-500">
                  ₹{price}
                </p>
                 <p className="text-xl md:text-2xl font-bold text-primary">
                  ₹{finalPrice}
                  <span className="text-base font-medium text-textLight/70 dark:text-textDark/70"> /Month</span>
                </p>
               </div>
                <span className="text-xs absolute top-2 left-2 font-semibold bg-green-500 text-white px-2 py-1 rounded-full">
                  {discount}% OFF
                </span>
              </>
            ) : (
              <p className="text-xl md:text-2xl text-primary">
                ₹{price}
                <span className="text-base font-medium text-textLight/70 dark:text-textDark/70"> /Month</span>
              </p>
            )}
          </div>
          <p className="text-base text-gray-500">
            <span className="font-semibold">
              {trialPlan?.validityDays || 7} days free trial
            </span>
          </p>
        </div>
        <Link
          href={`/services/view?id=${workflows.slug}`}
          className="inline-block w-fit px-5 py-2 rounded-full text-sm font-semibold 
            bg-gradient-to-r from-primary to-secondary text-white 
            shadow hover:shadow-lg transition transform hover:scale-[1.03]">
          Learn More
        </Link>

      </div>
    </div>
  )
}
