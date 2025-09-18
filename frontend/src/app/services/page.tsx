"use client"

import { motion } from "framer-motion"

import NewsletterSection from "@/components/Newsletter"
import Features from "@/components/Features"
import AppIntegrationSlider from "@/components/IntegratesWith"
import { ServiceCard, ServiceCardProps } from "@/components/ServiceCard"

// Example services data (replace with API/db data)
const services: ServiceCardProps[] = [
  {
    title: "CRM Automation",
    desc: "Automate your customer workflows and save time.",
    image: "/service.jpg",
    link: "/services/crm-automation",
  },
  {
    title: "E-Commerce Workflows",
    desc: "Sync orders, inventory, and invoices effortlessly.",
    image: "/service.jpg",
    link: "/services/ecommerce",
  },
  {
    title: "Marketing Campaigns",
    desc: "Automate emails, ads, and customer engagement.",
    image: "/service.jpg",
    link: "/services/marketing",
  },
  {
    title: "Analytics Dashboard",
    desc: "Track performance and generate smart reports.",
    image: "/service.jpg",
    link: "/services/analytics",
  },
  {
    title: "CRM Automation",
    desc: "Automate your customer workflows and save time.",
    image: "/service.jpg",
    link: "/services/crm-automation",
  },
  {
    title: "E-Commerce Workflows",
    desc: "Sync orders, inventory, and invoices effortlessly.",
    image: "/service.jpg",
    link: "/services/ecommerce",
  },
  {
    title: "Marketing Campaigns",
    desc: "Automate emails, ads, and customer engagement.",
    image: "/service.jpg",
    link: "/services/marketing",
  },
  {
    title: "Analytics Dashboard",
    desc: "Track performance and generate smart reports.",
    image: "/service.jpg",
    link: "/services/analytics",
  },
  {
    title: "Integration Tools",
    desc: "Connect multiple apps seamlessly without code.",
    image: "/service.jpg",
    link: "/services/integrations",
  },
  {
    title: "Workflow Optimization",
    desc: "Design smooth processes that minimize errors and maximize productivity.",
    image: "/service.jpg",
    link: "/services/workflow-optimization",
  },
]

export default function ServicesPage() {
  return (
    <section className="pt-28 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Our Services
        </h1>
        <p className="mt-4 text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
          Explore the wide range of automation services we offer to help
          businesses save time, reduce costs, and scale effortlessly.
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <ServiceCard {...service} />
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12">
        <button

          className="px-10 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl hover:from-secondary hover:to-primary transition duration-300"
        >
          Load More
        </button>
      </div>
      <Features />
      <AppIntegrationSlider />
      <NewsletterSection />
    </section>
  )
}
