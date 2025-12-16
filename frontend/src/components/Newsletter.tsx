"use client";

import { useState } from "react";
// Framer Motion removed from imports
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
    // Removed 'text-white' from section to allow for theme control
    <section className="py-28 px-4 sm:px-6 max-w-7xl mx-auto rounded-3xl relative">
    
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* Text */}
        <div className="text-center lg:text-left">
          {/* H2 Theming (Framer Motion removed) */}
          <h2
            className="text-3xl md:text-4xl font-semibold 
              text-textLight dark:text-textDark transition-colors duration-500"
          >
            Stay Updated
          </h2>

          {/* Paragraph Theming (Framer Motion removed) */}
          <p
            className="mt-4 text-lg max-w-lg 
              text-textLight/70 dark:text-textDark/70 transition-colors duration-500"
          >
            Subscribe to our newsletter to get the latest updates ontaskzeno 
            features, tips, and exclusive offers.
          </p>
        </div>

        {/* Input & Button (Framer Motion removed) */}
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start"
        >
          {/* Input Theming */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-6 py-3 rounded-full transition 
              border-2 focus:ring-2 focus:ring-primary focus:outline-none
              
              /* Light Mode Input */
              bg-lightBg text-textLight border-textLight/20 placeholder-textLight/50
              
              /* Dark Mode Input */
              dark:bg-darkBg dark:text-textDark dark:border-textDark/20 dark:placeholder-textDark/50"
          />
          
          {/* Button Theming (Using brand colors for better look) */}
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:scale-[1.05] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}