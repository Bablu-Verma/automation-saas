
import Link from "next/link"


import HomeHero from "@/components/home/Hero_Section"
import Features from "@/components/Features"
import Services from "@/components/Services"
import AppIntegrationSlider from "@/components/IntegratesWith"
import Testimonials from "@/components/Testimonial_Section"
import FAQSection from "@/components/home/FAQ_section"
import NewsletterSection from "@/components/Newsletter"
import CustomAutomationCTA from "@/components/CustomAutomationCTA"
import HowItWorks from "@/components/HowItWorks"
import AwardsRecognition from "@/components/AwardsRecognition"



export default function HomePage() {
  return (
    <div className='overflow-hidden'>
 
      <HomeHero />
      <Features />

      <Services />
      <CustomAutomationCTA />

      <HowItWorks />

      <AppIntegrationSlider />

      <AwardsRecognition />

      <Testimonials />

      <FAQSection />

      <section className="relative pt-28 px-4 sm:px-6 text-center transition-colors duration-500">
      
      {/* Background Glow Effects (Kept as is, using brand colors) */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-gradient-to-tr from-primary/40 to-secondary/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gradient-to-tr from-secondary/40 to-primary/30 rounded-full blur-3xl -z-10"></div>


      {/* H2 Heading (Framer Motion removed) */}
      <h2
        // ✨ सुधार: टेक्स्ट कलर थीम-अवेयर बनाया गया
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight 
          text-textLight dark:text-textDark"
      >
        Ready to Automate?
      </h2>

      {/* Paragraph (Framer Motion removed) */}
      <p
        // ✨ सुधार: टेक्स्ट कलर थीम-अवेयर बनाया गया
        className="mt-4 text-lg md:text-xl max-w-2xl mx-auto 
          text-textLight/70 dark:text-textDark/70"
      >
        Join 100+ businesses saving time, reducing errors, and growing faster with taskzeno.
      </p>

      {/* Button Container (Framer Motion removed) */}
      <div
        className="mt-8 transition-transform duration-300"
      >
        <Link
          href="/services"
          // Button Styling (Using existing brand gradient)
          className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg 
            transition duration-300 
            hover:shadow-2xl hover:scale-105 hover:brightness-110"
        >
          🚀 Start Free Trial
        </Link>
      </div>

    </section>


      <NewsletterSection />
    </div>
  )
}



