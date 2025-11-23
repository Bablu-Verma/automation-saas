"use client"

import { useState } from "react"
// Framer Motion removed from imports
import Link from "next/link"
import toast from "react-hot-toast"
import axios from "axios"
import { login_api } from "@/api"
import { useDispatch } from "react-redux"
import { login } from "@/redux-store/slice/userSlice"
import { setClientCookie } from "@/helpers/client"
import WithGoogle from "@/components/ContinueWithGoogle"
import validator from "validator"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();

  const validateInputs = () => {
    if (!validator.isEmail(email)) {
      toast.error("Please enter a valid email")
      return false
    }

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

    return true
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateInputs()) return
    setLoading(true)

    try {
      const { data } = await axios.post(
        login_api,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      toast.success("Login successful ✅")

      dispatch(login({ user: data.user, token: data.token }))
      setClientCookie("token", data.token, 60 * 24 * 15)
      setClientCookie("user", JSON.stringify(data.user), 60 * 24 * 15)
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
    <section className="flex items-center justify-center min-h-screen px-6 py-32
      bg-lightBg dark:bg-darkBg transition-colors duration-500">
      
      {/* Framer Motion removed, using standard div with themed classes */}
      <div
        className={cardClasses}
      >
        {/* Title Theming */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-textLight dark:text-textDark">
          Login
        </h1>
        {/* Subtitle Theming */}
        <p className="text-center mt-2 text-textLight/70 dark:text-textDark/70">
          Welcome back! Please login to your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            {/* Label Theming */}
            <label className="block mb-2 text-textLight/80 dark:text-textDark/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClasses}
            />
          </div>

          <div>
            {/* Label Theming */}
            <label className="block mb-2 text-textLight/80 dark:text-textDark/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClasses}
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Separator Line Theming */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-textLight/20 dark:bg-textDark/20"></div>
          <span className="px-4 text-textLight/50 dark:text-textDark/50 text-sm">OR</span>
          <div className="flex-1 h-px bg-textLight/20 dark:bg-textDark/20"></div>
        </div>

        {/* WithGoogle (Assuming it is already themed) */}
        <WithGoogle title="Login" />

        {/* Sign Up Link Theming */}
        <p className="text-center mt-6 text-textLight/70 dark:text-textDark/70">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  )
}