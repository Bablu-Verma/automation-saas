"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UploadImageGetLink from "../../_components/UploadImage";
import { admin_add_docs_api, admin_create_master_workflow_api } from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";

const TiptapEditor = dynamic(() => import("../../_components/TextEditor"), { ssr: false });

export default function AddMasterWorkflow() {
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);

  console.log(admin_add_docs_api)

  const [serviceId, setServiceId] = useState("");
  const [description, setDescription] = useState("");

  const handleReset = () => {
    setServiceId("");
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        admin_add_docs_api,
        { docs: description, service_id: serviceId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      handleReset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error adding Docs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <UploadImageGetLink />

      <h2 className="text-xl font-bold mb-4">➕ Add Docs</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Workflow Name / Service ID"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="w-full border rounded-lg p-2"
          required
        />

        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <TiptapEditor editorContent={description} setEditorContent={setDescription} />
        </div>

        <div className="flex justify-end items-center gap-5">
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-600 text-white p-2 rounded-lg px-10 hover:shadow-2xl"
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary px-10 text-white p-2 rounded-lg hover:shadow-2xl disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Docs"}
          </button>
        </div>
      </form>
    </div>
  );
}
