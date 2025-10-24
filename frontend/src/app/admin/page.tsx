'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "@/redux-store/redux_store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { get_admin_dashboard_api } from "@/api";
import LoadingSpiner from "./_components/LoadingSpiner";

// Types define करें
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Payment {
  _id: string;
  user?: {
    name: string;
  };
  instanceId?: {
    instanceName: string;
  };
  status: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
}

interface Automation {
  _id: string;
  instanceName?: string;
  systemStatus: string;
  user?: {
    name: string;
  };
}

interface Counts {
  users?: number;
  payments?: number;
  contacts?: number;
  automations?: number;
  [key: string]: number | undefined;
}

interface Latest {
  payments?: Payment[];
  users?: User[];
  contacts?: Contact[];
  automations?: Automation[];
}

interface DashboardData {
  counts: Counts;
  latest: Latest;
}

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    counts: {},
    latest: {}
  });
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.user.token)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const {data} = await axios.post(
          get_admin_dashboard_api,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDashboardData(data.data || { counts: {}, latest: {} });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]); // token को dependency में add किया

  if (loading) return <LoadingSpiner />;
  
  const counts = dashboardData?.counts || {};
  const latest = dashboardData?.latest || {};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* ---------- Counts Section ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(counts).map(([key, value]) => (
          <div key={key} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-sm uppercase text-gray-500">{key}</h2>
            <p className="text-xl font-semibold">{value as React.ReactNode}</p>
          </div>
        ))}
      </div>

      {/* ---------- Latest Payments ---------- */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Latest Payments</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">User</th>
              <th className="p-2 border">Instance</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {latest.payments?.map((p) => (
              <tr key={p._id}>
                <td className="p-2 border">{p.user?.name || "N/A"}</td>
                <td className="p-2 border">{p.instanceId?.instanceName || "N/A"}</td>
                <td className="p-2 border">{p.status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ---------- Latest Users ---------- */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Latest Users</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {latest.users?.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ---------- Latest Contacts ---------- */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Latest Contacts</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {latest.contacts?.map((c) => (
              <tr key={c._id}>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.email}</td>
                <td className="p-2 border">{c.subject}</td>
                <td className="p-2 border">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ---------- Latest Automations ---------- */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Latest Automations</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Instance Name</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">User</th>
            </tr>
          </thead>
          <tbody>
            {latest.automations?.map((a) => (
              <tr key={a._id}>
                <td className="p-2 border">{a.instanceName || "N/A"}</td>
                <td className="p-2 border">{a.systemStatus}</td>
                <td className="p-2 border">{a.user?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;