"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux-store/redux_store"
import axios from "axios"
import Pagination from "@/components/Pagination"
import { admin_get_payment_list_api } from "@/api"
import LoadingSpiner from "../_components/LoadingSpiner"
import Link from "next/link"

type Payment = {
  _id: string
  orderId: string
  paymentId?: string
  user: { name: string; email: string }
  instanceId: { instanceName: string }
  planDetails: { name: string }
  amountDetails: { totalAmount: number }
  currency: string
  status: "pending" | "success" | "failed" | "refunded" | "cancelled"
  createdAt: string
}

type PaymentStats = {
  totalAmount: number
  successfulPayments: number
  failedPayments: number
  pendingPayments: number
  averageAmount: number
}

export default function BillingRequests() {
  const token = useSelector((state: RootState) => state.user.token)
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats>({
    totalAmount: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    averageAmount: 0
  })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Single filter object
  const [filters, setFilters] = useState({
    search: "",
    status: "" as Payment["status"] | "",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: ""
  })

  const [appliedFilters, setAppliedFilters] = useState(filters)

  const fetchPayments = async (pageNum: number = page) => {
    if (!token) return
    try {
      setLoading(true)
      const { data } = await axios.post(
        admin_get_payment_list_api,
        {
          page: pageNum,
          limit: 20,
          ...Object.fromEntries(
            Object.entries(appliedFilters).filter(([_, v]) => v) // only non-empty filters
          )
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setPayments(data.payments || [])
        setTotalPages(data.pagination?.totalPages || 1)
        if (data.statistics) setStats(data.statistics)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch payments whenever page changes or filters applied
  useEffect(() => {
    fetchPayments(page)
  }, [token, page, appliedFilters])

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB")

  if (loading) return <LoadingSpiner />

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-gray-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-6">Billing Requests</h1>

      {/* --- Statistics --- */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-gray-500 text-sm">Total Amount</p>
          <p className="text-lg font-bold">{stats.totalAmount}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-gray-500 text-sm">Successful</p>
          <p className="text-lg font-bold">{stats.successfulPayments}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-gray-500 text-sm">Failed</p>
          <p className="text-lg font-bold">{stats.failedPayments}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-lg font-bold">{stats.pendingPayments}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-gray-500 text-sm">Average Amount</p>
          <p className="text-lg font-bold">{stats.averageAmount}</p>
        </div>
      </div>

      {/* --- Filters --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by Order ID / User"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="p-2 border border-gray-300 rounded col-span-1 md:col-span-2"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as Payment["status"] | "" })}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />

        <input
          type="number"
          placeholder="Min Amount"
          value={filters.amountMin}
          onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={filters.amountMax}
          onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => {
            setAppliedFilters(filters)
            setPage(1)
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
        <button
          onClick={() => {
            window.location.reload()
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset Filter
        </button>
      </div>

      {/* --- Payments List --- */}
      <div className="space-y-2">
        {payments.length === 0 ? (
          <p className="text-center py-12 text-gray-700">No payments found</p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment._id}
              className="p-4 bg-white border rounded flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">Order: #{payment.orderId}</div>
                <div className="text-sm text-gray-600">
                  User: {payment.user.name} | {payment.user.email}
                </div>
                <div className="text-sm text-gray-600">
                  Service: {payment.instanceId.instanceName} | Plan: {payment.planDetails.name}
                </div>
                <div className="text-sm text-gray-600">
                  Amount: {payment.currency} {payment.amountDetails.totalAmount} | Date: {formatDate(payment.createdAt)}
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="text-sm font-semibold capitalize">{payment.status}</div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/billing/viewedit?id=${payment._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    View & Edit
                  </Link>
                  
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
