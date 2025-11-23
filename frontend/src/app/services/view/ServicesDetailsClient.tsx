"use client";

import { useState } from "react";
// Framer Motion removed from imports
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiCheckCircle, FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { IWorkflowDetail } from "@/types";
import Features from "@/components/Features";
import AppIntegrationSlider from "@/components/IntegratesWith";
import { RootState } from "@/redux-store/redux_store";
import { FaSearch } from "react-icons/fa";

interface ServiceDetailsClientProps {
  initialWorkflow: IWorkflowDetail | null;
}

export default function ServiceDetailsClient({ initialWorkflow }: ServiceDetailsClientProps) {
  const [workflow] = useState(initialWorkflow);
  const router = useRouter();
  const token = useSelector((state: RootState) => state.user.token);

  if (!workflow) {
    // Theming for Service Not Found text
    return (
        <div className="flex flex-col justify-center items-center text-textLight dark:text-textDark h-[65vh]">
      <FaSearch className="w-14 h-14 text-red-500 dark:text-red-400 mb-3 opacity-90" />
      <p className="text-lg font-medium">Service not found.</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Please check the link or try again.
      </p>
    </div>
    )
  }

  const getstart = () => {
    if (!token) {
      toast.error("You need to login before getting started 👋");
      return router.push("/login");
    }
    window.open(`/dashboard/start-form?id=${workflow.slug}`, '_blank');
  };

  return (
    <section className="py-28 px-4 sm:px-6 max-w-7xl mx-auto transition-colors duration-500">

      {/* Hero Section (Framer Motion removed) */}
      <div
        className="flex flex-col lg:flex-row items-center gap-12 mb-16"
      >
        {/* Image */}
        <div className="relative w-full lg:w-1/2 min-h-80 rounded-xl overflow-hidden shadow-lg border border-textLight/10 dark:border-textDark/10">
          <Image src={workflow.serviceImage || ""} alt={workflow.name} fill className="object-cover" />
        </div>

        {/* Info */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* H1 Theming */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-textLight dark:text-textDark">{workflow.name}</h1>

          {/* Pricing Theming */}
          <p className="text-2xl md:text-3xl font-bold text-textLight dark:text-textDark">
            <span className="text-primary">₹{workflow.pricePerMonth}</span>
            <span className="text-lg font-medium text-textLight/70 dark:text-textDark/70"> /Month</span>
            <span className="text-lg font-medium text-textLight/70 dark:text-textDark/70"> | Trial: {workflow.trialDays} days</span>
          </p>

          {/* Button (Gradient remains universal, added CSS hover effect) */}
          <button
            onClick={getstart}
            className="mt-4 inline-block text-white sm:max-w-[300px] px-10 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-center font-semibold text-lg shadow-xl transition-transform transform hover:scale-[1.03] hover:-translate-y-1"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Keywords */}
      <div className="flex gap-3 items-center justify-start flex-wrap text-textLight dark:text-textDark">
        <span className="flex gap-1.5 text-lg justify-center items-center">
          <FiCheckCircle className="text-primary" size={20} />
          <strong>Keywords:</strong>
        </span>
        {/* Keyword Tags Theming */}
        {workflow.keyword.map((item, i) => (
          <span
            key={i}
            className="
      font-medium capitalize 
      px-3 py-1 text-sm 
      rounded-full 
      text-primary 
      transition-colors duration-300 
      border-[1px] border-primary
    "
          >
            {item}
          </span>
        ))}
      </div>

      {/* Description */}
      {workflow.description && (
        <div className="mt-10">
          {/* H2 Theming */}
          <h2 className="text-2xl font-semibold mb-4 text-textLight dark:text-textDark">Description</h2>

          {/* Description Content (Framer Motion removed, Rich Text Theming applied) */}
          <div
            className="sm:mx-4 dangerouslyHTML prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: workflow.description }}

          />
        </div>
      )}

      {/* Documentation Link */}
      <div className="mt-10 sm:pl-4 ">
        {/* Link Theming */}
        <Link href={`/services/docs?id=${workflow._id}`}
          className="text-primary hover:text-secondary py-1 flex items-center gap-2 underline">
          <span>Read documentation</span> <FiExternalLink />
        </Link>
      </div>

      <Features />
      <AppIntegrationSlider />

      {/* CTA Section (Framer Motion removed) */}
      <section className="pt-28 px-6 text-center">
        {/* H2 Theming */}
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-textLight dark:text-textDark"
        >
          Need Help Getting Started?
        </h2>
        {/* Paragraph Theming */}
        <p
          className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-textLight/80 dark:text-textDark/80"
        >
          Not sure where to begin? Our experts will guide you — from setup to scaling your automation smoothly.
        </p>
        {/* Button (Standard CTA Styling) */}
        <div className="mt-8">
          <Link
            href="/contact"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition duration-300 hover:scale-105 text-lg"
          >
            Get Free Consultation
          </Link>
        </div>
      </section>
    </section>
  );
}