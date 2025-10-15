"use client";

import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { admin_newsletter_delete_api, admin_newsletter_list_api } from "@/api";
import Pagination from "@/components/Pagination";
import LoadingSpiner from "../_components/LoadingSpiner";

export type Subscriber = {
  _id: string;
  email: string;
  status: "SUBSCRIBED" | "UNSUBSCRIBED";
  createdAt: string;
  updatedAt: string;
};

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    inactiveSubscribers: 0
  });

  // Simple filter state
  const [filters, setFilters] = useState({
    search: "",
    status: "" as "SUBSCRIBED" | "UNSUBSCRIBED" | "",
    dateFrom: "",
    dateTo: ""
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const token = useSelector((state: RootState) => state.user.token);

  const fetchSubscribers = async (pageNum: number = page) => {
    if (!token) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        admin_newsletter_list_api,
        {
          page: pageNum,
          limit: 10,
          search: appliedFilters.search || undefined,
          status: appliedFilters.status || undefined,
          fromDate: appliedFilters.dateFrom || undefined,
          toDate: appliedFilters.dateTo || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setSubscribers(data.subscribers);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setPage(data.pagination.page);
        
        // Set statistics from API response
        if (data.statistics) {
          setStats(data.statistics);
        }
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(1);
  }, [token, appliedFilters]);

  useEffect(() => {
    fetchSubscribers(page);
  }, [page]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: "",
      status: "",
      dateFrom: "",
      dateTo: ""
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setPage(1);
  };

  const deleteSubscriber = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const { data } = await axios.post(
        admin_newsletter_delete_api,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setSubscribers(prev => prev.filter(sub => sub._id !== id));
        setTotal(prev => prev - 1);
        // Refresh the data
        fetchSubscribers(page);
      }
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
      alert("Failed to delete subscriber");
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading && subscribers.length === 0) return <LoadingSpiner />;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Newsletter Subscribers</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-white border rounded text-center">
          <p className="text-gray-500 text-sm">Total Subscribers</p>
          <p className="text-lg font-bold">{stats.totalSubscribers}</p>
        </div>
        <div className="p-4 bg-white border rounded text-center">
          <p className="text-gray-500 text-sm">Subscribed</p>
          <p className="text-lg font-bold">{stats.activeSubscribers}</p>
        </div>
        <div className="p-4 bg-white border rounded text-center">
          <p className="text-gray-500 text-sm">Unsubscribed</p>
          <p className="text-lg font-bold">{stats.inactiveSubscribers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Search by email..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value as "SUBSCRIBED" | "UNSUBSCRIBED" | "" })}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="SUBSCRIBED">Subscribed</option>
          <option value="UNSUBSCRIBED">Unsubscribed</option>
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="From Date"
        />
        
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="To Date"
        />

        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Apply Filters
        </button>
        
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Subscribers List */}
      <div className="space-y-4">
        {subscribers.length === 0 ? (
          <div className="text-center py-12 bg-white border rounded">
            <p className="text-gray-500 text-lg">No subscribers found</p>
           
          </div>
        ) : (
          subscribers.map(sub => (
            <div key={sub._id} className="p-4 bg-white border rounded hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="font-semibold text-lg">{sub.email}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span>Joined: {formatDate(sub.createdAt)}</span>
                    {sub.updatedAt !== sub.createdAt && (
                      <span className="ml-4">Updated: {formatDate(sub.updatedAt)}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-sm px-3 py-1 border rounded-full ${
                    sub.status === "SUBSCRIBED" 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {sub.status === "SUBSCRIBED" ? "Subscribed" : "Unsubscribed"}
                  </span>
                  
                  <button
                    onClick={() => deleteSubscriber(sub._id)}
                    className="p-2 border border-red-500 text-red-700 rounded hover:bg-red-50 transition-colors"
                    title="Delete subscriber"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

     <div className="mt-6">
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        </div>
    </div>
  );
}