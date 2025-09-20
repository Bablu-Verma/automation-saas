"use client"

import { motion } from "framer-motion"

import NewsletterSection from "@/components/Newsletter"
import Features from "@/components/Features"
import AppIntegrationSlider from "@/components/IntegratesWith"
import { ServiceCard, ServiceCardProps } from "@/components/ServiceCard"
import axios from "axios"
import { useEffect, useState } from "react"
import { Workflow__ } from "../admin/service/list/page"
import { service_list_api } from "@/api"


export default function ServicesPage() {

    const [workflows, setWorkflows] = useState<Workflow__[]>([]);


   useEffect(() => {

    async function fetchWorkflows() {
      try {
        const { data } = await axios.post(
          service_list_api,
          {},
          {
            headers: {
              "Content-Type": "application/json",
         
            },
          }
        );

        console.log(data)
        setWorkflows(data.workflows);
      } catch (err) {
        console.error("Failed to fetch workflows:", err);
      }
    }
    fetchWorkflows();
  }, []);





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
        {workflows.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <ServiceCard  workflows={service} />
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
