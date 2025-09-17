"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"


export type ServiceCardProps = {
  title: string
  desc: string
  image:string
  link:string
}

export function ServiceCard({ image, title, desc, link }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl flex flex-col group"
    >
      {/* Service Image */}
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 flex-1">{desc}</p>

        {/* CTA */}
        <Link
          href={link}
          className="mt-6 inline-block w-fit px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-white shadow hover:shadow-lg transition"
        >
          Learn More →
        </Link>
      </div>
    </motion.div>
  )
}

export default function Services() {
 const services = [
  {
    image: "/service.jpg",
    title: "CRM Automation",
    desc: "Sync leads, customers, and sales pipelines automatically.",
    link: "/services/crm-automation",
  },
  {
    image: "/service.jpg",
    title: "E-commerce Workflows",
    desc: "Automate order sync, stock updates, and payments.",
    link: "/services/ecommerce-workflows",
  },
  {
    image: "/service.jpg",
    title: "Marketing Campaigns",
    desc: "Trigger campaigns, schedule mails, and track conversions.",
    link: "/services/marketing-campaigns",
  },
   {
    image: "/service.jpg",
    title: "CRM Automation",
    desc: "Sync leads, customers, and sales pipelines automatically.",
    link: "/services/crm-automation",
  },
  {
    image: "/service.jpg",
    title: "E-commerce Workflows",
    desc: "Automate order sync, stock updates, and payments.",
    link: "/services/ecommerce-workflows",
  },
  {
    image: "/service.jpg",
    title: "Marketing Campaigns",
    desc: "Trigger campaigns, schedule mails, and track conversions.",
    link: "/services/marketing-campaigns",
  },
]

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
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ServiceCard {...service} />
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
