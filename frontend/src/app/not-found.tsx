"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      
      {/* Animated 404 */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-6 text-lg md:text-xl text-white/80 max-w-xl"
      >
        Oops! The page you are looking for doesn’t exist or has been moved.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:from-secondary hover:to-primary"
        >
          Go Back Home
        </Link>
      </motion.div>

      {/* Optional subtle background shapes */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
    </div>
  )
}
