"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiEye, FiEyeOff, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { admin_contact_delete_api, admin_contact_list_api, admin_contact_update_api } from "@/api";
import Pagination from "@/components/Pagination";

export type Contact = {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "UN_READ" | "READ";
  createdAt: string;
  updatedAt: string;
};

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"UN_READ" | "READ" | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const token = useSelector((state: RootState) => state.user.token);

  const fetchContacts = async (pageNum: number = page) => {
    if (!token) return;
    
    try {
      setLoading(true);
      const { data } = await axios.post(
        admin_contact_list_api, 
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
        setContacts(data.contacts);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(1);
  }, [token, search, statusFilter]);

// Update status - POST method
const updateStatus = async (id: string, newStatus: "UN_READ" | "READ") => {
  if (!token) return;

  try {
    const { data } = await axios.post(
      admin_contact_update_api,
      { status: newStatus,
        id
       },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      setContacts(prev =>
        prev.map(contact =>
          contact._id === id ? { ...contact, status: newStatus } : contact
        )
      );
    }
  } catch (err) {
    console.error("Failed to update status:", err);
  }
};



// Alternative: Delete contact - POST method (with ID in body)
const deleteContact = async (id: string) => {
  if (!token) return;

  if (!confirm("Are you sure you want to delete this contact?")) return;

  try {
    const { data } = await axios.post(
      admin_contact_delete_api,
      { id }, 
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      setContacts(prev => prev.filter(contact => contact._id !== id));
      setTotal(prev => prev - 1);
    }
  } catch (err) {
    console.error("Failed to delete contact:", err);
  }
};

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "READ":
        return <FiEye className="text-green-400" size={18} />;
      case "UN_READ":
        return <FiEyeOff className="text-blue-400" size={18} />;
      default:
        return <FiMail size={18} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "READ":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "UN_READ":
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

  if (loading && contacts.length === 0)
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <motion.div
          // animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-t-secondary border-white rounded-full"
        />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-28 text-white px-6">
      <motion.div
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold mb-2">Contact Messages</h1>
        <p className="text-gray-300">Manage and review contact form submissions</p>
      </motion.div>

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
              placeholder="Search by name, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-secondary transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "UN_READ" | "READ" | "")}
              className="px-4 py-3  border border-white/10 rounded-xl focus:outline-none focus:border-secondary transition"
            >
              <option value="">All Status</option>
              <option value="UN_READ">Unread</option>
              <option value="READ">Read</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <FiMail className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total Messages</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <FiEyeOff className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Unread</p>
              <p className="text-2xl font-bold">
                {contacts.filter(c => c.status === "UN_READ").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-400/10 rounded-lg">
              <FiEye className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Read</p>
              <p className="text-2xl font-bold">
                {contacts.filter(c => c.status === "READ").length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.map((contact, i) => (
          <motion.div
            key={contact._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10 hover:shadow-[0_0_20px_rgba(230,82,31,0.2)] transition"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Contact Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {contact.name}
                    </h3>
                    <p className="text-white font-medium">{contact.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(
                      contact.status
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(contact.status)}
                      {contact.status === "READ" ? "Read" : "Unread"}
                    </div>
                  </span>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">
                  {contact.message}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Received: {formatDate(contact.createdAt)}</span>
                  {contact.updatedAt !== contact.createdAt && (
                    <span>Updated: {formatDate(contact.updatedAt)}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <button
                  onClick={() =>
                    updateStatus(
                      contact._id,
                      contact.status === "READ" ? "UN_READ" : "READ"
                    )
                  }
                  className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
                    contact.status === "READ"
                      ? "bg-blue-400/10 text-blue-400 hover:bg-blue-400/20"
                      : "bg-green-400/10 text-green-400 hover:bg-green-400/20"
                  }`}
                >
                  {contact.status === "READ" ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  {contact.status === "READ" ? "Mark Unread" : "Mark Read"}
                </button>

                <button
                  onClick={() => deleteContact(contact._id)}
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
      {!loading && contacts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FiMail size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No contacts found</h3>
          <p className="text-gray-400">
            {search || statusFilter
              ? "Try adjusting your search or filters"
              : "No contact messages have been submitted yet"}
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