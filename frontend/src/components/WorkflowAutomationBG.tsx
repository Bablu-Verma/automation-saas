"use client"

import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { useEffect, useState } from "react"



export default function WorkflowAutomationBG() {

    const [init, setInit] = useState(false)

    // Particles initialization
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine)
        }).then(() => {
            setInit(true)
        })
    }, [])



    return (
        <>
            {init && (
                <Particles
                    id="tsparticles"
                    className="fixed inset-0 -z-10"
                    options={{
                        fullScreen: false,
                        particles: {
                            number: {
                                value: 45,  // ✅ Slightly more particles
                                density: {
                                    enable: true,
                                    area: 1000,
                                },
                            },
                            color: {
                                value: ["#E6521F", "#131D4F"],
                            },
                            shape: {
                                type: ["circle", "triangle"],
                            },
                            opacity: {
                                value: 0.4,  // ✅ Increased (was 0.25)
                                animation: {
                                    enable: true,
                                    speed: 0.3,  // ✅ Slightly faster fade (was 0.2)
                                    minimumValue: 0.2,  // ✅ Higher minimum (was 0.1)
                                },
                            },
                            size: {
                                value: { min: 2, max: 6 },  // ✅ Slightly bigger (was 2-5)
                            },
                            links: {
                                enable: true,
                                distance: 150,
                                color: "#E6521F",
                                opacity: 0.35,  // ✅ More visible (was 0.2)
                                width: 1.2,  // ✅ Slightly thicker (was 1)
                                triangles: {
                                    enable: true,
                                    color: "#131D4F",
                                    opacity: 0.06,  // ✅ More visible (was 0.03)
                                },
                            },
                            move: {
                                enable: true,
                                speed: 0.5,  // ✅ Same slow speed
                                direction: "none",
                                outModes: {
                                    default: "bounce",
                                },
                                attract: {
                                    enable: true,
                                    rotateX: 600,
                                    rotateY: 1200,
                                },
                            },
                        },
                        interactivity: {
                            events: {
                                onHover: {
                                    enable: true,
                                    mode: "grab",
                                },
                                onClick: {
                                    enable: true,
                                    mode: "push",
                                },
                            },
                            modes: {
                                grab: {
                                    distance: 180,
                                    links: {
                                        opacity: 0.6,  // ✅ More visible on hover (was 0.4)
                                        color: "#E6521F",
                                    },
                                },
                                push: {
                                    quantity: 2,
                                },
                            },
                        },
                        detectRetina: true,
                    }}
                />
            )}
        </>
    )
}