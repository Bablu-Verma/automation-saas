"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "@/redux-store/redux_store";
import { IUser, } from "@/types";
// Framer Motion removed from imports
import { FiMail, FiZap, FiCreditCard, FiTrendingUp, FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import { get_user_dashboard_api } from "@/api";
import Loading_ from "@/components/Loading";
import { FaFlipboard, FaRobot } from "react-icons/fa";

// Interface definitions remain the same...
interface PlanDetails {
  name?: string;
  duration?: number;
}
interface AmountDetails {
  totalAmount: number;
}
interface Automation {
  instanceName: string;
  systemStatus: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  periods?: {
    endTime?: string;
    startTime?: string;
  };
}
interface Payment {
  orderId: string;
  status: string;
  planDetails?: PlanDetails;
  amountDetails?: AmountDetails;
  currency: string;
  paymentMethod: string;
  instanceId?: {
    instanceName: string;
  };
}
interface DashboardData {
  latestPayments?: Payment[];
  latestAutomations?: Automation[];
}
// End of interfaces


export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.user.user) as IUser | null;
  const token = useSelector((state: RootState) => state.user.token)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data } = await axios.post(
          get_user_dashboard_api,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setDashboardData(data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load dashboard.");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, token]);

  if (loading) return <Loading_ />

  // Error state Theming
  if (error) return (
    <div className="text-center py-12">
      <FaFlipboard className="mx-auto text-textLight/40 dark:text-textDark/40 mb-4" size={48} />
      <h3 className="text-xl font-semibold mb-2 text-textLight dark:text-textDark">No Data found</h3>
      <p className="text-textLight/60 dark:text-textDark/60">{error}</p>
      <p className="text-textLight/60 dark:text-textDark/60">Create Some error plese Refrash Again.</p>
    </div>
  )

  const cardClasses = `
    p-8 rounded-2xl shadow-md transition-all duration-500
    bg-lightBg/80 backdrop-blur-md border border-textLight/10
    dark:bg-darkBg/80 dark:border-textDark/10
  `;

  const subCardClasses = `
    p-6 rounded-xl transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-md
    bg-lightBg/50 border border-textLight/10
    dark:bg-darkBg/50 dark:border-textDark/10
  `;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Profile Header (Framer Motion removed) */}
      <div
        className={cardClasses}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-3xl font-bold text-white shadow-lg">
            {user?.name?.[0]}
          </div>
          <div className="flex-1 text-center md:text-left">
            {/* H1 Theming */}
            <h1 className="text-3xl font-extrabold text-textLight dark:text-textDark">{user?.name}</h1>
            {/* Email Theming */}
            <p className="flex items-center justify-center md:justify-start gap-2 text-textLight/70 dark:text-textDark/70">
              <FiMail className="text-textLight/70 dark:text-textDark/70" /> {user?.email}
            </p>
            {/* Profile Info Theming */}
            {user?.profile && (
              <p className="text-sm text-textLight/60 dark:text-textDark/60">
                {user.profile.company} | {user.profile.phoneNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Automations (Framer Motion removed) */}
      <div
        className={cardClasses}
      >
        {/* H2 Theming */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-textLight dark:text-textDark">
          <FiZap className="text-secondary" /> Latest Automations
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {dashboardData?.latestAutomations?.map((auto, i) => (
            // Automation Card (Framer Motion removed)
            <div
              key={i}
              className={subCardClasses}
            >
              <div className="flex items-center justify-between mb-3">
                {/* Instance Name Theming */}
                <h3 className="font-semibold text-lg flex items-center gap-2 text-textLight dark:text-textDark">
                  <FaRobot className="text-primary" /> {auto.instanceName}
                </h3>
                {/* Status Tag (Colors remain consistent across themes) */}
                <span
                  className={`text-xs px-3 py-1 rounded-full ${auto.systemStatus === "EXPIRE_SOON"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : auto.systemStatus === "EXPIRED"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                    }`}
                >
                  {auto.systemStatus}
                </span>
              </div>

              {/* Details Theming */}
              <div className="space-y-1 text-sm text-textLight/70 dark:text-textDark/70">
                <p>
                  <FiClock className="inline mr-1 text-textLight/60 dark:text-textDark/60" />
                  <strong>Status:</strong> {auto.isActive ? "Active" : "Inactive"}
                </p>
                <p>
                  <FiTrendingUp className="inline mr-1 text-textLight/60 dark:text-textDark/60" />
                  <strong>Executions:</strong> {auto.usageCount}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(auto.createdAt).toLocaleString()}
                </p>
                {auto.periods?.startTime && (
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(auto.periods.startTime).toLocaleDateString()}
                  </p>
                )}
                {auto.periods?.endTime && (
                  <p>
                    <strong>Expiry:</strong>{" "}
                    {new Date(auto.periods.endTime).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History (Framer Motion removed) */}
      <div
        className={cardClasses}
      >
        {/* H2 Theming */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-textLight dark:text-textDark">
          <FiCreditCard className="text-secondary" /> Billing History
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {dashboardData?.latestPayments?.map((bill, i) => (
            // Billing Card (Framer Motion removed)
            <div
              key={i}
              className={subCardClasses}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-lg text-textLight dark:text-textDark">
                  Invoice #{bill.orderId}
                </p>
                {/* Status Tag (Colors remain consistent across themes) */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${bill.status === "success"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                    }`}
                >
                  {bill.status.toUpperCase()}
                </span>
              </div>

              {/* Details Theming */}
              <div className="text-sm space-y-1 text-textLight/70 dark:text-textDark/70">
                <p>
                  <strong>Plan:</strong> {bill.planDetails?.name || "N/A"}
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  <span className="font-semibold text-textLight dark:text-textDark">
                    ₹{bill.amountDetails?.totalAmount.toFixed(2)}
                  </span>{" "}
                  <span className="text-textLight/60 dark:text-textDark/60">({bill.currency})</span>
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {bill.paymentMethod.toUpperCase()}
                </p>
                <p>
                  <strong>Instance:</strong>{" "}
                  {bill.instanceId?.instanceName || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}