"use client"

import {
  FiUserPlus,
  FiSettings,
  FiCloudLightning,
  FiTrendingUp,
  FiArrowDown // Imported FiArrowDown since it was used in the component
} from "react-icons/fi"

export default function HowItWorks() {
  const steps = [
    {
      step: "Sign Up",
      description: "Create your account in 30 seconds. No credit card required to start.",
      icon: <FiUserPlus size={24} />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "Choose Service",
      description: "Select from 50+ pre-built automation templates or create custom ones.",
      icon: <FiSettings size={24} />,
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "We Automate",
      description: "Our AI sets up and manages your workflows 24/7 with real-time monitoring.",
      icon: <FiCloudLightning size={24} />,
      color: "from-orange-500 to-red-500"
    },
    {
      step: "You Grow",
      description: "Focus on strategic work while we handle the repetitive tasks automatically.",
      icon: <FiTrendingUp size={24} />,
      color: "from-green-500 to-teal-500"
    }
  ]

  return (
    <section className="pt-32 px-4 sm:px-6 max-w-7xl mx-auto relative">
      {/* Section Header (Framer Motion removed) */}
      <div
        className="text-center mb-20 transition-colors duration-500"
      >
        {/* ✨ सुधार: टेक्स्ट कलर थीम-अवेयर बनाया गया */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-textLight dark:text-textDark">
          How It Works
        </h2>
        
        {/* ✨ सुधार: टेक्स्ट कलर थीम-अवेयर बनाया गया */}
        <p className="mt-4 text-lg text-textLight/70 dark:text-textDark/70 max-w-2xl mx-auto">
          Get started in minutes and see results from day one. Simple, fast, and powerful automation.
        </p>
      </div>

      {/* Steps Grid with Connecting Lines */}
      <div className="relative">
        {/* Connecting Line for Desktop (Themed for better background contrast) */}
        <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 -z-10"></div>
        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, i) => (
            // Framer Motion removed, standard div used
            <div
              key={i}
              // ✨ सुधार: CSS hover/transition effect added
              className="relative group transition-transform duration-500 transform hover:scale-[1.03] hover:-translate-y-2"
            >
              {/* Step Card */}
              <div 
                // ✨ सुधार: थीम-अवेयर बैकग्राउंड, बॉर्डर और टेक्स्ट
                className="
                  rounded-3xl p-8 shadow-lg transition-all duration-500 h-full flex flex-col
                  
                  /* Light Mode Glassmorphism */
                  bg-lightBg/60 backdrop-blur-xl border border-textLight/10 
                  
                  /* Dark Mode Glassmorphism */
                  dark:bg-darkBg/60 dark:border-textDark/10
                "
              >
                
                {/* Step Number with Gradient (No change needed) */}
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-6 relative`}>
                  {i + 1}
                  {/* Animated Ring (Removed unnecessary animation for motion-free setup) */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/30 opacity-20"></div> 
                </div>

                {/* Icon (Themed background and color) */}
                <div className="mb-4">
                  <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center 
                    bg-textLight/5 dark:bg-textDark/5 
                    text-textLight dark:text-textDark">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                {/* ✨ सुधार: टेक्स्ट कलर थीम-अवेयर बनाया गया */}
                <h3 className="text-xl font-bold text-textLight dark:text-textDark text-center mb-4 ">
                  {item.step}
                </h3>
                
                {/* ✨ सुधार: टेक्स्ट कलर थीम-अवेयर बनाया गया */}
                <p className="text-textLight/70 dark:text-textDark/70 text-center text-sm leading-relaxed flex-grow">
                  {item.description}
                </p>

                {/* Hover Effect Bottom Border (No change needed) */}
                <div className={`mt-6 w-0 group-hover:w-full h-0.5 bg-gradient-to-r ${item.color} transition-all duration-500 mx-auto`}></div>
              </div>

              {/* Connecting Arrow for Mobile */}
              {i < 3 && (
                <>
                  <div className="lg:hidden absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-textLight/30 dark:text-textDark/30">
                    <FiArrowDown size={24} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}