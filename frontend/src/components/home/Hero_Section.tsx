"use client"

import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"

import {
  FiZap,
  FiCpu,
  FiTrendingUp,
  FiCloudLightning,
  FiShield,
  FiBarChart2,
  FiClock,
  FiDollarSign,
  FiArrowRight
} from "react-icons/fi"
import "swiper/css"


export default function HomeHero() {




  const slides = [
    { icon: <FiZap size={28} />, text: "Save 100+ hours every week with automation." },
    { icon: <FiCpu size={28} />, text: "Integrate with 100+ tools effortlessly." },
    { icon: <FiTrendingUp size={28} />, text: "Scale workflows without extra hires." },
    { icon: <FiCloudLightning size={28} />, text: "Your business, on autopilot ⚡" },
    { icon: <FiShield size={28} />, text: "Secure, reliable & enterprise-ready." },
    { icon: <FiBarChart2 size={28} />, text: "Real-time analytics & performance tracking." },
    { icon: <FiClock size={28} />, text: "24/7 automated support without burnout." },
    { icon: <FiDollarSign size={28} />, text: "Reduce costs while increasing revenue." },
  ]

  return (
    <section className="relative min-h-[90vh] w-full flex flex-col justify-center items-center pb-0 pt-24 overflow-hidden transition-colors duration-300">





      <div className="text-center w-full max-w-4xl pb-10 px-4 sm:px-6 relative z-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
          bg-lightBg/70 dark:bg-darkBg/70 backdrop-blur-md 
          border border-primary/20 mb-8
          text-textLight dark:text-textDark
          shadow-lg shadow-primary/5">
          <FiZap className="text-primary" size={16} />
          <span className="text-sm font-medium">No-code Automation Platform</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight 
          text-textLight dark:text-textDark">
          Automate. Scale.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Grow.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-textLight/80 dark:text-textDark/80 max-w-3xl mx-auto leading-relaxed">
          Supercharge your workflows with
          <span className="text-primary font-semibold"> AI-powered automation</span>.
          Spend less time on manual tasks and more time growing your business.
        </p>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          speed={900}
          slidesPerView={1}
          className="max-w-2xl mx-auto mt-10"
        >
          {slides.map((item, i) => (
            <SwiperSlide key={i} className="px-5 py-2">
              <div className="flex items-center justify-center gap-4 
                px-8 py-3 rounded-xl
                bg-lightBg/50 dark:bg-darkBg/50 
                ">
                <span className="text-primary">{item.icon}</span>
                <p className="text-base md:text-lg font-medium text-textLight dark:text-textDark">
                  {item.text}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Buttons */}
        <div className="mt-14 flex justify-center gap-4 sm:gap-6">
          <Link
            href="/services"
            className="group bg-gradient-to-r from-primary to-secondary px-6 sm:px-8 py-3 rounded-full 
              font-semibold shadow-xl shadow-primary/25
              hover:shadow-primary/40 hover:scale-105 
              transition-all duration-300 flex items-center gap-2 text-white"
          >
            Get Started Free
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/about"
            className="text-sm sm:text-base px-6 sm:px-8 py-3 rounded-full 
              font-semibold border-2 border-textLight/20 dark:border-textDark/20 
              text-textLight dark:text-textDark 
              hover:border-primary hover:bg-primary/10 
              backdrop-blur-sm transition-all duration-300"
          >
            About Us
          </Link>
        </div>
      </div>

      <div className="mt-6 w-full px-8 relative z-10">
        <p className="text-center text-textLight/60 dark:text-textDark/60 text-sm">
          Trusted by 100+ leading Clients
        </p>
      </div>
    </section>
  )
}