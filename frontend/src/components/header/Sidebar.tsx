"use client"

import { RootState } from "@/redux-store/redux_store"
import { logout } from "@/redux-store/slice/userSlice"
import { IUser } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome, FaUser, FaFileAlt, FaLifeRing, FaSignOutAlt, FaEnvelope, FaUikit, FaBars, FaTimes, FaPlayCircle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"

const links = [
  { href: "/dashboard", label: "Home", icon: <FaHome size={18} /> },
  { href: "/dashboard/profile", label: "Profile", icon: <FaUser size={18} /> },
  { href: "/dashboard/automation", label: "My Automation", icon: <FaFileAlt size={18} /> },
  { href: "/dashboard/billing", label: "Billing", icon: <FaEnvelope size={18} /> },
  { href: "/dashboard/execution", label: "Execution", icon: <FaPlayCircle size={18} /> },
  { href: "/dashboard/help", label: "Help & Support", icon: <FaLifeRing size={18} /> },
]

export default function Sidebar() {
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
      {/* Hamburger button for mobile */}
      {/* <button 
        className="md:hidden fixed top-16 left-4 z-10 p-2 bg-white/10 rounded-md text-white"
        onClick={() => setIsOpen(true)}
      >
        <FaBars size={24} />
      </button> */}

      {/* Overlay */}
      {/* <div 
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      /> */}

      {/* Sidebar */}
      <aside className={`
     hidden md:flex
  bg-white/5 backdrop-blur-lg p-6 pt-18 md:pt-6 flex-col
  border-r border-white/20 h-screen
  transform transition-transform duration-300
  md:translate-x-0 md:sticky top-0
      `}>
        {/* Close button for mobile */}
        <div className="mb-8 flex justify-between items-center">
      
        {/* Logo / Title */}
        <h2 className="text-2xl font-extrabold text-white ">
          Dashboard
        </h2>

        
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-auto">
          {links.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition 
                ${pathname === link.href
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
            
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <Link
              href='/admin'
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/70 hover:text-white hover:bg-white/10"
        
            >
              <FaUikit size={18} />
              Admin
            </Link>
          )}
        </nav>

        {/* Logout */}
        <button
          onClick={logOut_user}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/70 hover:text-red-400 hover:bg-white/10 transition mt-4"
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>
      </aside>
    </>
  )
}
