"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiCheck, FiX } from "react-icons/fi";

const COOKIE_NAME = "user_cookie_consent";
const EXPIRE_DAYS = 180;

export default function CookieConsentBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ").map(c => c.split("="));
    const consent = cookies.find(c => c[0] === COOKIE_NAME);

    if (!consent) {
      setVisible(true);
    }
  }, []);

  const setConsent = (value: "accepted" | "rejected") => {
    const maxAge = EXPIRE_DAYS * 24 * 60 * 60;

    document.cookie = `${COOKIE_NAME}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="
        fixed bottom-0 left-0 w-full z-50
        bg-lightBg dark:bg-darkBg
        border-t border-textLight/10 dark:border-textDark/10
        px-4 py-4
        backdrop-blur-md
      "
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        
        {/* Text */}
        <p className="text-sm text-textLight/80 dark:text-textDark/80 leading-relaxed">
          🍪 We use cookies to improve your experience, analyze traffic, and personalize content.
          Read our{" "}
          <Link href="/privacy-policy" className="underline text-primary">
            Privacy Policy
          </Link>.
        </p>

        {/* Actions */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => setConsent("rejected")}
            className="
              px-4 py-2 rounded-full
              border border-textLight/20 dark:border-textDark/20
              text-textLight dark:text-textDark
              hover:bg-primary/10 transition
              flex items-center gap-2
            "
          >
            <FiX />
            Reject
          </button>

          <button
            onClick={() => setConsent("accepted")}
            className="
              px-5 py-2 rounded-full
              bg-gradient-to-r from-primary to-secondary
              text-white font-semibold
              hover:scale-105 transition
              flex items-center gap-2
            "
          >
            <FiCheck />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
