"use client";

import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiBriefcase, FiEdit2 } from "react-icons/fi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";


import { IUser } from "@/types";



export default function UserProfile() {

  
  //  const token = useSelector((state: RootState) => state.user.token);

   const user = useSelector((state: RootState) => state.user.user) as IUser | null;


  //  console.log('user',user)
 
 

  return (
    <div className="max-w-6xl mx-auto space-y-5 text-white">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/10 relative"
      >
        {/* Edit Profile Button */}
        <Link
          href="/dashboard/profile-edit"
          className="absolute top-6 right-6 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition duration-300"
        >
          <FiEdit2 /> Edit Profile
        </Link>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-4xl font-bold shadow-lg">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold">{user?.name}</h1>
            <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
              <FiMail /> {user?.email}
            </p>
            <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
              <FiBriefcase /> {user?.role?.toUpperCase()} · {user?.status}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <FiPhone className="text-secondary mb-2" />
          <h3 className="text-lg font-bold">Phone</h3>
          <p className="text-gray-300">{user?.profile?.phoneNumber || "N/A"}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <FiMapPin className="text-secondary mb-2" />
          <h3 className="text-lg font-bold">Address</h3>
          <p className="text-gray-300">{user?.profile?.address || "N/A"}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <FiBriefcase className="text-secondary mb-2" />
          <h3 className="text-lg font-bold">Company</h3>
          <p className="text-gray-300">{user?.profile?.company || "N/A"}</p>
        </div>
      </motion.div>
    </div>
  );
}
