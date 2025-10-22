"use client";

import { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiTrash2, FiSearch } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { admin_contact_delete_api, admin_contact_list_api, admin_contact_update_api } from "@/api";
import Pagination from "@/components/Pagination";
import LoadingSpiner from "../_components/LoadingSpiner";

export type Contact = {
  _id: string;
  name: string;
  email: string;
  message: string;
  number: string;
  subject: string;
  status: "UN_READ" | "READ";
  createdAt: string;
  updatedAt: string;
};

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Simple filter state
  const [filters, setFilters] = useState({
    search: "",
    status: "" as "UN_READ" | "READ" | "",
    dateFrom: "",
    dateTo: ""
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const token = useSelector((state: RootState) => state.user.token);

  const fetchContacts = async (pageNum: number = page) => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.post(
        admin_contact_list_api,
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
        setContacts(data.contacts);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setPage(data.pagination.page);
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(1);
  }, [token, appliedFilters]);

  useEffect(() => {
    fetchContacts(page);
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

  const updateStatus = async (id: string, newStatus: "UN_READ" | "READ") => {
    if (!token) return;
    try {
      const { data } = await axios.post(
        admin_contact_update_api,
        { status: newStatus, id },
        { headers: { Authorization: `Bearer ${token}` } }
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

  const deleteContact = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      const { data } = await axios.post(
        admin_contact_delete_api,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setContacts(prev => prev.filter(contact => contact._id !== id));
        setTotal(prev => prev - 1);
        fetchContacts(page);
      }
    } catch (err) {
      console.error("Failed to delete contact:", err);
    }
  };

  if (loading && contacts.length === 0) return <LoadingSpiner />;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <div className="text-sm text-gray-500">
          Total: {total} messages
        </div>
      </div>

      {/* Simple Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
        <div className="col-span-2 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as "UN_READ" | "READ" | "" })}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="UN_READ">Unread</option>
          <option value="READ">Read</option>
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

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No contact messages found</p>
          </div>
        ) : (
          contacts.map(contact => (
            <div key={contact._id} className="p-4 bg-white border rounded hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{contact.name}</h3> 
                  <p className="text-gray-600 text-sm">{contact.email} - {contact.number}</p> 
                </div>
                <span className={`text-sm px-2 py-1 border rounded ${
                  contact.status === "READ" 
                    ? "bg-blue-50 text-blue-700 border-blue-200" 
                    : "bg-green-50 text-green-700 border-green-200"
                }`}>
                  {contact.status === "READ" ? "Read" : "Unread"}
                </span>
              </div>
              <p className="mb-1 text-gray-700 text-sm capitalize">Subject: {contact.subject}</p>
              <p className="mb-2 text-gray-700 text-sm ">{contact.message}</p>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span>Received: {new Date(contact.createdAt).toLocaleDateString()}</span>
                  {contact.updatedAt !== contact.createdAt && (
                    <span className="ml-3">Updated: {new Date(contact.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(contact._id, contact.status === "READ" ? "UN_READ" : "READ")}
                    className={`px-3 py-1 border rounded text-sm flex items-center gap-1 ${
                      contact.status === "READ" 
                        ? "border-blue-500 text-blue-700 hover:bg-blue-50" 
                        : "border-green-500 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    {contact.status === "READ" ? <FiEyeOff /> : <FiEye />}
                    {contact.status === "READ" ? "Mark Unread" : "Mark Read"}
                  </button>

                  <button
                    onClick={() => deleteContact(contact._id)}
                    className="px-3 py-1 border border-red-500 text-red-700 rounded text-sm hover:bg-red-50 flex items-center gap-1"
                  >
                    <FiTrash2 />
                    Delete
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