"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// Removed: import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiCreditCard,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { payment_details_api } from "@/api";
import LoadingSpiner from "@/app/admin/_components/LoadingSpiner";
import Link from "next/link";
import DownloadInvoice from "@/components/DownloadInvoice"; // Assuming this component is themed internally

// Type definitions remain the same
export type PaymentLog = {
  status: "pending" | "success" | "failed" | "refunded" | "cancelled"
  note?: string
  changedAt: string
}

export type Payment = {
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
    _id: string
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
        return <FiCheckCircle className="text-green-500" size={22} />
      case "pending":
        return <FiClock className="text-yellow-500" size={22} />
      case "failed":
        return <FiXCircle className="text-red-500" size={22} />
      case "refunded":
        return <FiCreditCard className="text-blue-500" size={22} />
      case "cancelled":
        return <FiXCircle className="text-gray-500" size={22} />
      default:
        return <FiCreditCard className="text-gray-500" size={22} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-500 bg-green-500/10"
      case "pending":
        return "text-yellow-500 bg-yellow-500/10"
      case "failed":
        return "text-red-500 bg-red-500/10"
      case "refunded":
        return "text-blue-500 bg-blue-500/10"
      case "cancelled":
        return "text-gray-500 bg-gray-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  // --- Theme Variables ---
  const textPrimary = `text-textLight dark:text-textDark`;
  const textSecondary = `text-textLight/70 dark:text-textDark/70`;
  const textFaded = `text-textLight/50 dark:text-textDark/50`;

  const cardClasses = `
    bg-lightBg/80 backdrop-blur-lg border border-textLight/10
    dark:bg-darkBg/80 dark:border-textDark/10
    shadow-lg space-y-6
  `;
  const subCardClasses = `
    p-4 rounded-lg transition-colors duration-300
    /* Light Mode */
    bg-lightBg/60 border border-textLight/10
    /* Dark Mode */
    dark:bg-darkBg/60 dark:border-textDark/10
  `;
  const logBgClasses = `
    bg-lightBg/50 border-textLight/10
    dark:bg-darkBg/50 dark:border-textDark/10
  `;


  if (loading) {
    return <LoadingSpiner />
  }

  if (!payment) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-textLight dark:text-textDark">
        <p>Payment not found</p>
      </div>
    )
  }

  return (
    <div
      className={`max-w-4xl mx-auto py-10 px-4 ${textPrimary}`}
    >
      <h1 className={`text-3xl font-bold mb-6 ${textPrimary}`}>Payment Details</h1>

      <div className={`p-6 rounded-2xl border ${cardClasses}`}>
        {/* Status + Order */}
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-semibold ${textPrimary}`}>Order ID: #{payment.orderId}</h2>
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
        <div className={`grid md:grid-cols-2 gap-4 ${textPrimary}`}>
          <div>
            <p className={`text-sm mb-1 ${textFaded}`}>Payment Date</p>
            <p>{formatDate(payment.createdAt)}</p>
          </div>
          <div>
            <p className={`text-sm mb-1 ${textFaded}`}>Payment Method</p>
            <p className="capitalize">{payment.paymentMethod}</p>
          </div>
          <div>
            <p className={`text-sm mb-1 ${textFaded}`}>Subscription Start</p>
            <p>{formatDate(payment.period?.startDate)}</p>
          </div>
          <div>
            <p className={`text-sm mb-1 ${textFaded}`}>Subscription End</p>
            <p>{formatDate(payment.period?.endDate)}</p>
          </div>
        </div>

        {/* Instance Info */}
        <div>
          <h3 className={`font-semibold text-lg mb-2 ${textPrimary}`}>Automation Instance</h3>
          <Link className={`hover:underline ${textPrimary}`} href={`/dashboard/automation-view?id=${payment.instanceId?._id}`}>{payment.instanceId?.instanceName || "-"} <span className={`text-sm ${textFaded}`}>({payment.instanceId?._id || "-"})</span></Link>
        </div>

        {/* Plan Details */}
        <div>
          <h3 className={`font-semibold text-lg mb-2 ${textPrimary}`}>Plan Details</h3>
          <div className={`grid md:grid-cols-2 gap-2 ${textSecondary}`}>
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
              <p className="text-green-500">
                <strong>Discount:</strong>{" "}
                {payment.planDetails.discountPercentage}%
              </p>
            )}
          </div>
        </div>

        {/* Amount Breakdown */}
        <div>
          <h3 className={`font-semibold text-lg mb-2 ${textPrimary}`}>Amount Breakdown</h3>
          <div className={`${subCardClasses} space-y-2 ${textSecondary}`}>
            <div className="flex justify-between">
              <span>Base:</span>
              <span>
                {formatCurrency(payment.amountDetails.baseAmount, payment.currency)}
              </span>
            </div>
            {payment.amountDetails.discountAmount > 0 && (
              <div className="flex justify-between text-green-500">
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
            {/* Total Amount Highlight */}
            <div className={`border-t border-textLight/10 dark:border-textDark/10 pt-2 flex justify-between font-semibold text-lg text-secondary`}>
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
            <h3 className={`font-semibold text-lg mb-2 ${textPrimary}`}>Admin Note</h3>
            <div className={`${subCardClasses} p-4 text-textSecondary italic`}>
              {payment.note}
            </div>
          </div>
        )}

        {/* Log History */}
        {payment.Log && payment.Log.length > 0 && (
          <div>
            <h3 className={`font-semibold text-lg mb-2 ${textPrimary}`}>Status History</h3>
            <div className={`${logBgClasses} p-4 space-y-3`}>
              {payment.Log.slice().reverse().map((log, index) => (
                <div
                  key={index}
                  className={`flex flex-col border-b border-textLight/10 dark:border-textDark/10 pb-2 last:border-none ${textSecondary}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className="capitalize">{log.status}</span>
                    </div>
                    <div className={`text-sm ${textFaded}`}>
                      {new Date(log.changedAt).toLocaleString("en-IN")}
                    </div>
                  </div>
                  {log.note && (
                    <p className={`${textSecondary} italic mt-1 ml-6`}>“{log.note}”</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Info */}
        <div>
          <h3 className={`font-semibold text-lg mb-2 ${textPrimary}`}>User Information</h3>
          <div className={`${subCardClasses} p-4 space-y-2 ${textSecondary}`}>
            <p className={`font-semibold flex items-center gap-2 ${textPrimary}`}>
              <FiUser className={textFaded} /> {payment.user.name}
            </p>
            <p className="flex items-center gap-2">
              <FiMail className={textFaded} /> {payment.user.email}
            </p>
            {payment.user.profile?.phoneNumber && (
              <p className="flex items-center gap-2">
                <FiPhone className={textFaded} /> {payment.user.profile.phoneNumber}
              </p>
            )}
            {payment.user.profile?.company && (
              <p className="flex items-center gap-2">
                <FiBriefcase className={textFaded} /> {payment.user.profile.company}
              </p>
            )}
            {payment.user.profile?.address && (
              <p className="flex items-center gap-2">
                <FiMapPin className={textFaded} /> {payment.user.profile.address}
              </p>
            )}
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end gap-4 pt-4">
          <DownloadInvoice payments={payment._id} />
        </div>
      </div>
    </div>
  )
}