"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function FloatingShapes() {
  const shapesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shapesRef.current) return

    const shapes = shapesRef.current.querySelectorAll(".floating-shape")

    shapes.forEach((shape, index) => {
      // Random floating animation with GSAP
      gsap.to(shape, {
        y: `${gsap.utils.random(-30, 30)}`,
        x: `${gsap.utils.random(-20, 20)}`,
        rotation: gsap.utils.random(-15, 15),
        duration: gsap.utils.random(4, 7),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2,
      })

      // Subtle scale pulse
      gsap.to(shape, {
        scale: gsap.utils.random(0.95, 1.05),
        duration: gsap.utils.random(3, 5),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.3,
      })
    })
  }, [])

  return (
    <div ref={shapesRef} className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Top left - Green circle */}
      <div
        className="floating-shape absolute left-[5%] top-[10%] h-32 w-32 rounded-full bg-green-200/40 blur-2xl md:h-48 md:w-48"
        style={{ willChange: "transform" }}
      />

      {/* Top right - Emerald circle */}
      <div
        className="floating-shape absolute right-[8%] top-[15%] h-24 w-24 rounded-full bg-emerald-200/40 blur-xl md:h-40 md:w-40"
        style={{ willChange: "transform" }}
      />

      {/* Middle left - Teal square */}
      <div
        className="floating-shape absolute left-[10%] top-[45%] h-28 w-28 rounded-3xl bg-teal-200/40 blur-2xl md:h-44 md:w-44"
        style={{ willChange: "transform" }}
      />

      {/* Middle right - Lime circle */}
      <div
        className="floating-shape absolute right-[5%] top-[50%] h-36 w-36 rounded-full bg-lime-200/30 blur-2xl md:h-52 md:w-52"
        style={{ willChange: "transform" }}
      />

      {/* Bottom left - Cyan square */}
      <div
        className="floating-shape absolute bottom-[20%] left-[15%] h-32 w-32 rounded-3xl bg-cyan-200/40 blur-xl md:h-48 md:w-48"
        style={{ willChange: "transform" }}
      />

      {/* Bottom right - Teal circle */}
      <div
        className="floating-shape absolute bottom-[15%] right-[12%] h-28 w-28 rounded-full bg-teal-300/40 blur-2xl md:h-44 md:w-44"
        style={{ willChange: "transform" }}
      />

      {/* Additional small shapes for depth */}
      <div
        className="floating-shape absolute left-[40%] top-[25%] h-16 w-16 rounded-full bg-green-300/30 blur-xl md:h-24 md:w-24"
        style={{ willChange: "transform" }}
      />

      <div
        className="floating-shape absolute bottom-[35%] right-[30%] h-20 w-20 rounded-2xl bg-emerald-300/30 blur-xl md:h-32 md:w-32"
        style={{ willChange: "transform" }}
      />
    </div>
  )
}
