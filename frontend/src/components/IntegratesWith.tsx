"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import {
  SiGoogle, SiSlack, SiStripe, SiZapier, SiNotion,
  SiShopify, SiAmazon, SiGithub, SiFigma,
  SiTrello, SiAsana, SiDropbox, SiMailchimp, SiHubspot,
  SiSalesforce, SiWordpress, SiClickup, SiJira, SiZendesk,
  SiAirtable, SiTwilio, SiPaypal, SiDiscord, SiMeta,
  SiLinkedin, SiInstagram, SiYoutube
} from "react-icons/si"

const defaultApps = [
  { icon: <SiGoogle size={42} />, name: "Google" },
  { icon: <SiSlack size={42} />, name: "Slack" },
  { icon: <SiStripe size={42} />, name: "Stripe" },
  { icon: <SiZapier size={42} />, name: "Zapier" },
  { icon: <SiNotion size={42} />, name: "Notion" },
  { icon: <SiShopify size={42} />, name: "Shopify" },
  { icon: <SiAmazon size={42} />, name: "Amazon" },
  { icon: <SiGithub size={42} />, name: "Github" },
  { icon: <SiFigma size={42} />, name: "Figma" },
  { icon: <SiTrello size={42} />, name: "Trello" },
  { icon: <SiAsana size={42} />, name: "Asana" },
  { icon: <SiDropbox size={42} />, name: "Dropbox" },
  { icon: <SiMailchimp size={42} />, name: "Mailchimp" },
  { icon: <SiHubspot size={42} />, name: "Hubspot" },
  { icon: <SiSalesforce size={42} />, name: "Salesforce" },
  { icon: <SiWordpress size={42} />, name: "WordPress" },
  { icon: <SiClickup size={42} />, name: "ClickUp" },
  { icon: <SiJira size={42} />, name: "Jira" },
  { icon: <SiZendesk size={42} />, name: "Zendesk" },
  { icon: <SiAirtable size={42} />, name: "Airtable" },
  { icon: <SiTwilio size={42} />, name: "Twilio" },
  { icon: <SiPaypal size={42} />, name: "PayPal" },
  { icon: <SiDiscord size={42} />, name: "Discord" },
  { icon: <SiMeta size={42} />, name: "Meta" },
  { icon: <SiLinkedin size={42} />, name: "LinkedIn" },
  { icon: <SiInstagram size={42} />, name: "Instagram" },
  { icon: <SiYoutube size={42} />, name: "YouTube" },
 
]

// Duplicate for smooth continuous density
const extendedApps = [...defaultApps,]

export default function AppIntegrationSlider() {
  return (
    <section className="relative pt-28 px-4 sm:px-6 overflow-hidden">

      {/* Soft Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent dark:via-primary/10" />

      <div className="max-w-7xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Seamless Integrations
        </h2>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Connect with 100+ powerful tools and platforms to automate everything effortlessly.
        </p>

        {/* Slider */}
        <div className="relative mt-20 ">

         

          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={4000}
            loop
            slidesPerView={3}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 5 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 8 },
            }}
          >
            {extendedApps.map((app, i) => (
              <SwiperSlide key={i}>
                <div
                  className="
                    group flex flex-col items-center justify-center
                    h-28 rounded-2xl
                    border bg-white/70 dark:bg-neutral-900/70
                    backdrop-blur-md shadow-sm
                    border-gray-200 dark:border-neutral-800
                    transition-all duration-300
                    hover:shadow-lg
                  "
                >
                  <div className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-300">
                    {app.icon}
                  </div>

                  {/* <span className="text-xs mt-2 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition">
                    {app.name}
                  </span> */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="h-4" /> 

          <Swiper
            dir='rtl'
            modules={[Autoplay]}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={4000}
            loop
            slidesPerView={3}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 5 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 8 },
            }}
          >
            {extendedApps.map((app, i) => (
              <SwiperSlide key={i}>
                <div
                  className="
                    group flex flex-col items-center justify-center
                    h-28 rounded-2xl
                    border bg-white/70 dark:bg-neutral-900/70
                    backdrop-blur-md shadow-sm
                    border-gray-200 dark:border-neutral-800
                    transition-all duration-300
                    hover:shadow-lg 
                  "
                >
                  <div className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-300">
                    {app.icon}
                  </div>

                  {/* <span className="text-xs mt-2 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition">
                    {app.name}
                  </span> */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  )
}