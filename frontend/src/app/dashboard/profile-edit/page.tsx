"use client";

import { useState, useEffect } from "react";
// Framer Motion removed from imports
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


  // 🔹 Prefill form with Redux user data
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
            Authorization: `Bearer ${token}`, // ✅ Send token
          },
        }
      );

      console.log(data)
      dispatch(login({ user: data.user, token: data.token }))
      setClientCookie("token", data.token, 60 * 24 * 5)
      setClientCookie("user", JSON.stringify(data.user), 60 * 24 * 5)
      toast.success("Profile updated successfully");
      
    } catch (err: any) {
      console.error("Profile update failed:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };


  // --- Reusable Card Container Class (Glassmorphism) ---
  const cardClasses = `
    rounded-2xl p-8 shadow-lg transition-colors duration-500
    
    /* Light Mode Glassmorphism */
    bg-lightBg/80 backdrop-blur-md border border-textLight/10
    
    /* Dark Mode Glassmorphism */
    dark:bg-darkBg/80 dark:border-textDark/10
  `;

  // --- Reusable Input Container Class (Themed input look) ---
  const inputContainerClasses = `
    flex items-center rounded-xl px-4 py-2 transition border border-textLight/20 dark:border-textDark/20
    
    /* Light Mode */
    bg-lightBg/50 
    
    /* Dark Mode */
    dark:bg-darkBg/50
    focus-within:ring-2 focus-within:ring-primary
  `;

  // --- Reusable Input Field Class ---
  const inputFieldClasses = `
    bg-transparent outline-none flex-1 text-textLight dark:text-textDark placeholder-textLight/60 dark:placeholder-textDark/60
  `;

  const textPrimary = `text-textLight dark:text-textDark`;
  const textSecondary = `text-textLight/80 dark:text-textDark/80`;


  return (
    <div className="max-w-3xl pt-16 mx-auto">
      {/* Profile Card (Framer Motion removed) */}
      <div
        className={cardClasses}
      >
        <h1 className={`text-3xl font-extrabold mb-6 ${textPrimary}`}>Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name */}
          <div>
            <label className={`block mb-2 font-semibold ${textSecondary}`}>Name</label>
            <div className={inputContainerClasses}>
              <FiUser className="text-secondary mr-2" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputFieldClasses}
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className={`block mb-2 font-semibold ${textSecondary}`}>Company</label>
            <div className={inputContainerClasses}>
              <FiBriefcase className="text-secondary mr-2" />
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                className={inputFieldClasses}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={`block mb-2 font-semibold ${textSecondary}`}>Phone Number</label>
            <div className={inputContainerClasses}>
              <FiPhone className="text-secondary mr-2" />
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Your phone number"
                className={inputFieldClasses}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={`block mb-2 font-semibold ${textSecondary}`}>Address</label>
            <div className={inputContainerClasses}>
              <FiMapPin className="text-secondary mr-2" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Your address"
                className={inputFieldClasses}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 max-w-[350px] rounded-full mx-auto font-semibold flex items-center justify-center gap-2 transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg ${
              loading
                ? "bg-gray-600"
                : "bg-gradient-to-r from-primary to-secondary hover:shadow-2xl"
            }`}
          >
            <FiSave /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}