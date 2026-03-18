"use client";

import { useState } from "react";
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
import { FaInfo, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface ServiceDetailsClientProps {
  initialWorkflow: IWorkflowDetail | null;
}

export default function ServiceDetailsClient({ initialWorkflow }: ServiceDetailsClientProps) {
  const [workflow] = useState(initialWorkflow);
  const [showPricing, setShowPricing] = useState(false);
  const router = useRouter();
  const token = useSelector((state: RootState) => state.user.token);

  if (!workflow) {
    return (
      <div className="flex flex-col justify-center items-center text-textLight dark:text-textDark h-[65vh]">
        <FaSearch className="w-14 h-14 text-red-500 dark:text-red-400 mb-3 opacity-90" />
        <p className="text-lg font-medium">Service not found.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Please check the link or try again.
        </p>
      </div>
    );
  }

  const getstart = () => {
    if (!token) {
      toast.error("You need to login before getting started 👋");
      return router.push("/login");
    }
    window.open(`/dashboard/start-form?id=${workflow.slug}`, "_blank");
  };

  const basePlan = workflow.pricingPlans.find((p) => p.planName === "BASE");

  const price = basePlan?.monthlyPrice || 0;
  const discount = basePlan?.discountPercent || 0;

  const finalPrice =
    Number(discount) > 0 ? Math.round(price - (price * Number(discount)) / 100) : price;

  return (
    <section className="pt-28 px-4 sm:px-6 max-w-7xl mx-auto transition-colors duration-500">

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        <div className="relative w-full  lg:w-1/2 min-h-80 rounded-xl overflow-hidden shadow-lg border border-textLight/10 dark:border-textDark/10">
          <Image src={workflow.serviceImage || ""} alt={workflow.name} fill className="object-cover" />
           {Number(discount) > 0 && (
              <span className="bg-green-500 right-2 top-3 absolute py-1 px-4 rounded-full text-sm text-white font-semibold">
                {discount.toString()}% OFF
              </span>
            )}

        </div>

        {/* INFO AREA */}
        <div className="w-full relative lg:w-1/2 flex flex-col gap-6">

        
          <h1 className="text-3xl md:text-4xl font-extrabold text-textLight dark:text-textDark">
            {workflow.name}
          </h1>

          {/* PRICING WITH OFFER */}
          <div className="text-2xl md:text-3xl relative font-bold text-textLight dark:text-textDark">
             
            {Number(discount) > 0 && (
              <span className="mr-2 line-through font-semibold text-gray-500 dark:text-gray-400">
                ₹{price}
              </span>
            )}
            <span className="text-primary font-semibold">₹{finalPrice}</span>
              <span className="text-lg font-medium text-textLight/70 dark:text-textDark/70">
              {" "}
              /Month
            </span>

            {/* PRICE INFO BUTTON */}
            <button
              title="Price Details"
              onClick={() => setShowPricing(true)}
              className="p-1 ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <FaInfo size={14} className="text-primary" />
            </button>

            <p className="text-base text-gray-500">
              Start with{" "}
              <span className="font-semibold">
                {workflow.pricingPlans.find((p) => p.planName === "TRIAL")?.validityDays || 7} days free trial
              </span>
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-2 flex w-full items-center justify-center md:justify-start">
            <div className="grid grid-cols-3 overflow-hidden rounded-full shadow-lg">
              <button
                onClick={getstart}
                className="px-8 py-3 font-semibold col-span-2 text-white bg-gradient-to-r from-primary to-secondary transition-all hover:opacity-90"
              >
                Get Started
              </button>

              <a
                target="_blank"
                href={`/services/docs?id=${workflow._id}`}
                className="px-8 py-3 font-semibold flex items-center gap-2 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 transition-all"
              >
                Docs <FiExternalLink className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* KEYWORDS */}
      <div className="flex gap-3 items-center justify-start flex-wrap text-textLight dark:text-textDark">
        <span className="flex gap-1.5 text-lg justify-center items-center">
          <FiCheckCircle className="text-primary" size={20} />
          <strong>Keywords:</strong>
        </span>

        {workflow.keyword.map((item, i) => (
          <span
            key={i}
            className="font-medium capitalize px-3 py-1 text-sm rounded-full text-primary border border-primary"
          >
            {item}
          </span>
        ))}
      </div>

      {/* DESCRIPTION */}
      {workflow.description && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-textLight dark:text-textDark">
            Description
          </h2>

          <div
            className="sm:mx-4 dangerouslyHTML prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: workflow.description }}
          />
        </div>
      )}

      
{showPricing && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-[50] animate-fadeIn px-4">

    <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl 
      bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700">

      {/* HEADER */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/10 to-secondary/10">

        <div>
          <h2 className="text-3xl font-bold text-textLight dark:text-textDark">
            Choose Your Plan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Flexible pricing built for scaling businesses
          </p>
        </div>

        <button
          onClick={() => setShowPricing(false)}
          className="w-10 h-10 flex items-center justify-center rounded-full 
          bg-primary text-white hover:scale-110 transition shadow-lg"
        >
          <IoClose className="text-xl" />
        </button>
      </div>

      {/* BODY */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 overflow-y-auto max-h-[75vh]">

        {workflow.pricingPlans.map((plan: any, i: number) => {

          const original = plan.monthlyPrice;
          const discount = plan.discountPercent || 0;
          const offer = original > 0
            ? Math.round(original - (original * discount) / 100)
            : 0;

          const isPopular = i === 1; // you can change logic

          return (
            <div
              key={i}
              className={`
                relative rounded-2xl p-6 border transition-all duration-300
                shadow-md hover:shadow-xl hover:-translate-y-1
                ${isPopular
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-black/30"
                }
              `}
            >

              {/* Popular Badge */}
              {isPopular && (
                <span className="absolute -top-3 left-6 bg-primary text-white text-xs px-3 py-1 rounded-full shadow">
                  Most Popular
                </span>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-primary mb-2">
                {plan.planName}
              </h3>

              {/* Pricing */}
              <div className="mb-4">
                {original === 0 ? (
                  <span className="text-3xl font-bold text-green-500">
                    Free
                  </span>
                ) : (
                  <div className="flex items-end gap-2">
                    {discount > 0 && (
                      <span className="line-through text-gray-400 text-lg">
                        ₹{original}
                      </span>
                    )}

                    <span className="text-3xl font-bold text-textLight dark:text-textDark">
                      ₹{offer}
                    </span>

                    <span className="text-sm text-gray-500 mb-1">
                      /month
                    </span>
                  </div>
                )}

                {discount > 0 && (
                  <p className="text-sm text-green-500 font-semibold mt-1">
                    Save {discount}% today
                  </p>
                )}
              </div>

              {/* Plan Details */}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-5">
                <p>
                  <span className="font-medium text-textLight dark:text-textDark">
                    Usage:
                  </span>{" "}
                  {plan.usageLimit === -1 ? "Unlimited" : plan.usageLimit}
                </p>

                <p>
                  <span className="font-medium text-textLight dark:text-textDark">
                    Validity:
                  </span>{" "}
                  {plan.validityDays} days
                </p>
              </div>

              {/* Features */}
              {plan.features?.length > 0 && (
                <ul className="space-y-2 text-sm mb-6">
                  {plan.features.map((f: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-primary mt-1">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

           

            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

      <Features />
      <AppIntegrationSlider />

      <section className="relative pt-28 pb-24 px-6 text-center ">

 

  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-textLight dark:text-textDark">
    Need Help Getting Started?
  </h2>

  <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-textLight/80 dark:text-textDark/80">
    Not sure where to begin? Our experts will guide you — from setup to scaling your automation smoothly.
  </p>

  <div className="mt-10 flex flex-wrap items-center justify-center gap-5">

   
    <Link
      href="/contact"
      className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary 
                 text-white font-semibold shadow-md hover:shadow-xl 
                 transition duration-300 hover:scale-105"
    >
      Get Free Consultation
    </Link>

   
    <Link
      target="_blank"
      href={`/services/docs?id=${workflow._id}`}
      className="px-8 py-3 rounded-full border border-textLight/30 dark:border-textDark/30
                 text-textLight dark:text-textDark font-semibold
                 hover:bg-textLight/5 dark:hover:bg-textDark/5
                 transition duration-300"
    >
      Read Docs
    </Link>

  </div>

</section>
     
    </section>
  );
}
