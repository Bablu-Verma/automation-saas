"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  FaHome, 
  FaUser, 
  FaCreditCard, 
  FaNewspaper, 
  FaEnvelope,
  FaCogs,
  FaRobot,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import { useState } from "react"



const links = [
  { 
    href: "/admin", 
    label: "Dashboard", 
    icon: <FaHome size={18} />,
    description: "Admin Overview"
  },
  { 
    href: "/admin/user", 
    label: "Users", 
    icon: <FaUser size={18} />,
    description: "Manage Users"
  },
  { 
    href: "/admin/service", 
    label: "Services", 
    icon: <FaCogs size={18} />,
    description: "Manage Services"
  },
  { 
    href: "/admin/automation", 
    label: "Automations", 
    icon: <FaRobot size={18} />,
    description: "User Automations"
  },
  { 
    href: "/admin/billing", 
    label: "Billing", 
    icon: <FaCreditCard size={18} />,
    description: "Payments & Invoices"
  },
  { 
    href: "/admin/newsletter", 
    label: "Newsletter", 
    icon: <FaNewspaper size={18} />,
    description: "Email Campaigns"
  },
  { 
    href: "/admin/contact-us", 
    label: "Contact Messages", 
    icon: <FaEnvelope size={18} />,
    description: "User Inquiries"
  },
];

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false) // Mobile toggle

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-16 left-4 z-10 p-2 bg-white/10 rounded-md text-white"
        onClick={() => setIsOpen(true)}
      >
        <FaBars size={24} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-white/5 backdrop-blur-lg p-6 pt-18 md:pt-6 flex flex-col
        border-r border-white/20 z-30
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:sticky md:flex
      `}>
        {/* Close button for mobile */}
        <div className="flex items-center justify-between mb-8">
        
        <h2 className="text-2xl font-extrabold text-white ">
          Admin
        </h2>
         <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes size={20} />
        </button>

        </div>
        {/* Links */}
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
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Dashboard link */}
        <Link
          href='/dashboard'
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/70 hover:text-secondary hover:bg-white/10 transition mt-4"
          onClick={() => setIsOpen(false)}
        >
          <FaSignOutAlt size={18} />
          Dashboard
        </Link>
      </aside>
    </>
  )
}
