"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FiCheckCircle } from "react-icons/fi"

type ServiceDetailsProps = {
  title: string
  desc: string
  image: string
  features: string[]
  benefits: string[]
}

let desc = `"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FiCheckCircle } from "react-icons/fi"

type ServiceDetailsProps = {
  title: string
  desc: string
  image: string
  features: string[]
  benefits: string[]
}

const mockService: ServiceDetailsProps = {
  title: "CRM Automation",
  desc: "Streamline your sales process with automated CRM workflows. Save time, reduce manual errors, and enhance customer experience.",
  image: "/service.jpg",
  features: [
    "Automated lead capture and assignment",
    "Email & SMS follow-ups",
    "Pipeline tracking",
    "Real-time notifications",
  ],
  benefits: [
    "Boost sales team productivity",
    "Never miss a lead again",
    "Shorten sales cycles",
    "Increase revenue and retention",
  ],
}

export default function ServiceDetailsPage() {
  const service = mockService // Later fetch by slug/ID

  return (
    <section className="py-28 px-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          {service.title}
        </h1>
        <p className="mt-4 text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
          {service.desc}
        </p>
      </motion.div>

      {/* Image + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-80 rounded-3xl overflow-hidden shadow-xl"
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Key Features
          </h2>
          <ul className="space-y-3 text-white/80">
            {service.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <FiCheckCircle className="text-primary mt-1" />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg mb-20"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Why Choose {service.title}?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {service.benefits.map((benefit, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white/5 p-4 rounded-xl"
            >
              <FiCheckCircle className="text-secondary mt-1" />
              <p className="text-white/80">{benefit}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-white/80 mb-6 text-lg">
          Ready to transform your workflows with {service.title}?
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
`

const mockService: ServiceDetailsProps = {
  title: "CRM Automation",
  desc: "Streamline your sales process with automated CRM workflows. Save time, reduce manual errors, and enhance customer experience.",
  image: "/service.jpg",
  features: [
    "Automated lead capture and assignment",
    "Email & SMS follow-ups",
    "Pipeline tracking",
    "Real-time notifications",
  ],
  benefits: [
    "Boost sales team productivity",
    "Never miss a lead again",
    "Shorten sales cycles",
    "Increase revenue and retention",
  ],
}

export default function ServiceDetails() {
  const service = mockService

  return (
    <section className="py-28 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          {service.title}
        </h1>
        <p className="mt-4 text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
          {service.desc}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-96 mb-10 rounded-3xl overflow-hidden shadow-xl"
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Image + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">


        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Key Features
          </h2>
          <ul className="space-y-3 text-white/80">
            {service.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <FiCheckCircle className="text-primary mt-1" />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg mb-20"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Why Choose {service.title}?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {service.benefits.map((benefit, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white/5 p-4 rounded-xl"
            >
              <FiCheckCircle className="text-secondary mt-1" />
              <p className="text-white/80">{benefit}</p>
            </div>
          ))}
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-20 max-w-4xl mx-auto text-white/80 leading-relaxed text-lg"
        dangerouslySetInnerHTML={{ __html: desc }}
      >

      </motion.div>


      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-white/80 mb-6 text-lg">
          Ready to transform your workflows with {service.title}?
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
