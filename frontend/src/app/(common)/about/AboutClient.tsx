"use client"

import Features from "@/components/Features"
import AppIntegrationSlider from "@/components/IntegratesWith"
import NewsletterSection from "@/components/Newsletter"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"



export default function AboutUsClinet() {
    return (
        <section className="relative pt-28  max-w-7xl mx-auto">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 px-6"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                    About Loop Axis 
                </h1>
                <p className="mt-4 text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
                    Loop Axis  helps businesses automate repetitive workflows, integrate with hundreds of tools, and scale operations without extra hires.
                </p>
            </motion.div>

            {/* Image + Text */}
            <div className="flex flex-col px-4 md:px-6 lg:flex-row items-start gap-12">
                {/* LEFT STICKY SIDEBAR */}
                <div className="w-full lg:w-1/2 lg:sticky lg:top-10 self-start">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[60vh] rounded-3xl overflow-hidden shadow-xl"
                    >
                        <Image
                            src="/about.png"
                            alt="About Loop Axis "
                            fill
                            className="object-cover object-center"
                        />
                    </motion.div>

                    <div className="flex pt-8 flex-col sm:flex-row justify-center lg:justify-start gap-4">
                       <Link href="/services" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl hover:from-secondary hover:to-primary transition duration-300" > Explore Services </Link> <Link href="/contact" className="inline-block px-8 py-3 rounded-full bg-white text-primary font-semibold shadow-lg hover:shadow-2xl hover:bg-primary hover:text-white transition duration-300" > Contact Us </Link>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-center lg:text-left"
                >
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                        Our Mission
                    </h2>
                    <p className="text-white/70 text-lg md:text-xl mb-6 leading-relaxed">
                        To empower businesses with intelligent automation solutions that
                        save time, reduce errors, and enhance productivity. We aim to
                        simplify complex workflows so teams can focus on growth rather than
                        repetitive tasks.
                    </p>

                    <p className="text-white/60 text-lg md:text-xl mb-6 leading-relaxed">
                        By leveraging cutting-edge technology and seamless integrations,
                        Loop Axis  helps organizations optimize processes, increase
                        efficiency, and achieve measurable results.
                    </p>

                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                        Our Vision
                    </h2>
                    <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-6">
                        To become the most trusted automation platform, enabling companies
                        to scale operations effortlessly. We envision a world where
                        businesses can focus on creativity and strategy while routine work
                        is handled reliably by intelligent systems.
                    </p>

                    <p className="text-white/60 text-lg md:text-xl mb-6 leading-relaxed">
                        We are committed to continuous innovation, providing our clients
                        with solutions that evolve with their needs, ensuring long-term
                        growth and success.
                    </p>

                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                        How We Help
                    </h2>
                    <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-6">
                        From automating repetitive tasks to integrating multiple software
                        tools, Loop Axis  streamlines operations across departments. Our
                        clients report faster turnaround times, fewer errors, and more time
                        to focus on core business goals.
                    </p>

                   <p className="text-white/60 text-lg md:text-xl mb-6"> Explore our <Link href="/services" className="underline text-primary">services</Link> or <Link href="/contact" className="underline text-primary">contact us</Link> to see how Loop Axis  can transform your workflows and boost productivity. </p>
                </motion.div>
            </div>
            <Features />
            <AppIntegrationSlider />
            <NewsletterSection />
        </section>
    )
}
