"use client"

import { motion } from "framer-motion"
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

// 🔹 Named export
export function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl group"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white mb-4 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{desc}</p>
    </motion.div>
  )
}

// 🔹 Default export
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
    <section className="pt-28 px-6 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-left bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent"
      >
        Why Choose AutoFlow?
      </motion.h2>

      <motion.div
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
