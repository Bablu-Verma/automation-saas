"use client"

// Removed: import { motion } from "framer-motion"
import { FiCreditCard, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux-store/redux_store"
import axios from "axios"
import { payment_get_api } from "@/api"
import Pagination from "@/components/Pagination"
import LoadingSpiner from "@/app/admin/_components/LoadingSpiner"
import Link from "next/link"

// Types - Updated according to your API response (remains the same)
type Payment = {
  _id: string
  orderId: string
  user: {
    _id: string
    name: string
    email: string
    profile: {
      address?: string
      company?: string
      phoneNumber?: string
    }
  }
  instanceId: {
    _id: string
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
    subtotal?: number
    taxPercentage?: number
  }
  currency: string
  paymentMethod: string
  status: "pending" | "success" | "failed" | "refunded" | "cancelled"
  createdAt: string
  updatedAt: string
  __v: number
}



export default function BillingRequests() {
  const token = useSelector((state: RootState) => state.user.token)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  // Fetch payments from API (logic remains the same)
  useEffect(() => {
    if (!token) return

    async function fetchPayments() {
      try {
        setLoading(true)
        const { data } = await axios.post(
          payment_get_api,
          { page, limit: 12 },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        // console.log("API Response:", data)

        if (data.success) {
          setPayments(data.payments || [])
          // If pagination data is available from backend
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages)
          } else {
            // Fallback: calculate total pages based on items count
            setTotalPages(Math.ceil((data.payments?.length || 0) / 12))
          }
        }
      } catch (err) {
        console.error("Failed to fetch payments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [token, page])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <FiCheckCircle className="text-green-500" size={22} />
      case "pending":
        return <FiClock className="text-yellow-500" size={22} />
      case "failed":
        return <FiXCircle className="text-red-500" size={22} />
      case "refunded":
        return <FiCheckCircle className="text-blue-500" size={22} />
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
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Payment successful"
      case "pending":
        return "Awaiting payment"
      case "failed":
        return "Payment failed"
      case "refunded":
        return "Amount refunded"
      case "cancelled":
        return "Payment cancelled"
      default:
        return "Payment processing"
    }
  }

  const formatCurrency = (amount: number, currency: string = "INR") => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // --- Theme Variables ---
  const textPrimary = `text-textLight dark:text-textDark`;
  const textSecondary = `text-textLight/80 dark:text-textDark/80`;
  const textFaded = `text-textLight/50 dark:text-textDark/50`;

  const cardClasses = `
    p-6 rounded-2xl shadow-lg transition-all duration-300 transform 
    
    /* Light Mode Glassmorphism */
    bg-lightBg/80 backdrop-blur-lg border border-textLight/10
    
    /* Dark Mode Glassmorphism */
    dark:bg-darkBg/80 dark:border-textDark/10
    hover:shadow-[0_0_20px_rgba(230,82,31,0.2)] 
    
    cursor-pointer
  `;
  const iconBgClasses = 'bg-primary/20';


  if (loading && payments.length === 0) {
    return (
      <LoadingSpiner />
    )
  }

  return (
    <div className={`max-w-5xl mx-auto pb-28 px-6`}>
      <h1
        className={`text-3xl font-extrabold mb-8 ${textPrimary}`}
      >
        Billing History
      </h1>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <FiCreditCard className={`mx-auto mb-4 ${textFaded}`} size={48} />
          <h3 className={`text-xl font-semibold mb-2 ${textPrimary}`}>No payments found</h3>
          <p className={textSecondary}>You haven t made any payments yet.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {payments.map((payment) => {
              return (
                <Link
                  key={payment._id}
                  href={`/dashboard/billing/view?id=${payment._id}`}
                  className={cardClasses} >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${iconBgClasses}`}>
                        <FiCreditCard className="text-secondary" size={22} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${textPrimary}`}>#{payment.orderId}</h3>

                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className={`text-sm ${textFaded}`}>{payment.instanceId.instanceName}</p>
                    <p className={textSecondary}>
                      Amount: {formatCurrency(payment.amountDetails.totalAmount, payment.currency)}
                    </p>
                    <div className="flex justify-between items-end">
                      <p className={`text-sm ${textFaded}`}>
                        Plan: {payment.planDetails.name}
                      </p>
                      <p className={`text-sm ${textFaded}`}>
                        Date: {formatDate(payment.createdAt)}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`text-sm ${textSecondary}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>

                  </div>
                </Link>
              )
            })}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            showPageNumbers={true}
            compact={false}
          />
        </>
      )}
    </div>
  )
}