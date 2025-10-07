"use client"

import { motion } from "framer-motion"
import { FiCreditCard, FiCheckCircle, FiClock, FiXCircle, FiEye, FiDownload, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase } from "react-icons/fi"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux-store/redux_store"
import axios from "axios"
import { payment_get_api } from "@/api"
import Pagination from "@/components/Pagination"

// Types - Updated according to your API response
type Payment = {
  _id: string
  orderId:string
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

type ApiResponse = {
  success: boolean
  message: string
  payments: Payment[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalPayments: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function BillingRequests() {
  const token = useSelector((state: RootState) => state.user.token)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Fetch payments from API
  useEffect(() => {
    if (!token) return

    async function fetchPayments() {
      try {
        setLoading(true)
        const { data } = await axios.post<ApiResponse>(
          payment_get_api, 
          { page, limit: 12 },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log("API Response:", data)
        
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
        return <FiCheckCircle className="text-green-400" size={22} />
      case "pending":
        return <FiClock className="text-yellow-400" size={22} />
      case "failed":
        return <FiXCircle className="text-red-400" size={22} />
      case "refunded":
        return <FiCheckCircle className="text-blue-400" size={22} />
      default:
        return <FiCreditCard size={22} />
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
      default:
        return "text-gray-400 bg-gray-400/10"
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

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowDetails(true)
  }

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      const response = await axios.get(`/api/payments/${paymentId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${paymentId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Failed to download invoice:", error)
      alert("Invoice download feature will be available soon!")
    }
  }

  // Calculate period dates based on subscription months
  const calculatePeriod = (createdAt: string, subscriptionMonths: number) => {
    const startDate = new Date(createdAt)
    const endDate = new Date(startDate)
    endDate.setMonth(startDate.getMonth() + subscriptionMonths)
    return {
      startDate: formatDate(startDate.toISOString()),
      endDate: formatDate(endDate.toISOString())
    }
  }

  if (loading && payments.length === 0) {
    return (
      <div className="max-w-5xl mx-auto pb-28 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading billing history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-28 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold mb-8"
      >
        Billing History
      </motion.h1>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <FiCreditCard className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">No payments found</h3>
          <p className="text-gray-400">You haven't made any payments yet.</p>
        </div>
      ) : (
        <>
          <div className=" mb-8">
            {payments.map((payment, i) => {
              const period = calculatePeriod(payment.createdAt, payment.subscriptionMonths)
              
              return (
                <motion.div
                  key={payment._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10 hover:shadow-[0_0_20px_rgba(230,82,31,0.4)] transition cursor-pointer"
                  onClick={() => handleViewDetails(payment)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-primary/20">
                        <FiCreditCard className="text-secondary" size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">#{payment.orderId}</h3>
                        <p className="text-sm text-gray-400">{payment.instanceId.instanceName}</p>
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
                    <p className="text-gray-300">
                      Amount: {formatCurrency(payment.amountDetails.totalAmount, payment.currency)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Date: {formatDate(payment.createdAt)}
                    </p>
                   
                    <p className="text-gray-400 text-sm">
                      Plan: {payment.planDetails.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className="text-sm text-gray-300">
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(payment)
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <FiEye className="text-gray-400" size={16} />
                    </button>
                  </div>
                </motion.div>
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

      {/* Payment Details Modal */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Payment Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <FiXCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FiUser className="text-blue-400" />
                  User Information
                </h3>
                <div className="bg-white/5 rounded-lg p-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">{selectedPayment.user.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <FiMail size={14} />
                      {selectedPayment.user.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedPayment.user.profile.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <FiPhone size={14} className="text-gray-400" />
                        <span>{selectedPayment.user.profile.phoneNumber}</span>
                      </div>
                    )}
                    {selectedPayment.user.profile.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <FiBriefcase size={14} className="text-gray-400" />
                        <span>{selectedPayment.user.profile.company}</span>
                      </div>
                    )}
                    {selectedPayment.user.profile.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <FiMapPin size={14} className="text-gray-400" />
                        <span>{selectedPayment.user.profile.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Payment ID</h3>
                  <p className="font-semibold">#{selectedPayment.orderId}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Status</h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Date</h3>
                  <p>{formatDate(selectedPayment.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Payment Method</h3>
                  <p className="capitalize">{selectedPayment.paymentMethod}</p>
                </div>
              </div>

              {/* Service Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Service Details</h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="font-semibold">{selectedPayment.instanceId.instanceName}</p>
                  <p className="text-sm mt-2">
                    Duration: {selectedPayment.subscriptionMonths} month{selectedPayment.subscriptionMonths > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm">
                    Period: {calculatePeriod(selectedPayment.createdAt, selectedPayment.subscriptionMonths).startDate} - {calculatePeriod(selectedPayment.createdAt, selectedPayment.subscriptionMonths).endDate}
                  </p>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Amount Breakdown</h3>
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>{formatCurrency(selectedPayment.amountDetails.baseAmount, selectedPayment.currency)}</span>
                  </div>
                  {selectedPayment.amountDetails.discountAmount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount:</span>
                      <span>-{formatCurrency(selectedPayment.amountDetails.discountAmount, selectedPayment.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (GST):</span>
                    <span>+{formatCurrency(selectedPayment.amountDetails.taxAmount, selectedPayment.currency)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-blue-400">
                      {formatCurrency(selectedPayment.amountDetails.totalAmount, selectedPayment.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Plan Details</h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <p><strong>Plan:</strong> {selectedPayment.planDetails.name}</p>
                  <p><strong>Monthly Price:</strong> {formatCurrency(selectedPayment.planDetails.price, selectedPayment.currency)}</p>
                  {selectedPayment.planDetails.discountPercentage > 0 && (
                    <p><strong>Discount:</strong> {selectedPayment.planDetails.discountPercentage}%</p>
                  )}
                  <p><strong>Duration:</strong> {selectedPayment.planDetails.duration} months</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleDownloadInvoice(selectedPayment._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                >
                  <FiDownload size={18} />
                  Download Invoice
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}