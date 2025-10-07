// User Details & Update Page Component - Edit Mode Focus
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { admin_user_details_api, admin_user_update_api } from "@/api";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiBriefcase, FiPhone, FiMapPin, FiSave, FiEdit, FiArrowLeft, FiShield, FiActivity } from "react-icons/fi";

interface UserDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profile: {
    company: string;
    phoneNumber: string;
    address: string;
  };
  stats: {
    totalAutomations: number;
    activeAutomations: number;
    totalExecutions: number;
    lastActivity: string | null;
    accountAge: number;
  };
  recentAutomations: any[];
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(true); // Default to edit mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    profile: {
      company: "",
      phoneNumber: "",
      address: ""
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const token = useSelector((state: RootState) => state.user.token);

  const fetchUserDetails = async () => {
    if (!token || !id) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        admin_user_details_api,
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setUser(data.user);
        // Pre-fill form with user data
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          role: data.user.role || "user",
          status: data.user.status || "active",
          profile: {
            company: data.user.profile?.company || "",
            phoneNumber: data.user.profile?.phoneNumber || "",
            address: data.user.profile?.address || ""
          }
        });
      }
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateUser = async () => {
    if (!token || !id) return;

    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);
      const { data } = await axios.post(
        admin_user_update_api,
        {
          id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          profile: formData.profile
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        setErrors({});
        alert("User updated successfully!");
      }
    } catch (err: any) {
      console.error("Failed to update user:", err);
      const errorMessage = err.response?.data?.message || "Failed to update user";
      alert(errorMessage);

      // Set specific field errors if available
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser();
  };

  const toggleEditMode = () => {
    if (isEditing && user) {
      // Reset form to original user data when canceling edit
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: {
          company: user.profile?.company || "",
          phoneNumber: user.profile?.phoneNumber || "",
          address: user.profile?.address || ""
        }
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id, token]);

  if (loading) return (
    <div className="h-[50vh] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-12 h-12 border-4 border-t-secondary border-white rounded-full"
      />
    </div>
  );

  if (!user) return (
    <div className="text-center py-12">
      <FiUser size={64} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-bold text-gray-300 mb-2">User not found</h3>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-primary rounded-lg hover:bg-secondary transition"
      >
        Go Back
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-28 text-white px-6">
      {/* Header */}
      <div
        className="mb-8"
      >

        <h1 className="text-3xl font-extrabold">Edit User</h1>
        <p className="text-gray-300">Update user information and permissions</p>

      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FiUser className="text-primary" />
            User Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none transition ${errors.name
                      ? "border-red-500"
                      : isEditing
                        ? "border-white/10 focus:border-secondary"
                        : "border-white/5"
                    } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none transition ${errors.email
                      ? "border-red-500"
                      : isEditing
                        ? "border-white/10 focus:border-secondary"
                        : "border-white/5"
                    } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none transition ${errors.role
                      ? "border-red-500"
                      : isEditing
                        ? "border-white/10 focus:border-secondary"
                        : "border-white/5"
                    } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                </select>
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none transition ${errors.status
                      ? "border-red-500"
                      : isEditing
                        ? "border-white/10 focus:border-secondary"
                        : "border-white/5"
                    } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                  <option value="delete_request">Delete Request</option>
                </select>
                {errors.status && (
                  <p className="text-red-400 text-sm mt-1">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiBriefcase className="text-primary" />
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <FiBriefcase size={14} />
                    Company
                  </label>
                  <input
                    type="text"
                    name="profile.company"
                    value={formData.profile.company}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none transition ${isEditing
                        ? "border-white/10 focus:border-secondary"
                        : "border-white/5"
                      } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                    placeholder="Enter company name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <FiPhone size={14} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="profile.phoneNumber"
                    value={formData.profile.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none transition ${isEditing
                        ? "border-white/10 focus:border-secondary"
                        : "border-white/5"
                      } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <FiMapPin size={14} />
                    Address
                  </label>
                  <textarea
                    name="profile.address"
                    value={formData.profile.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none transition resize-none ${isEditing
                        ? "border-white/10 focus:border-secondary"
                        : "border-white/5"
                      } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-8 py-3 bg-green-500 rounded-xl hover:bg-green-600 transition flex items-center gap-2 font-semibold disabled:opacity-50"
                >
                  <FiSave size={18} />
                  {updating ? "Updating..." : "Update User"}
                </button>

                <button
                  type="button"
                  onClick={toggleEditMode}
                  className="px-6 py-3 bg-gray-500 rounded-xl hover:bg-gray-600 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </motion.div>


      </div>
    </div>
  );
}