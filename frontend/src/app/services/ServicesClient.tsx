"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ServiceCard } from "@/components/ServiceCard";
import Features from "@/components/Features";
import AppIntegrationSlider from "@/components/IntegratesWith";
import NewsletterSection from "@/components/Newsletter";
import { service_list_api } from "@/api";

interface ServicesClientPageProps {
  initialWorkflows: any[];
}

export default function ServicesClientPage({ initialWorkflows }: ServicesClientPageProps) {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data } = await axios.post(service_list_api, { page: page + 1 }, {
        headers: { "Content-Type": "application/json" }
      });

      if (data.workflows && data.workflows.length > 0) {
        setWorkflows(prev => [...prev, ...data.workflows]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false); // no more data
      }
    } catch (err) {
      console.error("Failed to fetch workflows client-side:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-28 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Our Services
        </h1>
        <p className="mt-4 text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
          Explore the wide range of automation services we offer to help businesses save time, reduce costs, and scale effortlessly.
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
            <ServiceCard workflows={service} />
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-10 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl hover:from-secondary hover:to-primary transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      <Features />
      <AppIntegrationSlider />
      <NewsletterSection />
    </section>
  );
}
