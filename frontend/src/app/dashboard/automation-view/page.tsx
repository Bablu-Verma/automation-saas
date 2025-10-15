"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Image from "next/image";
import { FiCheckCircle, FiClock, FiXCircle, FiActivity, FiUser, FiCalendar, FiCreditCard } from "react-icons/fi";
import { instance_details_api } from "@/api";
import Link from "next/link";
import StatusToggleButton from "./StatusToggleButton";
import { TrialPeriodCircle } from "./TrialPeriodCircle";
import LoadingSpiner from "@/app/admin/_components/LoadingSpiner";

export type AutomationDetail = {
  _id: string;
  instanceName: string;
  isActive: "RUNNING" | "PAUSE";
  executionCount: number;
  systemStatus: string;
  createdAt: string;
  updatedAt: string;
  periods: {
    startTime: string;
    endTime: string;
  };
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
        setAutomation(data.automation);
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
      case "RUNNING":
        return "text-green-400 bg-green-400/10";
      case "PAUSE":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <FiCheckCircle className="text-green-400" size={20} />;
      case "PAUSE":
        return <FiClock className="text-yellow-400" size={20} />;
      default:
        return <FiXCircle className="text-gray-400" size={20} />;
    }
  };

  const getSystemStatusConfig = (status: string) => {
    const config = {
      ACTIVE: { color: "bg-green-500/20 text-green-400 border-green-500/30", description: "✓ Your subscription is active and running smoothly" },
      TRIAL: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", description: "🆓 You're currently in trial period - enjoy all features!" },
      NEED_PAYMENT: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", description: "⚠️ Payment required to continue service" },
      EXPIRE_SOON: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", description: "⏳ Your trial will expire soon - consider upgrading" },
      EXPIRED: { color: "bg-red-500/20 text-red-400 border-red-500/30", description: "❌ Subscription has expired - renew to restore access" },
      CONTACT_SUPPORT: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", description: "📞 Please contact support for assistance" }
    };
    return config[status as keyof typeof config] || config.TRIAL;
  };

  const getProgressLabel = (status: string) => {
    switch (status) {
      case "TRIAL": return "Trial Period Progress";
      case "ACTIVE": return "Subscription Active";
      case "EXPIRE_SOON": return "Expiring Soon";
      case "EXPIRED": return "Subscription Expired";
      default: return "Billing Status";
    }
  };

  if (loading)
    return (
     <LoadingSpiner />
    );

  if (!automation)
    return (
      <div className="h-[50vh] flex items-center justify-center text-red-400">
        Automation not found.
      </div>
    );

  const statusConfig = getSystemStatusConfig(automation.systemStatus);

  return (
    <div className="max-w-4xl mx-auto pb-28 text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/10"
      >


        {automation.masterWorkflow.serviceImage && (
          <div className="pb-5">
            <Image
              height={200}
              width={300}
              src={automation.masterWorkflow.serviceImage}
              alt={automation.masterWorkflow.name}
              className="w-full  h-64 rounded-xl object-cover"
            />
          </div>
        )}


        <div className="flex-1 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold capitalize mb-2">{automation.instanceName}</h1>
              <p className="text-gray-400 text-sm">
                Workflow: {automation.masterWorkflow.name}
              </p>
            </div>
            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(automation.isActive)} self-start`}>
              {automation.isActive}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              {getStatusIcon(automation.isActive)}
              <span>
                {automation.isActive === "RUNNING" ? "Instance is live" : "Instance is paused"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <FiActivity className="text-blue-400 text-lg" />
              <span className="font-medium">
                Executions: <span className="text-white font-semibold">{automation.executionCount}</span>
              </span>
            </div>
          </div>
        </div>


        {/* System Status Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-6">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Status Information */}
            <div className="space-y-4">
              {/* Payment Status */}
              <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg">
                <span className="text-gray-300 text-sm font-medium flex items-center gap-2">
                  <FiCreditCard className="text-blue-400" />
                  Payment Status:
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${statusConfig.color}`}>
                  {automation.systemStatus.toLowerCase().replace('_', ' ')}
                </span>
              </div>

              {/* Status Description */}
              <div className="p-3 bg-gray-900/30 rounded-lg">
                <p className="text-gray-400 text-sm italic">
                  {statusConfig.description}
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <FiCalendar className="text-blue-400" />
                    Created:
                  </span>
                  <span className="text-gray-300">{new Date(automation.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <FiUser className="text-green-400" />
                     Subscribe:
                  </span>
                  <span className="text-gray-300">
                    {automation.periods ? new Date(automation.periods.startTime).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <FiClock className={
                      automation.systemStatus === "EXPIRE_SOON" ? "text-orange-400" :
                        automation.systemStatus === "EXPIRED" ? "text-red-400" : "text-yellow-400"
                    } />
                    Expires:
                  </span>
                  <span className={`font-medium ${automation.systemStatus === "EXPIRE_SOON" ? 'text-orange-400' :
                      automation.systemStatus === "EXPIRED" ? 'text-red-400' : 'text-gray-300'
                    }`}>
                    {automation.periods ? new Date(automation.periods.endTime).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Trial Period Progress */}
            <div className="flex flex-col items-center justify-center">
              <TrialPeriodCircle
                startTime={automation.periods?.startTime}
                endTime={automation.periods?.endTime}
              />
              <p className="text-gray-400 text-sm mt-3 text-center">
                {getProgressLabel(automation.systemStatus)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/automation"
            className="px-6 py-2 rounded-full border border-white/30 text-white font-semibold hover:bg-white hover:text-primary transition flex items-center gap-2"
          >
            ← Back to List
          </Link>

          <StatusToggleButton
            instanceId={automation._id}
            currentStatus={automation.isActive}
            onUpdate={(newStatus) =>
              setAutomation({ ...automation, isActive: newStatus })
            }
          />

          {['NEED_PAYMENT', 'EXPIRED', 'EXPIRE_SOON'].includes(automation.systemStatus) && (
            <Link
              href={`/dashboard/payment?id=${automation._id}`}
              className="px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors duration-300 bg-green-500 hover:bg-green-600 text-white"
            >
              Make Payment
            </Link>
          )}

          {automation.systemStatus === 'CONTACT_SUPPORT' && (
            <Link
              href="/contact"
              className="px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors duration-300 bg-purple-500 hover:bg-purple-600 text-white"
            >
              Contact Support
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}