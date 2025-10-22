"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
} from "react-icons/fi";
import NewsletterSection from "@/components/Newsletter";
import { contact_create_api } from "@/api";

export default function ContactPage() {
  // ✅ State
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    number: "",
    subject: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation function
  const validate = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }
     if (!form.subject.trim()) {
      toast.error("Subject is required");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
     if (!form.number.trim()) {
      toast.error("Number is required");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Invalid email address");
      return false;
    }
    if (!form.message.trim()) {
      toast.error("Message is required");
      return false;
    }
    return true;
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {

    

      const res = await axios.post(contact_create_api, form); 
      if (res.data.success) {
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", message: "", subject:'', number:''}); // reset form
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen pt-28 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-secondary/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl m-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Contact Us
          </h1>
          <p className="mt-4 text-white/80 text-lg md:text-xl">
            Questions, support, or partnership? Reach out to us and we’ll get back to you promptly.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl flex flex-col gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
            />
         <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
            />
             <input
              type="number"
              name="number"
              placeholder="Phone Number"
              value={form.number}
              onChange={handleChange}
              className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
            />
             <input
              type="text"
              name="subject"
              placeholder="Your Subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:from-secondary hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-lg flex items-start gap-4">
              <FiMail className="text-primary text-3xl mt-1" />
              <div>
                <h4 className="font-semibold text-xl text-white">Email</h4>
                <p className="text-white/80">support@Mate Mind .com</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-lg flex items-start gap-4">
              <FiPhone className="text-primary text-3xl mt-1" />
              <div>
                <h4 className="font-semibold text-xl text-white">Phone</h4>
                <p className="text-white/80">+91 98765 43210</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-lg flex items-start gap-4">
              <FiMapPin className="text-primary text-3xl mt-1" />
              <div>
                <h4 className="font-semibold text-xl text-white">Address</h4>
                <p className="text-white/80">123 Mate Mind  Street, Bangalore, India</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center justify-start gap-4">
              <FiFacebook className="text-white text-2xl hover:text-primary transition cursor-pointer" />
              <FiTwitter className="text-white text-2xl hover:text-primary transition cursor-pointer" />
              <FiLinkedin className="text-white text-2xl hover:text-primary transition cursor-pointer" />
              <FiInstagram className="text-white text-2xl hover:text-primary transition cursor-pointer" />
            </div>
          </motion.div>
        </div>

        {/* Google Map */}
        <div className="rounded-3xl overflow-hidden shadow-lg mt-16 h-72">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31107.45821516984!2d77.594566!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670f34e6e3f%3A0x849c3a3e0f713c4d!2sBangalore!5e0!3m2!1sen!2sin!4v1695042293730!5m2!1sen!2sin"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            title="Mate Mind  Office Map"
          ></iframe>
        </div>
      </div>

      <NewsletterSection />
    </section>
  );
}
