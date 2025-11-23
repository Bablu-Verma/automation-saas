"use client"

import { useState } from "react"
// Framer Motion removed from imports
import Link from "next/link"
import toast from "react-hot-toast"
import axios from "axios"
import { forgot_password_api } from "@/api"
import validator from "validator"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const validateInputs = () => {
    if (!validator.isEmail(email)) {
      toast.error("Please enter a valid email")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateInputs()) return

    setLoading(true)
    try {
      const { data } = await axios.post(
        forgot_password_api,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      toast.success(data.msg || "Password reset link sent ✅")
      setEmail("")
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  // --- Reusable Input Class ---
  const inputClasses = `
    w-full px-4 py-2 rounded-xl transition border-2 focus:outline-none focus:ring-2 focus:ring-primary
    
    /* Light Mode Input */
    bg-lightBg/50 text-textLight border-textLight/20 placeholder-textLight/60
    
    /* Dark Mode Input */
    dark:bg-darkBg/50  dark:border-textDark/20 dark:placeholder-textDark/60
  `;
  
  // --- Reusable Card Container Class ---
  const cardClasses = `
    w-full max-w-md rounded-3xl p-8 shadow-xl transition-colors duration-500
    
    /* Light Mode Glassmorphism */
    bg-lightBg/80 backdrop-blur-lg border border-textLight/10
    
    /* Dark Mode Glassmorphism */
    dark:bg-darkBg/80 dark:border-textDark/10
  `;

  return (
    /* ✨ सुधार: Main Section Theming */
    <section className="flex items-center justify-center min-h-screen px-6
      bg-lightBg dark:bg-darkBg transition-colors duration-500">
      
      {/* Framer Motion removed, using standard div with themed classes */}
      <div
        className={cardClasses}
      >
        {/* Title Theming */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-textLight dark:text-textDark">
          Forgot Password
        </h1>
        {/* Subtitle Theming */}
        <p className="text-center mt-2 text-textLight/70 dark:text-textDark/70">
          Enter your email to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            {/* Label Theming */}
            <label className="block mb-2 text-textLight/80 dark:text-textDark/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputClasses}
            />
          </div>

          {/* Submit Button (Gradient remains universal) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login Theming */}
        <p className="text-center mt-6 text-textLight/70 dark:text-textDark/70">
          Remembered your password?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </section>
  )
}