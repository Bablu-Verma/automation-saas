"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import {
  SiGoogle, SiSlack, SiStripe, SiZapier, SiNotion, 
  SiShopify, SiAmazon, SiGithub, SiFigma,
  SiTrello, SiAsana, SiDropbox, SiMailchimp, SiHubspot,
  SiSalesforce, SiWordpress, SiClickup, SiJira, SiZendesk
} from "react-icons/si"

const defaultApps = [
  { icon: <SiGoogle size={60} />, name: "Google" },
  { icon: <SiSlack size={60} />, name: "Slack" },
  { icon: <SiStripe size={60} />, name: "Stripe" },
  { icon: <SiZapier size={60} />, name: "Zapier" },
  { icon: <SiNotion size={60} />, name: "Notion" },
  { icon: <SiShopify size={60} />, name: "Shopify" },
  { icon: <SiAmazon size={60} />, name: "Amazon" },
  { icon: <SiGithub size={60} />, name: "Github" },
  { icon: <SiFigma size={60} />, name: "Figma" },
  { icon: <SiTrello size={60} />, name: "Trello" },
  { icon: <SiAsana size={60} />, name: "Asana" },
  { icon: <SiDropbox size={60} />, name: "Dropbox" },
  { icon: <SiMailchimp size={60} />, name: "Mailchimp" },
  { icon: <SiHubspot size={60} />, name: "Hubspot" },
  { icon: <SiSalesforce size={60} />, name: "Salesforce" },
  { icon: <SiWordpress size={60} />, name: "WordPress" },
  { icon: <SiClickup size={60} />, name: "ClickUp" },
  { icon: <SiJira size={60} />, name: "Jira" },
  { icon: <SiZendesk size={60} />, name: "Zendesk" },
]

type AppIntegrationSliderProps = {
  apps?: typeof defaultApps
}

export default function AppIntegrationSlider({ apps = defaultApps }: AppIntegrationSliderProps) {
  return (
    <section className="pt-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white">
        Integrates with 100+ Apps
      </h2>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2000 }}
        loop
       
        slidesPerView={3}
        spaceBetween={10}
        breakpoints={{
          640: { slidesPerView: 4, spaceBetween: 14 },
          768: { slidesPerView: 6, spaceBetween: 14 },
          1024: { slidesPerView: 8, spaceBetween: 14 },
        }}
        className="mt-16 "
      >
        {apps.map((app, i) => (
          <SwiperSlide key={i}>
            <div className="flex justify-center text-white items-center p-4 py-10 bg-white/10 rounded-xl shadow-lg hover:text-primary transition-transform duration-300 ">
              {app.icon}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
