"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { admin_automation_details_api, admin_automation_update_api } from "@/api";
import LoadingSpiner from "../../_components/LoadingSpiner";
import toast from "react-hot-toast";

interface MasterWorkflow {
  name: string;
}

interface User {
  name: string;
  email: string;
}

interface AutomationDetails {
  _id: string;
  instanceName: string;
  n8nWorkflowId: string;
  isActive: "RUNNING" | "PAUSE";
  systemStatus: "TRIAL" | "ACTIVE" | "NEED_PAYMENT" | "EXPIRED" | "EXPIRE_SOON" | "CONTACT_SUPPORT";
  periods: {
    startTime?: string;
    endTime?: string;
  };
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
  updatedAt: string;
  masterWorkflow: MasterWorkflow;
  user: User;
}

export default function AutomationDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [automation, setAutomation] = useState<AutomationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const token = useSelector((state: RootState) => state.user.token);

  const fetchAutomation = async () => {
    if (!id || !token) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        admin_automation_details_api,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) 
        {
          setAutomation(data.automation);
          setNewStatus(data.automation.systemStatus)
        } 
    } catch (err) {
      console.error("Failed to fetch automation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!automation || !newStatus) {
      toast.error("Please select a status first.");
      return;
    }

    try {
      setUpdating(true);
      const { data } = await axios.post(
        admin_automation_update_api,
        {
          automationId: automation._id,
          systemStatus: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchAutomation(); // refresh details
        setNewStatus("");
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Server error while updating status.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchAutomation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  if (loading) return <LoadingSpiner />;
  if (!automation) return <div className="text-xl font-bold">Automation not found</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Automation Details</h1>

      {/* Basic Info */}
      <div className="p-6  border border-gray-600 space-y-2">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <p><strong>Name:</strong> {automation.instanceName}</p>
        <p><strong>Workflow ID:</strong> {automation.n8nWorkflowId}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`px-2 py-1 rounded ${automation.isActive === "RUNNING" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
            {automation.isActive}
          </span>
        </p>
        <p>
          <strong>System Status:</strong>{" "}
          <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400">
            {automation.systemStatus}
          </span>
        </p>
      </div>

     
      {/* Master Workflow */}
      <div className="p-6  border border-gray-600 space-y-2">
        <h2 className="text-xl font-semibold">Master Workflow</h2>
        <p><strong>Name:</strong> {automation.masterWorkflow.name}</p>
      </div>

      {/* User Info */}
      <div className="p-6  border border-gray-600 space-y-2">
        <h2 className="text-xl font-semibold">User Information</h2>
        <p><strong>Name:</strong> {automation.user.name}</p>
        <p><strong>Email:</strong> {automation.user.email}</p>
      </div>

      {/* Execution Info */}
      <div className="p-6  border border-gray-600 space-y-2">
        <h2 className="text-xl font-semibold">Execution Details</h2>
        <p><strong>Total Executions:</strong> {automation.executionCount}</p>
        <p>
          <strong>Last Executed:</strong>{" "}
          {automation.lastExecutedAt ? new Date(automation.lastExecutedAt).toLocaleString() : "Never"}
        </p>
        {automation.periods?.startTime && automation.periods?.endTime && (
          <p>
            <strong>Period:</strong>{" "}
            {new Date(automation.periods?.startTime).toLocaleDateString()} -{" "}
            {new Date(automation.periods?.endTime).toLocaleDateString()}
          </p>
        )}
      </div>


       {/* Update System Status */}
      <div className="p-6  border border-gray-600 space-y-4">
        <h2 className="text-xl font-semibold">Update System Status</h2>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="px-4 py-2  border border-secondary bg-white/5 w-full sm:w-auto"
          >
            <option value="">Select new system status</option>
            <option value="TRIAL">Trial</option>
            <option value="ACTIVE">Active</option>
            <option value="NEED_PAYMENT">Need Payment</option>
            <option value="EXPIRED">Expired</option>
            <option value="CONTACT_SUPPORT">Contact Support</option>
          </select>

          <button
            disabled={updating || !newStatus}
            onClick={handleStatusUpdate}
            className={`px-5 py-2  font-semibold transition-all ${
              updating
                ? "opacity-70 cursor-not-allowed bg-gray-500 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>


      {/* Timestamps */}
      <div className="p-6  border border-gray-600 space-y-2">
        <h2 className="text-xl font-semibold">Timestamps</h2>
        <p><strong>Created At:</strong> {new Date(automation.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(automation.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
