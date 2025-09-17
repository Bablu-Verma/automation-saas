"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome, FaUser, FaFileAlt, FaCog, FaLifeRing, FaSignOutAlt, FaEnvelope, FaUserAlt, FaUikit } from "react-icons/fa"

const links = [
  { href: "/dashboard", label: "Home", icon: <FaHome size={18} /> },
  { href: "/dashboard/requests", label: "My Requests", icon: <FaFileAlt size={18} /> },
  { href: "/dashboard/messages", label: "Messages", icon: <FaEnvelope size={18} /> },
  { href: "/dashboard/profile", label: "Profile", icon: <FaUser size={18} /> },
  { href: "/dashboard/settings", label: "Settings", icon: <FaCog size={18} /> },
  { href: "/dashboard/help", label: "Help & Support", icon: <FaLifeRing size={18} /> },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen border-r border-white/20 bg-white/5 backdrop-blur-lg p-6 flex flex-col">
      {/* Logo / Title */}
      <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-8">
        Dashboard
      </h2>

      {/* Nav Links */}
      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition 
              ${
                pathname === link.href
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
        <Link
           
            href='/admin'
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition 
             text-white/70 hover:text-white hover:bg-white/10`}
          >
            <FaUikit size={18} />
            Admin
          </Link>
      </nav>

      {/* Logout Button */}
      <button
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/70 hover:text-red-400 hover:bg-white/10 transition"
      >
        <FaSignOutAlt size={18} />
        Logout
      </button>
    </aside>
  )
}
