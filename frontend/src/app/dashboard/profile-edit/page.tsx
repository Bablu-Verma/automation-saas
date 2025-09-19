"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiUser, FiPhone, FiMapPin, FiBriefcase, FiSave } from "react-icons/fi"

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "Aman Sharma",
    company: "TechFlow",
    phoneNumber: "+91 98765 43210",
    address: "Bangalore, India",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updated Profile:", form)
    // 👉 Yahan tum API call karke DB update kar sakte ho
  }

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
            className="w-full bg-gradient-to-r from-primary to-secondary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_#E6521F] transition"
          >
            <FiSave /> Save Changes
          </button>
        </form>
      </motion.div>
    </div>
  )
}
