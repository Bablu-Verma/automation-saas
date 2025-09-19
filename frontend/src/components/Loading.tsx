"use client"

import { motion } from "framer-motion"

export default function Loading_() {
  return (
    <div className="h-[100vh] w-full flex items-center justify-center">
      <motion.div
        className="w-16 h-16 border-4 border-t-secondary border-b-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  )
}
