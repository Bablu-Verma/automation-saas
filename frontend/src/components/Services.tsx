"use client"

import Link from "next/link"
import { ServiceCard } from "./ServiceCard" // Assuming ServiceCard is already themed
import { useEffect, useState } from "react"
import axios from "axios"
import { Workflow__ } from "@/app/admin/service/list/page" // Adjust this import path if needed
import { home_service_api } from "@/api" // Adjust this import path if needed
import { setServices } from "@/redux-store/slice/serviceToFooterSlice"
import { useDispatch } from "react-redux";


export default function Services() {
  const [workflows, setWorkflows] = useState<Workflow__[]>([]);
  const dispatch  = useDispatch()

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const { data } = await axios.post(
          home_service_api,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setWorkflows(data.workflows);
        dispatch(setServices(data.workflows));
      } catch (err) {
        console.error("Failed to fetch workflows:", err);
      }
    }
    fetchWorkflows();
  }, [dispatch]);




  return (
    <section className=" max-w-7xl pt-28 px-4 sm:px-6 text-center m-auto">
      {/* Framer Motion removed, standard classes applied */}
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-bold 
          text-textLight dark:text-textDark transition duration-500" 
      >
        Our Services
      </h2>

      {/* Framer Motion removed, standard classes applied */}
      <p
        className="mt-6 text-lg max-w-2xl mx-auto transition duration-500
          text-textLight/70 dark:text-textDark/70"
      >
        End-to-end automation solutions that help you save time, reduce errors, and focus on growth.
      </p>

      {/* Framer Motion removed, standard classes applied */}
      <div
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {workflows.map((service, i) => (
          <div
            key={i}
            // Transition and simple hover effect added to cards for visual feedback
            className="transition duration-300 hover:scale-[1.02]" 
          >
             <ServiceCard workflows={service} /> 
          </div>
        ))}
      </div>
      
      {/* View All Services Button (Framer Motion removed) */}
      <div className="mt-12">
       <Link
        href="/services"
        /* ✨ डिज़ाइन 1: आउटलाइन स्टाइल */
        className="inline-block px-8 py-3 rounded-full 
          font-semibold transition duration-300 transform 
          hover:scale-[1.05]
          
          /* Themed Border & Text */
          border-2 border-primary 
          text-primary dark:text-primary 
        "
    >
        View All Services
    </Link>
      </div>
    </section>
  )
}