"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Image from "next/image";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { details_master_workflow_api } from "@/api";
import Link from "next/link";

export type WorkflowDetail = {
  _id: string;
  name: string;
  description: string;
  category: string;
  pricePerMonth: number;
  currency: string;
  isPublished: "ACTIVE" | "PAUSE";
  serviceImage?: string;
  trialDays: number;
  requiredInputs: { key: string; label: string; type: string; placeholder?: string }[];
  requiredCredentials: { service: string; label: string; type: string }[];
};

export default function WorkflowDetailPage() {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("id"); // URL: /workflow/detail?id=xxx

  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (!workflowId || !token) return;

    async function fetchWorkflow() {
      try {
        const { data } = await axios.post(details_master_workflow_api, {
          id: workflowId
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(data)
        setWorkflow(data.workflow);
      } catch (err) {
        console.error("Failed to fetch workflow detail:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, [workflowId, token]);

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
      <div className="h-[50vh] flex items-center justify-center text-white">
        Loading workflow details...
      </div>
    );

  if (!workflow)
    return (
      <div className="h-[50vh] flex items-center justify-center text-red-400">
        Workflow not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-28 text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/10"
      >
        {workflow.serviceImage && (
          <Image
            height={250}
            width={500}
            src={workflow.serviceImage}
            alt={workflow.name}
            className="w-full h-64 rounded-xl object-cover mb-4"
          />
        )}

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{workflow.name}</h1>
          <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(workflow.isPublished)}`}>
            {workflow.isPublished}
          </span>
        </div>

      
        <p className="text-gray-400 text-sm mb-2">Category: {workflow.category}</p>
        <p className="text-gray-300 font-semibold mb-4">
          Price: ₹{workflow.pricePerMonth}/{workflow.currency} | Trial: {workflow.trialDays} days
        </p>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Required Inputs</h3>
          <ul className="list-disc ml-5 text-gray-300">
            {workflow.requiredInputs.map((input) => (
              <li key={input.key}>
                {input.label} ({input.type}) {input.placeholder && `- e.g. ${input.placeholder}`}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2">Required Credentials</h3>
          <ul className="list-disc ml-5 text-gray-300">
            {workflow.requiredCredentials.map((cred, i) => (
              <li key={i}>
                {cred.label} ({cred.type})
              </li>
            ))}
          </ul>
        </div>

         {workflow.description && (
  <div
    className="text-gray-300 mb-2 dangerouslyHTML"
    dangerouslySetInnerHTML={{ __html: workflow.description }}
  />
)}

        <div className="mt-6 flex gap-3">
          <Link
            href={`/admin/service/edit?id=${workflow._id}`}
            className="px-4 py-2 rounded-full bg-primary text-white font-semibold hover:bg-secondary transition"
          >
            Edit Workflow
          </Link>
          <Link
            href="/admin/service/list"
            className="px-4 py-2 rounded-full border border-white/30 text-white font-semibold hover:bg-white hover:text-primary transition"
          >
            Back to List
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
