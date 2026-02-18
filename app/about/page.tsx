import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hammer, Target, Users, Zap } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About StudyForge - Build Your Academic Success",
  description:
    "Learn about StudyForge's mission to help students forge their path to academic excellence with powerful study planning, flashcards, and progress tracking tools.",
  keywords: [
    "about studyforge",
    "student study app",
    "study planning tools",
    "educational technology",
    "student productivity platform",
  ],
  openGraph: {
    title: "About StudyForge - Build Your Academic Success",
    description: "Learn about StudyForge's mission to help students forge their path to academic excellence.",
    url: "https://www.study-forge.app/about",
    type: "website",
  },
  alternates: {
    canonical: "https://www.study-forge.app/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 border-4 border-primary/20 rounded-none p-8 bg-gradient-to-br from-primary/5 to-transparent">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6 uppercase tracking-tight">
              About StudyForge
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-semibold">
              We're on a mission to help students forge their path to academic excellence through powerful study tools
              and strategic planning.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16 border-4 border-primary/30 rounded-none bg-card p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Our Mission</h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4 font-medium">
              StudyForge was created to empower students to build their academic success through structured planning and
              effective study strategies. We believe that with the right tools and disciplined approach, every student
              can forge their path to excellence.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              Our platform combines AI-powered study plan generation with task management and flashcard tools. We provide
              the foundational tools students need to organize their learning and track progress.
            </p>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-8 text-center uppercase border-b-4 border-primary/30 pb-4">
              Our Core Values
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border-4 border-primary/20 rounded-none bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="mb-4 flex h-14 w-14 items-center justify-center border-4 border-primary/30 bg-primary/10">
                  <Hammer className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-black text-foreground uppercase">Build & Craft</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  We help students build strong study habits and craft effective learning strategies through structured
                  planning and consistent practice.
                </p>
              </div>

              <div className="border-4 border-primary/20 rounded-none bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="mb-4 flex h-14 w-14 items-center justify-center border-4 border-primary/30 bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-black text-foreground uppercase">Student-Focused</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Every feature is designed with students in mind, focusing on practical solutions that deliver real
                  results for academic achievement.
                </p>
              </div>

              <div className="border-4 border-primary/20 rounded-none bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="mb-4 flex h-14 w-14 items-center justify-center border-4 border-primary/30 bg-primary/10">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-black text-foreground uppercase">Efficiency</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  We help students maximize their study time with smart planning, progress tracking, and data-driven
                  insights that show what works.
                </p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="border-4 border-primary/30 rounded-none bg-card p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-6 uppercase">Our Story</h2>
            <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              <p>
                StudyForge was born from the recognition that students needed more than just note-taking apps or simple
                to-do lists. They needed a comprehensive platform to forge their academic success through strategic
                planning and effective study methods.
              </p>
              <p>
                By combining AI study planning, flashcard systems, and basic progress tracking with task management, we've
                created a platform that helps students build the foundation for academic success.
              </p>
              <p>
                Today, StudyForge helps students organize their study schedules, create and review flashcards, track their
                progress with charts and metrics, and build consistent study habits.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
