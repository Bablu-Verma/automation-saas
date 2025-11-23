"use client"

import { useEffect, useState } from "react"
// Removed: import { motion } from "framer-motion"
import { FiCheckCircle, FiClock, FiXCircle, FiPlayCircle } from "react-icons/fi"
import { useSelector } from "react-redux"
import { RootState } from "@/redux-store/redux_store"
import axios from "axios"
import Pagination from "@/components/Pagination"
import LoadingSpiner from "@/app/admin/_components/LoadingSpiner"
import { get_user_executions_api } from "@/api"
import { useSearchParams } from "next/navigation"

export type AutomationInstance__ = {
  _id: string;
  instanceName: string;
  isActive: "RUNNING" | "PAUSE";
  executionCount: number;
  systemStatus: string;
  masterWorkflow: string;
  slug: string;
  n8nWorkflowId: string;
  createdAt: string;
  updatedAt: string;
};

export default function ExecutionRequests() {
  const token = useSelector((state: RootState) => state.user.token)
  const [executions, setExecutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20 // Items per page

  const searchParams = useSearchParams()
  const serviceId = searchParams.get("id")

  // Fetch executions from API (logic remains the same)
  useEffect(() => {
    if (!token) return

    async function fetchExecutions() {
      try {
        setLoading(true)
        const { data } = await axios.post(
          get_user_executions_api, // Backend route
          { page, limit, workflowId: serviceId },
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
        return <FiCheckCircle className="text-green-500" size={16} />
      case "failed":
        return <FiXCircle className="text-red-500" size={16} />
      case "running":
        return <FiClock className="text-yellow-500" size={16} />
      default:
        return <FiPlayCircle className="text-primary" size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-500 bg-green-500/10"
      case "failed":
        return "text-red-500 bg-red-500/10"
      case "running":
        return "text-yellow-500 bg-yellow-500/10"
      default:
        return "text-primary/70 bg-primary/10" // Themed default color
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

  // --- Theme Variables ---
  const textPrimary = `text-textLight dark:text-textDark`;
  const textFaded = `text-textLight/50 dark:text-textDark/50`;

  const cardClasses = `
    bg-lightBg/80 backdrop-blur-lg border border-textLight/10
    dark:bg-darkBg/80 dark:border-textDark/10
    hover:shadow-[0_0_20px_rgba(230,82,31,0.2)] transition
  `;


  if (loading && executions.length === 0) {
    return <LoadingSpiner />
  }


  return (
    <div className={`max-w-5xl mx-auto pb-28 px-6`}>
      <h1
        // Removed motion.h1
        className={`text-3xl font-extrabold mb-8 ${textPrimary}`}
      >
        Executions
      </h1>

      {executions.length === 0 ? (
        <div className="text-center py-12">
          <FiPlayCircle className={`mx-auto mb-4 ${textFaded}`} size={48} />
          <h3 className={`text-xl font-semibold mb-2 ${textPrimary}`}>No executions found</h3>
          <p className={textFaded}>No executions available yet.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {executions.map((exec, i) => (
              <div
                key={exec.id || i}
                className={`p-4 rounded-2xl shadow-lg border ${cardClasses}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="">
                      {/* Icon color is handled by getStatusIcon */}
                      {getStatusIcon(exec.status)}
                    </div>
                    <div>
                      {/* H3 Theming */}
                      <h3 className={`text-sm font-semibold ${textPrimary}`}>{exec.instanceName || "Unnamed Service"}</h3>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(exec.status)}`}>
                    {exec.status?.charAt(0).toUpperCase() + exec.status?.slice(1)}
                  </span>
                </div>

                <div className="space-y-2">

                  <p className={`text-xs ${textFaded}`}>
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