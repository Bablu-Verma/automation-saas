"use client"

import { motion } from "framer-motion"
import { useState } from "react"
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
      toast.success(data.msg || "Password reset link sent")
      setTimeout(()=>{
        router.push('/login')
      },4000)
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Something went wrong ")
    } finally {
      setLoading(false)
    }
  }


  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
      >
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Reset Password
        </h1>
        <p className="text-center text-white/70 mt-2">
          Enter your new password below.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-white/80 mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition"
          >

            {
              loading ? 'Loading..' : 'Change Password'
            }

          </button>
        </form>

        {/* Back to login */}
        <p className="text-center text-white/70 mt-6">
          Back to{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
