"use client"

import Lottie from "lottie-react"

import { FiZap, FiTrendingUp, FiUsers, FiClock } from "react-icons/fi"

import automationAnimation from "../lottie/ai-automation.json"

export default function ParallaxBanner() {


    return (
        <section className="relative h-[450px] md:h-[550px] overflow-hidden">

            {/* Background Layer */}
            <div className="absolute dark:bg-white bg-dark inset-0 -z-10 ">
                {/* Lottie Background Animation */}
                <div className="absolute inset-0 max-w-7xl mx-auto">
                    <Lottie
                        animationData={automationAnimation}
                        loop={true}
                        autoplay={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>


        </section>
    )
}