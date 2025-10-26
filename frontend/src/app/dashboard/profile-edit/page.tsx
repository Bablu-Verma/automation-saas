"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  return (
    <div className="max-w-3xl mx-auto text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/10"
      >
        <h1 className="text-3xl font-extrabold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-2 font-semibold">Name</label>
            <div className="flex items-center bg-white/10 rounded-xl px-4 py-2">
              <FiUser className="text-secondary mr-2" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="bg-transparent outline-none flex-1"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block mb-2 font-semibold">Company</label>
            <div className="flex items-center bg-white/10 rounded-xl px-4 py-2">
              <FiBriefcase className="text-secondary mr-2" />
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="bg-transparent outline-none flex-1"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 font-semibold">Phone Number</label>
            <div className="flex items-center bg-white/10 rounded-xl px-4 py-2">
              <FiPhone className="text-secondary mr-2" />
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="bg-transparent outline-none flex-1"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 font-semibold">Address</label>
            <div className="flex items-center bg-white/10 rounded-xl px-4 py-2">
              <FiMapPin className="text-secondary mr-2" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="bg-transparent outline-none flex-1"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_#E6521F]"
            }`}
          >
            <FiSave /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
