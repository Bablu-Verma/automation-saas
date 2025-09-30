"use client"

import { service_detail_api } from "@/api"
import { WorkflowDetail } from "@/app/admin/service/view/page"
import Features from "@/components/Features"
import AppIntegrationSlider from "@/components/IntegratesWith"
import Loading_ from "@/components/Loading"
import { RootState } from "@/redux-store/redux_store"
import axios from "axios"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FiCheckCircle } from "react-icons/fi"
import { useSelector } from "react-redux"

export default function ServiceDetails() {
  const searchParams = useSearchParams();
  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const workflowId = searchParams.get("id");

  const token = useSelector((state: RootState) => state.user.token);
  const router = useRouter();

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
      <Loading_ />
    )
  }

  if (!workflow) {
    return <p className="text-center text-white mt-28">Service not found.</p>
  }

  const getstart = ()=>{
    if(!token){
     toast.error('You need to login before getting started 👋')
     return router.push('/login')
    }

    router.push(`/dashboard/start-form?id=${workflowId}`)
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
        

          {/* Price & Trial */}
          <p className="text-2xl md:text-3xl font-bold text-white">
            ₹{workflow.pricePerMonth}<span className="text-lg font-medium text-white/80">/Months</span>  <span className="text-lg font-medium text-white/80">| Trial: {workflow.trialDays} days</span>
          </p>

          {/* CTA */}
          <button
             onClick={getstart}
            className="mt-4 inline-block px-10 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-center font-semibold text-lg shadow-xl hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            Get Started
          </button>
        </div>
      </motion.div>

        <p className="flex items-center text-lg text-white/80 gap-2">
            <FiCheckCircle className="text-green-400" size={20} />
            Keywords: <div className="flex gap-x-3 flex-wrap gap-y-1">{
              workflow.keyword.map((item, i )=>(
                <span key={i} className="font-normal capitalize px-4 py-.5 rounded-full bg-amber-600 ">{item}</span>
              ))
              }</div>
          </p>

      {/* Description */}
      {workflow.description && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-white mb-4">Description</h2>
      <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className=" mx-4 mb-16 md:mx-8 dangerouslyHTML"
                dangerouslySetInnerHTML={{ __html: workflow.description }}
              />
        </div>
       
      )}

     {/* Required Inputs & Credentials */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mb-16">
  {/* Required Inputs */}
  {workflow.requiredInputs?.filter((input) => input.key)?.length > 0 && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md"
    >
      <h2 className="text-2xl font-semibold text-white mb-4">Required Inputs</h2>
      <ul className="list-disc list-inside text-white/80">
        {workflow.requiredInputs
          .filter((input) => input.key && input.label)
          .map((input, idx) => (
            <li key={idx}>
              <span className="font-semibold">{input.label}</span>
            </li>
          ))}
      </ul>
    </motion.div>
  )}


  {/* Required Credentials */}
  {workflow.requiredCredentials?.filter((cred) => cred.service && cred.label)?.length > 0 && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md"
    >
      <h2 className="text-2xl font-semibold text-white mb-4">Required Credentials</h2>
      <ul className="list-disc list-inside text-white/80">
        {workflow.requiredCredentials
          .filter((cred) => cred.service && cred.label)
          .map((cred, idx) => (
            <li key={idx}>
              <span className="font-semibold">{cred.label}</span> {cred.service}
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
        <button
           onClick={getstart}
          className="px-10 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition"
        >
          Get Started
        </button>
      </motion.div>

      <Features />
      <AppIntegrationSlider />

      <section className="relative text-white pt-28 px-6 text-center">
        {/* Subtle background shapes */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl -z-10"></div>

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
  )
}
