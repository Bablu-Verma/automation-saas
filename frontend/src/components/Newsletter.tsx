"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { newsletter_create_api } from "@/api";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Email validation
  const validateEmail = (email: string) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  // ✅ Submit handler
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(newsletter_create_api, { email });
      if (res.data.success) {
        toast.success("Subscribed successfully!");
        setEmail(""); // reset input
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Newsletter error:", error);
      toast.error(
        error.response?.data?.message || "Server error. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-28 px-6 max-w-7xl mx-auto text-white rounded-3xl relative">
    
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* Text */}
        <div className="text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold"
          >
            Stay Updated
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-lg text-white/90 max-w-lg"
          >
            Subscribe to our newsletter to get the latest updates on AutoFlow
            features, tips, and exclusive offers.
          </motion.p>
        </div>

        {/* Input & Button */}
        <motion.form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-6 py-3 rounded-full text-white placeholder-white/70 bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-full bg-white text-primary font-semibold shadow-lg hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
