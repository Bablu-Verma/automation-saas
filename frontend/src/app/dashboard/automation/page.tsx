"use client";

import { useEffect, useState } from "react";
// Framer Motion removed from imports
import { FiCheckCircle, FiClock, FiActivity, FiCpu } from "react-icons/fi";
import axios from "axios";
import { instance_list_api } from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import LoadingSpiner from "@/app/admin/_components/LoadingSpiner";
import { FaPager } from "react-icons/fa";

// Type definitions remain the same...
export type AutomationInstance__ = {
  _id: string;
  instanceName: string;
  isActive: "RUNNING" | "PAUSE";
  usageCount: number;
  systemStatus: string;
  masterWorkflow: string;
  slug: string;
  n8nWorkflowId: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  automations: AutomationInstance__[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
};

export default function AutomationInstances() {
  const [instances, setInstances] = useState<AutomationInstance__[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(false);

  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (!token) return;
    async function fetchAutomation() {
      try {
        setLoading(true);
        const { data } = await axios.post<ApiResponse>(
          instance_list_api,
          { page, limit: 6 }, // 👈 backend ke pagination params
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInstances(data.automations);
        setTotalPages(data.pagination.totalPages);
        setError(false);
      } catch (err) {
        setError(true);
        console.error("Failed to fetch automations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAutomation();
  }, [token, page]);


  const textPrimary = `text-textLight dark:text-textDark`;
  const textSecondary = `text-textLight/70 dark:text-textDark/70`;
  const textFaded = `text-textLight/50 dark:text-textDark/50`;

  // ✅ Clean Status Icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <FiCheckCircle className="text-green-600" size={16} />;
      case "PAUSE":
        return <FiClock className="text-yellow-600" size={16} />;
      default:
        return <FiActivity className="text-gray-500" size={16} />;
    }
  };

  // ✅ Soft Badge Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING":
        return "text-green-600 bg-green-500/10";
      case "PAUSE":
        return "text-yellow-600 bg-yellow-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  // ✅ Minimal Card Style
  const cardClasses = `
    p-5 rounded-lg
    border border-black/5 dark:border-white/10
    bg-lightBg dark:bg-darkBg
  `;

  if (loading) return <LoadingSpiner />;

  if (error)
    return (
      <div className="text-center py-16">
        <FaPager
          className="mx-auto mb-4 text-textLight/30 dark:text-textDark/30"
          size={40}
        />
        <h3 className={`text-lg font-medium ${textPrimary}`}>
          No Automations Found
        </h3>
        <p className={`mt-2 text-sm ${textSecondary}`}>
          Failed to load automations. Please refresh again.
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-20 px-6">

      {/* Page Title */}
      <h1 className={`text-2xl font-semibold mb-8 ${textPrimary}`}>
        Your Automations
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {instances.map((inst: any) => (
          <div key={inst._id} className={cardClasses}>

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-base font-medium ${textPrimary}`}>
                {inst.instanceName}
              </h3>

              <span
                className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                  inst.isActive
                )}`}
              >
                {inst.isActive}
              </span>
            </div>

            {/* Automation ID */}
            <div className={`flex items-center gap-2 mb-2 ${textSecondary}`}>
              <FiCpu size={14} />
              <span className="text-sm">
                Automation ID: {inst.n8nWorkflowId}
              </span>
            </div>

            {/* Status */}
            <div className={`flex items-center gap-2 mb-2 ${textSecondary}`}>
              {getStatusIcon(inst.isActive)}
              <span className="text-sm">
                {inst.isActive === "RUNNING"
                  ? "Instance is live"
                  : "Instance is paused"}
              </span>
            </div>

            {/* Executions */}
            <div className={`flex items-center gap-2 mb-2 ${textSecondary}`}>
              <FiActivity size={14} />
              <span className="text-sm">
                Executions: {inst.usageCount}
              </span>
            </div>

           <div className="flex justify-between items-center mt-5 gap-5">
             {/* Created Date */}
            <p className={`text-xs ${textFaded}`}>
              Created: {new Date(inst.createdAt).toLocaleDateString()}
            </p>

            {/* View Logs */}
            <Link
              href={`/dashboard/automation-view?id=${inst._id}`}
              className="text-sm text-primary hover:underline inline-block"
            >
              View Logs
            </Link>
           </div>

          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

    </div>
  );
}