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
  executionCount: number;
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


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "PAUSE":
        return <FiClock className="text-yellow-500" size={20} />;
      default:
        return <FiActivity className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING":
        return "text-green-500 bg-green-500/10";
      case "PAUSE":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  // --- Reusable Card Container Class (Glassmorphism) ---
  const cardClasses = `
    p-5 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]
    
    /* Light Mode Glassmorphism */
    bg-lightBg/80 backdrop-blur-lg border border-textLight/10
    
    /* Dark Mode Glassmorphism */
    dark:bg-darkBg/80 dark:border-textDark/10
    hover:shadow-[0_0_15px_rgba(230,82,31,0.2)] dark:hover:shadow-[0_0_15px_rgba(230,82,31,0.2)]
  `;
  
  const textPrimary = `text-textLight dark:text-textDark`;
  const textSecondary = `text-textLight/70 dark:text-textDark/70`;
  const textFaded = `text-textLight/50 dark:text-textDark/50`;


  if (loading)
    return (
      <LoadingSpiner />
    );

    // Error state Theming
    if(error) return (
      <div className="text-center py-12">
        <FaPager className="mx-auto text-textLight/40 dark:text-textDark/40 mb-4" size={48} />
        <h3 className={`text-xl font-semibold mb-2 ${textPrimary}`}>No Automation found</h3>
        <p className={textSecondary}>Failed to load automations. Please refresh again.</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-28 px-6">
      <h1
        className={`text-3xl font-extrabold mb-8 ${textPrimary}`}
      >
        Your Automations
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {instances.map((inst) => (
          // Framer Motion removed, standard div used with CSS hover effects
          <div
            key={inst._id}
            className={cardClasses}
          >
            <div className="flex items-center justify-between mb-3">
              {/* Instance Name Theming */}
              <h3 className={`text-lg font-bold ${textPrimary}`}>{inst.instanceName}</h3>
              {/* Status Tag (Colors remain consistent) */}
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                  inst.isActive
                )}`}
              >
                {inst.isActive}
              </span>
            </div>

            <div className={`flex items-center gap-2 ${textSecondary} mb-2`}>
              <FiCpu className="text-secondary" />{" "}
              <span className="text-sm">
                Workflow ID: {inst.n8nWorkflowId}
              </span>
            </div>

            <div className={`flex items-center gap-2 ${textSecondary} mb-2`}>
              {getStatusIcon(inst.isActive)}
              <span className="text-sm">
                {inst.isActive === "RUNNING"
                  ? "Instance is live"
                  : "Instance is paused"}
              </span>
            </div>

            <p className={`text-xs mb-4 ${textFaded}`}>
              Created: {new Date(inst.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-6 items-center justify-start">
            
              <Link
                href={`/dashboard/automation-view?id=${inst._id}`}
                // Link Button Theming
                className={`px-4 py-2 rounded-full border text-textLight dark:text-textDark font-semibold transition hover:bg-primary hover:text-white 
                  border-textLight/30 dark:border-textDark/30`}
              >
                Logs Detail
              </Link>

              <div className={`flex items-center gap-2 ${textSecondary} mb-2`}>
                <FiActivity className="text-primary" />{" "}
                <span className="text-sm">
                  Executions: {inst.executionCount}
                </span>
              </div>

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
        // Pagination component should handle its own theming
      />
    </div>
  );
}