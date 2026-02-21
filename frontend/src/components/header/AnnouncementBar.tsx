"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiX, FiZap } from "react-icons/fi";

const COOKIE_NAME = "announcement_closed";
const EXPIRE_DAYS = 5;

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ").map(c => c.split("="));
    const cookieExists = cookies.find(c => c[0] === COOKIE_NAME);

    if (!cookieExists) {
      setVisible(true);
    }
  }, []);

  const closeBar = () => {
    const maxAge = EXPIRE_DAYS * 24 * 60 * 60; // seconds
    document.cookie = `${COOKIE_NAME}=true; max-age=${maxAge}; path=/`;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="
         sticky top-0 left-0 w-full z-40
        bg-gradient-to-r from-primary to-secondary
        text-white
        px-4 py-2
        flex items-center justify-center
        gap-3
        text-sm sm:text-base
      "
    >
      <FiZap className="text-yellow-300" />

      <span className="text-center">
        🚀 <strong>New:</strong> Automate WhatsApp leads & follow-ups in minutes.
      </span>

      <Link
        href="/services"
        className="ml-2 underline font-semibold hover:text-yellow-200 transition"
      >
        Try Free
      </Link>

      <button
        onClick={closeBar}
        className="
          absolute right-4
          p-1 rounded-full
          hover:bg-white/20 transition
        "
        aria-label="Close announcement"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}
