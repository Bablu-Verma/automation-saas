"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiMail, FiSearch, FiCheckCircle, FiXCircle, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { admin_newsletter_delete_api, admin_newsletter_list_api } from "@/api";
import Pagination from "@/components/Pagination";

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
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"SUBSCRIBED" | "UNSUBSCRIBED" | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user);

  const fetchSubscribers = async (pageNum: number = page) => {
    if (!token || !user) {
      setError("Please log in to access this page");
      setLoading(false);
      return;
    }

    if (user.role !== "admin") {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const { data } = await axios.post(
        admin_newsletter_list_api, // Update with your actual API endpoint
        {
          page: pageNum,
          limit,
          search,
          status: statusFilter || undefined,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setSubscribers(data.subscribers);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
      } else {
        setError(data.message || "Failed to fetch subscribers");
      }
    } catch (err: any) {
      console.error("Failed to fetch subscribers:", err);
      
      if (err.response?.status === 403) {
        setError("Access denied. You don't have admin privileges.");
      } else if (err.response?.status === 401) {
        setError("Please log in to access this page");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch subscribers. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(1);
  }, [token, user, search, statusFilter]);

  const deleteSubscriber = async (id: string) => {
    if (!token) return;

    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const { data } = await axios.post(
        admin_newsletter_delete_api,
        {id},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setSubscribers(prev => prev.filter(subscriber => subscriber._id !== id));
        setTotal(prev => prev - 1);
      }
    } catch (err: any) {
      console.error("Failed to delete subscriber:", err);
      alert(err.response?.data?.message || "Failed to delete subscriber");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBSCRIBED":
        return <FiCheckCircle className="text-green-400" size={18} />;
      case "UNSUBSCRIBED":
        return <FiXCircle className="text-red-400" size={18} />;
      default:
        return <FiMail size={18} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBSCRIBED":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "UNSUBSCRIBED":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && subscribers.length === 0)
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
      <div className="mb-8" >
        <h1 className="text-3xl font-extrabold mb-2">Newsletter Subscribers</h1>
        <p className="text-gray-300">Manage your newsletter email subscribers</p>
      </div>

      {/* Filters and Search */}
      <motion.div
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-secondary transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "SUBSCRIBED" | "UNSUBSCRIBED" | "")}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-secondary transition"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <FiUsers className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total Subscribers</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-400/10 rounded-lg">
              <FiCheckCircle className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Active</p>
              <p className="text-2xl font-bold">
                {subscribers.filter(s => s.status === "SUBSCRIBED").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-400/10 rounded-lg">
              <FiXCircle className="text-red-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Inactive</p>
              <p className="text-2xl font-bold">
                {subscribers.filter(s => s.status === "UNSUBSCRIBED").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-400/10 rounded-lg">
              <FiMail className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">This Page</p>
              <p className="text-2xl font-bold">{subscribers.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subscribers List */}
      <div className="space-y-4">
        {subscribers.map((subscriber, i) => (
          <motion.div
            key={subscriber._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10 hover:shadow-[0_0_20px_rgba(230,82,31,0.2)] transition"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Subscriber Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {subscriber.email}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Joined: {formatDate(subscriber.createdAt)}</span>
                      {subscriber.updatedAt !== subscriber.createdAt && (
                        <span>Updated: {formatDate(subscriber.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(
                      subscriber.status
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(subscriber.status)}
                      {subscriber.status === "SUBSCRIBED" ? "SUBSCRIBED" : "UNSUBSCRIBED"}
                    </div>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-300">ID: {subscriber._id}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <button
                  onClick={() => deleteSubscriber(subscriber._id)}
                  className="px-4 py-2 rounded-xl bg-red-400/10 text-red-400 hover:bg-red-400/20 font-semibold transition flex items-center gap-2"
                >
                  <FiTrash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {!loading && subscribers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FiUsers size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No subscribers found</h3>
          <p className="text-gray-400">
            {search || statusFilter
              ? "Try adjusting your search or filters"
              : "No newsletter subscribers yet"}
          </p>
        </motion.div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        showPageNumbers={true}
        compact={false}
      />
    </div>
  );
}