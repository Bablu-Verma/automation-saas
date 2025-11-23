"use client"

// Framer Motion removed from imports
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
    setCooldown(30) // Set initial cooldown for UX (was 10 in original code)
  },[])

  // --- Reusable Input Class ---
  const inputClasses = `
    w-full px-4 py-2 rounded-xl transition border-2 focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-widest
    
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
          Verify OTP
        </h1>
        {/* Subtitle Theming */}
        <p className="text-center mt-2 text-textLight/70 dark:text-textDark/70">
          Enter the 6-digit OTP sent to your email/phone.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            {/* Label Theming */}
            <label className="block mb-2 text-textLight/80 dark:text-textDark/80">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const val = e.target.value
                if (/^\d*$/.test(val)) setOtp(val) // allow only numbers
              }}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP Section Theming */}
        <div className="flex justify-between items-center mt-6 text-sm text-textLight/70 dark:text-textDark/70">
          <p>Didn’t get OTP?</p>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={cooldown > 0}
            className="text-primary font-semibold hover:underline disabled:opacity-50 transition"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>

        {/* Back to Login Link Theming */}
        <p className="text-center mt-6 text-textLight/70 dark:text-textDark/70">
          Back to{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}