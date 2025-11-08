"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FiArrowRight, FiMessageSquare } from "react-icons/fi"

export default function CustomAutomationCTA() {
  return (
    <section className="pt-20">
      <motion.div
        // Yahaan glassmorphism style ka istemaal kiya hai
        className=" bg-white/10 backdrop-blur-lg py-8 md:py-20 px-4  text-center overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary text-white shadow-lg">
            <FiMessageSquare size={30} />
          </div>
        </div>

        {/* Headline (Jo aapne poocha tha) */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Need a Custom Automation?
        </h2>

        {/* Description */}
        <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
          Can t find the exact workflow you re looking for? Our team can build a
          bespoke automation tailored specifically to your business needs.
        </p>

        {/* Button (Jo contact page par le jaayega) */}
        <Link href="/contact" passHref>
          <motion.a
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full shadow-md text-lg"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Request a Custom Build
            <FiArrowRight className="ml-2" />
          </motion.a>
        </Link>
      </motion.div>
    </section>
  )
}