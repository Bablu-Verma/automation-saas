"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCreditCard, FiCheckCircle, FiClock } from "react-icons/fi";
import axios from "axios";
import { list_master_workflow_api } from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Image from "next/image";
import Link from "next/link";

export type Workflow__ = {
  _id: string;
  name: string;
  description: string;
  category: string;
  pricePerMonth: number;
  currency: string;
  isPublished: "ACTIVE" | "PAUSE";
  serviceImage?: string;
  trialDays: number;
};

export default function MasterWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow__[]>([]);
  const [loading, setLoading] = useState(true);

  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (!token) return;
    async function fetchWorkflows() {
      try {
        const { data } = await axios.post(
          list_master_workflow_api,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWorkflows(data.workflows);
      } catch (err) {
        console.error("Failed to fetch workflows:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkflows();
  }, [token]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <FiCheckCircle className="text-green-400" size={22} />;
      case "PAUSE":
        return <FiClock className="text-yellow-400" size={22} />;
      default:
        return <FiCreditCard size={22} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400 bg-green-400/10";
      case "PAUSE":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  if (loading)
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-t-secondary border-white rounded-full"
        />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-28 text-white px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold mb-8"
      >
        Master Workflows
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {workflows.map((wf, i) => (
          <motion.div
            key={wf._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 300 }}
            className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-white/10 hover:shadow-[0_0_20px_rgba(230,82,31,0.4)] transition"
          >
            {wf.serviceImage ? (
              <Image
                height={200}
                width={300}
                src={wf.serviceImage}
                alt={wf.name}
                className="w-full h-48 rounded-xl mb-4 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-white/10 rounded-xl mb-4 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{wf.name}</h3>
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                  wf.isPublished
                )}`}
              >
                {wf.isPublished}
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-2">Category: {wf.category}</p>
            <p className="text-gray-300 font-semibold mb-4">
              Price: ₹{wf.pricePerMonth}/{wf.currency} | Trial: {wf.trialDays} days
            </p>

            <div className="mt-2 flex items-center gap-2 mb-4">
              {getStatusIcon(wf.isPublished)}
              <span className="text-sm text-gray-300">
                {wf.isPublished === "ACTIVE"
                  ? "Workflow is live"
                  : "Workflow is paused"}
              </span>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/admin/service/view?id=${wf._id}`}
                className="px-4 py-2 rounded-full bg-primary text-white font-semibold hover:bg-secondary transition"
              >
                View
              </Link>
              <Link
                href={`/admin/service/edit?id=${wf._id}`}
                className="px-4 py-2 rounded-full border border-white/30 text-white font-semibold hover:bg-white hover:text-primary transition"
              >
                Edit
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
