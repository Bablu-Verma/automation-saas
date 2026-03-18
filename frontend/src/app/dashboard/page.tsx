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
 if (error)
  return (
    <div className="text-center py-16">
      <FaFlipboard
        className="mx-auto mb-4 text-textLight/30 dark:text-textDark/30"
        size={40}
      />
      <h3 className="text-lg font-semibold text-textLight dark:text-textDark">
        No Data Found
      </h3>
      <p className="mt-2 text-sm text-textLight/60 dark:text-textDark/60">
        {error}
      </p>
    </div>
  )

const cardClasses = `
  p-6
  bg-lightBg dark:bg-darkBg
`;

const subCardClasses = `
  p-5 rounded-lg
  border border-black/5 dark:border-white/10
`;

return (
  <div className="max-w-6xl mx-auto space-y-6">

    {/* Profile Header */}
    <div className={cardClasses}>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-5">

        {/* Avatar */}
        <div className="w-14 h-14 flex items-center justify-center 
          rounded-full bg-primary/10 
          text-primary text-xl font-semibold">
          {user?.name?.[0]}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-semibold text-textLight dark:text-textDark">
            {user?.name}
          </h1>

          <p className="mt-1 flex items-center justify-center md:justify-start gap-2 
            text-sm text-textLight/70 dark:text-textDark/70">
            <FiMail /> {user?.email}
          </p>

          {user?.profile && (
            <p className="mt-1 text-sm text-textLight/60 dark:text-textDark/60">
              {user.profile.company} | {user.profile.phoneNumber}
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Automations */}
    <div className={cardClasses}>
      <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 
        text-textLight dark:text-textDark">
        <FiZap className="text-primary" /> Latest Automations
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {dashboardData?.latestAutomations?.map((auto, i) => (
          <div key={i} className={subCardClasses}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-base flex items-center gap-2 
                text-textLight dark:text-textDark">
                <FaRobot className="text-primary" />
                {auto.instanceName}
              </h3>

              <span
                className={`text-xs px-2 py-1 rounded-md ${
                  auto.systemStatus === "EXPIRE_SOON"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : auto.systemStatus === "EXPIRED"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-green-500/10 text-green-500"
                }`}
              >
                {auto.systemStatus}
              </span>
            </div>

            <div className="space-y-1 text-sm text-textLight/70 dark:text-textDark/70">
              <p>
                <strong>Status:</strong>{" "}
                {auto.isActive ? "Active" : "Inactive"}
              </p>
              <p>
                <strong>Executions:</strong> {auto.usageCount}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(auto.createdAt).toLocaleDateString()}
              </p>
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

    {/* Billing History */}
    <div className={cardClasses}>
      <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 
        text-textLight dark:text-textDark">
        <FiCreditCard className="text-primary" /> Billing History
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {dashboardData?.latestPayments?.map((bill, i) => (
          <div key={i} className={subCardClasses}>
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-base text-textLight dark:text-textDark">
                Invoice #{bill.orderId}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded-md ${
                  bill.status === "success"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {bill.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1 text-sm text-textLight/70 dark:text-textDark/70">
              <p>
                <strong>Plan:</strong>{" "}
                {bill.planDetails?.name || "N/A"}
              </p>
              <p>
                <strong>Total:</strong>{" "}
                ₹{bill.amountDetails?.totalAmount.toFixed(2)} ({bill.currency})
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