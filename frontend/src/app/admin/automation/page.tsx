"use client";

import { useEffect, useState, useCallback } from "react";
import { FiSearch, FiTrash2, FiInfo } from "react-icons/fi"; // ✅ Added FiCalendar
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { admin_automation_list_api } from "@/api";
import LoadingSpiner from "../_components/LoadingSpiner";

export type Automation = {
  _id: string;
  instanceName: string;
  executionCount: number;
  lastExecutedAt: string;
  createdAt: string;
  updatedAt: string;
  systemStatus: string;
  isActive: string;
  masterWorkflow?: { name: string };
  user?: { name: string; email: string };
};

// ✅ Define the shape of the filter state
type FilterState = {
  search: string;
  user: string;
  systemStatus: string;
  isActive: string;
  dateFrom: string;
  dateTo: string;
};

export default function AdminAutomations() {
  const token = useSelector((state: RootState) => state.user.token);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<any>(null);

  const limit = 10;

  // ✅ 1. Temporary state for filter inputs
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    user: "",
    systemStatus: "",
    isActive: "",
    dateFrom: "",
    dateTo: "",
  });

  // ✅ 2. State for filters that are currently applied to the query
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);

  // ✅ Fetch Automations - Now depends on appliedFilters
  const fetchAutomations = useCallback(async (pageNum: number) => {
    if (!token) return;

    try {
      setLoading(true);

      // Construct payload, filtering out empty strings for cleaner request body
      const payload = {
        page: pageNum,
        limit: limit,
        // Only include filters if they have a non-empty value
        ...Object.fromEntries(Object.entries(appliedFilters).filter(([, v]) => v)),
      };

      const { data } = await axios.post(
        admin_automation_list_api,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setAutomations(data.automations);
        setTotalPages(data.totalPages);
        setPage(data.page);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch automations:", err);
    } finally {
      setLoading(false);
    }
  }, [token, limit, appliedFilters]); // Depend on appliedFilters

  // ✅ Trigger Fetch on Applied Filter Change or initial load
  useEffect(() => {
    // This will run whenever appliedFilters changes, starting the search from page 1
    fetchAutomations(1);
  }, [fetchAutomations]);

  // Handler to apply the temporary filters
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1); // Reset to page 1 for a new search
  }

  // Handler to reset all filters
  const handleResetFilters = () => {
    const defaultFilters = { search: "", user: "", systemStatus: "", isActive: "", dateFrom: "", dateTo: "" };
    setFilters(defaultFilters);      // Reset input fields
    setAppliedFilters(defaultFilters); // Apply reset filters
    setPage(1);                     // Reset page
  }

  // Handler for pagination change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchAutomations(newPage);
  }

  // ✅ Delete Automation
  const deleteAutomation = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this automation?")) return;

    try {
      const { data } = await axios.post(
        "/api/admin/automations/delete",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        // Re-fetch the current page list after deletion
        fetchAutomations(page);
        alert("Automation deleted successfully!");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete automation");
    }
  };

  // ✅ UI
  return (
    <div className="max-w-7xl mx-auto pb-28 px-6">
      {/* Header and Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">Automation Management</h1>
        {stats && (
          <div className="grid grid-cols-4 gap-2 text-sm text-gray-700 mt-3">
            <div className="p-4 bg-white rounded shadow text-center">
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-lg font-bold">{stats.totalAutomations}</p>
            </div>
            <div className="p-4 bg-white rounded shadow text-center">
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-lg font-bold">{stats.active}</p>
            </div>
            <div className="p-4 bg-white rounded shadow text-center">
              <p className="text-gray-500 text-sm">Trial</p>
              <p className="text-lg font-bold">{stats.trial}</p>
            </div>
            <div className="p-4 bg-white rounded shadow text-center">
              <p className="text-gray-500 text-sm">Expired</p>
              <p className="text-lg font-bold">{stats.expired}</p>
            </div>
            <div className="p-4 bg-white rounded shadow text-center">
              <p className="text-gray-500 text-sm">Need Payment </p>
              <p className="text-lg font-bold">{stats.needPayment}</p>
            </div>
            <div className="p-4 bg-white rounded shadow text-center">
              <p className="text-gray-500 text-sm">Executions</p>
              <p className="text-lg font-bold">{stats.totalExecutions}</p>
            </div>



          </div>
        )}
      </div>

      {/* 🔍 Filters */}
      <div className="text-secondary grid grid-cols-4 gap-4 mb-6">

        <div className="flex-1 relative col-span-2">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by automation name..."
            value={filters.search} // Bind to filters
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-secondary  focus:outline-none transition"
          />
        </div>

        <div className="flex-1 relative col-span-2">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by User ID, Name, or Email..."
            value={filters.user} // Bind to filters
            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-secondary focus:outline-none transition"
          />
        </div>

        <select
          value={filters.systemStatus} // Bind to filters
          onChange={(e) => setFilters({ ...filters, systemStatus: e.target.value })}
          className="px-4 py-2 border border-secondary bg-white/5  flex-1"
        >
          <option value="">All System Status</option>
          <option value="TRIAL">Trial</option>
          <option value="ACTIVE">Active</option>
          <option value="NEED_PAYMENT">Need Payment</option>
          <option value="EXPIRE_SOON">Expire Soon</option>
          <option value="EXPIRED">Expired</option>
          <option value="CONTACT_SUPPORT">Contact Support</option>
        </select>


        <select
          value={filters.isActive} // Bind to filters
          onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
          className="px-4 py-2 border border-secondary bg-white/5  flex-1"
        >
          <option value="">All States</option>
          <option value="RUNNING">Running</option>
          <option value="PAUSE">Paused</option>
        </select>


        <div className="relative flex-1">
          <input
            type="date"
            value={filters.dateFrom} // Bind to filters
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="w-full px-4 py-2 border border-secondary  bg-white/5 text-sm focus:outline-none"
          />
        </div>
        <div className="relative flex-1">
          <input
            type="date"
            value={filters.dateTo} // Bind to filters
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="w-full px-4 py-2 border border-secondary  bg-white/5 text-sm focus:outline-none"
          />
        </div>

        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 font-medium transition"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-red-600 text-white  hover:bg-red-700 font-medium transition"
        >
          Reset Filters
        </button>



      </div>

      {/* 📄 Automations List */}
      {loading && automations.length === 0 ? (
        <LoadingSpiner />
      ) : automations.length > 0 ? (
        <div className="space-y-4">
          {automations.map((automation) => (
            <div
              key={automation._id}
              className="p-4 border border-secondary transition hover:bg-white/5"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                {/* Automation Info */}
                <div>
                  <h3 className="text-xl capitalize font-bold mb-1">{automation.instanceName}</h3>
                  <p className="text-gray-400">
                    Workflow: {automation.masterWorkflow?.name || "N/A"}
                  </p>
                  <p className="text-gray-400 font-semibold mt-1">
                    User: {automation.user?.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Email: {automation.user?.email}
                  </p>
                  <p className="text-gray-400 mt-2">Executions: {automation.executionCount}</p>
                  <p className="text-gray-400">System Status: {automation.systemStatus}</p>
                  <p className="text-gray-400">Active State: {automation.isActive}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    Created: {new Date(automation.createdAt).toLocaleDateString()}{" "}
                    {automation.updatedAt !== automation.createdAt && (
                      <>| Updated: {new Date(automation.updatedAt).toLocaleDateString()}</>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col justify-center gap-2">
                  <Link
                    href={`/admin/automation/viewedit?id=${automation._id}`}
                    className="px-4 py-2 rounded-xl bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 font-semibold flex items-center justify-center gap-2"
                  >
                    <FiInfo /> View & Edit
                  </Link>

                  <button
                    onClick={() => deleteAutomation(automation._id)}
                    className="px-4 py-2 rounded-xl bg-red-400/10 text-red-400 hover:bg-red-400/20 font-semibold flex items-center justify-center gap-2"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <h3 className="text-xl font-bold">No automations found.</h3>
          <p>Try adjusting your filters and applying them again.</p>
        </div>
      )}

   
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange} // Use the dedicated page handler
        showPageNumbers
      />
    </div>
  );
}