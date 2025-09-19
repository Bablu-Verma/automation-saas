"use client"

import { motion } from "framer-motion"
import { FiPlusCircle, FiList } from "react-icons/fi"
import Link from "next/link"

export default function adminservicepage() {
  const supportOptions = [
    {
      icon: <FiPlusCircle size={28} />, // Add icon for "Add"
      title: "Add",
      desc: "Add new Work Flow",
      href: "/admin/service/add",
    },
    {
      icon: <FiList size={28} />, // List icon for "List"
      title: "List",
      desc: "All Work flow",
      href: "/admin/service/list",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto pt-16  text-white">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12"
      >
        Service
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        {supportOptions.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-md hover:shadow-2xl border border-white/10  transition"
          >
            <Link href={item.href} className="flex flex-col gap-4 h-full">
              <div className="flex items-center gap-4">
                <span className="text-secondary">{item.icon}</span>
                <h3 className="text-2xl font-bold">{item.title}</h3>
              </div>
              <p className="text-gray-300">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
