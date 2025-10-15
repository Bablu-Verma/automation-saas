"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import {
  FiZap,
  FiCpu,
  FiTrendingUp,
  FiCloudLightning,
} from "react-icons/fi"
import "swiper/css"
import Image from "next/image"

export default function HomeHero() {
  const slides = [
    { icon: <FiZap size={28} />, text: "Save 20+ hours every week with automation." },
    { icon: <FiCpu size={28} />, text: "Integrate with 100+ tools effortlessly." },
    { icon: <FiTrendingUp size={28} />, text: "Scale workflows without extra hires." },
    { icon: <FiCloudLightning size={28} />, text: "Your business, on autopilot ⚡" },
  ]

  const clients = [
    "/company-logo-4.svg",
    "/company-logo-3.svg",
    "/company-logo-2.svg",
    "/company-logo-1.svg",
  ]

  return (
    <section className="relative min-h-[100vh] w-full flex flex-col justify-center items-center py-28 text-white overflow-hidden">
       <div className="absolute top-20  w-96 h-64 bg-gradient-to-tr from-primary/40 to-secondary/30 rounded-full blur-3xl -z-10"></div>

      {/* Hero Content */}
      <div className="text-center max-w-3xl pb-10 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight relative z-10"
        >
          Automate. Scale. Grow.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-lg md:text-xl text-white/80"
        >
          Supercharge your workflows with automation.  
          Spend less time on manual tasks and more time growing your business.
        </motion.p>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2500 }}
          loop
          slidesPerView={1}
          className="max-w-xl mx-auto mt-12 relative z-10"
        >
          {slides.map((item, i) => (
            <SwiperSlide key={i} className="px-5">
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center  gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/20 hover:scale-101 transition-transform"
              >
                <span className="text-secondary">{item.icon}</span>
                <p className="text-lg md:text-xl text-white/90">{item.text}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 flex justify-center gap-6 relative z-10"
        >
          <Link
            href="/services"
            className="bg-gradient-to-r from-primary to-secondary px-10 py-3 rounded-full font-semibold shadow-lg  hover:from-secondary hover:to-primary hover:bg-white transition duration-300"
          >
           Get Started
          </Link>
          <Link
  href="/about"
  className="px-10 py-3 rounded-full font-semibold border-2 border-white/30 text-white hover:text-primary bg-transparent shadow  transition duration-300"
>
  Learn More
</Link>
        </motion.div>
      </div>

      {/* Trusted Clients */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 w-full px-8 "
      >
        <p className="text-center text-white/70 text-sm mb-4">Trusted by leading companies</p>
        <div className="flex items-center justify-center gap-8 flex-wrap opacity-80">
          {clients.map((logo, i) => (
            <Image
              key={i}
              width={120}
              height={70}
              src={logo}
              alt="Client Logo"
              className=" object-contain grayscale hover:grayscale-0 transition"
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
