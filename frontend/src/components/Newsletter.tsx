"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { newsletter_create_api } from "@/api";
import { FiMail, FiSend } from "react-icons/fi";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

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
        toast.success("You're subscribed 🎉");
        setEmail("");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Server error. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-28 max-w-7xl mx-auto px-6 pb-24 relative">

      {/* 🌈 Soft Background Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 blur-3xl rounded-full -z-10" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-secondary/20 blur-3xl rounded-full -z-10" />

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* 🧠 Text */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold 
              text-textLight dark:text-textDark">
              Get Smart Automation Tips 🚀
            </h2>

            <p className="mt-4 text-lg max-w-lg 
              text-textLight/70 dark:text-textDark/70">
              Join our community and receive product updates, workflow ideas,
              and exclusive growth strategies directly in your inbox.
            </p>

            <p className="mt-4 text-sm text-textLight/50 dark:text-textDark/50">
              No spam. Unsubscribe anytime.
            </p>
          </div>

          {/* 📩 Form */}
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            {/* Input Wrapper */}
            <div className="relative w-full sm:flex-1">
              
              {/* Email Icon */}
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 
                text-gray-400" size={18} />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="
                  w-full pl-12 pr-4 py-3 rounded-full 
                  border-2 focus:ring-2 focus:ring-primary focus:outline-none
                  bg-lightBg text-textLight border-textLight/20
                  placeholder-textLight/50
                  dark:bg-darkBg dark:text-textDark 
                  dark:border-textDark/20 dark:placeholder-textDark/50
                  transition
                "
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                inline-flex items-center justify-center gap-2
                px-8 py-3 rounded-full
                bg-gradient-to-r from-primary to-secondary
                text-white font-semibold
                shadow-lg transition-all duration-300
                hover:shadow-2xl hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? "Subscribing..." : "Subscribe"}
              {!loading && <FiSend size={16} />}
            </button>
          </form>
        </div>
    </section>
  );
}