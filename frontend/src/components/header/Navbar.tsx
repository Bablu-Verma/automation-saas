"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FiMenu, FiX, FiSearch } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux-store/redux_store"
import { IUser } from "@/types"
import useTheme from "@/hooks/useTheam"
import Image from "next/image"
import {  FaChartBar, FaEnvelope, FaFileAlt, FaHome, FaLifeRing, FaPlayCircle, FaSignOutAlt, FaUikit, FaUser } from "react-icons/fa"
import { logout } from "@/redux-store/slice/userSlice"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScroll, setLastScroll] = useState(0)
  const [atTop, setAtTop] = useState(true)

  const user = useSelector((state: RootState) => state.user.user) as IUser | null
  const loggedIn = Boolean(user)
  const router = useRouter()

  const pathname = usePathname()
  const dispatch = useDispatch();



  const logOut_user = () => {
    setTimeout(() => {
      dispatch(logout());
      window.location.href = "/login";
    }, 1000);
  };

  const publicLinks = [
    { href: "/", label: "Home", icon: <FaHome size={18} /> },
    { href: "/about", label: "About Us", icon: <FaUser size={18} /> },
    { href: "/services", label: "Services", icon: <FaFileAlt size={18} /> },
    { href: "/contact", label: "Contact Us", icon: <FaEnvelope size={18} /> },
  ];

  const privateLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <FaChartBar size={18} /> },
    { href: "/dashboard/profile", label: "Profile", icon: <FaUser size={18} /> },
    { href: "/dashboard/automation", label: "My Automation", icon: <FaFileAlt size={18} /> },
    { href: "/dashboard/billing", label: "Billing", icon: <FaEnvelope size={18} /> },
    { href: "/dashboard/execution", label: "Execution", icon: <FaPlayCircle size={18} /> },
    { href: "/dashboard/help", label: "Help & Support", icon: <FaLifeRing size={18} /> },
  ];




  const [theme, toggleTheme] = useTheme();

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
          <div className="flex justify-between h-18 items-center">

            {/* Logo */}
            <div className="flex-shrink-0 ">
              <Link href="/" className="text-white">
              <Image src='/loop_axis_2.png' className="w-[110px] sm:w-auto h-auto" width={275} height={100} alt="logo" />
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
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
                  className="px-4 py-1.5 w-28 lg:w-auto  rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="absolute right-3 top-2 text-white hover:text-primary">
                  <FiSearch />
                </button>
              </div>

              <button
                onClick={toggleTheme}
                className="px-4 py-1.5 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
              </button>
              {loggedIn ? (
                <Link href="/dashboard" title={user?.email} className="bg-primary text-white hover:text-primary px-4 py-1.5 rounded-full font-medium hover:bg-transparent border-transparent hover:border-primary border-2 transition flex items-center gap-2">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="bg-primary text-white hover:text-primary px-4 py-1.5 rounded-full font-medium hover:bg-transparent border-transparent hover:border-primary border-2 transition">
                  Login
                </Link>
              )}


            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3 text-white">
              {loggedIn && <Link href="/dashboard" title={user?.email} className="bg-primary text-white px-4 py-1.5 rounded-full font-medium hover:shadow-2xl  transition flex items-center gap-2">Dashboard</Link>}
              {!loggedIn && <Link href="/login" className="bg-primary text-white px-4 py-1.5 rounded-full font-medium hover:shadow-2xl  transition flex items-center gap-2">Login</Link>}

              <button className="p-1.5 rounded-full bg-white/10" onClick={() => setIsOpen(true)}>
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed  inset-0 bg-black/50 z-50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile slide-in menu */}
      <div className={`
        fixed top-0 left-0 w-72 h-[100vh] 
    overflow-y-scroll bg-dark text-white z-50 py-10 px-4 flex flex-col
    transform transition-transform duration-300 
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Close button */}
        <button className=" fixed top-4 bg-gray-500 p-1 rounded-full right-4" onClick={() => setIsOpen(false)}>
          <FiX size={16} />
        </button>

        <nav className="flex flex-col  text-white gap-2 flex-1">
          {[...publicLinks, ...(loggedIn ? privateLinks : [])].map((link, i) => (
            <Link
              key={i}
              onClick={() => setIsOpen(false)}
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
          {loggedIn && user?.role === 'admin' && (
            <Link
              href='/admin'
              className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium text-white/70 hover:text-white hover:bg-white/10"

            >
              <FaUikit size={18} />
              Admin
            </Link>
          )}

          <div className="flex mt-10 items-center rounded-full relative px-4 py-1.5 bg-white/20 dark:bg-black/30">
            <input
              type="text"
              value="Search..."
              readOnly
              onClick={() => { router.push("/search"); setIsOpen(false); }}
              className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none"
            />
            <button type="submit" className="ml-2 absolute right-4 text-white hover:text-primary transition">
              <FiSearch />
            </button>
          </div>


          <button
            onClick={toggleTheme}
            className="px-4 py-1.5  rounded-full bg-white/20 dark:bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition flex mb-10 justify-center text-center gap-2"
          >
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>



          {!loggedIn ?
            <Link
              href="/login"
              className="bg-primary text-white px-4 py-1.5 rounded-full font-medium hover:shadow-lg justify-center transition flex items-center gap-2"
            >
              Login
            </Link> : <button
              onClick={logOut_user}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/70 hover:text-red-400 hover:bg-white/10 transition mt-4"
            >
              <FaSignOutAlt size={18} />
              Logout
            </button>
          }


        </nav>

      </div>
    </>
  )
}
