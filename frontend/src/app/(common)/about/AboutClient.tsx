"use client";

import Features from "@/components/Features"
import AppIntegrationSlider from "@/components/IntegratesWith"
import NewsletterSection from "@/components/Newsletter"
import SubHero from "@/components/SubHero";
import Lottie from "lottie-react";
// Framer Motion removed from imports
import Image from "next/image"
import Link from "next/link"
import animation from "@/lottie/contact-us.json"
import { FiCheckCircle, FiShield, FiTrendingUp, FiUsers } from "react-icons/fi";
import Testimonials from "@/components/Testimonial_Section";

export default function AboutUsClinet() {
    return (
        // Added max-w-7xl mx-auto to the section for standard spacing
        <section className="relative pt-28 max-w-7xl mx-auto transition-colors duration-500">
            {/* Hero (Framer Motion removed) */}
            <SubHero title="About taskzeno" description="Taskzeno helps businesses automate repetitive workflows, integrate with hundreds of tools, and scale operations without extra hires." />
           

            {/* Image + Text */}
            <div className="flex flex-col px-4 md:px-6 lg:flex-row items-start gap-12">
                {/* LEFT STICKY SIDEBAR (Image and Buttons) */}
                {/* Framer Motion removed. Added box styling for visual separation in Light Mode */}
                <div className="w-full lg:w-[40%] lg:sticky lg:top-10 self-start">
                    <div
                        className="relative  overflow-hidden "
                    >
                        {/* <Image
                            src="/about.webp"
                            alt="About taskzeno "
                            fill
                            className="object-cover object-center"
                        /> */}
                        <Lottie
                            animationData={animation}
                            loop={false}
                            autoplay
                            className="w-full h-full"
                            style={{ width: "100%", height: "100%" }}
                            rendererSettings={{
                              preserveAspectRatio: "xMidYMid slice"
                            }}
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

                
               <div className="flex-1 text-left w-full lg:w-[60%] space-y-10">

  {/* Trust Stats */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
    <div>
      <h3 className="text-3xl font-bold text-primary">30+</h3>
      <p className="text-sm text-textLight/60 dark:text-textDark/60">Workflows Automated</p>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-primary">10+</h3>
      <p className="text-sm text-textLight/60 dark:text-textDark/60">Happy Clients</p>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-primary">99%</h3>
      <p className="text-sm text-textLight/60 dark:text-textDark/60">Accuracy Rate</p>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-primary">24/7</h3>
      <p className="text-sm text-textLight/60 dark:text-textDark/60">Support</p>
    </div>
  </div>

  {/* Our Mission */}
  <div>
    <h2 className="text-2xl font-bold mb-4 text-textLight dark:text-textDark">
      Our Mission
    </h2>
    <p className="text-lg leading-relaxed text-textLight/70 dark:text-textDark/70">
      To empower businesses with intelligent automation solutions that save time,
      reduce errors, and enhance productivity. We simplify complex workflows
      so teams can focus on strategic growth.
    </p>
  </div>

  {/* Vision Section */}
<div >

  <h2 className="text-2xl font-bold mb-4 text-textLight dark:text-textDark">
    Our Vision
  </h2>

  <p className="text-lg leading-relaxed text-textLight/70 dark:text-textDark/70">
    To become the most trusted automation platform enabling companies
    to scale effortlessly while intelligent systems handle routine
    operations. We envision a future where businesses innovate freely,
    powered by seamless workflow automation.
  </p>

</div>


{/* How We Help Section */}
<div className="">
  <h2 className="text-2xl font-bold mb-4 text-textLight dark:text-textDark">
    How We Help
  </h2>

  <div className="grid gap-8 md:grid-cols-2">

    <div className="flex gap-4">
      <FiTrendingUp className="text-primary text-xl mt-1" />
      <div>
        <h3 className="font-medium text-lg 
          text-textLight dark:text-textDark">
          Increase Efficiency
        </h3>
        <p className="text-sm text-textLight/70 dark:text-textDark/70">
          Automate repetitive tasks to boost productivity and eliminate bottlenecks.
        </p>
      </div>
    </div>

    <div className="flex gap-4">
      <FiCheckCircle className="text-primary text-xl mt-1" />
      <div>
        <h3 className="font-medium text-lg 
          text-textLight dark:text-textDark">
          Reduce Errors
        </h3>
        <p className="text-sm text-textLight/70 dark:text-textDark/70">
          Intelligent automation minimizes human errors and ensures accuracy.
        </p>
      </div>
    </div>

    <div className="flex gap-4">
      <FiUsers className="text-primary text-xl mt-1" />
      <div>
        <h3 className="font-medium text-lg 
          text-textLight dark:text-textDark">
          Seamless Integrations
        </h3>
        <p className="text-sm text-textLight/70 dark:text-textDark/70">
          Connect multiple tools and departments for smooth collaboration.
        </p>
      </div>
    </div>

    <div className="flex gap-4">
      <FiShield className="text-primary text-xl mt-1" />
      <div>
        <h3 className="font-medium text-lg 
          text-textLight dark:text-textDark">
          Secure & Reliable
        </h3>
        <p className="text-sm text-textLight/70 dark:text-textDark/70">
          Enterprise-level security ensures your data stays protected.
        </p>
      </div>
    </div>

  </div>
</div>

  {/* Trust Guarantee Box */}
  <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
    <h3 className="text-lg font-semibold text-primary mb-2">
      Our Commitment to You
    </h3>
    <p className="text-textLight/70 dark:text-textDark/70">
      We are committed to delivering reliable, scalable, and secure automation
      solutions tailored to your business needs. Your growth is our priority.
    </p>
  </div>

  {/* CTA */}
  <p className="text-lg text-textLight/60 dark:text-textDark/60">
    Explore our{" "}
    <Link href="/services" className="underline text-primary font-medium">
      services
    </Link>{" "}
    or{" "}
    <Link href="/contact" className="underline text-primary font-medium">
      contact us
    </Link>{" "}
    to see how Taskzeno can transform your workflows.
  </p>

</div>
            </div>

          
           
            <Features />
            <AppIntegrationSlider />
              <Testimonials />
            <NewsletterSection />
        </section>
    )
}