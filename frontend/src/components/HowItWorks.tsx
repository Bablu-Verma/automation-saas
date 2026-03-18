"use client"

import Image from "next/image"
import { useSelector } from "react-redux"
import { RootState } from "@/redux-store/redux_store"
import { IUser } from "@/types"

export default function HowItWorks() {
  const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null

  const loggedIn = Boolean(user)

  const publicSteps = [
    {
      title: "Create Your Account",
      desc: "Create your account in less than 30 seconds and unlock your automation dashboard instantly.",
      image: "/how/login.png",
    },
    {
      title: "Select or Request Automation",
      desc: "Pick from ready-made workflows or request a fully tailored automation.",
      image: "/how/select-req.png",
    },
    {
      title: "Configure & Launch",
      desc: "Our AI configures and optimizes your workflows automatically.",
      image: "/how/co-launch.png",
    },
    {
      title: "Scale & Grow",
      desc: "Let automation handle routine work while you focus on growth.",
      image: "/how/sc-grow.png",
    },
  ]

  const loggedInSteps = [
    {
      title: "Access Your Dashboard",
      desc: "View workflows, analytics, and insights in one place.",
      image: "/how/dashboard.png",
    },
    {
      title: "Manage Workflows",
      desc: "Create or optimize automations easily with smart tools.",
      image: "/how/manage-w.png",
    },
    {
      title: "Run & Monitor",
      desc: "Track performance in real-time and improve efficiency.",
      image: "/how/select-req.png",
    },
    {
      title: "Achieve Growth",
      desc: "Free up time and let automations deliver results 24/7.",
      image: "/how/sc-grow.png",
    },
  ]

  const steps = loggedIn ? loggedInSteps : publicSteps

  return (
    <section className="relative pt-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {loggedIn
              ? "Your personalized automation journey."
              : "Get started in minutes with our simple automation process."}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className="
                group rounded-2xl overflow-hidden
                border bg-white shadow-sm
                dark:bg-neutral-900 dark:border-neutral-800
                transition-all duration-300
                hover:-translate-y-2 hover:shadow-xl
              "
            >
              {/* Image */}
              <div className="relative w-full h-40 overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-sm font-semibold text-primary mb-2">
                  Step {i + 1}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}