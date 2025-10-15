'use client'
import Link from "next/link"
import { motion } from "framer-motion"

import HomeHero from "@/components/home/Hero_Section"
import Features from "@/components/Features"
import Services from "@/components/Services"
import AboutUs from "@/components/Aboutus"
import AppIntegrationSlider from "@/components/IntegratesWith"
import Testimonials from "@/components/Testimonial_Section"
import FAQSection from "@/components/home/FAQ_section"
import { FiAward, FiClock, FiStar, FiTrendingUp, FiUsers } from "react-icons/fi"
import NewsletterSection from "@/components/Newsletter"

const stats = [
  { icon: <FiUsers size={36} />, value: "500+", label: "Businesses Onboarded" },
  { icon: <FiClock size={36} />, value: "99%", label: "Uptime" },
  { icon: <FiStar size={36} />, value: "5/4", label: "Client Ratings" },
  { icon: <FiAward size={36} />, value: "12", label: "Industry Awards" },
  { icon: <FiTrendingUp size={36} />, value: "150%", label: "Avg Productivity Boost" },
]

export default function HomePage() {
  return (
    <div className='overflow-hidden'>
      <HomeHero />
      <AboutUs />
      <Features />
     
      <Services />
      <section className="pt-28 px-6 max-w-7xl mx-auto relative">
        <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent">
          How It Works
        </h2>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {["Sign Up", "Choose Service", "We Automate", "You Grow"].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg mb-5">
                {i + 1}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white">{step}</h3>
              <p className="mt-2 text-white/70 text-sm md:text-base">
                {step === "Sign Up" && "Create your account quickly to get started."}
                {step === "Choose Service" && "Pick the automation solution that fits your business."}
                {step === "We Automate" && "Our system automates repetitive workflows seamlessly."}
                {step === "You Grow" && "Focus on growth while we handle the rest."}
              </p>
            </motion.div>
          ))}
        </div>
      </section>


      <AppIntegrationSlider />

 <section className="pt-28 px-6 max-w-7xl mx-auto relative  text-center">
      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Awards & Recognition
      </h2>

      <p className="mt-4 text-white/70 max-w-2xl mx-auto text-lg">
        Trusted by hundreds of businesses worldwide, recognized for innovation, reliability, and exceptional client satisfaction.
      </p>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex flex-col items-center bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <div className="mb-4 text-white/0 relative">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-tr from-primary to-secondary rounded-full shadow-lg text-white text-2xl">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mt-4">{stat.value}</h3>
            <p className="text-white/70 mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
   
      <Testimonials />

      <FAQSection />

      <section className="relative  text-white pt-28 px-6 text-center ">
       <div className="absolute -top-32 -left-32 w-72 h-72 bg-gradient-to-tr from-primary/40 to-secondary/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gradient-to-tr from-secondary/40 to-primary/30 rounded-full blur-3xl -z-10"></div>


        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
        >
          Ready to Automate?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
        >
          Join 100+ businesses saving time, reducing errors, and growing faster with AutoFlow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8"
        >
          <Link
            href="/services"
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition duration-300 hover:from-secondary hover:to-primary"
          >
            🚀 Start Free Trial
          </Link>
        </motion.div>
        
      </section>
     <NewsletterSection />
    </div>
  )
}



