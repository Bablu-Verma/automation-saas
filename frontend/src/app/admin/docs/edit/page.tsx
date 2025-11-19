"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UploadImageGetLink from "../../_components/UploadImage";
import { admin_get_docs_by_id_api, admin_update_docs_api } from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { useSearchParams } from "next/navigation";

const TiptapEditor = dynamic(() => import("../../_components/TextEditor"), {
  ssr: false,
});

export default function EditDocs() {
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);

  const token = useSelector((state: RootState) => state.user.token);

  const [serviceId, setServiceId] = useState("");
  const [description, setDescription] = useState("");

  const searchParams = useSearchParams();
  const id__ = searchParams.get("id");

  // Fetch doc by id (Prefill data)
  const fetchDocDetails = async () => {
    try {
      setLoadingFetch(true);
      const res = await axios.post(
        admin_get_docs_by_id_api,
        { id: id__ },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const doc = res.data.data;
//    console.log(doc)

        setServiceId(doc.service_id?._id || "");
        setDescription(doc.docs || "");
      } else {
        toast.error("Failed to fetch doc.");
      }
    } catch (err) {
      toast.error("Error fetching doc details!");
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    if (id__) fetchDocDetails();
  }, [id__]);

  const handleReset = () => {
    fetchDocDetails(); // Reset form to original values
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        admin_update_docs_api,
        { docs: description, id: id__ },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating Docs.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingFetch)
    return (
      <div className="text-center py-10 text-gray-600">
        Loading document...
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <UploadImageGetLink />

      <h2 className="text-xl font-bold mb-4">✏️ Edit Docs</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SERVICE ID Field (Read only in edit mode) */}
        <input
          type="text"
          value={serviceId}
          readOnly
          className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />

        {/* EDITOR */}
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <TiptapEditor
            editorContent={description}
            setEditorContent={setDescription}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end items-center gap-5">
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-600 text-white p-2 rounded-lg px-10 hover:shadow-2xl"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary px-10 text-white p-2 rounded-lg hover:shadow-2xl disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Docs"}
          </button>
        </div>
      </form>
    </div>
  );
}
