// User Details Page Component
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { admin_user_details_api } from "@/api";

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
  };
  recentAutomations: any[];
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
        {id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
  }, [id, token]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      
      {/* User Information */}
      <div className=" p-6 rounded-lg shadow-md mb-6">
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
            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className=" p-6 rounded-lg text-secondary shadow-md mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Automation Statistics</h2>
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
            <p className="text-2xl font-bold">
              {user.stats.lastActivity 
                ? new Date(user.stats.lastActivity).toLocaleDateString()
                : "Never"
              }
            </p>
            <p className="text-sm">Last Activity</p>
          </div>
        </div>
      </div>

      {/* Recent Automations */}
      <div className=" p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Automations</h2>
        {user.recentAutomations.length > 0 ? (
          <div className="space-y-3">
            {user.recentAutomations.map((auto) => (
              <div key={auto._id} className="border-b pb-3">
                <p><strong>Name:</strong> {auto.instanceName}</p>
                <p><strong>Executions:</strong> {auto.executionCount}</p>
                <p><strong>Status:</strong> {auto.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No automations found.</p>
        )}
      </div>
    </div>
  );
}