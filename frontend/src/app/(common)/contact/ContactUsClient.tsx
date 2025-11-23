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

  const inputClasses = `
    w-full px-5 py-2 rounded-md transition border-2 focus:outline-none focus:ring-2 focus:ring-primary
    
    /* Light Mode Input */
    bg-lightBg/50 text-textLight border-textLight/20 placeholder-textLight/50
    
    /* Dark Mode Input */
    dark:bg-darkBg/50  dark:border-textDark/20 dark:placeholder-textDark/50
  `;
  
  const infoCardClasses = `
    p-6 rounded-3xl shadow-lg flex items-start gap-4 transition-all duration-300
    
    /* Light Mode Info Card */
    bg-lightBg/60 backdrop-blur-lg border border-textLight/10
    
    /* Dark Mode Info Card */
    dark:bg-darkBg/60 dark:border-textDark/10
  `;

  return (
    <section className="relative min-h-screen pt-28 overflow-hidden">
      {/* Background shapes (Colors already good) */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-secondary/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl m-auto px-6">
        {/* Header (Framer Motion removed) */}
        <div
          className="text-center max-w-2xl mx-auto mb-16"
        >
          {/* H1 Theming */}
          <h1 className="text-4xl md:text-5xl font-extrabold 
            text-textLight dark:text-textDark transition-colors duration-500">
            Contact Us
          </h1>
          {/* Paragraph Theming */}
          <p className="mt-4 text-lg md:text-xl text-textLight/80 dark:text-textDark/80 transition-colors duration-500">
            Questions, support, or partnership? Reach out to us and we’ll get back to you promptly.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form (Framer Motion removed) */}
          <form
            onSubmit={handleSubmit}
            className={`
              p-6 ms:p-10 col-span-3 rounded-3xl shadow-xl flex flex-col gap-3 transition-colors duration-500
              /* Form Container Theming (Glassmorphism) */
              bg-lightBg/60 backdrop-blur-xl border border-textLight/10
              dark:bg-darkBg/60 dark:border-textDark/10
            `}
          >
            {/* Input fields using inputClasses */}
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className={inputClasses} />
            <input type="number" name="number" placeholder="Phone Number" value={form.number} onChange={handleChange} className={inputClasses} />
            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} className={inputClasses} />
            <input type="text" name="subject" placeholder="Your Subject" value={form.subject} onChange={handleChange} className={inputClasses} />
            <textarea name="message" placeholder="Your Message" rows={4} value={form.message} onChange={handleChange} className={inputClasses} />
            
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-full w-[250px] sm:w-[300px] mx-auto bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Contact Info (Framer Motion removed) */}
          <div
            className="flex flex-col col-span-2 gap-8"
          >
            {/* Mail Info Card */}
            <div className={infoCardClasses}>
              <FiMail className="text-primary text-3xl mt-1" />
              <div>
                <h4 className="font-semibold text-xl text-textLight dark:text-textDark">Email</h4>
                <p className="text-textLight/80 dark:text-textDark/80">{process.env.NEXT_PUBLIC_EMAIL} </p>
              </div>
            </div>
            {/* Phone Info Card */}
            <div className={infoCardClasses}>
              <FiPhone className="text-primary text-3xl mt-1" />
              <div>
                <h4 className="font-semibold text-xl text-textLight dark:text-textDark">Phone</h4>
                <p className="text-textLight/80 dark:text-textDark/80">{process.env.NEXT_PUBLIC_NUMBER}</p>
              </div>
            </div>
            {/* Address Info Card */}
            <div className={infoCardClasses}>
              <FiMapPin className="text-primary text-3xl mt-1" />
              <div>
                <h4 className="font-semibold text-xl text-textLight dark:text-textDark">Address</h4>
                <p className="text-textLight/80 dark:text-textDark/80">Noida Sector 121, India - 201309</p>
              </div>
            </div>

            {/* Social Media (Theming) */}
            <div className="flex items-center justify-start gap-4 text-textLight dark:text-textDark">
              <FiFacebook className="text-2xl hover:text-primary transition cursor-pointer" />
              <FiTwitter className="text-2xl hover:text-primary transition cursor-pointer" />
              <FiLinkedin className="text-2xl hover:text-primary transition cursor-pointer" />
              <FiInstagram className="text-2xl hover:text-primary transition cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Google Map (No major change needed) */}
        <div className="rounded-3xl overflow-hidden shadow-lg mt-16 h-72">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31107.45821516984!2d77.594566!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670f34e6e3f%3A0x849c3a3e0f713c4d!2sBangalore!5e0!3m2!1sen!2sin!4v1695042293730!5m2!1sen!2sin"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            title="Loop Axis Office Map"
          ></iframe>
        </div>
      </div>

      <NewsletterSection />
    </section>
  );
}