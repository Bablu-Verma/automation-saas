"use client"

// Framer Motion removed from imports
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
    w-full max-w-lg rounded-3xl p-8 shadow-xl transition-colors duration-500
    
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
          Sign Up
        </h1>
        {/* Subtitle Theming */}
        <p className="text-center mt-2 text-textLight/70 dark:text-textDark/70">
          Create your account to get started.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            {/* Label Theming */}
            <label className="block mb-2 text-textLight/80 dark:text-textDark/80">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputClasses}
            />
          </div>

          <div>
            {/* Label Theming */}
            <label className="block mb-2 text-textLight/80 dark:text-textDark/80">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClasses}
            />
          </div>

          <div>
            {/* Label Theming */}
            <label className="block mb-2 text-textLight/80 dark:text-textDark/80">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClasses}
            />
          </div>

          <div>
            {/* Label Theming */}
            <label className="block mb-2 text-textLight/80 dark:text-textDark/80">Re-enter Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClasses}
            />
          </div>

          {/* Agree checkbox Theming */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              // Checkbox color fixed to primary and themed border
              className="mt-1 h-5 w-5 rounded border border-textLight/30 dark:border-textDark/30 bg-lightBg/50 dark:bg-darkBg/50 text-primary focus:ring-primary"
            />
            {/* Label Theming */}
            <label className="text-sm text-textLight/70 dark:text-textDark/70">
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

          {/* Submit Button (Gradient remains universal) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Working..": 'Sign Up'}
          </button>
        </form>

        {/* Separator Line Theming */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-textLight/20 dark:bg-textDark/20"></div>
          <span className="px-4 text-textLight/50 dark:text-textDark/50 text-sm">OR</span>
          <div className="flex-1 h-px bg-textLight/20 dark:bg-textDark/20"></div>
        </div>

        <WithGoogle title="Sign Up" />

        {/* Login link Theming */}
        <p className="text-center text-textLight/70 dark:text-textDark/70 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}