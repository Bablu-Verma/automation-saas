"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiClock, FiActivity, FiCpu } from "react-icons/fi";
import axios from "axios";
import { instance_list_api } from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Link from "next/link";

export type AutomationInstance__ = {
  _id: string;
  instanceName: string;
  isActive: "ACTIVE" | "PAUSE";
  executionCount: number;
  systemStatus: string;
  masterWorkflow: string;
  n8nWorkflowId:string;
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
      } catch (err) {
        console.error("Failed to fetch automations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAutomation();
  }, [token, page]);

  console.log(instances)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <FiCheckCircle className="text-green-400" size={20} />;
      case "PAUSE":
        return <FiClock className="text-yellow-400" size={20} />;
      default:
        return <FiActivity className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400 bg-green-400/10";
      case "PAUSE":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  if (loading)
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-t-secondary border-white rounded-full"
        />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-28 text-white px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold mb-8"
      >
        Your Automations
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {instances.map((inst, i) => (
          <motion.div
            key={inst._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              type: "spring",
              stiffness: 300,
            }}
            className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl shadow-lg border border-white/10 hover:shadow-[0_0_20px_rgba(230,82,31,0.4)] transition"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{inst.instanceName}</h3>
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                  inst.isActive
                )}`}
              >
                {inst.isActive}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <FiCpu className="text-secondary" />{" "}
              <span className="text-sm">
                Workflow ID: {inst.n8nWorkflowId}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-300 mb-2">
              {getStatusIcon(inst.isActive)}
              <span className="text-sm">
                {inst.isActive === "ACTIVE"
                  ? "Instance is live"
                  : "Instance is paused"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <FiActivity className="text-blue-400" />{" "}
              <span className="text-sm">
                Executions: {inst.executionCount}
              </span>
            </div>

            <p className="text-gray-400 text-xs mb-4">
              Created: {new Date(inst.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-3">
              <Link
                href={`/services/view?id=${inst.masterWorkflow}`}
                className="px-4 py-2 rounded-full bg-primary text-white font-semibold hover:bg-secondary transition"
              >
                View
              </Link>
              <Link
                href={`/dashboard/request-view?id=${inst._id}`}
                className="px-4 py-2 rounded-full border border-white/30 text-white font-semibold hover:bg-white hover:text-primary transition"
              >
                Logs
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-3 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            page === 1
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-primary hover:bg-secondary"
          }`}
        >
          Prev
        </button>

        <span className="text-gray-300 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            page === totalPages
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-primary hover:bg-secondary"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
