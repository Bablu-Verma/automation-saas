"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { admin_user_details_api, admin_user_update_api } from "@/api";
import toast from "react-hot-toast";

export default function UserDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = useSelector((state: RootState) => state.user.token);

  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
    profile: { company: "", phoneNumber: "", address: "" }
  });

  // Fetch user details
  const fetchUserDetails = async () => {
    if (!token || !id) return;
    try {
      const { data } = await axios.post(
        admin_user_details_api,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        const u = data.user;
        setFormData({
          name: u.name || "",
          email: u.email || "",
          role: u.role || "user",
          status: u.status || "active",
          profile: {
            company: u.profile?.company || "",
            phoneNumber: u.profile?.phoneNumber || "",
            address: u.profile?.address || ""
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const updateUser = async () => {
    if (!token || !id) return;
    try {
      setUpdating(true);
      const { data } = await axios.post(
        admin_user_update_api,
        { id, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) toast.success("User updated successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update user";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* Role & Status */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">Role</label>
            <select name="role" value={formData.role} onChange={handleInputChange} className="w-full border px-2 py-1 rounded">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border px-2 py-1 rounded">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
              <option value="delete_request">Delete Request</option>
            </select>
          </div>
        </div>

        {/* Profile */}
        <div>
          <label className="block text-sm mb-1">Company</label>
          <input name="profile.company" value={formData.profile.company} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone Number</label>
          <input name="profile.phoneNumber" value={formData.profile.phoneNumber} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Address</label>
          <textarea name="profile.address" value={formData.profile.address} onChange={handleInputChange} rows={3} className="w-full border px-2 py-1 rounded" />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={updating}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
}
