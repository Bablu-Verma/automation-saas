"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { admin_list_master_workflow_api } from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Pagination from "@/components/Pagination";
import LoadingSpiner from "../../_components/LoadingSpiner";
import Link from "next/link";
import Image from "next/image";

export type Workflow__ = {
  _id: string;
  name: string;
   pricingPlans: {
  planName: string;
  monthlyPrice: number;
  usageLimit: number;
  validityDays:number;
  discountPercent:number;
  features: string[];
}[];
  slug:string;
  description: string;
  isPublished: "ACTIVE" | "PAUSE";
  serviceImage?: string;
  createdAt: string;
};

export default function MasterWorkflows() {
  const token = useSelector((state: RootState) => state.user.token);
  const [workflows, setWorkflows] = useState<Workflow__[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({ totalWorkflows: 0, activeWorkflows: 0, inactiveWorkflows: 0 });

  const [filters, setFilters] = useState({
    search: "",
    status: "" as "ACTIVE" | "PAUSE" | "",
    dateFrom: "",
    dateTo: "",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);



  const fetchWorkflows = async (pageNum = page) => {
    if (!token) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        admin_list_master_workflow_api,
        {
          page: pageNum,
          limit: 10,
          ...Object.fromEntries(Object.entries(appliedFilters).filter(([, v]) => v)),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
 
      if (data.success) {
        setWorkflows(data.workflows);
        setTotalPages(data.pagination.totalPages);
        setStatistics(data.statistics);
      }
    } catch (err) {
      console.error("Failed to fetch workflows:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [token, page, appliedFilters]);

  if (loading) return <LoadingSpiner />;

  return (
    <div className="max-w-6xl mx-auto pb-28 px-6">
      <h1 className="text-3xl font-bold mb-6">Master Workflows</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSE">Paused</option>
        </select>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => { setAppliedFilters(filters); setPage(1); }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Apply
        </button>
        <button
          onClick={() => { 
            setFilters({ search: "", status: "", dateFrom: "", dateTo: "" });
            setAppliedFilters({ search: "", status: "", dateFrom: "", dateTo: "" });
            setPage(1);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {/* Statistics */}
      <div className="flex gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded text-center flex-1">
          <p className="text-xl font-bold">{statistics.totalWorkflows}</p>
          <p className="text-sm">Total Workflows</p>
        </div>
        <div className="p-4 bg-green-100 rounded text-center flex-1">
          <p className="text-xl font-bold">{statistics.activeWorkflows}</p>
          <p className="text-sm">Active</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded text-center flex-1">
          <p className="text-xl font-bold">{statistics.inactiveWorkflows}</p>
          <p className="text-sm">Inactive</p>
        </div>
      </div>

      {/* Workflow List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {workflows.length === 0 ? (
          <p className="text-center col-span-2 py-12 text-gray-500">No workflows found.</p>
        ) : (
          workflows.map((wf) => (
            <div key={wf._id} className="bg-white p-4 rounded-lg border shadow-sm">
              {wf.serviceImage ? (
                <Image
                  src={wf.serviceImage}
                  alt={wf.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-400">No Image</div>
              )}
              <h3 className="text-lg font-semibold">{wf.name}</h3>
             
             
              <div className="flex gap-2 items-center mt-2">
                 <p className={`text-sm font-light mr-8 ${wf.isPublished === "ACTIVE" ? "text-green-600" : "text-yellow-600"}`}>
                {wf.isPublished === "ACTIVE" ? "Live" : "Paused"}
              </p>
                <Link href={`/admin/service/view?id=${wf._id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">View</Link>
                <Link href={`/admin/service/edit?id=${wf._id}`} className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 text-sm">Edit</Link>  
                
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => { setPage(p); fetchWorkflows(p); }}
      />
    </div>
  );
}
