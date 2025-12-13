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
    <section className="py-28 px-4 sm:px-6 max-w-7xl mx-auto transition-colors duration-500">

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

      {/* DOCUMENTATION LINK */}
      <div className="mt-10 sm:pl-4 ">
        <a
          target="_blank"
          href={`/services/docs?id=${workflow._id}`}
          className="text-primary text-base md:text-lg hover:text-secondary py-1 flex items-center gap-2 underline"
        >
          <span>Read documentation</span> <FiExternalLink />
        </a>
      </div>

      {/* PRICING MODAL */}
      {showPricing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[20] animate-fadeIn">
          <div className="relative bg-white dark:bg-darkBg p-6 rounded-2xl w-[92vw] max-w-5xl shadow-2xl">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-textLight dark:text-textDark">
                Pricing Plans
              </h2>

              <button
                onClick={() => setShowPricing(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/90 hover:bg-primary transition  shadow-lg"
              >
                <IoClose className="text-xl" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto pr-1">
              {workflow.pricingPlans.map((plan: any, i: number) => {
                const original = plan.monthlyPrice;
                const discount = plan.discountPercent || 0;
                const offer = original > 0 ? Math.round(original - (original * discount) / 100) : 0;

                return (
                  <div
                    key={i}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm bg-white/80 dark:bg-black/30 backdrop-blur hover:shadow-md hover:border-primary/50 transition-all"
                  >
                    <p className="font-bold text-lg text-primary">{plan.planName}</p>

                    {/* Offer Pricing */}
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {original === 0 ? (
                        <span className="font-semibold">Free</span>
                      ) : (
                        <>
                         <span className="line-through">₹{original}</span>
                          
                          {discount > 0 && (
                            <>
                             <span className="ml-2 font-semibold text-primary">₹{offer}</span>
                              <span className="text-primary">/ month</span>
                              <span className="ml-2 text-green-500 font-semibold">
                                {discount}% OFF
                              </span>
                            </>
                          )}                         
                        </>
                      )}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300">
                      Limit:{" "}
                      <span className="font-medium">
                        {plan.usageLimit === -1 ? "Unlimited" : plan.usageLimit}
                      </span>
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Validity: <span className="font-medium">{plan.validityDays} days</span>
                    </p>

                    {plan.features?.length > 0 && (
                      <ul className="list-disc ml-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {plan.features.map((f: string, idx: number) => (
                          <li key={idx}>{f}</li>
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

      {/* CTA */}
      <section className="pt-28 px-6 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-textLight dark:text-textDark">
          Need Help Getting Started?
        </h2>

        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-textLight/80 dark:text-textDark/80">
          Not sure where to begin? Our experts will guide you — from setup to scaling your automation smoothly.
        </p>

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
