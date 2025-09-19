"use client"

import { motion } from "framer-motion"
import { FiCreditCard, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi"

const billingHistory = [
  { id: "inv_1", amount: 1200, date: "2025-09-01", status: "Paid" },
  { id: "inv_2", amount: 800, date: "2025-08-15", status: "Pending" },
  { id: "inv_3", amount: 1500, date: "2025-07-20", status: "Failed" },
  { id: "inv_1", amount: 1200, date: "2025-09-01", status: "Paid" },
  { id: "inv_2", amount: 800, date: "2025-08-15", status: "Pending" },
  { id: "inv_3", amount: 1500, date: "2025-07-20", status: "Failed" },
  { id: "inv_2", amount: 800, date: "2025-08-15", status: "Pending" },
  { id: "inv_3", amount: 1500, date: "2025-07-20", status: "Failed" },
  { id: "inv_1", amount: 1200, date: "2025-09-01", status: "Paid" },
  { id: "inv_3", amount: 1500, date: "2025-07-20", status: "Failed" }, 
  { id: "inv_1", amount: 1200, date: "2025-09-01", status: "Paid" },
  { id: "inv_2", amount: 800, date: "2025-08-15", status: "Pending" },
  { id: "inv_2", amount: 800, date: "2025-08-15", status: "Pending" },
  { id: "inv_3", amount: 1500, date: "2025-07-20", status: "Failed" },
  { id: "inv_1", amount: 1200, date: "2025-09-01", status: "Paid" },
  { id: "inv_2", amount: 800, date: "2025-08-15", status: "Pending" },
  { id: "inv_3", amount: 1500, date: "2025-07-20", status: "Failed" }, 
  { id: "inv_1", amount: 1200, date: "2025-09-01", status: "Paid" },
  { id: "inv_2", amount: 800, date: "2025-08-15", status: "Pending" },
  { id: "inv_3", amount: 1500, date: "2025-07-20", status: "Failed" },

]

export default function BillingRequests() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <FiCheckCircle className="text-green-400" size={22} />
      case "Pending":
        return <FiClock className="text-yellow-400" size={22} />
      case "Failed":
        return <FiXCircle className="text-red-400" size={22} />
      default:
        return <FiCreditCard size={22} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-400 bg-green-400/10"
      case "Pending":
        return "text-yellow-400 bg-yellow-400/10"
      case "Failed":
        return "text-red-400 bg-red-400/10"
      default:
        return "text-gray-400 bg-gray-400/10"
    }
  }

  return (
    <div className="max-w-5xl mx-auto  pb-28 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold mb-8"
      >
        Billing History
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {billingHistory.map((bill, i) => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10 hover:shadow-[0_0_20px_rgba(230,82,31,0.4)] transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/20">
                  <FiCreditCard className="text-secondary" size={22} />
                </div>
                <h3 className="text-lg font-bold">#{bill.id}</h3>
              </div>
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                  bill.status
                )}`}
              >
                {bill.status}
              </span>
            </div>
            <p className="text-gray-300">Amount: ₹{bill.amount}</p>
            <p className="text-gray-400 text-sm">Date: {bill.date}</p>
            <div className="mt-4 flex items-center gap-2">
              {getStatusIcon(bill.status)}
              <span className="text-sm text-gray-300">
                {bill.status === "Paid"
                  ? "Payment successful"
                  : bill.status === "Pending"
                  ? "Awaiting payment"
                  : "Payment failed"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
