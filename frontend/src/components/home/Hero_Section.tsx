"use client"

import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import {
  FiZap,
  FiCpu,
  FiTrendingUp,
  FiCloudLightning,
  FiArrowRight
} from "react-icons/fi"
import "swiper/css"
import { FaAmazon, FaApple, FaFacebookF, FaGoogle, FaInstagram, FaLinkedinIn, FaMicrosoft, FaTwitter } from "react-icons/fa"
import useTheme from "@/hooks/useTheam"

export default function HomeHero() {

   const [theme] = useTheme();

  const slides = [
    { icon: <FiZap size={28} />, text: "Save 20+ hours every week with automation." },
    { icon: <FiCpu size={28} />, text: "Integrate with 100+ tools effortlessly." },
    { icon: <FiTrendingUp size={28} />, text: "Scale workflows without extra hires." },
    { icon: <FiCloudLightning size={28} />, text: "Your business, on autopilot ⚡" },
  ]

  const clients = [
    FaApple,
    FaGoogle,
    FaAmazon,
    FaMicrosoft,
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaInstagram,
  ];

  return (
    <section className="relative min-h-[90vh] w-full flex flex-col justify-center items-center pb-16 pt-24 overflow-hidden
      transition-colors duration-300">

      {/* BG Soft Glow Effects (Already uses theme colors, looks good) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-64 
          bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px]"></div>

        <div className="absolute bottom-20 right-1/4 w-80 h-80
          bg-secondary/20 dark:bg-secondary/10 rounded-full blur-[150px]"></div>
      </div>

      
       <div className="absolute inset-0 -z-20 overflow-hidden">
        <video
          autoPlay
          muted
          // loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src='/hero_video1.mp4' type="video/mp4" />
        </video>
        <div className="absolute inset-0
  bg-neutral-100/20
  dark:bg-black/70"></div>
      </div>

     


      {/* Main Content */}
      <div className="text-center w-full max-w-4xl pb-10 px-4 sm:px-6">

        {/* Badge (Border and Background updated for theme-awareness) */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
          bg-lightBg/50 dark:bg-darkBg/50 backdrop-blur-md 
          border border-textLight/10 dark:border-textDark/10 mb-8
          transition-all duration-300
          text-textLight dark:text-textDark"> {/* Added text color for the badge content */}
          <FiZap className="text-primary" size={16} />
          <span className="text-sm font-medium">No-code Automation Platform</span>
        </div>

        {/* Heading (Text color updated) */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight 
            text-textLight dark:text-textDark"> {/* Primary Heading text color */}
          Automate. Scale. Grow.
        </h1>

        {/* Sub Heading (Text color updated) */}
        <p className="mt-8 text-lg  md:text-xl text-textLight/70 dark:text-textDark/70 max-w-3xl mx-auto leading-relaxed">
          Supercharge your workflows with
          <span className="text-primary font-semibold"> AI-powered automation</span>.
          Spend less time on manual tasks and more time growing your business.
        </p>

        {/* Swiper (Text and Background updated) */}
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
    bg-lightBg/40 dark:bg-darkBg/40 backdrop-blur-lg 
    border border-textLight/10 dark:border-textDark/10 
    
    px-8 py-3 rounded-xl shadow-md
    transition-all duration-300">
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
          {/* Primary Button (Color is fine, just added transition to hover) */}
          <Link
            href="/services"
            className="group bg-gradient-to-r from-primary to-secondary px-6 sm:px-8 py-3 rounded-full 
              font-semibold shadow-xl 
              hover:scale-105 transition-all duration-300 flex items-center gap-2 text-white"
          >
            Get Started Free
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary Button (Border and Text color updated for theme-awareness) */}
          <Link
            href="/about"
            className="group text-sm sm:text-base px-6 sm:px-8 py-3 rounded-full 
              font-semibold border-2 border-textLight/20 dark:border-textDark/20 
              text-textLight dark:text-textDark 
              hover:border-primary dark:hover:border-primary 
              hover:bg-primary/10 dark:hover:bg-primary/10 
              backdrop-blur-sm transition-all duration-300 
              flex items-center gap-2"
          >
            About Us
          </Link>
        </div>
      </div>

      <div className="mt-6 w-full px-8">
        <p className="text-center 
     text-[color:var(--text-light)]/60 
     dark:text-[color:var(--text-dark)]/60 
     text-sm mb-6">
          Trusted by 100+ leading Clients
        </p>

        <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap opacity-90">
          {clients.map((Icon, i) => (
            <div
              key={i}
              className="text-gray-400 dark:text-gray-500 text-4xl 
                   hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <Icon />
            </div>
          ))}
        </div>
      </div>


    </section>
  )
}