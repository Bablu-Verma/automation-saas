"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Link from "next/link"
import { user_verify_api, resend_otp_api } from "@/api"
import { useRouter, useSearchParams } from "next/navigation"

export default function OtpVerifyPage() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0) // countdown in seconds
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("userid")
  const otpRegex = /^[0-9]{6}$/

  // countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otpRegex.test(otp)) {
      toast.error("Please enter a valid 6-digit numeric OTP")
      return
    }

    setLoading(true)
    try {
       await axios.post(
        user_verify_api,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success("OTP Verified, Please Login")
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
   
    try {
      await axios.post(
        resend_otp_api,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success("OTP Resent")
      setCooldown(30) 
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Failed to resend OTP ❌")
    }
  }


  useEffect(()=>{
    setCooldown(10)
  },[])

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-white">
          Verify OTP
        </h1>
        <p className="text-center text-white/70 mt-2">
          Enter the 6-digit OTP sent to your email/phone.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-white/80 mb-2">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const val = e.target.value
                if (/^\d*$/.test(val)) setOtp(val) // allow only numbers
              }}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-2 text-center tracking-widest rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm text-white/70">
          <p>Didn’t get OTP?</p>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={cooldown > 0}
            className="text-primary font-semibold hover:underline disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>

        <p className="text-center text-white/70 mt-6">
          Back to{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
