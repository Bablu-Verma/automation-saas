"use client"

import { ReactNode } from "react"
import {
  FiZap,
  FiCheckCircle,
  FiTrendingUp,
  FiSettings,
  FiShield,
  FiBarChart2,
} from "react-icons/fi"

type FeatureCardProps = {
  icon: ReactNode
  title: string
  desc: string
}

// 🔹 Advanced Feature Card
export function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div
      className="
        relative group rounded-2xl p-8 transition-all duration-300
        border overflow-hidden
        
        /* Light */
        bg-white border-gray-200 shadow-sm
        
        /* Dark */
        dark:bg-neutral-900 dark:border-neutral-800
        hover:shadow-xl hover:-translate-y-1
      "
    >
      {/* Subtle Hover Gradient Layer */}
      <div className="
        absolute inset-0 opacity-0 group-hover:opacity-100 
        bg-gradient-to-br from-primary/5 to-secondary/5
        transition duration-500
      " />

      {/* Icon */}
      <div className="
        relative z-10 w-14 h-14 flex items-center justify-center
        rounded-xl bg-gradient-to-br from-primary to-secondary
        text-white shadow-md
      ">
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {desc}
        </p>
      </div>
    </div>
  )
}

export default function Features() {
const features: FeatureCardProps[] = [
  {
    icon: <FiZap size={24} />,
    title: "Instant Workflow Execution",
    desc: "Trigger complex multi-step automations in milliseconds without delays or queue bottlenecks."
  },
  {
    icon: <FiSettings size={24} />,
    title: "Visual Workflow Builder",
    desc: "Design automation logic using a drag-and-drop interface with zero coding required."
  },
  {
    icon: <FiCheckCircle size={24} />,
    title: "Pre-Built Automation Templates",
    desc: "Launch proven workflows instantly with ready-to-use templates tailored for your industry."
  },
  {
    icon: <FiTrendingUp size={24} />,
    title: "Scalable Infrastructure",
    desc: "Handle thousands of triggers and actions daily without performance drops."
  },
  {
    icon: <FiShield size={24} />,
    title: "Secure API Integrations",
    desc: "Safely connect your tools with encrypted data transmission and strict access controls."
  },
  {
    icon: <FiBarChart2 size={24} />,
    title: "Real-Time Workflow Insights",
    desc: "Track automation performance, detect bottlenecks, and optimize processes instantly."
  }
]

  return (
    <section className="pt-28 px-4 sm:px-6 max-w-7xl mx-auto">

      {/* Section Header */}
      <div className="max-w-3xl">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          Features
        </p>

        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
          Why Teams Choose Taskzeno
        </h2>

        <p className="mt-4 text-gray-600 dark:text-gray-400 text-base">
          Built for modern businesses that want automation, speed, and scalability —
          without complexity.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </div>
    </section>
  )
}