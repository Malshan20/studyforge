"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Hammer } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!titleRef.current) return

    const words = titleRef.current.querySelectorAll(".word")

    gsap.fromTo(
      words,
      { y: 100, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.2,
      },
    )
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-green-50/30 pt-28 md:pt-36">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px),
                           repeating-linear-gradient(-45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px)`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge
              variant="secondary"
              className="mb-8 gap-2 rounded-lg border-2 border-green-200 bg-green-50 px-5 py-2.5 font-bold uppercase tracking-wide"
            >
              <Hammer className="h-4 w-4 text-green-700" />
              <span className="text-sm text-green-900">Forge Your Success</span>
            </Badge>
          </motion.div>

          <h1
            ref={titleRef}
            className="mb-8 text-5xl font-black leading-[1.1] tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ perspective: "1000px" }}
          >
            <span className="word inline-block">Build</span> <span className="word inline-block">Your</span>
            <br />
            <span className="word inline-block">Academic</span>{" "}
            <span className="word inline-block bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 bg-clip-text text-transparent">
              Excellence
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mb-12 max-w-3xl text-balance text-xl font-medium leading-relaxed text-muted-foreground md:text-2xl"
          >
            Build your study routine with AI-powered tools. Generate study plans, create flashcards, and track your
            progress—a lean foundation for academic success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="flex flex-col gap-5 sm:flex-row"
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="group rounded-lg px-10 py-6 text-lg font-bold shadow-lg shadow-green-500/20 transition-all hover:shadow-xl hover:shadow-green-500/30"
              >
                Start Building Free
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="ml-2 text-xl"
                >
                  →
                </motion.span>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="rounded-lg border-2 bg-transparent px-10 py-6 text-lg font-bold"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3 }}
            className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3"
          >
            {[
              { icon: "⚡", value: "AI", label: "Powered Tools", color: "text-yellow-600" },
              { icon: "🎯", value: "3", label: "Core Features", color: "text-blue-600" },
              { icon: "🚀", value: "Free", label: "To Start", color: "text-green-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.08, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-background p-6 shadow-sm transition-all hover:border-green-300 hover:shadow-md"
              >
                <span className="text-5xl transition-transform group-hover:scale-110">{stat.icon}</span>
                <span className={`text-4xl font-black ${stat.color}`}>{stat.value}</span>
                <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
