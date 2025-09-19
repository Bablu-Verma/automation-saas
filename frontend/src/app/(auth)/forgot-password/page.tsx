"use client"

import { motion } from "framer-motion"
import { useState } from "react"
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

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
      >
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Forgot Password
        </h1>
        <p className="text-center text-white/70 mt-2">
          Enter your email to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center text-white/70 mt-6">
          Remembered your password?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
