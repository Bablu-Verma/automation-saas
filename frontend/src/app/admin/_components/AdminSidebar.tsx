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
  { 
    href: "/admin/docs", 
    label: "Docs", 
    icon: <FaEnvelope size={18} />,
    description: "User Inquiries"
  },
];

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false) // Mobile toggle

  // Helper function to check if the current path is a child route of the link
  const isPathActive = (href: string) => {
    // Check for exact match (e.g., /admin) or path start (e.g., /admin/user vs /admin/user/123)
    return pathname === href || (pathname.startsWith(href) && href !== '/admin');
  };

  return (
    <>
      {/* Hamburger for mobile (Themed) */}
      <button
        className="md:hidden fixed top-16 left-4 z-10 p-2 rounded-md 
          bg-lightBg/80 dark:bg-darkBg/80 text-textLight dark:text-textDark shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <FaBars size={24} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar (Themed Glassmorphism Container) */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 p-6 pt-18 md:pt-6 flex flex-col
        z-30 transform transition-transform duration-300 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:sticky md:flex md:top-0
        
        /* Light Mode Glassmorphism */
        bg-lightBg/80 backdrop-blur-md border-r border-textLight/10 text-textLight
        
        /* Dark Mode Glassmorphism */
        dark:bg-darkBg/80 dark:border-r dark:border-textDark/10 dark:text-textDark
      `}>
        {/* Close button and Title */}
        <div className="flex items-center justify-between mb-8">
        
          <h2 className="text-2xl font-extrabold text-textLight dark:text-textDark">
            Admin
          </h2>
          <button
            className="md:hidden text-textLight dark:text-textDark"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes size={20} />
          </button>

        </div>
        {/* Links */}
        <nav className="flex flex-col gap-2 flex-1 overflow-auto">
          {links.map((link, i) => {
            const isActive = isPathActive(link.href);
            return (
              <Link
                key={i}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition
                  ${isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" // Active
                    : "text-textLight/70 dark:text-textDark/70 hover:text-primary hover:bg-lightBg/50 dark:hover:bg-darkBg/50" // Inactive
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Dashboard link (Themed) */}
        <Link
          href='/dashboard'
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition mt-4 
            text-textLight/70 dark:text-textDark/70 hover:text-secondary hover:bg-lightBg/50 dark:hover:bg-darkBg/50"
          onClick={() => setIsOpen(false)}
        >
          <FaSignOutAlt size={18} />
          User Dashboard
        </Link>
      </aside>
    </>
  )
}