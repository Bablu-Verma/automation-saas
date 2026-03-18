"use client";

import { useState } from "react";
// Framer Motion removed from imports
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
import SubHero from "@/components/SubHero";

export default function ContactClient() {
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
        setForm({ name: "", email: "", message: "", subject: '', number: '' }); // reset form
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
    <section className="pt-28 bg-lightBg dark:bg-darkBg transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">

        <SubHero
          title="Contact Us"
          description="Have questions, need support, or want to collaborate? We'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="number"
              name="number"
              placeholder="Phone Number"
              value={form.number}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <textarea
              name="message"
              rows={5}
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="flex flex-col gap-6">

            {/* Email */}
            <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
              <div className="p-3 bg-primary/10 text-primary rounded-lg text-xl">
                <FiMail />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Email</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {process.env.NEXT_PUBLIC_EMAIL}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
              <div className="p-3 bg-primary/10 text-primary rounded-lg text-xl">
                <FiPhone />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Phone</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {process.env.NEXT_PUBLIC_NUMBER}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
              <div className="p-3 bg-primary/10 text-primary rounded-lg text-xl">
                <FiMapPin />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Address</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Noida Sector 121, India - 201309
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-4 mt-4 text-xl">
              <a href="#" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition">
                <FiFacebook />
              </a>
              <a href="#" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition">
                <FiTwitter />
              </a>
              <a href="#" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition">
                <FiLinkedin />
              </a>
              <a href="#" className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition">
                <FiInstagram />
              </a>
            </div>

          </div>
        </div>

        {/* Map */}
        <div className="mt-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-72">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31107.45821516984!2d77.594566!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670f34e6e3f%3A0x849c3a3e0f713c4d!2sBangalore!5e0!3m2!1sen!2sin!4v1695042293730!5m2!1sen!2sin"
            className="w-full h-full border-0"
            loading="lazy"
            title="Office Map"
          />
        </div>

      </div>

      <NewsletterSection />
    </section>
  );
}