"use client"

import { Heart, MessageCircle, Hammer } from "lucide-react"
import { useState } from "react"

interface Testimonial {
  id: string
  username: string
  displayName: string
  avatar: string
  comment: string
  likes: number
  replies: number
  timeAgo: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    username: "@premed_grind",
    displayName: "Sarah",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    comment:
      "The AI study planner is incredible. It helped me organize my MCAT prep and I actually stuck to the schedule. My practice scores went up 15 points! 📚",
    likes: 1847,
    replies: 42,
    timeAgo: "3d ago",
  },
  {
    id: "2",
    username: "@engineeringlife",
    displayName: "Marcus",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    comment:
      "Spaced repetition flashcards are a game changer. I used to cram and forget everything. Now I actually retain what I learn. Went from C+ to A- in thermodynamics",
    likes: 2103,
    replies: 67,
    timeAgo: "1w ago",
  },
  {
    id: "3",
    username: "@lawschool2026",
    displayName: "Priya",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    comment:
      "The analytics feature is so underrated. Seeing my study patterns helped me realize I was wasting time on subjects I already knew. Now I focus on what matters",
    likes: 1567,
    replies: 38,
    timeAgo: "4d ago",
  },
  {
    id: "4",
    username: "@biomed_student",
    displayName: "Alex",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    comment:
      "I was skeptical about another study app but StudyForge actually delivers. The planner keeps me accountable and the flashcards work. My GPA went from 3.1 to 3.7",
    likes: 3421,
    replies: 89,
    timeAgo: "2d ago",
  },
  {
    id: "5",
    username: "@gradschoolbound",
    displayName: "Emma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    comment:
      "Best study app I've used. Clean interface, no distractions, just tools that work. The Master plan is worth every penny for unlimited flashcards",
    likes: 892,
    replies: 24,
    timeAgo: "5d ago",
  },
  {
    id: "6",
    username: "@chem_major",
    displayName: "Jake",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jake",
    comment:
      "The AI planner saved my semester. I was drowning in assignments and exams. It organized everything and I actually finished early for once",
    likes: 1234,
    replies: 31,
    timeAgo: "6d ago",
  },
  {
    id: "7",
    username: "@nursing_student",
    displayName: "Olivia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    comment:
      "Flashcards with spaced repetition are perfect for memorizing medical terms. I can review on my phone between classes. So much better than paper cards",
    likes: 1834,
    replies: 52,
    timeAgo: "1w ago",
  },
  {
    id: "8",
    username: "@cs_undergrad",
    displayName: "Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chen",
    comment:
      "The progress tracking is motivating. Seeing my study hours add up and flashcard mastery increase keeps me going. Finally found an app that helps me stay consistent",
    likes: 2567,
    replies: 71,
    timeAgo: "3d ago",
  },
]

export function TestimonialsSection() {
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())

  const toggleLike = (id: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hammer className="h-10 w-10 text-primary" />
            <h2 className="text-4xl md:text-5xl font-black text-balance">Forged by Students</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Real reviews from students who built their success with StudyForge
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card border-2 border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
            >
              {/* User Info */}
              <div className="flex items-start gap-3 mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.displayName}
                  className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground truncate">{testimonial.displayName}</p>
                    <span className="text-xs text-muted-foreground">{testimonial.timeAgo}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{testimonial.username}</p>
                </div>
              </div>

              {/* Comment */}
              <p className="text-foreground leading-relaxed mb-4 font-medium">{testimonial.comment}</p>

              {/* Actions */}
              <div className="flex items-center gap-6 text-muted-foreground">
                <button
                  onClick={() => toggleLike(testimonial.id)}
                  className="flex items-center gap-2 hover:text-red-500 transition-colors group"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      likedComments.has(testimonial.id)
                        ? "fill-red-500 text-red-500 scale-110"
                        : "group-hover:scale-110"
                    }`}
                  />
                  <span className="text-sm font-bold">
                    {likedComments.has(testimonial.id) ? testimonial.likes + 1 : testimonial.likes}
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">{testimonial.replies}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Updated CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4 font-medium">
            Join thousands of students forging their path to success
          </p>
          <a
            href="/auth/signup"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors border-2 border-primary shadow-lg hover:shadow-xl"
          >
            Start Building Today
          </a>
        </div>
      </div>
    </section>
  )
}
