"use client"

import { motion } from "framer-motion"
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from "react-icons/fi"
import NewsletterSection from "@/components/Newsletter"

export default function ContactPage() {
    return (
        <section className="relative min-h-screen pt-28 overflow-hidden">
            {/* Background shapes */}
            <div className="absolute -top-32 -left-32 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-secondary/20 rounded-full blur-3xl -z-10"></div>


            <div className="max-w-7xl m-auto px-6">
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
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl flex flex-col gap-6"
                    >
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <textarea
                            placeholder="Your Message"
                            rows={6}
                            className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:from-secondary hover:to-primary"
                        >
                            Send Message
                        </button>
                    </motion.form>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-8"
                    >
                        {/* Contact Cards */}
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-lg flex items-start gap-4">
                            <FiMail className="text-primary text-3xl mt-1" />
                            <div>
                                <h4 className="font-semibold text-xl text-white">Email</h4>
                                <p className="text-white/80">support@autoflow.com</p>
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
                                <p className="text-white/80">123 AutoFlow Street, Bangalore, India</p>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="flex items-center justify-start gap-4">
                            <FiFacebook className="text-white text-2xl hover:text-primary transition cursor-pointer" />
                            <FiTwitter className="text-white text-2xl hover:text-primary transition cursor-pointer" />
                            <FiLinkedin className="text-white text-2xl hover:text-primary transition cursor-pointer" />
                            <FiInstagram className="text-white text-2xl hover:text-primary transition cursor-pointer" />
                        </div>

                        {/* Map */}

                    </motion.div>
                </div>

                <div className="rounded-3xl overflow-hidden shadow-lg mt-16 h-72">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31107.45821516984!2d77.594566!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670f34e6e3f%3A0x849c3a3e0f713c4d!2sBangalore!5e0!3m2!1sen!2sin!4v1695042293730!5m2!1sen!2sin"
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        title="AutoFlow Office Map"
                    ></iframe>
                </div>
            </div>


            <NewsletterSection />
        </section>
    )
}
