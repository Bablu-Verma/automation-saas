"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: integrate with your auth system (Firebase, NextAuth, Supabase etc.)
    console.log("Login with", { email, password })
  }

  const handleGoogleLogin = () => {
    // TODO: integrate Google login
    console.log("Login with Google")
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
      >
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Login
        </h1>
        <p className="text-center text-white/70 mt-2">
          Welcome back! Please login to your account.
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

          <div>
            <label className="block text-white/80 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition"
          >
            Login
          </button>
        </form>

        {/* Or divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="px-4 text-white/50 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Google login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2 rounded-xl bg-white text-gray-800 font-semibold shadow hover:shadow-lg transition"
        >
          <FcGoogle className="text-xl" />
          Login with Google
        </button>

        {/* Signup link */}
        <p className="text-center text-white/70 mt-6">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
