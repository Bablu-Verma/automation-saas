"use client";

import { FiMail, FiPhone, FiMapPin, FiBriefcase, FiEdit2 } from "react-icons/fi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { IUser } from "@/types";

export default function UserProfile() {

  const user = useSelector((state: RootState) => state.user.user) as IUser | null;

  const sectionWrapper = `
    p-6
    bg-lightBg dark:bg-darkBg
  `;

  const infoCard = `
    p-5 rounded-lg
    border border-black/5 dark:border-white/10
  `;

  const textPrimary = `text-textLight dark:text-textDark`;
  const textSecondary = `text-textLight/70 dark:text-textDark/70`;

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Profile Section */}
      <div className={sectionWrapper}>

        {/* Edit Button (Simple Version) */}
        <div className="flex justify-end mb-4">
          <Link
            href="/dashboard/profile-edit"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <FiEdit2 size={16} /> Edit Profile
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

          {/* Avatar */}
          <div className="w-16 h-16 flex items-center justify-center 
            rounded-full bg-primary/10 text-primary text-xl font-semibold">
            {user?.name?.charAt(0)}
          </div>

          <div className="flex-1 text-center md:text-left">

            <h1 className={`text-2xl font-semibold ${textPrimary}`}>
              {user?.name}
            </h1>

            <p className={`mt-1 flex items-center justify-center md:justify-start gap-2 text-sm ${textSecondary}`}>
              <FiMail size={14} /> {user?.email}
            </p>

            <p className={`mt-1 flex items-center justify-center md:justify-start gap-2 text-sm ${textSecondary}`}>
              <FiBriefcase size={14} /> {user?.role?.toUpperCase()} · {user?.status}
            </p>

          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid md:grid-cols-3 gap-5">

        <div className={infoCard}>
          <FiPhone className="mb-2 text-primary" size={18} />
          <h3 className={`text-base font-medium ${textPrimary}`}>Phone</h3>
          <p className={`text-sm ${textSecondary}`}>
            {user?.profile?.phoneNumber || "N/A"}
          </p>
        </div>

        <div className={infoCard}>
          <FiMapPin className="mb-2 text-primary" size={18} />
          <h3 className={`text-base font-medium ${textPrimary}`}>Address</h3>
          <p className={`text-sm ${textSecondary}`}>
            {user?.profile?.address || "N/A"}
          </p>
        </div>

        <div className={infoCard}>
          <FiBriefcase className="mb-2 text-primary" size={18} />
          <h3 className={`text-base font-medium ${textPrimary}`}>Company</h3>
          <p className={`text-sm ${textSecondary}`}>
            {user?.profile?.company || "N/A"}
          </p>
        </div>

      </div>
    </div>
  );
}