"use client"

import { motion } from "framer-motion"
import {FiMail, FiZap, FiCreditCard } from "react-icons/fi"

export default function DashboardPage() {
  // Example user (API se aayega baad me)
  const user = {
    name: "Aman Sharma",
    email: "aman@example.com",
    automations: [
      {
        name: "Email → Slack Alert",
        executionCount: 124,
        lastExecutedAt: "2025-09-15",
        subscription: { plan: "pro", status: "active" }
      },
      {
        name: "Form → Google Sheet",
        executionCount: 57,
        lastExecutedAt: "2025-09-12",
        subscription: { plan: "free", status: "paused" }
      }
    ],
    
    billingHistory: [
      { invoiceId: "INV-1001", amount: 999, date: "2025-09-01", status: "paid" },
      { invoiceId: "INV-1002", amount: 1999, date: "2025-08-01", status: "paid" }
    ]
  }

  return (
    <div className="max-w-6xl mx-auto text-white space-y-5">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-3xl font-bold shadow-lg">
              {user.name[0]}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold">{user.name}</h1>
              <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
                <FiMail /> {user.email}
              </p>
             
            </div>
          </div>
        </motion.div>

      

        {/* Automations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FiZap /> Automations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {user.automations.map((auto, i) => (
              <div key={i} className="bg-dark/40 rounded-xl p-5 border border-white/10 hover:border-secondary transition">
                <h3 className="font-semibold text-lg">{auto.name}</h3>
                <p className="text-gray-400 text-sm mt-1">Runs: {auto.executionCount}</p>
                <p className="text-gray-400 text-sm">Last run: {auto.lastExecutedAt}</p>
                <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm 
                  ${auto.subscription.plan === "pro" ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"}`}>
                  {auto.subscription.plan.toUpperCase()} · {auto.subscription.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FiCreditCard /> Billing History
          </h2>
          <div className="space-y-4">
            {user.billingHistory.map((bill, i) => (
              <div key={i} className="flex justify-between items-center bg-dark/40 p-4 rounded-lg border border-white/10">
                <div>
                  <p className="font-semibold">Invoice #{bill.invoiceId}</p>
                  <p className="text-gray-400 text-sm">{bill.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">₹{bill.amount}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${bill.status === "paid" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {bill.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
  )
}

