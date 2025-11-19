"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Pagination from "@/components/Pagination";
import Link from "next/link";
import LoadingSpiner from "../../_components/LoadingSpiner";
import { admin_list_docs_api } from "@/api";
import { RootState } from "@/redux-store/redux_store";
import { useSelector } from "react-redux";

export default function DocsList() {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

    const token = useSelector((state: RootState) => state.user.token);

  const totalPages = Math.ceil(filteredData.length / limit);

  const getDocs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(admin_list_docs_api,{},{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }); // API endpoint
      if (data.success) {
        setDocs(data.data);
        setFilteredData(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch docs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDocs();
  }, []);

  const handleSearch = () => {
    const result = docs.filter(
      (item: any) =>
        item._id.toLowerCase().includes(search.toLowerCase()) ||
        item.service_id?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(result);
    setPage(1);
  };

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  if (loading) return <LoadingSpiner />;

  return (
    <div className="max-w-6xl mx-auto pb-28 px-6">
      <h1 className="text-3xl font-bold mb-6">Docs List</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by ID or Service Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearch("");
            setFilteredData(docs);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {/* Docs List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedData.length === 0 ? (
          <p className="text-center col-span-2 py-12 text-gray-500">
            No docs found.
          </p>
        ) : (
          paginatedData.map((doc: any) => (
            <div key={doc._id} className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-1">
                {doc.service_id?.name || "No Service Name"}
              </h3>

              <p className="text-sm text-gray-600 mb-2">Doc ID: {doc._id}</p>

              <div className="flex gap-2 mt-2">
                <Link
                  href={`/admin/docs/view?id=${doc._id}`}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  View
                </Link>

                <Link
                  href={`/admin/docs/edit?id=${doc._id}`}
                  className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 text-sm"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
