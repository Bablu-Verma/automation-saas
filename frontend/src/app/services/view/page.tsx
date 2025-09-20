"use client"

import { service_detail_api } from "@/api"
import { WorkflowDetail } from "@/app/admin/service/view/page"
import axios from "axios"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FiCheckCircle } from "react-icons/fi"

export default function ServiceDetails() {
  const searchParams = useSearchParams();
  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const workflowId = searchParams.get("id");

  useEffect(() => {
    if (!workflowId) return;

    async function fetchWorkflow() {
      try {
        const { data } = await axios.post(service_detail_api, { id: workflowId });
        setWorkflow(data.workflow);
      } catch (err) {
        console.error("Failed to fetch workflow detail:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, [workflowId]);

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center text-white">
        Loading workflow...
      </div>
    )
  }

  if (!workflow) {
    return <p className="text-center text-white mt-28">Workflow not found.</p>
  }

  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">
      {/* Hero Section: Split Layout */}
      <motion.div
        className="flex flex-col lg:flex-row items-center gap-12 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left: Image */}
        <div className="relative w-full lg:w-1/2 h-96 rounded-3xl overflow-hidden shadow-xl">
          <Image
            src={workflow.serviceImage || ""}
            alt={workflow.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Right: Info */}
        <div className="w-full lg:w-1/2 text-white flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {workflow.name}
          </h1>
          <p className="flex items-center text-lg text-white/80 gap-2">
            <FiCheckCircle className="text-green-400" size={20} />
            Category: <span className="font-semibold">{workflow.category}</span>
          </p>

          {/* Price & Trial */}
          <p className="text-2xl md:text-3xl font-bold text-white">
            ₹{workflow.pricePerMonth}<span className="text-lg font-medium text-white/80">/Months</span>  <span className="text-lg font-medium text-white/80">| Trial: {workflow.trialDays} days</span>
          </p>

          {/* CTA */}
          <Link
            href="/contact"
            className="mt-4 inline-block px-10 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-center font-semibold text-lg shadow-xl hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </div>
      </motion.div>

      {/* Description */}
      {workflow.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" mx-4 mb-16 md:mx-8 dangerouslyHTML"
          dangerouslySetInnerHTML={{ __html: workflow.description }}
        />
      )}

      {/* Required Inputs & Credentials */}
      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* Required Inputs */}
        {workflow.requiredInputs?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Required Inputs</h2>
            <ul className="list-disc list-inside text-white/80">
              {workflow.requiredInputs.map((input, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{input.label}</span> ({input.type}) {input.required ? '*' : ''}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Required Credentials */}
        {workflow.requiredCredentials?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Required Credentials</h2>
            <ul className="list-disc list-inside text-white/80">
              {workflow.requiredCredentials.map((cred, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{cred.label}</span> ({cred.service})
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-white/80 mb-6 text-lg">
          Ready to automate your workflows with <span className="font-semibold">{workflow.name}</span>?
        </p>
        <Link
          href="/contact"
          className="px-10 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition"
        >
          Get Started
        </Link>
      </motion.div>
    </section>
  )
}
