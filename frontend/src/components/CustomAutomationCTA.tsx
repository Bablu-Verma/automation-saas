"use client"

import Link from "next/link"
import { FiArrowRight, FiMessageSquare } from "react-icons/fi"

export default function CustomAutomationCTA() {
  return (
    <section className="pt-20 px-4">
      {/* Framer Motion removed. Using standard div with theme-aware classes. */}
      <div
        // ✨ सुधार: थीम-अवेयर glassmorphism स्टाइल
        className="
          py-8 md:py-20 px-4 text-center overflow-hidden rounded-3xl mx-auto max-w-6xl transition-all duration-500
          
          /* Light Mode Glassmorphism */
          bg-lightBg/60 backdrop-blur-md border border-textLight/10 shadow-md
          
          /* Dark Mode Glassmorphism */
          dark:bg-darkBg/60 dark:border-textDark/10
        "
      >
        {/* Icon (Gradient remains for consistency) */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary text-white shadow-lg">
            <FiMessageSquare size={30} />
          </div>
        </div>

        {/* Headline (Text color updated) */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 
          text-textLight dark:text-textDark">
          Need a Custom Automation?
        </h2>

        {/* Description (Text color updated) */}
        <p className="text-lg mb-8 max-w-2xl mx-auto 
          text-textLight/80 dark:text-textDark/80">
          Cant find the exact workflow youre looking for? Our team can build a
          bespoke automation tailored specifically to your business needs.
        </p>

        {/* Button (Framer Motion removed, standard hover effect added) */}
        <Link href="/contact" passHref>
          <div
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full shadow-md text-lg 
              transition duration-300 transform hover:scale-[1.05] hover:shadow-xl"
          >
            Request a Custom Build
            <FiArrowRight className="ml-2" />
          </div>
        </Link>
      </div>
    </section>
  )
}