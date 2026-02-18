"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { UserPlus, Calendar, Brain, TrendingUp, Hammer } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Forge",
    description:
      "Sign up in seconds with your email. No credit card required. Start building your academic success immediately with our free Apprentice plan.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Plan Your Path",
    description:
      "Let AI craft your personalized study schedule. Input your goals, deadlines, and available time. Our intelligent planner builds an optimized roadmap to success.",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  {
    number: "03",
    icon: Brain,
    title: "Forge Knowledge",
    description:
      "Create smart flashcards and master them with spaced repetition. Build lasting understanding through active recall. Watch your retention rates soar.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "Monitor your study hours, subject mastery, and productivity trends. Get actionable insights to refine your strategy and maximize learning efficiency.",
    color: "text-lime-600",
    bgColor: "bg-lime-100",
  },
]

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-24 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Hammer className="h-12 w-12 text-primary" />
            <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">How It Works</h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground font-medium"
          >
            Four simple steps to forge your academic excellence
          </motion.p>
        </div>

        <div className="space-y-12 md:space-y-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col items-center gap-8 md:flex-row ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4 inline-block rounded-2xl bg-primary/10 border-2 border-primary/20 px-6 py-3">
                  <span className="text-5xl font-black text-primary">{step.number}</span>
                </div>
                <h3 className="mb-3 text-2xl font-black text-foreground md:text-3xl">{step.title}</h3>
                <p className="text-lg leading-relaxed text-muted-foreground font-medium">{step.description}</p>
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className={`flex h-32 w-32 items-center justify-center rounded-2xl ${step.bgColor} shadow-lg border-4 border-${step.color.replace("text-", "border-")} md:h-40 md:w-40`}
              >
                <step.icon className={`h-16 w-16 ${step.color} md:h-20 md:w-20`} strokeWidth={2.5} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
