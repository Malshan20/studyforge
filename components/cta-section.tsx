"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Hammer } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true })

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-500 px-8 py-16 text-center shadow-2xl border-4 border-emerald-700 md:px-16 md:py-24"
        >
          {/* Decorative elements */}
          <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 backdrop-blur-sm border-2 border-white/30">
              <Hammer className="h-6 w-6 text-white" />
              <span className="text-sm font-bold text-white">Empower your study with AI-powered tools</span>
            </div>

            <h2 className="mb-6 text-4xl font-black text-white md:text-5xl lg:text-6xl">
              Ready to Forge
              <br />
              Your Success?
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-balance text-lg text-white/95 md:text-xl font-medium">
              Start building your academic excellence today. No credit card required. Begin your journey now.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup" className="flex items-center gap-2">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-xl px-8 text-base font-black border-2 border-white shadow-lg"
              >
                Start Building Free
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.span>
              </Button>
              </Link>
              <Link href="/#features" className="flex items-center gap-2">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-2 border-white bg-transparent px-8 text-base font-black text-white hover:bg-white hover:text-emerald-600"
              >
                View Features
              </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/90 font-medium">
              ⚒️ Free forever • No credit card • Start in 30 seconds
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
