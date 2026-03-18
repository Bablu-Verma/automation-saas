"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { useHomeServices } from "@/hooks/useHomeServices";
import { useRouter } from "next/navigation";
const COOKIE_NAME = "announcement_closed";
const EXPIRE_DAYS = 5;

export default function AnnouncementBar() {
  const { services, loading } = useHomeServices();
 const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [randomService, setRandomService] = useState<any>(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ").map((c) => c.split("="));
    const cookieExists = cookies.find((c) => c[0] === COOKIE_NAME);

    if (!cookieExists) setVisible(true);
  }, []);

  useEffect(() => {
    if (services && services.length > 0) {
      const randomIndex = Math.floor(Math.random() * services.length);
      setRandomService(services[randomIndex]);
    }
  }, [services]);

 const hideBar = () => {
  const maxAge = EXPIRE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=true; max-age=${maxAge}; path=/`;
  setVisible(false);
};

  if (!visible || loading || !randomService) return null;

  const basePlan = randomService?.pricingPlans?.find(
    (p: any) => p.planName === "BASE"
  );

  const trialPlan = randomService?.pricingPlans?.find(
    (p: any) => p.planName === "TRIAL"
  );

  const price = basePlan?.monthlyPrice || 0;
  const discount = basePlan?.discountPercent || 0;

  const finalPrice =
    discount > 0
      ? Math.round(price - (price * discount) / 100)
      : price;

      const handleView = () => {
  hideBar();
  router.push(`/services/view?id=${randomService.slug}`);
};


  return (
    <div className="fixed bottom-28  right-0 md:right-2 transform  z-40 w-full max-w-md px-4">

      <div className="max-w-md relative">

        {/* Close Button */}
        <button
          onClick={hideBar}
          className="
  absolute -top-2 -left-2  p-1 rounded-full shadow transition z-50
  bg-white text-gray-700
  dark:bg-gray-800 dark:text-white
  hover:scale-110
"
          aria-label="Close announcement"
        >
          <FiX size={14} />
        </button>

        {/* Card */}
        <div className="
    rounded-2xl p-4 flex flex-col items-start gap-4 shadow-xl border
    
    
    bg-white text-gray-900 border-gray-200
    
  
    dark:bg-white/10 dark:text-white dark:border-white/20 dark:backdrop-blur-xl
  ">

          {/* Image */}
          <div className="relative w-full h-40 rounded-xl overflow-hidden shrink-0">
            <Image
              src={randomService.serviceImage || "/placeholder.png"}
              alt={randomService.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1">

            <p className="text-xs uppercase tracking-wider opacity-80">
              🔥 Featured Service
            </p>

            <h4 className="font-semibold text-base capitalize">
              {randomService.name}
            </h4>

            <div className="flex items-center gap-2 text-sm mt-1">

              {discount > 0 && (
                <>
                  <span className="line-through opacity-60">
                    ₹{price}
                  </span>
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {discount}% OFF
                  </span>
                </>
              )}

              <span className="font-bold text-yellow-300">
                ₹{finalPrice}/Month
              </span>

              <span className="opacity-80 hidden sm:inline">
                • {trialPlan?.validityDays || 7} days free trial
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleView}
            className="px-8 py-2 bg-white text-primary font-semibold rounded-full text-sm hover:scale-105 transition shadow-md"
          >
            View
          </button>

        </div>
      </div>
    </div>
  );
}