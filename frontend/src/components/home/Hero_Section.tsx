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
  FiPlay,
  FiArrowRight
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
    <section className="relative min-h-[100vh] w-full flex flex-col justify-center items-center pt-28 text-white overflow-hidden">
      
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-64 bg-gradient-to-tr from-primary/40 to-secondary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-bl from-secondary/20 to-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-background/50 to-background"></div>
      </div>

      {/* Hero Content */}
      <div className="text-center w-full max-w-4xl pb-10 px-4 sm:px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
        >
          <FiZap className="text-primary" size={16} />
          <span className="text-sm font-medium">No-code Automation Platform</span>
        </motion.div>

        {/* Main Heading with Gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight relative z-10"
        >
            Automate.  Scale.  Grow.
         
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
        >
          Supercharge your workflows with <span className="text-primary font-semibold">AI-powered automation</span>.  
          Spend less time on manual tasks and more time growing your business.
        </motion.p>

        

        {/* Enhanced Swiper */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          speed={1000}
          slidesPerView={1}
          className="max-w-2xl mx-auto mt-10 relative z-10"
        >
          {slides.map((item, i) => (
            <SwiperSlide key={i} className="px-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center gap-4 bg-white/10 backdrop-blur-lg px-8 py-3 rounded-xl shadow-xl  "
              >
                <span className="text-primary  rounded-md">{item.icon}</span>
                <p className="text-base md:text-lg text-white/90 font-medium">{item.text}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-14 flex justify-center gap-3 sm:gap-6 relative z-10"
        >
          <Link
            href="/services"
            className="group bg-gradient-to-r from-primary to-secondary px-5 sm:px-8 py-3 rounded-full font-semibold shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all text-sm sm:text-base duration-300 flex items-center gap-1 sm:gap-2"
          >
            Get Started Free
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="group text-sm sm:text-base px-5 sm:px-8 py-3 rounded-full font-semibold border-2 border-white/30 text-white hover:border-white/60 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center gap-1 sm:gap-2"
          >
            <FiPlay size={18} />
            About Us
          </Link>
        </motion.div>
      </div>

      {/* Enhanced Trusted Clients */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 w-full px-8"
      >
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-white/70 text-sm mb-6"
        >
          Trusted by 100+ leading Clients
        </motion.p>
        <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap opacity-90">
          {clients.map((logo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
            >
              <Image
                width={140}
                height={60}
                src={logo}
                alt="Client Logo"
                className="object-contain grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

     
    </section>
  )
}