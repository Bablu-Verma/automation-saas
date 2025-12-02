"use client"

import { RootState } from "@/redux-store/redux_store";
import { IUser } from "@/types";
import {
  FiUserPlus,
  FiSettings,
  FiCpu,
  FiTrendingUp,
  FiBarChart2,
  FiLayers,
  FiPlay,
  FiCheckCircle
} from "react-icons/fi"
import { useSelector } from "react-redux";

export default function HowItWorks() {
   const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;

  const loggedIn = Boolean(user)



  // 🟦 Steps for non-logged in users
  const publicSteps = [
    {
      step: "Create Your Account",
      description:
        "Create your account in less than 30 seconds and unlock your automation dashboard instantly.",
      icon: <FiUserPlus size={24} />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "Select or Request a Custom Automation",
      description:
        "Pick from ready-made workflows or request a fully tailored automation designed for your business.",
      icon: <FiSettings size={24} />,
      color: "from-purple-500 to-pink-500",
    },
    {
      step: "Configure & Launch",
      description:
        "Our AI configures, optimizes, and manages your workflows automatically — no manual setup required.",
      icon: <FiCpu size={24} />,
      color: "from-orange-500 to-red-500",
    },
    {
      step: "Scale & Grow Effortlessly",
      description:
        "Let automation handle routine work while you focus on strategy, growth, and delivering real impact.",
      icon: <FiTrendingUp size={24} />,
      color: "from-green-500 to-teal-500",
    },
  ]

  // 🟩 Steps for logged-in users
  const loggedInSteps = [
    {
      step: "Access Your Dashboard",
      description:
        "View all your workflows, analytics, and automation insights in one place.",
      icon: <FiBarChart2 size={24} />,
      color: "from-green-500 to-emerald-500",
    },
    {
      step: "Create or Manage Workflows",
      description:
        "Easily create new automations or optimize your existing ones with our smart builder.",
      icon: <FiLayers size={24} />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      step: "Run & Monitor Automations",
      description:
        "Track performance in real-time and let AI optimize your automation efficiency.",
      icon: <FiPlay size={24} />,
      color: "from-purple-500 to-pink-500",
    },
    {
      step: "Achieve Consistent Growth",
      description:
        "Free up your time and allow automations to deliver continuous results 24/7.",
      icon: <FiCheckCircle size={24} />,
      color: "from-teal-500 to-cyan-500",
    },
  ]

  const steps = loggedIn ? loggedInSteps : publicSteps

  return (
    <section className="pt-32 px-4 sm:px-6 max-w-7xl mx-auto relative">
      <div className="text-center mb-20 transition-colors duration-500">
        <h2 className="text-4xl font-bold text-textLight dark:text-textDark">
          How It Works
        </h2>
        <p className="mt-4 text-lg text-textLight/70 dark:text-textDark/70 max-w-2xl mx-auto">
          {loggedIn
            ? "Your personalized automation workflow journey."
            : "Get started in minutes with a simple automation process."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((item, i) => (
          <div key={i} className="group hover:scale-[1.03] transition-all duration-500">
            <div className="rounded-3xl p-8 shadow-lg bg-lightBg/60 dark:bg-darkBg/60 border border-textLight/10 dark:border-textDark/10 backdrop-blur-xl">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${item.color} text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-6`}>
                {i + 1}
              </div>

              <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center bg-textLight/5 dark:bg-textDark/5 text-textLight dark:text-textDark mb-4">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-center text-textLight dark:text-textDark mb-2">
                {item.step}
              </h3>

              <p className="text-center text-sm text-textLight/70 dark:text-textDark/70">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
