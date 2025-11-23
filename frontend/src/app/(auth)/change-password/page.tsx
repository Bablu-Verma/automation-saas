"use client"

import { useState } from "react"
// Framer Motion removed from imports
import Link from "next/link"
import toast from "react-hot-toast"
import { change_password_api } from "@/api"
import axios from "axios"
import validator from "validator"
import { useRouter, useSearchParams } from "next/navigation"


export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("userid")

  const validateInputs = () => {

    const passwordOptions = {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }

    if (!validator.isStrongPassword(password, passwordOptions)) {
      toast.error(
        "Password must be 8+ chars, include uppercase, lowercase, number & special char"
      )
      return false
    }

    if (password !== confirmPassword) {
      toast.error(
        "Password & Confirm Password not match"
      )
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
        change_password_api,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success(data.msg || "Password reset successful!")
      setTimeout(()=>{
        router.push('/login')
      },4000)
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Something went wrong ")
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
    <section className="flex items-center justify-center min-h-screen py-32 px-6
      bg-lightBg dark:bg-darkBg transition-colors duration-500">
      
      {/* Framer Motion removed, using standard div with themed classes */}
      <div
        className={cardClasses}
      >
        {/* Title Theming */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-textLight dark:text-textDark">
          Reset Password
        </h1>
        {/* Subtitle Theming */}
        <p className="text-center mt-2 text-textLight/70 dark:text-textDark/70">
          Enter your new password below.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            {/* Label Theming */}
            <label className="block mb-2 text-textLight/80 dark:text-textDark/80">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className={inputClasses}
            />
          </div>

          <div>
            {/* Label Theming */}
            <label className="block mb-2 text-textLight/80 dark:text-textDark/80">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
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
            {loading ? 'Loading..' : 'Change Password'}
          </button>
        </form>

        {/* Back to login Theming */}
        <p className="text-center mt-6 text-textLight/70 dark:text-textDark/70">
          Back to{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}