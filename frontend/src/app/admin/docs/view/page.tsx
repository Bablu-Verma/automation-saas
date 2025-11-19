"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import LoadingSpiner from "../../_components/LoadingSpiner";
import { admin_get_docs_by_id_api } from "@/api";
import Link from "next/link";

export default function DocsDetailPage() {
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");

  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (!docId || !token) return;

    async function fetchDoc() {
      try {
        const { data } = await axios.post(
          admin_get_docs_by_id_api,
          { id: docId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDoc(data.data);
      } catch (err) {
        console.error("Failed to fetch docs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDoc();
  }, [docId, token]);

  if (loading) return <LoadingSpiner />;

  if (!doc)
    return (
      <div className="h-[50vh] flex items-center justify-center text-gray-500 text-lg">
        Document not found.
      </div>
    );

  return (
    <div className="mx-auto pb-20 p-6">
      {/* Header */}
      <div className=" mb-4">
        <h1 className="text-2xl font-bold">Document Detail</h1>

        {doc?.service_id && (
          <p className="px-3 py-1 inline-block bg-gray-200 text-sm rounded-full font-semibold mt-5">
            Service: {doc.service_id.name}
          </p>
        )}
      </div>

      {/* Doc Description */}
      {doc.docs ? (
        <div className="my-4">
          <h3 className="font-bold mb-2">Document Content</h3>
          <div style={{color:'black'}}
            className="flex-1  text-black dangerouslyHTML"
            dangerouslySetInnerHTML={{ __html: doc.docs }}
          />
        </div>
      ) : (
        <p className="text-gray-500">No content available.</p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Link
          href={`/admin/docs/edit?id=${doc._id}`}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition"
        >
          Edit Document
        </Link>
        <Link
          href="/admin/docs/list"
          className="px-4 py-2 border rounded text-black font-semibold transition"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
}
