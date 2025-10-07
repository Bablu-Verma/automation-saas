"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiPlay, FiPause, FiEdit, FiTrash2, FiInfo, FiActivity, FiZap, FiUser } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Pagination from "@/components/Pagination";

import Link from "next/link";
import { admin_automation_list_api } from "@/api";

export type Automation = {
  _id: string;
  instanceName: string;
 
  executionCount: number;
  lastExecutedAt: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
};

export default function AdminAutomations() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    totalAutomations: 0,
    activeAutomations: 0,
    totalExecutions: 0
  });
  const limit = 10;

  const token = useSelector((state: RootState) => state.user.token);

  const fetchAutomations = async (pageNum: number = page) => {
    if (!token) return;
    
    try {
      setLoading(true);
      const { data } = await axios.post(
        admin_automation_list_api, 
        {
          page: pageNum,
          limit,
          search,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setAutomations(data.automations);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
        setStats(data.stats || {
          totalAutomations: data.total,
          totalExecutions: data.automations.reduce((sum: number, a: Automation) => sum + a.executionCount, 0)
        });
      }
    } catch (err) {
      console.error("Failed to fetch automations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations(1);
  }, [token, search, statusFilter]);



  // Delete Automation
  const deleteAutomation = async (id: string) => {
    if (!token) return;

    if (!confirm("Are you sure you want to delete this automation? This action cannot be undone.")) return;

    try {
      const { data } = await axios.post(
        '/api/admin/automations/delete', // Your delete API
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setAutomations(prev => prev.filter(auto => auto._id !== id));
        setTotal(prev => prev - 1);
        alert("Automation deleted successfully!");
      }
    } catch (err: any) {
      console.error("Failed to delete automation:", err);
      alert(err.response?.data?.message || "Failed to delete automation");
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

  if (loading && automations.length === 0)
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
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">Automation Management</h1>
        <p className="text-gray-300">Manage and monitor all user automations</p>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by automation name or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-secondary transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-secondary transition"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="paused">Paused</option>
              <option value="error">Error</option>
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
              <FiZap className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total Automations</p>
              <p className="text-2xl font-bold">{stats.totalAutomations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-400/10 rounded-lg">
              <FiPlay className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Active</p>
              <p className="text-2xl font-bold">{stats.activeAutomations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-400/10 rounded-lg">
              <FiActivity className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total Executions</p>
              <p className="text-2xl font-bold">{stats.totalExecutions}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-400/10 rounded-lg">
              <FiUser className="text-orange-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Users with Automations</p>
              <p className="text-2xl font-bold">
                {new Set(automations.map(a => a.user?.email)).size}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Automations List */}
      <div className="space-y-4">
        {automations.map((automation, i) => (
          <motion.div
            key={automation._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10 hover:shadow-[0_0_20px_rgba(230,82,31,0.2)] transition"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Automation Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {automation.instanceName}
                    </h3>
                   
                  </div>
                 
                </div>

                {/* Automation Details */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="font-medium">Workflow:</span>
                    <span>{automation.masterWorkflow?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="font-medium">Executions:</span>
                    <span>{automation.executionCount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="font-medium">Last Run:</span>
                    <span>
                      {automation.lastExecutedAt 
                        ? formatDate(automation.lastExecutedAt)
                        : "Never"
                      }
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Created: {formatDate(automation.createdAt)}</span>
                  {automation.updatedAt !== automation.createdAt && (
                    <span>Updated: {formatDate(automation.updatedAt)}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex lg:flex-col gap-2">
                {/* View Details Button */}
                <Link
                  href={`/admin/automation/view?id=${automation._id}`}
                  className="px-4 py-2 rounded-xl bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 font-semibold transition flex items-center gap-2"
                >
                  <FiInfo size={16} />
                  View Details
                </Link>
                {/* Edit Button */}
                <Link
                  href={`/admin/automation/edit?id=${automation._id}`}
                  className="px-4 py-2 rounded-xl bg-green-400/10 text-green-400 hover:bg-green-400/20 font-semibold transition flex items-center gap-2"
                >
                  <FiEdit size={16} />
                  Edit
                </Link>

                {/* Delete Button */}
                <button
                  onClick={() => deleteAutomation(automation._id)}
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
      {!loading && automations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FiZap size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No automations found</h3>
         
        </motion.div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchAutomations(newPage);
        }}
        showPageNumbers={true}
        compact={false}
      />
    </div>
  );
}