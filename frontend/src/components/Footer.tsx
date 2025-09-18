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
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand Section */}
        <div>
          <h1 className="text-2xl font-bold text-white">⚡ AutoFlow</h1>
          <p className="mt-4 text-sm text-gray-400">
            Automate your workflows, save time, and focus on what matters most.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-secondary"><FiFacebook size={20} /></a>
            <a href="#" className="hover:text-secondary"><FiTwitter size={20} /></a>
            <a href="#" className="hover:text-secondary"><FiLinkedin size={20} /></a>
            <a href="mailto:info@autoflow.com" className="hover:text-secondary"><FiMail size={20} /></a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Navigation</h2>
          <ul className="space-y-2">
            {
           loggedIn &&  <li><Link href="/dashboard" className="hover:text-secondary">Dashboard</Link></li>
            }
            <li><Link href="/" className="hover:text-secondary">Home</Link></li>
            <li><Link href="/about" className="hover:text-secondary">About Us</Link></li>
            <li><Link href="/services" className="hover:text-secondary">Services</Link></li>
            <li><Link href="/contact" className="hover:text-secondary">Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Services</h2>
          <ul className="space-y-2">
            <li><Link href="/services/crm" className="hover:text-secondary">CRM Automation</Link></li>
            <li><Link href="/services/marketing" className="hover:text-secondary">Marketing Workflows</Link></li>
            <li><Link href="/services/ecommerce" className="hover:text-secondary">E-commerce Sync</Link></li>
            <li><Link href="/services/analytics" className="hover:text-secondary">Data & Analytics</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Contact</h2>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:info@autoflow.com" className="hover:text-secondary">info@autoflow.com</a></li>
            <li>Phone: <a href="tel:+910000000000" className="hover:text-secondary">+91 00000 00000</a></li>
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
