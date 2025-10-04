"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiMenu, FiX, FiSearch } from "react-icons/fi"
import { useSelector } from "react-redux"
import { RootState } from "@/redux-store/redux_store"
import { IUser } from "@/types"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScroll, setLastScroll] = useState(0)
  const [atTop, setAtTop] = useState(true)

  const user = useSelector((state: RootState) => state.user.user) as IUser | null
  const loggedIn = Boolean(user)
  const router = useRouter()

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      setAtTop(currentScroll === 0)
      setVisible(currentScroll < lastScroll || currentScroll === 0)
      setLastScroll(currentScroll)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll])

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"
          } ${atTop ? "bg-transparent" : "bg-dark/90 backdrop-blur-md shadow-md"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center">

            {/* Logo */}
            <div className="flex-shrink-0 text-2xl font-bold">
              <Link href="/" className="text-white">⚡ AutoFlow</Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="hover:text-primary text-white">About Us</Link>
              <Link href="/services" className="hover:text-primary text-white">Services</Link>
              <Link href="/contact" className="hover:text-primary text-white">Contact Us</Link>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value='Search...'
                  readOnly
                  onClick={() => router.push('/search')}
                  className="px-4 py-1.5 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="absolute right-3 top-2 text-white hover:text-primary">
                  <FiSearch />
                </button>
              </div>

              {loggedIn ? (
                <Link href="/dashboard" title={user?.email} className="bg-primary text-white hover:text-primary px-8 py-1.5 rounded-full font-medium hover:bg-transparent border-primary border-2 transition flex items-center gap-2">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="bg-primary text-white hover:text-primary px-8 py-1.5 rounded-full font-medium hover:bg-transparent border-primary border-2 transition">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4 text-white">
              {loggedIn && <Link href="/dashboard" title={user?.email} className="block hover:text-primary text-white">Dashboard</Link>}
              {!loggedIn && <Link href="/login" className="block hover:text-primary text-white">Login</Link>}

              <button onClick={() => setIsOpen(true)}>
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile slide-in menu */}
      <div className={`
        fixed top-0 right-0 w-64 h-screen bg-dark text-white z-50 p-6 flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        {/* Close button */}
        <button className="self-end mb-4" onClick={() => setIsOpen(false)}>
          <FiX size={24} />
        </button>

        {/* Links */}
        <nav className="flex flex-col gap-4 flex-1">
          <Link href="/about" onClick={() => setIsOpen(false)}>About Us</Link>
          <Link href="/services" onClick={() => setIsOpen(false)}>Services</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact Us</Link>

          {/* Search */}
          <div className="flex items-center bg-white/10 rounded-full px-3 py-2 mt-4">
            <input
              type="text"
              value='Search...'
              readOnly
              onClick={() => router.push('/search')}
              className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none"
            />
            <button type="submit" className="ml-2 text-white hover:text-primary">
              <FiSearch />
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}
