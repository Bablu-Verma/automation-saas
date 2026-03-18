"use client";

import { useState, useEffect } from "react";
import { FiUser, FiPhone, FiMapPin, FiBriefcase, FiSave } from "react-icons/fi";
import axios from "axios";
import { user_profile_update_api } from "@/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { IUser } from "@/types";
import toast from "react-hot-toast";
import { login } from "@/redux-store/slice/userSlice";
import { setClientCookie } from "@/helpers/client";

export default function EditProfile() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user) as IUser | null;

  const [form, setForm] = useState({
    name: "",
    company: "",
    phoneNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user?.name || "",
        company: user.profile?.company || "",
        phoneNumber: user.profile?.phoneNumber || "",
        address: user.profile?.address || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Unauthorized: No token found");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        user_profile_update_api,
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(login({ user: data.user, token: data.token }));
      setClientCookie("token", data.token, 60 * 24 * 5);
      setClientCookie("user", JSON.stringify(data.user), 60 * 24 * 5);

      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Simple container
  const cardClasses = `
    p-6
    border border-black/5 dark:border-white/10
    rounded-xl
    bg-lightBg dark:bg-darkBg
  `;

  // ✅ Simple input wrapper
  const inputContainer = `
    flex items-center gap-2
    border border-black/10 dark:border-white/10
    rounded-md px-3 py-2
    bg-transparent
  `;

  const inputField = `
    flex-1 bg-transparent outline-none
    text-sm text-textLight dark:text-textDark
    placeholder:text-textLight/50 dark:placeholder:text-textDark/50
  `;

  const textPrimary = `text-textLight dark:text-textDark`;
  const textSecondary = `text-textLight/70 dark:text-textDark/70`;

  return (
    <div className="max-w-2xl mx-auto pt-12">
      <div className={cardClasses}>

        <h1 className={`text-2xl font-semibold mb-6 ${textPrimary}`}>
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className={`block mb-1 text-sm ${textSecondary}`}>
              Name
            </label>
            <div className={inputContainer}>
              <FiUser size={16} className="text-textLight/60 dark:text-textDark/60" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputField}
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className={`block mb-1 text-sm ${textSecondary}`}>
              Company
            </label>
            <div className={inputContainer}>
              <FiBriefcase size={16} className="text-textLight/60 dark:text-textDark/60" />
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                className={inputField}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={`block mb-1 text-sm ${textSecondary}`}>
              Phone Number
            </label>
            <div className={inputContainer}>
              <FiPhone size={16} className="text-textLight/60 dark:text-textDark/60" />
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Your phone number"
                className={inputField}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={`block mb-1 text-sm ${textSecondary}`}>
              Address
            </label>
            <div className={inputContainer}>
              <FiMapPin size={16} className="text-textLight/60 dark:text-textDark/60" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Your address"
                className={inputField}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-5 py-2 rounded-md bg-primary text-white text-sm font-medium 
              hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}