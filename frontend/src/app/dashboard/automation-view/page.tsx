"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// Removed: import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Image from "next/image";
import { FiCheckCircle, FiClock, FiXCircle, FiActivity, FiUser, FiCalendar, FiCreditCard, FiBookmark, FiZap } from "react-icons/fi";
import { instance_details_api } from "@/api";
import Link from "next/link";
import StatusToggleButton from "./StatusToggleButton";
import { TrialPeriodCircle } from "./TrialPeriodCircle";
import LoadingSpiner from "@/app/admin/_components/LoadingSpiner";
import { FaPager } from "react-icons/fa";

export type AutomationDetail = {
  _id: string;
  instanceName: string;
  isActive: "RUNNING" | "PAUSE";
  usageCount: number;
  trigger: string[],
  systemStatus: string;
  createdAt: string;
  updatedAt: string;
  periods: {
    startTime: string;
    endTime: string;
  };
  selectedPlanDetails?: {
    planName: string;
    monthlyPrice: number;
    payAmount: number;
    validityDays: number;
    usageLimit: number;
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
  lastExecutedAt: Date;
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
        setLoading(true);
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
        return "text-green-500 bg-green-500/10"; // Changed to 500 for consistency
      case "PAUSE":
        return "text-yellow-500 bg-yellow-500/10"; // Changed to 500 for consistency
      default:
        return "text-red-500 bg-red-500/10"; // Used red for general failure/default
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "PAUSE":
        return <FiClock className="text-yellow-500" size={20} />;
      default:
        return <FiXCircle className="text-red-500" size={20} />;
    }
  };

  const getSystemStatusConfig = (status: string) => {
    // Base colors changed from 400 to 500 for consistency
    const config = {
      ACTIVE: { color: "bg-green-500/20 text-green-500 border-green-500/30", description: "✓ Your subscription is active and running smoothly" },
      TRIAL: { color: "bg-blue-500/20 text-blue-500 border-blue-500/30", description: "🆓 You're currently in trial period - enjoy all features!" },
      NEED_PAYMENT: { color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30", description: "⚠️ Payment required to continue service" },
      EXPIRE_SOON: { color: "bg-orange-500/20 text-orange-500 border-orange-500/30", description: "⏳ Your trial will expire soon - consider upgrading" },
      EXPIRED: { color: "bg-red-500/20 text-red-500 border-red-500/30", description: "❌ Subscription has expired - renew to restore access" },
      CONTACT_SUPPORT: { color: "bg-purple-500/20 text-purple-500 border-purple-500/30", description: "📞 Please contact support for assistance" }
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

  // --- Theme Variables ---
  const textPrimary = `text-textLight dark:text-textDark`;
  const textSecondary = `text-textLight/70 dark:text-textDark/70`;
  const textFaded = `text-textLight/50 dark:text-textDark/50`;
  const textInfoPrimary = `text-textLight dark:text-textDark`; // Boldest info text

  const cardClasses = `
    rounded-2xl p-6 shadow-lg transition-colors duration-500
    
    /* Light Mode Glassmorphism */
    bg-lightBg/80 backdrop-blur-lg border border-textLight/10
    
    /* Dark Mode Glassmorphism */
    dark:bg-darkBg/80 dark:border-textDark/10
  `;
  const subCardClasses = `
    p-3 rounded-xl transition-colors duration-300
    /* Light Mode */
    bg-lightBg/60 border border-textLight/10
    /* Dark Mode */
    dark:bg-darkBg/60 dark:border-textDark/10
  `;


  if (loading)
    return (
      <LoadingSpiner />
    );

  if (!automation)
    return (
      <div className="text-center py-12">
        <FaPager className={`mx-auto mb-4 ${textFaded}`} size={48} />
        <h3 className={`text-xl font-semibold mb-2 ${textPrimary}`}>No Automation found</h3>
        <p className={textSecondary}>Create Some error plese Refrash Again.</p>
      </div>
    );

  const statusConfig = getSystemStatusConfig(automation.systemStatus);

  // console.log(automation)

  return (
    <div className="max-w-4xl mx-auto pb-28 px-6">
      {/* Main Card (Motion removed) */}
      <div
        className={cardClasses}
      >


        {automation.masterWorkflow.serviceImage && (
          <div className="pb-5">
            <Image
              height={200}
              width={300}
              src={automation.masterWorkflow.serviceImage}
              alt={automation.masterWorkflow.name}
              className="w-full h-64 rounded-xl object-cover"
            />
          </div>
        )}


        <div className="flex-1 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className={`text-2xl font-bold capitalize mb-2 ${textPrimary}`}>{automation.instanceName}</h1>
              <p className={`text-sm ${textFaded}`}>
                Service: {automation.masterWorkflow.name}
              </p>
            </div>
            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(automation.isActive)} self-start`}>
              {automation.isActive}
            </span>
          </div>

          <div className="space-y-3">
            <div className={`flex items-center gap-3 ${textSecondary}`}>
              {getStatusIcon(automation.isActive)}
              <span>
                {automation.isActive === "RUNNING" ? "Instance is live" : "Instance is paused"}
              </span>
            </div>

            <div className={`flex items-center gap-3 ${textSecondary}`}>
              <FiActivity className="text-primary text-lg" />
              <span className="font-medium">
                Executions: <span className={`${textInfoPrimary} font-semibold pr-8`}>{automation.usageCount}</span>  Last Execution: <span className={`${textInfoPrimary} font-semibold`}>{new Date(automation.lastExecutedAt).toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>

        {automation.selectedPlanDetails && (
  <div className="mb-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
      <h2 className={`text-xl font-bold ${textPrimary}`}>Subscription Plan</h2>

      <span className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full font-semibold">
        {automation.selectedPlanDetails.planName}
      </span>
    </div>

    <div className="space-y-2 text-sm">
      <div className={`flex items-center gap-2 ${textSecondary}`}>
        <FiBookmark className="text-primary text-lg" />
        <span className="font-medium">
          Pay Amount:{" "}
          <span className={`${textInfoPrimary} font-semibold`}>
            ₹{automation.selectedPlanDetails.payAmount}/month
          </span>
        </span>
      </div>

      <div className={`flex items-center gap-3 ${textSecondary}`}>
        <FiClock className="text-primary text-lg" />
        <span className="font-medium">
          Validity:{" "}
          <span className={`${textInfoPrimary} font-semibold`}>
            {automation.selectedPlanDetails.validityDays} days
          </span>
        </span>
      </div>

      <div className={`flex items-center gap-3 ${textSecondary}`}>
        <FiZap className="text-primary text-lg" />
        <span className="font-medium">
          Usage Limit:{" "}
          <span className={`${textInfoPrimary} font-semibold`}>
            {automation.selectedPlanDetails.usageLimit} executions
          </span>
        </span>
      </div>
    </div>
  </div>
)}



        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className={`text-sm font-semibold ${textPrimary} mr-2`}>Triggers:</span>
          {automation.trigger && automation.trigger.length > 0 ? (
            automation.trigger.map((trigger, index) => {


              return (
                <span
                  key={index}
                  // Themed trigger tags (using primary brand color)
                  className="px-3 py-1 text-xs tracking-wider font-medium capitalize rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm"
                >
                  {trigger}
                </span>
              )
            })
          ) : (
            <span className={`text-sm italic ${textFaded}`}>No triggers configured</span>
          )}
        </div>

        {/* System Status Section */}
        <div className={`${subCardClasses} mb-6`}>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Status Information */}
            <div className="space-y-4">
              {/* Payment Status Card */}
              <div className={`flex items-center justify-between p-3 rounded-lg ${subCardClasses}`}>
                <span className={`text-sm font-medium flex items-center gap-2 ${textSecondary}`}>
                  <FiCreditCard className="text-secondary" />
                  Payment Status:
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${statusConfig.color}`}>
                  {automation.systemStatus.toLowerCase().replace('_', ' ')}
                </span>
              </div>

              {/* Status Description Card */}
              <div className={`p-3 rounded-lg ${subCardClasses}`}>
                <p className={`text-sm italic ${textFaded}`}>
                  {statusConfig.description}
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-3 text-sm">
                {/* Created At */}
                <div className={`flex items-center justify-between ${textSecondary}`}>
                  <span className="flex items-center gap-2">
                    <FiCalendar className="text-secondary" />
                    Created:
                  </span>
                  <span className={textPrimary}>{new Date(automation.createdAt).toLocaleString()}</span>
                </div>
                {/* Subscription Start */}
                <div className={`flex items-center justify-between ${textSecondary}`}>
                  <span className="flex items-center gap-2">
                    <FiUser className="text-secondary" />
                    Subscribe:
                  </span>
                  <span className={textPrimary}>
                    {automation.periods ? new Date(automation.periods.startTime).toLocaleString() : 'N/A'}
                  </span>
                </div>
                {/* Expiration */}
                <div className={`flex items-center justify-between ${textSecondary}`}>
                  <span className="flex items-center gap-2">
                    <FiClock className={
                      automation.systemStatus === "EXPIRE_SOON" ? "text-orange-500" :
                        automation.systemStatus === "EXPIRED" ? "text-red-500" : "text-secondary"
                    } />
                    Expires:
                  </span>
                  <span className={`font-medium ${automation.systemStatus === "EXPIRE_SOON" ? 'text-orange-500' :
                      automation.systemStatus === "EXPIRED" ? 'text-red-500' : textPrimary
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
              <p className={`text-sm mt-3 text-center ${textFaded}`}>
                {getProgressLabel(automation.systemStatus)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href={`/dashboard/execution?id=${automation._id}`}
            // Themed Button
            className={`px-6 py-2 rounded-full border ${textPrimary} font-semibold transition hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary flex items-center gap-2
            border-textLight/30 dark:border-textDark/30`}
          >
            ← Execution
          </Link>

          <StatusToggleButton
            instanceId={automation._id}
            currentStatus={automation.isActive}
            onUpdate={(newStatus) =>
              setAutomation({ ...automation, isActive: newStatus })
            }
          />

          {/* Payment Button (Green) */}
          {['NEED_PAYMENT', 'EXPIRED', 'EXPIRE_SOON'].includes(automation.systemStatus) && (
            <Link
              href={`/dashboard/payment?id=${automation._id}`}
              className="px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors duration-300 bg-primary hover:bg-secondary text-white shadow-md"
            >
              Make Payment
            </Link>
          )}

          {/* Contact Support Button (Purple) */}
          {automation.systemStatus === 'CONTACT_SUPPORT' && (
            <Link
              href="/contact"
              className="px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors duration-300 bg-purple-500 hover:bg-purple-600 text-white shadow-md"
            >
              Contact Support
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}