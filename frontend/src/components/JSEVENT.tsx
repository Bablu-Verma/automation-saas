"use client"

import { useEffect } from "react"

export default function JSEVENT() {
  useEffect(() => {
    const cursor = document.querySelector(".cursor") as HTMLElement
    const dot = document.querySelector(".cursor-dot") as HTMLElement

    const moveCursor = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e
      if (cursor) cursor.style.transform = `translate(${x}px, ${y}px)`
      if (dot) dot.style.transform = `translate(${x}px, ${y}px)`
    }

    window.addEventListener("mousemove", moveCursor)
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [])




  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-dot"></div>
    </>
  )
}
