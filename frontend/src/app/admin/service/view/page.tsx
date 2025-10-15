"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Image from "next/image";
import Link from "next/link";
import LoadingSpiner from "../../_components/LoadingSpiner";
import { admin_details_master_workflow_api } from "@/api";

export type WorkflowDetail = {
  _id: string;
  name: string;
  description: string;
  keyword: string[];
  pricePerMonth: number;
  currency: string;
  isPublished: "ACTIVE" | "PAUSE";
  serviceImage?: string;
  trialDays: number;
  requiredInputs: { key: string; label: string }[];
  requiredCredentials: {
    service: string;
    label: string;
    inputType: string;
    scope: string[];
    credentialType: string;
  }[];
};

export default function WorkflowDetailPage() {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("id");

  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (!workflowId || !token) return;

    async function fetchWorkflow() {
      try {
        const { data } = await axios.post(
          admin_details_master_workflow_api,
          { id: workflowId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWorkflow(data.workflow);
      } catch (err) {
        console.error("Failed to fetch workflow detail:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, [workflowId, token]);

 
  if (loading)
    return (
     <LoadingSpiner />
    );

  if (!workflow)
    return (
      <div className="h-[50vh] flex items-center justify-center text-gray-500 text-lg">
        Workflow not found.
      </div>
    );

  return (
    <div className="mx-auto pb-20 ">
      <div
        className=" p-6 "
      >
        {/* Workflow Image */}
        {workflow.serviceImage ? (
          <Image
            src={workflow.serviceImage}
            alt={workflow.name}
            width={500}
            height={250}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-60 bg-gray-800 rounded-lg flex items-center justify-center  mb-4">
            No Image
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h1 className="text-2xl font-bold">{workflow.name}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold mt-2 sm:mt-0 `}>
            {workflow.isPublished}
          </span>
        </div>

        {/* Keywords */}
        {workflow.keyword.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {workflow.keyword.map((k, idx) => (
              <span key={idx} className=" px-2 py-1 rounded text-sm bg-gray-200">
                {k}
              </span>
            ))}
          </div>
        )}

        {/* Price & Trial */}
        <p className="text-gray-600 font-semibold mb-4">
          Price: ₹{workflow.pricePerMonth}/{workflow.currency} | Trial: {workflow.trialDays} days
        </p>

        {/* Required Inputs */}
        {workflow.requiredInputs.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold mb-2">Required Inputs</h3>
            <ul className="list-disc ml-5 text-gray-800">
              {workflow.requiredInputs.map((input) => (
                <li key={input.key}>{input.label}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Required Credentials */}
        {workflow.requiredCredentials.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold mb-2">Required Credentials</h3>
            <ul className="list-disc ml-5 text-gray-800">
              {workflow.requiredCredentials.map((cred, i) => (
                <li key={i}>
                  {cred.label} ({cred.inputType})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Description */}
        {workflow.description && (
          <div className="mb-4">
            <h3 className="font-bold mb-2">Description</h3>
            <div
              className="text-gray-500"
              dangerouslySetInnerHTML={{ __html: workflow.description }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            href={`/admin/service/edit?id=${workflow._id}`}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition"
          >
            Edit Workflow
          </Link>
          <Link
            href="/admin/service/list"
            className="px-4 py-2 border text-black rounded font-semibold transition"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
