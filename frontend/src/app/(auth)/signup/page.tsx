"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import WithGoogle from "@/components/ContinueWithGoogle"
import validator from "validator"
import toast from "react-hot-toast"
import axios from "axios"
import { register_api } from "@/api"
import { useRouter } from "next/navigation"


export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  })
   const [loading, setLoading] = useState(false)
   const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }


  const validateInputs = () => {
     if (!validator.trim(form.name)) {
      toast.error("Please enter a valid Name")
      return false
    }
  
    if (!validator.isEmail(form.email)) {
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
  
    if (!validator.isStrongPassword(form.password, passwordOptions)) {
      toast.error(
        "Password must be 8+ chars, include uppercase, lowercase, number & special char"
      )
      return false
    }

     if (!form.agree) {
      toast.error("You must agree to the Privacy Policy & Terms.")
      return false
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.")
      return  false
    }
  
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
   
    if (!validateInputs()) return
    setLoading(true)

    try {
      const { data } = await axios.post(
        register_api,
        {...form},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      toast.success(data.msg)
     

      setTimeout(()=>{
        router.push(`/otp-verification?userid=${data.token}`)
      },500)

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
        className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
      >
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-white">
          Sign Up
        </h1>
        <p className="text-center text-white/70 mt-2">
          Create your account to get started.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-white/80 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
             
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
             
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Re-enter Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
             
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Agree checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mt-1 h-5 w-5 rounded border border-white/30 bg-white/10 text-primary focus:ring-primary"
            />
            <label className="text-sm text-white/70">
              I have read and agree to the{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              &{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms and Conditions
              </Link>
              .
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition"
          >
            {
              loading ? "Working..": 'Sign Up'
            }
            
          </button>
        </form>

        {/* Or divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="px-4 text-white/50 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <WithGoogle title="Sign Up" />

        {/* Login link */}
        <p className="text-center text-white/70 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
