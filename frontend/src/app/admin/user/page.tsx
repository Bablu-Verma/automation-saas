"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux-store/redux_store"
import axios from "axios"
import Pagination from "@/components/Pagination"
import LoadingSpiner from "../_components/LoadingSpiner"
import { admin_user_list_api } from "@/api"
import Link from "next/link"

type User = {
  _id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  createdAt: string
  profile?: {
    company?: string
  }
}

export default function AdminUsers() {
  const token = useSelector((state: RootState) => state.user.token)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  })

  // Single filter object
  const [filters, setFilters] = useState({
    search: "",
    status: "" as User["status"] | "",
    role: "" as string,
    dateFrom: "",
    dateTo: ""
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)

  const fetchUsers = async (pageNum: number = page) => {
    if (!token) return
    try {
      setLoading(true)
      const { data } = await axios.post(admin_user_list_api, {
        page: pageNum,
        limit: 20,
        ...Object.fromEntries(
          Object.entries(appliedFilters).filter(([_, v]) => v)
        )
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setUsers(data.users || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setStatistics(data.statistics)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(page)
  }, [token, page, appliedFilters])


  if (loading) return <LoadingSpiner />

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-gray-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-lg font-semibold">{statistics.totalUsers}</div>
          <div className="text-gray-500 text-sm">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-lg font-semibold">{statistics.activeUsers}</div>
          <div className="text-gray-500 text-sm">Active Users</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-lg font-semibold">{statistics.inactiveUsers}</div>
          <div className="text-gray-500 text-sm">Inactive Users</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-lg font-semibold">{statistics.adminUsers}</div>
          <div className="text-gray-500 text-sm">Admin Users</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-lg font-semibold">{statistics.regularUsers}</div>
          <div className="text-gray-500 text-sm">Regular Users</div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by ID / Name / Email / Company"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="p-2 border border-gray-300 rounded col-span-1 md:col-span-2"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as User["status"] | "" })}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
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
          onClick={() => {
            setAppliedFilters(filters)
            setPage(1)
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
        <button
          onClick={() => {
            setFilters({ search: "", status: "", role: "", dateFrom: "", dateTo: "" })
            setAppliedFilters({ search: "", status: "", role: "", dateFrom: "", dateTo: "" })
            setPage(1)
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {/* Users List */}
      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-center py-12 text-gray-700">No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="p-4 bg-white border rounded flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{user.name} ({user._id})</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                {user.profile?.company && (
                  <div className="text-sm text-gray-600">Company: {user.profile.company}</div>
                )}
                <div className="text-sm text-gray-600">Role: {user.role} | Status: {user.status}</div>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/user/view?id=${user._id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  View
                </Link>
                <Link href={`/admin/user/edit?id=${user._id}`} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
