"use client"

import { motion } from "framer-motion"

import Link from "next/link"
import { ServiceCard } from "./ServiceCard"
import { useEffect, useState } from "react"
import axios from "axios"
import { Workflow__ } from "@/app/admin/service/list/page"
import { home_service_api } from "@/api"
import { setServices } from "@/redux-store/slice/serviceToFooterSlice"
import { useDispatch } from "react-redux";


export default function Services() {
  const [workflows, setWorkflows] = useState<Workflow__[]>([]);
  const dispatch  = useDispatch()

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

        // console.log(data)
        setWorkflows(data.workflows);
        dispatch(setServices(data.workflows));
      } catch (err) {
        console.error("Failed to fetch workflows:", err);
      }
    }
    fetchWorkflows();
  }, [dispatch]);




 

  return (
    <section className=" max-w-7xl pt-28 px-6  text-center m-auto">
     <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent"
        >
          Our Services
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg text-white/70 max-w-2xl mx-auto"
        >
          End-to-end automation solutions that help you save time, reduce errors, and focus on growth.
        </motion.p>

        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {workflows.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
             <ServiceCard workflows={service} />
            </motion.div>
          ))}
        </motion.div>
         <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.6 }}
    className="mt-12"
  >
    <Link
      href="/services"
      className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition duration-300"
    >
      View All Services →
    </Link>
  </motion.div>
    </section>
  )
}
