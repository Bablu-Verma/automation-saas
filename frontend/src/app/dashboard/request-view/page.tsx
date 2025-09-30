"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Image from "next/image";
import { FiCheckCircle, FiClock, FiXCircle, FiActivity } from "react-icons/fi";
import { instance_details_api } from "@/api";
import Link from "next/link";
import StatusToggleButton from "./StatusToggleButton";

export type AutomationDetail = {
  _id: string;
  instanceName: string;
  isActive: "ACTIVE" | "PAUSE";
  executionCount: number;
  systemStatus: string;
  createdAt: string;
  updatedAt: string;
  masterWorkflow: {
    _id: string;
    name: string;
    serviceImage?: string;
    category: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  n8nWorkflowId: string;
};

export default function AutomationDetailPage() {
  const searchParams = useSearchParams();
  const instanceId = searchParams.get("id");

  const [automation, setAutomation] = useState<AutomationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (!instanceId || !token) return;

    async function fetchAutomation() {
      try {
        const { data } = await axios.post(
          instance_details_api,
          { id: instanceId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // console.log(data);
        setAutomation(data.automation); // backend response has { automation }
      } catch (err) {
        console.error("Failed to fetch automation detail:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAutomation();
  }, [instanceId, token]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <FiCheckCircle className="text-green-400" size={20} />;
      case "PAUSE":
        return <FiClock className="text-yellow-400" size={20} />;
      default:
        return <FiXCircle className="text-gray-400" size={20} />;
    }
  };

  if (loading)
    return (
      <div className="h-[50vh] flex items-center justify-center text-white">
        Loading automation details...
      </div>
    );

  if (!automation)
    return (
      <div className="h-[50vh] flex items-center justify-center text-red-400">
        Automation not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-28 text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/10"
      >
        {automation.masterWorkflow.serviceImage && (
          <Image
            height={250}
            width={500}
            src={automation.masterWorkflow.serviceImage}
            alt={automation.masterWorkflow.name}
            className="w-full h-64 rounded-xl object-cover mb-4"
          />
        )}

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{automation.instanceName}</h1>
          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(
              automation.isActive
            )}`}
          >
            {automation.isActive}
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-2">
          Workflow: {automation.masterWorkflow.name} | Category: {automation.masterWorkflow.category}
        </p>

        <div className="flex items-center gap-3 mb-2 text-gray-300">
          {getStatusIcon(automation.isActive)}
          <span>
            {automation.isActive === "ACTIVE" ? "Instance is live" : "Instance is paused"}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-2 text-gray-300">
          <FiActivity className="text-blue-400" />
          <span>Executions: {automation.executionCount}</span>
        </div>

        {/* <p className="text-gray-400 text-xs mb-2">
          System Status: {automation.systemStatus}
        </p> */}
        <p className="text-gray-400 text-xs mb-4">
          Created: {new Date(automation.createdAt).toLocaleString()} | Updated:{" "}
          {new Date(automation.updatedAt).toLocaleString()}
        </p>

        <div className="mb-4">
          <h3 className="font-bold mb-2">User</h3>
          <p className="text-gray-300">{automation.user.name} ({automation.user.email})</p>
        </div>

        <div className="mt-6 flex gap-3">
        
          <Link
            href="/dashboard/requests"
            className="px-4 py-2 rounded-full border border-white/30 text-white font-semibold hover:bg-white hover:text-primary transition"
          >
            Back to List
          </Link>
            <StatusToggleButton
            instanceId={automation._id}
            currentStatus={automation.isActive}
            onUpdate={(newStatus) => setAutomation({ ...automation, isActive: newStatus })}
          />
        </div>
      </motion.div>
    </div>
  );
}
