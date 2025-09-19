"use client"


import { RootState } from "@/redux-store/redux_store"
import { IUser } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome, FaUser, FaFileAlt, FaCog, FaLifeRing, FaSignOutAlt, FaEnvelope, FaUserAlt, FaUikit } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"

const links = [
  { href: "/admin", label: "Home", icon: <FaHome size={18} /> },
  { href: "/admin/user", label: "Users", icon: <FaUser size={18} /> },
  { href: "/admin/service", label: "service", icon: <FaFileAlt size={18} /> },
  { href: "/admin/instance", label: "Instance", icon: <FaFileAlt size={18} /> },
  






]

export default function AdminSidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch();

  const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;


  return (
    <aside className="w-64  sticky top-0  h-screen border-r border-white/20 bg-white/5 backdrop-blur-lg p-6 flex flex-col">
     
      <h2 className="text-2xl  font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-8">
        Admin
      </h2>

      <nav className="flex flex-col sidebar_ gap-2 flex-1 overflow-auto">
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
      </nav>
      <Link
        href='/dashboard'
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/70 hover:text-secondary hover:bg-white/10 transition"
      >
        <FaSignOutAlt size={18} />
        Dashboard
      </Link>
    </aside>
  )
}
