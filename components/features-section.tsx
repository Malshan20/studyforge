"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Layers, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "AI Study Planner",
    description:
      "Generate weekly study plans with AI assistance. Organize your tasks, set goals, and use the Pomodoro timer to stay focused on your academic journey.",
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  {
    icon: Layers,
    title: "Flashcard System",
    description:
      "Create flashcards manually or generate them with AI. Study with standard review modes and quiz yourself to master key concepts.",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Monitor your study sessions and task completion. View basic charts showing study hours, subject breakdown, and track your overall progress.",
    color: "text-teal-700",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-200",
  },
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative bg-gradient-to-b from-green-50/30 to-background py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 px-5 py-2.5 font-bold uppercase tracking-wide"
            >
              <span className="text-sm text-green-900">⚒️ Tools</span>
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-black tracking-tighter text-foreground md:text-5xl lg:text-6xl"
          >
            Forge Your Learning{" "}
            <span className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 bg-clip-text text-transparent">
              Arsenal
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-balance text-xl font-medium text-muted-foreground"
          >
            Powerful AI-driven tools crafted to help you build knowledge, master subjects, and achieve academic
            excellence.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.15 }}
            >
              <Card
                className={`group relative h-full overflow-hidden border-2 ${feature.borderColor} transition-all duration-300 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/10`}
              >
                <CardContent className="p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <div
                      className={`rounded-xl ${feature.bgColor} border-2 ${feature.borderColor} p-4 transition-transform group-hover:scale-110`}
                    >
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
