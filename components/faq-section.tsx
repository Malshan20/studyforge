"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Hammer } from "lucide-react"

const faqs = [
  {
    question: "How does StudyForge help me build better study habits?",
    answer:
      "StudyForge provides powerful tools to craft your academic success: AI-powered study planners that adapt to your schedule, smart flashcards with spaced repetition for lasting retention, and comprehensive analytics to track your progress. Every feature is designed to help you forge stronger study habits.",
  },
  {
    question: "What makes StudyForge different from other study apps?",
    answer:
      "StudyForge combines proven learning methodologies with cutting-edge AI technology. Our platform focuses on three core pillars: intelligent planning, active recall through flashcards, and data-driven insights. We help you build knowledge systematically, not just memorize temporarily.",
  },
  {
    question: "Can I use StudyForge for any subject?",
    answer:
      "StudyForge is subject-agnostic and works for any field of study. Whether you're mastering mathematics, languages, sciences, or humanities, our tools adapt to your content. Create custom flashcard decks, plan study sessions, and track progress across all your subjects.",
  },
  {
    question: "Is StudyForge free to use?",
    answer:
      "Yes! StudyForge offers a free Apprentice plan with access to core features including study planning, flashcard creation, and basic analytics. For students who want unlimited features and advanced AI capabilities, we offer the Master plan at an affordable price.",
  },
  {
    question: "How does the AI study planner work?",
    answer:
      "Our AI analyzes your study goals, available time, and learning patterns to generate optimized study schedules. It considers factors like exam dates, subject difficulty, and your personal productivity patterns to create a realistic, achievable plan that maximizes your learning efficiency.",
  },
  {
    question: "What is spaced repetition and why is it important?",
    answer:
      "Spaced repetition is a scientifically-proven learning technique where you review information at increasing intervals. StudyForge's flashcard system automatically schedules reviews based on how well you know each card, ensuring you focus on what needs reinforcement while maintaining long-term retention.",
  },
  {
    question: "Can I track my progress over time?",
    answer:
      "Yes! StudyForge provides detailed analytics showing your study hours, subject distribution, flashcard mastery rates, and productivity trends. Visual charts and insights help you understand your learning patterns and make data-driven decisions to improve your study strategy.",
  },
  {
    question: "Does StudyForge work on mobile devices?",
    answer:
      "StudyForge is fully responsive and works seamlessly across all devices. Study on your desktop at home, review flashcards on your phone during commute, and check your planner on your tablet. Your progress syncs automatically across all devices.",
  },
]

export function FAQSection() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hammer className="h-10 w-10 text-primary" />
            <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Common Questions</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about forging your path to academic excellence
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-2 border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-bold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* JSON-LD structured data for FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  )
}
