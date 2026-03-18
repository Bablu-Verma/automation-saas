"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"

const useCases = [
  {
    industry: "Marketing",
    title: "AI Lead Conversion",
    results: [
      "Achieve up to a 32% increase in lead-to-customer conversion with intelligent automation",
      "Automatically engage and nurture leads through personalized, multi-step follow-up sequences",
      "Leverage real-time lead scoring to prioritize high-intent prospects and maximize conversions"
    ],
    image: "/usecases/markting.png",
    accent: "#E6521F",
    tag: "🎯"
  },
  {
    industry: "E-commerce",
    title: "Order Automation",
    results: [
      "Reduce manual operational workload by up to 40% with end-to-end order automation",
      "Deliver instant order confirmations to enhance customer trust and satisfaction",
      "Keep customers informed with automated, real-time shipping and delivery notifications"
    ],
    image: "/usecases/brands.png",
    accent: "#7C3AED",
    tag: "🛒"
  },
  {
    industry: "Marketing",
    title: "Campaign Intelligence",
    results: [
      "Maximize campaign ROI with data-driven automation and performance optimization",
      "Segment audiences intelligently to deliver highly targeted and relevant messaging",
      "Create personalized email workflows that drive engagement and long-term retention"
    ],
    image: "/usecases/markting.png",
    accent: "#0EA5E9",
    tag: "📊"
  },
  {
    industry: "E-commerce",
    title: "Inventory Sync",
    results: [
      "Maintain real-time inventory synchronization across multiple sales channels seamlessly",
      "Accelerate checkout experiences with optimized and efficient backend processing",
      "Recover lost revenue with automated abandoned cart tracking and re-engagement flows"
    ],
    image: "/usecases/brands.png",
    accent: "#10B981",
    tag: "🔄"
  },
  {
    industry: "SaaS",
    title: "Lifecycle Automation",
    results: [
      "Speed up user onboarding by up to 50% with guided and automated onboarding journeys",
      "Automatically segment users based on behavior to deliver more relevant experiences",
      "Boost feature adoption with timely reminders, nudges, and contextual messaging"
    ],
    image: "/usecases/saas.png",
    accent: "#F59E0B",
    tag: "🚀"
  },
  {
    industry: "Sales",
    title: "Pipeline Automation",
    results: [
      "Close deals up to 28% faster with streamlined and automated sales workflows",
      "Automatically assign and distribute leads to the right sales reps in real time",
      "Ensure no opportunity is missed with smart follow-up reminders and activity tracking"
    ],
    image: "/usecases/sales.png",
    accent: "#EC4899",
    tag: "💼"
  }
];

export default function UseCaseSlider() {
  return (
    <section className="pt-28 overflow-hidden" >

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-14">
        <p className="text-sm tracking-widest text-primary uppercase font-semibold mb-3">
          Use Cases
        </p>
        <h2 className="text-4xl font-bold">
          AI Workflows Powering Modern Teams
        </h2>
        <p className="text-gray-500 mt-4 max-w-xl">
          Explore how businesses automate operations with Taskzeno
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Slider — Row 1: Left to Right */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: false }}
          speed={5000}
          loop={true}
          grabCursor={true}
          slidesPerView={1.2}
          spaceBetween={20}
          breakpoints={{
            480: { slidesPerView: 1.1 },
            640: { slidesPerView: 1.4 },
            768: { slidesPerView: 1.8 },
            1024: { slidesPerView: 2.1 },

          }}
          className="mb-5"
        >
          {[...useCases, ...useCases].map((app, i) => (
            <SwiperSlide key={i} className="py-2 px-1">
              <UseCard app={app} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Slider — Row 2: Right to Left */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: true }}
          speed={5000}
          loop={true}
          grabCursor={true}
          slidesPerView={1.2}
          spaceBetween={20}
          breakpoints={{
            480: { slidesPerView: 1.1 },
            640: { slidesPerView: 1.4 },
            768: { slidesPerView: 1.8 },
            1024: { slidesPerView: 2.1 },
          }}
        >
          {[...useCases].reverse().concat([...useCases].reverse()).map((app, i) => (
            <SwiperSlide key={i} className="py-2 px-1">
              <UseCard app={app} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  )
}

function UseCard({ app }: { app: typeof useCases[0] }) {
  return (
    <div
      className="relative group rounded-2xl overflow-hidden
                border bg-white shadow-sm
                dark:bg-neutral-900 dark:border-neutral-800
                transition-all duration-300
                hover:-translate-y-2 "
    >
      {/* Glowing top accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${app.accent}, ${app.accent}88)` }}
      />

      <div className="p-5">

        {/* Image with subtle overlay */}
        <div className="relative rounded-xl overflow-hidden mb-4" style={{ height: "140px" }}>
          <Image
            src={app.image}
            alt={app.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${app.accent}22 0%, transparent 60%)` }}
          />
          {/* Tag badge */}
          <span
            className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: `${app.accent}22`,
              color: app.accent,
              border: `1px solid ${app.accent}44`,
              backdropFilter: "blur(8px)"
            }}
          >
            {app.tag} {app.industry}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold mb-3 dark:text-white text-gray-900 group-hover:text-primary transition-colors">
          {app.title}
        </h3>

        {/* Results list */}
        <ul className="space-y-2">
          {app.results.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span
                className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full"
                style={{ background: app.accent }}
              />
              {point}
            </li>
          ))}
        </ul>

        {/* Bottom glow line on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${app.accent}, transparent)` }}
        />

      </div>
    </div>
  )
}