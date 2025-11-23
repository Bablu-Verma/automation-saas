"use client";

import { RootState } from "@/redux-store/redux_store";
import { IUser } from "@/types";
import Image from "next/image";
import Link from "next/link"
import { FiFacebook, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi"
import { useSelector } from "react-redux";

export default function Footer() {


  const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;

  const service = useSelector(
    (state: RootState) => state.servicetofooter.services
  )
  const loggedIn = Boolean(user)

  return (
    /* ✨ मुख्य सुधार: Footer अब थीम के साथ स्विच करेगा */
    <footer className="
      /* Light Mode: Light Background, Dark Text */
      bg-lightBg border-t border-textLight/10 text-textLight
      
      /* Dark Mode: Dark Background, Light Text */
      dark:bg-darkBg dark:border-textDark/10 dark:text-textDark
      transition-colors duration-500
    ">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">

        {/* Brand Section */}
        <div>
          {/* Logo link remains the same */}
          <Link className="" href='/'><Image src='/loop_axis.png' className="w-auto h-auto" width={275} height={100} alt="logo" /> </Link>
          
          {/* ✨ सुधार: टेक्स्ट कलर थीम-अवेयर */}
          <p className="mt-4 text-sm text-textLight/70 dark:text-textDark/70">
            Automate your work, save time, and focus on what matters most.
          </p>
          
          {/* Social Icons (Icons are always primary on hover) */}
          <div className="flex gap-4 mt-6 text-textLight dark:text-textDark">
            <a href="#" className="hover:text-primary"><FiFacebook size={20} /></a>
            <a href="#" className="hover:text-primary"><FiTwitter size={20} /></a>
            <a href="#" className="hover:text-primary"><FiLinkedin size={20} /></a>
            <a href="mailto:info@Loop Axis .com" className="hover:text-primary"><FiMail size={20} /></a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          {/* ✨ सुधार: हेडिंग टेक्स्ट कलर थीम-अवेयर */}
          <h2 className="text-lg font-semibold text-textLight dark:text-textDark mb-4">Navigation</h2>
          <ul className="space-y-2 text-textLight/80 dark:text-textDark/80">
            {
              loggedIn && <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            }
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/services" className="hover:text-primary">Services</Link></li>
            {
              !loggedIn && <li><Link href="/login" className="hover:text-primary">Login</Link></li>
            }
          </ul>
        </div>

        {/* Services */}
        <div>
          {/* ✨ सुधार: हेडिंग टेक्स्ट कलर थीम-अवेयर */}
          <h2 className="text-lg font-semibold text-textLight dark:text-textDark mb-4">Services</h2>
          <ul className="space-y-2 capitalize text-textLight/80 dark:text-textDark/80">
            {
              service.slice(0, 5).map((item, i) => {
                return (
                  <li key={i}><Link href={`/services/view?id=${item.slug}`} className="hover:text-primary line-clamp-1">{item.name}</Link></li>
                )
              })
            }
          </ul>
        </div>

        {/* Help */}
        <div>
          {/* ✨ सुधार: हेडिंग टेक्स्ट कलर थीम-अवेयर */}
          <h2 className="text-lg font-semibold text-textLight dark:text-textDark mb-4">Help</h2>
          <ul className="space-y-2 text-textLight/80 dark:text-textDark/80">
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-primary">FAQs</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/sitemap.xml" className="hover:text-primary">Sitemap</Link></li>

          </ul>
        </div>

        {/* Contact Info */}
        <div>
          {/* ✨ सुधार: हेडिंग टेक्स्ट कलर थीम-अवेयर */}
          <h2 className="text-lg font-semibold text-textLight dark:text-textDark mb-4">Contact</h2>
          <ul className="space-y-2 text-sm text-textLight/80 dark:text-textDark/80">
            <li>Email: <a href="mailto:info@tasktantra.com" className="hover:text-primary">{process.env.NEXT_PUBLIC_EMAIL}</a></li>
            <li>Phone: <a href="tel:+910000000000" className="hover:text-primary">{process.env.NEXT_PUBLIC_NUMBER}</a></li>
            <li>Noida Sector 121, India - 201309</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      {/* ✨ सुधार: बॉर्डर और टेक्स्ट कलर थीम-अवेयर */}
      <div className=" mt-6 py-6 text-center text-sm text-textLight/50 dark:text-textDark/50">
        © {new Date().getFullYear()} Loop Axis . All rights reserved.
      </div>
    </footer>
  )
}