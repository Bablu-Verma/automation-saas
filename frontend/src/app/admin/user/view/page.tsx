// User Details Page Component
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { admin_user_details_api } from "@/api";
import LoadingSpiner from "../../_components/LoadingSpiner";


interface UserDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profile: {
    company: string;
    phoneNumber: string;
    address: string;
  };
  stats: {
    totalAutomations: number;
    activeAutomations: number;
    totalExecutions: number;
    lastActivity: string | null;
    accountAge: number;
    totalPayments: number;
    totalAmount: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
  };
  recentAutomations: any[];
  payments: any[];
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.user.token);

  const fetchUserDetails = async () => {
    if (!token || !id) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        admin_user_details_api,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  if (loading) return <LoadingSpiner />;
  if (!user) return null;

  const formatDate = (date: string | null) => date ? new Date(date).toLocaleDateString() : "N/A";

  return (
    <div className="p-6 space-y-6">

      {/* Basic Information */}
      <div className="p-6 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Status:</strong> {user.status}</p>
          </div>
          <div>
            <p><strong>Company:</strong> {user.profile.company || "N/A"}</p>
            <p><strong>Phone:</strong> {user.profile.phoneNumber || "N/A"}</p>
            <p><strong>Account Age:</strong> {user.stats.accountAge} days</p>
            <p><strong>Joined:</strong> {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Automation Statistics */}
      <div className="p-6 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Automation Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold">{user.stats.totalAutomations}</p>
            <p className="text-sm">Total Automations</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold">{user.stats.activeAutomations}</p>
            <p className="text-sm">Active Automations</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold">{user.stats.totalExecutions}</p>
            <p className="text-sm">Total Executions</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold">{formatDate(user.stats.lastActivity)}</p>
            <p className="text-sm">Last Activity</p>
          </div>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="p-6 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Payment Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold">{user.stats.totalPayments}</p>
            <p className="text-sm">Total Payments</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold">{user.stats.successfulPayments}</p>
            <p className="text-sm">Successful</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold">{user.stats.failedPayments}</p>
            <p className="text-sm">Failed</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold">{user.stats.pendingPayments}</p>
            <p className="text-sm">Pending</p>
          </div>
        </div>
      </div>

      {/* Recent Automations */}
      <div className="p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Recent Automations</h2>
        {user.recentAutomations.length > 0 ? (
          <div className="space-y-3">
            {user.recentAutomations.map((auto) => (
              <div key={auto._id} className="border-b pb-3">
                <p><strong>Name:</strong> {auto.instanceName}</p>
                <p><strong>Executions:</strong> {auto.executionCount}</p>
                <p><strong>Status:</strong> {auto.isActive}</p>
                <p><strong>Last Executed:</strong> {formatDate(auto.lastExecutedAt)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No automations found.</p>
        )}
      </div>

      {/* Recent Payments */}
      <div className="p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
        {user.payments.length > 0 ? (
          <div className="space-y-3">
            {user.payments.map((p) => (
              <div key={p._id} className="border-b pb-3 flex justify-between items-center">
                <div>
                  <p><strong>Order:</strong> {p.orderId}</p>
                  <p><strong>Amount:</strong> {p.currency} {p.amountDetails?.totalAmount}</p>
                  <p><strong>Plan:</strong> {p.planDetails?.name}</p>
                  <p><strong>Date:</strong> {formatDate(p.createdAt)}</p>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-semibold capitalize
                  ${p.status === "success" ? "bg-green-200" :
                    p.status === "failed" ? "bg-red-200" :
                    p.status === "pending" ? "bg-yellow-200" : "bg-gray-200"}`}>
                  {p.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No payments found.</p>
        )}
      </div>
    </div>
  );
}
