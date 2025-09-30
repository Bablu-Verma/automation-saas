import { useState } from "react";
import axios from "axios";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { instance_update_status_api } from "@/api";

type Props = {
  instanceId: string;
  currentStatus: "ACTIVE" | "PAUSE";
  onUpdate?: (newStatus: "ACTIVE" | "PAUSE") => void;
};

export default function StatusToggleButton({ instanceId, currentStatus, onUpdate }: Props) {
  const [status, setStatus] = useState<"ACTIVE" | "PAUSE">(currentStatus);
  const [loading, setLoading] = useState(false);

   const token = useSelector((state: RootState) => state.user.token);

  const toggleStatus = async () => {
    const newStatus = status === "ACTIVE" ? "PAUSE" : "ACTIVE";
    setLoading(true);
    try {
      // 🔹 API call to update status
     await axios.post(
        instance_update_status_api,
        { id: instanceId,isActive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus(newStatus);
      if (onUpdate) onUpdate(newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={loading}
      title="Change Status"
      className={`px-8 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors duration-300 ${
        status === "ACTIVE"
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "bg-yellow-500 hover:bg-yellow-600 text-white"
      } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {status === "ACTIVE" ? <FiCheckCircle size={18} /> : <FiClock size={18} />}
      {loading ? "Updating..." : status === "ACTIVE" ? "Active" : "Paused"}
    </button>
  );
}
