

import { FiCpu, FiActivity, FiRefreshCw, FiShield, FiDatabase, FiTrendingUp } from "react-icons/fi"

const capabilities = [
  {
    icon: <FiCpu size={26} />,
    title: "Smart Data Mapping",
    desc: "AI automatically detects, matches, and transforms data fields between apps without manual configuration."
  },
  {
    icon: <FiActivity size={26} />,
    title: "Predictive Workflow Routing",
    desc: "Intelligently route tasks based on user behavior, historical data, and contextual signals."
  },
  {
    icon: <FiRefreshCw size={26} />,
    title: "Self-Healing Automation",
    desc: "Detect workflow failures in real-time and automatically retry or correct issues without disruption."
  },
  {
    icon: <FiShield size={26} />,
    title: "Enterprise-Grade Security",
    desc: "End-to-end encryption, secure API handling, and strict access control for enterprise compliance."
  },
  {
    icon: <FiDatabase size={26} />,
    title: "Unified Data Sync",
    desc: "Synchronize customer, sales, and operational data across multiple tools instantly and accurately."
  },
  {
    icon: <FiTrendingUp size={26} />,
    title: "AI Optimization Engine",
    desc: "Continuously analyze workflow performance and suggest improvements for better efficiency."
  },
  
]

export default function AICapabilitiesSection() {
  return (
    <section className="pt-28 px-4 sm:px-6 bg-gradient-to-b from-transparent to-primary/5">

      <div className="max-w-7xl mx-auto text-center">

        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Powered by Intelligent AI
        </h2>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-16">
          taskzeno doesn’t just automate tasks — it learns, optimizes,
          and improves your workflows automatically.
        </p>

        <div className="grid md:grid-cols-2 gap-5 text-left">
          {capabilities.map((item, i) => (
            <div
              key={i}
              className="flex gap-5 p-6 rounded-2xl bg-white dark:bg-neutral-900
              border border-gray-200 dark:border-neutral-800
              hover:shadow-lg transition"
            >
              <div className="text-primary mt-1">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}