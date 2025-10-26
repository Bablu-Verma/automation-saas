"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import axios from "axios"
import { login_api } from "@/api"
import { useDispatch } from "react-redux"
import { login } from "@/redux-store/slice/userSlice"
import { setClientCookie } from "@/helpers/client"
import WithGoogle from "@/components/ContinueWithGoogle"
import toast from "react-hot-toast"
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
      // console.log("Response:", data)

      dispatch(login({ user: data.user, token: data.token }))
      setClientCookie("token", data.token, 60 * 24 * 15)
      setClientCookie("user", JSON.stringify(data.user), 60 * 24 * 15)
    } catch (err: any) {
      // console.log("Error response:", err.response) // 👈 debugging ke liye add karo
      toast.error(err.response?.data?.msg || "Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }



  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-white">
          Login
        </h1>
        <p className="text-center text-white/70 mt-2">
          Welcome back! Please login to your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              
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
      
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="px-4 text-white/50 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <WithGoogle title="Login" />

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
