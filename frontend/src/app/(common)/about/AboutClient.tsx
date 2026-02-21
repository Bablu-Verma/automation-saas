"use client";

import Features from "@/components/Features"
import AppIntegrationSlider from "@/components/IntegratesWith"
import NewsletterSection from "@/components/Newsletter"
// Framer Motion removed from imports
import Image from "next/image"
import Link from "next/link"


export default function AboutUsClinet() {
    return (
        // Added max-w-7xl mx-auto to the section for standard spacing
        <section className="relative pt-28 max-w-7xl mx-auto transition-colors duration-500">
            {/* Hero (Framer Motion removed) */}
            <div
                className="text-center mb-16 px-4 sm:px-6" // Added px-4 sm:px-6 for padding
            >
                {/* H1 Theming */}
                <h1 className="text-4xl md:text-5xl font-extrabold 
                    text-textLight dark:text-textDark transition-colors duration-500"
                >
                    About taskzeno 
                </h1>
                {/* Paragraph Theming */}
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto
                    text-textLight/80 dark:text-textDark/80 transition-colors duration-500"
                >
                   Taskzeno helps businesses automate repetitive workflows, integrate with hundreds of tools, and scale operations without extra hires.
                </p>
            </div>

            {/* Image + Text */}
            <div className="flex flex-col px-4 md:px-6 lg:flex-row items-start gap-12">
                {/* LEFT STICKY SIDEBAR (Image and Buttons) */}
                {/* Framer Motion removed. Added box styling for visual separation in Light Mode */}
                <div className="w-full lg:w-1/2 lg:sticky lg:top-10 self-start">
                    <div
                        className="relative h-[60vh] rounded-3xl overflow-hidden shadow-xl
                        
                        /* Light Mode Box Styling */
                        bg-lightBg border border-textLight/10
                        
                        /* Dark Mode Box Styling */
                        dark:bg-darkBg dark:border-textDark/10"
                    >
                        <Image
                            src="/about.webp"
                            alt="About taskzeno "
                            fill
                            className="object-cover object-center"
                        />
                    </div>

                    <div className="flex pt-8 flex-row justify-center lg:justify-start gap-4">
                        {/* Primary Button (Gradient) */}
                        <Link href="/services" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300" > Explore Services </Link>
                        
                        {/* Secondary Button (Themed) */}
                        <Link 
                            href="/contact" 
                            className="inline-block px-8 py-3 rounded-full font-semibold shadow-lg transition duration-300 hover:shadow-xl hover:scale-105
                            
                            /* Light Mode Button */
                            bg-lightBg text-primary border border-primary hover:bg-primary hover:text-white
                            
                            /* Dark Mode Button */
                            dark:bg-darkBg dark:text-primary dark:border-primary dark:hover:bg-primary dark:hover:text-white" 
                        > 
                            Contact Us 
                        </Link>
                    </div>
                </div>

                {/* RIGHT CONTENT (Text) */}
                {/* Framer Motion removed */}
                <div
                    className="flex-1 text-left"
                >
                    {/* H2 Theming */}
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-textLight dark:text-textDark">
                        Our Mission
                    </h2>
                    {/* Paragraph Theming (Default opacity) */}
                    <p className="text-lg md:text-xl mb-6 leading-relaxed text-textLight/70 dark:text-textDark/70">
                        To empower businesses with intelligent automation solutions that
                        save time, reduce errors, and enhance productivity. We aim to
                        simplify complex workflows so teams can focus on growth rather than
                        repetitive tasks.
                    </p>

                    {/* Paragraph Theming (Lower opacity) */}
                    <p className="text-lg md:text-xl mb-6 leading-relaxed text-textLight/60 dark:text-textDark/60">
                        By leveraging cutting-edge technology and seamless integrations,
                       Taskzeno helps organizations optimize processes, increase
                        efficiency, and achieve measurable results.
                    </p>

                    {/* H2 Theming */}
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-textLight dark:text-textDark">
                        Our Vision
                    </h2>
                    {/* Paragraph Theming (Default opacity) */}
                    <p className="text-lg md:text-xl leading-relaxed mb-6 text-textLight/70 dark:text-textDark/70">
                        To become the most trusted automation platform, enabling companies
                        to scale operations effortlessly. We envision a world where
                        businesses can focus on creativity and strategy while routine work
                        is handled reliably by intelligent systems.
                    </p>

                    {/* Paragraph Theming (Lower opacity) */}
                    <p className="text-lg md:text-xl mb-6 leading-relaxed text-textLight/60 dark:text-textDark/60">
                        We are committed to continuous innovation, providing our clients
                        with solutions that evolve with their needs, ensuring long-term
                        growth and success.
                    </p>

                    {/* H2 Theming */}
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-textLight dark:text-textDark">
                        How We Help
                    </h2>
                    {/* Paragraph Theming (Default opacity) */}
                    <p className="text-lg md:text-xl leading-relaxed mb-6 text-textLight/70 dark:text-textDark/70">
                        From automating repetitive tasks to integrating multiple software
                        tools,taskzeno streamlines operations across departments. Our
                        clients report faster turnaround times, fewer errors, and more time
                        to focus on core business goals.
                    </p>

                    {/* Footer Links Theming */}
                    <p className="text-lg md:text-xl mb-6 text-textLight/60 dark:text-textDark/60"> Explore our <Link href="/services" className="underline text-primary">services</Link> or <Link href="/contact" className="underline text-primary">contact us</Link> to see how taskzeno can transform your workflows and boost productivity. </p>
                </div>
            </div>
            {/* Child Components (assuming they are already themed) */}
            <Features />
            <AppIntegrationSlider />
            <NewsletterSection />
        </section>
    )
}