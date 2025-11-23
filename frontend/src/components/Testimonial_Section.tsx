"use client"

// Framer Motion removed from imports
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"

import Image from "next/image"

const testimonials = [
  { name: "Amit Kumar", text: "Go Automat Work saved us 20+ hrs/week. Insane ROI!", image: "/client.jpg" },
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

      {/* Paragraph Theming (Framer Motion removed) */}
      <p
        className="mt-6 text-lg max-w-2xl transition-colors duration-500
        text-textLight/70 dark:text-textDark/70"
      >
        Discover how businesses are saving time, boosting productivity, and scaling effortlessly with Go Automat Work.
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
          <SwiperSlide key={i} className="p-2">
            {/* Card Theming (Framer Motion removed, using CSS for scale effect) */}
            <div
              className="relative p-10 rounded-3xl flex flex-col items-center text-center 
                transition-all duration-300 shadow-md
                
                /* Light Mode Glassmorphism */
                bg-lightBg/60 backdrop-blur-xl border border-textLight/10 
                
                /* Dark Mode Glassmorphism */
                dark:bg-darkBg/60 dark:border-textDark/10
              "
            >
              {/* Client Image Border (Note: Tailwind doesn't have native border-gradient, so we use a simple border) */}
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary shadow-lg">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Text Theming */}
              <p className="italic font-normal text-lg md:text-xl max-w-xl 
                text-textLight/90 dark:text-textDark/90 line-clamp-3">
                “{t.text}”
              </p>
              
              {/* Name Theming */}
              <h4 className="mt-6 font-semibold text-lg md:text-xl 
                text-textLight dark:text-textDark">
                {t.name}
              </h4>
              
              {/* Decorative Bar (Gradient remains) */}
              <div className="absolute top-4 w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}