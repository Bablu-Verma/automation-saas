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

// 🔹 FeatureCard Component (Without motion)
export function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (

    <div
      className="
        rounded-2xl p-6 shadow-md group transition-all duration-300 transform 
        hover:-translate-y-1 hover:scale-[1.01] 
        
        bg-lightBg/50 border-textLight/10 
      
        dark:bg-darkBg/50 dark:border-textDark/10
        border backdrop-blur-md
      "
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white mb-4 group-hover:scale-110 transition">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-textLight dark:text-textDark">
        {title}
      </h3>
      
      <p className="text-textLight/70 dark:text-textDark/70">
        {desc}
      </p>
    </div>
  )
}

export default function Features() {
  const features: FeatureCardProps[] = [
    { icon: <FiZap size={26} />, title: "Lightning Fast", desc: "Automations built with blazing speed." },
    { icon: <FiCheckCircle size={26} />, title: "Always On", desc: "Reliable 24/7 cloud-powered workflows." },
    { icon: <FiTrendingUp size={26} />, title: "Future Proof", desc: "Scale as your business grows." },
    { icon: <FiSettings size={26} />, title: "Easy Setup", desc: "Get started quickly with no code." },
    { icon: <FiShield size={26} />, title: "Secure", desc: "Enterprise-grade security for your data." },
    { icon: <FiBarChart2 size={26} />, title: "Smart Analytics", desc: "Track performance with real-time insights." },
  ]

  return (
    <section className="pt-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Heading (Text color updated) */}
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-left 
          text-textLight dark:text-textDark"
      >
        Why Choose Loop Axis?
      </h2>

      <div
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, i) => (
          <div key={i}>
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </section>
  )
}