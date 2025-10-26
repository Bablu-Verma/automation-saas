"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "@/redux-store/redux_store";
import { IUser, } from "@/types";
import { motion } from "framer-motion";
import { FiMail, FiZap, FiCreditCard, FiTrendingUp, FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import { get_user_dashboard_api } from "@/api";
import Loading_ from "@/components/Loading";
import { FaFlipboard, FaRobot } from "react-icons/fa";

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
  executionCount: number;
  createdAt: string;
  periods?: {
    endTime?: string;
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
  }, [user]);

  if (loading) return <Loading_ />
  
  if (error) return (
    <div className="text-center py-12">
      <FaFlipboard className="mx-auto text-gray-400 mb-4" size={48} />
      <h3 className="text-xl font-semibold mb-2">No Data found</h3>
      <p className="text-gray-400">Create Some error plese Refrash Again.</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto text-white space-y-5">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/10"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-3xl font-bold shadow-lg">
            {user?.name[0]}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold">{user?.name}</h1>
            <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
              <FiMail /> {user?.email}
            </p>
            {user?.profile && (
              <p className="text-gray-400 text-sm">
                {user.profile.company} | {user.profile.phoneNumber}
              </p>
            )}
          </div>
        </div>
      </motion.div>
      {/* Automations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-lg  transition"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
          <FiZap className="text-secondary" /> Automations
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {dashboardData?.latestAutomations?.map((auto, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="group bg-gradient-to-br from-dark/40 to-dark/20 rounded-xl p-6 border border-white/10 shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <FaRobot className="" /> {auto.instanceName}
                </h3>
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

              <div className="space-y-1 text-sm text-gray-400">
                <p>
                  <FiClock className="inline mr-1 text-gray-500" />
                  <strong>Status:</strong> {auto.isActive ? "Active" : "Inactive"}
                </p>
                <p>
                  <FiTrendingUp className="inline mr-1 text-gray-500" />
                  <strong>Executions:</strong> {auto.executionCount}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(auto.createdAt).toLocaleString()}
                </p>
                {auto.periods?.endTime && (
                  <p>
                    <strong>Expiry:</strong>{" "}
                    {new Date(auto.periods.endTime).toLocaleDateString()}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-lg transition"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
          <FiCreditCard className="text-secondary" /> Billing History
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {dashboardData?.latestPayments?.map((bill, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-dark/40 to-dark/20 rounded-xl p-6 border border-white/10  shadow-md transition-all duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-lg text-white">
                  Invoice #{bill.orderId}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${bill.status === "success"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                    }`}
                >
                  {bill.status.toUpperCase()}
                </span>
              </div>

              <div className="text-sm text-gray-400 space-y-1">
                <p>
                  <strong>Plan:</strong> {bill.planDetails?.name || "N/A"} (
                  {bill.planDetails?.duration} months)
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  <span className="text-white font-semibold">
                    ₹{bill.amountDetails?.totalAmount.toFixed(2)}
                  </span>{" "}
                  <span className="text-gray-400">({bill.currency})</span>
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
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

  )
}
