"use client"

import { motion } from "framer-motion"

export default function NewsletterSection() {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto text-white rounded-3xl relative  ">
      
      {/* Background shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl -z-10"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        
        {/* Text */}
        <div className="text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold"
          >
            Stay Updated
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-lg text-white/90 max-w-lg"
          >
            Subscribe to our newsletter to get the latest updates on AutoFlow features, tips, and exclusive offers.
          </motion.p>
        </div>

        {/* Input & Button */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-6 py-3 rounded-full text-white placeholder-white/70 bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <button
            className="px-8 py-3 rounded-full bg-white text-primary font-semibold shadow-lg hover:shadow-2xl transition"
          >
            Subscribe
          </button>
        </motion.div>

      </div>
    </section>
  )
}
