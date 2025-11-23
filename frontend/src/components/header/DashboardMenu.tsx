"use client"

import { RootState } from "@/redux-store/redux_store"
import { logout } from "@/redux-store/slice/userSlice"
import { IUser } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome, FaUser, FaFileAlt, FaLifeRing, FaSignOutAlt, FaEnvelope, FaUikit, FaPlayCircle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"


const links = [
  { href: "/dashboard", label: "Home", icon: <FaHome size={18} /> },
  { href: "/dashboard/profile", label: "Profile", icon: <FaUser size={18} /> },
  { href: "/dashboard/automation", label: "My Automation", icon: <FaFileAlt size={18} /> },
  { href: "/dashboard/billing", label: "Billing", icon: <FaEnvelope size={18} /> },
  { href: "/dashboard/execution", label: "Execution", icon: <FaPlayCircle size={18} /> },
  { href: "/dashboard/help", label: "Help & Support", icon: <FaLifeRing size={18} /> },
]

export default function DashboardMenu() {
  const pathname = usePathname()
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user) as IUser | null;


  const logOut_user = () => {
    setTimeout(() => {
      dispatch(logout());
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <>
      {/* ✨ मुख्य सुधार: 
        1. bg-lightBg/80 dark:bg-darkBg/80 का उपयोग, ताकि यह थीम-अवेयर हो।
        2. बॉर्डर और टेक्स्ट कलर भी थीम-अवेयर हैं।
      */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 p-6 pt-18 md:pt-6 flex flex-col
        z-30 transform transition-transform duration-300 overflow-y-auto
        md:translate-x-0 md:sticky md:flex md:top-0
        
        /* Light Mode Glassmorphism */
        bg-lightBg/80 backdrop-blur-md border-r border-textLight/10 text-textLight
        
        /* Dark Mode Glassmorphism */
        dark:bg-darkBg/80 dark:border-r dark:border-textDark/10 dark:text-textDark
      `}>
        {/* Scrollbar hide (Optional, depends on your custom CSS) */}
        <div className="sidebar_">

          <div className="mb-8 flex justify-between items-center">

            {/* Text color now uses text-textLight dark:text-textDark */}
            <h2 className="text-2xl font-extrabold text-textLight dark:text-textDark">
              Dashboard
            </h2>

          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {links.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition 
  ${pathname === link.href
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                    : "text-textLight/70 dark:text-textDark/70 hover:text-primary dark:hover:text-primary hover:bg-lightBg/50 dark:hover:bg-darkBg/50"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {user?.role === 'admin' && (
              <Link
                href='/admin'
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition 
                    ${pathname === '/admin'
                    ? "bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-secondary/20"
                    : "text-textLight/70 dark:text-textDark/70 hover:text-secondary dark:hover:text-secondary hover:bg-lightBg/50 dark:hover:bg-darkBg/50"
                  }`}
              >
                <FaUikit size={18} />
                Admin
              </Link>
            )}
          </nav>

          {/* Logout */}
          <button
            onClick={logOut_user}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition mt-4 
                text-textLight/70 dark:text-textDark/70 hover:text-red-600 dark:hover:text-red-400 hover:bg-lightBg/50 dark:hover:bg-darkBg/50"
          >
            <FaSignOutAlt size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}