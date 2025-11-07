"use client"

import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"

import Image from "next/image"

const testimonials = [
  { name: "Amit Kumar", text: "Loop Axis  saved us 20+ hrs/week. Insane ROI!", image: "/client.jpg" },
  { name: "Sarah Lee", text: "Email campaigns are now fully automated.", image: "/client.jpg" },
  { name: "Rajesh Singh", text: "Shopify orders sync without errors.", image: "/client.jpg" },
  { name: "Priya Sharma", text: "Seamless integration with all our tools.", image: "/client.jpg" },
  { name: "John Doe", text: "Boosted team productivity like never before.", image: "/client.jpg" },
]

export default function Testimonials() {
  return (
    <section className="pt-28 px-4 sm:px-6 relative max-w-7xl  mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold  text-white">
        Hear From Our Happy Clients
      </h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-6 text-lg text-white/70 max-w-2xl"
      >
        Discover how businesses are saving time, boosting productivity, and scaling effortlessly with Loop Axis .
      </motion.p>

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
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative bg-white/10 backdrop-blur-xl p-10 rounded-3xl  flex flex-col items-center text-center hover:scale-101 transition-transform duration-300"
            >
              {/* Client Image */}
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-gradient-to-r from-primary to-secondary">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>

              <p className="italic font-normal text-white/80 text-lg md:text-xl max-w-xl">
                “{t.text}”
              </p>
              <h4 className="mt-6 font-semibold text-white text-lg md:text-xl">
                {t.name}
              </h4>
              <div className="absolute top-4 w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
