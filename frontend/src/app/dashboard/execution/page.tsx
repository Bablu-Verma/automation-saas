"use client"

import { motion } from "framer-motion"
import { FiCheckCircle, FiClock, FiXCircle, FiPlayCircle } from "react-icons/fi"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux-store/redux_store"
import axios from "axios"
import Pagination from "@/components/Pagination"
import LoadingSpiner from "@/app/admin/_components/LoadingSpiner"
import { get_user_executions_api } from "@/api"
import { useSearchParams } from "next/navigation"

export default function ExecutionRequests() {
  const token = useSelector((state: RootState) => state.user.token)
  const [executions, setExecutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20 // Items per page

  const searchParams = useSearchParams()
  const serviceId = searchParams.get("id")

  // Fetch executions from API
  useEffect(() => {
    if (!token) return

    async function fetchExecutions() {
      try {
        setLoading(true)
        const { data } = await axios.post(
          get_user_executions_api, // Backend route
          { page, limit, workflowId:serviceId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (data.success) {
          setExecutions(data.executions || [])
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages)
          } else {
            setTotalPages(Math.ceil((data.executions?.length || 0) / limit))
          }
        }
      } catch (err) {
        console.error("Failed to fetch executions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExecutions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <FiCheckCircle className="text-green-400" size={16} />
      case "failed":
        return <FiXCircle className="text-red-400" size={16} />
      case "running":
        return <FiClock className="text-yellow-400" size={16} />
      default:
        return <FiPlayCircle size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400 bg-green-400/10"
      case "failed":
        return "text-red-400 bg-red-400/10"
      case "running":
        return "text-yellow-400 bg-yellow-400/10"
      default:
        return "text-gray-400 bg-gray-400/10"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading && executions.length === 0) {
    return <LoadingSpiner />
  }



  return (
    <div className="max-w-5xl mx-auto pb-28 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold mb-8"
      >
        Executions
      </motion.h1>

      {executions.length === 0 ? (
        <div className="text-center py-12">
          <FiPlayCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">No executions found</h3>
          <p className="text-gray-400">No executions available yet.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {executions.map((exec, i) => (
              <div
                key={exec.id || i}
                className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-white/10 hover:shadow-[0_0_20px_rgba(230,82,31,0.4)] transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="">
                      {getStatusIcon(exec.status)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{exec.instanceName || "Unnamed Service"}</h3>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(exec.status)}`}>
                    {exec.status?.charAt(0).toUpperCase() + exec.status?.slice(1)}
                  </span>
                </div>

                <div className="space-y-2">
                 
                  <p className="text-gray-400 text-xs">
                    Started at: {exec.startedAt ? formatDate(exec.startedAt) : "-"}
                  </p>
                </div>
              </div>
            ))}
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
