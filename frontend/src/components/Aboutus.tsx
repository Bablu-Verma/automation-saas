"use client"

import { motion } from "framer-motion"
import Image from "next/image"


export default function AboutUs() {


  return (
    <section className="relative pt-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Background Gradient Shapes */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-gradient-to-tr from-primary/40 to-secondary/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gradient-to-tr from-secondary/40 to-primary/30 rounded-full blur-3xl -z-10"></div>

      <div className="flex flex-col lg:flex-row items-start gap-12">
        
         <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full lg:w-1/2 h-96 rounded-xl overflow-hidden "
        >
          <Image
            src="/about.png"
            alt="About Us"
            fill
            className="object-cover object-center"
          />
        </motion.div>


        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              About Go Automat Work 
            </h2>

            <p className="mt-6 text-white/80 text-lg md:text-xl leading-relaxed max-w-xl">
              Go Automat Work  empowers businesses to automate repetitive workflows, integrate seamlessly with hundreds of tools, and scale operations without extra hires.
            </p>

            <p className="mt-4 text-white/80 text-lg md:text-xl leading-relaxed max-w-xl">
              Our solutions save time, reduce errors, and boost productivity — giving teams the freedom to focus on growth and innovation.
            </p>
          </div>

          

          {/* CTA Button Right-aligned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 flex justify-start"
          >
            <a
              href="/about"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition duration-300"
            >
              Learn More →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
