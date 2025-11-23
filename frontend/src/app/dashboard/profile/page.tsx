"use client";

// Framer Motion removed from imports
import { FiMail, FiPhone, FiMapPin, FiBriefcase, FiEdit2 } from "react-icons/fi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";

import { IUser } from "@/types";

export default function UserProfile() {

  const user = useSelector((state: RootState) => state.user.user) as IUser | null;

  const cardClasses = `
    rounded-2xl p-8 shadow-md transition-colors duration-500 relative
    
    /* Light Mode Glassmorphism */
    bg-lightBg/80 backdrop-blur-md border border-textLight/10
    
    /* Dark Mode Glassmorphism */
    dark:bg-darkBg/80 dark:border-textDark/10
  `;

  const infoCardClasses = `
    rounded-xl p-6 shadow-md transition-colors duration-500
    
    /* Light Mode Sub Card */
    bg-lightBg/60 border border-textLight/10
    
    /* Dark Mode Sub Card */
    dark:bg-darkBg/60 dark:border-textDark/10
  `;

  const textPrimary = `text-textLight dark:text-textDark`;
  const textSecondary = `text-textLight/70 dark:text-textDark/70`;


  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Profile Card (Framer Motion removed) */}
      <div
        className={cardClasses}
      >
        {/* Edit Profile Button (Universal gradient is fine) */}
        <Link
          href="/dashboard/profile-edit"
          title="Edit Profile"
          className="absolute top-6 right-6 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition duration-300 hover:scale-[1.05]"
        >
          <FiEdit2 /> <span className='hidden sm:inline-block'>Edit Profile</span>
        </Link>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Initial */}
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-4xl font-bold text-white shadow-lg">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            {/* Name Theming */}
            <h1 className={`text-3xl font-extrabold ${textPrimary}`}>{user?.name}</h1>

            {/* Email Theming */}
            <p className={`flex items-center justify-center md:justify-start gap-2 ${textSecondary}`}>
              <FiMail /> {user?.email}
            </p>

            {/* Role/Status Theming */}
            <p className={`flex items-center justify-center md:justify-start gap-2 ${textSecondary}`}>
              <FiBriefcase /> {user?.role?.toUpperCase()} · {user?.status}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info (Framer Motion removed) */}
      <div
        className="grid md:grid-cols-3 gap-6"
      >
        {/* Phone Card */}
        <div className={infoCardClasses}>
          <FiPhone className="text-secondary mb-2" />
          <h3 className={`text-lg font-bold ${textPrimary}`}>Phone</h3>
          <p className={textSecondary}>{user?.profile?.phoneNumber || "N/A"}</p>
        </div>

        {/* Address Card */}
        <div className={infoCardClasses}>
          <FiMapPin className="text-secondary mb-2" />
          <h3 className={`text-lg font-bold ${textPrimary}`}>Address</h3>
          <p className={textSecondary}>{user?.profile?.address || "N/A"}</p>
        </div>

        {/* Company Card */}
        <div className={infoCardClasses}>
          <FiBriefcase className="text-secondary mb-2" />
          <h3 className={`text-lg font-bold ${textPrimary}`}>Company</h3>
          <p className={textSecondary}>{user?.profile?.company || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}