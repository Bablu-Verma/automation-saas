"use client"

// Framer Motion removed from imports
import {
  FiAward,
  FiBriefcase,
  FiStar,
  FiUsers,
  FiZap
} from "react-icons/fi"

// Placeholder stats data (assuming this was defined elsewhere)
const stats = [
  { icon: <FiAward size={24} />, value: "5+", label: "Industry Awards" },
  { icon: <FiBriefcase size={24} />, value: "300+", label: "Clients Served" },
  { icon: <FiStar size={24} />, value: "4.9/5", label: "Average Rating" },
  { icon: <FiUsers size={24} />, value: "10K+", label: "Users Automated" },
  { icon: <FiZap size={24} />, value: "99.9%", label: "Uptime" },
]

export default function AwardsRecognition() {
  return (
    <section className="pt-28 p-4 sm:px-6 max-w-7xl mx-auto relative ">
      {/* Section Header (Motion removed) */}
      <div className="mb-20">
        
        {/* ✨ सुधार: H2 थीम-अवेयर बनाया गया */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold transition-colors duration-500
          text-textLight dark:text-textDark">
          Awards & Recognition
        </h2>

        {/* ✨ सुधार: Paragraph थीम-अवेयर बनाया गया */}
        <p className="mt-4 max-w-2xl text-lg transition-colors duration-500
          text-textLight/70 dark:text-textDark/70">
          Trusted by hundreds of businesses worldwide, recognized for innovation, reliability, and exceptional client satisfaction.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          // Framer Motion removed, standard div used with CSS hover effects
          <div
            key={i}
            // ✨ सुधार: कार्ड थीम-अवेयर बैकग्राउंड, बॉर्डर और CSS ट्रांज़िशन
            className="flex flex-col items-center shadow-lg hover:shadow-xl transition-all duration-300 transform 
              hover:scale-[1.03]
              
              /* Light Mode Glassmorphism */
              bg-lightBg/60 backdrop-blur-lg border border-textLight/10 rounded-3xl p-6
              
              /* Dark Mode Glassmorphism */
              dark:bg-darkBg/60 dark:border-textDark/10"
          >
            {/* Icon (Gradient box remains bright) */}
            <div className="mb-4 text-white/0 relative">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-tr from-primary to-secondary rounded-full shadow-lg text-white text-2xl">
                {stat.icon}
              </div>
            </div>
            
            {/* Value (H3 Theming) */}
            <h3 className="text-3xl font-bold mt-4 text-textLight dark:text-textDark transition-colors duration-300">
              {stat.value}
            </h3>
            
            {/* Label (Paragraph Theming) */}
            <p className="mt-2 text-textLight/70 dark:text-textDark/70 transition-colors duration-300">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}