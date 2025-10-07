"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiEye, FiEyeOff, FiTrash2, FiSearch, FiFilter, FiUser, FiUserCheck, FiUserX, FiShield, FiEdit, FiInfo } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Pagination from "@/components/Pagination";
import { admin_user_list_api } from "@/api";
import Link from "next/link";

export type User = {
  _id: string;
  name: string;
  email: string;
  profile: {
    company: string;
    phoneNumber: string;
    address: string;
  };
  status: 'active' | 'inactive' | 'banned' | 'delete_request' | 'deleted';
  role: 'user' | 'admin' | 'developer';
  createdAt: string;
  updatedAt: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const token = useSelector((state: RootState) => state.user.token);

  const fetchUsers = async (pageNum: number = page) => {
    if (!token) return;
    
    try {
      setLoading(true);
      const { data } = await axios.post(
        admin_user_list_api, 
        {
          page: pageNum,
          limit,
          search,
          status: statusFilter || undefined,
          role: roleFilter || undefined,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setUsers(data.users);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [token, search, statusFilter, roleFilter]);

  


  // Delete User Function
  const deleteUser = async (id: string) => {
    if (!token) return;

    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const { data } = await axios.post(
        '', // Use your actual delete API endpoint
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Remove user from local state
        setUsers(prev => prev.filter(user => user._id !== id));
        setTotal(prev => prev - 1);
        
        // Show success message
        alert("User deleted successfully!");
        
        // Refresh the list if needed
        // fetchUsers(page);
      }
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <FiUserCheck className="text-green-400" size={18} />;
      case "inactive":
        return <FiUser className="text-blue-400" size={18} />;
      case "banned":
        return <FiUserX className="text-red-400" size={18} />;
      case "delete_request":
        return <FiTrash2 className="text-orange-400" size={18} />;
      default:
        return <FiUser size={18} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "inactive":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "banned":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "delete_request":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <FiShield className="text-purple-400" size={16} />;
      case "developer":
        return <FiUserCheck className="text-blue-400" size={16} />;
      default:
        return <FiUser className="text-gray-400" size={16} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case "developer":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
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

  if (loading && users.length === 0)
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
      <div
       
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold mb-2">User Management</h1>
        <p className="text-gray-300">Manage and monitor user accounts and permissions</p>
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
              placeholder="Search by name, email, or company..."
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
              <option value="banned">Banned</option>
              <option value="delete_request">Delete Request</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-secondary transition"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
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
              <FiUser className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total Users</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-400/10 rounded-lg">
              <FiUserCheck className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Active</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-400/10 rounded-lg">
              <FiUserX className="text-red-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Banned</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.status === "banned").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-400/10 rounded-lg">
              <FiShield className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Admins</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.role === "admin").length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Users List */}
      <div className="space-y-4">
        {users.map((user, i) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10 hover:shadow-[0_0_20px_rgba(230,82,31,0.2)] transition"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {user.name}
                    </h3>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span
                      className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(
                        user.status
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1).replace('_', ' ')}
                      </div>
                    </span>
                    <span
                      className={`px-3 py-1 text-sm rounded-full border ${getRoleColor(
                        user.role
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {user.profile.company && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="font-medium">Company:</span>
                      <span>{user.profile.company}</span>
                    </div>
                  )}
                  {user.profile.phoneNumber && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="font-medium">Phone:</span>
                      <span>{user.profile.phoneNumber}</span>
                    </div>
                  )}
                  {user.profile.address && (
                    <div className="flex items-center gap-2 text-gray-300 md:col-span-2">
                      <span className="font-medium">Address:</span>
                      <span>{user.profile.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Joined: {formatDate(user.createdAt)}</span>
                  {user.updatedAt !== user.createdAt && (
                    <span>Updated: {formatDate(user.updatedAt)}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex lg:flex-col gap-2">
                {/* View Details Button */}
                <Link
                 href={`/admin/user/view?id=${user._id}`}
                 
                  className="px-4 py-2 rounded-xl bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 font-semibold transition flex items-center gap-2"
                >
                  <FiInfo size={16} />
                  View Details
                </Link>

                {/* Edit Button */}
                <Link
                href={`/admin/user/edit?id=${user._id}`}
                 
                  className="px-4 py-2 rounded-xl bg-green-400/10 text-green-400 hover:bg-green-400/20 font-semibold transition flex items-center gap-2"
                >
                  <FiEdit size={16} />
                  Edit
                </Link>

                {/* Delete Button */}
                <button
                  onClick={() => deleteUser(user._id)}
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
      {!loading && users.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FiUser size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No users found</h3>
          <p className="text-gray-400">
            {search || statusFilter || roleFilter
              ? "Try adjusting your search or filters"
              : "No users have been registered yet"}
          </p>
        </motion.div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchUsers(newPage);
        }}
        showPageNumbers={true}
        compact={false}
      />
    </div>
  );
}