"use client"

// Framer Motion removed from imports
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"

import Image from "next/image"

const testimonials = [
  { name: "Amit Kumar", text: "taskzeno saved us 20+ hrs/week. Insane ROI!", image: "/client.jpg" },
  { name: "Sarah Lee", text: "Email campaigns are now fully automated.", image: "/client.jpg" },
  { name: "Rajesh Singh", text: "Shopify orders sync without errors.", image: "/client.jpg" },
  { name: "Priya Sharma", text: "Seamless integration with all our tools.", image: "/client.jpg" },
  { name: "John Doe", text: "Boosted team productivity like never before.", image: "/client.jpg" },
]

export default function Testimonials() {
  return (
    <section className="pt-28 px-4 sm:px-6 relative max-w-7xl mx-auto">
      {/* H2 Theming */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold 
        text-textLight dark:text-textDark transition-colors duration-500">
        Hear From Our Happy Clients
      </h2>

      <p
        className="mt-6 text-lg max-w-2xl transition-colors duration-500
        text-textLight/70 dark:text-textDark/70"
      >
        Discover how businesses are saving time, boosting productivity, and scaling effortlessly with taskzeno.
      </p>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3500 }}
        loop
        slidesPerView={1}
        spaceBetween={10}

        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 5 },
          768: { slidesPerView: 3, spaceBetween: 5 },
          1024: { slidesPerView: 4, spaceBetween: 5 },
        }}
        className="mt-12 "
      >
        {testimonials.map((t, i) => (
         <SwiperSlide key={i} className="p-3">
   <div
    className="p-6 rounded-2xl flex flex-col items-center text-center 
    bg-lightBg dark:bg-darkBg 
    border border-black/5 dark:border-white/10
     transition-all duration-300"
  >
    
    <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
      <Image
        src={t.image}
        alt={t.name}
        width={80}
        height={80}
        className="object-cover w-full h-full"
      />
    </div>

    {/* Text */}
    <p className="italic text-base 
      text-textLight/80 dark:text-textDark/80">
      “{t.text}”
    </p>

    {/* Name */}
    <h4 className="mt-4 text-sm font-thin
      text-textLight dark:text-textDark">
      {t.name}
    </h4>
  </div>
</SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}