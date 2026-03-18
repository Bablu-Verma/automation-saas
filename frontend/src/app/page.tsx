
import Link from "next/link"


import HomeHero from "@/components/home/Hero_Section"
import Features from "@/components/Features"
import Services from "@/components/Services"
import AppIntegrationSlider from "@/components/IntegratesWith"
import FAQSection from "@/components/home/FAQ_section"
import NewsletterSection from "@/components/Newsletter"
import CustomAutomationCTA from "@/components/CustomAutomationCTA"
import HowItWorks from "@/components/HowItWorks"
import AICapabilitiesSection from "@/components/home/AICapabilitiesSection"
import UseCasesSection from "@/components/home/UseCasesSection"




export default function HomePage() {
  
  return (
    <div className='overflow-hidden'>

      <HomeHero />

      <AICapabilitiesSection />
      <UseCasesSection /> 

      <Services />
      <CustomAutomationCTA />

      <HowItWorks />
      <Features />
      
      <AppIntegrationSlider />

      <FAQSection />

      <ReadyToAutomateCTA />

      <NewsletterSection />
    </div>
  )
}


const ReadyToAutomateCTA = () => {
  return(
  <section className="relative pt-28 px-4 sm:px-6 overflow-hidden">

     
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-20" />

        <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-primary/30 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-secondary/30 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center px-4 py-1.5 rounded-full 
      bg-primary/10 text-primary text-sm font-medium mb-4">
            🚀 100+ Businesses Trust taskzeno
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight 
      text-textLight dark:text-textDark leading-tight">
            Ready to Automate Your Workflow?
          </h2>

  
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto 
      text-textLight/70 dark:text-textDark/70">
            Join growing businesses saving time, reducing manual errors, and scaling
            faster with intelligent automation.
          </p>

    
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

       
            <Link
              href="/services"
              className="
          inline-flex items-center justify-center
          px-8 py-3 rounded-full
          text-white font-semibold
          bg-gradient-to-r from-primary to-secondary
          shadow-lg transition-all duration-300
          hover:shadow-2xl hover:scale-105 hover:brightness-110
        "
            >
              🚀 Start Free Trial
            </Link>

        
            <Link
              href="/contact"
              className="
          inline-flex items-center justify-center
          px-8 py-3 rounded-full
          font-semibold
          border border-primary/30
          text-primary
          transition-all duration-300
          hover:bg-primary hover:text-white hover:shadow-lg
        "
            >
              Talk to Sales
            </Link>

          </div>

          {/* 🔒 Trust Line */}
          <p className="mt-8 text-sm text-textLight/50 dark:text-textDark/50">
            No credit card required • Cancel anytime • 24/7 Support
          </p>

        </div>
      </section>

  )
}



