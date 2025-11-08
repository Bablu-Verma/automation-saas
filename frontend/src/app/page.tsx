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
import { FiArrowDown, FiAward, FiClock, FiCloudLightning, FiSettings, FiStar, FiTrendingUp, FiUserPlus, FiUsers } from "react-icons/fi"
import NewsletterSection from "@/components/Newsletter"
import CustomAutomationCTA from "@/components/CustomAutomationCTA"

const stats = [
  { icon: <FiUsers size={36} />, value: "100+", label: "Businesses Onboarded" },
  { icon: <FiClock size={36} />, value: "99%", label: "Uptime" },
  { icon: <FiStar size={36} />, value: "5/4", label: "Client Ratings" },
  { icon: <FiAward size={36} />, value: "2", label: "Industry Awards" },
  { icon: <FiTrendingUp size={36} />, value: "200%", label: "Avg Productivity Boost" },
]

export default function HomePage() {
  return (
    <div className='overflow-hidden'>
      <HomeHero />
      <AboutUs />
      <Features />
     
      <Services />
      <CustomAutomationCTA />
      
  <section className="pt-32 px-6 max-w-7xl mx-auto relative">
  {/* Section Header with Animation */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center mb-20"
  >
   
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
      How It Works
    </h2>
    <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
      Get started in minutes and see results from day one. Simple, fast, and powerful automation.
    </p>
  </motion.div>

  {/* Steps Grid with Connecting Lines */}
  <div className="relative">
    {/* Connecting Line for Desktop */}
    <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 -z-10"></div>
    
    {/* Steps Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          step: "Sign Up",
          description: "Create your account in 30 seconds. No credit card required to start.",
          icon: <FiUserPlus size={24} />,
          color: "from-blue-500 to-cyan-500"
        },
        {
          step: "Choose Service", 
          description: "Select from 50+ pre-built automation templates or create custom ones.",
          icon: <FiSettings size={24} />,
          color: "from-purple-500 to-pink-500"
        },
        {
          step: "We Automate",
          description: "Our AI sets up and manages your workflows 24/7 with real-time monitoring.",
          icon: <FiCloudLightning size={24} />,
          color: "from-orange-500 to-red-500"
        },
        {
          step: "You Grow",
          description: "Focus on strategic work while we handle the repetitive tasks automatically.",
          icon: <FiTrendingUp size={24} />,
          color: "from-green-500 to-teal-500"
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, duration: 0.6 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative group"
        >
          {/* Step Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-500 h-full flex flex-col">
            
            {/* Step Number with Gradient */}
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-6 relative`}>
              {i + 1}
              {/* Animated Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
            </div>

            {/* Icon */}
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center text-white/80">
                {item.icon}
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white text-center mb-4  ">
              {item.step}
            </h3>
            
            <p className="text-white/70 text-center text-sm leading-relaxed flex-grow">
              {item.description}
            </p>

            {/* Hover Effect Bottom Border */}
            <div className={`mt-6 w-0 group-hover:w-full h-0.5 bg-gradient-to-r ${item.color} transition-all duration-500 mx-auto`}></div>
          </div>

          {/* Connecting Arrow for Mobile */}
          {i < 3 && (
            <>
              <div className="lg:hidden absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white/30">
                <FiArrowDown size={24} />
              </div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  </div>

 
</section>

      <AppIntegrationSlider />

 <section className="pt-28 p-4 sm:px-6 max-w-7xl mx-auto relative ">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r text-white">
        Awards & Recognition
      </h2>

      <p className="mt-4 text-white/70 max-w-2xl text-lg">
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
          Join 100+ businesses saving time, reducing errors, and growing faster with Loop Axis .
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



