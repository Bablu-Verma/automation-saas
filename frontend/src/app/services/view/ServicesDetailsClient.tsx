"use client";


import Features from "@/components/Features";
import AppIntegrationSlider from "@/components/IntegratesWith";
import { RootState } from "@/redux-store/redux_store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IWorkflowDetail } from "@/types";

interface ServiceDetailsClientProps {
  initialWorkflow: IWorkflowDetail | null;
}

export default function ServiceDetailsClient({ initialWorkflow }: ServiceDetailsClientProps) {
  const [workflow] = useState(initialWorkflow);
  const router = useRouter();
  const token = useSelector((state: RootState) => state.user.token);

  if (!workflow) {
    return <p className="text-center text-white mt-28">Service not found.</p>;
  }

  const getstart = () => {
    if (!token) {
      toast.error("You need to login before getting started 👋");
      return router.push("/login");
    }
    router.push(`/dashboard/start-form?id=${workflow.slug}`);
  };

  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        className="flex flex-col lg:flex-row items-center gap-12 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Image */}
        <div className="relative w-full lg:w-1/2 h-96 rounded-3xl overflow-hidden shadow-xl">
          <Image src={workflow.serviceImage || ""} alt={workflow.name} fill className="object-cover" />
        </div>

        {/* Info */}
        <div className="w-full lg:w-1/2 text-white flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">{workflow.name}</h1>
          <p className="text-2xl md:text-3xl font-bold text-white">
            ₹{workflow.pricePerMonth}
            <span className="text-lg font-medium text-white/80">/Month</span> 
            <span className="text-lg font-medium text-white/80"> | Trial: {workflow.trialDays} days</span>
          </p>

          <button
            onClick={getstart}
            className="mt-4 inline-block px-10 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-center font-semibold text-lg shadow-xl hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            Get Started
          </button>
        </div>
      </motion.div>

      {/* Keywords */}
      <p className="flex items-center text-lg text-white/80 gap-2">
        <FiCheckCircle className="text-green-400" size={20} />
        Keywords: 
        <div className="flex gap-x-3 flex-wrap gap-y-1">
          {workflow.keyword.map((item, i) => (
            <span key={i} className="font-normal capitalize px-4 py-.5 rounded-full bg-amber-600">
              {item}
            </span>
          ))}
        </div>
      </p>

      {/* Description */}
      {workflow.description && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-white mb-4">Description</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-4 dangerouslyHTML"
            dangerouslySetInnerHTML={{ __html: workflow.description }}
          />
        </div>
      )}

      <Features />
      <AppIntegrationSlider />

      {/* CTA Section */}
      <section className="relative text-white pt-28 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
        >
          Need Help Getting Started?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
        >
          Not sure where to begin? Our experts will guide you — from setup to scaling your automation smoothly.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8"
        >
          <Link
            href="/contact"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition duration-300 hover:from-secondary hover:to-primary text-lg"
          >
            Get Free Consultation
          </Link>
        </motion.div>
      </section>
    </section>
  );
}
