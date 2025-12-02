"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { IUser } from "@/types";
import useTheme from "@/hooks/useTheam";
import Image from "next/image";
import {
  FaChartBar,
  FaEnvelope,
  FaFileAlt,
  FaHome,
  FaLifeRing,
  FaPlayCircle,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { logout } from "@/redux-store/slice/userSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [atTop, setAtTop] = useState(true);

  const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;
  const loggedIn = Boolean(user);
  const router = useRouter();

  const pathname = usePathname();
  const dispatch = useDispatch();

  const [theme, toggleTheme] = useTheme();

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
    {
      href: "/dashboard/automation",
      label: "My Automation",
      icon: <FaFileAlt size={18} />,
    },
    { href: "/dashboard/billing", label: "Billing", icon: <FaEnvelope size={18} /> },
    {
      href: "/dashboard/execution",
      label: "Execution",
      icon: <FaPlayCircle size={18} />,
    },
    {
      href: "/dashboard/help",
      label: "Help & Support",
      icon: <FaLifeRing size={18} />,
    },
  ];

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setAtTop(currentScroll === 0);
      setVisible(currentScroll < lastScroll || currentScroll === 0);
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300
          ${visible ? "translate-y-0" : "-translate-y-full"}
          ${atTop
            ? "bg-transparent"
            : "bg-lightBg/80 dark:bg-darkBg/80 backdrop-blur-md shadow-md"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 py-2">
              <Link href="/" className="">
              {
                theme === "dark"  ?  <Image
                  src="/DARK.png"
                  className="max-w-[170px]  h-auto "
                  width={275}
                  height={100}
                  alt="logo"
                /> :  <Image
                  src="/LIGHT.png"
                  className="max-w-[170px]  h-auto "
                  width={275}
                  height={100}
                  alt="logo"
                />
              }
               
               
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-6">
              {/* NOTE: Text color updated here for clarity and theming */}
              <Link href="/about" className="hover:text-primary text-textLight dark:text-textDark">
                About Us
              </Link>
              <Link href="/services" className="hover:text-primary text-textLight dark:text-textDark">
                Services
              </Link>
              <Link href="/contact" className="hover:text-primary text-textLight dark:text-textDark">
                Contact Us
              </Link>

              {/* Search */}
              <div className="relative">
                <input
                  onClick={() => router.push("/search")}
                  className="px-4 py-1 w-28 lg:w-auto rounded-full 
          bg-lightBg/60 dark:bg-darkBg/40 
          text-textLight dark:text-textDark 
          placeholder-textLight/70  dark:placeholder-textDark/70
          border-[1px] 
          border-textLight/20 dark:border-textDark/20 
          hover:border-primary transition duration-300
        "
                  placeholder="Search..."
                  readOnly
                />
                <button
                  className="absolute right-3 top-2 text-textLight dark:text-textDark"
                >
                  <FiSearch className="text-lg" />
                </button>
              </div>

              <button
                onClick={toggleTheme}
                className="px-4 py-1.5 rounded-full 
                  bg-lightBg/60 dark:bg-darkBg/40 
                  text-textLight dark:text-textDark"
              >
                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
              </button>

              {loggedIn ? (
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1.5 rounded-full hover:bg-secondary transition"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1.5 rounded-full hover:bg-secondary transition"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3 text-textLight dark:text-textDark">
              <button
                className="p-1.5 rounded-full bg-lightBg/60 dark:bg-darkBg/40"
                onClick={() => setIsOpen(true)}
              >
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay and menu (No major changes needed, already well themed) */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity 
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`
        fixed top-0 left-0 w-72 h-[100vh]
        overflow-y-scroll 
        bg-lightBg dark:bg-darkBg
        text-textLight dark:text-textDark
        z-50 py-10 px-4 flex flex-col
        transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <button
          className="fixed top-4 right-4 bg-lightBg/80 dark:bg-darkBg/80 text-textLight dark:text-textDark p-2 rounded-full"
          onClick={() => setIsOpen(false)}
        >
          <FiX size={16} />
        </button>

        <nav className="flex flex-col gap-2 flex-1 mt-10">
          {[...publicLinks, ...(loggedIn ? privateLinks : [])].map((link, i) => (
            <Link
              key={i}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition
              ${pathname === link.href
                  ? "bg-primary text-white" // Active link in Primary color
                  : "hover:bg-primary/10 dark:hover:bg-primary/20" // Themed hover
                }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-full bg-lightBg/50 dark:bg-darkBg/50 mt-6 text-textLight dark:text-textDark"
          >
            {theme === "dark" ? "🌞 Switch to Light" : "🌙 Switch to Dark"}
          </button>

            <div className="relative w-full mt-4">
                <input
                  onClick={() => router.push("/search")}
                  className="px-4 py-1 w-full rounded-full 
          bg-lightBg/60 dark:bg-darkBg/40 
          text-textLight dark:text-textDark 
          placeholder-textLight/70  dark:placeholder-textDark/70
          border-[1px] 
          border-textLight/20 dark:border-textDark/20 
          hover:border-primary transition duration-300
        "
                  placeholder="Search..."
                  readOnly
                />
                <button
                  className="absolute right-3 top-2 text-textLight dark:text-textDark"
                >
                  <FiSearch className="text-lg" />
                </button>
              </div>

          {!loggedIn ? (
            <Link
              href="/login"
              className="bg-primary text-white px-4 py-2 rounded-xl mt-4 text-center hover:bg-secondary transition"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logOut_user}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 text-textLight dark:text-textDark"
            >
              <FaSignOutAlt size={18} />
              Logout
            </button>
          )}
        </nav>
      </div>
    </>
  );
}