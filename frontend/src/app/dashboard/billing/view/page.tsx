"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux-store/redux_store"
import axios from "axios"
import { motion } from "framer-motion"
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDownload,
  FiCreditCard,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase
} from "react-icons/fi"
import toast from "react-hot-toast"
import { payment_details_api } from "@/api"
import LoadingSpiner from "@/app/admin/_components/LoadingSpiner"

type PaymentLog = {
  status: "pending" | "success" | "failed" | "refunded" | "cancelled"
  note?: string
  changedAt: string
}

type Payment = {
  _id: string
  orderId: string
  user: {
    name: string
    email: string
    profile?: {
      address?: string
      company?: string
      phoneNumber?: string
    }
  }
  instanceId: {
    instanceName: string
  }
  subscriptionMonths: number
  planDetails: {
    name: string
    duration: number
    price: number
    discountPercentage: number
  }
  amountDetails: {
    baseAmount: number
    discountAmount: number
    taxAmount: number
    totalAmount: number
  }
  currency: "INR" | "USD"
  paymentMethod: "card" | "upi" | "netbanking" | "wallet" | "manual" | "internal"
  period?: {
    startDate?: string
    endDate?: string
  }
  status: "pending" | "success" | "failed" | "refunded" | "cancelled"
  note?: string
  Log?: PaymentLog[]
  createdAt: string
  updatedAt: string
}

export default function PaymentDetailsPage() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("id")
  const token = useSelector((state: RootState) => state.user.token)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!paymentId || !token) return

    async function fetchPayment() {
      try {
        setLoading(true)
        const { data } = await axios.post(
          payment_details_api,
          { paymentId },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (data.success) {
          setPayment(data.payment)
        } else {
          toast.error("Payment not found")
        }
      } catch (err: any) {
        console.error("Error fetching payment:", err)
        toast.error("Failed to load payment details.")
      } finally {
        setLoading(false)
      }
    }

    fetchPayment()
  }, [paymentId, token])

  const formatCurrency = (amount: number, currency: string = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount)

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <FiCheckCircle className="text-green-400" size={22} />
      case "pending":
        return <FiClock className="text-yellow-400" size={22} />
      case "failed":
        return <FiXCircle className="text-red-400" size={22} />
      case "refunded":
        return <FiCreditCard className="text-blue-400" size={22} />
      case "cancelled":
        return <FiXCircle className="text-gray-400" size={22} />
      default:
        return <FiCreditCard className="text-gray-400" size={22} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400 bg-green-400/10"
      case "pending":
        return "text-yellow-400 bg-yellow-400/10"
      case "failed":
        return "text-red-400 bg-red-400/10"
      case "refunded":
        return "text-blue-400 bg-blue-400/10"
      case "cancelled":
        return "text-gray-400 bg-gray-400/10"
      default:
        return "text-gray-400 bg-gray-400/10"
    }
  }

  const handleDownloadInvoice = async () => {
    if (!payment) return
    try {
      const response = await axios.get(`/api/payments/${payment._id}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `invoice-${payment.orderId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch {
      alert("Invoice download feature coming soon!")
    }
  }

  if (loading) {
    return <LoadingSpiner />
  }

  if (!payment) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-400">
        <p>Payment not found</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-10 px-4 text-white"
    >
      <h1 className="text-3xl font-bold mb-6">Payment Details</h1>

      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 space-y-6">
        {/* Status + Order */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Order ID: #{payment.orderId}</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm w-[130px] flex justify-center items-center font-medium ${getStatusColor(
              payment.status
            )}`}
          >
            {getStatusIcon(payment.status)}
            <span className="ml-2 capitalize">{payment.status}</span>
          </span>
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Payment Date</p>
            <p>{formatDate(payment.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Payment Method</p>
            <p className="capitalize">{payment.paymentMethod}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Subscription Start</p>
            <p>{formatDate(payment.period?.startDate)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Subscription End</p>
            <p>{formatDate(payment.period?.endDate)}</p>
          </div>
        </div>

        {/* Instance Info */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Automation Instance</h3>
          <p>{payment.instanceId?.instanceName || "-"}</p>
        </div>

        {/* Plan Details */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Plan Details</h3>
          <div className="grid md:grid-cols-2 gap-2 text-gray-300">
            <p>
              <strong>Plan:</strong> {payment.planDetails.name}
            </p>
            <p>
              <strong>Duration:</strong> {payment.subscriptionMonths} months
            </p>
            <p>
              <strong>Price/Month:</strong>{" "}
              {formatCurrency(payment.planDetails.price, payment.currency)}
            </p>
            {payment.planDetails.discountPercentage > 0 && (
              <p>
                <strong>Discount:</strong>{" "}
                {payment.planDetails.discountPercentage}%
              </p>
            )}
          </div>
        </div>

        {/* Amount Breakdown */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Amount Breakdown</h3>
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Base:</span>
              <span>
                {formatCurrency(payment.amountDetails.baseAmount, payment.currency)}
              </span>
            </div>
            {payment.amountDetails.discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount:</span>
                <span>
                  -{formatCurrency(payment.amountDetails.discountAmount, payment.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>
                +{formatCurrency(payment.amountDetails.taxAmount, payment.currency)}
              </span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-lg text-blue-400">
              <span>Total:</span>
              <span>
                {formatCurrency(payment.amountDetails.totalAmount, payment.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Note */}
        {payment.note && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Admin Note</h3>
            <div className="bg-white/5 rounded-lg p-4 text-gray-300">
              {payment.note}
            </div>
          </div>
        )}

        {/* Log History */}
        {payment.Log && payment.Log.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Status History</h3>
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              {payment.Log.slice().reverse().map((log, index) => (
                <div
                  key={index}
                  className="flex flex-col border-b border-white/10 pb-2 last:border-none"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className="capitalize">{log.status}</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(log.changedAt).toLocaleString("en-IN")}
                    </div>
                  </div>
                  {log.note && (
                    <p className="text-gray-300 italic mt-1 ml-6">“{log.note}”</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Info */}
        <div>
          <h3 className="font-semibold text-lg mb-2">User Information</h3>
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <p className="font-semibold flex items-center gap-2">
              <FiUser /> {payment.user.name}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <FiMail /> {payment.user.email}
            </p>
            {payment.user.profile?.phoneNumber && (
              <p className="flex items-center gap-2 text-gray-300">
                <FiPhone /> {payment.user.profile.phoneNumber}
              </p>
            )}
            {payment.user.profile?.company && (
              <p className="flex items-center gap-2 text-gray-300">
                <FiBriefcase /> {payment.user.profile.company}
              </p>
            )}
            {payment.user.profile?.address && (
              <p className="flex items-center gap-2 text-gray-300">
                <FiMapPin /> {payment.user.profile.address}
              </p>
            )}
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
          >
            <FiDownload size={18} />
            Download Invoice
          </button>
        </div>
      </div>
    </motion.div>
  )
}
