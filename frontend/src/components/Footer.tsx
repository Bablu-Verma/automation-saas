"use client"

import { RootState } from "@/redux-store/redux_store";
import { IUser } from "@/types";
import Link from "next/link"
import { FiFacebook, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi"
import { useSelector } from "react-redux";

export default function Footer() {


  const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;

  const loggedIn = Boolean(user)

  return (
    <footer className="bg-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">

        {/* Brand Section */}
        <div>
          <h1 className="text-2xl font-bold text-white">⚡ AutoFlow</h1>
          <p className="mt-4 text-sm text-gray-400">
            Automate your workflows, save time, and focus on what matters most.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-primary"><FiFacebook size={20} /></a>
            <a href="#" className="hover:text-primary"><FiTwitter size={20} /></a>
            <a href="#" className="hover:text-primary"><FiLinkedin size={20} /></a>
            <a href="mailto:info@autoflow.com" className="hover:text-primary"><FiMail size={20} /></a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Navigation</h2>
          <ul className="space-y-2">
            {
              loggedIn && <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            }
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/services" className="hover:text-primary">Services</Link></li>
            {
              !loggedIn && <li><Link href="/login" className="hover:text-primary">Ligin</Link></li>
            }
          </ul>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Services</h2>
          <ul className="space-y-2">
            <li><Link href="/services/crm" className="hover:text-primary">CRM Automation</Link></li>
            <li><Link href="/services/marketing" className="hover:text-primary">Marketing Workflows</Link></li>
            <li><Link href="/services/ecommerce" className="hover:text-primary">E-commerce Sync</Link></li>
            <li><Link href="/services/analytics" className="hover:text-primary">Data & Analytics</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Help</h2>
          <ul className="space-y-2">
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-primary">FAQs</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>

          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Contact</h2>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:info@autoflow.com" className="hover:text-primary">info@autoflow.com</a></li>
            <li>Phone: <a href="tel:+910000000000" className="hover:text-primary">+91 00000 00000</a></li>
            <li>Address: 123, Tech Street, Bangalore</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} AutoFlow. All rights reserved.
      </div>
    </footer>
  )
}
