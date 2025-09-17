"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiMenu, FiX, FiSearch, FiUser } from "react-icons/fi"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScroll, setLastScroll] = useState(0)
  const [atTop, setAtTop] = useState(true)


  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      setAtTop(currentScroll === 0)

      if (currentScroll === 0) {
        setVisible(true)
      } else if (currentScroll > lastScroll) {
        setVisible(false)
      } else {
        setVisible(true)
      }

      setLastScroll(currentScroll)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll])



  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"
        } ${atTop ? "bg-transparent" : "bg-dark/90 backdrop-blur-md shadow-md"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold">
            <Link href="/" className="text-white">⚡ AutoFlow</Link>
          </div>

          {/* Desktop menu + search */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="hover:text-primary text-white">About Us</Link>
            <Link href="/services" className="hover:text-primary text-white">Services</Link>
            <Link href="/contact" className="hover:text-primary text-white">Contact Us</Link>

            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                value='Search...'
                readOnly
                onClick={() => router.push('/search')}
                placeholder="Search..."
                className="px-4 py-1.5 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="absolute right-3 top-2 text-white hover:text-primary">
                <FiSearch />
              </button>
            </div>

            {loggedIn ? (
              <Link href="/dashboard" className="bg-primary text-white hover:text-primary px-8 py-1.5 rounded-full font-medium hover:bg-transparent border-primary border-2 transition flex items-center gap-2">
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-white hover:text-primary px-8 py-1.5 rounded-full font-medium hover:bg-transparent border-primary border-2 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden text-white flex items-center gap-4">

            {loggedIn && <Link href="/dashboard" className="block hover:text-primary text-white">Dashboard</Link>}
            {
              !loggedIn && <Link
                href="/login"
                className="block hover:text-primary text-white"
              >
                Login
              </Link>
            }

            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark text-white px-4 py-4 space-y-4">
          <Link href="/about" className="block hover:text-primary text-white">About Us</Link>
          <Link href="/services" className="block hover:text-primary text-white">Services</Link>
          <Link href="/contact" className="block hover:text-primary text-white">Contact Us</Link>


          {/* Mobile search */}
          <div className="flex items-center bg-white/10 rounded-full px-3 py-2">
            <input
              type="text"
              value='Search...'
              readOnly
              onClick={() => router.push('/search')}
              placeholder="Search..."
              className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none"
            />
            <button type="submit" className="ml-2 text-white hover:text-primary">
              <FiSearch />
            </button>
          </div>



        </div>
      )}
    </nav>
  )
}
